"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function FaceVerification() {
  const { user, setUser } = useApp();
  const router = useRouter();
  const [status, setStatus] = useState("init");
  const [rejectReason, setRejectReason] = useState("");
  const videoRef = useRef(null);

  useEffect(() => {
    // تشغيل الكاميرا فوراً
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        });
    }
  }, []);

  const captureFrame = () => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg").split(',')[1];
  };

  const startScan = async () => {
    setStatus("scanning");
    
    try {
      let faceBase64 = captureFrame();
      const idBase64 = window.sessionStorage.getItem("temp_id_b64") || "dummy_base64_string_for_existing_users";

      // If camera fails or is blocked, use a dummy string to bypass for testing
      if (!faceBase64) {
          console.warn("Camera failed, using dummy face data for testing bypass.");
          faceBase64 = "dummy_face_base64_for_testing";
      }

      const aiRes = await fetch("/api/ai/match-face", {
        method: "POST",
        body: JSON.stringify({ faceImageBase64: faceBase64, idImageBase64: idBase64 })
      });
      const data = await aiRes.json();

      if (data.success && data.data && data.data.isMatch) {
          setStatus("success");
          window.sessionStorage.setItem("masiyoon_face_verified", "true");
          window.sessionStorage.removeItem("temp_id_b64");
          
          setTimeout(() => {
            router.push("/worker");
          }, 1500);
      } else {
          setStatus("failed");
          setRejectReason(data.data?.reason || "لم يتم التعرف على تطابق بين الوجه والصورة.");
      }
    } catch (e) {
      setStatus("init");
      alert("🚨 فشل الاتصال بخادم المطابقة.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", color: "#fff" }}>
      <div style={{ maxWidth: "500px", width: "100%" }}>
        
        <h1 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "0.5rem" }}>بصمة الوجه 🛡️</h1>
        <p style={{ color: "#64748b", marginBottom: "3rem" }}>إجراء أمان إلزامي: يرجى تأكيد هويتك بالنظر للكاميرا.</p>

        <div style={{ 
            width: "280px", height: "280px", borderRadius: "50%", border: "4px solid #3b82f6", 
            margin: "0 auto 3rem auto", overflow: "hidden", position: "relative",
            boxShadow: status === "scanning" ? "0 0 40px #3b82f6" : "none"
        }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />
            {status === "scanning" && (
                <div style={{ 
                    position: "absolute", top: 0, left: 0, width: "100%", height: "4px", 
                    background: "#3b82f6", boxShadow: "0 0 20px #3b82f6",
                    animation: "faceScan 1.5s infinite ease-in-out"
                }}></div>
            )}
        </div>

        {status === "init" && (
            <button onClick={startScan} className="premium-button pulse-ai" style={{ width: "100%", padding: "1.3rem", borderRadius: "18px", background: "var(--primary)", border: "none", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "1.1rem" }}>
                افتح الكاميرا للمطابقة
            </button>
        )}

        {status === "scanning" && <h3 style={{ color: "#3b82f6" }}>جاري مطابقة الوجه مع الإقامة بدقة الذكاء الاصطناعي...</h3>}
        {status === "success" && <h3 style={{ color: "#10b981" }}>تمت المطابقة بنجاح! جاري الدخول..</h3>}
        
        {status === "failed" && (
            <div className="animate-fade-in" style={{ background: "rgba(239, 68, 68, 0.1)", border: "2px solid #ef4444", padding: "1.5rem", borderRadius: "12px", marginTop: "1rem" }}>
                <h3 style={{ color: "#ef4444", fontSize: "1.5rem", marginBottom: "0.5rem" }}>🚨 تم الحظر!</h3>
                <p style={{ color: "#fca5a5", fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.6" }}>
                    محرك <strong>مَصيون</strong> الأمني لك بالمرصاد 👁️<br/>
                    تبين أن الوجه لا يطابق الصورة المرفقة في الهوية.<br/>
                    <span style={{ fontSize: "0.9rem", color: "#ef4444", opacity: 0.8 }}>السبب الفني: {rejectReason}</span><br/><br/>
                    يُمنع منعاً باتاً التلاعب أو انتحال شخصية عامل آخر لضمان أمان عملائنا.
                </p>
                <button onClick={() => setStatus("init")} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "1rem", borderRadius: "8px", cursor: "pointer", width: "100%", fontWeight: "bold" }}>
                    أعد المحاولة
                </button>
            </div>
        )}

        <style>{` @keyframes faceScan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } } `}</style>
      </div>
    </div>
  );
}
