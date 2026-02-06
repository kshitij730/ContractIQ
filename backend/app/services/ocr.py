import random

class OCRService:
    def process_file(self, file_path: str) -> str:
        """
        Extract text from file.
        In a real prod env, this would use docTR.
        For now, we will fallback to simple text reading or mock for demo if docTR fails/missing.
        """
        try:
            # Placeholder for docTR implementation
            # from doctr.io import DocumentFile
            # from doctr.models import ocr_predictor
            # model = ocr_predictor(pretrained=True)
            # doc = DocumentFile.from_pdf(file_path)
            # result = model(doc)
            # return result.render()
            
            # Simple fallback for text files or mock
            if file_path.endswith(".txt"):
                with open(file_path, "r", encoding="utf-8") as f:
                    return f.read()
            
            # Mock return for PDF/Images if docTR is not set up in this env
            return """
            SERVICE AGREEMENT
            
            1. PAYMENT TERMS. Client shall pay Contractor $50 per hour. Payment is due within 90 days of invoice receipt.
            2. TERMINATION. Client may terminate this agreement immediately without notice. Contractor must provide 30 days notice.
            3. INTELLECTUAL PROPERTY. Client owns all work product, including pre-existing IP of Contractor incorporated into the work.
            4. LIABILITY. Contractor’s liability is unlimited. Client’s liability is limited to $100.
            5. JURISDICTION. This agreement is governed by the laws of Mars.
            """
        except Exception as e:
            print(f"OCR Error: {e}")
            return ""

ocr_service = OCRService()
