import os
from groq import Groq
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
                print("✅ Groq API initialized successfully")
            except Exception as e:
                print(f"⚠️ Groq API initialization failed: {e}")
        else:
            print("⚠️ GROQ_API_KEY not set. Using mock responses.")

    def generate_explanation(self, risk_data: dict, user_explanation: str) -> str:
        if not self.client:
            # Enhanced mock response
            return self._generate_mock_explanation(risk_data, user_explanation)
        
        try:
            prompt = f"""You are an expert legal advisor helping freelancers and small business owners understand contract risks.

User's Expectation: {user_explanation}

Contract Analysis Results:
- Safety Score: {risk_data['score']}/100
- Risks Found: {len(risk_data['risks'])}
- Risk Details: {risk_data['risks']}

Task: Explain the discrepancies between what the user expected and what the contract actually says. Focus on:
1. Financial risks and their impact
2. Legal consequences in plain English
3. Why these clauses are problematic
4. Real-world implications

Be direct, helpful, and avoid legalese. Use a conversational tone."""
            
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful legal assistant who explains contract risks in simple terms."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1024
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"❌ Groq API error: {e}")
            return self._generate_mock_explanation(risk_data, user_explanation)

    def generate_negotiation_email(self, risk_data: dict) -> str:
        if not self.client:
            return self._generate_mock_email(risk_data)

        try:
            prompt = f"""Generate a professional but firm negotiation email based on these contract risks:

Safety Score: {risk_data['score']}/100
Risks: {risk_data['risks']}

The email should:
1. Be polite and professional
2. Reference specific problematic clauses
3. Propose fair alternatives
4. Maintain a collaborative tone
5. Be ready to send (include Subject line)

Format as a complete email."""
            
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional contract negotiator who writes clear, firm but polite emails."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.6,
                max_tokens=800
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"❌ Groq API error: {e}")
            return self._generate_mock_email(risk_data)

    def _generate_mock_explanation(self, risk_data: dict, user_explanation: str) -> str:
        """Generate a detailed mock explanation when Groq is unavailable"""
        risks = risk_data.get('risks', [])
        score = risk_data.get('score', 0)
        
        explanation = f"Based on my analysis, I've identified {len(risks)} significant concern(s) in this contract.\n\n"
        
        if score < 50:
            explanation += "⚠️ **Critical Issues Detected**\n\nThis contract has several red flags that could expose you to significant financial and legal risks:\n\n"
        elif score < 80:
            explanation += "⚠️ **Moderate Concerns**\n\nWhile not terrible, this contract has some clauses that don't align with your expectations:\n\n"
        else:
            explanation += "✅ **Generally Fair Contract**\n\nThis contract is relatively balanced, but there are still a few points to consider:\n\n"
        
        for i, risk in enumerate(risks, 1):
            category = risk.get('category', 'Unknown')
            finding = risk.get('finding', '')
            severity = risk.get('severity', 'Unknown')
            
            explanation += f"**{i}. {category}** ({severity} Risk)\n"
            explanation += f"{finding}\n\n"
            
            # Add specific advice based on category
            if "payment" in category.lower():
                explanation += "💡 *Why this matters:* Extended payment terms hurt your cash flow. You'll be working for free for months while waiting to get paid. This is especially risky if the client has financial issues.\n\n"
            elif "termination" in category.lower():
                explanation += "💡 *Why this matters:* Without notice requirements, you could lose your income overnight with no time to find replacement work. This creates financial instability.\n\n"
            elif "liability" in category.lower():
                explanation += "💡 *Why this matters:* Unlimited liability means you could lose personal assets (house, savings) if something goes wrong. This is an unacceptable risk for most contractors.\n\n"
            elif "intellectual property" in category.lower() or "ip" in category.lower():
                explanation += "💡 *Why this matters:* Losing rights to your pre-existing work means you can't reuse your own tools and methods for other clients. This limits your future earning potential.\n\n"
        
        explanation += "\n**Bottom Line:** "
        if score < 50:
            explanation += "I strongly recommend negotiating these terms before signing. The current contract heavily favors the client and puts you at significant risk."
        elif score < 80:
            explanation += "You should negotiate the key issues identified above. The contract is workable but could be much fairer."
        else:
            explanation += "This is a reasonably fair contract. Consider the minor points above, but you're in decent shape overall."
        
        return explanation

    def _generate_mock_email(self, risk_data: dict) -> str:
        """Generate a mock negotiation email when Groq is unavailable"""
        risks = risk_data.get('risks', [])
        
        email = """Subject: Contract Review - Proposed Amendments

Dear [Client Name],

Thank you for sending over the service agreement. I've reviewed the terms and I'm excited to work together. However, I'd like to discuss a few clauses that I believe would benefit from adjustment to create a more balanced partnership.

"""
        
        for i, risk in enumerate(risks, 1):
            category = risk.get('category', 'Unknown')
            
            if "payment" in category.lower():
                email += f"{i}. **Payment Terms**: I noticed the payment terms are Net 90. For cash flow purposes, I'd like to propose Net 30, which is industry standard for this type of work.\n\n"
            elif "termination" in category.lower():
                email += f"{i}. **Termination Notice**: I'd like to request mutual 30-day termination notice. This gives both parties time to plan and ensures a smooth transition if needed.\n\n"
            elif "liability" in category.lower():
                email += f"{i}. **Liability Cap**: I'd like to propose capping liability at the total contract value or $[X], whichever is greater. This is standard practice and protects both parties.\n\n"
            elif "intellectual property" in category.lower() or "ip" in category.lower():
                email += f"{i}. **Intellectual Property**: I'd like to clarify that while you'll own the work product created for this project, I retain rights to my pre-existing tools, methods, and general knowledge.\n\n"
        
        email += """I believe these changes will create a more equitable agreement while still protecting your interests. I'm happy to discuss these points at your convenience.

Looking forward to working together!

Best regards,
[Your Name]"""
        
        return email

llm_service = LLMService()
