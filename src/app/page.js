"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const { t, user, setUser, loginWithPhone } = useApp();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleAuth = async (role) => {
    if (!phone || phone.length < 9) return alert("يرجى إدخال رقم جوال صحيح");
    setIsLoggingIn(true);
    try {
        const existingUser = await loginWithPhone(phone);
        if (existingUser) {
            router.push(existingUser.role === 'worker' ? "/worker/login/face-check" : "/tasks");
        } else {
            if (role === 'client') {
                await setUser({ phone, name: "عميل جديد", role: "client" });
                router.push("/tasks");
            } else router.push("/worker/login");
        }
    } catch (e) {
        alert("خطأ في الدخول");
    } finally {
        setIsLoggingIn(false);
        setShowLogin(false);
    }
  };

  return (
    <div className="main-container">
      
      <nav style={{ padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)" }}>
         <h1 className="text-gradient" style={{ fontSize: "2rem", fontWeight: "950" }}>مَصيون</h1>
         <div>
            {user ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div className="btn-premium btn-outline" style={{ padding: "0.5rem 1.2rem", height: "auto", borderRadius: "100px", fontSize: "0.85rem" }}>
                        👤 {user.name}
                    </div>
                    <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "600" }}>خروج</button>
                </div>
            ) : (
                <button onClick={() => setShowLogin(true)} className="btn-premium btn-primary" style={{ padding: "0.6rem 2.2rem" }}>تسجيل دخول</button>
            )}
         </div>
      </nav>

      <main style={{ padding: "5rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <section style={{ textAlign: "center", marginBottom: "8rem" }}>
            <div className="btn-premium btn-outline ai-glow" style={{ padding: "0.6rem 1.8rem", borderRadius: "100px", fontSize: "0.85rem", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)", marginBottom: "3rem" }}>
                 🤖 محرك مَصيون الذكي (V3)
            </div>
            <h2 className="text-gradient" style={{ fontSize: "clamp(2.5rem, 9vw, 5.5rem)", fontWeight: "950", lineHeight: "1.1", marginBottom: "2.5rem" }}>
                صـيانـة منزلك <br /> يقودها <span style={{ color: "#3b82f6" }}>الذكاء الاصطناعي</span>
            </h2>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.8rem", marginBottom: "4rem" }}>
                {/* 🎯 تم توجيه الرابط ليفتح الكاميرا فوراً في الصفحة التالية */}
                <Link href="/tasks/post?mode=ai_camera" className="btn-premium btn-primary" style={{ fontSize: "1.3rem", padding: "1.5rem 4rem", boxShadow: "0 0 40px rgba(59,130,246,0.3)" }}>
                    📸 ارفع صورة العطل الآن
                </Link>
                <Link href="/tasks" className="btn-premium btn-outline" style={{ fontSize: "1.3rem", padding: "1.5rem 4rem" }}>
                    📋 تصفح المهام
                </Link>
            </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem" }}>
            {t.allCategories.map(cat => (
                <div key={cat} className="glass-card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "4.5rem", marginBottom: "1.5rem" }}>🛠️</div>
                    <h3 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "1rem" }}>{cat}</h3>
                    <p style={{ opacity: 0.5, marginBottom: "2rem" }}>تشخيص فوري وإصلاح بضمان مَصيون.</p>
                    <Link href={`/tasks/post?cat=${cat}`} className="btn-premium btn-outline" style={{ width: "100%" }}>اطلب الآن</Link>
                </div>
            ))}
        </div>

      </main>

      {/* مودال الدخول */}
      {showLogin && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
              <div className="glass-card" style={{ maxWidth: "450px", width: "100%", padding: "4rem 3rem", textAlign: "center" }}>
                  <h2 className="text-gradient" style={{ fontSize: "2.5rem", fontWeight: "950", marginBottom: "1rem" }}>مرحباً بك</h2>
                  <input className="input-premium" type="tel" placeholder="05xxxxxxxx" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: "2rem", fontSize: "1.5rem", textAlign: "center" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <button onClick={() => handleAuth("client")} className="btn-premium btn-primary">دخول العملاء</button>
                    <button onClick={() => handleAuth("worker")} className="btn-premium btn-outline">بوابة المهنيين</button>
                  </div>
                  <button onClick={() => setShowLogin(false)} style={{ marginTop: "2.5rem", color: "#f87171", background: "none", border: "none", cursor: "pointer" }}>إغلاق</button>
              </div>
          </div>
      )}

    </div>
  );
}
