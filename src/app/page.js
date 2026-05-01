"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Camera, Sparkles, Wrench, Zap, Droplet, Paintbrush, Hammer, ShieldCheck, Clock, ChevronLeft, Phone, LogOut } from "lucide-react";

export default function Home() {
  const { user, setUser, loginWithPhone } = useApp();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [phone, setPhone] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Removed auto-redirect to allow browsing services
  /*
  useEffect(() => {
    if (user && user.role === 'client') {
      router.push("/tasks");
    }
  }, [user, router]);
  */

  const handleAuth = async (role) => {
    if (!phone || phone.length < 9) return alert("يرجى إدخال رقم جوال صحيح (مثال: 0500000000)");
    setIsLoggingIn(true);
    try {
        const existingUser = await loginWithPhone(phone);
        if (existingUser) {
            router.push(existingUser.role === 'worker' ? "/worker" : "/tasks");
        } else {
            if (role === 'client') {
                await setUser({ phone, name: "عميل مَصيون", role: "client" });
                router.push("/tasks");
            } else {
                router.push("/worker/login");
            }
        }
    } catch (e) {
        alert("حدث خطأ أثناء تسجيل الدخول");
    } finally {
        setIsLoggingIn(false);
        setShowLogin(false);
    }
  };

  const services = [
    { id: "تكييف", name: "تكييف وتبريد", icon: <Zap size={24} />, color: "#3b82f6", bg: "#eff6ff" },
    { id: "سباكة", name: "سباكة وصرف", icon: <Droplet size={24} />, color: "#0ea5e9", bg: "#e0f2fe" },
    { id: "كهرباء", name: "أعطال كهربائية", icon: <Wrench size={24} />, color: "#f59e0b", bg: "#fef3c7" },
    { id: "نقاشة", name: "دهانات وديكور", icon: <Paintbrush size={24} />, color: "#8b5cf6", bg: "#f3e8ff" },
    { id: "نجارة", name: "نجارة وأثاث", icon: <Hammer size={24} />, color: "#10b981", bg: "#d1fae5" }
  ];

  if (user && user.role === 'client') return null; // Prevent flash before redirect

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", fontFamily: "'Tajawal', 'Cairo', sans-serif", direction: "rtl", paddingBottom: "80px" }}>
      
      {/* 1. Header (Navbar) */}
      <nav style={{ backgroundColor: "white", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#1e3a8a", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontWeight: "900", fontSize: "1.2rem", boxShadow: "0 4px 10px rgba(30, 58, 138, 0.2)" }}>
                M
            </div>
            <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "900", color: "#1e3a8a" }}>مَصيون</h1>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {user && user.role === 'client' && (
                <Link href="/tasks" style={{ textDecoration: "none" }}>
                    <button style={{ padding: "10px 18px", borderRadius: "14px", backgroundColor: "#eff6ff", color: "#1e3a8a", border: "none", fontWeight: "900", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                        <Clock size={16} /> طلباتي
                    </button>
                </Link>
            )}
            
            {user ? (
                <button onClick={() => setUser(null)} style={{ padding: "10px", borderRadius: "12px", backgroundColor: "#fef2f2", color: "#ef4444", border: "none", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <LogOut size={18} />
                </button>
            ) : (
                <button onClick={() => setShowLogin(true)} style={{ padding: "10px 20px", borderRadius: "14px", backgroundColor: "#1e3a8a", color: "white", border: "none", fontWeight: "800", boxShadow: "0 4px 15px rgba(30, 58, 138, 0.2)", cursor: "pointer", transition: "all 0.2s" }}>
                    دخول
                </button>
            )}
        </div>
      </nav>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        
        {/* 2. Hero Section (AI Camera Call to Action) */}
        <section style={{ 
            backgroundColor: "#1e3a8a", borderRadius: "24px", padding: "30px 20px", color: "white", 
            marginBottom: "30px", position: "relative", overflow: "hidden",
            boxShadow: "0 15px 35px rgba(30, 58, 138, 0.2)"
        }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "50%" }}></div>
            <div style={{ position: "absolute", bottom: "-30px", left: "-20px", width: "100px", height: "100px", backgroundColor: "rgba(59,130,246,0.2)", borderRadius: "50%", filter: "blur(20px)" }}></div>
            
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: "100px", fontSize: "0.85rem", fontWeight: "800", marginBottom: "15px", backdropFilter: "blur(10px)" }}>
                <Sparkles size={14} color="#fde047" /> مدعوم بالذكاء الاصطناعي (V3)
            </div>
            
            <h2 style={{ fontSize: "2rem", fontWeight: "950", margin: "0 0 10px 0", lineHeight: 1.2 }}>
                صوّر العطل، <br/> ونحن نتكفل بالباقي!
            </h2>
            <p style={{ fontSize: "1rem", color: "#bfdbfe", margin: "0 0 25px 0", lineHeight: 1.6 }}>
                الذكاء الاصطناعي يحلل مشكلتك ويوجه أفضل فني لصيانتها فوراً.
            </p>
            
            <Link href="/tasks/post?mode=ai_camera" style={{ textDecoration: "none" }}>
                <button style={{ 
                    width: "100%", padding: "18px", borderRadius: "16px", backgroundColor: "white", 
                    color: "#1e3a8a", border: "none", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer",
                    display: "flex", justifyContent: "center", alignItems: "center", gap: "10px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)", transition: "transform 0.2s"
                }}>
                    <Camera size={22} color="#3b82f6" /> ابدأ الفحص الذكي الآن
                </button>
            </Link>
        </section>

        {/* 3. Value Proposition / Trust Features */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "35px" }}>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#ecfdf5", display: "flex", justifyContent: "center", alignItems: "center", color: "#10b981" }}>
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>ضمان مَصيون</h4>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>على جميع الخدمات</span>
                </div>
            </div>
            <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#fffbeb", display: "flex", justifyContent: "center", alignItems: "center", color: "#d97706" }}>
                    <Clock size={20} />
                </div>
                <div>
                    <h4 style={{ margin: "0 0 2px 0", fontSize: "0.95rem", fontWeight: "800", color: "#0f172a" }}>سرعة استجابة</h4>
                    <span style={{ fontSize: "0.75rem", color: "#64748b" }}>فنيون جاهزون فوراً</span>
                </div>
            </div>
        </section>

        {/* 4. Categorized Services Grid */}
        <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "900", color: "#0f172a" }}>خدمات الصيانة</h3>
                <span style={{ fontSize: "0.85rem", color: "#3b82f6", fontWeight: "700", cursor: "pointer" }}>عرض الكل</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
                {services.map((svc) => (
                    <Link key={svc.id} href={`/tasks/post?cat=${svc.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ 
                            backgroundColor: "white", borderRadius: "20px", padding: "20px", 
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "15px",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.03)", border: "1px solid #f1f5f9",
                            transition: "all 0.2s ease", cursor: "pointer"
                        }}>
                            <div style={{ width: "60px", height: "60px", borderRadius: "16px", backgroundColor: svc.bg, display: "flex", justifyContent: "center", alignItems: "center", color: svc.color }}>
                                {svc.icon}
                            </div>
                            <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: "800", color: "#1e293b", textAlign: "center" }}>{svc.name}</h4>
                        </div>
                    </Link>
                ))}
                
                {/* Custom Task Card */}
                <Link href={`/tasks/post`} style={{ textDecoration: "none" }}>
                    <div style={{ 
                        backgroundColor: "#f8fafc", borderRadius: "20px", padding: "20px", 
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "15px",
                        border: "2px dashed #cbd5e1", transition: "all 0.2s ease", cursor: "pointer",
                        height: "100%", justifyContent: "center"
                    }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", color: "#64748b", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                            <ChevronLeft size={24} style={{ transform: "rotate(-90deg)" }} />
                        </div>
                        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: "800", color: "#64748b", textAlign: "center" }}>طلب خدمة أخرى</h4>
                    </div>
                </Link>
            </div>
        </section>

      </main>

      {/* 5. Login Modal */}
      {showLogin && (
          <div style={{ 
              position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(8px)", 
              display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000 
          }}>
              <div style={{ 
                  width: "100%", maxWidth: "500px", backgroundColor: "white", 
                  borderTopLeftRadius: "30px", borderTopRightRadius: "30px", 
                  padding: "30px 20px 40px", animation: "slideUp 0.3s ease-out" 
              }}>
                  <div style={{ width: "50px", height: "6px", backgroundColor: "#e2e8f0", borderRadius: "10px", margin: "0 auto 25px" }} />
                  
                  <h2 style={{ fontSize: "1.8rem", fontWeight: "950", color: "#0f172a", marginBottom: "10px", textAlign: "center" }}>مرحباً بك في مَصيون</h2>
                  <p style={{ color: "#64748b", fontSize: "0.95rem", textAlign: "center", marginBottom: "30px" }}>أدخل رقم جوالك للمتابعة</p>
                  
                  <div style={{ position: "relative", marginBottom: "25px" }}>
                      <Phone size={20} color="#94a3b8" style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)" }} />
                      <input 
                          type="tel" 
                          placeholder="05xxxxxxxx" 
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          style={{ 
                              width: "100%", padding: "18px 45px 18px 15px", borderRadius: "16px", 
                              border: "2px solid #e2e8f0", fontSize: "1.2rem", fontWeight: "700", 
                              outline: "none", transition: "border-color 0.2s", textAlign: "left", direction: "ltr"
                          }} 
                      />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button 
                        onClick={() => handleAuth("client")} 
                        disabled={isLoggingIn}
                        style={{ 
                            width: "100%", padding: "18px", borderRadius: "16px", backgroundColor: "#1e3a8a", 
                            color: "white", border: "none", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(30, 58, 138, 0.25)"
                        }}
                    >
                        {isLoggingIn ? "جاري الدخول..." : "تسجيل الدخول (كعميل)"}
                    </button>
                    <button 
                        onClick={() => handleAuth("worker")} 
                        style={{ 
                            width: "100%", padding: "18px", borderRadius: "16px", backgroundColor: "white", 
                            color: "#1e3a8a", border: "2px solid #e2e8f0", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer"
                        }}
                    >
                        دخول بوابة المهنيين
                    </button>
                  </div>
                  
                  <button onClick={() => setShowLogin(false)} style={{ width: "100%", marginTop: "20px", color: "#64748b", background: "none", border: "none", fontSize: "1rem", fontWeight: "700", cursor: "pointer" }}>
                      إلغاء
                  </button>
              </div>
          </div>
      )}

      <style jsx global>{`
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
