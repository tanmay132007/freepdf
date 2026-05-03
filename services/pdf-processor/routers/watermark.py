import io

import fitz
from fastapi import APIRouter
from reportlab.lib.colors import Color, black
from reportlab.pdfgen import canvas

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def parse_color(value):
    if not value:
        return black
    if isinstance(value, str) and value.startswith("#") and len(value) == 7:
        red = int(value[1:3], 16) / 255
        green = int(value[3:5], 16) / 255
        blue = int(value[5:7], 16) / 255
        return Color(red, green, blue)
    if isinstance(value, (list, tuple)) and len(value) >= 3:
        return Color(float(value[0]), float(value[1]), float(value[2]))
    return black


def make_watermark_pdf(width, height, options):
    buffer = io.BytesIO()
    page = canvas.Canvas(buffer, pagesize=(width, height))
    text = str(options.get("text", "FreePDF"))
    opacity = float(options.get("opacity", 0.25))
    font_size = int(options.get("font_size", 48))
    position = options.get("position", "center")

    page.saveState()
    page.setFillColor(parse_color(options.get("color")))
    page.setFillAlpha(max(0, min(opacity, 1)))
    page.setFont("Helvetica-Bold", font_size)

    positions = {
        "top-left": (72, height - 72),
        "top-right": (width - 72, height - 72),
        "bottom-left": (72, 72),
        "bottom-right": (width - 72, 72),
        "center": (width / 2, height / 2),
    }
    x, y = positions.get(position, positions["center"])
    page.translate(x, y)
    if position == "center":
        page.rotate(35)
    page.drawCentredString(0, 0, text)
    page.restoreState()
    page.save()
    return buffer.getvalue()


def process_watermark(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    with fitz.open(stream=download_file(source_key), filetype="pdf") as doc:
        for page in doc:
            watermark_pdf = fitz.open(
                stream=make_watermark_pdf(page.rect.width, page.rect.height, request.options),
                filetype="pdf",
            )
            page.show_pdf_page(page.rect, watermark_pdf, 0, overlay=True)
            watermark_pdf.close()
        output = doc.tobytes(garbage=4, deflate=True)

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output, "application/pdf")
    return {"success": True, "output_key": key}


@router.post("/watermark")
async def watermark_pdf(request: ProcessRequest):
    return await run_operation(request, process_watermark)
