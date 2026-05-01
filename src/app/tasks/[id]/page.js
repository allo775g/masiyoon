"use client";

import { useApp } from "@/context/AppContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
    ChevronRight, Clock, CheckCircle2, MapPin, Wallet, 
    User, Phone, ShieldCheck, Sparkles, MessageSquare,
    AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function TaskDetails() {
    const { id } = useParams();
    const { tasks, user } = useApp();
    const router = useRouter();
    const [task, setTask] = useState(null);

    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }
        const foundTask = tasks.find(t => t.id === id);
        if (foundTask) {
            setTask(foundTask);
        }
    }, [id, tasks, user, router]);

    if (!task) return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f8fafc" }}>
            <div className="animate-pulse" style={{ color: "#1e3a8a", fontWeight: "800" }}>جاري تحميل تفاصيل الطلب...</div>
        </div>
    );

    const steps = [
        { key: "open", label: "تم استلام الطلب", desc: "نبحث الآن عن أفضل فني متاح", icon: <Clock size={20} />, active: true },
        { key: "accepted", label: "تم تعيين فني", desc: "الفني في طريقه إليك الآن", icon: <User size={20} />, active: task.status === "accepted" || task.status === "completed" },
        { key: "completed", label: "اكتملت المهمة", desc: "تم إنهاء العمل بنجاح", icon: <CheckCircle2 size={20} />, active: task.status === "completed" }
    ];

    return (
        <div style={{ minHeight: "100dvh", backgroundColor: "#f8fafc", fontFamily: "'Tajawal', 'Cairo', sans-serif", direction: "rtl", paddingBottom: "40px" }}>
            
            {/* Header */}
            <div style={{ backgroundColor: "#1e3a8a", padding: "20px 20px 60px", color: "white", borderBottomLeftRadius: "40px", borderBottomRightRadius: "40px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                    <button onClick={() => router.back()} style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.1)", border: "none", color: "white", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <ChevronRight size={24} />
                    </button>
                    <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: "950" }}>تتبع الطلب #{task.id?.slice(-4)}</h1>
                </div>

                <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: "4px" }}>حالة الطلب</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: "900" }}>{task.status === "open" ? "جاري البحث..." : task.status === "accepted" ? "الفني في الطريق" : "مكتمل"}</div>
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <div style={{ opacity: 0.7, fontSize: "0.85rem", marginBottom: "4px" }}>الميزانية المحجوزة</div>
                            <div style={{ fontSize: "1.3rem", fontWeight: "950", color: "#fde047" }}>{task.price} ر.س</div>
                        </div>
                    </div>
                </div>
            </div>

            <main style={{ padding: "0 20px", marginTop: "-30px" }}>
                
                {/* 1. Progress Steps */}
                <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "25px 20px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
                    <h3 style={{ margin: "0 0 20px", fontSize: "1.1rem", fontWeight: "900", color: "#0f172a" }}>مرحلة التنفيذ</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {steps.map((s, i) => (
                            <div key={s.key} style={{ display: "flex", gap: "15px", position: "relative", paddingBottom: i < steps.length - 1 ? "30px" : "0" }}>
                                {i < steps.length - 1 && (
                                    <div style={{ position: "absolute", right: "14px", top: "30px", bottom: "0", width: "2px", backgroundColor: s.active && steps[i+1].active ? "#1e3a8a" : "#f1f5f9" }}></div>
                                )}
                                <div style={{ 
                                    width: "30px", height: "30px", borderRadius: "50%", 
                                    backgroundColor: s.active ? "#1e3a8a" : "#f1f5f9", 
                                    color: s.active ? "white" : "#94a3b8",
                                    display: "flex", justifyContent: "center", alignItems: "center",
                                    zIndex: 2, border: s.active ? "4px solid #dbeafe" : "none"
                                }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: "800", color: s.active ? "#1e3a8a" : "#64748b", fontSize: "0.95rem" }}>{s.label}</div>
                                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "2px" }}>{s.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. AI Insights Box */}
                <div style={{ backgroundColor: "#eff6ff", borderRadius: "24px", padding: "20px", border: "1px solid #dbeafe", marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "#1e3a8a" }}>
                        <sparkles size={18} />
                        <span style={{ fontWeight: "900", fontSize: "1rem" }}>تحليل مَصيون الذكي</span>
                    </div>
                    <p style={{ margin: 0, color: "#1e40af", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: "600" }}>
                        {task.aiInsights || "جاري تحليل المشكلة بالذكاء الاصطناعي لتحسين جودة الصيانة..."}
                    </p>
                </div>

                {/* 3. Worker Details (If Accepted) */}
                {task.status !== "open" && task.workerName ? (
                    <div style={{ backgroundColor: "white", borderRadius: "24px", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                            <div style={{ width: "60px", height: "60px", borderRadius: "20px", backgroundColor: "#1e3a8a", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", color: "white", fontWeight: "900" }}>
                                {task.workerName.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>الفني المعين</div>
                                <div style={{ fontSize: "1.2rem", fontWeight: "900", color: "#0f172a" }}>{task.workerName}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#f59e0b", fontSize: "0.85rem", fontWeight: "800", marginTop: "4px" }}>
                                    ⭐ 4.9 (ممتاز)
                                </div>
                            </div>
                            <a href={`tel:${task.workerPhone}`} style={{ width: "45px", height: "45px", borderRadius: "15px", backgroundColor: "#ecfdf5", color: "#10b981", display: "flex", justifyContent: "center", alignItems: "center", textDecoration: "none" }}>
                                <Phone size={20} />
                            </a>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button style={{ flex: 1, padding: "14px", borderRadius: "14px", backgroundColor: "#f1f5f9", border: "none", color: "#334155", fontWeight: "800", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                                <MessageSquare size={18} /> محادثة
                            </button>
                            <button style={{ flex: 1, padding: "14px", borderRadius: "14px", backgroundColor: "#1e3a8a", border: "none", color: "white", fontWeight: "800", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                                <MapPin size={18} /> تتبع الموقع
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ backgroundColor: "#fffbeb", borderRadius: "24px", padding: "20px", border: "1px dashed #fcd34d", textAlign: "center" }}>
                        <div style={{ color: "#d97706", marginBottom: "10px" }}><Clock size={32} style={{ margin: "0 auto" }} /></div>
                        <h4 style={{ margin: "0 0 5px", color: "#92400e", fontWeight: "900" }}>نبحث عن فني قريب...</h4>
                        <p style={{ margin: 0, color: "#b45309", fontSize: "0.85rem" }}>بمجرد قبول الطلب، ستتمكن من رؤية موقع الفني والتواصل معه.</p>
                    </div>
                )}

                {/* 4. Payment Info */}
                <div style={{ marginTop: "25px", borderTop: "1px solid #e2e8f0", paddingTop: "25px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <span style={{ fontWeight: "800", color: "#334155" }}>دفعة آمنة تحت الضمان</span>
                    </div>
                    <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Wallet size={20} color="#94a3b8" />
                            <span style={{ color: "#64748b", fontWeight: "700" }}>تم حجز المبلغ</span>
                        </div>
                        <span style={{ fontWeight: "900", color: "#1e3a8a" }}>{task.price} ر.س</span>
                    </div>
                </div>

                {/* Help Section */}
                <div style={{ marginTop: "40px", textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.85rem", fontWeight: "700" }}>
                        <AlertCircle size={16} /> هل تحتاج مساعدة في الطلب؟
                    </div>
                    <button style={{ background: "none", border: "none", color: "#1e3a8a", fontWeight: "900", marginTop: "8px", cursor: "pointer", textDecoration: "underline" }}>اتصل بالدعم الفني</button>
                </div>

            </main>
        </div>
    );
}
