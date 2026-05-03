import io
from xml.sax.saxutils import escape

import fitz
from deep_translator import GoogleTranslator
from fastapi import APIRouter
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

from routers.common import ProcessRequest, output_key, request_file_keys, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()

LANGUAGE_CODES = {
    "spanish": "es",
    "french": "fr",
    "hindi": "hi",
    "arabic": "ar",
    "german": "de",
    "chinese": "zh-CN",
}


def translate_long_text(text: str, target_language: str) -> str:
    if not text.strip():
        return ""

    translator = GoogleTranslator(source="auto", target=target_language)
    chunks = []
    remaining = text.strip()
    max_chars = 4500

    while remaining:
        chunk = remaining[:max_chars]
        split_at = max(chunk.rfind("\n"), chunk.rfind(". "), chunk.rfind(" "))
        if len(remaining) > max_chars and split_at > 500:
            chunk = remaining[: split_at + 1]
        chunks.append(translator.translate(chunk))
        remaining = remaining[len(chunk) :].strip()

    return "\n".join(chunks)


def build_translated_pdf(page_texts):
    buffer = io.BytesIO()
    styles = getSampleStyleSheet()
    body_style = styles["BodyText"]
    body_style.fontName = "Helvetica"
    body_style.fontSize = 10
    body_style.leading = 14

    story = []
    for index, text in enumerate(page_texts):
        if index:
            story.append(PageBreak())
        paragraphs = [part.strip() for part in text.splitlines() if part.strip()]
        if not paragraphs:
            paragraphs = [""]
        for paragraph in paragraphs:
            story.append(Paragraph(escape(paragraph), body_style))
            story.append(Spacer(1, 8))

    doc = SimpleDocTemplate(buffer, pagesize=letter)
    doc.build(story)
    return buffer.getvalue()


def process_translate(request: ProcessRequest):
    file_keys = request_file_keys(request)
    if not file_keys:
        raise ValueError("A PDF file is required")

    target_language = request.options.get("target_language", "spanish")
    target_code = LANGUAGE_CODES.get(target_language)
    if not target_code:
        raise ValueError("Unsupported target_language")

    translated_pages = []
    with fitz.open(stream=download_file(file_keys[0]), filetype="pdf") as doc:
        for page in doc:
            text = page.get_text().strip()
            translated_pages.append(translate_long_text(text, target_code))

    output = build_translated_pdf(translated_pages)
    key = output_key(request.operation_id, "pdf")
    upload_file(key, output, "application/pdf")
    return {"success": True, "output_key": key, "target_language": target_language}


@router.post("/translate")
async def translate_pdf(request: ProcessRequest):
    return await run_operation(request, process_translate)
