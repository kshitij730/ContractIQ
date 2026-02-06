import re
from app.services.ml_service import ml_service

class RiskEngine:
    def analyze(self, contract_text: str, user_expectations: str):
        """
        Compare contract text with user expectations using a hybrid of rules and ML.
        """
        risks = []
        score = 100
        
        contract_lower = contract_text.lower()
        expectations_lower = user_expectations.lower()
        
        # 1. Deterministic Rule-Based Analysis (High Precision)
        
        # Payment Terms
        if "90 days" in contract_lower:
            risks.append({
                "category": "Payment Terms",
                "severity": "High",
                "finding": "Payment terms are Net 90, which is very long.",
                "expectation_check": "Mismatch" if ("net 15" in expectations_lower or "net 30" in expectations_lower) else "Concern"
            })
            score -= 20
            
        # Termination
        if "immediately" in contract_lower and "without notice" in contract_lower:
             risks.append({
                "category": "Termination",
                "severity": "Critical",
                "finding": "Client can terminate immediately without cause. You are not protected.",
                 "expectation_check": "Mismatch"
            })
             score -= 30

        # Liability
        if "unlimited" in contract_lower:
             risks.append({
                "category": "Liability",
                "severity": "Severe",
                "finding": "Your liability is unlimited. This is a major financial risk.",
                "expectation_check": "Mismatch"
            })
             score -= 40

        # 2. ML-Based Semantic Analysis (High Recall)
        # This catch risks that don't match exact keywords but have 'risky' meaning
        semantic_risks = ml_service.analyze_clause_semantic(contract_text)
        
        for s_risk in semantic_risks:
            # Avoid duplicate categories from rules if the finding is very similar
            is_duplicate = any(r['category'] == s_risk['category'] and (s_risk['finding'] in r['finding'] or r['finding'] in s_risk['finding']) for r in risks)
            
            if not is_duplicate:
                s_risk["expectation_check"] = "AI Flagged"
                risks.append(s_risk)
                
                # Penalty based on severity
                if s_risk["severity"] == "High":
                    score -= 15
                else:
                    score -= 10
             
        # Normalize score
        score = max(5, score) # Cap at 5 minimum for visibility
        
        # Sort risks by severity
        severity_map = {"Critical": 4, "Severe": 3, "High": 2, "Medium": 1}
        risks.sort(key=lambda x: severity_map.get(x["severity"], 0), reverse=True)
        
        return {
            "score": score,
            "risks": risks,
            "contract_summary": contract_text[:200] + "..."
        }

risk_engine = RiskEngine()
