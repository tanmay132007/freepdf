"use client";

import JSZip from "jszip";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import {
  PDFDocument,
  StandardFonts,
  degrees,
  rgb
} from "pdf-lib";

export type ToolOptions = {
  geminiApiKey?: string;
  prompt?: string;
  language?: string;
  text?: string;
  url?: string;
};

export type ClientPdfResult = {
  blob: Blob;
  filename: string;
};

const pdfMime = "application/pdf";
const pageMargin = 48;

function basename(file: File) {
  return file.name.replace(/\.[^.]+$/, "") || "savepdf";
}

function blobFromBytes(bytes: Uint8Array, type: string) {
  const buffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer;

  return new Blob([buffer], { type });
}

function pdfBlob(bytes: Uint8Array) {
  return blobFromBytes(bytes, pdfMime);
}

function textBlob(text: string) {
  return new Blob([text], { type: "text/plain;charset=utf-8" });
}

function wrapText(text: string, maxChars = 82) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars) {
      if (line) {
        lines.push(line);
      }
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

async function readPdf(file: File) {
  return PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
}

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

async function extractPdfText(file: File) {
  const pdfjs = await getPdfjs();
  const document = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer())
  }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push(text);
  }

  return pages;
}

async function renderPdfPages(file: File, scale = 1.8) {
  const pdfjs = await getPdfjs();
  const document = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer())
  }).promise;
  const pages: { dataUrl: string; width: number; height: number }[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = window.document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas rendering is not available in this browser.");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    pages.push({
      dataUrl: canvas.toDataURL("image/jpeg", 0.92),
      width: viewport.width,
      height: viewport.height
    });
  }

  return pages;
}

async function writeTextPdf(title: string, text: string, filename: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page = pdf.addPage();
  let y = page.getHeight() - pageMargin;

  page.drawText(title, {
    x: pageMargin,
    y,
    font: bold,
    size: 18,
    color: rgb(0.1, 0.12, 0.18)
  });
  y -= 32;

  for (const paragraph of text.split(/\n+/)) {
    for (const line of wrapText(paragraph)) {
      if (y < pageMargin) {
        page = pdf.addPage();
        y = page.getHeight() - pageMargin;
      }

      page.drawText(line, {
        x: pageMargin,
        y,
        font,
        size: 10.5,
        color: rgb(0.12, 0.14, 0.18)
      });
      y -= 15;
    }
    y -= 7;
  }

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename
  };
}

async function mergePdfs(files: File[]): Promise<ClientPdfResult> {
  if (files.length < 2) {
    throw new Error("Choose at least two PDFs to merge.");
  }

  const output = await PDFDocument.create();

  for (const file of files) {
    const source = await readPdf(file);
    const pages = await output.copyPages(source, source.getPageIndices());
    pages.forEach((page) => output.addPage(page));
  }

  return {
    blob: pdfBlob(await output.save({ useObjectStreams: true })),
    filename: "savepdf-merged.pdf"
  };
}

async function splitPdf(file: File): Promise<ClientPdfResult> {
  const source = await readPdf(file);
  const zip = new JSZip();

  for (const pageIndex of source.getPageIndices()) {
    const output = await PDFDocument.create();
    const [page] = await output.copyPages(source, [pageIndex]);
    output.addPage(page);
    zip.file(
      `${basename(file)}-page-${pageIndex + 1}.pdf`,
      await output.save({ useObjectStreams: true })
    );
  }

  return {
    blob: await zip.generateAsync({ type: "blob" }),
    filename: `${basename(file)}-split-pages.zip`
  };
}

