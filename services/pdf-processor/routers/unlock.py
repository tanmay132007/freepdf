import io

import pikepdf
from fastapi import APIRouter, HTTPException

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_unlock(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    password = request.options.get("password", "")
    output = io.BytesIO()

    try:
        with pikepdf.open(io.BytesIO(download_file(source_key)), password=password) as pdf:
            pdf.save(output)
    except pikepdf.PasswordError as exc:
        raise HTTPException(status_code=400, detail="Wrong password") from exc

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output.getvalue(), "application/pdf")
    return {"success": True, "output_key": key}


@router.post("/unlock")
async def unlock_pdf(request: ProcessRequest):
    return await run_operation(request, process_unlock)
