import fitz
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, run_operation, zip_bytes
from utils.storage import download_file, upload_file

router = APIRouter()


def process_to_jpg(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    dpi = int(request.options.get("dpi", 150))
    if dpi not in {150, 200, 300}:
        raise ValueError("dpi must be 150, 200, or 300")

    requested_pages = request.options.get("pages", "all")
    with fitz.open(stream=download_file(source_key), filetype="pdf") as doc:
        pages = range(doc.page_count) if requested_pages == "all" else [int(page) for page in requested_pages]
        images = {}
        for page_index in pages:
            page = doc[page_index]
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi / 72, dpi / 72), alpha=False)
            images[f"page-{page_index + 1}.jpg"] = pix.tobytes("jpeg")

    if len(images) == 1:
        output = next(iter(images.values()))
        key = output_key(request.operation_id, "jpg")
        mimetype = "image/jpeg"
    else:
        output = zip_bytes(images)
        key = output_key(request.operation_id, "zip")
        mimetype = "application/zip"

    upload_file(key, output, mimetype)
    return {"success": True, "output_key": key}


@router.post("/to-jpg")
async def to_jpg(request: ProcessRequest):
    return await run_operation(request, process_to_jpg)
