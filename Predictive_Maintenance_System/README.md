
```

## Setup Instructions

### 1. Prerequisites
- Python 3.9+
- PyCharm (recommended) or any IDE

### 2. Copy model files
Copy `Best_XGBoost_Model.pkl` and `Feature_Scaler.pkl` from your Google Colab
download into the root of this project folder.

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the application
```bash
python app.py
```

Open your browser at: **http://127.0.0.1:5000**



## Input Features

| Feature                   | Type  | Encoding          |
|---------------------------|-------|-------------------|
| Type (L / M / H)          | Cat   | L=0, M=1, H=2    |
| Air Temperature [K]       | Float | Raw               |
| Process Temperature [K]   | Float | Raw               |
| Rotational Speed [rpm]    | Int   | Raw               |
| Torque [Nm]               | Float | Raw               |
| Tool Wear [min]           | Int   | Raw               |

All features are scaled using the saved StandardScaler before prediction.

## Risk Classification

| Failure Probability | Risk Level |
|---------------------|------------|
| ≥ 70%               | Critical   |
| 40% – 69%           | High       |
| 20% – 39%           | Moderate   |
| < 20%               | Low        |

