import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class OCRService:
    def process_file(self, file_path: str) -> str:
        """
        Extract text from supported document formats.
        Text-based PDFs are handled locally first; scanned PDFs/images fall back to docTR
        when the heavy OCR dependencies are available in the runtime.
        """
        path = Path(file_path)
        suffix = path.suffix.lower()

        try:
            if suffix == ".txt":
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    return f.read()

            if suffix == ".pdf":
                pdf_text = self._extract_pdf_text(path)
                if len(pdf_text.strip()) > 80:
                    return pdf_text

            if suffix in {".pdf", ".png", ".jpg", ".jpeg"}:
                return self._extract_with_doctr(path, suffix)

            logger.warning("Unsupported file type for OCR: %s", suffix)
            return ""
        except Exception as e:
            logger.exception("OCR error: %s", e)
            return ""

    def _extract_pdf_text(self, path: Path) -> str:
        try:
            from pypdf import PdfReader

            reader = PdfReader(str(path))
            pages = [(page.extract_text() or "").strip() for page in reader.pages]
            return "\n\n".join(page for page in pages if page)
        except ImportError:
            logger.warning("pypdf is not installed; skipping text PDF extraction.")
            return ""
        except Exception as e:
            logger.warning("Text PDF extraction failed: %s", e)
            return ""

    def _extract_with_doctr(self, path: Path, suffix: str) -> str:
        try:
            from doctr.io import DocumentFile
            from doctr.models import ocr_predictor

            doc = DocumentFile.from_pdf(str(path)) if suffix == ".pdf" else DocumentFile.from_images(str(path))
            model = ocr_predictor(pretrained=True)
            result = model(doc)
            return result.render()
        except ImportError:
            logger.warning("docTR is not installed; scanned PDF/image OCR is unavailable.")
            return ""
        except Exception as e:
            logger.warning("docTR OCR failed: %s", e)
            return ""

ocr_service = OCRService()
