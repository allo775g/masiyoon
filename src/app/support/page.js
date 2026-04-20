"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

export default function SupportPage() {
  const { t, user, supportMessages, addSupportMessage } = useApp();
  const [msgInput, setMsgInput] = useState("");
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [supportMessages]);

  if (!user) {
    return (
      <div className="container" style={{ padding: "5rem 1rem", textAlign: "center" }}>
        <div className="glassy" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "950", color: "var(--color-text)" }}>🤖 مَصيون AI</h2>
          <p style={{ margin: "1.5rem 0", opacity: 0.7, color: "var(--color-text)" }}>يرجى تسجيل الدخول أولاً لتتمكن من مراسلة مساعدك الذكي.</p>
          <Link href="/profile" className="premium-button" style={{ display: "block", textDecoration: "none" }}>{t.loginSignup}</Link>
        </div>
      </div>
    );
  }

  const myChat = supportMessages.filter(m => m.userPhone === user?.phone).sort((a,b) => (a.createdAt || 0) - (b.createdAt || 0));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    const text = msgInput;
    setMsgInput(""); 
    try {
        await addSupportMessage({ text, userPhone: user.phone });
    } catch(e) {
        setMsgInput(text);
        alert("فشل الإرسال، حاول ثانية.");
    }
  };

  return (
    <div className="container pulse-ai" style={{ padding: "3rem 1.5rem", minHeight: "90vh" }}>
      <div className="glassy ai-glow-card" style={{ maxWidth: "700px", margin: "0 auto", borderRadius: "35px", overflow: "hidden", display: "flex", flexDirection: "column", height: "75vh", boxShadow: "0 40px 120px rgba(0,0,0,0.4)" }}>
        
        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--glass-border)", textAlign: "center" }}>
           <h3 style={{ fontSize: "1.4rem", fontWeight: "950", color: "var(--color-text)" }}>🤖 محرك مَصيون الذكي (Support AI)</h3>
           <p style={{ fontSize: "0.8rem", opacity: 0.5, color: "var(--color-text)", marginTop: "5px" }}>اكتب استفسارك وسأجيبك فوراً أو سأحولك لأحد خبرائنا 🟢</p>
        </div>

        <div style={{ flex: 1, padding: "2rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.2rem", background: "rgba(0,0,0,0.05)" }}>
           {myChat.length === 0 ? (
               <div style={{ textAlign: "center", marginTop: "6rem", opacity: 0.2 }}>
                  <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🤖</div>
                  <p style={{ fontSize: "1.1rem" }}>مرحباً بك، أنا مساعد مَصيون الذكي. كيف يمكنني خدمتك اليوم؟</p>
               </div>
           ) : (
               myChat.map((m, idx) => (
                  <div key={idx} style={{ 
                      alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                      maxWidth: "80%",
                      textAlign: m.sender === "user" ? "right" : "left"
                  }}>
                     <div className={m.sender === "ai" || m.sender === "admin" ? "ai-glow-card" : ""} style={{ 
                         padding: "1rem 1.4rem", 
                         borderRadius: m.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                         background: m.sender === "user" ? "var(--glass-bg)" : "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                         color: m.sender === "user" ? "var(--color-text)" : "#fff",
                         border: m.sender === "user" ? "1px solid var(--glass-border)" : "none",
                         fontSize: "0.95rem",
                         fontWeight: "500",
                         boxShadow: m.sender === "user" ? "0 5px 15px rgba(0,0,0,0.05)" : "0 10px 25px rgba(59, 130, 246, 0.2)"
                     }}>
                        {m.text}
                     </div>
                     <div style={{ fontSize: "0.65rem", opacity: 0.4, marginTop: "6px", color: "var(--color-text)" }}>{m.time || "الآن"}</div>
                  </div>
               ))
           )}
           <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} style={{ padding: "1.2rem", background: "var(--glass-bg)", borderTop: "1px solid var(--glass-border)", display: "flex", gap: "12px" }}>
           <input 
             type="text" 
             placeholder="اشرح مشكلتك لمساعد مَصيون الذكي..." 
             value={msgInput}
             onChange={(e) => setMsgInput(e.target.value)}
             style={{ 
                 flex: 1, padding: "1rem 1.5rem", borderRadius: "18px", 
                 background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)",
                 color: "var(--color-text)", outline: "none", fontSize: "1rem"
             }}
           />
           <button type="submit" className="premium-button ai-btn" style={{ width: "60px", height: "60px", borderRadius: "18px", fontSize: "1.5rem" }}>🚀</button>
        </form>
      </div>
    </div>
  );
}
