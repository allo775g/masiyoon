import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { text } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(text);
    const response = await result.response;
    const output = response.text();

    return Response.json({ result: output });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
