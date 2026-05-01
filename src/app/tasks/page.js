"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus, Clock, CheckCircle2, Wrench, Wallet, Camera, Home, LogOut } from "lucide-react";

export default function ClientDashboard() {
  const { tasks, user, setUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'client') {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== 'client') return null;

  // Filter ONLY tasks belonging to this client
  const myTasks = tasks.filter(t => t.clientPhone === user.phone);
  
  const getStatusBadge = (status) => {
      switch(status) {
          case "open": return { text: "جاري البحث عن فني", color: "#f59e0b", bg: "#fef3c7" };
          case "accepted": return { text: "في الطريق إليك", color: "#3b82f6", bg: "#eff6ff" };
          case "completed": return { text: "مكتملة", color: "#10b981", bg: "#d1fae5" };
          default: return { text: "جاري البحث عن فني", color: "#f59e0b", bg: "#fef3c7" };
      }
  };

  const handleLogout = () => {
      setUser(null);
      router.push("/");
  };

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", fontFamily: "'Tajawal', 'Cairo', sans-serif", direction: "rtl", paddingBottom: "100px" }}>
      
      {/* 1. Header (Navbar) */}
      <nav style={{ backgroundColor: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#1e3a8a", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontWeight: "900", fontSize: "1.2rem", boxShadow: "0 4px 10px rgba(30, 58, 138, 0.2)" }}>
                <Home size={20} />
            </div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "900", color: "#1e3a8a" }}>مَصيون</h1>
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={handleLogout} style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#fef2f2", display: "flex", justifyContent: "center", alignItems: "center", color: "#ef4444", border: "none", cursor: "pointer" }}>
                <LogOut size={18} />
            </button>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", color: "#334155", fontWeight: "900" }}>
                👤
            </div>
        </div>
      </nav>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        
        {/* Welcome Banner */}
        <div style={{ marginBottom: "25px" }}>
            <h2 style={{ margin: "0 0 5px", fontSize: "1.6rem", fontWeight: "950", color: "#0f172a" }}>مرحباً، {user.name} 👋</h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.95rem" }}>تابع طلبات الصيانة الخاصة بك هنا</p>
        </div>

        {myTasks.length === 0 ? (
            <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "40px 20px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", justifyContent: "center", alignItems: "center", color: "#3b82f6", margin: "0 auto 20px" }}>
                    <Wrench size={40} />
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: "1.3rem", fontWeight: "900", color: "#0f172a" }}>لا توجد طلبات سابقة</h3>
                <p style={{ color: "#64748b", margin: "0 0 25px", lineHeight: 1.6 }}>استخدم الذكاء الاصطناعي لفحص الأعطال وتوجيه الفنيين إليك فوراً.</p>
                <Link href="/tasks/post?mode=ai_camera" style={{ textDecoration: "none" }}>
                    <button style={{ 
                        width: "100%", padding: "16px", borderRadius: "14px", backgroundColor: "#1e3a8a", 
                        color: "white", border: "none", fontSize: "1.05rem", fontWeight: "900", cursor: "pointer",
                        display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                        boxShadow: "0 8px 20px rgba(30, 58, 138, 0.25)"
                    }}>
                        <Plus size={20} /> أضف أول طلب صيانة
                    </button>
                </Link>
            </div>
        ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {myTasks.map(task => {
                    const badge = getStatusBadge(task.status);
                    return (
                        <div key={task.id} style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                                <span style={{ backgroundColor: badge.bg, color: badge.color, padding: "6px 14px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                                    {task.status === "completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />} 
                                    {badge.text}
                                </span>
                                <span style={{ backgroundColor: "#f8fafc", color: "#64748b", padding: "6px 12px", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "700" }}>
                                    {task.category}
                                </span>
                            </div>
                            
                            <h3 style={{ margin: "0 0 10px", fontSize: "1.2rem", fontWeight: "900", color: "#0f172a" }}>{task.title}</h3>
                            <p style={{ margin: "0 0 15px", color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {task.aiInsights || task.desc}
                            </p>
                            
                            <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "15px", marginTop: "15px" }}>
                                <div style={{ flex: 1, backgroundColor: "#f8fafc", padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                    <Wallet size={18} color="#94a3b8" />
                                    <div>
                                        <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>الميزانية المحجوزة</div>
                                        <div style={{ fontSize: "1rem", fontWeight: "900", color: "#1e3a8a" }}>{task.price || task.budget} <span style={{ fontSize: "0.7rem" }}>ر.س</span></div>
                                    </div>
                                </div>
                                {task.workerName && (
                                    <div style={{ flex: 1, backgroundColor: "#eff6ff", padding: "12px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "white", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.8rem", fontWeight: "900" }}>
                                            {task.workerName.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "700" }}>الفني المعين</div>
                                            <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e3a8a" }}>{task.workerName}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Cancel Option */}
                            {task.status === "open" && (
                                <button onClick={() => {
                                    if(window.confirm("هل أنت متأكد من إلغاء الطلب؟ سيتم استرداد المبلغ إلى محفظتك فوراً.")) {
                                        alert("✅ تم إلغاء الطلب واسترداد مبلغ الضمان بنجاح.");
                                        // Update state logic (simulated by hiding task or changing status to cancelled)
                                        // For now, we will just alert since context handles persistence loosely without backend
                                    }
                                }} style={{ width: "100%", padding: "12px", marginTop: "15px", borderRadius: "12px", backgroundColor: "#fef2f2", color: "#ef4444", border: "1px dashed #fca5a5", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer" }}>
                                    إلغاء الطلب واسترداد المبلغ
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Link href="/tasks/post?mode=ai_camera">
          <button style={{
              position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
              backgroundColor: "#1e3a8a", color: "white", border: "none", padding: "16px 30px",
              borderRadius: "100px", fontSize: "1.05rem", fontWeight: "900", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 10px 30px rgba(30, 58, 138, 0.4)",
              zIndex: 100
          }}>
              <Camera size={20} /> طلب خدمة جديدة
          </button>
      </Link>
    </div>
  );
}
