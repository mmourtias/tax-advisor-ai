from groq import Groq
from config import GROQ_API_KEY
from prompt import build_user_prompt, SYSTEM_PROMPT
from schemas import TaxForm

client = Groq(api_key=GROQ_API_KEY)

def get_tax_advice(data: TaxForm) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(data)}
        ]
    )
    return response.choices[0].message.content