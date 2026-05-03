import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

from routers import (
    ai_summarizer,
    compare,
    compress,
    jpg_to_pdf,
    merge,
    ocr,
    protect,
    rotate,
    split,
    to_jpg,
    to_word,
    translator,
    unlock,
    watermark,
)

load_dotenv(Path(__file__).with_name(".env"))

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="FreePDF Editor PDF Processor")

app.include_router(merge.router, prefix="/process")
app.include_router(split.router, prefix="/process")
app.include_router(compress.router, prefix="/process")
app.include_router(rotate.router, prefix="/process")
app.include_router(protect.router, prefix="/process")
app.include_router(unlock.router, prefix="/process")
app.include_router(watermark.router, prefix="/process")
app.include_router(to_jpg.router, prefix="/process")
app.include_router(jpg_to_pdf.router, prefix="/process")
app.include_router(to_word.router, prefix="/process")
app.include_router(ai_summarizer.router, prefix="/process")
app.include_router(translator.router, prefix="/process")
app.include_router(ocr.router, prefix="/process")
app.include_router(compare.router, prefix="/process")


@app.post("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=True,
    )
