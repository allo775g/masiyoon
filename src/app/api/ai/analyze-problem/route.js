import { NextResponse } from "next/server";
import { analyzeProblem } from "@/lib/gemini";

export async function POST(req) {
    try {
        const body = await req.json();
        const { imageBase64 } = body;
        
        if (!imageBase64) {
            return NextResponse.json({ error: "صورة المشكلة مفقودة" }, { status: 400 });
        }

        const result = await analyzeProblem(imageBase64);

        if (!result) {
            return NextResponse.json({ error: "فشل تحليل الصورة" }, { status: 500 });
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