async function rotatePdf(file: File): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);

  pdf.getPages().forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees((current + 90) % 360));
  });

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-rotated.pdf`
  };
}

async function imageBytesForPdf(file: File) {
  if (file.type === "image/png" || file.type === "image/jpeg") {
    return new Uint8Array(await file.arrayBuffer());
  }

  const image = await createImageBitmap(file);
  const canvas = window.document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas rendering is not available in this browser.");
  }

  context.drawImage(image, 0, 0);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((output) => {
      if (output) {
        resolve(output);
      } else {
        reject(new Error("Could not convert this image."));
      }
    }, "image/png");
  });

  return new Uint8Array(await blob.arrayBuffer());
}

async function imagesToPdf(files: File[]): Promise<ClientPdfResult> {
  const output = await PDFDocument.create();

  for (const file of files) {
    const bytes = await imageBytesForPdf(file);
    const image =
      file.type === "image/jpeg"
        ? await output.embedJpg(bytes)
        : await output.embedPng(bytes);
    const page = output.addPage([image.width, image.height]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
  }

  return {
    blob: pdfBlob(await output.save({ useObjectStreams: true })),
    filename: "savepdf-images.pdf"
  };
}

async function pdfToJpg(file: File): Promise<ClientPdfResult> {
  const zip = new JSZip();
  const pages = await renderPdfPages(file);

  pages.forEach((page, index) => {
    zip.file(
      `${basename(file)}-page-${index + 1}.jpg`,
      page.dataUrl.split(",")[1],
      { base64: true }
    );
  });

  return {
    blob: await zip.generateAsync({ type: "blob" }),
    filename: `${basename(file)}-jpg-pages.zip`
  };
}

async function pdfToWord(file: File): Promise<ClientPdfResult> {
  const pages = await extractPdfText(file);
  const children = pages.flatMap((pageText, index) => [
    new Paragraph({
      children: [new TextRun({ text: `Page ${index + 1}`, bold: true })]
    }),
    ...pageText.split(/(?<=[.!?])\s+/).map(
      (paragraph) =>
        new Paragraph({
          children: [new TextRun(paragraph)]
        })
    )
  ]);
  const doc = new Document({ sections: [{ children }] });

  return {
    blob: await Packer.toBlob(doc),
    filename: `${basename(file)}.docx`
  };
}

async function pdfToExcel(file: File): Promise<ClientPdfResult> {
  const pages = await extractPdfText(file);
  const rows = pages.flatMap((pageText, index) =>
    pageText
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .map((line) => ({
        Page: index + 1,
        Text: line
      }))
  );
  const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Page: 1, Text: "" }]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "PDF Text");
  const bytes = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  return {
    blob: new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
    filename: `${basename(file)}.xlsx`
  };
}

async function pdfToPpt(file: File): Promise<ClientPdfResult> {
  const pages = await extractPdfText(file);

  return {
    blob: await createTextPptx(pages),
    filename: `${basename(file)}.pptx`
  };
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function createTextPptx(slides: string[]) {
  const zip = new JSZip();
  const slideCount = Math.max(slides.length, 1);
  const contentTypes = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
    '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
    '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
    '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
    ...Array.from({ length: slideCount }, (_, index) =>
      `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    ),
    "</Types>"
  ].join("");

  const presentationRels = [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    ...Array.from({ length: slideCount }, (_, index) =>
      `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${index + 1}.xml"/>`
    ),
    `<Relationship Id="rId${slideCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>`,
    "</Relationships>"
  ].join("");

  zip.file("[Content_Types].xml", contentTypes);
  zip.file(
    "_rels/.rels",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>'
  );
  zip.file(
    "ppt/presentation.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId${slideCount + 1}"/></p:sldMasterIdLst><p:sldIdLst>${Array.from({ length: slideCount }, (_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`
  );
  zip.file("ppt/_rels/presentation.xml.rels", presentationRels);
  zip.file(
    "ppt/slideMasters/slideMaster1.xml",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" bg1="lt1" bg2="lt2" folHlink="folHlink" hlink="hlink" tx1="dk1" tx2="dk2"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst></p:sldMaster>'
  );
  zip.file(
    "ppt/slideMasters/_rels/slideMaster1.xml.rels",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>'
  );
  zip.file(
    "ppt/slideLayouts/slideLayout1.xml",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>'
  );
  zip.file(
    "ppt/slideLayouts/_rels/slideLayout1.xml.rels",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>'
  );
  zip.file(
    "ppt/theme/theme1.xml",
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="SavePDF"><a:themeElements><a:clrScheme name="SavePDF"><a:dk1><a:srgbClr val="16201B"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F2937"/></a:dk2><a:lt2><a:srgbClr val="F9FAFB"/></a:lt2><a:accent1><a:srgbClr val="0F8A64"/></a:accent1><a:accent2><a:srgbClr val="16201B"/></a:accent2><a:accent3><a:srgbClr val="6B7280"/></a:accent3><a:accent4><a:srgbClr val="C69A47"/></a:accent4><a:accent5><a:srgbClr val="0F766E"/></a:accent5><a:accent6><a:srgbClr val="2563EB"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="SavePDF"><a:majorFont><a:latin typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/></a:minorFont></a:fontScheme><a:fmtScheme name="SavePDF"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle/></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>'
  );

  Array.from({ length: slideCount }, (_, index) => slides[index] || "").forEach(
    (text, index) => {
      const lines = wrapText(text || `Page ${index + 1}`, 62).slice(0, 18);
      const paragraphs = lines
        .map((line) => `<a:p><a:r><a:rPr lang="en-US" sz="2200"/><a:t>${escapeXml(line)}</a:t></a:r></a:p>`)
        .join("");
      zip.file(
        `ppt/slides/slide${index + 1}.xml`,
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Text"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="685800"/><a:ext cx="10820400" cy="5486400"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="square"/><a:lstStyle/>${paragraphs}</p:txBody></p:sp></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`
      );
      zip.file(
        `ppt/slides/_rels/slide${index + 1}.xml.rels`,
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>'
      );
    }
  );

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  });
}

