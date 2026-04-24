"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronRight, Phone, MessageSquare, MapPin, CheckCircle2, Sparkles, Navigation } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function ActiveTaskPage() {
  const router = useRouter();
  const { user, setUser, updateTask } = useApp();
  const [taskStatus, setTaskStatus] = useState("في الطريق"); // "في الطريق", "تم الوصول", "مكتملة"
  const [task, setTask] = useState(null);

  useEffect(() => {
      const savedTask = localStorage.getItem('masiyoon_active_task');
      if (savedTask) {
          setTask(JSON.parse(savedTask));
      } else {
          router.push('/worker');
      }
  }, [router]);

  const handleAction = async () => {
      if (taskStatus === "في الطريق") {
          setTaskStatus("تم الوصول");
      } else if (taskStatus === "تم الوصول") {
          setTaskStatus("مكتملة");
          try {
              if (updateTask && task && task.id) {
                  await updateTask(task.id, { status: "completed" });
                  
                  // Update worker stats!
                  const currentWallet = user.walletBalance || 0;
                  const currentCompleted = user.completedTasks || 0;
                  await setUser({
                      ...user,
                      walletBalance: currentWallet + task.price,
                      completedTasks: currentCompleted + 1
                  });
              }
          } catch (e) {
              console.error(e);
          }
          localStorage.removeItem('masiyoon_active_task');
          alert(`تم إنجاز المهمة بنجاح! تم إضافة ${task.price} ر.س لمحفظتك.`);
          router.push("/worker");
      }
  };

  if (!task) return null;

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", direction: "rtl", fontFamily: "'Tajawal', 'Cairo', sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ 
          backgroundColor: "#1e3a8a", padding: "20px 20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
          color: "white", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px",
          boxShadow: "0 10px 25px rgba(30, 58, 138, 0.2)", position: "relative", zIndex: 1
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <button 
                onClick={() => router.push('/worker')}
                style={{ 
                    width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.1)", 
                    border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: "pointer"
                }}
            >
            <ChevronRight size={24} />
            </button>
            <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900" }}>مهمة جارية</h1>
        </div>
        <div style={{ backgroundColor: "#10b981", padding: "4px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "8px", height: "8px", backgroundColor: "white", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            {taskStatus}
        </div>
      </div>

      <main style={{ padding: "0 20px", marginTop: "-20px", position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", gap: "15px", paddingBottom: "100px" }}>
        
        {/* Client Info Card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ width: "55px", height: "55px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", color: "#1e3a8a", fontSize: "1.5rem", fontWeight: "900" }}>
                    {(task.clientName || "ع").charAt(0)}
                </div>
                <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: "900", color: "#0f172a" }}>{task.clientName || "عميل مَصيون"}</h3>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>طالب الخدمة</span>
                </div>
            </div>
            
            {/* Contact Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
                <a href={`tel:${task.phone || "0500000000"}`} style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center", color: "#10b981", textDecoration: "none" }}>
                    <Phone size={20} />
                </a>
                <button onClick={() => router.push("/worker/chat?type=client")} style={{ width: "45px", height: "45px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", justifyContent: "center", alignItems: "center", color: "#3b82f6", border: "none", cursor: "pointer" }}>
                    <MessageSquare size={20} />
                </button>
            </div>
        </div>

        {/* Task Details Card */}
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                <div>
                    <h2 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", fontWeight: "900", color: "#0f172a" }}>{task.title}</h2>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748b", fontSize: "0.85rem" }}>
                        <MapPin size={14} /> يبعد {task.distance || "4 كم"} ({task.time || "10 دقيقة"})
                    </div>
                </div>
                <div style={{ backgroundColor: "#f8fafc", padding: "6px 12px", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#1e3a8a" }}>{task.price}</span>
                    <span style={{ fontSize: "0.75rem", color: "#64748b", marginRight: "4px" }}>ر.س</span>
                </div>
            </div>

            {/* Google Maps Navigation Button */}
            <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${task.location?.[0] || 21.5532},${task.location?.[1] || 39.1912}`} 
                target="_blank" rel="noopener noreferrer"
                style={{ 
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", 
                    width: "100%", padding: "12px", borderRadius: "14px", backgroundColor: "#f0f9ff", 
                    color: "#0369a1", fontSize: "0.95rem", fontWeight: "800", textDecoration: "none",
                    marginBottom: "15px", border: "1px solid #bae6fd", transition: "all 0.2s"
                }}
            >
                <Navigation size={18} style={{ transform: "rotate(45deg) translate(-2px, 2px)" }} /> فتح المسار في خرائط جوجل
            </a>

            {/* Problem Image */}
            <div style={{ width: "100%", height: "150px", borderRadius: "16px", backgroundImage: `url(${task.imageUrl || "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=400&auto=format&fit=crop"})`, backgroundSize: "cover", backgroundPosition: "center", marginBottom: "15px" }} />

            {/* AI Insights */}
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "16px", padding: "15px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, right: 0, width: "4px", height: "100%", backgroundColor: "#3b82f6" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Sparkles size={16} color="#3b82f6" />
                    <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "#3b82f6" }}>وصف وتحليل المشكلة</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "#1e40af", lineHeight: 1.6, margin: 0 }}>
                    {task.aiInsights}
                </p>
            </div>
        </div>

      </main>

      {/* Bottom Floating Action Bar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "20px", backgroundColor: "white", borderTopLeftRadius: "30px", borderTopRightRadius: "30px", boxShadow: "0 -10px 40px rgba(0,0,0,0.08)", zIndex: 10 }}>
        <button 
            onClick={handleAction}
            style={{ 
                width: "100%", padding: "18px", borderRadius: "20px", 
                backgroundColor: taskStatus === "في الطريق" ? "#1e3a8a" : "#10b981", 
                color: "white", border: "none", fontSize: "1.2rem", fontWeight: "900", cursor: "pointer",
                boxShadow: taskStatus === "في الطريق" ? "0 8px 25px rgba(30, 58, 138, 0.3)" : "0 8px 25px rgba(16, 185, 129, 0.3)",
                display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", transition: "all 0.3s ease"
            }}
        >
            {taskStatus === "في الطريق" ? (
                <><Navigation size={22} style={{ transform: "rotate(45deg) translate(-2px, 2px)" }} /> لقد وصلت للموقع</>
            ) : (
                <><CheckCircle2 size={22} /> إنهاء المهمة وتحصيل المبلغ</>
            )}
        </button>
      </div>

    </div>
  );
}
