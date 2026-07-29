# import os
# import json
# from pathlib import Path

# from dotenv import load_dotenv
# from groq import Groq

# # Get backend directory
# BASE_DIR = Path(__file__).resolve().parents[2]

# # Load .env
# dotenv_file = BASE_DIR / ".env"

# print("Loading .env from:", dotenv_file)

# load_dotenv(dotenv_path=dotenv_file, override=True)

# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# print("API Key Found:", GROQ_API_KEY is not None)

# # Check if API key exists
# if not GROQ_API_KEY:
#     raise ValueError("GROQ_API_KEY is missing from .env")


# # Create Groq client
# client = Groq(
#     api_key=GROQ_API_KEY
# )


# # Model we are using
# MODEL_NAME = "openai/gpt-oss-120b"

import os
import json
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq

# Get the backend folder path
BASE_DIR = Path(__file__).resolve().parents[2]

# Load .env explicitly
dotenv_path = BASE_DIR / ".env"

print(f"Loading .env from: {dotenv_path}")

load_dotenv(dotenv_path=dotenv_path, override=True)

# Read API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print(f"API Key Loaded: {GROQ_API_KEY is not None}")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing from .env")

# Create Groq client
client = Groq(api_key=GROQ_API_KEY)

# Model
MODEL_NAME = "openai/gpt-oss-120b"
def get_ai_response(prompt: str) -> dict:
    """
    Send a prompt to Groq and return JSON response.
    """

    try:

        response = client.chat.completions.create(

            model=MODEL_NAME,

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert AI resume analyzer. "
                        "Always return valid JSON."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            response_format={
                "type": "json_object"
            },

            temperature=0.2
        )

        # Get AI response
        content = response.choices[0].message.content

        # Convert JSON string to Python dictionary
        result = json.loads(content)

        return result

    except Exception as e:

        print(f"Groq Error: {e}")

        return {
            "error": "AI service failed",
            "details": str(e)
        }