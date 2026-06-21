// import { useState, useEffect } from "react";
// import { Avatar, EstateLogo } from "../../components/UI";
// import {
//   IcoHome,
//   IcoCard,
//   IcoList,
//   IcoWrench,
//   IcoStar,
//   IcoBell,
//   IcoGear,
// } from "../../components/Icons";
// import {
//   THome,
//   TPay,
//   THistory,
//   TTickets,
//   TServices,
//   TNotifs,
//   TSettings,
// } from "./TenantPages";
// import { TODAY, daysUntil } from "../../utils";

// // Hamburger Menu Icon
// const HamburgerIcon = ({ size = 24 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <line x1="3" y1="12" x2="21" y2="12" />
//     <line x1="3" y1="6" x2="21" y2="6" />
//     <line x1="3" y1="18" x2="21" y2="18" />
//   </svg>
// );

// // Close Icon
// const CloseIcon = ({ size = 24 }) => (
//   <svg
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <line x1="18" y1="6" x2="6" y2="18" />
//     <line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// export default function Tenant({
//   me,
//   setMe,
//   payments,
//   setPayments,
//   tickets,
//   setTickets,
//   notifs,
//   setNotifs,
//   pa,
//   log,
//   setScreen,
//   serviceRequests,
//   setServiceRequests,
//   properties,
//   tenants,
//   setTenants,
//   myUnits,
//   setMyUnits,
//   invoices,
//   setInvoices,
//   tab,
//   setTab,
//   onLogout,
// }) {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const myP = payments.filter((p) => p.tenantId === me.id);
//   const myT = tickets.filter((t) => t.tenantId === me.id);
//   const myN = notifs.filter((n) => n.tenantId === me.id);
//   const mySvcs = serviceRequests.filter((r) => r.tenantId === me.id);
//   const unread = myN.filter((n) => !n.read).length;
//   const myProp = properties?.find((p) => p.id === me.propertyId);
//   const [tenancies, setTenancies] = useState([]);

//   const dueDate = new Date(2026, 11, 25);
//   if (dueDate < TODAY) dueDate.setMonth(dueDate.getMonth() + 1);
//   const daysLeft = daysUntil(dueDate.toISOString().split("T")[0]);

//   // Check if mobile on mount and on resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Close menu when tab changes
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [tab]);

//   // Prevent body scroll when mobile menu is open
//   useEffect(() => {
//     if (mobileMenuOpen && isMobile) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [mobileMenuOpen, isMobile]);

//   const markRead = () =>
//     setNotifs((ns) =>
//       ns.map((n) => (n.tenantId === me.id ? { ...n, read: true } : n))
//     );

//   const TABS = [
//     { id: "home", label: "Home", icon: <IcoHome /> },
//     { id: "pay", label: "Payment", icon: <IcoCard /> },
//     { id: "history", label: "History", icon: <IcoList /> },
//     { id: "tickets", label: "Maintenance", icon: <IcoWrench /> },
//     { id: "services", label: "Services", icon: <IcoStar /> },
//     { id: "notifs", label: "Notifications", icon: <IcoBell />, badge: unread },
//     { id: "settings", label: "Settings", icon: <IcoGear /> },
//   ];

//   // Sidebar content for mobile menu
//   const SidebarContent = () => (
//     <>
//       <div
//         style={{
//           padding: "22px 18px 16px",
//           borderBottom: "1px solid var(--br)",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//           <EstateLogo size={30} />
//           <div>
//             <div
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif",
//                 fontSize: 14,
//                 color: "var(--text)",
//                 fontWeight: 700,
//                 letterSpacing: -0.1,
//               }}
//             >
//               Mechtron
//             </div>
//             <div
//               style={{
//                 fontSize: 9.5,
//                 color: "var(--dim)",
//                 letterSpacing: 1,
//                 textTransform: "uppercase",
//                 fontWeight: 600,
//               }}
//             >
//               Tenant Portal
//             </div>
//           </div>
//         </div>
//       </div>

