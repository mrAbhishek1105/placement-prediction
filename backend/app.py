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

dataset_file = "predictions.csv"  # New filename for storing predictions

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = np.array([[
            data['cgpa'], 
            data['skills'], 
            data['internships'], 
            data['projects'], 
            data['certifications']
        ]])
        
        scaled_features = scaler.transform(features)
        prediction_prob = model.predict(scaled_features)[0][0]
        
        # Convert probability to binary classification
        prediction_binary = 1 if prediction_prob >= 0.5 else 0
        result = "Placed" if prediction_binary == 1 else "Not Placed"

        # Store the prediction result in a CSV file
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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')