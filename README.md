# Predictive Maintenance System

A machine-learning-based predictive maintenance project that analyses industrial equipment operating conditions and predicts whether a machine failure is likely. The project combines a Jupyter Notebook for data analysis, model training and explainability with a Flask web application for interactive predictions.

## Project Overview

Unexpected equipment failure can cause downtime, maintenance costs and operational disruption. This project uses equipment measurements to classify machine status as **No Failure** or **Machine Failure** and presents a risk category based on the model's predicted failure probability.

The project has two main parts:

- **Data analysis and model development** — exploratory data analysis, preprocessing, model comparison and SHAP-based explainability in `Jithal2707_Software_DataAnalysis.ipynb`.
- **Web application** — a Flask interface that loads the saved XGBoost model and feature scaler and accepts equipment details through a web form.

## Features

- Exploratory data analysis of machine-failure status and operating measurements.
- Missing-value and duplicate-row checks.
- Visualisations for failure distribution, tool wear, air temperature, torque and feature correlations.
- Preprocessing of equipment type and removal of identifier and failure-mode columns from the model inputs.
- Comparison of Decision Tree, Random Forest and XGBoost classifiers.
- Evaluation using accuracy, precision, recall, F1-score, ROC-AUC, classification reports, confusion matrices and ROC curves.
- SHAP visualisations to help explain XGBoost predictions and feature contributions.
- Flask web pages for the home page, prediction form, prediction result and project information.
- Failure-probability display and risk categories.

## Technology Stack

- **Language:** Python
- **Data analysis:** pandas, NumPy
- **Visualisation:** Matplotlib
- **Machine learning:** scikit-learn, XGBoost
- **Explainable AI:** SHAP
- **Model persistence:** joblib
- **Web framework:** Flask
- **Frontend:** HTML, CSS and JavaScript

## Repository Structure

```text
Predictive-Maintenance-System/
├── app.py
├── Best_XGBoost_Model.pkl
├── Feature_Scaler.pkl
├── requirements.txt
├── README.md
├── templates/
│   ├── index.html
│   ├── prediction.html
│   ├── result.html
│   └── about.html
└── static/
    ├── css/
    │   ├── index_style.css
    │   └── style.css
    └── js/
        └── script.js

Jithal2707_Software_DataAnalysis.ipynb
ai4i2020.csv  # required to rerun the notebook; obtain it from the dataset source
```

The notebook and dataset may be stored in the repository root or in a separate `notebooks/` and `data/` folder. Update the notebook's dataset path if you change its location. The trained model and scaler files are required by the web application.

## Dataset

The notebook loads a CSV file named `ai4i2020.csv` into a pandas DataFrame. It uses the following variables for prediction:

| Feature | Description | Input representation |
|---|---|---|
| `Type` | Product/equipment type | L, M or H; encoded as 0, 1 or 2 in the web app |
| `Air temperature [K]` | Air temperature in kelvin | Numeric |
| `Process temperature [K]` | Process temperature in kelvin | Numeric |
| `Rotational speed [rpm]` | Rotational speed in revolutions per minute | Numeric |
| `Torque [Nm]` | Torque in newton-metres | Numeric |
| `Tool wear [min]` | Tool wear in minutes | Numeric |
| `Machine failure` | Target label | 0 = No Failure, 1 = Failure |

The notebook removes `UDI` and `Product ID` because they are identifiers. It also removes `TWF`, `HDF`, `PWF`, `OSF` and `RNF` from the model inputs to reduce target leakage from failure-mode indicators. The target is `Machine failure`.

**Dataset note:** `ai4i2020.csv` is referenced by the notebook but was not included in the uploaded application ZIP. Add the dataset from its authorised source before running the notebook. Check the dataset's licence and attribution requirements before redistributing it.

## Model Development Workflow

1. Load the dataset and inspect its columns and data types.
2. Check missing values and duplicate rows.
3. Explore the target distribution and equipment operating measurements.
4. Prepare features by dropping identifiers and failure-mode indicators and encoding equipment type.
5. Split the data into training and testing sets using an 80/20 split, `random_state=42` and stratification.
6. Fit a `StandardScaler` on the training features and transform the training and test sets.
7. Train and evaluate Decision Tree, Random Forest and XGBoost classifiers.
8. Compare classification metrics and ROC-AUC.
9. Use SHAP summary, feature-importance and waterfall plots to inspect feature contributions.
10. Save the XGBoost model as `Best_XGBoost_Model.pkl` and the fitted scaler as `Feature_Scaler.pkl` for use by the Flask application.

