"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Phone, Send, Paperclip, CheckCheck, Headset } from "lucide-react";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatType = searchParams.get("type") || "client"; // 'client' or 'support'

  const isSupport = chatType === "support";

  const [messages, setMessages] = useState(
      isSupport 
      ? [
          { id: 1, sender: "client", text: "أهلاً بك في خدمة الدعم الفني لمَصيون. كيف يمكننا مساعدتك اليوم؟", time: "10:30 ص" }
        ]
      : [
          { id: 1, sender: "client", text: "السلام عليكم، المهندس متى تقدر توصل؟", time: "10:30 ص" },
          { id: 2, sender: "client", text: "الكهرباء طافية في الصالة كاملة وأحتاجك ضروري.", time: "10:31 ص" },
          { id: 3, sender: "worker", text: "وعليكم السلام ورحمة الله، أبشر أنا استلمت الطلب وفي الطريق لك الان.", time: "10:32 ص", read: true },
          { id: 4, sender: "worker", text: "باقي لي تقريباً ١٠ دقايق وأكون عند الموقع.", time: "10:33 ص", read: true },
        ]
  );
  
  const [input, setInput] = useState("");

  const handleSend = (e) => {
      e.preventDefault();
      if (!input.trim()) return;
      
      const newMsg = {
          id: Date.now(),
          sender: "worker",
          text: input,
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
          read: false
      };
      
      setMessages([...messages, newMsg]);
      setInput("");
      
      // Simulate reply
      setTimeout(() => {
          setMessages(prev => [...prev, {
              id: Date.now() + 1,
              sender: "client",
              text: isSupport ? "تم استلام رسالتك، سيقوم أحد موظفي الدعم بالرد عليك قريباً." : "يعطيك العافية، بانتظارك.",
              time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
          }]);
      }, 2000);
  };

  return (
    <div style={{ height: "100dvh", backgroundColor: "#f8fafc", direction: "rtl", fontFamily: "'Tajawal', 'Cairo', sans-serif", display: "flex", flexDirection: "column" }}>
      
      {/* Header */}
      <div style={{ 
          backgroundColor: "#1e3a8a", padding: "20px 15px", display: "flex", alignItems: "center", justifyContent: "space-between",
          color: "white", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.2)", zIndex: 10
      }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button 
                  onClick={() => router.back()}
                  style={{ 
                      width: "35px", height: "35px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.1)", 
                      border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: "pointer"
                  }}
              >
                  <ChevronRight size={22} />
              </button>
              
              <div style={{ position: "relative" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: isSupport ? "#eff6ff" : "#f1f5f9", display: "flex", justifyContent: "center", alignItems: "center", color: "#1e3a8a", fontWeight: "900", fontSize: "1.2rem" }}>
                      {isSupport ? <Headset size={20} /> : "ع"}
                  </div>
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: "10px", height: "10px", backgroundColor: "#10b981", borderRadius: "50%", border: "2px solid #1e3a8a" }} />
              </div>
              
              <div>
                  <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", lineHeight: 1.2 }}>
                      {isSupport ? "الدعم الفني مَصيون" : "عبدالله العتيبي"}
                  </h2>
                  <span style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>متصل الآن</span>
              </div>
          </div>
          
          <a href="tel:0501234567" style={{ 
              width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", 
              display: "flex", justifyContent: "center", alignItems: "center", color: "white", textDecoration: "none"
          }}>
              <Phone size={18} />
          </a>
      </div>

      {/* Chat Area */}
      <main style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
              <span style={{ backgroundColor: "#e2e8f0", color: "#64748b", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "700" }}>اليوم</span>
          </div>

          {messages.map(msg => (
              <div key={msg.id} style={{ 
                  alignSelf: msg.sender === "worker" ? "flex-start" : "flex-end", 
                  maxWidth: "80%", display: "flex", flexDirection: "column",
                  alignItems: msg.sender === "worker" ? "flex-start" : "flex-end"
              }}>
                  <div style={{ 
                      backgroundColor: msg.sender === "worker" ? "#1e3a8a" : "white", 
                      color: msg.sender === "worker" ? "white" : "#0f172a", 
                      padding: "12px 16px", 
                      borderRadius: "16px",
                      borderBottomRightRadius: msg.sender === "worker" ? "4px" : "16px",
                      borderBottomLeftRadius: msg.sender === "client" ? "4px" : "16px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                      border: msg.sender === "client" ? "1px solid #e2e8f0" : "none"
                  }}>
                      <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.5 }}>{msg.text}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                      <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{msg.time}</span>
                      {msg.sender === "worker" && <CheckCheck size={14} color={msg.read ? "#3b82f6" : "#cbd5e1"} />}
                  </div>
              </div>
          ))}
      </main>

      {/* Input Area */}
      <div style={{ backgroundColor: "white", padding: "15px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px", alignItems: "center", zIndex: 10 }}>
          <button style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f8fafc", border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b", cursor: "pointer" }}>
              <Paperclip size={20} />
          </button>
          
          <form onSubmit={handleSend} style={{ flex: 1, display: "flex", gap: "10px" }}>
              <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  style={{ 
                      flex: 1, padding: "0 15px", borderRadius: "20px", border: "1px solid #e2e8f0", 
                      backgroundColor: "#f8fafc", outline: "none", fontSize: "16px", fontFamily: "inherit"
                  }}
              />
              <button 
                  type="submit"
                  disabled={!input.trim()}
                  style={{ 
                      width: "45px", height: "45px", borderRadius: "50%", backgroundColor: input.trim() ? "#1e3a8a" : "#cbd5e1", 
                      border: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "white", 
                      cursor: input.trim() ? "pointer" : "default", transition: "background 0.3s"
                  }}
              >
                  <Send size={18} style={{ transform: "translate(-2px, 0px) rotate(180deg)" }} />
              </button>
          </form>
      </div>

    </div>
  );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<div style={{height:"100vh", background:"#f8fafc"}}></div>}>
            <ChatContent />
        </Suspense>
    );
}
