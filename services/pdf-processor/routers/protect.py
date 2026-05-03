import io

import pikepdf
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_protect(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    user_password = request.options.get("user_password", "")
    owner_password = request.options.get("owner_password") or user_password
    allow_printing = bool(request.options.get("allow_printing", True))
    allow_copying = bool(request.options.get("allow_copying", True))

    output = io.BytesIO()
    with pikepdf.open(io.BytesIO(download_file(source_key))) as pdf:
        permissions = pikepdf.Permissions(
            print_lowres=allow_printing,
            print_highres=allow_printing,
            extract=allow_copying,
        )
        pdf.save(
            output,
            encryption=pikepdf.Encryption(
                user=user_password,
                owner=owner_password,
                R=6,
                allow=permissions,
            ),
        )

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output.getvalue(), "application/pdf")
    return {"success": True, "output_key": key}


@router.post("/protect")
async def protect_pdf(request: ProcessRequest):
    return await run_operation(request, process_protect)
