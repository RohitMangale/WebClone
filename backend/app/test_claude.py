import anthropic
import os
from dotenv import load_dotenv
load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

resp = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=100,
    system="Test Claude connection",
    messages=[{"role": "user", "content": "Hello Claude, respond with 'OK'."}]
)

print(resp.content[0].text)
