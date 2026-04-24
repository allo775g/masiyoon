"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, MessageCircle, PhoneCall, Info } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", direction: "rtl", fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div style={{ 
          backgroundColor: "#1e3a8a", padding: "20px", display: "flex", alignItems: "center", gap: "15px",
          color: "white", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.2)"
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
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>الدعم والمساعدة</h1>
      </div>

      <main style={{ padding: "30px 20px" }}>
          
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto 15px", color: "#3b82f6" }}>
                <Info size={40} />
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#0f172a", marginBottom: "10px" }}>كيف يمكننا مساعدتك؟</h2>
            <p style={{ color: "#64748b", fontSize: "0.95rem" }}>فريق الدعم الفني لمَصيون متواجد على مدار الساعة لخدمتك وحل أي مشكلة تواجهك في الميدان.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button 
                onClick={() => router.push('/worker/chat?type=support')}
                style={{ 
                    width: "100%", padding: "20px", borderRadius: "16px", backgroundColor: "white", 
                    border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)", cursor: "pointer", transition: "transform 0.2s"
                }}
            >
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center", color: "#10b981" }}>
                    <MessageCircle size={24} />
                </div>
                <div style={{ textAlign: "right" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>محادثة فورية</h3>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>متوسط الرد: دقيقتين</span>
                </div>
            </button>

            <a 
                href="tel:999"
                style={{ 
                    width: "100%", padding: "20px", borderRadius: "16px", backgroundColor: "white", 
                    border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "15px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.02)", cursor: "pointer", textDecoration: "none", transition: "transform 0.2s"
                }}
            >
                <div style={{ width: "50px", height: "50px", borderRadius: "12px", backgroundColor: "#fef2f2", display: "flex", justifyContent: "center", alignItems: "center", color: "#ef4444" }}>
                    <PhoneCall size={24} />
                </div>
                <div style={{ textAlign: "right", color: "inherit" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>اتصال طوارئ</h3>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>للحالات الطارئة أثناء أداء المهام</span>
                </div>
            </a>
        </div>

      </main>
    </div>
  );
}
