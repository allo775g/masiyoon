import { NextResponse } from "next/server";
import { chatbotResponse } from "@/lib/gemini";

export async function POST(req) {
    try {
        const body = await req.json();
        const { message, history } = body;
        
        if (!message) {
            return NextResponse.json({ error: "الرجاء إرسال رسالة" }, { status: 400 });
        }

        const responseText = await chatbotResponse(message, history || []);

        return NextResponse.json({ 
            success: true, 
            reply: responseText 
        });

    } catch (error) {
        console.error("Global API Error:", error.message);
        return NextResponse.json({ 
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
