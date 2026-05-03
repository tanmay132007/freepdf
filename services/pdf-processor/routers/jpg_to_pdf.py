import img2pdf
from fastapi import APIRouter

from routers.common import ProcessRequest, ensure_file_list, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_jpg_to_pdf(request: ProcessRequest):
    image_list = [download_file(file_key) for file_key in ensure_file_list(request.file_key)]
    pdf_bytes = img2pdf.convert(image_list)
    key = output_key(request.operation_id, "pdf")
    upload_file(key, pdf_bytes, "application/pdf")
    return {"success": True, "output_key": key}


@router.post("/jpg-to-pdf")
async def jpg_to_pdf(request: ProcessRequest):
    return await run_operation(request, process_jpg_to_pdf)
