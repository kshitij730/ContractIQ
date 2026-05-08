import json
import re

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

    def generate_self_reflective_verdict(self, contract_text: str, user_explanation: str, risk_data: dict) -> list[dict]:
        """Run mandatory draft -> self-critique -> final verdict analysis."""
        if not self.client:
            return self._generate_mock_legal_verdicts(risk_data)

        try:
            prompt = f"""You are ContractIQ's self-reflective legal analysis agent. You operate in 3 strict phases.

PHASE 1 - DRAFT ANALYSIS:
Analyze the provided contract clause(s) for legal risks. Identify: liability exposure, ambiguous language, missing protections, and enforceability issues under Indian Contract Act 1872.

PHASE 2 - SELF-CRITIQUE:
Now act as a skeptical senior lawyer reviewing your own Phase 1 output. Challenge every risk you identified:
- Is this actually risky, or is it standard boilerplate?
- Did you miss any hidden risks?
- Are your severity ratings justified?
- What would opposing counsel say?
List all corrections, upgrades, or retractions internally.

PHASE 3 - FINAL VERDICT:
Produce the refined analysis incorporating Phase 2 corrections. For each risk, output:
{{
  "clause": "<exact clause text>",
  "risk_type": "<liability|ambiguity|missing_protection|enforceability>",
  "severity": "<critical|high|medium|low>",
  "causal_chain": "<why this is risky, step by step>",
  "confidence": <0.0-1.0>,
  "recommendation": "<specific fix>"
}}

RULES:
- Never skip Phase 2. Self-critique is mandatory.
- If confidence < 0.7, include "Flag for human review:" at the start of the recommendation.
- Output only valid JSON for Phase 3. No prose, no markdown.
- Output a JSON array of verdict objects.
- Use Indian Contract Act 1872 context, but do not claim certainty where facts are incomplete.

User expectation:
{user_explanation}

Initial machine risk signals:
{risk_data.get('risks', [])}

Contract text:
{contract_text[:12000]}"""

            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a self-critical Indian contract-risk analysis agent. Internally perform draft and critique, then output only final JSON."
                    },
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.3-70b-versatile",
                temperature=0.2,
                max_tokens=1800,
            )
            content = chat_completion.choices[0].message.content or "[]"
            return self._parse_legal_verdicts(content)
        except Exception as e:
            print(f"Groq reflective verdict error: {e}")
            return self._generate_mock_legal_verdicts(risk_data)

    def generate_causal_analyses(self, contract_text: str, risk_data: dict) -> list[dict]:
        clause_candidates = self._extract_clause_candidates(contract_text, risk_data)
        if not self.client:
            return self._generate_mock_causal_analyses(risk_data)

        try:
            prompt = f"""You are ContractIQ's causal legal reasoning engine. Your job is NOT to label risks - it is to explain WHY something is a risk using a causal chain.

For each risky clause provided, produce a causal analysis in this exact format:

CAUSE -> MECHANISM -> CONSEQUENCE -> LEGAL BASIS

For each clause:
1. Identify the root cause (what is missing or ambiguous)
2. Trace the mechanism (how does this cause harm)
3. State the consequence (what actually happens to the client)
4. Cite the legal basis (Indian Contract Act / Specific Relief Act / relevant case law if known)
5. Assign: severity (critical/high/medium/low), likelihood (0.0-1.0), impact (0.0-1.0)

Output as JSON array. No generic warnings. Every risk must have a complete causal chain or it must not be reported.

Use this JSON shape:
{{
  "clause": "<text>",
  "cause": "<root cause>",
  "mechanism": "<harm mechanism>",
  "consequence": "<client-facing result>",
  "legal_basis": "<Indian legal basis>",
  "severity": "<critical|high|medium|low>",
  "likelihood": <0.0-1.0>,
  "impact": <0.0-1.0>
}}

Clause candidates:
{clause_candidates}"""

            content = self._complete_json_prompt(prompt, 1400)
            return self._parse_causal_analyses(content)
        except Exception as e:
            print(f"Causal analysis error: {e}")
            return self._generate_mock_causal_analyses(risk_data)

    def generate_clause_debates(self, contract_text: str, risk_data: dict) -> list[dict]:
        clause_candidates = self._extract_clause_candidates(contract_text, risk_data)
        if not self.client:
            return self._generate_mock_clause_debates(risk_data)

        try:
            prompt = f"""You are running a structured legal debate between two AI agents analyzing a contract clause.

AGENT A - CLIENT'S LAWYER:
Argue why this clause PROTECTS the client. Find every favorable interpretation. Use Indian contract law to support your position. Be aggressive in the client's defense.

AGENT B - OPPOSING COUNSEL:
Argue why this same clause HARMS the client or can be exploited by the other party. Find every loophole, ambiguity, and risk. Use Indian contract law to support your position.

MODERATOR:
After both agents argue, synthesize:
- Points of agreement (objective risks both sides acknowledge)
- Points of dispute (interpretation differences)
- Final balanced risk score: 0-100
- Net recommendation: SIGN / NEGOTIATE / REJECT

Output JSON array of:
{{
  "clause": "<text>",
  "agent_a_argument": "<client lawyer's position>",
  "agent_b_argument": "<opposing counsel's position>",
  "agreed_risks": ["<risk1>"],
  "disputed_interpretations": ["<point1>"],
  "risk_score": <0-100>,
  "verdict": "SIGN|NEGOTIATE|REJECT",
  "negotiation_leverage": "<what client can demand>"
}}

Clauses to debate:
{clause_candidates}"""

            content = self._complete_json_prompt(prompt, 1800)
            return self._parse_clause_debates(content)
        except Exception as e:
            print(f"Clause debate error: {e}")
            return self._generate_mock_clause_debates(risk_data)

    def generate_memory_insights(self, contract_text: str, risk_data: dict, retrieved_chunks: str = "") -> list[dict]:
        clause_candidates = self._extract_clause_candidates(contract_text, risk_data)
        memory_context = retrieved_chunks.strip() or "No similar cases retrieved from memory."
        if not self.client:
            return self._generate_mock_memory_insights(clause_candidates, risk_data, has_memory=bool(retrieved_chunks.strip()))

        try:
            insights = []
            for clause in clause_candidates:
                prompt = f"""You are ContractIQ's legal memory retrieval agent. You have access to a vector database of past contract analyses and Indian court judgments.

Given a new contract clause, your job is to:

1. IDENTIFY the clause type (payment / termination / indemnity / IP / liability / NDA / arbitration / force majeure / other)

2. RETRIEVE similar past cases from memory context provided below:
[MEMORY CONTEXT: {memory_context}]

3. SYNTHESIZE precedent insight:
- How were similar clauses treated in past disputes?
- Which party typically wins when this clause is contested?
- What modifications made similar clauses enforceable?

4. OUTPUT:
{{
  "clause_type": "<type>",
  "similar_cases_found": <integer>,
  "precedent_summary": "<2-3 sentence insight>",
  "historical_risk_level": "<critical|high|medium|low>",
  "winning_party_in_disputes": "<client|counterparty|split>",
  "recommended_modification": "<specific language change>"
}}

If no similar cases found, say so explicitly. Never hallucinate precedents.

Clause:
{clause}"""

                content = self._complete_json_prompt(prompt, 700)
                parsed = self._parse_memory_insights(content, clause)
                if parsed:
                    insights.append(parsed)
            return insights
        except Exception as e:
            print(f"Memory insight error: {e}")
            return self._generate_mock_memory_insights(clause_candidates, risk_data, has_memory=bool(retrieved_chunks.strip()))

    def generate_outcome_simulation(self, risk_data: dict, contract_text: str) -> dict:
        if not self.client:
            return self._generate_mock_outcome_simulation(risk_data)

        try:
            prompt = f"""You are ContractIQ's contract outcome simulation engine. Given a set of contract risk factors, simulate probable real-world outcomes.

INPUT FORMAT you will receive:
- Contract type: service agreement
- Identified risks: {risk_data.get('risks', [])}
- Jurisdiction: India (central context, unless clause-specific state detail is explicit)
- Contract value: 500000 INR
- Parties: client/service provider vs counterparty/client
- Contract summary: {risk_data.get('contract_summary')}

YOUR TASK:
Run a structured probabilistic simulation across 3 scenarios:

SCENARIO A - BEST CASE (client-favorable interpretation):
What happens if every ambiguous clause is interpreted in client's favor?

SCENARIO B - MOST LIKELY CASE (neutral interpretation):
Based on identified risks and precedent, what is the realistic outcome?

SCENARIO C - WORST CASE (counterparty exploits all gaps):
What happens if every loophole is used against the client?

For each scenario output:
{{
  "scenario": "best|likely|worst",
  "dispute_probability": <0.0-1.0>,
  "estimated_financial_exposure_INR": <amount>,
  "time_to_resolution_months": <integer>,
  "key_trigger": "<what event causes this outcome>",
  "prevention": "<one specific contract change that avoids this>"
}}

Final output:
{{
  "overall_risk_score": <0-100>,
  "go_no_go_recommendation": "<SIGN|NEGOTIATE|REJECT>",
  "highest_priority_clause_to_fix": "<specific clause>",
  "scenarios": [ ...three scenario objects... ]
}}

RULES:
- Base estimates on Indian commercial litigation norms.
- Be specific with numbers. No vague ranges.
- Keep the three scenarios meaningfully distinct.
- Tie each scenario to the identified risks rather than generic business advice.

Contract text:
{contract_text[:9000]}"""

            content = self._complete_json_prompt(prompt, 1500)
            return self._parse_outcome_simulation(content)
        except Exception as e:
            print(f"Outcome simulation error: {e}")
            return self._generate_mock_outcome_simulation(risk_data)

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
- Self-reflective legal verdicts: {analysis.get('legal_verdicts', [])}
- Causal analyses: {analysis.get('causal_analyses', [])}
- Clause debates: {analysis.get('clause_debates', [])}
- Memory insights: {analysis.get('memory_insights', [])}
- Outcome simulation: {analysis.get('outcome_simulation')}
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

    def _parse_legal_verdicts(self, content: str) -> list[dict]:
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\[[\s\S]*\]", content)
            parsed = json.loads(match.group(0)) if match else []

        if isinstance(parsed, dict):
            parsed = [parsed]
        if not isinstance(parsed, list):
            return []

        verdicts = []
        allowed_types = {"liability", "ambiguity", "missing_protection", "enforceability"}
        allowed_severities = {"critical", "high", "medium", "low"}

        for item in parsed:
            if not isinstance(item, dict):
                continue

            confidence = self._coerce_confidence(item.get("confidence", 0.65))
            recommendation = str(item.get("recommendation", "Review this clause with a qualified lawyer.")).strip()
            if confidence < 0.7 and not recommendation.lower().startswith("flag for human review"):
                recommendation = f"Flag for human review: {recommendation}"

            verdicts.append({
                "clause": str(item.get("clause", "")).strip() or "Clause text unavailable",
                "risk_type": item.get("risk_type") if item.get("risk_type") in allowed_types else "ambiguity",
                "severity": item.get("severity") if item.get("severity") in allowed_severities else "medium",
                "causal_chain": str(item.get("causal_chain", "")).strip() or "The clause needs further review because the risk chain was not clearly established.",
                "confidence": confidence,
                "recommendation": recommendation,
            })

        return verdicts[:8]

    def _parse_causal_analyses(self, content: str) -> list[dict]:
        parsed = self._parse_json_payload(content, expect_list=True)
        items = []
        for item in parsed:
            if not isinstance(item, dict):
                continue
            items.append({
                "clause": str(item.get("clause", "")).strip() or "Clause text unavailable",
                "cause": str(item.get("cause", "")).strip() or "Root cause unclear",
                "mechanism": str(item.get("mechanism", "")).strip() or "Harm mechanism unclear",
                "consequence": str(item.get("consequence", "")).strip() or "Client consequence unclear",
                "legal_basis": str(item.get("legal_basis", "")).strip() or "Needs legal validation under Indian law",
                "severity": self._normalize_severity(item.get("severity")),
                "likelihood": self._coerce_confidence(item.get("likelihood", 0.65)),
                "impact": self._coerce_confidence(item.get("impact", 0.65)),
            })
        return items[:8]

    def _parse_clause_debates(self, content: str) -> list[dict]:
        parsed = self._parse_json_payload(content, expect_list=True)
        items = []
        for item in parsed:
            if not isinstance(item, dict):
                continue
            items.append({
                "clause": str(item.get("clause", "")).strip() or "Clause text unavailable",
                "agent_a_argument": str(item.get("agent_a_argument", "")).strip() or "No favorable interpretation identified.",
                "agent_b_argument": str(item.get("agent_b_argument", "")).strip() or "No adverse interpretation identified.",
                "agreed_risks": self._coerce_string_list(item.get("agreed_risks")),
                "disputed_interpretations": self._coerce_string_list(item.get("disputed_interpretations")),
                "risk_score": self._coerce_score(item.get("risk_score", 50)),
                "verdict": self._normalize_verdict(item.get("verdict")),
                "negotiation_leverage": str(item.get("negotiation_leverage", "")).strip() or "Seek clarifying language and better risk allocation.",
            })
        return items[:8]

    def _parse_memory_insights(self, content: str, clause: str) -> dict | None:
        parsed = self._parse_json_payload(content, expect_list=False)
        if not isinstance(parsed, dict):
            return None

        return {
            "clause": clause,
            "clause_type": str(parsed.get("clause_type", "other")).strip() or "other",
            "similar_cases_found": max(0, int(parsed.get("similar_cases_found", 0) or 0)),
            "precedent_summary": str(parsed.get("precedent_summary", "")).strip() or "No similar cases found in the available memory context.",
            "historical_risk_level": self._normalize_severity(parsed.get("historical_risk_level")),
            "winning_party_in_disputes": self._normalize_memory_winner(parsed.get("winning_party_in_disputes")),
            "recommended_modification": str(parsed.get("recommended_modification", "")).strip() or "Tighten the clause with objective triggers, caps, and notice periods.",
        }

    def _parse_outcome_simulation(self, content: str) -> dict:
        parsed = self._parse_json_payload(content, expect_list=False)
        if not isinstance(parsed, dict):
            return self._generate_mock_outcome_simulation({"risks": []})

        scenarios = []
        for scenario in parsed.get("scenarios", []):
            if not isinstance(scenario, dict):
                continue
            scenarios.append({
                "scenario": self._normalize_scenario(scenario.get("scenario")),
                "dispute_probability": self._coerce_confidence(scenario.get("dispute_probability", 0.5)),
                "estimated_financial_exposure_INR": self._coerce_amount(scenario.get("estimated_financial_exposure_INR", 100000)),
                "time_to_resolution_months": max(1, int(scenario.get("time_to_resolution_months", 12) or 12)),
                "key_trigger": str(scenario.get("key_trigger", "")).strip() or "Ambiguous clause gets tested after a payment or termination event.",
                "prevention": str(scenario.get("prevention", "")).strip() or "Rewrite the risky clause with clear obligations and remedies.",
            })

        return {
            "overall_risk_score": self._coerce_score(parsed.get("overall_risk_score", 55)),
            "go_no_go_recommendation": self._normalize_verdict(parsed.get("go_no_go_recommendation")),
            "highest_priority_clause_to_fix": str(parsed.get("highest_priority_clause_to_fix", "")).strip() or "Highest-risk clause needs clarification.",
            "scenarios": scenarios[:3],
        }

    def _parse_json_payload(self, content: str, expect_list: bool):
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            pattern = r"\[[\s\S]*\]" if expect_list else r"\{[\s\S]*\}"
            match = re.search(pattern, content)
            parsed = json.loads(match.group(0)) if match else ([] if expect_list else {})
        return parsed

    def _complete_json_prompt(self, prompt: str, max_tokens: int) -> str:
        chat_completion = self.client.chat.completions.create(
            messages=[
                {"role": "system", "content": "Return only valid JSON. No markdown. No prose outside JSON."},
                {"role": "user", "content": prompt},
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            max_tokens=max_tokens,
        )
        return chat_completion.choices[0].message.content or "[]"

    def _extract_clause_candidates(self, contract_text: str, risk_data: dict) -> list[str]:
        candidates = []
        for risk in risk_data.get("risks", []):
            finding = str(risk.get("finding", "")).strip()
            if finding and finding not in candidates:
                candidates.append(finding)

        if len(candidates) < 3:
            for line in contract_text.splitlines():
                cleaned = line.strip()
                if len(cleaned) > 35 and cleaned not in candidates:
                    candidates.append(cleaned)
                if len(candidates) >= 5:
                    break

        return candidates[:5]

    def _coerce_confidence(self, value) -> float:
        try:
            confidence = float(value)
        except (TypeError, ValueError):
            confidence = 0.65
        return max(0.0, min(1.0, confidence))

    def _coerce_score(self, value) -> int:
        try:
            score = int(float(value))
        except (TypeError, ValueError):
            score = 50
        return max(0, min(100, score))

    def _coerce_amount(self, value) -> int:
        try:
            amount = int(float(value))
        except (TypeError, ValueError):
            amount = 100000
        return max(0, amount)

    def _normalize_severity(self, value) -> str:
        value_str = str(value or "medium").strip().lower()
        if value_str in {"critical", "high", "medium", "low"}:
            return value_str
        return "medium"

    def _normalize_verdict(self, value) -> str:
        value_str = str(value or "NEGOTIATE").strip().upper()
        if value_str in {"SIGN", "NEGOTIATE", "REJECT"}:
            return value_str
        return "NEGOTIATE"

    def _normalize_winning_party(self, value) -> str:
        value_str = str(value or "unknown").strip().lower()
        if value_str in {"client", "counterparty", "split", "unknown"}:
            return value_str
        return "unknown"

    def _normalize_memory_winner(self, value) -> str:
        value_str = str(value or "split").strip().lower()
        if value_str in {"client", "counterparty", "split"}:
            return value_str
        return "split"

    def _normalize_scenario(self, value) -> str:
        value_str = str(value or "likely").strip().lower()
        if value_str in {"best", "likely", "worst"}:
            return value_str
        return "likely"

    def _coerce_string_list(self, value) -> list[str]:
        if isinstance(value, list):
            return [str(item).strip() for item in value if str(item).strip()]
        if isinstance(value, str) and value.strip():
            return [value.strip()]
        return []

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

    def _generate_mock_legal_verdicts(self, risk_data: dict) -> list[dict]:
        verdicts = []
        for risk in risk_data.get("risks", [])[:6]:
            category = risk.get("category", "Contract Risk")
            finding = risk.get("finding", "Potentially risky clause")
            severity = {
                "Critical": "critical",
                "Severe": "high",
                "High": "high",
                "Medium": "medium",
            }.get(risk.get("severity"), "medium")

            if "liability" in category.lower():
                risk_type = "liability"
            elif "termination" in category.lower() or "payment" in category.lower():
                risk_type = "missing_protection"
            elif "jurisdiction" in category.lower():
                risk_type = "enforceability"
            else:
                risk_type = "ambiguity"

            confidence = self._coerce_confidence(risk.get("confidence", 0.68))
            recommendation = "Add precise limits, mutual obligations, and objective cure/notice periods before signing."
            if confidence < 0.7:
                recommendation = f"Flag for human review: {recommendation}"

            verdicts.append({
                "clause": finding,
                "risk_type": risk_type,
                "severity": severity,
                "causal_chain": (
                    f"The clause signals {category.lower()} risk; if enforced broadly, it may shift bargaining power or financial exposure; "
                    "under Indian Contract Act 1872 principles, uncertainty, consent context, or one-sided obligations may require closer review."
                ),
                "confidence": confidence,
                "recommendation": recommendation,
            })
        return verdicts

    def _generate_mock_causal_analyses(self, risk_data: dict) -> list[dict]:
        items = []
        for risk in risk_data.get("risks", [])[:6]:
            clause = risk.get("finding", "Potentially risky clause")
            items.append({
                "clause": clause,
                "cause": f"The clause creates {risk.get('category', 'contract')} uncertainty or imbalance.",
                "mechanism": "The wording leaves room for one party to exercise discretion without a clear limiting standard.",
                "consequence": "The client may face delay, payment pressure, reduced remedies, or unexpected liability when the clause is enforced.",
                "legal_basis": "Requires closer review under Indian Contract Act 1872 principles on certainty, consent, reciprocal promises, and reasonableness of obligations.",
                "severity": self._normalize_severity(risk.get("severity")),
                "likelihood": self._coerce_confidence(risk.get("confidence", 0.62)),
                "impact": self._coerce_confidence(0.74),
            })
        return items

    def _generate_mock_clause_debates(self, risk_data: dict) -> list[dict]:
        items = []
        for risk in risk_data.get("risks", [])[:5]:
            severity = self._normalize_severity(risk.get("severity"))
            score = {"critical": 85, "high": 72, "medium": 58, "low": 34}.get(severity, 55)
            items.append({
                "clause": risk.get("finding", "Clause text unavailable"),
                "agent_a_argument": "A client-friendly reading can imply commercial reasonableness, mutual cooperation, and an obligation to act in good faith within the contract structure.",
                "agent_b_argument": "An adverse reading lets the stronger party exploit ambiguity, delay performance, or broaden remedies because the clause lacks objective limits.",
                "agreed_risks": [f"{risk.get('category', 'Contract')} wording can create dispute friction."],
                "disputed_interpretations": ["Whether the clause will be read narrowly as standard boilerplate or broadly in the counterparty's favor."],
                "risk_score": score,
                "verdict": "REJECT" if score > 80 else "NEGOTIATE",
                "negotiation_leverage": "Ask for objective triggers, reciprocal duties, explicit cure periods, and a liability/payment boundary tied to contract value.",
            })
        return items

    def _generate_mock_memory_insights(self, clause_candidates: list[str], risk_data: dict, has_memory: bool) -> list[dict]:
        items = []
        for index, clause in enumerate(clause_candidates[:5]):
            category = str(risk_data.get("risks", [{}])[index].get("category", "")).lower() if index < len(risk_data.get("risks", [])) else ""
            clause_type = "other"
            if "payment" in category:
                clause_type = "payment"
            elif "termination" in category:
                clause_type = "termination"
            elif "liability" in category:
                clause_type = "liability"
            elif "intellectual" in category or "ip" in category:
                clause_type = "IP"

            summary = (
                "No similar cases found in the available memory context."
                if not has_memory
                else "Retrieved context suggests these clauses are often litigated when drafting leaves notice periods, caps, or ownership carve-outs unclear."
            )
            items.append({
                "clause": clause,
                "clause_type": clause_type,
                "similar_cases_found": 0 if not has_memory else 2,
                "precedent_summary": summary,
                "historical_risk_level": self._normalize_severity(risk_data.get("risks", [{}])[index].get("severity") if index < len(risk_data.get("risks", [])) else "medium"),
                "winning_party_in_disputes": "split",
                "recommended_modification": "Add concrete timelines, cap exposure, and preserve pre-existing rights through explicit carve-outs.",
            })
        return items

    def _generate_mock_outcome_simulation(self, risk_data: dict) -> dict:
        top_clause = risk_data.get("risks", [{}])[0].get("finding", "Highest-risk clause needs clarification.")
        risk_count = max(1, len(risk_data.get("risks", [])))
        base_score = min(92, 35 + risk_count * 9)
        return {
            "overall_risk_score": base_score,
            "go_no_go_recommendation": "REJECT" if base_score > 80 else "NEGOTIATE",
            "highest_priority_clause_to_fix": top_clause,
            "scenarios": [
                {
                    "scenario": "best",
                    "dispute_probability": 0.22,
                    "estimated_financial_exposure_INR": 75000,
                    "time_to_resolution_months": 4,
                    "key_trigger": "The parties cooperate and interpret the clause narrowly.",
                    "prevention": "Clarify the highest-risk clause with objective wording before signature.",
                },
                {
                    "scenario": "likely",
                    "dispute_probability": 0.46,
                    "estimated_financial_exposure_INR": 225000,
                    "time_to_resolution_months": 11,
                    "key_trigger": "A payment, termination, or delivery dispute exposes the drafting gap.",
                    "prevention": "Insert clearer notice periods, payment triggers, and liability boundaries.",
                },
                {
                    "scenario": "worst",
                    "dispute_probability": 0.74,
                    "estimated_financial_exposure_INR": 650000,
                    "time_to_resolution_months": 24,
                    "key_trigger": "The counterparty weaponizes ambiguity after a business breakdown or missed milestone.",
                    "prevention": "Reallocate the clause before signing and remove unilateral discretion.",
                },
            ],
        }

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
