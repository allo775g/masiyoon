"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ChevronRight, Save, ShieldCheck, Camera } from "lucide-react";

export default function WorkerProfile() {
  const { user, setUser } = useApp();
  const router = useRouter();
  const [formData, setFormData] = useState({ ...user });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...formData, lastUpdated: Date.now() });
    
    const btn = document.getElementById("save-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = "✅ تم الحفظ بنجاح";
    btn.style.backgroundColor = "#10b981";
    
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.backgroundColor = "#1e3a8a";
        router.push("/worker");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", direction: "rtl", fontFamily: "'Tajawal', 'Cairo', sans-serif", paddingBottom: "40px" }}>
      
      {/* Header with rounded bottom */}
      <div style={{ 
          backgroundColor: "#1e3a8a", padding: "20px 20px 60px", display: "flex", alignItems: "center", gap: "15px",
          color: "white", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px",
          boxShadow: "0 10px 25px rgba(30, 58, 138, 0.2)", position: "relative", zIndex: 1
      }}>
        <button 
            onClick={() => router.push('/worker')}
            style={{ 
                width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.1)", 
                border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: "pointer"
            }}
        >
          <ChevronRight size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>الملف الشخصي</h1>
      </div>

      <main style={{ padding: "0 20px", marginTop: "-40px", position: "relative", zIndex: 2 }}>
        <div style={{ 
            backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
            {/* Avatar with Photo Upload */}
            <div style={{ position: "relative", marginTop: "-60px", marginBottom: "15px" }}>
                <div style={{ 
                    width: "90px", height: "90px", borderRadius: "50%", backgroundColor: "#f1f5f9", 
                    display: "flex", justifyContent: "center", alignItems: "center", 
                    color: "#1e3a8a", fontSize: "2.5rem", fontWeight: "900", border: "4px solid white", 
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)", overflow: "hidden",
                    backgroundImage: formData.photo ? `url(${formData.photo})` : "none", 
                    backgroundSize: "cover", backgroundPosition: "center"
                }}>
                    {!formData.photo && (formData.name?.charAt(0) || "م")}
                </div>
                
                <label style={{
                    position: "absolute", bottom: 0, right: 0, width: "30px", height: "30px",
                    backgroundColor: "#1e3a8a", borderRadius: "50%", display: "flex", justifyContent: "center",
                    alignItems: "center", color: "white", cursor: "pointer", border: "2px solid white",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                }}>
                    <Camera size={14} />
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                        const file = e.target.files[0];
                        if(file) {
                            const reader = new FileReader();
                            reader.onload = (e) => setFormData({...formData, photo: e.target.result});
                            reader.readAsDataURL(file);
                        }
                    }} />
                </label>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "30px" }}>
                <ShieldCheck size={20} color="#10b981" />
                <span style={{ color: "#10b981", fontSize: "0.9rem", fontWeight: "800" }}>حساب موثق من مَصيون</span>
            </div>

            <form onSubmit={handleSave} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Input Group */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "700" }}>الاسم الكامل (كما في الهوية)</label>
                    <input 
                        required
                        style={{ 
                            width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", 
                            backgroundColor: "#f8fafc", color: "#0f172a", fontSize: "1.05rem", fontWeight: "600",
                            outline: "none", transition: "border-color 0.2s"
                        }} 
                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        value={formData.name || ""} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>

                {/* Input Group */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "700" }}>رقم الجوال المسجل</label>
                    <input 
                        required type="tel"
                        style={{ 
                            width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", 
                            backgroundColor: "#f8fafc", color: "#0f172a", fontSize: "1.05rem", fontWeight: "600",
                            outline: "none", transition: "border-color 0.2s", textAlign: "right"
                        }} 
                        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                        onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
                        value={formData.phone || ""} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                    />
                </div>

                {/* Input Group */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "700" }}>التخصص المعتمد لدى مَصيون</label>
                    <input 
                        readOnly
                        style={{ 
                            width: "100%", padding: "16px", borderRadius: "14px", border: "1px solid #cbd5e1", 
                            backgroundColor: "#f1f5f9", color: "#1e3a8a", fontSize: "1.05rem", fontWeight: "900",
                            outline: "none", cursor: "not-allowed"
                        }} 
                        value={formData.profession || "فني صيانة عامة"} 
                    />
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>* لتغيير التخصص يرجى التواصل مع الدعم الفني وإرفاق الرخص اللازمة.</span>
                </div>

                <button 
                    id="save-btn"
                    type="submit" 
                    style={{ 
                        marginTop: "10px", width: "100%", padding: "18px", borderRadius: "16px", 
                        backgroundColor: "#1e3a8a", color: "white", fontSize: "1.1rem", fontWeight: "900", 
                        border: "none", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                        boxShadow: "0 8px 25px rgba(30, 58, 138, 0.25)", transition: "all 0.3s ease"
                    }}
                >
                    <Save size={20} /> حفظ التحديثات
                </button>
            </form>
        </div>
      </main>

    </div>
  );
}
