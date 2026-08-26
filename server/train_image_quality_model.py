"""
Image Quality ML Model Trainer for AgriTrack
============================================
Uses image feature extraction (color histograms, texture, shape) 
with scikit-learn RandomForest. NO external AI APIs used.

Features extracted from each crop image:
  - Color histogram (R, G, B percentile stats)
  - HSV color statistics (for ripeness detection)
  - Local Binary Pattern (LBP) texture features
  - Contour-based shape regularity
  - Defect pixel ratio (anomalous dark/discolored regions)

Grade mapping:
  Premium (score >= 85): Deep rich color, uniform texture, no defects
  A       (score >= 70): Good color, minor variations, <5% defects
  B       (score >= 55): Fair color, some texture variation, 5-15% defects
  C       (score < 55):  Poor color, high texture variance, >15% defects
"""

import numpy as np
import pandas as pd
import joblib
import os
import warnings

warnings.filterwarnings('ignore')

# ─── Try to import optional image libraries ──────────────────────────────────
try:
    from skimage.feature import local_binary_pattern
    from skimage import color
    SKIMAGE_AVAILABLE = True
except ImportError:
    SKIMAGE_AVAILABLE = False

os.makedirs('ml_data', exist_ok=True)

# ─── Synthetic Feature Generator ─────────────────────────────────────────────
def _generate_synthetic_features(n=3000):
    """
    Generate synthetic image feature vectors that mimic real crop images.
    Each sample: [r_mean, g_mean, b_mean, r_std, g_std, b_std,
                  h_mean, s_mean, v_mean, lbp_uniformity,
                  defect_ratio, shape_regularity]
    """
    np.random.seed(42)
    data = []

    # Simulate 4 quality levels: Premium, A, B, C
    grade_configs = {
        'Premium': {
            'r': (180, 220, 8),  # mean, max, std – rich saturated color
            'g': (80, 130, 10),
            'b': (30, 70, 8),
            'h_mean': (0.02, 0.08),   # orange-red hue (ripe)
            's_mean': (0.65, 0.85),   # high saturation
            'v_mean': (0.70, 0.90),   # high brightness
            'lbp': (0.80, 0.97),      # high uniformity = smooth texture
            'defect': (0.0, 0.03),    # very few defects
            'shape': (0.88, 0.99),    # very regular shape
            'n': n // 4,
        },
        'A': {
            'r': (155, 195, 12),
            'g': (75, 125, 12),
            'b': (25, 65, 10),
            'h_mean': (0.04, 0.12),
            's_mean': (0.50, 0.70),
            'v_mean': (0.60, 0.80),
            'lbp': (0.65, 0.82),
            'defect': (0.01, 0.05),
            'shape': (0.75, 0.90),
            'n': n // 4,
        },
        'B': {
            'r': (120, 165, 18),
            'g': (90, 140, 15),
            'b': (40, 90, 14),
            'h_mean': (0.08, 0.20),   # yellowing / less ripe
            's_mean': (0.35, 0.55),
            'v_mean': (0.50, 0.70),
            'lbp': (0.48, 0.67),
            'defect': (0.04, 0.14),
            'shape': (0.60, 0.77),
            'n': n // 4,
        },
        'C': {
            'r': (80, 135, 25),
            'g': (85, 140, 20),
            'b': (50, 100, 18),
            'h_mean': (0.15, 0.40),   # dull / brown / overripe
            's_mean': (0.15, 0.40),
            'v_mean': (0.30, 0.55),
            'lbp': (0.22, 0.50),
            'defect': (0.12, 0.35),
            'shape': (0.40, 0.62),
            'n': n - 3 * (n // 4),
        },
    }

    for grade, cfg in grade_configs.items():
        rng = np.random.default_rng(hash(grade) % (2**31))
        num = cfg['n']

        r_mean  = rng.uniform(cfg['r'][0],   cfg['r'][1],   num)
        r_std   = rng.uniform(2,              cfg['r'][2],   num)
        g_mean  = rng.uniform(cfg['g'][0],   cfg['g'][1],   num)
        g_std   = rng.uniform(2,              cfg['g'][2],   num)
        b_mean  = rng.uniform(cfg['b'][0],   cfg['b'][1],   num)
        b_std   = rng.uniform(2,              cfg['b'][2],   num)

        h_mean  = rng.uniform(*cfg['h_mean'], num)
        s_mean  = rng.uniform(*cfg['s_mean'], num)
        v_mean  = rng.uniform(*cfg['v_mean'], num)
        lbp_u   = rng.uniform(*cfg['lbp'],   num)
        defect  = rng.uniform(*cfg['defect'], num)
        shape   = rng.uniform(*cfg['shape'],  num)

        # Derive a continuous quality score (0-100)
        score = (
            (v_mean * 25) +
            (s_mean * 20) +
            (lbp_u  * 20) +
            ((1 - defect) * 20) +
            (shape  * 15)
        ) * (100 / 100)
        score = np.clip(score, 0, 100).round(2)

        for i in range(num):
            data.append([
                round(float(r_mean[i]), 2),
                round(float(g_mean[i]), 2),
                round(float(b_mean[i]), 2),
                round(float(r_std[i]),  2),
                round(float(g_std[i]),  2),
                round(float(b_std[i]),  2),
                round(float(h_mean[i]), 4),
                round(float(s_mean[i]), 4),
                round(float(v_mean[i]), 4),
                round(float(lbp_u[i]),  4),
                round(float(defect[i]), 4),
                round(float(shape[i]),  4),
                grade,
                round(float(score[i]),  2),
            ])

    cols = [
        'r_mean', 'g_mean', 'b_mean',
        'r_std',  'g_std',  'b_std',
        'h_mean', 's_mean', 'v_mean',
        'lbp_uniformity', 'defect_ratio', 'shape_regularity',
        'grade', 'score'
    ]
    df = pd.DataFrame(data, columns=cols).sample(frac=1, random_state=42).reset_index(drop=True)
    return df


# ─── Training ─────────────────────────────────────────────────────────────────
def train_image_quality_model():
    from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, mean_absolute_error
    from sklearn.preprocessing import StandardScaler

    print("─" * 60)
    print("🌿 Training Image Quality ML Model (No AI Required)")
    print("─" * 60)

    df = _generate_synthetic_features(n=4000)
    print(f"  ✔ Generated {len(df)} synthetic samples")
    print(f"  Grade distribution:\n{df['grade'].value_counts().to_string()}")

    FEATURES = [
        'r_mean', 'g_mean', 'b_mean',
        'r_std',  'g_std',  'b_std',
        'h_mean', 's_mean', 'v_mean',
        'lbp_uniformity', 'defect_ratio', 'shape_regularity'
    ]

    X = df[FEATURES]
    y_grade = df['grade']
    y_score = df['score']

    X_train, X_test, yg_train, yg_test, ys_train, ys_test = train_test_split(
        X, y_grade, y_score, test_size=0.2, random_state=42, stratify=y_grade
    )

    # ── Scaler ────────────────────────────────────────────────────────────────
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    # ── Grade Classifier ──────────────────────────────────────────────────────
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=None,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'
    )
    clf.fit(X_train_s, yg_train)
    acc = accuracy_score(yg_test, clf.predict(X_test_s))
    print(f"\n  ✔ Grade Classifier trained – Test Accuracy: {acc:.2%}")

    # ── Score Regressor ───────────────────────────────────────────────────────
    reg = RandomForestRegressor(
        n_estimators=200,
        max_depth=None,
        random_state=42,
        n_jobs=-1
    )
    reg.fit(X_train_s, ys_train)
    mae = mean_absolute_error(ys_test, reg.predict(X_test_s))
    print(f"  ✔ Score Regressor trained – Test MAE: {mae:.2f} pts")

    # ── Save models ───────────────────────────────────────────────────────────
    joblib.dump(clf,         'ml_data/img_quality_grade_model.pkl')
    joblib.dump(reg,         'ml_data/img_quality_score_model.pkl')
    joblib.dump(scaler,      'ml_data/img_quality_scaler.pkl')
    joblib.dump(FEATURES,    'ml_data/img_quality_features.pkl')

    print("\n  ✔ Models saved to ml_data/")
    print("    → img_quality_grade_model.pkl")
    print("    → img_quality_score_model.pkl")
    print("    → img_quality_scaler.pkl")
    print("    → img_quality_features.pkl")
    print("─" * 60)
    print("✅ Image Quality Model training complete.\n")


if __name__ == "__main__":
    train_image_quality_model()
