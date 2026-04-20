"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

export default function Header() {
    const { lang, setLang, theme, toggleTheme, t } = useApp();
    const [isLangOpen, setIsLangOpen] = useState(false);
    const pathname = usePathname();

    if (pathname && pathname.startsWith("/worker")) return null;

    const navItemStyle = { display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", color: "var(--color-text)" };
    const labelStyle = { fontSize: "0.6rem", opacity: 0.6, fontWeight: "600", color: "var(--color-text)" };

    return (
        <header className="header" style={{ padding: "1.5rem 0", width: "100%", background: "transparent", position: "relative", zIndex: "99999" }}>
            <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                
                {/* 🎯 الشعار الملكي الموحد (The Unified Masyoun Logo) */}
                <Link href="/" style={{ textDecoration: "none" }}>
                    <div style={{
                        width: "85px", height: "85px", margin: "0 auto",
                        background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
                        borderRadius: "24px", 
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 15px 40px rgba(59, 130, 246, 0.3)",
                        border: "1px solid rgba(255,255,255,0.1)"
                    }}>
                        <div style={{ fontSize: "2.4rem", fontWeight: "950", color: "#fff", lineHeight: "1" }}>M</div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "#fff", marginTop: "3px" }}>مصيون</div>
                    </div>
                </Link>

                <div style={{ width: "100%", borderBottom: "1px solid var(--glass-border)", margin: "5px 0" }}></div>

                {/* شريط الأيقونات: النظيف والمترجم */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.5rem", width: "100%", paddingBottom: "0.5rem" }}>
                     <Link href="/" style={{textDecoration: "none"}}>
                        <div style={navItemStyle}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                            <span style={labelStyle}>{t.home}</span>
                        </div>
                     </Link>
                     <Link href="/tasks" style={{textDecoration: "none"}}>
                        <div style={navItemStyle}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line></svg>
                            <span style={labelStyle}>{t.browse}</span>
                        </div>
                     </Link>
                     <Link href="/tasks/post" style={{textDecoration: "none"}}>
                        <div style={navItemStyle}>
                            <div style={{ width: "26px", height: "26px", background: "var(--color-accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                            <span style={{ ...labelStyle, color: "var(--color-accent)", fontWeight: "900" }}>{t.add}</span>
                        </div>
                     </Link>
                     <Link href="/support" style={{textDecoration: "none"}}>
                        <div style={navItemStyle}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            <span style={labelStyle}>{t.support}</span>
                        </div>
                     </Link>
                     <Link href="/profile" style={{textDecoration: "none"}}>
                        <div style={navItemStyle}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span style={labelStyle}>{t.account}</span>
                        </div>
                     </Link>
                </div>
            </div>

            {/* أزرار الثيم واللغة */}
            <div style={{ position: "absolute", top: "1rem", right: "1.2rem", display: "flex", gap: "8px" }}>
                <button onClick={toggleTheme} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--color-text)", padding: "8px", borderRadius: "10px", fontSize: "1.2rem", cursor: "pointer" }}>
                    {theme === "dark" ? "🌙" : "☀️"}
                </button>
                <button onClick={() => setIsLangOpen(!isLangOpen)} style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--color-text)", padding: "6px 14px", borderRadius: "10px", fontSize: "0.65rem", fontWeight: "900" }}>{lang.toUpperCase()}</button>
                {isLangOpen && (
                    <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--glass-bg)", backdropFilter: "blur(20px)", border: "1px solid var(--glass-border)", borderRadius: "12px", zIndex: 9, minWidth: "120px" }}>
                         <button onClick={() => { setLang("ar"); setIsLangOpen(false); }} style={{ background: "none", border: "none", color: "var(--color-text)", padding: "12px 1rem", fontSize: "0.8rem", textAlign: "right", display: "block", width: "100%", cursor: "pointer" }}>العربية</button>
                         <button onClick={() => { setLang("en"); setIsLangOpen(false); }} style={{ background: "none", border: "none", color: "var(--color-text)", padding: "12px 1rem", fontSize: "0.8rem", textAlign: "right", display: "block", width: "100%", cursor: "pointer" }}>English</button>
                    </div>
                )}
            </div>
        </header>
    );
}
