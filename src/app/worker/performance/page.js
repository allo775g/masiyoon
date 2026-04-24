"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Star, TrendingUp, Award } from "lucide-react";

export default function PerformancePage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", direction: "rtl", fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>
      
      {/* Header */}
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
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>تقييم الأداء</h1>
      </div>

      <main style={{ padding: "0 20px", marginTop: "-40px", position: "relative", zIndex: 2 }}>
        <div style={{ 
            backgroundColor: "white", borderRadius: "24px", padding: "30px 20px", 
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
            {/* Rating Circle */}
            <div style={{ 
                width: "110px", height: "110px", borderRadius: "50%", backgroundColor: "#fef3c7", 
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", 
                color: "#d97706", border: "4px solid white", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", 
                marginTop: "-60px", marginBottom: "15px"
            }}>
                <span style={{ fontSize: "2.2rem", fontWeight: "950", lineHeight: 1 }}>4.9</span>
                <div style={{ display: "flex", gap: "2px", marginTop: "5px" }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#d97706" color="#d97706" />)}
                </div>
            </div>
            
            <h2 style={{ fontSize: "1.4rem", fontWeight: "900", color: "#0f172a", marginBottom: "5px" }}>أداء استثنائي! 🏆</h2>
            <p style={{ fontSize: "0.95rem", color: "#64748b", textAlign: "center", marginBottom: "30px", maxWidth: "250px" }}>
                أنت مصنف ضمن أفضل 5% من المهنيين في منطقتك لهذا الشهر.
            </p>

            {/* Stats Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <TrendingUp size={22} color="#3b82f6" />
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem", fontWeight: "800", color: "#1e3a8a" }}>معدل إكمال المهام</h4>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>98% من الطلبات المجدولة</span>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "15px", padding: "15px", backgroundColor: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Award size={22} color="#10b981" />
                    </div>
                    <div>
                        <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem", fontWeight: "800", color: "#065f46" }}>تقييمات العملاء</h4>
                        <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>45 مراجعة إيجابية متتالية</span>
                    </div>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}
