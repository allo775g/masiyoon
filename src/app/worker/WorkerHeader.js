"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

export default function WorkerHeader() {
    const { user } = useApp();
    const pathname = usePathname();

    const activeStyle = { background: "#3b82f6", color: "#fff", boxShadow: "0 4px 10px rgba(59,130,246,0.3)" };

    return (
        <header style={{ 
            background: "#0f172a", 
            padding: "1rem", 
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "sticky", top: 0, zIndex: 1000
        }}>
            {/* الصف الأول: اللوجو + الفني */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <Link href="/worker" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ 
                        width: "35px", height: "35px", background: "#3b82f6",
                        borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: "900", color: "#fff", fontSize: "1rem"
                    }}>M</div>
                    <h1 style={{ fontSize: "1.1rem", fontWeight: "950", color: "#f8fafc" }}>مَصيون <span style={{color: "#3b82f6"}}>فني</span></h1>
                </Link>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: "900", color: "#f8fafc" }}>{user?.name?.split(' ')[0] || "فني"}</div>
                        <div style={{ fontSize: "0.6rem", color: "#22c55e", fontWeight: "bold" }}>أونلاين 🟢</div>
                    </div>
                    <Link href="/worker/profile" style={{ 
                        width: "35px", height: "35px", borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #334155",
                        textDecoration: "none", fontSize: "0.8rem"
                    }}>👤</Link>
                </div>
            </div>

            {/* الصف الثاني: شريط التنقل (مرن وسهل الوصول) */}
            <nav style={{ display: "flex", gap: "5px", overflowX: "auto", paddingBottom: "5px" }}>
                <Link href="/worker" style={{ 
                    padding: "8px 12px", borderRadius: "100px", textDecoration: "none", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "800", whiteSpace: "nowrap",
                    ...(pathname === "/worker" ? activeStyle : {})
                }}>الرئيسية</Link>
                <Link href="/worker/tasks" style={{ 
                    padding: "8px 12px", borderRadius: "100px", textDecoration: "none", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "800", whiteSpace: "nowrap",
                    ...(pathname === "/worker/tasks" ? activeStyle : {})
                }}>الطلبات المتاحة</Link>
                <Link href="/worker/wallet" style={{ 
                    padding: "8px 12px", borderRadius: "100px", textDecoration: "none", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "800", whiteSpace: "nowrap",
                    ...(pathname === "/worker/wallet" ? activeStyle : {})
                }}>المحفظة</Link>
                <Link href="/worker/profile" style={{ 
                    padding: "8px 12px", borderRadius: "100px", textDecoration: "none", color: "#94a3b8", fontSize: "0.75rem", fontWeight: "800", whiteSpace: "nowrap",
                    ...(pathname === "/worker/profile" ? activeStyle : {})
                }}>الإعدادات</Link>
            </nav>
        </header>
    );
}
