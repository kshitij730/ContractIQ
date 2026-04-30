from groq import Groq
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
            try:
                self.client = Groq(api_key=settings.GROQ_API_KEY)
                print("Groq API initialized successfully")
            except Exception as e:
                print(f"Groq API initialization failed: {e}")
        else:
            print("GROQ_API_KEY not set. Using local fallback responses.")

    def generate_explanation(self, risk_data: dict, user_explanation: str) -> str:
        if not self.client:
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
                    {"role": "system", "content": "You explain contract risks in simple, careful terms. You are not a substitute for a lawyer."},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1024,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API error: {e}")
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
5. Be ready to send and include a subject line

Format as a complete email."""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a professional contract negotiator who writes clear, firm, polite emails."},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.6,
                max_tokens=800,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API error: {e}")
            return self._generate_mock_email(risk_data)

    def answer_contract_question(self, question: str, analysis: dict, user_explanation: str = "") -> str:
        """Answer follow-up questions using the user's specific analysis context."""
        if not self.client:
            return self._generate_mock_chat_answer(question, analysis)

        try:
            prompt = f"""Answer this follow-up question about a contract analysis.

User expectation:
{user_explanation or "Not provided"}

Analysis context:
- Safety score: {analysis.get('score')}/100
- Contract summary: {analysis.get('contract_summary')}
- Risks: {analysis.get('risks', [])}
- AI assessment: {analysis.get('explanation')}
- Negotiation draft: {analysis.get('negotiation_email')}

Question:
{question}

Give a direct, practical answer in plain English. Stay grounded in the analysis context. If the user asks for legal certainty, remind them this is informational and not a substitute for a lawyer."""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a careful contract analysis assistant. Stay grounded in the provided analysis context."},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.4,
                max_tokens=700,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            print(f"Groq API chat error: {e}")
            return self._generate_mock_chat_answer(question, analysis)

    def _generate_mock_explanation(self, risk_data: dict, user_explanation: str) -> str:
        risks = risk_data.get("risks", [])
        score = risk_data.get("score", 0)
        explanation = f"Based on the contract text and your expectation, I found {len(risks)} concern(s).\n\n"

        if score < 50:
            explanation += "**Critical issues detected**\n\nThis contract contains terms that could create significant financial or legal exposure.\n\n"
        elif score < 80:
            explanation += "**Moderate concerns**\n\nThe contract may be workable, but several clauses should be clarified or negotiated.\n\n"
        else:
            explanation += "**Generally fair contract**\n\nThe contract looks relatively balanced, with a few points worth reviewing.\n\n"

        for i, risk in enumerate(risks, 1):
            category = risk.get("category", "Unknown")
            finding = risk.get("finding", "")
            severity = risk.get("severity", "Unknown")
            explanation += f"**{i}. {category}** ({severity})\n{finding}\n\n"

            if "payment" in category.lower():
                explanation += "Why this matters: long payment windows can hurt cash flow and leave you financing the project.\n\n"
            elif "termination" in category.lower():
                explanation += "Why this matters: weak notice protection can cause sudden income loss or unfinished transition work.\n\n"
            elif "liability" in category.lower():
                explanation += "Why this matters: uncapped liability can expose personal or business assets beyond the contract value.\n\n"
            elif "intellectual property" in category.lower() or "ip" in category.lower():
                explanation += "Why this matters: broad IP transfer language can limit reuse of your own tools, templates, or know-how.\n\n"

        explanation += "**Bottom line:** "
        if score < 50:
            explanation += "Do not sign without negotiating the critical clauses and considering professional legal review."
        elif score < 80:
            explanation += "Negotiate the highlighted clauses before signing so the contract matches the deal you expected."
        else:
            explanation += "You are in a better position, but still confirm the flagged details before signing."

        return explanation

    def _generate_mock_email(self, risk_data: dict) -> str:
        risks = risk_data.get("risks", [])
        email = """Subject: Contract Review - Proposed Amendments

Dear [Client Name],

Thank you for sending over the agreement. I am excited about the opportunity to work together. I reviewed the terms and would like to propose a few adjustments so the agreement reflects a balanced partnership.

"""

        for i, risk in enumerate(risks, 1):
            category = risk.get("category", "Unknown")
            if "payment" in category.lower():
                email += f"{i}. Payment Terms: I would like to adjust the payment window to Net 30, which is more practical for project cash flow.\n\n"
            elif "termination" in category.lower():
                email += f"{i}. Termination Notice: I would like mutual advance notice, ideally 14-30 days, to allow both parties to transition cleanly.\n\n"
            elif "liability" in category.lower():
                email += f"{i}. Liability Cap: I propose limiting liability to the fees paid under the agreement or another mutually agreed cap.\n\n"
            elif "intellectual property" in category.lower() or "ip" in category.lower():
                email += f"{i}. Intellectual Property: I would like to clarify that project deliverables transfer as agreed, while my pre-existing tools, templates, and know-how remain mine.\n\n"
            else:
                email += f"{i}. {category}: I would like to clarify this clause so both sides understand the scope and risk allocation.\n\n"

        email += """I believe these changes protect both parties while keeping the collaboration moving forward. I am happy to discuss and align on wording.

Best regards,
[Your Name]"""
        return email

    def _generate_mock_chat_answer(self, question: str, analysis: dict) -> str:
        question_lower = question.lower()
        risks = analysis.get("risks", [])

        if not risks:
            return "I do not see specific risks in the current analysis. You can still ask about payment, termination, liability, IP ownership, or any clause you want to double-check."

        matching_risks = [
            risk for risk in risks
            if risk.get("category", "").lower() in question_lower
            or any(word in risk.get("finding", "").lower() for word in question_lower.split() if len(word) > 4)
        ]
        selected = matching_risks[:2] or risks[:2]

        answer = "Based on this contract analysis, the most relevant point is:\n\n"
        for risk in selected:
            answer += f"- {risk.get('category')} ({risk.get('severity')}): {risk.get('finding')}\n"
            answer += f"  Reality check: {risk.get('expectation_check', 'Review needed')}\n"

        answer += "\nPractical next step: ask for narrower, clearer wording before signing. This is informational, not formal legal advice."
        return answer

llm_service = LLMService()
