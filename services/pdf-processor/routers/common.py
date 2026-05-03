import io
import logging
import time
import uuid
import zipfile
from typing import Any, Callable, Dict, List, Optional, Union

import httpx
from fastapi import HTTPException
from pydantic import BaseModel, Field

logger = logging.getLogger("pdf-processor")


class ProcessRequest(BaseModel):
    operation_id: str
    file_key: Optional[Union[str, List[str]]] = None
    input_files: Optional[List[str]] = None
    options: Dict[str, Any] = Field(default_factory=dict)
    callback_url: Optional[str] = None


def output_key(operation_id: str, extension: str) -> str:
    clean_extension = extension.lstrip(".")
    return f"processed/{operation_id}/{uuid.uuid4()}.{clean_extension}"


def zip_bytes(files: Dict[str, bytes]) -> bytes:
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for name, data in files.items():
            archive.writestr(name, data)
    return buffer.getvalue()


async def post_callback(
    request: ProcessRequest,
    payload: Dict[str, Any],
    processing_ms: int,
) -> None:
    if not request.callback_url:
        return

    callback_payload = {
        "operation_id": request.operation_id,
        "success": payload.get("success", False),
        "error": payload.get("error"),
        "output_key": payload.get("output_key"),
        "processing_ms": processing_ms,
    }
    for key, value in payload.items():
        if key not in callback_payload:
            callback_payload[key] = value

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            await client.post(request.callback_url, json=callback_payload)
    except Exception:
        logger.exception("Callback failed for operation %s", request.operation_id)


async def run_operation(
    request: ProcessRequest,
    processor: Callable[[ProcessRequest], Dict[str, Any]],
) -> Dict[str, Any]:
    started = time.perf_counter()
    status_code = 500

    try:
        result = processor(request)
        if "success" not in result:
            result["success"] = True
        status_code = 200
    except HTTPException as exc:
        result = {"success": False, "error": exc.detail}
        status_code = exc.status_code
    except Exception as exc:
        logger.exception("Operation %s failed", request.operation_id)
        result = {"success": False, "error": str(exc)}

    processing_ms = int((time.perf_counter() - started) * 1000)
    result["processing_ms"] = processing_ms
    logger.info(
        "operation=%s success=%s processing_ms=%s",
        request.operation_id,
        result.get("success"),
        processing_ms,
    )
    await post_callback(request, result, processing_ms)

    if not result.get("success") and status_code >= 400:
        raise HTTPException(status_code=status_code, detail=result)

    return result


def ensure_file_list(file_key: Optional[Union[str, List[str]]]) -> List[str]:
    if isinstance(file_key, list):
        return file_key
    if file_key is None:
        return []
    return [file_key]


def request_file_keys(request: ProcessRequest) -> List[str]:
    if request.input_files:
        return request.input_files
    return ensure_file_list(request.file_key)
