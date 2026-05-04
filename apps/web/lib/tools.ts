import {
  Archive,
  Crop,
  Droplets,
  Edit3,
  EyeOff,
  FileImage,
  FileText,
  FileType,
  GitCompare,
  Globe,
  Hash,
  Image,
  Languages,
  Layers,
  LayoutGrid,
  Lock,
  Minimize2,
  Monitor,
  PenLine,
  Presentation,
  RotateCw,
  Scan,
  ScanText,
  Scissors,
  Server,
  Sheet,
  Sparkles,
  Table,
  Unlock,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ToolCategory =
  | "Edit"
  | "Convert"
  | "Compress"
  | "Security"
  | "AI Tools";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: keyof typeof iconMap;
  category: ToolCategory;
  acceptedFiles: string[];
  multiple: boolean;
};

export const iconMap = {
  Archive,
  Crop,
  Droplets,
  Edit3,
  EyeOff,
  FileImage,
  FileText,
  FileType,
  GitCompare,
  Globe,
  Hash,
  Image,
  Languages,
  Layers,
  LayoutGrid,
  Lock,
  Minimize2,
  Monitor,
  PenLine,
  Presentation,
  RotateCw,
  Scan,
  ScanText,
  Scissors,
  Server,
  Sheet,
  Sparkles,
  Table,
  Unlock,
  Wrench
} satisfies Record<string, LucideIcon>;

export const tools: Tool[] = [
  {
    slug: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDFs into one organized file.",
    icon: "Layers",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: true
  },
  {
    slug: "split-pdf",
    name: "Split PDF",
    description: "Extract pages or split one PDF into several files.",
    icon: "Scissors",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while keeping documents clear.",
    icon: "Minimize2",
    category: "Compress",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDFs into editable Word documents.",
    icon: "FileText",
    category: "Convert",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Extract tables from PDF files into spreadsheets.",
    icon: "Table",
    category: "Convert",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Turn PDF pages into high-quality JPG images.",
    icon: "Image",
    category: "Convert",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Combine JPG, PNG, or WebP images into a PDF.",
    icon: "FileImage",
    category: "Convert",
    acceptedFiles: ["image/jpeg", "image/png", "image/webp"],
    multiple: true
  },
  {
    slug: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents into polished PDF files.",
    icon: "FileType",
    category: "Convert",
    acceptedFiles: [".doc", ".docx"],
    multiple: false
  },
  {
    slug: "protect-pdf",
    name: "Protect PDF",
    description: "Add password protection to private PDF files.",
    icon: "Lock",
    category: "Security",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove passwords from PDFs you have permission to unlock.",
    icon: "Unlock",
    category: "Security",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "watermark-pdf",
    name: "Watermark PDF",
    description: "Add text or image watermarks to PDF pages.",
    icon: "Droplets",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate pages and fix document orientation.",
    icon: "RotateCw",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "ocr-pdf",
    name: "OCR PDF",
    description: "Make scanned PDFs searchable with OCR.",
    icon: "ScanText",
    category: "AI Tools",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "ai-summarizer",
    name: "AI Summarizer",
    description: "Summarize long PDF documents with AI.",
    icon: "Sparkles",
    category: "AI Tools",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "translate-pdf",
    name: "Translate PDF",
    description: "Translate PDF content into another language.",
    icon: "Languages",
    category: "AI Tools",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "compare-pdf",
    name: "Compare PDF",
    description: "Compare two PDFs and spot document differences.",
    icon: "GitCompare",
    category: "AI Tools",
    acceptedFiles: ["application/pdf"],
    multiple: true
  },
  {
    slug: "sign-pdf",
    name: "Sign PDF",
    description: "Add signatures to PDF documents online.",
    icon: "PenLine",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "redact-pdf",
    name: "Redact PDF",
    description: "Hide sensitive information before sharing files.",
    icon: "EyeOff",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "crop-pdf",
    name: "Crop PDF",
    description: "Trim page edges and improve PDF framing.",
    icon: "Crop",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "organize-pdf",
    name: "Organize PDF",
    description: "Reorder, remove, and arrange PDF pages.",
    icon: "LayoutGrid",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "page-numbers",
    name: "Page Numbers",
    description: "Add page numbers to PDF files.",
    icon: "Hash",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "html-to-pdf",
    name: "HTML to PDF",
    description: "Convert webpages and HTML into PDFs.",
    icon: "Globe",
    category: "Convert",
    acceptedFiles: [],
    multiple: false
  },
  {
    slug: "pdf-to-pdfa",
    name: "PDF to PDF/A",
    description: "Convert PDFs to archival PDF/A format.",
    icon: "Archive",
    category: "Security",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "repair-pdf",
    name: "Repair PDF",
    description: "Repair corrupted PDF files when possible.",
    icon: "Wrench",
    category: "Security",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "scan-to-pdf",
    name: "Scan to PDF",
    description: "Turn scans and photos into a PDF document.",
    icon: "Scan",
    category: "AI Tools",
    acceptedFiles: ["image/jpeg", "image/png"],
    multiple: true
  },
  {
    slug: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets into shareable PDFs.",
    icon: "Sheet",
    category: "Convert",
    acceptedFiles: [".xls", ".xlsx"],
    multiple: false
  },
  {
    slug: "ppt-to-pdf",
    name: "PPT to PDF",
    description: "Convert PowerPoint presentations into PDFs.",
    icon: "Presentation",
    category: "Convert",
    acceptedFiles: [".ppt", ".pptx"],
    multiple: false
  },
  {
    slug: "pdf-to-ppt",
    name: "PDF to PPT",
    description: "Convert PDF slides into PowerPoint files.",
    icon: "Monitor",
    category: "Convert",
    acceptedFiles: ["application/pdf"],
    multiple: false
  },
  {
    slug: "edit-pdf",
    name: "Edit PDF",
    description: "Edit text, images, and document details in PDFs.",
    icon: "Edit3",
    category: "Edit",
    acceptedFiles: ["application/pdf"],
    multiple: false
  }
];
