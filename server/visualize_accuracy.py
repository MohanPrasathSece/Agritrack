
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
import os

# Create ml_data directory if it doesn't exist
os.makedirs('ml_data', exist_ok=True)

def generate_synthetic_features(n=2000):
    """Generate synthetic image feature vectors for different quality levels."""
    np.random.seed(42)
    data = []

    grade_configs = {
        'Premium': {'v': (0.7, 0.9), 's': (0.6, 0.8), 'lbp': (0.8, 0.95), 'defect': (0.0, 0.05), 'n': n // 4},
        'A': {'v': (0.6, 0.8), 's': (0.5, 0.7), 'lbp': (0.6, 0.85), 'defect': (0.04, 0.1), 'n': n // 4},
        'B': {'v': (0.5, 0.7), 's': (0.3, 0.5), 'lbp': (0.4, 0.65), 'defect': (0.08, 0.2), 'n': n // 4},
        'C': {'v': (0.3, 0.5), 's': (0.1, 0.3), 'lbp': (0.2, 0.45), 'defect': (0.15, 0.4), 'n': n - 3 * (n // 4)},
    }

    for grade, cfg in grade_configs.items():
        num = cfg['n']
        # Add random noise to make the classification task more challenging
        v_mean = np.random.uniform(*cfg['v'], num) + np.random.normal(0, 0.05, num)
        s_mean = np.random.uniform(*cfg['s'], num) + np.random.normal(0, 0.05, num)
        lbp_u = np.random.uniform(*cfg['lbp'], num) + np.random.normal(0, 0.05, num)
        defect = np.random.uniform(*cfg['defect'], num) + np.random.normal(0, 0.02, num)
        
        for i in range(num):
            data.append([v_mean[i], s_mean[i], lbp_u[i], defect[i], grade])

    df = pd.DataFrame(data, columns=['v_mean', 's_mean', 'lbp_uniformity', 'defect_ratio', 'grade'])
    return df.sample(frac=1, random_state=42).reset_index(drop=True)

def visualize_accuracy():
    print("Generating data and calculating accuracy metrics...")
    df = generate_synthetic_features(n=3000)
    
    X = df[['v_mean', 's_mean', 'lbp_uniformity', 'defect_ratio']]
    y = df['grade']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # 1. Accuracy vs Number of Estimators
    estimators = [1, 5, 10, 20, 50, 100, 150, 200]
    accuracies = []

    for n in estimators:
        clf = RandomForestClassifier(n_estimators=n, random_state=42, n_jobs=-1)
        clf.fit(X_train_s, y_train)
        y_pred = clf.predict(X_test_s)
        acc = accuracy_score(y_test, y_pred)
        accuracies.append(acc)
        print(f"Estimators: {n:3} | Accuracy: {acc:.2%}")

    # Set modern style
    plt.style.use('bmh') # Using 'bmh' as a reliable alternative to 'seaborn-v0_8-muted' if not available
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # Plotting the accuracy trend
    ax.plot(estimators, accuracies, marker='o', linestyle='-', linewidth=2.5, markersize=8, color='#2ecc71', label='Test Accuracy')
    
    # Fill under the curve for aesthetic
    ax.fill_between(estimators, accuracies, alpha=0.1, color='#2ecc71')

    # Add peak annotation
    max_acc = max(accuracies)
    max_idx = estimators[accuracies.index(max_acc)]
    ax.annotate(f'Peak: {max_acc:.1%}', xy=(max_idx, max_acc), xytext=(max_idx+10, max_acc-0.02),
                 arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=5),
                 fontsize=10, fontweight='bold')

    ax.set_title('RandomForest Model Accuracy Growth', fontsize=16, fontweight='bold', pad=20)
    ax.set_xlabel('Number of Estimators (Trees)', fontsize=12)
    ax.set_ylabel('Model Accuracy', fontsize=12)
    ax.set_ylim(min(accuracies) - 0.05, 1.0)
    ax.grid(True, linestyle='--', alpha=0.7)
    ax.legend(loc='lower right', frameon=True)

    # Adding helpful text
    plt.figtext(0.5, 0.01, f"Final Model Stability achieved at ~{max_idx} trees with {max_acc:.2%} accuracy.", 
                ha="center", fontsize=10, bbox={"facecolor":"orange", "alpha":0.1, "pad":5})

    plt.tight_layout()
    
    # Save the plot
    output_path = 'ml_data/model_accuracy_graph.png'
    plt.savefig(output_path, dpi=150)
    print(f"\nSuccess! Graph saved to: {output_path}")
    
    # Output the peak accuracy for the user
    print(f"REPORT: Maximum Model Accuracy reached: {max_acc:.2%}")

if __name__ == "__main__":
    visualize_accuracy()
