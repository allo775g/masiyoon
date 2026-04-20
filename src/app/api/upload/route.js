import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename") || `upload_${Date.now()}.jpg`;
    
    // 🔑 استخدام الـ Token الجديد للمتجر العام (Public)
    const blobToken = "vercel_blob_rw_fBAPKMrL29RjUP4C_29LGfh93uuXSYRQnw2T2IlKwcRQwzf";

    const imageFileData = await req.blob();

    const blob = await put(filename, imageFileData, {
      access: "public", // عدنا للوضع العام لأنه المتجر الجديد يتدعمه
      token: blobToken,
      addRandomSuffix: true
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
