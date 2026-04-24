import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Securely load the client
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def run_groq_agent(messages: list, model: str = "llama-3.1-8b-instant") -> str:
    try:
        # Using the updated model name: llama-3.1-8b-instant
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            max_tokens=1024,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"GROQ ERROR: {str(e)}")
        # Fallback to mixtral
        try:
            print("Trying fallback to mixtral-8x7b-32768...")
            response = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=messages,
                max_tokens=1024,
            )
            return response.choices[0].message.content
        except Exception as e2:
            return f"Error from AI Coach: {str(e)}"