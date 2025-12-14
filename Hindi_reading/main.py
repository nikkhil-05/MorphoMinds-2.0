# -*- coding: utf-8 -*-
from flask import Flask
from flask_cors import CORS
# Level files import करें (आपके पास ये चारों level पहले से होंगे)
from Level1 import app as level1_app
from Level2 import app as level2_app
from Level3 import app as level3_app
from Level4 import app as level4_app

# मुख्य Flask app बनाएँ
app = Flask(__name__)
CORS(app)
# चारों level के Blueprints register करें
app.register_blueprint(level1_app, url_prefix="/level1")
app.register_blueprint(level2_app, url_prefix="/level2")
app.register_blueprint(level3_app, url_prefix="/level3")
app.register_blueprint(level4_app, url_prefix="/level4")

if __name__ == "__main__":
    # मुख्य app run करें
    # आप चाहें तो port बदल सकते हैं, default: 5000
    app.run(host="0.0.0.0", port=5002, debug=True)