//       <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
//         <div className="section-label">Menu</div>
//         {TABS.map((t) => (
//           <button
//             key={t.id}
//             className={`nav-btn${tab === t.id ? " active" : ""}`}
//             onClick={() => {
//               setTab(t.id);
//               if (t.id === "notifs") markRead();
//               setMobileMenuOpen(false);
//             }}
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               width: "100%",
//             }}
//           >
//             <span style={{ opacity: 0.7, flexShrink: 0 }}>{t.icon}</span>
//             <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
//             {t.badge > 0 && (
//               <span
//                 style={{
//                   background: "var(--red)",
//                   color: "#fff",
//                   borderRadius: 20,
//                   fontSize: 9.5,
//                   fontWeight: 700,
//                   padding: "0 5px",
//                   minWidth: 14,
//                   textAlign: "center",
//                 }}
//               >
//                 {t.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </nav>

//       <div style={{ padding: "12px 10px", borderTop: "1px solid var(--br)" }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 9,
//             padding: "8px 6px",
//             marginBottom: 8,
//           }}
//         >
//           <Avatar t={me} size={30} />
//           <div>
//             <div
//               style={{
//                 fontSize: 12.5,
//                 fontWeight: 600,
//                 color: "var(--text)",
//                 lineHeight: 1.2,
//               }}
//             >
//               {me?.name?.split(" ")[0] || "User"}
//             </div>
//             <div style={{ fontSize: 10.5, color: "var(--dim)" }}>
//               {me.unit || "Tenant"}
//             </div>
//           </div>
//         </div>
//         <button
//           className="btn-ghost"
//           onClick={() => onLogout()}
//           style={{
//             width: "100%",
//             padding: "8px 0",
//             borderRadius: "var(--r-sm)",
//             fontSize: 12.5,
//           }}
//         >
//           Sign out
//         </button>
//       </div>
//     </>
//   );

//   return (
//     <div style={{ minHeight: "100vh", background: "var(--bg0)" }}>
//       {/* Desktop Header */}
//       {!isMobile && (
//         <header
//           style={{
//             background: "var(--bg1)",
//             borderBottom: "1px solid var(--br)",
//             position: "sticky",
//             top: 0,
//             zIndex: 50,
//             boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//           }}
//         >
//           <div
//             style={{
//               maxWidth: 1200,
//               margin: "0 auto",
//               padding: "0 28px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               height: 60,
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//               <EstateLogo size={26} />
//               <span
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 15,
//                   fontWeight: 700,
//                   color: "var(--text)",
//                   letterSpacing: -0.1,
//                 }}
//               >
//                 Mechtron Estate
//               </span>
//             </div>
//             <nav style={{ display: "flex", gap: 2 }}>
//               {TABS.map((t) => (
//                 <button
//                   key={t.id}
//                   className={`nav-btn${tab === t.id ? " active" : ""}`}
//                   style={{
//                     padding: "7px 13px",
//                     gap: 7,
//                     fontSize: 12.5,
//                     borderRadius: "var(--r-sm)",
//                   }}
//                   onClick={() => {
//                     setTab(t.id);
//                     if (t.id === "notifs") markRead();
//                   }}
//                 >
//                   <span style={{ opacity: 0.7, flexShrink: 0 }}>{t.icon}</span>
//                   {t.label}
//                   {t.badge > 0 && (
//                     <span
//                       style={{
//                         background: "var(--red)",
//                         color: "#fff",
//                         borderRadius: 20,
//                         fontSize: 9.5,
//                         fontWeight: 700,
//                         padding: "0 5px",
//                         minWidth: 14,
//                         textAlign: "center",
//                       }}
//                     >
//                       {t.badge}
//                     </span>
//                   )}
//                 </button>
//               ))}
//             </nav>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <Avatar t={me} size={30} />
//               <div style={{ lineHeight: 1.25 }}>
//                 <div
//                   style={{
//                     fontSize: 12.5,
//                     fontWeight: 600,
//                     color: "var(--text)",
//                   }}
//                 >
//                   {me.name?.split(" ")[0]}
//                 </div>
//                 <div style={{ fontSize: 10.5, color: "var(--dim)" }}>
//                   {me.unit}
//                 </div>
//               </div>
//               <button
//                 className="btn-ghost"
//                 onClick={() => onLogout()}
//                 style={{
//                   padding: "6px 13px",
//                   borderRadius: "var(--r-sm)",
//                   fontSize: 12,
//                   marginLeft: 4,
//                 }}
//               >
//                 Sign out
//               </button>
//             </div>
//           </div>
//         </header>
//       )}

