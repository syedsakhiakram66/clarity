import os
import time
import requests

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

IBM_API_KEY = os.getenv("IBM_API_KEY")
IBM_PROJECT_ID = os.getenv("IBM_PROJECT_ID")

# -------------------------------------------------------------------
# Token cache
# -------------------------------------------------------------------

cached_token = None
token_expiry = 0


def get_ibm_token():
    global cached_token, token_expiry

    # Reuse token if still valid
    if cached_token and time.time() < token_expiry:
        return cached_token

    response = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        headers={
            "Content-Type": "application/x-www-form-urlencoded"
        },
        data={
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
            "apikey": IBM_API_KEY
        }
    )

    response.raise_for_status()

    data = response.json()

    cached_token = data["access_token"]

    # refresh slightly early
    token_expiry = time.time() + data["expires_in"] - 60

    return cached_token


# -------------------------------------------------------------------
# Health route
# -------------------------------------------------------------------

@app.route("/")
def health():
    return jsonify({
        "status": "ok",
        "service": "IBM Bob Backend"
    })


# -------------------------------------------------------------------
# Analyze route
# -------------------------------------------------------------------

@app.route("/analyze", methods=["POST"])
def analyze():

    try:
        body = request.json

        if not body:
            return jsonify({"success": False, "error": "Request body is required"}), 400

        system_prompt = body.get("systemPrompt")
        context = body.get("context")

        if not system_prompt or not context:
            return jsonify({"success": False, "error": "systemPrompt and context are required"}), 400

        token = get_ibm_token()


        print("\nTOKEN OK\n")

        response = requests.post(
            "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            json={
                "model_id": "ibm/granite-4-h-small",
                "project_id": IBM_PROJECT_ID,
                "messages": [
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": context
                    }
                ],
                "max_tokens": 2000,
                "temperature": 0.2
            },
            timeout=120
        )

        print("\nIBM STATUS:")
        print(response.status_code)

        print("\nIBM RESPONSE:")
        print(response.text)

        response.raise_for_status()

        data = response.json()

        text = ""

        if "choices" in data:
            text = data["choices"][0]["message"]["content"]

        elif "results" in data:
            text = data["results"][0]["generated_text"]

        return jsonify({
            "success": True,
            "text": text
        })

    except Exception as e:
        print("\nFULL ERROR:")
        print(str(e))

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500




# -------------------------------------------------------------------
# Run
# -------------------------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=3001,
        debug=True
    )