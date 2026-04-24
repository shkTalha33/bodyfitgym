import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the SDK
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

def run_gemini_agent(prompt: str, model: str = "gemini-pro") -> str:
    try:
        # Switching to gemini-pro as it has a higher quota for free tier
        model_instance = genai.GenerativeModel('gemini-pro') 
        response = model_instance.generate_content(prompt)
        
        if hasattr(response, 'text'):
            return response.text
        else:
            return "AI returned an empty response or was blocked by safety filters."
            
    except Exception as e:
        print(f"GEMINI ERROR with {model}: {str(e)}")
        # Fallback to gemini-flash-latest which was in the user's available list
        try:
            print("Trying fallback to gemini-flash-latest...")
            model_instance = genai.GenerativeModel('gemini-flash-latest')
            response = model_instance.generate_content(prompt)
            return response.text
        except Exception as e2:
            return f"Error from Gemini: {str(e)}"