from flask import Flask
from flask_cors import CORS
from regex_trainer_api import app as regex_app
from telegram_auth_api import auth_api

app = Flask(__name__)

# ✅ Updated: Allow CORS from your frontend origin and support credentials
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

# ✅ Register Blueprints
app.register_blueprint(regex_app)
app.register_blueprint(auth_api, url_prefix='/')

if __name__ == '__main__':
    app.run(port=5001)
