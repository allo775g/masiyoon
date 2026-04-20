"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function Profile() {
  const { user, setUser, t, tasks, usersList, supportMessages, replyToSupport } = useApp();
  const [formData, setFormData] = useState({ phone: "", name: "", role: "client", profession: "", location: "", idNumber: "" });
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [replyText, setReplyText] = useState("");

  const ADMIN_PHONE = "0534976935";
  const isAdmin = user?.phone === ADMIN_PHONE;
  const categories = t?.allCategories || [];

  useEffect(() => { if (user) setFormData({ ...user }); }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...formData, lastUpdated: Date.now() });
    alert("تم حفظ البيانات بنجاح ✅");
  };

  const handleLogout = () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
       setUser(null);
       localStorage.removeItem("taskyawm_user");
       window.location.reload();
    }
  };

  const totals = (tasks || []).reduce((acc, task) => {
      const budget = parseFloat(task.budget) || 0;
      acc.totalVolume += budget;
      acc.commission += (budget * 0.10);
      return acc;
  }, { totalVolume: 0, commission: 0 });

  const chatThreads = (supportMessages || []).reduce((acc, msg) => {
      const phone = msg.userPhone;
      if (!phone) return acc;
      if (!acc[phone]) acc[phone] = { phone, lastMsg: msg, messages: [] };
      acc[phone].messages.push(msg);
      if (msg.createdAt > acc[phone].lastMsg.createdAt) acc[phone].lastMsg = msg;
      return acc;
  }, {});
  const sortedThreads = Object.values(chatThreads).sort((a,b) => b.lastMsg.createdAt - a.lastMsg.createdAt);

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeChatUser) return;
    await replyToSupport(activeChatUser, replyText);
    setReplyText("");
  };

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", minHeight: "100vh" }}>
      
      {isAdmin && (
        <div className="glassy animate-fade-in" style={{ marginBottom: "3rem", padding: "1.5rem", border: "1.5px solid var(--color-accent)", borderRadius: "35px" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid var(--glass-border)", marginBottom: "1.5rem" }}>
              <div>
                 <h2 style={{ fontSize: "1.2rem", fontWeight: "950", color: "var(--color-accent-light)" }}>🔱 بوابة الإدارة والمالية</h2>
                 <p style={{ fontSize: "0.6rem", opacity: 0.4, color: "var(--color-text)" }}>إدارة التواصل والأرباح</p>
              </div>
              <div style={{ textAlign: "left" }}>
                 <div style={{ fontSize: "0.6rem", opacity: 0.5, color: "var(--color-text)" }}>عمولتك (10%)</div>
                 <div style={{ fontSize: "1.2rem", fontWeight: "950", color: "#fbbf24" }}>{totals.commission.toFixed(2)} SAR</div>
              </div>
           </div>

           <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
              {!activeChatUser && sortedThreads.map(thread => (
                        <div key={thread.phone} onClick={() => setActiveChatUser(thread.phone)} className="glassy" style={{ padding: "1.2rem", cursor: "pointer", border: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <div>
                              <h4 style={{ fontSize: "0.9rem", fontWeight: "950", color: "var(--color-text)" }}>👤 {thread.phone}</h4>
                              <p style={{ fontSize: "0.7rem", opacity: 0.4, color: "var(--color-text)", marginTop: "4px" }}>{thread.lastMsg.text.substring(0, 20)}...</p>
                           </div>
                           <div style={{ fontSize: "0.6rem", opacity: 0.4, color: "var(--color-text)" }}>{thread.lastMsg.time}</div>
                        </div>
              ))}

              {activeChatUser && (
                <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button onClick={() => setActiveChatUser(null)} style={{ background: "none", border: "none", color: "var(--color-accent-light)", fontSize: "0.8rem", cursor: "pointer" }}>← عودة للمحادثات</button>
                      <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--color-text)" }}>👤 {activeChatUser}</span>
                   </div>
                   <div style={{ height: "300px", overflowY: "auto", background: "rgba(0,0,0,0.05)", borderRadius: "20px", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "10px" }}>
                      {chatThreads[activeChatUser].messages.map(msg => (
                        <div key={msg.id} style={{ 
                           alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start", 
                           background: msg.sender === "admin" ? "var(--color-accent)" : "var(--glass-bg)", 
                           padding: "10px 15px", borderRadius: "15px", maxWidth: "80%", border: "1px solid var(--glass-border)",
                           color: (msg.sender === 'admin' ? '#fff' : 'var(--color-text)') 
                        }}>
                           <p style={{ fontSize: "0.85rem" }}>{msg.text}</p>
                        </div>
                      ))}
                   </div>
                   
                   {/* 🏹 استعادة محرك الرد للمكتب (Admin Reply Fix) */}
                   <div style={{ display: "flex", gap: "10px" }}>
                      <input className="form-control" placeholder="اكتب ردك هنا..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendReply()} />
                      <button onClick={handleSendReply} className="premium-button" style={{ padding: "0.8rem 1.5rem", color: "#fff" }}>رد 🏹</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      <div className="glassy animate-fade-in" style={{ maxWidth: "550px", margin: "0 auto", padding: "2.5rem", borderRadius: "35px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "950", textAlign: "center", marginBottom: "2rem", color: "var(--color-text)" }}>👤 الملف الشخصي</h2>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
           <input className="form-control" placeholder="الاسم الكامل" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
           <input className="form-control" placeholder="رقم الجوال" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
             <button type="submit" className="premium-button" style={{ fontSize: "0.9rem", color: "#fff" }}>حفظ 🚀</button>
             <button type="button" onClick={handleLogout} className="premium-button glassy" style={{ fontSize: "0.9rem", border: "1.2px solid #ef4444", color: "#ef4444", background: "transparent" }}>خروج 🚪</button>
           </div>
        </form>
      </div>
    </div>
  );
}