async function wordToPdf(file: File): Promise<ClientPdfResult> {
  const mammoth = (await import("mammoth/mammoth.browser")) as {
    extractRawText: (input: { arrayBuffer: ArrayBuffer }) => Promise<{ value: string }>;
  };
  const result = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer()
  });

  return writeTextPdf("Word to PDF", result.value, `${basename(file)}.pdf`);
}

async function excelToPdf(file: File): Promise<ClientPdfResult> {
  const workbook = XLSX.read(await file.arrayBuffer());
  const text = workbook.SheetNames.map((sheetName) => {
    const rows = XLSX.utils.sheet_to_json<string[]>(workbook.Sheets[sheetName], {
      header: 1
    });

    return [
      sheetName,
      ...rows.map((row) => row.map((cell) => String(cell ?? "")).join("    "))
    ].join("\n");
  }).join("\n\n");

  return writeTextPdf("Excel to PDF", text, `${basename(file)}.pdf`);
}

async function pptToPdf(file: File): Promise<ClientPdfResult> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((path) => /^ppt\/slides\/slide\d+\.xml$/.test(path))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const slides = await Promise.all(
    slideFiles.map(async (path, index) => {
      const xml = await zip.file(path)!.async("text");
      const text = Array.from(xml.matchAll(/<a:t>(.*?)<\/a:t>/g))
        .map((match) => match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<"))
        .join(" ");

      return `Slide ${index + 1}\n${text}`;
    })
  );

  return writeTextPdf("PowerPoint to PDF", slides.join("\n\n"), `${basename(file)}.pdf`);
}

async function htmlToPdf(options: ToolOptions): Promise<ClientPdfResult> {
  const url = options.url?.trim();

  if (!url) {
    throw new Error("Enter a webpage URL first.");
  }

  let text = url;
  try {
    const response = await fetch(url);
    const html = await response.text();
    text = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 12000);
  } catch {
    text = `Browser security blocked direct reading of this page.\n\nURL: ${url}`;
  }

  return writeTextPdf("HTML to PDF", text, "webpage.pdf");
}

async function addWatermark(file: File, text = "SavePDF"): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  pdf.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width * 0.2,
      y: height * 0.48,
      size: 48,
      font,
      color: rgb(0.8, 0.12, 0.12),
      opacity: 0.22,
      rotate: degrees(-28)
    });
  });

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-watermarked.pdf`
  };
}

async function addPageNumbers(file: File): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const total = pdf.getPageCount();

  pdf.getPages().forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${total}`;
    page.drawText(label, {
      x: width / 2 - label.length * 2.6,
      y: 24,
      size: 10,
      font,
      color: rgb(0.25, 0.25, 0.25)
    });
  });

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-numbered.pdf`
  };
}

async function cropPdf(file: File): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);

  pdf.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    const crop = Math.min(36, width * 0.05, height * 0.05);
    page.setCropBox(crop, crop, width - crop * 2, height - crop * 2);
  });

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-cropped.pdf`
  };
}

async function organizePdf(file: File): Promise<ClientPdfResult> {
  const source = await readPdf(file);
  const output = await PDFDocument.create();
  const indices = source.getPageIndices().reverse();
  const pages = await output.copyPages(source, indices);
  pages.forEach((page) => output.addPage(page));

  return {
    blob: pdfBlob(await output.save({ useObjectStreams: true })),
    filename: `${basename(file)}-reordered.pdf`
  };
}

