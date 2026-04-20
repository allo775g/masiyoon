"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function BrowseTasks() {
  const { tasks, t } = useApp();

  return (
    <div style={{ padding: "4rem 1.5rem", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto" }}>
      
      <h2 className="text-gradient" style={{ fontSize: "2.5rem", fontWeight: "950", textAlign: "center", marginBottom: "4rem" }}>
         الطلبات المتاحة
      </h2>

      {(tasks || []).length === 0 ? (
        <div className="glass-card" style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>☁️</div>
            <p style={{ fontSize: "1.2rem", opacity: 0.5 }}>لا توجد طلبات صيانة حالياً. كن أول من يطلب!</p>
            <Link href="/tasks/post" className="btn-premium btn-primary" style={{ marginTop: "2rem" }}>اطلب صيانة الآن</Link>
        </div>
      ) : (
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", 
            gap: "2.5rem" 
        }}>
          {tasks.map((task) => (
            <div key={task.id} className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", textAlign: "right" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ padding: "5px 15px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "800", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>
                      🛠️ {task.category || "عام"}
                  </span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.4 }}>{task.date}</span>
              </div>

              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "0.8rem" }}>{task.title}</h3>
                <p style={{ fontSize: "0.9rem", opacity: 0.5, lineHeight: "1.6", height: "3em", overflow: "hidden" }}>{task.desc}</p>
              </div>

              <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid var(--glass-border)", paddingTop: "1.5rem" }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.7rem", opacity: 0.4, marginBottom: "5px" }}>الميزانية المتوقعة</p>
                    <p style={{ fontSize: "1.3rem", fontWeight: "950", color: "#3b82f6" }}>{task.budget} <span style={{ fontSize: "0.8rem" }}>SAR</span></p>
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.7rem", opacity: 0.4, marginBottom: "5px" }}>الموقع</p>
                    <p style={{ fontSize: "1rem", fontWeight: "700" }}>📍 {task.location}</p>
                </div>
              </div>

              <Link href={`/tasks/view?id=${task.id}`} className="btn-premium btn-primary" style={{ width: "100%", padding: "0.8rem" }}>
                  عرض التفاصيل ⚡
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
