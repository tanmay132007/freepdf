import fitz
from fastapi import APIRouter

from routers.common import ProcessRequest, output_key, run_operation, zip_bytes
from utils.storage import download_file, upload_file

router = APIRouter()


def process_split(request: ProcessRequest):
    source_key = request.file_key if isinstance(request.file_key, str) else request.file_key[0]
    mode = request.options.get("mode", "every_page")
    ranges = request.options.get("ranges", [])

    files = {}
    with fitz.open(stream=download_file(source_key), filetype="pdf") as doc:
        if mode == "every_page":
            ranges = [[index, index] for index in range(doc.page_count)]
        elif mode != "range":
            raise ValueError("mode must be 'range' or 'every_page'")

        for index, page_range in enumerate(ranges):
            start, end = int(page_range[0]), int(page_range[1])
            if start < 0 or end < start or end >= doc.page_count:
                raise ValueError(f"Invalid page range: {page_range}")
            part = fitz.open()
            part.insert_pdf(doc, from_page=start, to_page=end)
            files[f"part-{index + 1}.pdf"] = part.tobytes(garbage=4, deflate=True)
            part.close()

    archive = zip_bytes(files)
    key = output_key(request.operation_id, "zip")
    upload_file(key, archive, "application/zip")
    return {"success": True, "output_key": key, "parts": len(files)}


@router.post("/split")
async def split_pdf(request: ProcessRequest):
    return await run_operation(request, process_split)
