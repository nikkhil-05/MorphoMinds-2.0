from flask import Flask, request, jsonify, send_file
from random_word import (
    get_random_word_2letter,
    get_random_word_3to5letter,
    get_random_word_5moreletter,
)
from flask_cors import CORS
import requests
import base64
from io import BytesIO
import random

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend


@app.route('/')
def home():
    return "Server is running!"
# ---------------- WORD ROUTES ---------------- #
@app.route('/get-word', methods=['GET'])
def get_word():
    level = int(request.args.get('level', 0))
    if level == 1:
        import string
        word = random.choice(string.ascii_lowercase)
    elif level == 2:
        word = get_random_word_3to5letter()
    elif level == 3:
        word = get_random_word_3to5letter()
    elif level == 4:
        word = get_random_word_5moreletter()
    else:
        return jsonify({'error': 'Invalid level'}), 400
    return jsonify({'word': word})

@app.route('/check-word', methods=['POST'])
def check_word():
    data = request.get_json()
    expected_word = data.get('expected_word')
    spoken_word = data.get('spoken_word')
    print(f"Expected: {expected_word}, Spoken: {spoken_word}")

    if expected_word and spoken_word:
        result = "✅ Correct!" if expected_word.lower() == spoken_word.lower() else "❌ Incorrect"
    else:
        result = "Invalid input."
    return jsonify({'result': result})

# ---------------- SENTENCE ROUTES (LEVEL 5) ---------------- #
sentences = [
    "I am Sam",
    "The cat runs",
    "We eat food",
    "She is happy",
    "The sun shines",
    "It is hot",
    "The dog barks",
    "We play ball",
    "He is tall",
    "I like milk"
]

@app.route('/get-sentence', methods=['GET'])
def get_sentence():
    """Return a random simple sentence for Level 5"""
    sentence = random.choice(sentences)
    return jsonify({"sentence": sentence})

@app.route('/check-sentence', methods=['POST'])
def check_sentence():
    """Check learner's spoken/typed sentence"""
    data = request.get_json()
    expected_sentence = data.get("expected_sentence", "").strip().lower()
    spoken_sentence = data.get("spoken_sentence", "").strip().lower()

    print(f"Expected: {expected_sentence}, Spoken: {spoken_sentence}")

    if expected_sentence and spoken_sentence:
        result = "✅ Correct!" if expected_sentence == spoken_sentence else f"❌ Incorrect (You said: {spoken_sentence})"
    else:
        result = "Invalid input."
    return jsonify({"result": result})

# ---------------- TEXT-TO-SPEECH ---------------- #
@app.route('/tts', methods=['POST'])
def text_to_speech():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({'error': 'Text is required'}), 400

    headers = {
        "accept": "application/json",
        "x-magicapi-key": "cm9dcve2v0009l2047m9kothl",  # Replace with your API key
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": [text],
        "target_language_code": "hi-IN",
        "speaker": "meera",
        "pitch": 0,
        "pace": 1,
        "loudness": 1,
        "speech_sample_rate": 16000,
        "enable_preprocessing": True,
        "model": "bulbul:v1"
    }

    try:
        response = requests.post(
            "https://api.magicapi.dev/api/v1/sarvam/ai-models/text-to-speech",
            headers=headers, json=payload
        )
        response.raise_for_status()
        audio_base64 = response.json()["audios"][0]
        audio_binary = base64.b64decode(audio_base64)
        return send_file(BytesIO(audio_binary), mimetype="audio/wav", download_name="speech.wav")
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'TTS failed'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
