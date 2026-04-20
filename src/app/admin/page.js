"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const { user, t, wallet, tasks, adminSettings, updateAdminSettings, supportMessages, addSupportMessage } = useApp();
  const router = useRouter();

  const [keys, setKeys] = useState({
    publishableKey: adminSettings?.publishableKey || "",
    secretKey: adminSettings?.secretKey || "",
  });

  const [saved, setSaved] = useState(false);
  
  // Support Management States
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  
  // Group messages by user
  const conversations = (supportMessages || []).reduce((acc, msg) => {
    if (msg.userId && msg.sender !== "system") {
      if (!acc[msg.userId]) acc[msg.userId] = [];
      acc[msg.userId].push(msg);
    }
    return acc;
  }, {});


  // RBAC: Check if user is admin
  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return <div className="text-center mt-4">Unauthorized</div>;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "Completed").length;
  
  // Calculate Escrow (90% of open tasks)
  const totalEscrow = (tasks || [])
    .filter(t => t.status === "Open")
    .reduce((acc, task) => acc + (task.workerEarnings || 0), 0);

  const handleSaveKeys = (e) => {
    e.preventDefault();
    updateAdminSettings(keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAdminReply = (e) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedUser) return;

    // Admin replies get the language of the last message in that conversation
    // or just Arabic as default
    const conv = conversations[selectedUser];
    const lastLang = conv && conv.length > 0 ? conv[conv.length - 1].language : "ar";

    addSupportMessage({
      id: Date.now(),
      sender: "admin",
      text: adminReply,
      time: new Date().toLocaleTimeString(),
      timestamp: Date.now(),
      userId: selectedUser,
      userRole: "admin",
      language: lastLang
    });
    
    setAdminReply("");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="mb-4" style={{ color: "var(--color-accent)" }}>🛡️ {t.adminDashboard}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        
        <div className="card" style={{ backgroundColor: "var(--color-black)", color: "white" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--color-gray-200)", marginBottom: "0.5rem" }}>
             💳 {t.platformProfits} (10%)
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{wallet.toFixed(2)} SAR</div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-gray-500)", marginTop: "0.5rem" }}>
             * {t.goesToPlatform}
          </p>
        </div>

        <div className="card" style={{ backgroundColor: "var(--color-gray-100)", border: "1px solid var(--color-gray-200)" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--color-gray-500)", marginBottom: "0.5rem" }}>
            🔒 {t.totalEscrow} (90%)
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-black)" }}>{totalEscrow.toFixed(2)} SAR</div>
          <p style={{ fontSize: "0.8rem", color: "var(--color-gray-500)", marginTop: "0.5rem" }}>
             * {t.awaitingWorkerRelease}
          </p>
        </div>

        <div className="card text-center" style={{ backgroundColor: "var(--color-gray-50)" }}>
          <h3 style={{ fontSize: "1rem", color: "var(--color-gray-500)", marginBottom: "0.5rem" }}>
            📋 {t.dashboardTasks}
          </h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--color-accent)" }}>
            {completedTasks} / {totalTasks}
          </div>
        </div>

      </div>

      <div className="card mb-4" style={{ borderLeft: "4px solid var(--color-accent)" }}>
        <h2 className="mb-2">⚙️ {t.paymentGatewayConfig}</h2>
        <p className="text-muted mb-4">{t.paymentGatewayDesc}</p>

        <form onSubmit={handleSaveKeys}>
          <div className="form-group">
            <label className="form-label">{t.publishableKey} (Moyasar / PayTabs / Tap)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx" 
              value={keys.publishableKey}
              onChange={(e) => setKeys({ ...keys, publishableKey: e.target.value })}
              required 
            />
          </div>
          <div className="form-group mb-4">
            <label className="form-label">{t.secretKey}</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx" 
              value={keys.secretKey}
              onChange={(e) => setKeys({ ...keys, secretKey: e.target.value })}
              required 
            />
            <small className="text-muted mt-1" style={{ display: "block" }}>{t.secretKeyNotice}</small>
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ minWidth: "150px" }}>
            {saved ? "✓ " + t.saved : t.saveChanges}
          </button>
        </form>
      </div>

      <div className="card mb-4" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.5rem", backgroundColor: "var(--color-gray-50)", borderBottom: "1px solid var(--color-gray-200)" }}>
          <h2 style={{ margin: 0 }}>💬 Support Management</h2>
        </div>
        
        <div style={{ display: "flex", height: "500px" }}>
          <div style={{ width: "30%", borderRight: "1px solid var(--color-gray-200)", overflowY: "auto", backgroundColor: "white" }}>
            {Object.keys(conversations).length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "var(--color-gray-500)" }}>No support requests yet</div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {Object.keys(conversations).map(userId => (
                  <li 
                    key={userId}
                    onClick={() => setSelectedUser(userId)}
                    style={{
                      padding: "1rem",
                      borderBottom: "1px solid var(--color-gray-200)",
                      cursor: "pointer",
                      backgroundColor: selectedUser === userId ? "var(--color-gray-100)" : "white",
                      transition: "background-color 0.2s"
                    }}
                  >
                    <div style={{ fontWeight: "700" }}>{userId}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-gray-500)" }}>
                      {conversations[userId].length} messages
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ width: "70%", display: "flex", flexDirection: "column", backgroundColor: "var(--color-gray-50)" }}>
            {!selectedUser ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gray-500)" }}>
                Select a user to view chat
              </div>
            ) : (
              <>
                <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {conversations[selectedUser].map(msg => (
                    <div key={msg.id} style={{
                        alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                        backgroundColor: msg.sender === "admin" ? "var(--color-accent)" : "white",
                        color: msg.sender === "admin" ? "white" : "black",
                        padding: "0.75rem 1rem",
                        borderRadius: "12px",
                        maxWidth: "80%",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        border: msg.sender === "admin" ? "none" : "1px solid var(--color-gray-200)"
                    }}>
                        <div>{msg.text}</div>
                        <div style={{ fontSize: "0.7rem", marginTop: "0.5rem", textAlign: "right", opacity: 0.8 }}>
                            {msg.time} {msg.language ? `(${msg.language})` : ""}
                        </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "1rem", backgroundColor: "white", borderTop: "1px solid var(--color-gray-200)" }}>
                  <form onSubmit={handleAdminReply} style={{ display: "flex", gap: "0.5rem" }}>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Type reply..." 
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      style={{ margin: 0 }}
                      required
                    />
                    <button type="submit" className="btn btn-primary" disabled={!adminReply.trim()}>Reply</button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
