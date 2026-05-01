"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, MapPin, Send, ChevronRight } from "lucide-react";

function PostTaskContent() {
  const { addTask, user } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileRef = useRef();

  const [formData, setFormData] = useState({ title: "", desc: "", budget: "", category: searchParams.get('cat') || "أخرى", time: "", severity: "" });
  const [gpsLocation, setGpsLocation] = useState(null); // [lat, lng]
  const [locationStatus, setLocationStatus] = useState("جاري التحديد...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (searchParams.get('mode') === 'ai_camera') {
        setTimeout(() => fileRef.current?.click(), 500);
    }
  }, [searchParams]);

  // Fetch Exact GPS Location
  useEffect(() => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (pos) => {
                  setGpsLocation([pos.coords.latitude, pos.coords.longitude]);
                  setLocationStatus("تم تحديد موقعك بدقة 📍");
              },
              (err) => {
                  setLocationStatus("تعذر التحديد التلقائي ⚠️");
                  setGpsLocation([21.5433, 39.1728]); // Fallback Jeddah
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
      } else {
          setLocationStatus("GPS غير مدعوم في متصفحك");
          setGpsLocation([21.5433, 39.1728]);
      }
  }, []);

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
            const response = await fetch("/api/ai/analyze-problem", {
                method: "POST",
                body: JSON.stringify({ imageBase64: base64Data })
            });
            const resData = await response.json();
            
            if (resData.success && resData.data) {
                const analysis = resData.data;
                setFormData({ 
                   title: analysis.title || "مشكلة تم تحديدها",
                   category: analysis.category || "أخرى",
                   budget: analysis.estimatedPrice ? String(analysis.estimatedPrice).replace(/[^0-9]/g, '') : "100",
                   desc: analysis.description || "يوجد عطل يحتاج لمعاينة فني متخصص.",
                   time: analysis.expectedTime || "غير محدد",
                   severity: analysis.severityLevel || "متوسط"
                });
            } else {
                alert(`خطأ في التحليل: ${resData.error || "حاول مرة أخرى"}`);
            }
            setIsAnalyzing(false);
        };
    } catch (e) {
        setIsAnalyzing(false);
        alert(`فشل تحليل الصورة: ${e.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً");
        router.push("/");
        return;
    }
    // Show Payment Modal instead of window.confirm
    setShowPayment(true);
  };

  const confirmAndPay = async () => {
    setIsPaying(true);
    const agreedPrice = parseInt(formData.budget) || 100;
    
    // Simulate Payment Gateway Processing Delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        await addTask({ 
            title: formData.title || "طلب صيانة",
            category: formData.category,
            price: agreedPrice,
            aiInsights: formData.desc,
            location: gpsLocation, // EXACT GPS COORDS FOR WORKER MAP
            clientPhone: user.phone, 
            clientName: user.name,
            status: "open",
            paymentStatus: "held_in_escrow", // Held by platform
            date: Date.now()
        });
        
        setShowPayment(false);
        alert("✅ تم سحب المبلغ بنجاح ونشر الطلب للفنيين!");
        router.push("/tasks");
        
    } catch (e) {
        alert("🚨 فشل النشر. تحقق من اتصالك.");
        setIsPaying(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", fontFamily: "'Tajawal', 'Cairo', sans-serif", direction: "rtl", paddingBottom: "40px" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: "#1e3a8a", padding: "20px 20px 40px", color: "white", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px", boxShadow: "0 10px 25px rgba(30, 58, 138, 0.2)", position: "relative", zIndex: 1 }}>
        <button onClick={() => router.push('/')} style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.1)", border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: "pointer", marginBottom: "15px" }}>
          <ChevronRight size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: "950" }}>تفاصيل الطلب</h1>
        <p style={{ margin: "5px 0 0", color: "#93c5fd", fontSize: "0.95rem" }}>استخدم الكاميرا ليقوم الذكاء الاصطناعي بمساعدتك</p>
      </div>

      <main style={{ padding: "0 20px", marginTop: "-30px", position: "relative", zIndex: 2, maxWidth: "600px", margin: "-30px auto 0" }}>
        
        <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", marginBottom: "20px" }}>
            
            {/* AI Camera Box */}
            <div 
                onClick={() => !isAnalyzing && fileRef.current.click()}
                style={{ 
                    height: "180px", background: imagePreview ? "black" : "#eff6ff", 
                    borderRadius: "20px", border: imagePreview ? "none" : "2px dashed #93c5fd", 
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
                    cursor: "pointer", overflow: "hidden", position: "relative", marginBottom: "25px",
                    backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                    backgroundSize: "cover", backgroundPosition: "center"
                }}
            >
                {!imagePreview && (
                    <>
                        <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 15px rgba(59,130,246,0.2)", marginBottom: "10px" }}>
                            <Camera size={28} color="#3b82f6" />
                        </div>
                        <p style={{ color: "#1e3a8a", margin: 0, fontWeight: "800", fontSize: "1.1rem" }}>تصوير المشكلة</p>
                    </>
                )}
                
                {isAnalyzing && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(30, 58, 138, 0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <div style={{ width: "40px", height: "40px", border: "3px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                        <p style={{ marginTop: "15px", fontWeight: "900", color: "white" }}>جاري التشخيص الذكي...</p>
                    </div>
                )}
            </div>
            <input type="file" ref={fileRef} hidden onChange={handleCapture} accept="image/*" />

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                
                {/* Location Display */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "15px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center", color: "#10b981" }}>
                        <MapPin size={20} />
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 2px", fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>موقعك الجغرافي</h4>
                        <span style={{ fontSize: "0.8rem", color: gpsLocation ? "#10b981" : "#f59e0b", fontWeight: "700" }}>{locationStatus}</span>
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: "#334155", fontSize: "0.95rem" }}>نوع المشكلة</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title:e.target.value})} placeholder="مثال: تسرب مياه تحت المغسلة" style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", fontFamily: "inherit" }} />
                </div>
                
                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: "#334155", fontSize: "0.95rem" }}>الميزانية المقترحة (ر.س)</label>
                    <input required type="number" value={formData.budget} onChange={e => setFormData({...formData, budget:e.target.value})} placeholder="150" style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", fontFamily: "inherit" }} />
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: "#334155", fontSize: "0.95rem" }}>الوقت المتوقع</label>
                        <input value={formData.time} readOnly placeholder="يحدده الذكاء الاصطناعي" style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "1rem", outline: "none", fontFamily: "inherit", color: "#64748b" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: "#334155", fontSize: "0.95rem" }}>الخطورة</label>
                        <input value={formData.severity} readOnly placeholder="يحدده الذكاء الاصطناعي" style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", fontSize: "1rem", outline: "none", fontFamily: "inherit", color: formData.severity === "عالي" || formData.severity === "خطير" ? "#ef4444" : "#f59e0b", fontWeight: "bold" }} />
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "800", color: "#334155", fontSize: "0.95rem" }}>التفاصيل (أو تقرير الذكاء الاصطناعي)</label>
                    <textarea required value={formData.desc} onChange={e => setFormData({...formData, desc:e.target.value})} rows="3" placeholder="اكتب تفاصيل المشكلة هنا..." style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "2px solid #e2e8f0", fontSize: "1rem", outline: "none", fontFamily: "inherit", resize: "none" }} />
                </div>

                <button id="submit-btn" type="submit" disabled={loading} style={{ 
                    width: "100%", padding: "18px", borderRadius: "16px", backgroundColor: "#1e3a8a", 
                    color: "white", border: "none", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer",
                    display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "10px",
                    boxShadow: "0 8px 25px rgba(30, 58, 138, 0.25)"
                }}>
                    {loading ? "جاري الإرسال..." : <><Send size={20} /> انشر الطلب ليراه الفنيون</>}
                </button>
            </form>
        </div>

      </main>

      {/* Payment Gateway Modal Overlay */}
      {showPayment && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(5px)", zIndex: 100, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ backgroundColor: "white", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", padding: "30px 20px", animation: "slideUp 0.3s ease-out" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "900", color: "#0f172a" }}>الدفع الآمن 🔒</h2>
                      <button disabled={isPaying} onClick={() => setShowPayment(false)} style={{ background: "none", border: "none", fontSize: "1.8rem", color: "#94a3b8", cursor: "pointer", padding: "0 10px" }}>×</button>
                  </div>
                  
                  <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "20px", marginBottom: "25px", textAlign: "center", border: "1px dashed #cbd5e1" }}>
                      <p style={{ margin: "0 0 10px", color: "#64748b", fontWeight: "700" }}>مبلغ الضمان (سيتم حجزه بالمحفظة)</p>
                      <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "950", color: "#1e3a8a" }}>{formData.budget || 100} <span style={{ fontSize: "1rem", color: "#94a3b8" }}>ر.س</span></h1>
                      <p style={{ margin: "10px 0 0", color: "#10b981", fontSize: "0.85rem", fontWeight: "800" }}>نظام حماية مَصيون: لن يتم تحويل المبلغ للفني إلا بعد تأكيدك ✅</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "15px" }}>
                      <button disabled={isPaying} onClick={confirmAndPay} style={{ width: "100%", padding: "18px", borderRadius: "16px", backgroundColor: "black", color: "white", border: "none", fontSize: "1.15rem", fontWeight: "900", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.2)" }}>
                          {isPaying ? "جاري المعالجة..." : " Pay الدفع السريع"}
                      </button>
                      <button disabled={isPaying} onClick={confirmAndPay} style={{ width: "100%", padding: "16px", borderRadius: "16px", backgroundColor: "white", color: "#0f172a", border: "2px solid #e2e8f0", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer" }}>
                          الدفع ببطاقة مدى / Visa 💳
                      </button>
                  </div>
                  <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>الدفع مشفر ومحمي بمعايير الأمان العالمية</p>
              </div>
          </div>
      )}

      <style jsx global>{`
        @keyframes spin {
            100% { transform: rotate(360deg); }
        }
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function PostTask() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f8fafc" }}><div style={{ width: "40px", height: "40px", border: "4px solid #1e3a8a", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div></div>}>
      <PostTaskContent />
    </Suspense>
  );
}
