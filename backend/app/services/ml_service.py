import logging
import torch

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MLService:
    def __init__(self):
        self.model_name = 'all-MiniLM-L6-v2'
        self.model = None
        self.risk_patterns = {
            "Termination": [
                "terminate at any time without notice",
                "immediate cancellation by client",
                "termination for convenience",
                "no cure period for breaches"
            ],
            "Liability": [
                "unlimited liability for contractor",
                "indemnify client for all losses",
                "waive all rights to sue",
                "contractor bears all risk"
            ],
            "Payment Terms": [
                "payment within 90 days",
                "client may withhold payment for any reason",
                "non-negotiable fees",
                "late payment penalties for contractor only"
            ],
            "Intellectual Property": [
                "client owns all preexisting work",
                "contractor waives all moral rights",
                "assignment of all past and future inventions",
                "perpetual exclusive license to all tools"
            ]
        }
        self.pattern_embeddings = {}
        self.enabled = False
        self._initialize_model()

    def _initialize_model(self):
        try:
            import numpy as np
            from sentence_transformers import SentenceTransformer
            
            logger.info(f"Loading ML model: {self.model_name}...")
            # Use CPU by default for stability
            device = "cuda" if torch.cuda.is_available() else "cpu"
            self.model = SentenceTransformer(self.model_name, device=device)
            
            # Pre-calculate embeddings for risk patterns
            for category, patterns in self.risk_patterns.items():
                self.pattern_embeddings[category] = self.model.encode(patterns)
            
            self.enabled = True
            logger.info("✅ ML Model loaded successfully")
        except ImportError as e:
            logger.error(f"⚠️ ML dependencies missing: {e}. Semantic analysis disabled.")
            self.enabled = False
        except Exception as e:
            logger.error(f"❌ Failed to load ML model: {e}")
            self.enabled = False

    def analyze_clause_semantic(self, text: str, threshold: float = 0.45):
        """
        Uses semantic similarity to detect risks that might not use exact keywords.
        """
        if not self.enabled or self.model is None:
            return []

        try:
            import numpy as np
            from sklearn.metrics.pairwise import cosine_similarity
            
            # Split text into sentences/clauses (rough split)
            sentences = [s.strip() for s in text.replace('\n', '. ').split('.') if len(s.strip()) > 10]
            if not sentences:
                return []

            sentence_embeddings = self.model.encode(sentences)
            semantic_risks = []

            for i, s_emb in enumerate(sentence_embeddings):
                for category, p_embs in self.pattern_embeddings.items():
                    similarities = cosine_similarity([s_emb], p_embs)[0]
                    max_sim = np.max(similarities)
                    
                    if max_sim > threshold:
                        semantic_risks.append({
                            "category": category,
                            "finding": sentences[i],
                            "severity": "High" if max_sim > 0.65 else "Medium",
                            "confidence": float(max_sim)
                        })

            # De-duplicate: Keep highest confidence per sentence
            refined_risks = []
            seen_sentences = set()
            for risk in sorted(semantic_risks, key=lambda x: x['confidence'], reverse=True):
                if risk['finding'] not in seen_sentences:
                    refined_risks.append(risk)
                    seen_sentences.add(risk['finding'])

            return refined_risks
        except Exception as e:
            logger.error(f"Error during ML analysis: {e}")
            return []

ml_service = MLService()
