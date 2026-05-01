"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function WorkerLogin() {
  const { setUser, loginWithPhone } = useApp();
  const router = useRouter();
  
  const [step, setStep] = useState(1); 
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("تكييف");
  const [idImage, setIdImage] = useState(null);
  const [idNumber, setIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleIdChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setIdImage(file);
        setPreview(URL.createObjectURL(file));
    }
  };

  const handleCheckPhone = async () => {
    if (!phone || phone.length < 9) return alert("يرجى إدخال رقم جوال صحيح");
    setLoading(true);
    try {
        const existing = await loginWithPhone(phone);
        if (existing && existing.role === 'worker') {
            router.push("/worker/login/face-check");
        } else {
            setStep(2);
        }
    } catch (e) {
        alert("خطأ في الاتصال");
    } finally {
        setLoading(false);
    }
  };

  const startAiVerification = async () => {
    if (!name || !idImage || !idNumber) return alert("يرجى إكمال جميع البيانات");
    
    // التحقق من أن رقم الهوية مكون من 10 أرقام
    if (idNumber.length !== 10 || isNaN(idNumber)) {
        return alert("يرجى إدخال رقم هوية صحيح مكون من 10 أرقام");
    }

    setLoading(true);
    try {
        const reader = new FileReader();
        reader.readAsDataURL(idImage);
        reader.onloadend = async () => {
            const base64Data = reader.result.split(',')[1];
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: JSON.stringify({ image: base64Data, filename: `id_${phone}.jpg` })
            });
            const { url } = await uploadRes.json();
            const aiRes = await fetch("/api/verify-id", {
                method: "POST",
                body: JSON.stringify({ idNumber, imageBase64: base64Data })
            });
            const aiData = await aiRes.json();
            
            if (aiData.success && aiData.data) {
                const { idNumber: extractedId, isExpired, fullName } = aiData.data;
                
                // دالة لتحويل الأرقام العربية (الهندية) الموجدوة في الهوية إلى أرقام إنجليزية
                const toEnglishDigits = val => {
                    const str = String(val || "").trim().replace(/\s/g, '');
                    return str.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
                };
                
                const normalizedExtractedId = toEnglishDigits(extractedId);
                const normalizedInputId = toEnglishDigits(idNumber);

                // التأكد من تطابق رقم الهوية المدخل مع المستخرج من الصورة بشكل دقيق (10 أرقام)
                if (normalizedExtractedId && normalizedExtractedId === normalizedInputId) {
                    if (isExpired === true || isExpired === "true") {
                        alert("🚫 الهوية منتهية الصلاحية! يرجى تقديم هوية سارية المفعول.");
                        return;
                    }
                    // إذا تطابق و سارية، نوجه لصفحة البصمة
                    await setUser({ phone, name: fullName || name, role: "worker", profession, idUrl: url, idVerified: true });
                    window.sessionStorage.setItem("temp_id_b64", base64Data); // حفظ مؤقت للمطابقة
                    router.push("/worker/login/face-check");
                } else {
                    alert(`🚫 رقم الهوية في الصورة لا يطابق الرقم المدخل`);
                }
            } else {
                alert(`🚫 عذراً، المشكلة من السيرفر: ${aiData.error || "لم نتمكن من قراءة الهوية"}`);
            }
        };
    } catch (e) {
        alert("🚨 فشل التوثيق السحابي");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div className="glass-card" style={{ maxWidth: "500px", width: "100%", padding: "3rem 2.5rem", textAlign: "center" }}>
        
        <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🛡️</div>
        
        {step === 1 ? (
          <>
            <h2 className="text-gradient" style={{ fontSize: "2.2rem", fontWeight: "950", marginBottom: "1rem" }}>بوابة المهنيين</h2>
            <p style={{ opacity: 0.5, marginBottom: "2.5rem" }}>أدخل رقم جوالك للانطلاق مع مَصيون</p>
            <input className="input-premium" type="tel" placeholder="05xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: "2rem", fontSize: "1.4rem", textAlign: "center", letterSpacing: "3px" }} />
            <button onClick={handleCheckPhone} className="btn-premium btn-primary" disabled={loading} style={{ width: "100%" }}>
                {loading ? "جاري التحقق..." : "دخول ←"}
            </button>
          </>
        ) : (
          <div className="animate-fade-in" style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 className="text-gradient" style={{ fontSize: "1.8rem", fontWeight: "950", textAlign: "center", marginBottom: "1rem" }}>توثيق مهني جديد</h2>
            
            <input className="input-premium" placeholder="الاسم الكامل" value={name} onChange={e => setName(e.target.value)} />
            <input className="input-premium" placeholder="رقم الهوية الوطنية" value={idNumber} onChange={e => setIdNumber(e.target.value)} />
            
            <select className="input-premium" value={profession} onChange={e => setProfession(e.target.value)}>
                <option value="تكييف">تكييف وتبريد ❄️</option>
                <option value="سباكة">سباكة وصرف 🚰</option>
                <option value="كهرباء">أعطال كهربائية ⚡</option>
                <option value="نقاشة">دهانات وديكور 🎨</option>
                <option value="نجارة">نجارة وأثاث 🔨</option>
                <option value="أجهزة منزلية">أجهزة منزلية 📺</option>
                <option value="تنظيف">نظافة عامة 🧹</option>
                <option value="أخرى">صيانة أخرى 🛠️</option>
            </select>
            
            <label style={{ position: "relative", height: "140px", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "2px dashed var(--glass-border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                {preview ? (
                    <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                    <>
                        <span style={{ fontSize: "2rem" }}>📸</span>
                        <span style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "10px" }}>التقط صورة الهوية (الأصل)</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--primary)", marginTop: "4px" }}>⚠️ يجب أن تكون الصورة أفقية (بالعرض)</span>
                    </>
                )}
                <input type="file" accept="image/*" hidden onChange={handleIdChange} />
            </label>

            <button onClick={startAiVerification} className="btn-premium btn-primary" disabled={loading} style={{ width: "100%", padding: "1.2rem", marginTop: "1rem" }}>
                {loading ? "جاري معالجة البيانات..." : "بدء التوثيق الذكي ⚡"}
            </button>
          </div>
        )}

        <button onClick={() => router.push("/")} style={{ marginTop: "2rem", color: "#f87171", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" }}>إلغاء والعودة</button>

      </div>
    </div>
  );
}
