"use client";

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Menu, MessageSquare, MapPin, User, CalendarDays, Star, Megaphone, Bell, ScanFace, ShieldAlert, ShieldCheck, GraduationCap, Headset, FileText, Settings, LogOut, Crosshair, Sparkles, Navigation, CheckCircle2 } from "lucide-react";

export default function WorkerDashboard() {
  const { user, tasks, setUser } = useApp();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState([21.5433, 39.1728]); // Default: Jeddah
  const [isLocationReady, setIsLocationReady] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  // Get Real User Location
  const fetchLocation = (centerMap = false) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLoc = [position.coords.latitude, position.coords.longitude];
            setUserLocation(newLoc);
            setIsLocationReady(true);
            
            // Move marker if exists
            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng(newLoc);
            }
            // Center map if requested
            if (centerMap && mapInstanceRef.current) {
                mapInstanceRef.current.setView(newLoc, 16, { animate: true });
                showToast("تم تحديد موقعك بدقة 📍");
            }
          },
          (error) => {
            console.error("Location error:", error);
            setIsLocationReady(true); // Fallback to Jeddah
            if (centerMap) showToast("تعذر تحديد الموقع. الرجاء تفعيل الـ GPS ⚠️");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setIsLocationReady(true);
      }
  };

  useEffect(() => {
      fetchLocation();
  }, []);

  // Fetching REAL tasks from Firebase context
  const realTasks = tasks.filter(t => t.status === 'open' || !t.status).map((t, index) => {
      // Create a deterministic offset for demo if task lacks GPS coordinates
      const latOffset = (index % 2 === 0 ? 1 : -1) * 0.005 * ((index % 3) + 1);
      const lngOffset = (index % 3 === 0 ? 1 : -1) * 0.004 * ((index % 2) + 1);
      
      return {
          id: t.id,
          title: t.title || t.category || "طلب صيانة",
          location: t.location || [userLocation[0] + latOffset, userLocation[1] + lngOffset],
          price: t.price || t.suggestedPrice || Math.floor(Math.random() * 200) + 100,
          aiInsights: t.aiInsights || t.description || "بناءً على طلب العميل، يتطلب هذا العطل الفحص الميداني لتحديد المشكلة بدقة.",
          phone: t.clientPhone || "0500000000",
          originalTask: t
      };
  });

  useEffect(() => {
    if (!user || user.role !== "worker") {
      router.push("/worker/login");
    }
  }, [user, router]);

  // تهيئة الخريطة الحية (Live Map) 
  useEffect(() => {
    if (typeof window === "undefined" || !isLocationReady) return;

    const initMap = () => {
      if (!window.L || mapInstanceRef.current) return;
      
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(userLocation, 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Custom User Marker
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `<div style="width: 20px; height: 20px; background: #2563eb; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(37,99,235,0.8); animation: pulse 2s infinite;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(map);
    };

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-script")) {
      const script = document.createElement("script");
      script.id = "leaflet-script";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
    
  }, [isLocationReady]);

  // إضافة أو إزالة المهام من الخريطة بناءً على حالة الاتصال
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;

    // Clear old task markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    if (isOnline) {
      realTasks.forEach(task => {
        // Task Pin Icon (Masiyoon Blue & Yellow)
        const taskIcon = window.L.divIcon({
          className: 'custom-task-marker',
          html: `
            <div style="display: flex; flex-direction: column; items-center;">
              <div style="background: #1e3a8a; color: white; padding: 4px 10px; border-radius: 12px; font-weight: bold; font-size: 12px; border: 2px solid #fde047; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                ${task.price} ر.س
              </div>
              <div style="width: 2px; height: 15px; background: #1e3a8a; margin: 0 auto;"></div>
              <div style="width: 8px; height: 8px; background: #fde047; border-radius: 50%; margin: 0 auto; border: 2px solid #1e3a8a;"></div>
            </div>
          `,
          iconSize: [60, 45],
          iconAnchor: [30, 45]
        });

        const marker = window.L.marker(task.location, { icon: taskIcon }).addTo(map);
        marker.taskData = task; // Save task info inside the marker
        marker.on('click', () => {
          setActiveTask(task);
          map.setView(task.location, 16, { animate: true });
        });
        markersRef.current.push(marker);
      });
      
      // Auto-popup the first available task ONLY if they don't have one active and there are real tasks.
      setTimeout(() => {
          if (!activeTask && realTasks.length > 0 && !window.hasAutoShownTask) {
              window.hasAutoShownTask = true; // Prevent annoying looping
              setActiveTask(realTasks[0]);
              map.setView(realTasks[0].location, 15, { animate: true });
          }
      }, 2000);
    } else {
      setActiveTask(null);
      map.setView(userLocation, 14, { animate: true });
    }
  }, [isOnline, tasks]);

  if (!user || user.role !== "worker") return null;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden", backgroundColor: "#f8fafc" }}>
      
      {/* 1. Live Map Container */}
      <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* 2. Top Navigation (Masiyoon Distinctive Styling) */}
      <div style={{ position: "absolute", top: "0", left: "0", right: "0", zIndex: 20, padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: "linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)" }}>
        
        {/* Left Side: Masiyoon Logo & AI Badge */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#1e3a8a", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontWeight: "900", fontSize: "1.2rem", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.3)" }}>
                    M
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "900", color: "#1e3a8a", lineHeight: 1 }}>مَصيون</h1>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>بوابة المهنيين</span>
                </div>
            </div>
            {/* AI Status Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "white", padding: "6px 12px", borderRadius: "100px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
                <Sparkles size={14} color="#3b82f6" />
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6" }}>محرك الذكاء الاصطناعي نشط</span>
            </div>
        </div>

        {/* Right side: Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
            <button 
                onClick={() => router.push('/worker/chat?type=support')}
                style={{ 
                width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "white", 
                border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)", cursor: "pointer"
            }}>
              <MessageSquare size={20} color="#1e3a8a" />
            </button>
            <button 
                onClick={() => setIsDrawerOpen(true)}
                style={{ 
                    width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#1e3a8a", 
                    border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                    boxShadow: "0 4px 15px rgba(30, 58, 138, 0.3)", position: "relative", cursor: "pointer"
                }}
            >
                <Menu size={20} color="white" />
                <div style={{ position: "absolute", top: "10px", right: "10px", width: "10px", height: "10px", backgroundColor: "#fde047", borderRadius: "50%", border: "2px solid #1e3a8a" }} />
            </button>
        </div>
      </div>

      {/* 3. Task Details Modal (AI Integrated) */}
      {activeTask && isOnline && (
        <div style={{
            position: "absolute", top: "110px", left: "50%", transform: "translateX(-50%)",
            backgroundColor: "white", padding: "24px", borderRadius: "24px", width: "90%", maxWidth: "400px",
            boxShadow: "0 20px 50px rgba(30, 58, 138, 0.15)", zIndex: 30, animation: "slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
            borderTop: "6px solid #1e3a8a"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", alignItems: "center" }}>
                <span style={{ backgroundColor: "#eff6ff", color: "#1e3a8a", padding: "6px 14px", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "900" }}>طُلب للتو ⚡</span>
                <span style={{ fontSize: "1.4rem", fontWeight: "950", color: "#10b981" }}>{activeTask.price} <span style={{fontSize:"0.85rem", color: "#64748b"}}>ر.س</span></span>
            </div>
            
            <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "10px", color: "#0f172a", textAlign: "right" }}>{activeTask.title}</h3>
            
            {/* AI Insights Box */}
            <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "15px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", backgroundColor: "#3b82f6" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Sparkles size={16} color="#3b82f6" />
                    <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "#3b82f6" }}>تحليل مَصيون الذكي</span>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.6, margin: 0, textAlign: "right" }}>
                    {activeTask.aiInsights}
                </p>
            </div>
            
            <div style={{ display: "flex", gap: "12px", flexDirection: "row-reverse" }}>
                <button 
                    onClick={async () => {
                        const btn = document.getElementById("accept-btn");
                        if(btn) {
                            btn.innerHTML = "✅ تم القبول...";
                            btn.style.backgroundColor = "#10b981";
                        }
                        
                        // Update Firebase Task!
                        if (updateTask && activeTask.originalTask) {
                            await updateTask(activeTask.id, { 
                                status: "accepted", 
                                workerId: user.phone, 
                                workerName: user.name 
                            });
                        }
                        
                        setTimeout(() => {
                            alert("تم قبول المهمة بنجاح! سيتم توجيهك الآن لموقع العميل...");
                            // Remove task from map visually
                            markersRef.current.forEach(marker => {
                                if (marker.taskData && marker.taskData.id === activeTask.id && mapInstanceRef.current) {
                                    mapInstanceRef.current.removeLayer(marker);
                                }
                            });
                            // Save current active task to localStorage so active page can load it
                            localStorage.setItem('masiyoon_active_task', JSON.stringify(activeTask));
                            setActiveTask(null);
                            router.push('/worker/tasks/active');
                        }, 1000);
                    }}
                    id="accept-btn"
                    style={{ flex: 2, padding: "14px", borderRadius: "14px", border: "none", backgroundColor: "#1e3a8a", color: "white", fontSize: "1.05rem", fontWeight: "900", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.3)", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", transition: "all 0.3s ease" }}>
                    <CheckCircle2 size={18} /> قبول المهمة
                </button>
                <button onClick={() => setActiveTask(null)} style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #cbd5e1", backgroundColor: "white", color: "#64748b", fontSize: "1rem", fontWeight: "800", cursor: "pointer" }}>تجاهل</button>
            </div>
        </div>
      )}

      {/* 4. Bottom Controls Overlay */}
      <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", zIndex: 20 }}>
        
        {/* Custom Toast Notification */}
        {toastMessage && (
            <div style={{
                position: "absolute", bottom: "160px", left: "50%", transform: "translateX(-50%)",
                backgroundColor: "#0f172a", color: "white", padding: "12px 24px", borderRadius: "100px",
                fontSize: "0.9rem", fontWeight: "700", boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                animation: "slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards", zIndex: 40,
                whiteSpace: "nowrap"
            }}>
                {toastMessage}
            </div>
        )}

        {/* Recenter Button */}
        <div style={{ padding: "0 20px", marginBottom: "20px", display: "flex", justifyContent: "flex-end" }}>
            <button 
                onClick={() => fetchLocation(true)}
                style={{ 
                    width: "55px", height: "55px", borderRadius: "50%", backgroundColor: "white", 
                    border: "none", display: "flex", justifyContent: "center", alignItems: "center", 
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)", cursor: "pointer"
                }}
            >
              <Navigation size={24} color="#1e3a8a" strokeWidth={2} style={{ transform: "rotate(45deg) translate(-2px, 2px)" }} />
            </button>
        </div>

        {/* Masiyoon Styled Status Card */}
        <div style={{ backgroundColor: "white", padding: "20px 24px 35px", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", boxShadow: "0 -10px 40px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                    <h4 style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a", margin: "0 0 5px 0" }}>جاهز للعمل؟</h4>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", margin: 0 }}>استقبل مهام الذكاء الاصطناعي الآن</p>
                </div>
                {/* Status Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", backgroundColor: isOnline ? "#eff6ff" : "#f1f5f9", padding: "8px 16px", borderRadius: "100px" }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: isOnline ? "#10b981" : "#94a3b8", boxShadow: isOnline ? "0 0 10px #10b981" : "none" }}></div>
                    <span style={{ fontSize: "0.9rem", fontWeight: "900", color: isOnline ? "#1e3a8a" : "#64748b" }}>{isOnline ? "متصل" : "غير متصل"}</span>
                </div>
            </div>

            <button 
                onClick={() => setIsOnline(!isOnline)}
                style={{ 
                    width: "100%", padding: "18px", borderRadius: "20px", 
                    backgroundColor: isOnline ? "#ef4444" : "#1e3a8a", 
                    color: "white", 
                    border: "none", fontSize: "1.3rem", fontWeight: "900", cursor: "pointer",
                    boxShadow: isOnline ? "0 8px 25px rgba(239, 68, 68, 0.3)" : "0 8px 25px rgba(30, 58, 138, 0.3)",
                    transition: "all 0.3s ease"
                }}
            >
                {isOnline ? "إيقاف الاتصال" : "ابدأ استقبال الطلبات"}
            </button>
        </div>
      </div>

      {/* Slide-in Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} router={router} setUser={setUser} />

      <style jsx global>{`
        @keyframes pulse {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.8); opacity: 0; }
            100% { transform: scale(0.95); opacity: 0; }
        }
        @keyframes slideDown {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------
// Drawer Sidebar Component (Masiyoon Colors)
// ----------------------------------------------------------------------
const Drawer = ({ isOpen, onClose, user, router, setUser }) => {
    const wallet = user?.walletBalance || 0;
    const completedCount = user?.completedTasks || 0;

    return (
        <>
            <div 
                style={{
                    position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
                    opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
                    transition: "all 0.3s ease-out", zIndex: 40
                }}
                onClick={onClose}
            />
            <div 
                style={{
                    position: "fixed", top: 0, right: isOpen ? 0 : "-100%", bottom: 0,
                    width: "85%", maxWidth: "380px", backgroundColor: "#ffffff",
                    transition: "right 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)", zIndex: 50,
                    boxShadow: "-10px 0 30px rgba(0,0,0,0.1)", overflowY: "auto",
                    display: "flex", flexDirection: "column"
                }}
            >
                {/* Header */}
                <div style={{ backgroundColor: "#1e3a8a", padding: "40px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                    <div style={{ 
                        width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "white", 
                        display: "flex", justifyContent: "center", alignItems: "center", 
                        color: "#1e3a8a", fontSize: "2rem", fontWeight: "900", border: "4px solid #3b82f6", boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                        marginBottom: "15px",
                        backgroundImage: user?.photo ? `url(${user.photo})` : "none",
                        backgroundSize: "cover", backgroundPosition: "center"
                    }}>
                        {!user?.photo && (user?.name?.charAt(0) || "م")}
                    </div>
                    <h2 style={{ color: "white", margin: "0 0 5px 0", fontSize: "1.4rem", fontWeight: "900" }}>{user?.name || "فني صيانة"}</h2>
                    <span style={{ color: "#93c5fd", fontSize: "0.9rem", fontWeight: "700" }}>مهني موثق ✅</span>
                </div>
                
                {/* Stats */}
                <div style={{ display: "flex", width: "100%", backgroundColor: "#f8fafc", padding: "15px 0", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ textAlign: "center", flex: 1, borderRight: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: "950", color: "#1e3a8a" }}>{wallet.toLocaleString()}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>الدخل (ر.س)</div>
                    </div>
                    <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: "950", color: "#1e3a8a" }}>{completedCount}</div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>الطلبات المنجزة</div>
                    </div>
                </div>

                {/* Menu */}
                <div style={{ padding: "15px 0", display: "flex", flexDirection: "column", flex: 1 }}>
                    <MenuItem icon={<User size={20} color="#1e3a8a" />} text="الملف الشخصي" onClick={() => router.push('/worker/profile')} />
                    <MenuItem icon={<Star size={20} color="#1e3a8a" />} text="تقييم الأداء" badge="4.9" onClick={() => router.push('/worker/performance')} />
                    <MenuItem icon={<ScanFace size={20} color="#1e3a8a" />} text="الفحص الأمني (AI)" onClick={() => router.push('/worker/login/face-check')} />
                    <MenuItem icon={<Bell size={20} color="#1e3a8a" />} text="التنبيهات" badgeNum="3" onClick={() => router.push('/worker/notifications')} />
                    <MenuItem icon={<ShieldAlert size={20} color="#1e3a8a" />} text="الدعم والمساعدة" onClick={() => router.push('/worker/support')} />
                    <MenuItem icon={<Settings size={20} color="#1e3a8a" />} text="الإعدادات" onClick={() => router.push('/worker/settings')} />
                </div>
                
                {/* Footer */}
                <div 
                    onClick={() => {
                        setUser(null);
                        router.push('/worker/login');
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    style={{ borderTop: "1px solid #f1f5f9", padding: "20px", cursor: "pointer", transition: "background 0.2s" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ef4444", fontWeight: "900" }}>
                        <LogOut size={22} style={{ transform: "rotate(180deg)" }} />
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            </div>
        </>
    );
};

const MenuItem = ({ icon, text, badge, badgeNum, onClick }) => (
    <div 
        onClick={onClick}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        onMouseDown={(e) => e.currentTarget.style.transform = "scale(0.98)"}
        onMouseUp={(e) => e.currentTarget.style.transform = "scale(1)"}
        style={{ 
            display: "flex", alignItems: "center", justifyContent: "space-between", 
            padding: "16px 24px", cursor: "pointer", transition: "all 0.2s ease" 
        }}
    >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {badge && <span style={{ backgroundColor: "#fef3c7", color: "#d97706", padding: "4px 10px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "800" }}>{badge}</span>}
            {badgeNum && <span style={{ backgroundColor: "#ef4444", color: "white", width: "24px", height: "24px", borderRadius: "50%", fontSize: "0.8rem", fontWeight: "900", display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 2px 5px rgba(239,68,68,0.4)" }}>{badgeNum}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexDirection: "row-reverse" }}>
            {icon}
            <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "#334155" }}>{text}</span>
        </div>
    </div>
);
