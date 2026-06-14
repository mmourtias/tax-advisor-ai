from schemas import TaxForm

SYSTEM_PROMPT = """You are an experienced tax advisor with deep knowledge of international tax laws and regulations. 
Your role is to provide clear, accurate, and personalized tax advice based on the user's financial information.
Be professional but friendly. Structure your response with clear sections.
Always remind the user that this is general advice and they should consult a certified tax professional for their specific situation."""

def build_user_prompt(data: TaxForm) -> str:
    return f"""Please provide tax advice for the following profile:
- Country: {data.country}
- Employment Status: {data.employment_status}
- Annual Income: {data.income} (local currency)
- Annual Expenses: {data.expenses} (local currency)
- Marital Status: {data.marital_status}
- Number of Children: {data.number_of_children}
"""