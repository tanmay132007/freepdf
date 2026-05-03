import os

import fitz
import google.generativeai as genai
from fastapi import APIRouter

from routers.common import ProcessRequest, request_file_keys, run_operation
from utils.storage import download_file

router = APIRouter()


def process_ai_summarizer(request: ProcessRequest):
    file_keys = request_file_keys(request)
    if not file_keys:
        raise ValueError("A PDF file is required")

    pages = 0
    text_parts = []
    with fitz.open(stream=download_file(file_keys[0]), filetype="pdf") as doc:
        pages = doc.page_count
        for page in doc:
            text_parts.append(page.get_text())

    text = "\n".join(text_parts).strip()
    if not text:
        return {"success": False, "error": "Scanned PDF, run OCR first"}

    try:
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Summarize in bullet points:\n\n" + text)
        summary = (getattr(response, "text", None) or "").strip()
    except Exception:
        return {"success": False, "error": "AI service unavailable, try again"}

    return {
        "success": True,
        "summary": summary,
        "word_count": len(text.split()),
        "pages": pages,
    }


@router.post("/ai-summarizer")
async def ai_summarizer(request: ProcessRequest):
    return await run_operation(request, process_ai_summarizer)
