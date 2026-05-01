import { NextResponse } from "next/server";
import { verifyIDCard } from "@/lib/gemini";

export async function POST(req) {
    try {
        const body = await req.json();
        const { idNumber, imageBase64 } = body;
        
        if (!imageBase64) {
            return NextResponse.json({ error: "صورة الهوية مفقودة" }, { status: 400 });
        }

        // استخدام الدالة الجديدة مع إجبار المحرك على الاستخراج الحقيقي (بدون تمرير رقم للتحايل)
        const result = await verifyIDCard(imageBase64, "image/jpeg");

        if (!result) {
            return NextResponse.json({ error: "فشل تحليل الهوية" }, { status: 500 });
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
