"use client";

import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Checkout({ onComplete, price }) {
  const { t, adminSettings } = useApp();
  const [loading, setLoading] = useState(false);

  const numericPrice = Number(price) || 0;
  const platformFee = numericPrice * 0.10;
  const workerReceives = numericPrice - platformFee;

  // Has the admin configured Moyasar/PayTabs?
  const hasGatewayConfigured = adminSettings?.publishableKey && adminSettings.publishableKey.length > 5;

  const handlePay = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate payment gateway delay (Apple Pay / Mada / Visa)
    setTimeout(() => {
      setLoading(false);
      onComplete(); // Task becomes published
    }, 1500);
  };

  return (
    <div className="card" style={{ padding: "2rem", border: "2px solid var(--color-accent)" }}>
      <h2 className="mb-4 text-center">{t.paymentSummary}</h2>
      
      <div style={{ backgroundColor: "var(--color-gray-50)", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
        <div className="flex justify-between mb-2">
          <span>{t.totalTaskValue}</span>
          <strong>{numericPrice.toFixed(2)} SAR</strong>
        </div>
        <div className="flex justify-between mb-2 text-muted" style={{ borderBottom: "1px dashed var(--color-gray-200)", paddingBottom: "0.5rem" }}>
          <span>{t.platformFee}</span>
          <span>{platformFee.toFixed(2)} SAR</span>
        </div>
        <div className="flex justify-between mt-2 pt-2" style={{ color: "var(--color-accent)", fontWeight: "bold" }}>
          <span>{t.workerReceives}</span>
          <span>{workerReceives.toFixed(2)} SAR</span>
        </div>
      </div>

      <p className="text-muted text-center mb-4" style={{ fontSize: "0.85rem" }}>
        🔒 {t.escrowInfo}
      </p>

      {!hasGatewayConfigured ? (
        <div style={{ padding: "1rem", backgroundColor: "#fef2f2", color: "#991b1b", borderRadius: "8px", textAlign: "center", border: "1px solid #fecaca" }}>
           <strong style={{ display: "block", marginBottom: "0.5rem" }}>⚠️ Payment Gateway not configured</strong>
           <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>The administrator has not linked the API keys for the payment gateway yet. Please configure it in the Admin Panel.</p>
           <button onClick={handlePay} disabled={loading} style={{ padding: "0.5rem 1rem", backgroundColor: "#991b1b", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}>
             {loading ? "Processing..." : "Bypass for Testing (Add Task Anyway)"}
           </button>
        </div>
      ) : (
        <form onSubmit={handlePay}>
          <div className="mb-4">
            <button 
              type="button" 
              onClick={handlePay} 
              disabled={loading} 
              className="btn btn-block" 
              style={{ backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "1rem", fontSize: "1.2rem", border: "none" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-1.936.036-3.736.177-4.743 2.924-2.036 3.535-.515 8.763 1.488 11.642.981 1.418 2.148 3.018 3.659 2.964 1.455-.054 2.016-.93 3.774-.93 1.74 0 2.274.93 3.793.903 1.554-.027 2.57-1.464 3.543-2.883 1.134-1.638 1.596-3.23 1.62-3.32-.036-.015-3.08-1.185-3.116-4.706-.036-2.943 2.45-4.322 2.56-4.385-1.401-2.03-3.568-2.308-4.346-2.37-1.89-.185-3.663 1.054-4.272 1.054zM14.73 4.295c.783-.93 1.309-2.222 1.166-3.506-1.096.046-2.466.723-3.284 1.681-.734.84-1.341 2.154-1.165 3.411 1.229.096 2.5-.642 3.283-1.586z" />
              </svg>
              {t.payWithApplePay}
            </button>
          </div>
          
          <div className="text-center text-muted mb-4" style={{ position: "relative" }}>
            <span style={{ backgroundColor: "#fff", padding: "0 10px", position: "relative", zIndex: 1 }}>OR</span>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", backgroundColor: "var(--color-gray-200)", zIndex: 0 }}></div>
          </div>
          
          <div className="flex justify-between items-center mb-3">
             <div style={{ fontSize: "0.85rem", color: "var(--color-gray-500)", fontWeight: "bold" }}>Powered by Payment API</div>
             <div style={{ display: "flex", gap: "0.5rem" }}>
                <span className="badge" style={{ backgroundColor: "#0284c7", color: "white" }}>Visa</span>
                <span className="badge" style={{ backgroundColor: "#059669", color: "white" }}>Mada</span>
             </div>
          </div>
          <div className="form-group mb-2">
             <label className="form-label">Card Number</label>
             <input type="text" className="form-control" placeholder="1234 5678 9101 1121" required disabled={loading} />
          </div>
          <div className="flex justify-between mb-4" style={{ gap: "1rem" }}>
             <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Expiry</label>
                <input type="text" className="form-control" placeholder="MM/YY" required disabled={loading} />
             </div>
             <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CVV</label>
                <input type="password" maxLength="3" className="form-control" placeholder="123" required disabled={loading} />
             </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ fontSize: "1.2rem", padding: "1rem" }}>
            {loading ? "Processing..." : t.payWithCard}
          </button>
        </form>
      )}
    </div>
  );
}
