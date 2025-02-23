import pickle
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load the trained Random Forest model
model_path = "rf_model2.pkl"
with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

# Load the OneHotEncoder
encoder_path = "onehot_encoder.pkl"
with open(encoder_path, "rb") as encoder_file:
    encoder = pickle.load(encoder_file)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Define categorical options
categorical_options = {
    "model": ["kia", "nissan", "hyundai", "mercedes-benz", "toyota"],
    "motor_type": ["petrol", "gas", "petrol and gas"],
    "wheel": ["left", "right"],
    "color": ["black", "white", "silver", "blue", "gray", "other", "brown", "red", "green", "orange", "cherry",
              "skyblue", "clove", "beige"],
    "type": ["sedan", "suv", "Universal", "Coupe", "hatchback"],
    "status": ["excellent", "normal", "good", "crashed", "new"],
}


# Function to preprocess the input data
def preprocess_input(data):
    try:
        # Convert categorical fields to encoded values
        for field, options in categorical_options.items():
            data[field] = options.index(data[field]) if data[field] in options else -1  # -1 for unseen categories

        # Ensure 'running' is a string before encoding
        running_str = str(data["running"])  # Convert to string

        # Convert `running` to DataFrame before encoding
        running_df = pd.DataFrame([[running_str]], columns=["running"])  # Ensure feature name matches

        # Transform using the OneHotEncoder
        running_encoded = encoder.transform(running_df)

        # Convert encoded array back into a DataFrame
        running_encoded_df = pd.DataFrame(running_encoded, columns=encoder.get_feature_names_out(["running"]))

        # Convert the rest of the data into a DataFrame
        input_df = pd.DataFrame([data])

        # Drop original 'running' column and add encoded version
        input_df = input_df.drop(columns=["running"])
        input_df = pd.concat([input_df, running_encoded_df], axis=1)

        return input_df

    except Exception as e:
        print("Preprocessing Error:", str(e))
        raise


# Define prediction endpoint
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get input JSON data
        data = request.json

        # Log received data for debugging
        print("Received Data:", data)

        # Ensure all required fields are present
        required_fields = ["model", "year", "motor_type", "running", "wheel", "color", "type", "status", "motor_volume"]
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({"error": f"Missing fields in request: {missing_fields}"}), 400

        # Preprocess input data
        processed_data = preprocess_input(data)
        print("Processed Data for Prediction:\n", processed_data)

        # Make prediction
        predicted_price = model.predict(processed_data)[0]

        # Log prediction output
        print("Predicted Price:", predicted_price)

        # Return JSON response
        return jsonify({"predicted_price": round(predicted_price, 2)})

    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500


# Run Flask server
if __name__ == "__main__":
    app.run(debug=True)
