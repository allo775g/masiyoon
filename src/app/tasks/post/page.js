"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";

// 🧩 نضع المحتوى في مكون داخلي لاستخدام useSearchParams بأمان
function PostTaskContent() {
  const { addTask, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef();

  const [formData, setFormData] = useState({ title: "", desc: "", budget: "", location: "الرياض", category: "تكييف" });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (searchParams.get('mode') === 'ai_camera') {
        fileRef.current.click();
    }
  }, [searchParams]);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      analyzeProblemReal(file);
    }
  };

  const analyzeProblemReal = async (file) => {
    setIsAnalyzing(true);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            // استخدام رابط الذكاء الاصطناعي الجديد الخاص بتحليل الأعطال
            const response = await fetch("/api/ai/analyze-problem", {
                method: "POST",
                body: JSON.stringify({ imageBase64: base64Data })
            });
            const resData = await response.json();
            
            if (resData.success && resData.data) {
                const analysis = resData.data;
                setFormData({ 
                   title: analysis.title || "",
                   category: analysis.category || "أخرى",
                   budget: analysis.estimatedPrice || "",
                   desc: analysis.description || "",
                   location: formData.location // نحافظ على الموقع
                });
            } else {
                alert(`لم يتم التعرف بشكل صحيح. خطأ السيرفر: ${resData.error || ""}`);
            }
            setIsAnalyzing(false);
        };
    } catch (e) {
        setIsAnalyzing(false);
        alert(`فشل تحليل الصورة: ${e.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("يرجى تسجيل الدخول أولاً");
    setLoading(true);
    try {
        await addTask({ 
            ...formData, 
            clientPhone: user.phone, 
            clientName: user.name,
            status: "open",
            date: Date.now()
        });
        alert("✅ تم نشر طلبك بنجاح! سيتم التواصل معك من قبل الفنيين.");
        router.push("/tasks");
    } catch (e) {
        alert("🚨 فشل النشر. تحقق من اتصالك.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: "4rem 1.5rem", minHeight: "100vh", maxWidth: "700px", margin: "0 auto" }}>
      <div className="glass-card animate-fade-in" style={{ padding: "3rem" }}>
        <h2 className="text-gradient" style={{ fontSize: "2.5rem", fontWeight: "950", textAlign: "center", marginBottom: "2rem" }}>تشخيص مَصيون الذكي</h2>
        
        <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <div 
                onClick={() => fileRef.current.click()}
                style={{ height: "240px", background: "rgba(59, 130, 246, 0.05)", borderRadius: "35px", border: "2px dashed rgba(59, 130, 246, 0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }}
            >
                {imagePreview ? (
                    <img src={imagePreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <>
                        <span style={{ fontSize: "4rem" }}>📸</span>
                        <p style={{ opacity: 0.6, marginTop: "1rem", fontWeight: "700" }}>بانتظار صورة العطل...</p>
                    </>
                )}
                {isAnalyzing && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(2, 6, 23, 0.9)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <div style={{ width: "50px", height: "50px", border: "4px solid #3b82f6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                        <p style={{ marginTop: "1.5rem", fontWeight: "950", color: "#3b82f6" }}>جاري التشخيص السحابي...</p>
                    </div>
                )}
            </div>
            <input type="file" ref={fileRef} hidden onChange={handleCapture} accept="image/*" />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "right" }}>
            <input className="input-premium" placeholder="العطل المشخص..." value={formData.title} onChange={e => setFormData({...formData, title:e.target.value})} required />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <input type="number" className="input-premium" placeholder="الميزانية (SAR)" value={formData.budget} onChange={e => setFormData({...formData, budget:e.target.value})} required />
                <input className="input-premium" placeholder="الموقع" value={formData.location} onChange={e => setFormData({...formData, location:e.target.value})} required />
            </div>
            <textarea className="input-premium" rows="4" placeholder="التفاصيل..." value={formData.desc} onChange={e => setFormData({...formData, desc:e.target.value})} required style={{ resize: "none" }} />
            <button type="submit" className="btn-premium btn-primary" style={{ marginTop: "2rem", fontSize: "1.3rem", width: "100%" }}>نشر البلاغ 🚀</button>
        </form>
      </div>
    </div>
  );
}

// 🛡️ الصفحة الرئيسية مغلفة بـ Suspense لحل مشكلة Vercel Build
export default function PostTask() {
  return (
    <Suspense fallback={<div style={{ color: "white", textAlign: "center", marginTop: "20vh" }}>جاري تحميل الذكاء الاصطناعي...</div>}>
      <PostTaskContent />
    </Suspense>
  );
}
