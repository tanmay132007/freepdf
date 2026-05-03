import tempfile
from pathlib import Path

import fitz
import ocrmypdf
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, request_file_keys, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_ocr(request: ProcessRequest):
    file_keys = request_file_keys(request)
    if not file_keys:
        raise ValueError("A PDF file is required")

    source = download_file(file_keys[0])
    with fitz.open(stream=source, filetype="pdf") as doc:
        pages_processed = doc.page_count

    with tempfile.TemporaryDirectory() as temp_dir:
        input_path = Path(temp_dir) / "input.pdf"
        output_path = Path(temp_dir) / "output.pdf"
        input_path.write_bytes(source)
        ocrmypdf.ocr(input_path, output_path, language="eng")
        output = output_path.read_bytes()

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output, "application/pdf")
    return {
        "success": True,
        "output_key": key,
        "pages_processed": pages_processed,
    }


@router.post("/ocr")
async def ocr_pdf(request: ProcessRequest):
    return await run_operation(request, process_ocr)
