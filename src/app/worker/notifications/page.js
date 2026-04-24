"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { ChevronRight, BellOff } from "lucide-react";

export default function NotificationsPage() {
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
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>التنبيهات</h1>
      </div>

      {/* Empty State */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", padding: "20px" }}>
          <div style={{ 
              width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#e2e8f0", 
              display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px"
          }}>
              <BellOff size={40} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: "1.3rem", fontWeight: "900", color: "#334155", marginBottom: "10px" }}>لا توجد إشعارات جديدة</h2>
          <p style={{ color: "#64748b", textAlign: "center", fontSize: "0.95rem", maxWidth: "250px" }}>
              أنت على اطلاع بكل شيء! سنقوم بإرسال إشعار لك فور وجود مهام أو تحديثات جديدة.
          </p>
      </div>

    </div>
  );
}
