export async function POST(req) {
  try {
    const { text, image } = await req.json();
    const API_KEY = process.env.OPENROUTER_API_KEY?.replace(/['"]/g, '').trim();

    // استخدام GPT-4o لتشخيص الأعطال بدقة عالية
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-4o",
        "messages": [
          {
            "role": "system",
            "content": "أنت خبير صيانة منزلية ذكي في منصة مَصيون. مهمتك تحليل مشكلة العميل (نصاً أو صورة) وتقديم تشخيص دقيق، الخطوات المتوقعة للإصلاح، وتكلفة تقريبية بالريال السعودي. اجعل أسلوبك احترافياً ومطمئناً."
          },
          {
            "role": "user",
            "content": [
              { "type": "text", "text": text || "حلل هذا العطل وقدم تقرير صيانة" },
              ...(image ? [{ "type": "image_url", "image_url": { "url": `data:image/jpeg;base64,${image}` } }] : [])
            ]
          }
        ],
        "max_tokens": 1000
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const output = data.choices[0].message.content;
    return Response.json({ result: output });

  } catch (error) {
    console.error("AI Route Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
