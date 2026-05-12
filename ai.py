import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# 🌾 STRONG SYSTEM PROMPT (FIXED)
SYSTEM_PROMPT = """
You are JalAI, a real-world agricultural irrigation AI for Indian farmers.

CORE PURPOSE:
Help farmers reduce water usage and improve crop health.

STRICT RULES:
1. Detect user language automatically:
   - If input is in Kannada → respond ONLY in simple Kannada
   - If input is in English → respond ONLY in English

2. NEVER mix languages.

3. ALWAYS personalize answers using:
   - Crop type
   - Soil type
   - Weather conditions
   - Location (India/Karnataka climate awareness)

4. NEVER give generic advice like "water your crops regularly".

5. ALWAYS explain WHY irrigation is needed or not needed.

6. Keep responses:
   - short
   - practical
   - farmer-friendly
   - easy to understand (no technical jargon)

7. Focus ONLY on irrigation, farming, water saving, crop health.

8. If uncertain, prefer safe irrigation conservation advice.

OUTPUT STYLE:
- 2 to 5 short sentences maximum
- direct advice
- simple language
"""

# 🧠 AI FUNCTION
def get_ai_recommendation(prompt):

    enhanced_prompt = f"""
Farmer Query Context:
{prompt}

IMPORTANT:
Respond strictly in the same language as the farmer input.
Be practical and irrigation-focused only.
"""

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",

        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": enhanced_prompt
            }
        ]
    )

    return response.choices[0].message.content
