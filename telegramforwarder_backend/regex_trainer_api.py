from flask_cors import CORS
from flask import Blueprint, request, jsonify
import re

app = Blueprint('regex_api', __name__)

CORS(app)

@app.route('/train-regex', methods=['POST'])
def train_regex():
    data = request.json
    sample = data.get("sample", "")
    target = data.get("target", "")

    if not sample or not target:
        return jsonify({"error": "Missing sample or target"}), 400

    try:
        idx = sample.index(target)
        before = re.escape(sample[:idx])
        after = re.escape(sample[idx + len(target):])
        regex = f"{before}(.+?){after}"
        return jsonify({"regex": regex})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
