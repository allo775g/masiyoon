// المحرك الذكي لمنصة "ماسيون" للصيانة
export async function analyzeProblem(base64Image, mimeType = "image/jpeg") {
  let API_KEY = process.env.OPENROUTER_API_KEY?.replace(/['"]/g, '').trim();
  if (API_KEY && API_KEY.startsWith('Sk-')) {
    API_KEY = 's' + API_KEY.substring(1);
  }

  if (!API_KEY) {
    return {
      title: "مفتاح مفقود",
      description: "مفتاح OpenRouter غير موجود",
      category: "أخرى",
      estimatedPrice: "150"
    };
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-4o", // المحرك الأقوى
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "أنت المحرك الذكي لمنصة 'ماسيون' للصيانة. حلل هذه الصورة بذكاء واستخرج: 1. وصف تقني دقيق للمشكلة. 2. السعر التقديري للإصلاح بالريال السعودي (بناءً على سوق جدة). 3. الوقت المتوقع للإصلاح. 4. مستوى الخطورة. رتبها في JSON بالأسماء التالية (بدون أي نصوص إضافية): title (عنوان قصير للمشكلة), description (الوصف التقني الدقيق), category (تصنيف المشكلة مثل سباكة، كهرباء، الخ), estimatedPrice (السعر التقديري كرقم فقط), expectedTime (الوقت المتوقع), severityLevel (مستوى الخطورة)."
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        "response_format": { "type": "json_object" },
        "max_tokens": 800
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error)));
    }

    if (!data.choices || !data.choices[0]) {
      throw new Error("لم يتم إرجاع أي رد من المحرك: " + JSON.stringify(data));
    }

    const result = JSON.parse(data.choices[0].message.content);

    // التأكد من وجود الخصائص الأساسية التي تحتاجها واجهة المستخدم
    return {
      title: result.title || "صيانة منزلية",
      description: result.description || "تحليل المشكلة من الصورة",
      category: result.category || "عام",
      estimatedPrice: result.estimatedPrice || "غير محدد",
      expectedTime: result.expectedTime || "غير محدد",
      severityLevel: result.severityLevel || "متوسط"
    };

  } catch (error) {
    console.error("Masyoun Engine Error:", error);
    return {
      title: "خطأ في التحليل",
      description: `السبب: ${error.message}`,
      category: "أخرى",
      estimatedPrice: "0"
    };
  }
}

// 2. التحقق من الهوية (بواسطة GPT-4o للرؤية الحاسوبية الدقيقة)
export async function verifyIDCard(base64Image, mimeType = "image/jpeg") {
  let API_KEY = process.env.OPENROUTER_API_KEY?.replace(/['"]/g, '').trim();
  if (API_KEY && API_KEY.startsWith('Sk-')) {
    API_KEY = 's' + API_KEY.substring(1);
  }

  if (!API_KEY) {
    throw new Error("API Key is missing");
  }

  try {
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
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "اقرأ رقم الهوية (10 أرقام) والاسم الكامل من هذه البطاقة السعودية. الأرقام قد تكون بالخط العربي (٠١٢٣٤٥٦٧٨٩). أجب بصيغة JSON فقط: { \"idNumber\": \"الرقم هنا\", \"fullName\": \"الاسم هنا\", \"isExpired\": false }"
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        "response_format": { "type": "json_object" },
        "max_tokens": 800
      })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    const result = JSON.parse(data.choices[0].message.content);

    return {
      idNumber: result.idNumber ? String(result.idNumber) : null,
      isExpired: result.isExpired === true || result.isExpired === "true",
      fullName: result.fullName ? String(result.fullName) : "غير محدد"
    };

  } catch (err) {
    console.error("ID Verification Error:", err);
    return { idNumber: null, isExpired: false, fullName: "فشل استخراج البيانات" };
  }
}

// 3. مطابقة الوجه
export async function matchFaceToID(faceBase64, idBase64) {
  let API_KEY = process.env.OPENROUTER_API_KEY?.replace(/['"]/g, '').trim();
  if (API_KEY && API_KEY.startsWith('Sk-')) {
    API_KEY = 's' + API_KEY.substring(1);
  }

  if (!API_KEY || faceBase64 === "dummy_face_base64_for_testing") {
    // If no API key or dummy data passed (no camera), fallback to allow testing
    return { isMatch: true, confidenceScore: 100, reason: "تم التجاوز للوضع الاختباري" };
  }

  try {
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
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": "أنت نظام تحليل بصري للصور. المهمة هي مقارنة الخصائص البصرية والتفاصيل الشكلية الموجودة في الصورتين (بدون التعرف على الهوية أو الأسماء). هل الخصائص الشكلية في الصورة الأولى تتطابق مع الصورة الثانية بدرجة عالية؟ أجب بصيغة JSON حصراً: isMatch (قيمة منطقية true/false للتشابه العالي)، confidenceScore (نسبة التشابه من 0 إلى 100)، reason (وصف موجز للتشابه أو الاختلاف)."
              },
              {
                "type": "image_url",
                "image_url": { "url": `data:image/jpeg;base64,${faceBase64}` }
              },
              {
                "type": "image_url",
                "image_url": { "url": `data:image/jpeg;base64,${idBase64}` }
              }
            ]
          }
        ],
        "response_format": { "type": "json_object" },
        "max_tokens": 500
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message || "Unknown API error");

    const result = JSON.parse(data.choices[0].message.content);
    return {
      isMatch: result.isMatch === true || result.isMatch === "true",
      confidenceScore: result.confidenceScore || 0,
      reason: result.reason || "تم التحليل"
    };
  } catch (err) {
    console.error("Face Match Error:", err);
    return { isMatch: false, confidenceScore: 0, reason: "تعذر إكمال عملية المطابقة بسبب خطأ تقني." };
  }
}

// 4. الشات بوت للدعم الفني باستخدام OpenRouter
export async function chatbotResponse(userMessage, history = []) {
  const API_KEY = process.env.OPENROUTER_API_KEY;

  if (!API_KEY) {
    return "عذراً، مفتاح OpenRouter غير موجود في المتغيرات البيئية.";
  }

  try {
    // تجهيز الرسائل مع التاريخ السابق إذا وجد
    const messages = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.parts?.[0]?.text || msg.content || ""
    }));

    // إضافة الرسالة الجديدة
    messages.push({ role: "user", content: userMessage });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-flash-1.5-free",
        "messages": messages
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "عذراً، لم أتمكن من معالجة الرد.";

  } catch (error) {
    console.error("Error calling OpenRouter AI:", error);
    return "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي.";
  }
}
