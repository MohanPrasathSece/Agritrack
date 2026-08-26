import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Ensure directory exists
if not os.path.exists('ml_data'):
    os.makedirs('ml_data')

def generate_price_data():
    np.random.seed(42)
    crops = ['Tomato', 'Onion', 'Potato']
    data = []
    
    for _ in range(1000):
        crop = np.random.choice(crops)
        month = np.random.randint(1, 13)
        rain = np.random.uniform(0, 300)
        temp = np.random.uniform(15, 40)
        
        base_price = {'Tomato': 20, 'Onion': 30, 'Potato': 15}
        price = base_price[crop]
        
        if crop == 'Tomato' and 6 <= month <= 9:
            price *= np.random.uniform(1.5, 3.0)
        elif crop == 'Onion' and 10 <= month <= 12:
            price *= np.random.uniform(2.0, 4.0)
        elif crop == 'Potato':
            price *= np.random.uniform(0.9, 1.2)
            
        price += np.random.normal(0, 2)
        data.append([crop, month, rain, temp, max(5, round(price, 2))])
        
    return pd.DataFrame(data, columns=['crop', 'month', 'rain', 'temp', 'price'])

def generate_quality_data():
    np.random.seed(42)
    data = []
    
    # Features: Color (0-2), Size (0-2), Texture (0-2), Moisture (10-30), Purity (70-100)
    # Color: 0=Poor, 1=Fair, 2=Excellent
    # Size: 0=Small, 1=Mixed, 2=Uniform
    # Texture: 0=Inconsistent, 1=Slightly Varied, 2=Uniform
    
    for _ in range(1000):
        color = np.random.randint(0, 3)
        size = np.random.randint(0, 3)
        texture = np.random.randint(0, 3)
        moisture = np.random.uniform(10, 30)
        purity = np.random.uniform(70, 100)
        
        # Calculate a weighted score
        score = (color * 15) + (size * 10) + (texture * 10) + (100 - abs(moisture - 15) * 5) + (purity * 0.5)
        # Normalize score to 0-100
        score = min(100, max(0, score / 1.5))
        
        if score >= 90: grade = 'Premium'
        elif score >= 75: grade = 'A'
        elif score >= 60: grade = 'B'
        else: grade = 'C'
        
        data.append([color, size, texture, moisture, purity, grade, round(score, 2)])
        
    return pd.DataFrame(data, columns=['color', 'size', 'texture', 'moisture', 'purity', 'grade', 'score'])

def train_price_model():
    print("--- Training Price Model ---")
    df = generate_price_data()
    le = LabelEncoder()
    df['crop_encoded'] = le.fit_transform(df['crop'])
    joblib.dump(le, 'ml_data/crop_encoder.pkl')
    
    X = df[['crop_encoded', 'month', 'rain', 'temp']]
    y = df['price']
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    joblib.dump(model, 'ml_data/price_model.pkl')
    print("Price model trained and saved.")

def train_quality_model():
    print("--- Training Quality Model ---")
    df = generate_quality_data()
    
    # Features for predicting score (Regression)
    X_reg = df[['color', 'size', 'texture', 'moisture', 'purity']]
    y_reg = df['score']
    
    reg_model = RandomForestRegressor(n_estimators=100, random_state=42)
    reg_model.fit(X_reg, y_reg)
    joblib.dump(reg_model, 'ml_data/quality_score_model.pkl')
    
    # Features for predicting grade (Classification)
    X_cls = df[['color', 'size', 'texture', 'moisture', 'purity']]
    y_cls = df['grade']
    
    cls_model = RandomForestClassifier(n_estimators=100, random_state=42)
    cls_model.fit(X_cls, y_cls)
    joblib.dump(cls_model, 'ml_data/quality_grade_model.pkl')
    
    print("Quality models (Score & Grade) trained and saved.")

def train_demand_model():
    print("--- Training Demand Forecast Model ---")
    # Demand varies by crop and month (0-100 score)
    crops = ['Tomato', 'Onion', 'Potato']
    data = []
    np.random.seed(42)
    
    for _ in range(1000):
        crop = np.random.choice(crops)
        month = np.random.randint(1, 13)
        
        # Simple logic: Tomato high in July-Sept, Onion high in Oct-Dec
        base_demand = np.random.uniform(40, 60)
        if crop == 'Tomato' and 7 <= month <= 9: base_demand += 30
        if crop == 'Onion' and 10 <= month <= 12: base_demand += 35
        if crop == 'Potato': base_demand += np.random.uniform(-5, 5)
        
        data.append([crop, month, min(100, max(0, base_demand))])
        
    df = pd.DataFrame(data, columns=['crop', 'month', 'demand'])
    le = joblib.load('ml_data/crop_encoder.pkl')
    df['crop_encoded'] = le.transform(df['crop'])
    
    X = df[['crop_encoded', 'month']]
    y = df['demand']
    
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)
    joblib.dump(model, 'ml_data/demand_model.pkl')
    print("Demand model saved.")

def train_shelflife_model():
    print("--- Training Shelf-Life Prediction Model ---")
    # Input: Temp, Moisture -> Output: Days until degradation
    data = []
    np.random.seed(42)
    
    for _ in range(1000):
        temp = np.random.uniform(10, 45)
        moisture = np.random.uniform(5, 40)
        
        # Logic: Life decreases as temp and moisture increase
        life = 30 - (temp * 0.4) - (moisture * 0.3)
        life += np.random.normal(0, 1)
        
        data.append([temp, moisture, max(2, round(life))])
        
    df = pd.DataFrame(data, columns=['temp', 'moisture', 'life'])
    X = df[['temp', 'moisture']]
    y = df['life']
    
    model = RandomForestRegressor(n_estimators=50, random_state=42)
    model.fit(X, y)
    joblib.dump(model, 'ml_data/shelflife_model.pkl')
    print("Shelf-life model saved.")

if __name__ == "__main__":
    train_price_model()
    train_quality_model()
    train_demand_model()
    train_shelflife_model()
    print("\nAll expanded local ML models trained successfully.")
