import os
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import joblib

app = Flask(__name__)
CORS(app)

# Load the trained model and scaler
model = tf.keras.models.load_model('placement_model.h5')
scaler = joblib.load('scaler.pkl')

dataset_file = "predictions.csv"  

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        
        required_fields = ['cgpa', 'skills', 'internships', 'projects', 'certifications']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        features = np.array([[
            data['cgpa'], 
            data['skills'], 
            data['internships'], 
            data['projects'], 
            data['certifications']
        ]])
        
        scaled_features = scaler.transform(features)
        
        prediction_prob = model.predict(scaled_features)[0][0]
        
        prediction_binary = 1 if prediction_prob >= 0.5 else 0
        result = "Placed" if prediction_binary == 1 else "Not Placed"

        new_entry = {
            "CGPA": data['cgpa'],
            "Skills": data['skills'],
            "Internships": data['internships'],
            "Projects": data['projects'],
            "Certifications": data['certifications'],
            "Prediction": prediction_binary
        }
        new_entry_df = pd.DataFrame([new_entry])

        if not os.path.exists(dataset_file):
            new_entry_df.to_csv(dataset_file, index=False)
        else:
            new_entry_df.to_csv(dataset_file, mode='a', header=False, index=False)

        return jsonify({'placement_result': result})  # Return "Placed" or "Not Placed"
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/eda', methods=['GET'])
def eda():
    try:
        if os.path.exists(dataset_file):
            df = pd.read_csv(dataset_file)
            total_records = len(df)
            placement_rate = (df['Prediction'].sum() / total_records) * 100 if total_records > 0 else 0
            averages = {
                "cgpa": df['CGPA'].mean(),
                "skills": df['Skills'].mean(),
                "internships": df['Internships'].mean(),
                "projects": df['Projects'].mean(),
                "certifications": df['Certifications'].mean()
            }
            return jsonify({
                "total_records": total_records,
                "placement_rate": placement_rate,
                "averages": averages
            })
        else:
            return jsonify({"error": "No prediction data available."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')