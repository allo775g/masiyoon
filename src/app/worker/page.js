"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WorkerHeader from "./WorkerHeader";

export default function WorkerDashboard() {
  const { tasks, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "worker") {
      router.push("/worker/login");
    }
  }, [user, router]);

  if (!user || user.role !== "worker") return null;

  // 💸 حساب البيانات الحقيقية
  const myCompletedTasks = (tasks || []).filter(t => t.workerPhone === user.phone && t.status === "closed");
  const totalEarnings = myCompletedTasks.reduce((acc, t) => acc + (parseFloat(t.budget) || 0), 0);
  const openTasks = (tasks || []).filter(t => t.status === "Open" || t.status === "open");

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc" }}>
      <WorkerHeader />
      
      <main style={{ padding: "2rem 1rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* ملخص الأداء - متجاوب تماماً */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", marginBottom: "3rem" }}>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px" }}>أرباحك المحققة</p>
                <h2 style={{ fontSize: "2.2rem", fontWeight: "950", color: "#10b981" }}>{totalEarnings} <span style={{fontSize: "0.9rem", color: "#94a3b8"}}>SAR</span></h2>
            </div>
            <div className="glass-card" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "8px" }}>المهام المكتملة</p>
                <h2 style={{ fontSize: "2.2rem", fontWeight: "950" }}>{myCompletedTasks.length}</h2>
            </div>
            <div className="glass-card" style={{ padding: "1.5rem", background: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)", border: "none" }}>
                <p style={{ fontSize: "0.8rem", color: "#bfdbfe", marginBottom: "8px" }}>الحالة والمهنة</p>
                <h2 style={{ fontSize: "1.3rem", fontWeight: "950" }}>{user.idVerified ? "مهني موثق ✅" : "جاري التوثيق.."}</h2>
                <p style={{ fontSize: "0.75rem", marginTop: "5px", opacity: 0.7 }}>{user.profession || "فني صيانة"}</p>
            </div>
        </div>

        {/* شبكة المهام والإشعارات - الترتيب الذكي */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            
            {/* قسم المهام */}
            <section>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.4rem", fontWeight: "900" }}>طلبات الصيانة الآن</h3>
                    <span style={{ padding: "5px 12px", borderRadius: "100px", fontSize: "0.65rem", fontWeight: "800", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>تحديث لحظي 🟢</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                    {openTasks.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "30px", border: "1px dashed var(--glass-border)" }}>
                            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>لا يوجد طلبات جديدة في منطقتك حالياً.</p>
                        </div>
                    ) : (
                        openTasks.map(task => (
                            <div key={task.id} className="glass-card" style={{ padding: "1.5rem", textAlign: "right", position: "relative" }}>
                                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "0.6rem", background: "#111827", padding: "4px 10px", borderRadius: "6px", color: "#3b82f6", fontWeight: "950", border: "1px solid #1e293b" }}>{task.category}</span>
                                    {task.aiDiagnosed && <span style={{ fontSize: "0.6rem", background: "#312e81", padding: "4px 10px", borderRadius: "6px", color: "#a5b4fc", fontWeight: "950" }}>🤖 AI</span>}
                                </div>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "10px" }}>{task.title}</h4>
                                <div style={{ display: "flex", gap: "10px", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
                                    <span>📍 {task.location}</span>
                                    <span>📅 {task.date}</span>
                                </div>
                                
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--glass-border)", paddingTop: "1.2rem" }}>
                                    <div style={{ fontSize: "1.4rem", fontWeight: "950", color: "#f8fafc" }}>{task.budget} <span style={{fontSize: "0.8rem", opacity: 0.4}}>SAR</span></div>
                                    <Link href={`/tasks/view?id=${task.id}`} className="btn-premium btn-primary" style={{ padding: "8px 24px", borderRadius: "12px", fontSize: "0.9rem" }}>قبول</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* قسم الإشعارات - يظهر تحت المهام في الجوال */}
            <aside>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "900", marginBottom: "2rem" }}>تنبيهات مَصيون</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ background: "rgba(59, 130, 246, 0.05)", border: "1px solid rgba(59, 130, 246, 0.2)", padding: "1.5rem", borderRadius: "25px" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "#60a5fa", marginBottom: "8px" }}>حسابك نشط تماماً</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", lineHeight: "1.5" }}>تم ربط بياناتك المهنية بالسحاب. ستصلك الطلبات بناءً على موقعك الجغرافي المسجل.</p>
                    </div>
                </div>
            </aside>
            
        </div>
      </main>
    </div>
  );
}