//       {/* Mobile Header */}
//       {isMobile && (
//         <>
//           <header
//             style={{
//               position: "fixed",
//               top: 0,
//               left: 0,
//               right: 0,
//               height: 60,
//               background: "var(--bg0)",
//               borderBottom: "1px solid var(--br)",
//               zIndex: 100,
//               boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "0 16px",
//             }}
//           >
//             <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//               <EstateLogo size={26} />
//               <span
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 14,
//                   fontWeight: 700,
//                   color: "var(--text)",
//                 }}
//               >
//                 Mechtron
//               </span>
//             </div>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               style={{
//                 background: "var(--gold)",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: "8px 10px",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 color: "#ffffff",
//                 borderRadius: "8px",
//               }}
//             >
//               {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
//             </button>
//           </header>

//           {/* Mobile Overlay Menu */}
//           {mobileMenuOpen && (
//             <>
//               {/* Backdrop */}
//               <div
//                 onClick={() => setMobileMenuOpen(false)}
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   bottom: 0,
//                   background: "rgba(0,0,0,0.5)",
//                   zIndex: 998,
//                 }}
//               />

//               {/* Menu Panel */}
//               <div
//                 style={{
//                   position: "fixed",
//                   top: 0,
//                   left: 0,
//                   bottom: 0,
//                   width: "280px",
//                   background: "var(--bg0)",
//                   zIndex: 999,
//                   display: "flex",
//                   flexDirection: "column",
//                   boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
//                   overflowY: "auto",
//                 }}
//               >
//                 <SidebarContent />
//               </div>
//             </>
//           )}
//         </>
//       )}

//       {/* Main Content */}
//       <div
//         style={{
//           maxWidth: 1200,
//           margin: "0 auto",
//           padding: isMobile ? "76px 16px 32px" : "32px 28px 72px",
//         }}
//       >
//         {tab === "home" && (
//           <THome
//             me={me}
//             myP={myP}
//             myT={myT}
//             myN={myN}
//             daysLeft={daysLeft}
//             myProp={myProp}
//             myUnits={myUnits}
//             tenancies={tenancies}
//             setTenancies={setTenancies}
//             setMyUnits={setMyUnits}
//             tab={tab}
//             setTab={setTab}
//           />
//         )}
//         {tab === "pay" && (
//           <TPay
//             me={me}
//             myP={myP}
//             setPayments={setPayments}
//             pa={pa}
//             log={log}
//             invoices={invoices}
//             setInvoices={setInvoices}
//           />
//         )}
//         {tab === "history" && <THistory myP={myP} me={me} />}
//         {tab === "tickets" && (
//           <TTickets
//             me={me}
//             myT={myT}
//             tickets={tickets}
//             setTickets={setTickets}
//             log={log}
//             tenancies={tenancies}
//             setTenancies={setTenancies}
//             myProp={myProp}
//             myUnits={myUnits}
//           />
//         )}
//         {tab === "services" && (
//           <TServices
//             me={me}
//             mySvcs={mySvcs}
//             setServiceRequests={setServiceRequests}
//             log={log}
//           />
//         )}
//         {tab === "notifs" && <TNotifs myN={myN} />}
//         {tab === "settings" && (
//           <TSettings
//             me={me}
//             tenants={tenants}
//             setTenants={setTenants}
//             setMe={setMe}
//             log={log}
//           />
//         )}
//       </div>

//       {/* Add global styles for mobile */}
//       <style>{`
//         @media (max-width: 768px) {
//           /* Make cards full width on mobile */
//           .card {
//             border-radius: 12px !important;
//           }

