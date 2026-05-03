import os
import tempfile

import fitz
from fastapi import APIRouter
from pdf2docx import Converter

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


if not hasattr(fitz.Rect, "get_area"):
    def _rect_get_area(rect):
        return abs(rect.width * rect.height)

    fitz.Rect.get_area = _rect_get_area


def process_to_word(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]

    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = os.path.join(tmpdir, "input.pdf")
        output_path = os.path.join(tmpdir, "output.docx")
        with open(input_path, "wb") as file:
            file.write(download_file(source_key))

        converter = Converter(input_path)
        try:
            converter.convert(output_path)
        finally:
            converter.close()

        with open(output_path, "rb") as file:
            docx_bytes = file.read()

    key = output_key(request.operation_id, "docx")
    upload_file(
        key,
        docx_bytes,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    return {"success": True, "output_key": key}


@router.post("/to-word")
async def to_word(request: ProcessRequest):
    return await run_operation(request, process_to_word)
