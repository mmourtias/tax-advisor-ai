from fastapi import HTTPException
from groq import APIConnectionError, APIError, Groq, RateLimitError

from config import GROQ_API_KEY
from prompt import SYSTEM_PROMPT, build_user_prompt
from schemas import TaxForm


def get_tax_advice(data: TaxForm) -> str:
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY is not configured")

    client = Groq(api_key=GROQ_API_KEY)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": build_user_prompt(data)},
            ],
        )
    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="AI service rate limit reached. Please try again later.",
        )
    except APIConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to AI service. Please try again later.",
        )
    except APIError as exc:
        raise HTTPException(status_code=502, detail=f"AI service error: {exc}")

    content = response.choices[0].message.content
    if not content:
        raise HTTPException(status_code=502, detail="AI service returned an empty response")

    return content
