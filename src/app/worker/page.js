"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Menu, MessageSquare, MapPin, User, Calendar, Star, Volume2, Bell, ScanFace, ShieldAlert, BookOpen, MessageCircle, FileText, Settings, LogOut, Crosshair, Briefcase, Focus } from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useApp();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [showTask, setShowTask] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== "worker") {
      router.push("/worker/login");
    }
  }, [user, router]);

  // محاكاة الاتصال وتوجيه المهام مباشرة في نفس الزون
  const handleConnect = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // محاكاة إرسال طلب جديد للعامل بعد ٣ ثواني من دخوله أونلاين
      setTimeout(() => {
        setShowTask(true);
      }, 3000);
    } else {
      setShowTask(false);
    }
  };

  if (!user || user.role !== "worker") return null;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden", backgroundColor: "#e5e7eb" }}>
      
      {/* 1. Map Background (Using OpenStreetMap iFrame or CSS) */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Simple iframe map background focused on Riyadh logic */}
        <iframe 
            src="https://www.openstreetmap.org/export/embed.html?bbox=46.60,24.65,46.80,24.85&layer=mapnik" 
            style={{ width: "100%", height: "100%", border: 0, pointerEvents: "auto" }}
            title="Map"
        />
        {/* Overlay to fade the map slightly and make the hexagons pop out */}
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(235, 225, 215, 0.5)", pointerEvents: "none" }} />
      </div>

      {/* 2. Hexagonal Demand Zones Overlay */}
      <HexGrid />

      {/* 3. Worker Current Location Marker */}
      <div style={{ 
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", 
          display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none", zIndex: 15
      }}>
        {/* Pulsing ring when online */}
        {isOnline && (
          <div style={{
            position: "absolute", width: "100px", height: "100px", backgroundColor: "rgba(59, 130, 246, 0.25)",
            borderRadius: "50%", animation: "pulse 2s infinite"
          }} />
        )}
        {/* User Marker */}
        <div style={{
            width: "44px", height: "44px", backgroundColor: "rgba(59, 130, 246, 0.2)", 
            borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
            boxShadow: "0 0 20px rgba(59,130,246,0.6)"
        }}>
            <div style={{
                width: "28px", height: "28px", backgroundColor: "#3b82f6", borderRadius: "50%",
                display: "flex", justifyContent: "center", alignItems: "center",
                border: "3px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "10px solid white", transform: "rotate(45deg) translate(-1px, -1px)" }} />
            </div>
        </div>
      </div>

      {/* 4. Top Action Buttons Overlay */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", pointerEvents: "none", zIndex: 20 }}>
        
        {/* Left Side: Chat */}
        <button style={{ 
            width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "#10b981", 
            border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
            boxShadow: "0 4px 15px rgba(16,185,129,0.3)", pointerEvents: "auto", cursor: "pointer"
        }}>
          <MessageSquare size={24} color="white" fill="white" />
        </button>

        {/* Center/Right side: Tools & Menu */}
        <div style={{ display: "flex", gap: "12px", pointerEvents: "auto" }}>
            <button style={{ 
                width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "white", 
                border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer"
            }}>
              <Briefcase size={22} color="black" />
            </button>
            <button style={{ 
                width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "white", 
                border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)", cursor: "pointer"
            }}>
              <Focus size={22} color="black" />
            </button>
            <button 
                onClick={() => setIsDrawerOpen(true)}
                style={{ 
                    width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "white", 
                    border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)", position: "relative", cursor: "pointer"
                }}
            >
              <Menu size={24} color="black" />
              {/* Red dot indicator */}
              <div style={{ position: "absolute", top: "12px", right: "12px", width: "10px", height: "10px", backgroundColor: "#ef4444", borderRadius: "50%", border: "2px solid white" }} />
            </button>
        </div>
      </div>

      {/* 5. Bottom Overlay */}
      <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", pointerEvents: "none", zIndex: 20 }}>
        {/* Location Center Button */}
        <div style={{ padding: "0 20px", marginBottom: "15px", display: "flex", justifyContent: "flex-start" }}>
            <button style={{ 
                width: "55px", height: "55px", borderRadius: "50%", backgroundColor: "white", 
                border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)", pointerEvents: "auto", cursor: "pointer"
            }}>
              <Crosshair size={26} color="black" />
            </button>
        </div>

        {/* White bottom connect card */}
        <div style={{ backgroundColor: "white", padding: "24px 20px 30px", borderTopLeftRadius: "28px", borderTopRightRadius: "28px", boxShadow: "0 -4px 20px rgba(0,0,0,0.05)", pointerEvents: "auto" }}>
            <button 
                onClick={handleConnect}
                style={{ 
                    width: "100%", padding: "18px", borderRadius: "100px", 
                    backgroundColor: isOnline ? "#ef4444" : "#fde047", 
                    color: isOnline ? "white" : "#0f172a", 
                    border: "none", fontSize: "1.3rem", fontWeight: "950", cursor: "pointer",
                    boxShadow: isOnline ? "0 4px 20px rgba(239, 68, 68, 0.4)" : "0 4px 20px rgba(253, 224, 71, 0.4)",
                    transition: "all 0.3s ease-in-out"
                }}
            >
                {isOnline ? "إنهاء الاتصال" : "الاتصال"}
            </button>
        </div>
      </div>

      {/* 6. Direct Task Dispatch Popup */}
      {showTask && (
          <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              backgroundColor: "white", padding: "24px", borderRadius: "24px", width: "90%", maxWidth: "350px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.2)", zIndex: 30, animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
          }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
                  <span style={{ backgroundColor: "#fee2e2", color: "#ef4444", padding: "6px 12px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "900", border: "1px solid #fecaca" }}>📍 طلب في منطقتك</span>
                  <span style={{ fontSize: "1.3rem", fontWeight: "950", color: "#10b981" }}>150 <span style={{fontSize:"0.8rem", color: "#64748b"}}>ر.س</span></span>
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "8px", color: "#0f172a", textAlign: "right" }}>إصلاح تسرب مياه مفاجئ</h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem", marginBottom: "25px", display: "flex", alignItems: "center", gap: "6px", justifyContent: "flex-end", fontWeight: "600" }}>
                  حي الملقا (تبعد 1.2 كم) <MapPin size={18} />
              </p>
              
              <div style={{ display: "flex", gap: "12px", flexDirection: "row-reverse" }}>
                  <button style={{ flex: 2, padding: "14px", borderRadius: "14px", border: "none", backgroundColor: "#3b82f6", color: "white", fontSize: "1.1rem", fontWeight: "900", boxShadow: "0 4px 15px rgba(59,130,246,0.3)", cursor: "pointer" }}>قبول الطلب</button>
                  <button onClick={() => setShowTask(false)} style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#64748b", fontSize: "1rem", fontWeight: "800", cursor: "pointer" }}>تجاهل</button>
              </div>
          </div>
      )}

      {/* 7. Slide-in Drawer Menu */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.6; }
            50% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes popIn {
            0% { opacity: 0; transform: translate(-50%, -40%) scale(0.9); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------
// Custom HexGrid Overlay Component (Simulates the Heatmap Zones)
// ----------------------------------------------------------------------
const HexGrid = () => {
    const hexRadius = 55; // الحجم المناسب للخلايا
    const hexWidth = hexRadius * Math.sqrt(3);
    const hexHeight = hexRadius * 2;
    const vertDist = hexHeight * 0.75;
    const horizDist = hexWidth;
    
    const rows = 25;
    const cols = 15;
    
    const hexagons = [];
    const hotCenterRow = 10;
    const hotCenterCol = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * horizDist + (row % 2 === 1 ? horizDist / 2 : 0);
        const y = row * vertDist;
        
        // حساب البعد عن "منطقة الكثافة العالية"
        const dist = Math.sqrt(Math.pow(row - hotCenterRow, 2) + Math.pow(col - hotCenterCol, 2));
        
        let fill = "transparent";
        let opacity = 0;
        
        if (dist < 4 || (dist < 6 && Math.random() > 0.4)) {
            fill = "#f87171"; // لون أحمر غامق للطلب العالي
            opacity = 0.5;
        } else if (dist < 8 || Math.random() > 0.6) {
            fill = "#fca5a5"; // لون برتقالي للطلب المتوسط
            opacity = 0.4;
        } else if (Math.random() > 0.7) {
            fill = "#fed7aa"; // لون برتقالي فاتح
            opacity = 0.35;
        }
        
        if (fill !== "transparent") {
          hexagons.push(
            <polygon 
              key={`${row}-${col}`}
              points={`
                ${x},${y - hexRadius} 
                ${x + hexWidth/2},${y - hexRadius/2} 
                ${x + hexWidth/2},${y + hexRadius/2} 
                ${x},${y + hexRadius} 
                ${x - hexWidth/2},${y + hexRadius/2} 
                ${x - hexWidth/2},${y - hexRadius/2}
              `}
              fill={fill}
              opacity={opacity}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="2"
            />
          );
        }
      }
    }
    
    return (
      <svg style={{ position: "absolute", top: -50, left: -50, width: "150%", height: "150%", pointerEvents: "none", zIndex: 10 }}>
        {hexagons}
      </svg>
    );
}

