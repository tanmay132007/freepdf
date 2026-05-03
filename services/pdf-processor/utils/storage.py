import os
from pathlib import Path
from typing import Union

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "pdf-files")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def download_file(file_key: str) -> bytes:
    data = supabase.storage.from_(SUPABASE_BUCKET).download(file_key)
    if isinstance(data, bytes):
        return data
    return bytes(data)


def upload_file(key: str, data: Union[bytes, bytearray], mimetype: str) -> str:
    supabase.storage.from_(SUPABASE_BUCKET).upload(
        path=key,
        file=bytes(data),
        file_options={
            "content-type": mimetype,
            "upsert": "true",
        },
    )
    return key


def get_download_url(file_key: str) -> str:
    result = supabase.storage.from_(SUPABASE_BUCKET).create_signed_url(
        file_key,
        60 * 60,
    )
    if isinstance(result, dict):
        return result.get("signedURL") or result.get("signedUrl") or ""
    return str(result)
