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
    "max_tokens": 3000,
    "temperature": 0.1,
    "repetition_penalty": 1.1
},
timeout=180 )

        print("\nIBM STATUS:")
        print(response.status_code)

        print("\nIBM RESPONSE:")
        print(response.text)

        if not response.ok:
            error_body = ""
            try:
                error_body = response.json()
            except Exception:
                error_body = response.text

            print("\nIBM ERROR BODY:")
            print(error_body)

            return jsonify({
                "success": False,
                "error": f"IBM API returned {response.status_code}",
                "detail": error_body
            }), 500

        data = response.json()

        text = ""

        if "choices" in data:
            text = data["choices"][0]["message"]["content"]

        elif "results" in data:
            text = data["results"][0]["generated_text"]

        if not text:
            print("\nUNEXPECTED IBM RESPONSE SHAPE:")
            print(data)
            return jsonify({"success": False, "error": "Could not extract text from IBM response"}), 500

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
# Chat route
# -------------------------------------------------------------------

@app.route("/chat", methods=["POST"])
def chat():
    try:
        body = request.json

        if not body:
            return jsonify({"success": False, "error": "Request body is required"}), 400

        messages = body.get("messages")
        repo_context = body.get("repoContext")

        if not messages or not repo_context:
            return jsonify({"success": False, "error": "messages and repoContext are required"}), 400

        token = get_ibm_token()

        system_prompt = f"""You are IBM Bob, a principal engineer doing a live pair programming session.

You are looking at a specific issue in a real repository. You have the full codebase context below.

YOUR RULES:
- Every fix you write MUST be based on actual code you can see in the REPO CONTEXT. Never invent function names, variable names, or file structures.
- If you cannot see enough of the file to write the exact fix, say: "I can see this file exists but need more context — here is the pattern to apply:" and show a general pattern instead.
- Never say "you should" or "consider" or "it would be good to". Be direct. Tell them exactly what to do.
- Keep explanations to 2-3 sentences. Judges do not want essays.
- If the user asks a follow-up question, answer it in context of the SAME issue unless they explicitly move on.
- If the user asks something unrelated to the repo, bring them back: "Let's stay focused on this codebase — here's what I see..."
- Write code in the correct language based on what you see in the repo. Never default to JavaScript if the repo is Python.
- If the fix is more than 30 lines, break it into steps. Show step 1 first, then ask if they want step 2.

FORMAT — respond EXACTLY like this every time:

EXPLANATION: <2-3 sentences. What is wrong. Why it matters. What will break if not fixed.>
FIX:
```<language>
<actual working code based on what you can see in the repo>
```
NEXT: <one sentence. What to do after this fix. What to test. What to watch out for.>

REPO CONTEXT:
{repo_context}"""

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
                    *messages
                ],
               "max_tokens": 2000,
"temperature": 0.1,
"repetition_penalty": 1.1
            },
            timeout=120
        )

        if not response.ok:
            error_body = ""
            try:
                error_body = response.json()
            except Exception:
                error_body = response.text
            return jsonify({
                "success": False,
                "error": f"IBM API returned {response.status_code}",
                "detail": error_body
            }), 500

        data = response.json()

        text = ""
        if "choices" in data:
            text = data["choices"][0]["message"]["content"]
        elif "results" in data:
            text = data["results"][0]["generated_text"]

        if not text:
            return jsonify({"success": False, "error": "Could not extract text from IBM response"}), 500

        return jsonify({"success": True, "text": text})

    except Exception as e:
        print("\nFULL ERROR:")
        print(str(e))
        return jsonify({"success": False, "error": str(e)}), 500

# -------------------------------------------------------------------
# Run
# -------------------------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=3001,
        debug=True
    )