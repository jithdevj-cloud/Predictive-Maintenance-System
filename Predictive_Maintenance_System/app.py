from flask import Flask, render_template, request, redirect, url_for, session
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = 'predictive_maintenance_secret_key_2024'

#  Loading model and scaler on startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model  = joblib.load(os.path.join(BASE_DIR, 'Best_XGBoost_Model.pkl'))
scaler = joblib.load(os.path.join(BASE_DIR, 'Feature_Scaler.pkl'))

FEATURE_NAMES = [
    'Type',
    'Air temperature [K]',
    'Process temperature [K]',
    'Rotational speed [rpm]',
    'Torque [Nm]',
    'Tool wear [min]',
]

TYPE_MAP = {'L': 0, 'M': 1, 'H': 2}


# Routes

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/prediction', methods=['GET'])
def prediction():
    return render_template('prediction.html')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        machine_type_str = request.form.get('machine_type', 'M')
        machine_type = TYPE_MAP.get(machine_type_str.upper(), 1)

        air_temp        = float(request.form.get('air_temp'))
        process_temp    = float(request.form.get('process_temp'))
        rot_speed       = float(request.form.get('rot_speed'))
        torque          = float(request.form.get('torque'))
        tool_wear       = float(request.form.get('tool_wear'))

        input_df = pd.DataFrame([[
            machine_type, air_temp, process_temp,
            rot_speed, torque, tool_wear
        ]], columns=FEATURE_NAMES)

        input_scaled = scaler.transform(input_df)
        prediction   = model.predict(input_scaled)[0]
        proba        = model.predict_proba(input_scaled)[0]

        no_failure_pct = round(proba[0] * 100, 2)
        failure_pct    = round(proba[1] * 100, 2)

        # Risk level
        if failure_pct >= 70:
            risk_level = 'Critical'
            risk_color = 'danger'
        elif failure_pct >= 40:
            risk_level = 'High'
            risk_color = 'warning'
        elif failure_pct >= 20:
            risk_level = 'Moderate'
            risk_color = 'info'
        else:
            risk_level = 'Low'
            risk_color = 'success'

        result = {
            'prediction'     : int(prediction),
            'label'          : 'Machine Failure' if prediction == 1 else 'No Failure',
            'no_failure_pct' : no_failure_pct,
            'failure_pct'    : failure_pct,
            'risk_level'     : risk_level,
            'risk_color'     : risk_color,
            # Echo inputs back for display
            'machine_type'   : machine_type_str.upper(),
            'air_temp'       : air_temp,
            'process_temp'   : process_temp,
            'rot_speed'      : rot_speed,
            'torque'         : torque,
            'tool_wear'      : tool_wear,
        }

        return render_template('result.html', result=result)

    except Exception as e:
        return render_template('prediction.html', error=str(e))


@app.route('/about')
def about():
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True)
