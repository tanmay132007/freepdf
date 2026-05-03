import difflib

import fitz
from fastapi import APIRouter

from routers.common import ProcessRequest, request_file_keys, run_operation
from utils.storage import download_file

router = APIRouter()


def extract_page_texts(file_key: str):
    with fitz.open(stream=download_file(file_key), filetype="pdf") as doc:
        return [page.get_text().splitlines() for page in doc]


def page_differences(page_number: int, before_lines, after_lines):
    diff = difflib.unified_diff(
        before_lines,
        after_lines,
        fromfile="before",
        tofile="after",
        lineterm="",
    )
    removed = []
    added = []

    for line in diff:
        if line.startswith(("---", "+++", "@@")):
            continue
        if line.startswith("-"):
            removed.append(line[1:])
        elif line.startswith("+"):
            added.append(line[1:])

    if removed and added:
        return [
            {
                "page": page_number,
                "type": "changed",
                "text": "Removed:\n"
                + "\n".join(removed)
                + "\n\nAdded:\n"
                + "\n".join(added),
            }
        ]
    if removed:
        return [{"page": page_number, "type": "removed", "text": "\n".join(removed)}]
    if added:
        return [{"page": page_number, "type": "added", "text": "\n".join(added)}]
    return []


def process_compare(request: ProcessRequest):
    file_keys = request_file_keys(request)
    if len(file_keys) != 2:
        raise ValueError("Compare requires exactly two PDF files")

    first_pages = extract_page_texts(file_keys[0])
    second_pages = extract_page_texts(file_keys[1])
    differences = []
    total_pages = max(len(first_pages), len(second_pages))

    for index in range(total_pages):
        before_lines = first_pages[index] if index < len(first_pages) else []
        after_lines = second_pages[index] if index < len(second_pages) else []
        differences.extend(page_differences(index + 1, before_lines, after_lines))

    return {"success": True, "differences": differences}


@router.post("/compare")
async def compare_pdf(request: ProcessRequest):
    return await run_operation(request, process_compare)
