# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from keras import models, layers
import cv2
import base64
from PIL import Image
import io

# Initialize Flask App
app = Flask(__name__)
# Be more specific with CORS to solve the preflight request issue
CORS(app, origins=["http://localhost:8080"])# This is crucial to allow requests from your React app

# --- Copied and adapted from your script ---

def load_model(path):
    model = models.Sequential([
        layers.Conv2D(32, (5, 5), input_shape=(28, 28, 1), activation="relu"),
        layers.BatchNormalization(),
        layers.Conv2D(32, (5, 5), activation="relu"),
        layers.BatchNormalization(),
        layers.MaxPooling2D(2, 2),
        layers.Dropout(0.25),
        layers.BatchNormalization(),
        layers.Flatten(),
        layers.Dense(256, activation="relu"),
        layers.Dense(36, activation="softmax")
    ])
    model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
    model.load_weights(path)
    print("✅ Model Loaded Successfully")
    return model

# Load the model once when the server starts
model = load_model("best_val_loss_model.h5")
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

def predict_from_image(image):
    # This is your exact preprocessing logic
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    image = cv2.resize(image, (28, 28))
    image = image / 255.0
    image = np.reshape(image, (1, 28, 28, 1))
    
    prediction = model.predict(image)
    
    # Get the single best prediction
    max_i = np.argmax(prediction[0])
    predicted_label = labels[max_i]
    
    return predicted_label

# --- End of copied logic ---


# Define the /predict API endpoint
@app.route('/predict', methods=['POST'])
def handle_predict():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image data found'}), 400

    # Decode the base64 image sent from React
    image_data = data['image'].split(',')[1]
    image_bytes = io.BytesIO(base64.b64decode(image_data))
    
    # Open the image with Pillow and convert to an OpenCV-compatible format (numpy array)
    pil_image = Image.open(image_bytes).convert('RGB')
    opencv_image = np.array(pil_image)
    # Convert RGB to BGR for OpenCV
    opencv_image = opencv_image[:, :, ::-1].copy()

    # Get the prediction
    predicted_character = predict_from_image(opencv_image)

    # Return the prediction as JSON
    return jsonify({'prediction': predicted_character})

# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)