## Model Evaluation

The notebook's recorded model-comparison output is shown below. Values are rounded to four decimal places.

| Model | Accuracy | Precision | Recall | F1-score | ROC-AUC |
|---|---:|---:|---:|---:|---:|
| Decision Tree | 0.9755 | 0.7879 | 0.3824 | 0.5149 | 0.9219 |
| Random Forest | 0.9845 | 0.8936 | 0.6176 | 0.7304 | 0.9715 |
| XGBoost | 0.9845 | 0.9111 | 0.6029 | 0.7257 | 0.9757 |

XGBoost achieved the highest ROC-AUC in this recorded comparison and is selected as the saved model. Random Forest has a slightly higher recall and F1-score in the displayed results. Because failures may be relatively uncommon, accuracy alone is not sufficient for judging practical usefulness; recall and the number of missed failures should also be considered.

These values are the notebook's recorded results and may differ if the dataset, software versions, preprocessing or training configuration changes.

## Run the Flask Application

### Prerequisites

- Python 3.9 or later (use a version compatible with the pinned dependencies)
- pip
- The saved model and scaler files in the same directory as `app.py`

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/Predictive-Maintenance-System.git
cd Predictive-Maintenance-System
```

Replace `<your-username>` with your GitHub username.

### 2. Create and activate a virtual environment (recommended)

**Windows (Command Prompt):**

```bat
python -m venv .venv
.venv\Scripts\activate
```

**macOS/Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install application dependencies

```bash
pip install -r requirements.txt
```

### 4. Confirm model files are present

Make sure these files are in the same folder as `app.py`:

```text
Best_XGBoost_Model.pkl
Feature_Scaler.pkl
```

### 5. Start the application

```bash
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser. Use the prediction page to enter equipment measurements and view the predicted class, class probabilities and risk category.

**Security note:** `app.py` currently starts Flask with `debug=True` and contains a hard-coded session secret. These settings are suitable only for local development. Before deployment, disable debug mode and load a strong secret key from an environment variable.

## Input and Risk Interpretation

The web application accepts the following fields:

- Equipment type: `L`, `M` or `H`
- Air temperature (K)
- Process temperature (K)
- Rotational speed (rpm)
- Torque (Nm)
- Tool wear (min)

The app scales the input with the saved scaler before asking the model for a prediction. It then assigns a risk label based on the predicted failure probability:

| Predicted failure probability | Application risk label |
|---|---|
| 70% or higher | Critical |
| 40% to below 70% | High |
| 20% to below 40% | Moderate |
| Below 20% | Low |

These labels are application-defined probability bands, not calibrated maintenance standards. Treat predictions as decision support and validate the model with relevant operational data before using it for real maintenance decisions.

## Run the Notebook

1. Install Jupyter Notebook or use JupyterLab/Google Colab.
2. Place `Jithal2707_Software_DataAnalysis.ipynb` and `ai4i2020.csv` where the notebook can access them.
3. Install the notebook libraries if they are not already available:

```bash
pip install pandas numpy matplotlib scikit-learn xgboost shap joblib jupyter
```

4. Update the CSV path if necessary.
5. Run the notebook cells in order to perform the analysis, train the models, compare performance, generate SHAP plots and save the model/scaler files.

The notebook's final manual-input cell requests interactive values; in environments that do not support `input()`, use a normal Python terminal or adapt that cell for the notebook environment.

## Limitations

- This is a predictive prototype, not a replacement for equipment inspection or a validated maintenance process.
- High accuracy can be misleading when failure cases are less frequent than normal cases.
- A predicted probability should not automatically be interpreted as a calibrated real-world failure probability.
- SHAP helps explain model output but does not establish causation.
- The deployed model and scaler must be kept consistent with the preprocessing and feature order used during training.
- Validate performance, false negatives, probability calibration and operating thresholds on representative data before production use.

## Future Improvements

- Add automated tests for input validation, preprocessing and prediction routes.
- Add cross-validation and threshold tuning focused on failure recall.
- Evaluate probability calibration and monitor model drift.
- Add model/version metadata and reproducible training configuration.
- Add deployment configuration with environment-based secrets and debug mode disabled.
- Add screenshots of the web interface and selected notebook visualisations.

