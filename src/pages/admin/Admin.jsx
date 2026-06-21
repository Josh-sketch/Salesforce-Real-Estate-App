import { useState } from "react";
import { EstateLogo } from "../../components/UI";
import { IcoDash, IcoBuild, IcoPeople, IcoCard, IcoWrench, IcoKey, IcoStar, IcoGear, IcoList } from "../../components/Icons";
import { ADash, AProperties, ATenants, APayments, ATickets, ALandlords, AServices, ASettings, AAudit } from "./AdminPages";

export default function Admin(props) {
  const { payments, tickets, setScreen } = props;
  const [tab, setTab] = useState("dash");
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const openCount = tickets.filter((t) => t.status === "open").length;

  const NAV = [
    { id: "dash", label: "Overview", icon: <IcoDash /> },
    { id: "properties", label: "Properties", icon: <IcoBuild /> },
    { id: "tenants", label: "Tenants", icon: <IcoPeople /> },
    { id: "payments", label: "Payments", icon: <IcoCard />, badge: pendingCount },
    { id: "tickets", label: "Tickets", icon: <IcoWrench />, badge: openCount },
    { id: "landlords", label: "Landlords", icon: <IcoKey /> },
    { id: "services", label: "Services", icon: <IcoStar /> },
    { id: "settings", label: "Settings", icon: <IcoGear /> },
    { id: "audit", label: "Audit Log", icon: <IcoList /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg0)" }}>
      <aside className="sidebar-paper" style={{ width: 230, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 50, boxShadow: "2px 0 12px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid var(--br)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <EstateLogo size={30} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "var(--text)", fontWeight: 700, lineHeight: 1.3, letterSpacing: -0.1 }}>Mechtron</div>
              <div style={{ fontSize: 9.5, color: "var(--dim)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>Estate · Admin</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          <div className="section-label">Menu</div>
          {NAV.map((n) => (
            <button key={n.id} className={`nav-btn${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
              <span style={{ opacity: 0.7, flexShrink: 0 }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.badge > 0 && (
                <span style={{ background: tab === n.id ? "var(--goldl)" : "var(--amberpale)", color: tab === n.id ? "#fff" : "var(--amber)", borderRadius: 20, fontSize: 9.5, fontWeight: 700, padding: "1px 6px", minWidth: 16, textAlign: "center" }}>{n.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--br)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 6px", marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "var(--r-sm)", background: "linear-gradient(135deg,var(--goldd),var(--goldl))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", flexShrink: 0 }}>A</div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>Administrator</div>
              <div style={{ fontSize: 10.5, color: "var(--dim)" }}>Full Access</div>
            </div>
          </div>
          <button className="btn-ghost" onClick={() => setTab("settings")} style={{ width: "100%", padding: "8px 0", borderRadius: "var(--r-sm)", fontSize: 12.5, marginBottom: 6 }}>Settings</button>
          <button className="btn-ghost" onClick={() => props.setScreen("login")} style={{ width: "100%", padding: "8px 0", borderRadius: "var(--r-sm)", fontSize: 12.5 }}>Sign out</button>
        </div>
      </aside>

      <main style={{ marginLeft: 230, flex: 1, padding: "32px 36px 64px", minHeight: "100vh" }}>
        {tab === "dash" && <ADash {...props} />}
        {tab === "properties" && <AProperties {...props} />}
        {tab === "tenants" && <ATenants {...props} />}
        {tab === "payments" && <APayments {...props} />}
        {tab === "tickets" && <ATickets {...props} />}
        {tab === "landlords" && <ALandlords {...props} />}
        {tab === "services" && <AServices {...props} />}
        {tab === "settings" && <ASettings {...props} />}
        {tab === "audit" && <AAudit {...props} />}
      </main>
    </div>
  );
}
