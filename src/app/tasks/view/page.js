"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useEffect, useState, Suspense } from "react";
import { doc, getDoc, collection, addDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

function TaskViewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, updateTask } = useApp();
    const taskId = searchParams.get("id");
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState([]);
    const [msgText, setMsgText] = useState("");

    const COLLECTIONS = { TASKS: "masiyoon_unified_tasks", CHATS: "masiyoon_unified_chats" };

    useEffect(() => {
        if (!taskId) return;
        const fetchTask = async () => {
            try {
                const docRef = doc(db, COLLECTIONS.TASKS, taskId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) setTask({ id: docSnap.id, ...docSnap.data() });
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchTask();

        const q = query(collection(db, COLLECTIONS.CHATS), where("taskId", "==", taskId), orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setChatMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [taskId]);

    const handleSendMessage = async () => {
        if (!msgText.trim() || !user) return;
        await addDoc(collection(db, COLLECTIONS.CHATS), {
            taskId,
            senderPhone: user.phone,
            senderName: user.name,
            text: msgText,
            createdAt: Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        setMsgText("");
    };

    const handleWhatsApp = () => {
        if (!task?.clientPhone) return alert("عذراً، رقم العميل غير متوفر.");
        const phone = task.clientPhone.toString().startsWith("966") ? task.clientPhone : `966${task.clientPhone.toString().replace(/^0/, "")}`;
        window.open(`https://wa.me/${phone}?text=مرحباً، أنا مهتم بمهمتك: ${task.title} في منصة مصيون`, "_blank");
    };

    const handleAcceptTask = async () => {
        if (!user || user.role !== 'worker') return alert("يجب تسجيل الدخول كمهني لقبول المهام");
        setLoading(true);
        try {
            await updateTask(taskId, {
                status: "Accepted",
                workerPhone: user.phone,
                workerName: user.name,
                acceptedAt: Date.now()
            });
            alert("✅ تم قبول المهمة بنجاح! تواصل مع العميل الآن.");
            router.push("/worker");
        } catch (e) {
            alert("خطأ في قبول المهمة");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container" style={{ textAlign: "center", padding: "5rem", color: "var(--color-text)" }}>⚡ سحب البيانات...</div>;
    if (!task) return <div className="container" style={{ textAlign: "center", padding: "5rem", color: "var(--color-text)" }}>المهمة غير موجودة.</div>;

    return (
        <div style={{ padding: "4rem 1.5rem", minHeight: "100vh", maxWidth: "1200px", margin: "0 auto" }}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: "850px", margin: "0 auto", padding: "3rem" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.2rem" }}>
                    <div style={{ padding: "6px 15px", borderRadius: "10px", background: "rgba(79, 70, 229, 0.15)", color: "var(--color-accent)", fontWeight: "950", fontSize: "0.75rem" }}>
                        🛠️ {task.category || "General"}
                    </div>
                    <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--color-text)", opacity: 0.5, cursor: "pointer" }}>← عودة</button>
                </div>

                <h1 style={{ fontSize: "2rem", fontWeight: "950", color: "var(--color-text)", marginBottom: "0.6rem", lineHeight: "1.5", wordBreak: "break-word" }}>{task.title}</h1>
                <p style={{ fontSize: "1rem", opacity: 0.6, color: "var(--color-text)", lineHeight: "1.8", marginBottom: "2rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{task.desc}</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className="glassy" style={{ padding: "1.5rem", borderRadius: "20px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
                        <span style={{ fontSize: "0.7rem", opacity: 0.5, color: "var(--color-text)" }}>💰 الميزانية (SAR)</span>
                        <h4 style={{ fontSize: "1.4rem", fontWeight: "950", color: "var(--color-text)" }}>{task.budget}</h4>
                    </div>
                    <div className="glassy" style={{ padding: "1.5rem", borderRadius: "20px", textAlign: "center", border: "1px solid var(--glass-border)" }}>
                        <span style={{ fontSize: "0.7rem", opacity: 0.5, color: "var(--color-text)" }}>📍 الموقع</span>
                        <h4 style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--color-text)" }}>{task.location}</h4>
                    </div>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button onClick={handleWhatsApp} className="btn-premium" style={{ flex: 1, minWidth: "200px", background: "#25D366", color: "#fff" }}>
                       💬 تواصل واتساب
                    </button>
                    <button onClick={handleAcceptTask} className="btn-premium btn-primary" style={{ flex: 1, minWidth: "200px" }}>قبول المهمة ⚡</button>
                </div>

                <div style={{ marginTop: "3rem", borderTop: "1px solid var(--glass-border)", paddingTop: "2rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "950", marginBottom: "1.5rem", color: "var(--color-text)" }}>📦 الدردشة الخاصة بالمهمة</h3>
                    
                    <div style={{ height: "300px", overflowY: "auto", background: "rgba(0,0,0,0.04)", borderRadius: "25px", padding: "1.2rem", display: "flex", flexDirection: "column", gap: "10px", border: "1px solid var(--glass-border)" }}>
                        {chatMessages.length === 0 ? (
                            <p style={{ opacity: 0.3, textAlign: "center", marginTop: "100px", color: "var(--color-text)" }}>ابدأ المحادثة مع العميل هنا...</p>
                        ) : (
                            chatMessages.map(msg => (
                                <div key={msg.id} style={{ 
                                    alignSelf: msg.senderPhone === user?.phone ? "flex-end" : "flex-start",
                                    background: msg.senderPhone === user?.phone ? "var(--color-accent)" : "var(--glass-bg)",
                                    border: "1px solid var(--glass-border)",
                                    padding: "10px 18px", borderRadius: "18px", maxWidth: "80%", color: (msg.senderPhone === user?.phone ? '#fff' : 'var(--color-text)')
                                }}>
                                    <div style={{ fontSize: "0.55rem", opacity: 0.5, marginBottom: "3px" }}>{msg.senderName}</div>
                                    <div style={{ fontSize: "0.9rem" }}>{msg.text}</div>
                                    <div style={{ fontSize: "0.5rem", textAlign: "left", marginTop: "3px", opacity: 0.4 }}>{msg.time}</div>
                                </div>
                            ))
                        )}
                    </div>

                    {user ? (
                        <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                            <input className="form-control" placeholder="اكتب رسالتك..." value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                            <button onClick={handleSendMessage} className="premium-button" style={{ padding: "0.6rem 2rem", color: "#fff" }}>إرسال</button>
                        </div>
                    ) : (
                        <p style={{ textAlign: "center", marginTop: "1rem", opacity: 0.5, fontSize: "0.8rem", color: "var(--color-text)" }}>يجب دخول المنصة لاستخدام الدردشة.</p>
                    )}
                </div>

            </div>
        </div>
    );
}

export default function TaskView() {
    return (
        <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem" }}>Loading Masyoun Flow...</div>}>
            <TaskViewContent />
        </Suspense>
    );
}
