"use client";

import { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import WorkerHeader from "../WorkerHeader";

export default function WorkerWallet() {
  const { tasks, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "worker") {
      router.push("/worker/login");
    }
  }, [user, router]);

  if (!user || user.role !== "worker") return null;

  // استخراج العمليات المالية الحقيقية للمهني المسجل دخول
  const myCompletedTasks = tasks.filter(t => t.workerPhone === user.phone && t.status === "closed");
  const totalBalance = myCompletedTasks.reduce((acc, t) => acc + (parseFloat(t.budget) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc" }}>
      <WorkerHeader />
      <main className="container" style={{ padding: "4rem 1rem" }}>
        
        <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "3rem" }}>إدارة المحفظة والمالية 💸</h2>

        <div className="responsive-grid">
            
            <section style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ background: "#0f172a", padding: "2.5rem", borderRadius: "32px", border: "1px solid #1e293b", overflow: "hidden" }}>
                    <p style={{ color: "#64748b", fontWeight: "600", marginBottom: "10px" }}>رصيدك المتاح للسحب</p>
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                        <h2 style={{ fontSize: "3.5rem", fontWeight: "950", color: "#10b981", margin: 0 }}>{totalBalance} <span style={{fontSize: "1rem", color: "#64748b"}}>ريال</span></h2>
                        <button className="premium-button" style={{ 
                            padding: "12px 20px", borderRadius: "12px", opacity: totalBalance > 0 ? 1 : 0.5, whiteSpace: "nowrap"
                        }} disabled={totalBalance <= 0}>طلب سحب الرصيد</button>
                    </div>
                </div>

                <div style={{ background: "#0f172a", padding: "2rem", borderRadius: "32px", border: "1px solid #1e293b" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1.5rem" }}>سجل العمليات المالية الفعلية</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {myCompletedTasks.length === 0 ? (
                            <p style={{ opacity: 0.3, textAlign: "center", padding: "2rem" }}>لا توجد عمليات مالية سابقة.</p>
                        ) : (
                            myCompletedTasks.map(task => (
                                <div key={task.id} style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #1e293b" }}>
                                    <div>
                                        <p style={{ fontSize: "0.9rem", fontWeight: "700" }}>{task.title}</p>
                                        <p style={{ fontSize: "0.7rem", color: "#64748b" }}>{task.date}</p>
                                    </div>
                                    <p style={{ color: "#10b981", fontWeight: "900" }}>+{task.budget} ريال</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            <aside style={{ background: "#0f172a", padding: "2rem", borderRadius: "32px", border: "1px solid #1e293b", alignSelf: "start" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "1.5rem" }}>إحصائيات المهني</h3>
                <div style={{ padding: "1.5rem", background: "#020617", borderRadius: "20px", marginBottom: "1rem", textAlign: "center" }}>
                    <p style={{ fontSize: "0.75rem", color: "#64748b" }}>السجل المالي لـ {user.name}</p>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#3b82f6" }}>حساب موثق</h4>
                </div>
                <p style={{ fontSize: "0.7rem", color: "#64748b", lineHeight: "1.6" }}>
                    * يتم احتساب الرصيد بناءً على العمليات التي تمت الموافقة عليها من قبل العميل في قاعدة البيانات.
                </p>
            </aside>
        </div>
      </main>
    </div>
  );
}
