"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import WorkerHeader from "../WorkerHeader";

export default function WorkerProfile() {
  const { user, setUser } = useApp();
  const [formData, setFormData] = useState({ ...user });

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...formData, lastUpdated: Date.now() });
    alert("تم حفظ بيانات المهني بنجاح ✅");
  };

  const handleLogout = () => {
    if (confirm("خروج من بوابة المهني؟")) {
        setUser(null);
        localStorage.removeItem("masiyoon_user");
        window.location.href = "/worker/login";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc" }}>
      <WorkerHeader />
      <main className="container" style={{ padding: "4rem 1rem" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", background: "#0f172a", padding: "3rem", borderRadius: "32px", border: "1px solid #1e293b" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "2.5rem", textAlign: "center" }}>الملف الشخصي للمهني</h2>
            
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>الاسم الكامل (كما في الرخصة)</label>
                    <input className="form-control" style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff" }} value={formData.name || ""} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>رقم الجوال المسجل</label>
                    <input className="form-control" style={{ background: "#1e293b", border: "1px solid #334155", color: "#fff" }} value={formData.phone || ""} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    <label style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>التخصص المعتمد</label>
                    <input className="form-control" readOnly style={{ background: "#020617", border: "1px solid #334155", color: "#3b82f6", fontWeight: "800" }} value={formData.profession || "سباكة"} />
                </div>

                <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <button type="submit" className="premium-button" style={{ borderRadius: "12px", padding: "12px" }}>حفظ التعديلات</button>
                    <button type="button" onClick={handleLogout} className="premium-button" style={{ background: "transparent", border: "1px solid #ef4444", color: "#ef4444", borderRadius: "12px" }}>تسجيل الخروج</button>
                </div>
            </form>
        </div>
      </main>
    </div>
  );
}
