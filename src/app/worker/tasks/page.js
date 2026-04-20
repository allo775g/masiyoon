"use client";

import { useApp } from "@/context/AppContext";
import WorkerHeader from "../WorkerHeader";

export default function WorkerTasks() {
  const { tasks } = useApp();
  const openTasks = tasks.filter(t => t.status === "open");

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc" }}>
      <WorkerHeader />
      <main className="container" style={{ padding: "4rem 1rem" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>جميع الطلبات المتاحة 🔍</h2>
            <div style={{ display: "flex", gap: "10px" }}>
                <select style={{ background: "#0f172a", border: "1px solid #1e293b", color: "#fff", padding: "10px 20px", borderRadius: "12px" }}>
                    <option>كل التخصصات</option>
                    <option>كهرباء</option>
                    <option>سباكة</option>
                </select>
            </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {openTasks.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "8rem", background: "#0f172a", borderRadius: "32px", border: "2px dashed #1e293b" }}>
                    لا توجد طلبات جديدة حالياً.
                </div>
            ) : (
                openTasks.map(task => (
                    <div key={task.id} style={{ 
                        background: "#0f172a", padding: "2rem", borderRadius: "32px", border: "1px solid #1e293b",
                        display: "flex", flexDirection: "column", gap: "1.2rem"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                             <span style={{ fontSize: "0.7rem", background: "#3b82f6", color: "#fff", padding: "6px 12px", borderRadius: "8px", fontWeight: "800" }}>{task.category}</span>
                             <span style={{ fontSize: "1.2rem", fontWeight: "900" }}>{task.budget} <span style={{fontSize: "0.7rem", opacity: 0.5}}>SAR</span></span>
                        </div>
                        <div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: "800", marginBottom: "10px" }}>{task.title}</h3>
                            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: "1.6", height: "3.2em", overflow: "hidden" }}>{task.desc}</p>
                        </div>
                        <div style={{ padding: "1rem", background: "#020617", borderRadius: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>📍 {task.location}</span>
                            <button style={{ background: "transparent", border: "none", color: "#3b82f6", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>تفاصيل أكثر ←</button>
                        </div>
                    </div>
                ))
            )}
        </div>

      </main>
    </div>
  );
}
