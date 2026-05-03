import fitz
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, run_operation
from utils.storage import download_file, upload_file

router = APIRouter()


def process_compress(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    level = request.options.get("level", "medium")
    source = download_file(source_key)

    with fitz.open(stream=source, filetype="pdf") as doc:
        if level == "high":
            rasterized = fitz.open()
            for page in doc:
                pix = page.get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False)
                new_page = rasterized.new_page(width=page.rect.width, height=page.rect.height)
                new_page.insert_image(new_page.rect, stream=pix.tobytes("jpeg"))
            output = rasterized.tobytes(garbage=4, deflate=True, clean=True)
            rasterized.close()
        else:
            output = doc.tobytes(garbage=4, deflate=True, clean=True)

    key = output_key(request.operation_id, "pdf")
    upload_file(key, output, "application/pdf")
    return {
        "success": True,
        "output_key": key,
        "original_size": len(source),
        "compressed_size": len(output),
    }


@router.post("/compress")
async def compress_pdf(request: ProcessRequest):
    return await run_operation(request, process_compress)