//           /* Adjust grid layouts for mobile */
//           [style*="grid-template-columns: repeat(3,1fr)"] {
//             grid-template-columns: 1fr !important;
//             gap: 12px !important;
//           }

//           /* Adjust font sizes for mobile */
//           h2, [style*="font-size: 28px"] {
//             font-size: 22px !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Avatar, EstateLogo } from "../../components/UI";
import {
  IcoHome,
  IcoCard,
  IcoList,
  IcoWrench,
  IcoStar,
  IcoBell,
  IcoGear,
} from "../../components/Icons";
import {
  THome,
  TPay,
  THistory,
  TTickets,
  TServices,
  TNotifs,
  TSettings,
} from "./TenantPages";
import { TODAY, daysUntil } from "../../utils";

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

export default function Tenant({
  me,
  setMe,
  payments,
  setPayments,
  tickets,
  setTickets,
  notifs,
  setNotifs,
  pa,
  log,
  setScreen,
  serviceRequests,
  setServiceRequests,
  properties,
  tenants,
  setTenants,
  myUnits,
  setMyUnits,
  invoices,
  setInvoices,
  tab,
  setTab,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const myP = payments.filter((p) => p.tenantId === me.id);
  const myT = tickets.filter((t) => t.tenantId === me.id);
  const myN = notifs.filter((n) => n.tenantId === me.id);
  const mySvcs = serviceRequests.filter((r) => r.tenantId === me.id);
  const unread = myN.filter((n) => !n.read).length;
  const myProp = properties?.find((p) => p.id === me.propertyId);
  const [tenancies, setTenancies] = useState([]);

  const dueDate = new Date(2026, 11, 25);
  if (dueDate < TODAY) dueDate.setMonth(dueDate.getMonth() + 1);
  const daysLeft = daysUntil(dueDate.toISOString().split("T")[0]);

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

  const markRead = () =>
    setNotifs((ns) =>
      ns.map((n) => (n.tenantId === me.id ? { ...n, read: true } : n))
    );

  const TABS = [
    { id: "home", label: "Home", icon: <IcoHome /> },
    { id: "pay", label: "Payment", icon: <IcoCard /> },
    { id: "history", label: "History", icon: <IcoList /> },
    { id: "tickets", label: "Maintenance", icon: <IcoWrench /> },
    { id: "services", label: "Services", icon: <IcoStar /> },
    { id: "notifs", label: "Notifications", icon: <IcoBell />, badge: unread },
    { id: "settings", label: "Settings", icon: <IcoGear /> },
  ];

  // Sidebar content for mobile menu
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
              Tenant Portal
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
        <div className="section-label">Menu</div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-btn${tab === t.id ? " active" : ""}`}
            onClick={() => {
              setTab(t.id);
              if (t.id === "notifs") markRead();
              setMobileMenuOpen(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <span style={{ opacity: 0.7, flexShrink: 0 }}>{t.icon}</span>
            <span style={{ flex: 1, textAlign: "left" }}>{t.label}</span>
            {t.badge > 0 && (
              <span
                style={{
                  background: "var(--red)",
                  color: "#fff",
                  borderRadius: 20,
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "0 5px",
                  minWidth: 14,
                  textAlign: "center",
                }}
              >
                {t.badge}
              </span>
            )}
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
            <div style={{ fontSize: 10.5, color: "var(--dim)" }}>
              {me.unit || "Tenant"}
            </div>
          </div>
        </div>
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
    <div style={{ minHeight: "100vh", background: "var(--bg0)" }}>
      {/* Desktop Header */}
      {!isMobile && (
        <header
          style={{
            background: "var(--bg1)",
            borderBottom: "1px solid var(--br)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 60,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <EstateLogo size={26} />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                  letterSpacing: -0.1,
                }}
              >
                Mechtron Estate
              </span>
            </div>
            <nav style={{ display: "flex", gap: 2 }}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  className={`nav-btn${tab === t.id ? " active" : ""}`}
                  style={{
                    padding: "7px 13px",
                    gap: 7,
                    fontSize: 12.5,
                    borderRadius: "var(--r-sm)",
                  }}
                  onClick={() => {
                    setTab(t.id);
                    if (t.id === "notifs") markRead();
                  }}
                >
                  <span style={{ opacity: 0.7, flexShrink: 0 }}>{t.icon}</span>
                  {t.label}
                  {t.badge > 0 && (
                    <span
                      style={{
                        background: "var(--red)",
                        color: "#fff",
                        borderRadius: 20,
                        fontSize: 9.5,
                        fontWeight: 700,
                        padding: "0 5px",
                        minWidth: 14,
                        textAlign: "center",
                      }}
                    >
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar t={me} size={30} />
              <div style={{ lineHeight: 1.25 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {me.name?.split(" ")[0]}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--dim)" }}>
                  {me.unit}
                </div>
              </div>
              <button
                className="btn-ghost"
                onClick={() => onLogout()}
                style={{
                  padding: "6px 13px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 12,
                  marginLeft: 4,
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <>
          <header
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "var(--bg0)",
              borderBottom: "1px solid var(--br)",
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <EstateLogo size={26} />
              <span
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Mechtron
              </span>
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
          </header>

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

      {/* Main Content - FIXED: Responsive width without maxWidth constraint on mobile */}
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          padding: isMobile ? "76px 16px 32px" : "32px 28px 72px",
          maxWidth: isMobile ? "100%" : 1200,
        }}
      >
        {tab === "home" && (
          <THome
            me={me}
            myP={myP}
            myT={myT}
            myN={myN}
            daysLeft={daysLeft}
            myProp={myProp}
            myUnits={myUnits}
            tenancies={tenancies}
            setTenancies={setTenancies}
            setMyUnits={setMyUnits}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "pay" && (
          <TPay
            me={me}
            myP={myP}
            setPayments={setPayments}
            pa={pa}
            log={log}
            invoices={invoices}
            setInvoices={setInvoices}
          />
        )}
        {tab === "history" && <THistory myP={myP} me={me} />}
        {tab === "tickets" && (
          <TTickets
            me={me}
            myT={myT}
            tickets={tickets}
            setTickets={setTickets}
            log={log}
            tenancies={tenancies}
            setTenancies={setTenancies}
            myProp={myProp}
            myUnits={myUnits}
          />
        )}
        {tab === "services" && (
          <TServices
            me={me}
            mySvcs={mySvcs}
            setServiceRequests={setServiceRequests}
            log={log}
          />
        )}
        {tab === "notifs" && <TNotifs myN={myN} />}
        {tab === "settings" && (
          <TSettings
            me={me}
            tenants={tenants}
            setTenants={setTenants}
            setMe={setMe}
            log={log}
          />
        )}
      </div>

      {/* Add global styles for mobile */}
      <style>{`
        @media (max-width: 768px) {
          /* Make cards full width on mobile */
          .card {
            border-radius: 12px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Adjust grid layouts for mobile */
          [style*="grid-template-columns: repeat(3,1fr)"],
          [style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          /* Make all grids single column on mobile */
          [style*="display: grid"] {
            grid-template-columns: 1fr !important;
          }
          
          /* Adjust font sizes for mobile */
          h2, [style*="font-size: 28px"], [style*="font-size: 30px"] {
            font-size: 22px !important;
          }
          
          /* Ensure images and containers don't overflow */
          img, .card, .field, button {
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          
          /* Fix table-like layouts */
          [style*="display: flex"][style*="gap"] {
            flex-wrap: wrap !important;
          }
          
          /* Make buttons full width on mobile for better touch */
          .btn-primary, .btn-ghost {
            width: 100% !important;
            text-align: center !important;
            justify-content: center !important;
          }
          
          /* Prevent horizontal scroll */
          body {
            overflow-x: hidden !important;
          }
          
          /* Better touch targets */
          button, .nav-btn, .btn-primary, .btn-ghost {
            min-height: 44px !important;
          }
        }
        
        /* Tablet styles */
        @media (min-width: 769px) and (max-width: 1024px) {
          .card {
            border-radius: 12px !important;
          }
          
          /* 2 columns for tablet */
          [style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}
