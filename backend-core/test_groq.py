from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv

from pathlib import Path

# Load env relative to this script
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

api_key = os.getenv("GROQ_API_KEY")
model = os.getenv("GROQ_MODEL")

print(f"Key: {api_key[:5]}...")
print(f"Model: {model}")

try:
    chat = ChatGroq(temperature=0, groq_api_key=api_key, model_name=model)
    response = chat.invoke([HumanMessage(content="Hello")])
    print(f"Response: {response.content}")
except Exception as e:
    print(f"Error: {e}")
