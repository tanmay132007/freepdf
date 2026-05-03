import fitz
from fastapi import APIRouter

from routers.common import ProcessRequest, ensure_file_list, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_merge(request: ProcessRequest):
    file_keys = ensure_file_list(request.file_key)
    if not file_keys:
        raise ValueError("At least one file is required")

    merged = fitz.open()
    for file_key in file_keys:
        with fitz.open(stream=download_file(file_key), filetype="pdf") as doc:
            merged.insert_pdf(doc)

    output = merged.tobytes(garbage=4, deflate=True)
    pages = merged.page_count
    merged.close()
    key = output_key(request.operation_id, "pdf")
    upload_file(key, output, "application/pdf")
    return {
        "success": True,
        "output_key": key,
        "pages": pages,
        "file_size": len(output),
    }


@router.post("/merge")
async def merge_pdf(request: ProcessRequest):
    return await run_operation(request, process_merge)
