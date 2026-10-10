import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("video") || formData.get("photo") || formData.get("file")) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No media file provided." },
        { status: 400 }
      );
    }

    const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"];
    const videoMimes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-msvideo", "video/3gpp"];

    const isImage = imageMimes.includes(file.type) || file.type.startsWith("image/");
    const isVideo = videoMimes.includes(file.type) || file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload an image (JPEG, PNG, WebP) or video (MP4, WebM, MOV)." },
        { status: 400 }
      );
    }

    // Size limit: 15MB for images, 100MB for video
    const MAX_SIZE = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${isVideo ? "100MB" : "15MB"} limit.` },
        { status: 400 }
      );
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let ext = path.extname(file.name);
    if (!ext) {
      ext = isVideo ? ".mp4" : ".jpg";
    }
    const cleanFileName = `evidence_${isVideo ? "vid" : "img"}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, cleanFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      mediaType: isVideo ? "video" : "photo",
      fileName: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload media file." },
      { status: 500 }
    );
  }
}
