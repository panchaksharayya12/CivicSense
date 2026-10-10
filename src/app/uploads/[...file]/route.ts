import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ file: string[] }> | { file: string[] } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const filePathParts = resolvedParams.file || [];
    const fileName = filePathParts.join("/");

    if (!fileName) {
      return new NextResponse("File not specified", { status: 400 });
    }

    // Prevent directory traversal attacks
    const safePath = path.normalize(fileName).replace(/^(\.\.[\/\\])+/, "");
    const fullPath = path.join(process.cwd(), "public", "uploads", safePath);

    if (!fs.existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return new NextResponse("Not a file", { status: 400 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".ogg": "video/ogg",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Error serving uploaded file:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ file: string[] }> | { file: string[] } }
) {
  const res = await GET(req, context);
  return new NextResponse(null, {
    status: res.status,
    headers: res.headers,
  });
}
