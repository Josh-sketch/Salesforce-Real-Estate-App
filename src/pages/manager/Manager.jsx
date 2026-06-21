import { useState, useEffect } from "react";
import { Avatar, EstateLogo } from "../../components/UI";
import {
  IcoDash,
  IcoBuild,
  IcoPeople,
  IcoCard,
  IcoWrench,
  IcoGear,
} from "../../components/Icons";
import {
  MgrOverview,
  MgrProperties,
  MgrTenants,
  MgrTickets,
  MgrSettings,
  MgrProfile,
  MgrSubAccounts,
} from "./ManagerPages";

// Hamburger Menu Icon
const HamburgerIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

// Close Icon
const CloseIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function ManagerPortal({
  me,
  setMe,
  properties,
  setProperties,
  tenants,
  setTenants,
  payments,
  tickets,
  setTickets,
  notifs,
  setNotifs,
  pa,
  log,
  push,
  setScreen,
  landlords,
  managers,
  setManagers,
  myTenants,
  setMyTenants,
  tab,
  setTab,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [myLandlord, setMyLandlord] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [myTenantLoading, setmyTenantLoading] = useState(true);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [tab]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, isMobile]);

  const TABS = [
    { id: "overview", label: "Overview", icon: <IcoDash /> },
    { id: "properties", label: "Properties", icon: <IcoBuild /> },
    { id: "tenants", label: "Tenants", icon: <IcoPeople /> },
    { id: "tickets", label: "Tickets", icon: <IcoWrench /> },
    { id: "accounts", label: "Sub-Accounts", icon: <IcoPeople /> },
    { id: "profile", label: "Profile", icon: <IcoWrench /> },
    { id: "settings", label: "Settings", icon: <IcoGear /> },
  ];

  useEffect(() => {
    if (!me?.id) return;

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getLandlordByManagerId",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const landlord = {
            id: result.Id,
            name: result.Name,
            email: result.Email__c,
            phone: result.Phone__c,
            role: result.Role__c,
          };
          console.log("👤 Landlord loaded:", landlord);
          setMyLandlord(landlord);
        } else {
          console.error("Failed to load landlord:", event?.message);
          setMyLandlord(null);
        }
      },
      { escape: false }
    );
  }, [me?.id]);

  useEffect(() => {
    if (!me?.id) return;

    setPropertiesLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getManagerProperties",
      me?.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.id,
            name: r.name,
            landlordId: r.landlordId,
            type: r.type,
            address: r.address,
            units: (r.units || []).map((unit) => ({
              id: unit.id,
              label: unit.label,
              status: unit.status,
              subtype: unit.subtype || "",
              measurement: unit.measurement || "",
            })),
          }));

          console.log("🏠 Properties loaded for manager:", me.id);
          console.log("📦 Full dataset:", mapped);

          setProperties(mapped);
        } else {
          console.error("Failed to load Properties:", event?.message);
          setProperties([]);
        }

        setPropertiesLoading(false);
      }
    );
  }, [me?.id, setProperties]);

  useEffect(() => {
    if (!me?.id) return;

    setmyTenantLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getManagerUnits",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.Id,
            label: r.Name,
            tenancy: r.Tenancy_Status__c,
            occupancy: r.Occupancy_Status__c,
            tenantId: r.Tenant__c,
            tenantName: r.Tenant__r?.Name || "",
            tenantEmail: r.Tenant__r?.Email__c || "",
            propertyName: r.Property_Lookup__r?.Name || "",
            propertyId: r.Property_Lookup__c || "",
          }));
          console.log("🏠 Units loaded for manager:", me.id);
          console.log("📦 Full dataset:", mapped);
          setMyTenants(mapped);
        } else {
          console.error("Failed to load units:", event?.message);
          setMyTenants([]);
        }
        setmyTenantLoading(false);
      }
    );
  }, [me?.id]);

  useEffect(() => {
    if (!me?.id) return;
    setTenantsLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getManagerTenants",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.Id,
            name: r.Name,
            email: r.Email__c,
            phone: r.Phone__c,
            address: r.address,
          }));

          console.log("🏠 Tenants loaded for manager:", me.id);
          console.log("📦 Full dataset:", mapped);

          setTenants(mapped);
        } else {
          console.error("Failed to load Tenants:", event?.message);
          setTenants([]);
        }
        setTenantsLoading(false);
      },
      { escape: false }
    );
  }, [me?.id, setTenants]);

  // Sidebar content component
  const SidebarContent = () => (
    <>
      <div
        style={{
          padding: "22px 18px 16px",
          borderBottom: "1px solid var(--br)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <EstateLogo size={30} />
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14,
                color: "var(--text)",
                fontWeight: 700,
                letterSpacing: -0.1,
              }}
            >
              Mechtron
            </div>
            <div
              style={{
                fontSize: 9.5,
                color: "var(--dim)",
                letterSpacing: 1,
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Manager Portal
            </div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        <div className="section-label">Menu</div>
        {TABS.map((n) => (
          <button
            key={n.id}
            className={`nav-btn${tab === n.id ? " active" : ""}`}
            onClick={() => setTab(n.id)}
          >
            <span style={{ opacity: 0.7 }}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--br)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 6px",
            marginBottom: 8,
          }}
        >
          <Avatar t={me} size={30} />
          <div>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              {me?.name?.split(" ")[0] || "User"}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--dim)" }}>Manager</div>
          </div>
        </div>
        {myLandlord && (
          <div
            style={{
              fontSize: 11,
              color: "var(--dim)",
              padding: "4px 6px",
              marginBottom: 6,
            }}
          >
            For: {myLandlord.name}
          </div>
        )}
        <button
          className="btn-ghost"
          onClick={() => onLogout()}
          style={{
            width: "100%",
            padding: "8px 0",
            borderRadius: "var(--r-sm)",
            fontSize: 12.5,
          }}
        >
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg0)",
      }}
    >
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && (
        <aside
          className="sidebar-paper"
          style={{
            width: 230,
            display: "flex",
            flexDirection: "column",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 50,
            boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
          }}
        >
          <SidebarContent />
        </aside>
      )}

      {/* Mobile Layout */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "var(--bg0)",
              borderBottom: "1px solid var(--br)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <EstateLogo size={28} />
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 13,
                    color: "var(--text)",
                    fontWeight: 700,
                  }}
                >
                  Mechtron
                </div>
                <div
                  style={{
                    fontSize: 8.5,
                    color: "var(--dim)",
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Manager Portal
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "var(--gold)",
                border: "none",
                cursor: "pointer",
                padding: "8px 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                borderRadius: "8px",
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

          {/* Mobile Overlay Menu */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  zIndex: 998,
                }}
              />

              {/* Menu Panel */}
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: "280px",
                  background: "var(--bg0)",
                  zIndex: 999,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
                  overflowY: "auto",
                }}
              >
                <SidebarContent />
              </div>
            </>
          )}
        </>
      )}

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : 230,
          padding: isMobile ? "76px 16px 32px" : "32px 36px 64px",
          width: "100%",
          transition: "margin-left 0.3s ease",
          background: "var(--bg0)",
          minHeight: "100vh",
        }}
      >
        {tab === "overview" && (
          <MgrOverview
            me={me}
            myLandlord={myLandlord}
            tenants={tenants}
            setTenants={setTenants}
            properties={properties}
            setProperties={setProperties}
            myTenants={myTenants}
            setMyTenants={setMyTenants}
          />
        )}
        {tab === "properties" && (
          <MgrProperties
            me={me}
            myTenants={myTenants}
            properties={properties}
            setProperties={setProperties}
            log={log}
            landlords={landlords}
            setTenants={setTenants}
          />
        )}
        {tab === "tenants" && (
          <MgrTenants
            me={me}
            myTenants={myTenants}
            setMyTenants={setMyTenants}
            tenants={tenants}
            setTenants={setTenants}
            properties={properties}
            setProperties={setProperties}
            myLandlord={myLandlord}
            log={log}
            push={push}
          />
        )}
        {tab === "tickets" && (
          <MgrTickets
            me={me}
            tickets={tickets}
            setTickets={setTickets}
            myTenants={myTenants}
            log={log}
          />
        )}
        {tab === "accounts" && (
          <MgrSubAccounts
            me={me}
            tenants={tenants}
            setTenants={setTenants}
            myLandlord={myLandlord}
            log={log}
          />
        )}
        {tab === "profile" && <MgrProfile me={me} log={log} />}
        {tab === "settings" && (
          <MgrSettings
            me={me}
            managers={[]}
            setManagers={setManagers}
            log={log}
          />
        )}
      </main>

      {/* Add global styles for mobile */}
      <style>{`
        @media (max-width: 768px) {
          /* Make cards full width on mobile */
          .card {
            border-radius: 12px !important;
          }
          
          /* Adjust grid layouts for mobile */
          [style*="grid-template-columns: repeat(3,1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          /* Make property grid single column on mobile */
          [style*="grid-template-columns: repeat(auto-fill, minmax(380px, 1fr))"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Adjust font sizes for mobile */
          h2, [style*="font-size: 28px"] {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}