async function annotatePdf(
  file: File,
  slug: string,
  options: ToolOptions
): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.getPage(0);
  const { width, height } = page.getSize();
  const text = options.text?.trim() || (slug === "sign-pdf" ? "Signed" : "SavePDF note");

  if (slug === "redact-pdf") {
    page.drawRectangle({
      x: pageMargin,
      y: height - 140,
      width: width - pageMargin * 2,
      height: 48,
      color: rgb(0, 0, 0)
    });
  } else {
    page.drawText(text, {
      x: pageMargin,
      y: slug === "sign-pdf" ? pageMargin : height - 110,
      size: slug === "sign-pdf" ? 26 : 16,
      font,
      color: slug === "sign-pdf" ? rgb(0.08, 0.22, 0.62) : rgb(0.8, 0.12, 0.12)
    });
  }

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-${slug}.pdf`
  };
}

async function normalizePdf(file: File, slug: string): Promise<ClientPdfResult> {
  const pdf = await readPdf(file);

  return {
    blob: pdfBlob(await pdf.save({ useObjectStreams: true })),
    filename: `${basename(file)}-${slug}.pdf`
  };
}

async function fileToBase64(file: File) {
  const buffer = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    const values = Array.from(chunk);
    binary += String.fromCharCode.apply(null, values);
  }

  return btoa(binary);
}

function geminiPrompt(slug: string, options: ToolOptions) {
  if (options.prompt?.trim()) {
    return options.prompt.trim();
  }

  if (slug === "translate-pdf") {
    return `Translate this document into ${options.language || "English"}. Keep headings and bullet structure.`;
  }

  if (slug === "ocr-pdf") {
    return "Extract all readable text from this scanned document. Preserve page order.";
  }

  if (slug === "compare-pdf") {
    return "Compare these documents. List important similarities, differences, missing sections, and changed wording.";
  }

  return "Summarize this document with key points, decisions, numbers, and action items.";
}

async function runGemini(
  slug: string,
  files: File[],
  options: ToolOptions
): Promise<ClientPdfResult> {
  const apiKey = options.geminiApiKey?.trim();

  if (!apiKey) {
    throw new Error("Add your Gemini API key to run this AI tool.");
  }

  const parts: unknown[] = [{ text: geminiPrompt(slug, options) }];

  for (const file of files) {
    parts.push({
      inlineData: {
        mimeType: file.type || pdfMime,
        data: await fileToBase64(file)
      }
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }]
      })
    }
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || `Gemini request failed with status ${response.status}`
    );
  }

  const text =
    payload?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("\n")
      .trim() || "Gemini returned an empty response.";

  return {
    blob: textBlob(text),
    filename: `${slug}-gemini-output.txt`
  };
}

export function needsGemini(slug: string) {
  return ["ocr-pdf", "ai-summarizer", "translate-pdf", "compare-pdf"].includes(slug);
}

export async function processClientPdfTool(
  slug: string,
  files: File[],
  options: ToolOptions = {}
): Promise<ClientPdfResult> {
  if (slug === "html-to-pdf") {
    return htmlToPdf(options);
  }

  if (files.length === 0) {
    throw new Error("Choose a file first.");
  }

  if (needsGemini(slug)) {
    return runGemini(slug, files, options);
  }

  if (slug === "merge-pdf") return mergePdfs(files);
  if (slug === "split-pdf") return splitPdf(files[0]);
  if (slug === "compress-pdf" || slug === "repair-pdf" || slug === "pdf-to-pdfa") {
    return normalizePdf(files[0], slug);
  }
  if (slug === "rotate-pdf") return rotatePdf(files[0]);
  if (slug === "jpg-to-pdf" || slug === "scan-to-pdf") return imagesToPdf(files);
  if (slug === "pdf-to-jpg") return pdfToJpg(files[0]);
  if (slug === "pdf-to-word") return pdfToWord(files[0]);
  if (slug === "pdf-to-excel") return pdfToExcel(files[0]);
  if (slug === "pdf-to-ppt") return pdfToPpt(files[0]);
  if (slug === "word-to-pdf") return wordToPdf(files[0]);
  if (slug === "excel-to-pdf") return excelToPdf(files[0]);
  if (slug === "ppt-to-pdf") return pptToPdf(files[0]);
  if (slug === "watermark-pdf") return addWatermark(files[0], options.text);
  if (slug === "page-numbers") return addPageNumbers(files[0]);
  if (slug === "crop-pdf") return cropPdf(files[0]);
  if (slug === "organize-pdf") return organizePdf(files[0]);
  if (["sign-pdf", "redact-pdf", "edit-pdf"].includes(slug)) {
    return annotatePdf(files[0], slug, options);
  }

  if (slug === "protect-pdf") {
    throw new Error("True PDF encryption cannot be done safely in this browser build yet.");
  }

  if (slug === "unlock-pdf") {
    throw new Error("Password-protected PDF decryption needs a secure server-side processor.");
  }

  throw new Error("This tool is not connected yet.");
}
