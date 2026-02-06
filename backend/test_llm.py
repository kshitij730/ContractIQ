# Quick test to verify Groq API is working
import sys
sys.path.insert(0, 'c:/Users/kshitij sharma/.gemini/antigravity/scratch/ContractAI/backend')

from app.services.llm import llm_service

# Test the service
test_risk_data = {
    "score": 30,
    "risks": [
        {
            "category": "Payment Terms",
            "severity": "High",
            "finding": "Payment terms are Net 90, which is very long."
        }
    ]
}

print("Testing LLM Service...")
print("=" * 50)

explanation = llm_service.generate_explanation(test_risk_data, "I expect Net 30 payment")
print("\n✅ Explanation generated:")
print(explanation[:200] + "...")

email = llm_service.generate_negotiation_email(test_risk_data)
print("\n✅ Email generated:")
print(email[:200] + "...")

print("\n" + "=" * 50)
print("✅ LLM Service is working!")
