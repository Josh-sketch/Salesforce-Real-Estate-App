import { useState } from "react";
import { EstateLogo, Lbl } from "../components/UI";

export default function Login({ setScreen, setMe, setMyLandlord, tenants, landlords }) {
  const [tab, setTab] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const TABS = [["admin", "Admin"], ["landlord", "Landlord"], ["tenant", "Tenant"]];

  const go = () => {
    setErr("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (tab === "admin") {
        email === "admin@mechtron.ng" && pass === "admin123"
          ? setScreen("admin")
          : setErr("Invalid administrator credentials.");
      } else if (tab === "landlord") {
        const ll = landlords.find((l) => l.email === email && l.password === pass);
        ll ? (setMyLandlord(ll), setScreen("landlord")) : setErr("No landlord account found with these credentials.");
      } else {
        const t = tenants.find((t) => t.email === email && t.password === pass);
        t ? (setMe(t), setScreen("tenant")) : setErr("No tenant found with these credentials.");
      }
    }, 500);
  };

  const demoCredentials = {
    admin: "admin@mechtron.ng · admin123",
    landlord: "adisa@mechtron.ng · landlord123",
    tenant: "b.adeyemi@gmail.com · tenant123",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg0)" }}>
      {/* Left panel */}
      <div style={{ width: 500, background: "var(--bg1)", borderRight: "1px solid var(--br)", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 56px", position: "relative", overflow: "hidden", boxShadow: "4px 0 24px rgba(0,0,0,0.04)" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,103,40,.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, left: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(196,154,60,.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="anim-up">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 52 }}>
            <EstateLogo size={40} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: "var(--text)", fontWeight: 700, lineHeight: 1.15, letterSpacing: -0.2 }}>Mechtron</div>
              <div style={{ fontSize: 10, color: "var(--sub)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600 }}>Estate Management</div>
            </div>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, color: "var(--text)", lineHeight: 1.1, marginBottom: 20, letterSpacing: -0.5 }}>
            Your estate.<br />
            <span className="gold-gradient" style={{ fontWeight: 700 }}>Managed well.</span>
          </h1>
          <p style={{ color: "var(--sub)", fontSize: 14.5, lineHeight: 1.8, maxWidth: 340 }}>
            A complete property management platform for landlords, administrators, and tenants — built for discerning estates.
          </p>
        </div>

        <div className="anim-up d3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["Rent payment confirmation & receipts","Maintenance ticket tracking","Tenant services & solar subscriptions","Landlord property & Will management","Full tenancy agreement downloads"].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--goldpale)", border: "1px solid var(--brg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="10" height="10" viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" stroke="var(--gold)" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontSize: 13, color: "var(--sub)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div className="anim-up d2" style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Sign in</h2>
          <p style={{ color: "var(--sub)", fontSize: 13.5, marginBottom: 28 }}>Welcome back — please enter your details.</p>

          <div style={{ display: "flex", background: "var(--bg2)", borderRadius: "var(--r-md)", padding: 4, marginBottom: 26, border: "1px solid var(--br)", gap: 4 }}>
            {TABS.map(([v, l]) => (
              <button key={v} onClick={() => { setTab(v); setErr(""); }} style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 12.5, transition: "all .18s", background: tab === v ? "var(--bg1)" : "transparent", color: tab === v ? "var(--gold)" : "var(--sub)", boxShadow: tab === v ? "var(--shadow-sm)" : "none" }}>{l}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            <div>
              <Lbl>Email address</Lbl>
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tab === "admin" ? "admin@mechtron.ng" : tab === "landlord" ? "adisa@mechtron.ng" : "e.g. b.adeyemi@gmail.com"} />
            </div>
            <div>
              <Lbl>Password</Lbl>
              <input className="field" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && go()} />
            </div>
          </div>

          {err && (
            <div style={{ background: "var(--redpale)", border: "1px solid rgba(192,57,43,.2)", borderRadius: "var(--r-sm)", padding: "10px 13px", color: "var(--red)", fontSize: 12.5, marginBottom: 14, display: "flex", gap: 7, alignItems: "center" }}>⚠ {err}</div>
          )}

          <button className="btn-primary" onClick={go} style={{ width: "100%", padding: "13px 0", borderRadius: "var(--r-md)", fontSize: 14.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {busy ? <span style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite", display: "inline-block" }} /> : "Continue →"}
          </button>

          <div style={{ marginTop: 18, padding: "12px 14px", background: "var(--bg2)", borderRadius: "var(--r-md)", border: "1px solid var(--br)" }}>
            <Lbl style={{ marginBottom: 5 }}>Demo credentials ({tab})</Lbl>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5, color: "var(--dim)" }}>{demoCredentials[tab]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