// ----------------------------------------------------------------------
// Drawer Sidebar Component
// ----------------------------------------------------------------------
const Drawer = ({ isOpen, onClose, user }) => {
    return (
        <>
            {/* Backdrop / غشاء الشاشة الخلفي */}
            <div 
                style={{
                    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)",
                    opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
                    transition: "all 0.3s ease-out", zIndex: 40
                }}
                onClick={onClose}
            />
            {/* Drawer Panel / لوحة القائمة الجانبية المنسدلة من اليمين */}
            <div 
                style={{
                    position: "fixed", top: 0, right: isOpen ? 0 : "-100%", bottom: 0,
                    width: "85%", maxWidth: "380px", backgroundColor: "#ffffff",
                    transition: "right 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)", zIndex: 50,
                    boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", overflowY: "auto",
                    display: "flex", flexDirection: "column"
                }}
            >
                {/* Header (Profile & Status) */}
                <div style={{ padding: "2rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #f1f5f9", position: "relative", backgroundColor: "#fafaf9" }}>
                    
                    {/* Status Dropdown Indicator */}
                    <div style={{ 
                        position: "absolute", top: "15px", backgroundColor: "white", padding: "8px 18px", 
                        borderRadius: "100px", display: "flex", alignItems: "center", gap: "8px", 
                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", cursor: "pointer"
                    }}>
                        <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>▼</span>
                        <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "#0f172a" }}>غير متصل</span>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#cbd5e1", border: "2px solid white", boxShadow: "0 0 0 1px #cbd5e1" }}></div>
                    </div>

                    {/* Profile Picture */}
                    <div style={{ 
                        width: "85px", height: "85px", borderRadius: "50%", backgroundColor: "#3b82f6", 
                        marginTop: "30px", marginBottom: "15px", display: "flex", justifyContent: "center", alignItems: "center", 
                        color: "white", fontSize: "2.2rem", fontWeight: "900", border: "4px solid white", boxShadow: "0 6px 15px rgba(59,130,246,0.2)"
                    }}>
                        {user?.name?.charAt(0) || "ف"}
                    </div>
                    
                    {/* Financial & Task Summary */}
                    <div style={{ display: "flex", width: "100%", justifyContent: "space-between", marginTop: "15px" }}>
                        <div style={{ textAlign: "center", flex: 1, borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexDirection: "row-reverse" }}>
                                <span style={{ fontSize: "1.6rem", fontWeight: "950", color: "#0f172a", letterSpacing: "-0.5px" }}>0.00</span>
                                <span style={{ fontSize: "1rem", fontWeight: "800", color: "#0f172a" }}>ر.س.</span>
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "3px", fontWeight: "600", marginTop: "2px" }}>
                                &lt; الدخل
                            </div>
                        </div>
                        <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: "1.6rem", fontWeight: "950", color: "#0f172a" }}>0</div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", display: "flex", alignItems: "center", gap: "3px", fontWeight: "600", marginTop: "2px" }}>
                                &lt; طلبات اليوم
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu List */}
                <div style={{ padding: "12px 0", display: "flex", flexDirection: "column", flex: 1 }}>
                    <MenuItem icon={<User size={22} color="#1e293b" strokeWidth={2} />} text="الملف الشخصي" badge="منتهي الصلاحية" />
                    <MenuItem icon={<Calendar size={22} color="#1e293b" strokeWidth={2} />} text="فترة الحجز" />
                    <MenuItem icon={<Star size={22} color="#1e293b" strokeWidth={2} />} text="الأداء" />
                    <MenuItem icon={<Volume2 size={22} color="#1e293b" strokeWidth={2} />} text="الإعلانات الترويجية" />
                    <MenuItem icon={<Bell size={22} color="#1e293b" strokeWidth={2} />} text="صندوق الوارد" badgeNum="14" />
                    <MenuItem icon={<ScanFace size={22} color="#1e293b" strokeWidth={2} />} text="الفحص العشوائي" />
                    <MenuItem icon={<ShieldAlert size={22} color="#1e293b" strokeWidth={2} />} text="مركز الاعتراض" />
                    <MenuItem icon={<BookOpen size={22} color="#1e293b" strokeWidth={2} />} text="مركز التعلم" />
                    <MenuItem icon={<MessageCircle size={22} color="#1e293b" strokeWidth={2} />} text="مركز المساعدة" />
                    <MenuItem icon={<FileText size={22} color="#1e293b" strokeWidth={2} />} text="الملاحظات" />
                    <MenuItem icon={<Settings size={22} color="#1e293b" strokeWidth={2} />} text="الإعدادات" />
                </div>
                
                {/* Footer / Logout */}
                <div style={{ borderTop: "1px solid #f1f5f9", padding: "15px 0", backgroundColor: "#fafaf9", marginTop: "auto" }}>
                    <MenuItem icon={<LogOut size={22} color="#ef4444" strokeWidth={2} />} text="تسجيل الخروج" textColor="#ef4444" hideArrow />
                </div>
            </div>
        </>
    );
};

// Item Component within Drawer
const MenuItem = ({ icon, text, badge, badgeNum, hideArrow, textColor = "#334155" }) => (
    <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        padding: "16px 24px", cursor: "pointer", borderBottom: "1px solid transparent",
        transition: "background 0.2s"
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!hideArrow && <span style={{ color: "#cbd5e1", fontSize: "0.9rem", fontWeight: "bold" }}>&lt;</span>}
            {badge && (
                <span style={{ 
                    border: "1px solid #fecaca", color: "#ef4444", backgroundColor: "#fef2f2",
                    padding: "3px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "800" 
                }}>
                    {badge}
                </span>
            )}
            {badgeNum && (
                <span style={{ 
                    backgroundColor: "#ff5000", color: "white", 
                    width: "22px", height: "22px", borderRadius: "50%", fontSize: "0.75rem", fontWeight: "900",
                    display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 5px rgba(255,80,0,0.3)"
                }}>
                    {badgeNum}
                </span>
            )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", flexDirection: "row-reverse" }}>
            {icon}
            <span style={{ fontSize: "1.05rem", fontWeight: "800", color: textColor }}>{text}</span>
        </div>
    </div>
);
