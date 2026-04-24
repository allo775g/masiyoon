"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Moon, Volume2, MapPin, ShieldAlert } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  
  const [toggles, setToggles] = useState({
      location: true,
      sound: true,
      dark: false,
      sos: true
  });

  const toggle = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

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
        <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>الإعدادات</h1>
      </div>

      <main style={{ padding: "20px" }}>
        
        <div style={{ backgroundColor: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", border: "1px solid #e2e8f0" }}>
            
            <SettingRow 
                icon={<MapPin size={22} color="#3b82f6" />} 
                title="تتبع الموقع الجغرافي" 
                subtitle="مطلوب لاستقبال مهام في منطقتك"
                isOn={toggles.location}
                onToggle={() => toggle('location')}
                hasBorder
            />
            
            <SettingRow 
                icon={<Volume2 size={22} color="#10b981" />} 
                title="أصوات التنبيهات" 
                subtitle="رنين عند وصول طلب صيانة جديد"
                isOn={toggles.sound}
                onToggle={() => toggle('sound')}
                hasBorder
            />

            <SettingRow 
                icon={<Moon size={22} color="#64748b" />} 
                title="الوضع الليلي" 
                subtitle="تغيير ألوان التطبيق لدرجات داكنة"
                isOn={toggles.dark}
                onToggle={() => toggle('dark')}
                hasBorder
            />

            <SettingRow 
                icon={<ShieldAlert size={22} color="#ef4444" />} 
                title="زر الطوارئ (SOS)" 
                subtitle="إظهار زر طلب النجدة السريع في الخريطة"
                isOn={toggles.sos}
                onToggle={() => toggle('sos')}
            />

        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "700" }}>إصدار التطبيق v2.1.0 (مَصيون الذكي)</span>
        </div>

      </main>
    </div>
  );
}

const SettingRow = ({ icon, title, subtitle, isOn, onToggle, hasBorder }) => (
    <div style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", 
        padding: "20px", borderBottom: hasBorder ? "1px solid #f1f5f9" : "none" 
    }}>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <div style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#f8fafc", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {icon}
            </div>
            <div>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: "800", color: "#0f172a" }}>{title}</h4>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{subtitle}</span>
            </div>
        </div>
        
        {/* iOS style toggle switch */}
        <div 
            onClick={onToggle}
            style={{ 
                width: "50px", height: "28px", borderRadius: "100px", 
                backgroundColor: isOn ? "#10b981" : "#cbd5e1", 
                position: "relative", cursor: "pointer", transition: "background 0.3s"
            }}
        >
            <div style={{ 
                width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "white", 
                position: "absolute", top: "2px", left: isOn ? "2px" : "24px", 
                transition: "left 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)", boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }} />
        </div>
    </div>
);
