import json
import os
from google import genai
from google.genai import types

class WebsiteHelpBot:
    def __init__(self, context_filepath: str, api_key: str = None):
        """
        Initializes the chatbot with context and navigation handling.
        """
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        if not os.path.exists(context_filepath):
            raise FileNotFoundError(f"Context file not found at: {context_filepath}")
            
        with open(context_filepath, "r", encoding="utf-8") as file:
            website_context = file.read()

        system_instruction = f"""
You are the official automated support bot for our website.
Your task is to provide accurate answers strictly based on the WEBSITE KNOWLEDGE BASE provided below.

RULES:
1. Answer using ONLY the information given in the WEBSITE KNOWLEDGE BASE.
2. If the user asks something not covered in the knowledge base, state clearly: 
   "I'm sorry, I don't have that information. Please contact our human support team."
3. If the user's inquiry relates to a specific page or action (e.g., pricing, login, contact, settings), provide the corresponding URL path in the `navigate_to` field. If no navigation is needed, set `navigate_to` to null.
4. Output MUST always be valid JSON with the exact keys: "answer" and "navigate_to".

--- WEBSITE KNOWLEDGE BASE ---
{website_context}
------------------------------
"""

        # Enforce JSON output schema
        self.chat = self.client.chats.create(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                response_mime_type="application/json",
                response_schema={
                    "type": "OBJECT",
                    "properties": {
                        "answer": {"type": "STRING"},
                        "navigate_to": {"type": "STRING", "nullable": True},
                    },
                    "required": ["answer", "navigate_to"],
                },
            )
        )

    def ask(self, user_message: str) -> dict:
        """
        Sends a message to the bot.
        Returns a Python dictionary: {'answer': str, 'navigate_to': str | None}
        """
        response = self.chat.send_message(user_message)
        return json.loads(response.text)


# Local Test Execution
if __name__ == "__main__":
    bot = WebsiteHelpBot(context_filepath="info.txt")
    
    print("Bot initialized. Type 'exit' to quit.\n")
    while True:
        user_input = input("User: ")
        if user_input.lower() in ["exit", "quit"]:
            break
        result = bot.ask(user_input)
        print(f"Bot Answer: {result['answer']}")
        print(f"Redirect URL: {result['navigate_to']}\n")