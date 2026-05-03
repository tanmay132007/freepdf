import io

import pikepdf
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_rotate(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    degrees = int(request.options.get("degrees", 90))
    if degrees not in {90, 180, 270}:
        raise ValueError("degrees must be 90, 180, or 270")

    pages = request.options.get("pages", "all")
    output = io.BytesIO()
    with pikepdf.open(io.BytesIO(download_file(source_key))) as pdf:
        indexes = range(len(pdf.pages)) if pages == "all" else [int(page) for page in pages]
        for index in indexes:
            pdf.pages[index].rotate(degrees, relative=True)
        pdf.save(output)

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output.getvalue(), "application/pdf")
    return {"success": True, "output_key": key}


@router.post("/rotate")
async def rotate_pdf(request: ProcessRequest):
    return await run_operation(request, process_rotate)
