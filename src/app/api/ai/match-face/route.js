import { NextResponse } from "next/server";
import { matchFaceToID } from "@/lib/gemini";

export async function POST(req) {
    try {
        const body = await req.json();
        const { faceImageBase64, idImageBase64 } = body;
        
        if (!faceImageBase64 || !idImageBase64) {
            return NextResponse.json({ error: "الرجاء إرفاق صورة الوجه وصورة الهوية" }, { status: 400 });
        }

        const result = await matchFaceToID(faceImageBase64, idImageBase64);

        if (!result) {
            return NextResponse.json({ error: "فشل التحقق من التطابق" }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            data: result 
        });

    } catch (error) {
        console.error("Global API Error:", error.message);
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
