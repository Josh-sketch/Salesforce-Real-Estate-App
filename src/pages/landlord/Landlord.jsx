// import { useState, useEffect } from "react";
// import { Avatar, EstateLogo } from "../../components/UI";
// import {
//   IcoDash,
//   IcoBuild,
//   IcoPeople,
//   IcoCard,
//   IcoStar,
//   IcoList,
//   IcoKey,
//   IcoGear,
// } from "../../components/Icons";
// import {
//   LLOverview,
//   LLProperties,
//   LLTenants,
//   LLManagers,
//   LLPayments,
//   LLServices,
//   LLWill,
//   LLSubAccounts,
//   LLProfile,
// } from "./LandlordPages";

// export default function LandlordPortal({
//   tab,
//   setTab,
//   me,
//   setMe,
//   properties,
//   setProperties,
//   tenants,
//   setTenants,
//   myTenants,
//   setMyTenants,
//   payments,
//   serviceRequests,
//   wills,
//   setWills,
//   adminPayments,
//   log,
//   push,
//   setScreen,
//   managers,
//   setManagers,
//   invoices,
//   setInvoices,
//   tickets,
//   setTickets,
//   notifs,
//   pa,
//   onLogout,
// }) {
//   // const [tab, setTab] = useState("overview");
//   const myProps = properties.filter(
//     (p) => me.properties?.includes(p.id) || p.landlordId === me.id
//   );
//   // const myTenants = tenants.filter((t) =>
//   //   myProps.some((p) => p.id === t.propertyId)
//   // );
//   const myPayments = payments.filter((p) =>
//     myTenants.some((t) => t.id === p.tenantId)
//   );
//   const myAdminPays = adminPayments.filter((p) => p.landlordId === me.id);
//   const mySvcReqs = serviceRequests.filter((r) =>
//     myTenants.some((t) => t.id === r.tenantId)
//   );

//   const myWills = wills.filter((w) => w.landlordId === me.id);
//   const myManagers = managers.filter((m) => m.landlordId === me.id);

//   const TABS = [
//     { id: "overview", label: "Overview", icon: <IcoDash /> },
//     { id: "properties", label: "Properties", icon: <IcoBuild /> },
//     { id: "tenants", label: "Tenants", icon: <IcoPeople /> },
//     { id: "managers", label: "Managers", icon: <IcoPeople /> },
//     { id: "payments", label: "Payments", icon: <IcoCard /> },
//     { id: "services", label: "Services", icon: <IcoStar /> },
//     { id: "accounts", label: "Sub-Accounts", icon: <IcoKey /> },
//     { id: "will", label: "Will", icon: <IcoList /> },
//     { id: "profile", label: "Profile", icon: <IcoPeople /> },
//   ];

//   const [propertiesLoading, setPropertiesLoading] = useState(true);
//   const [tenantsLoading, setTenantsLoading] = useState(true);

//   useEffect(() => {
//     if (!me?.id) return; // ✅ wait until login is ready

//     setPropertiesLoading(true);

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getProperties",

//       me.id, // ✅ PASS LANDLORD ID HERE

//       function (result, event) {
//         if (event.status && result) {
//           const mapped = result.map((r) => ({
//             id: r.id,
//             name: r.name,
//             landlordId: r.landlordId,
//             type: r.type,
//             address: r.address,
//             units: (r.units || []).map((unit) => ({
//               id: unit.id,
//               label: unit.label,
//               status: unit.status,
//               subtype: unit.subtype || "",
//               measurement: unit.measurement || "",
//             })),
//           }));

//           console.log("🏠 Properties loaded for landlord:", me.id);
//           console.log("📦 Full dataset:", mapped);

//           setProperties(mapped);
//         } else {
//           console.error("Failed to load Properties:", event?.message);
//           setProperties([]);
//         }

//         setPropertiesLoading(false);
//       },

//       { escape: false }
//     );
//   }, [me?.id, setProperties]);

//   useEffect(() => {
//     if (!me?.id) return;
//     setTenantsLoading(true); // ← ADD loading state

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getTenants",
//       me.id,
//       function (result, event) {
//         if (event.status && result) {
//           const mapped = result.map((r) => ({
//             id: r.Id,
//             name: r.Name,
//             email: r.Email__c,
//             phone: r.Phone__c,
//             address: r.address,
//           }));

//           console.log("🏠 Tenants loaded for landlord:", me.id);
//           console.log("📦 Full dataset:", mapped);

//           setTenants(mapped); // ✅ CORRECT - using the setter
//         } else {
//           console.error("Failed to load Tenants:", event?.message);
//           setTenants([]); // ✅ CORRECT
//         }
//         setTenantsLoading(false);
//       },
//       { escape: false }
//     );
//   }, [me?.id, setTenants]); // ✅ Add setMyTenants to dependencies

//   return (
//     <div
//       style={{ display: "flex", minHeight: "100vh", background: "var(--bg0)" }}
//     >
//       <aside
//         className="sidebar-paper"
//         style={{
//           width: 230,
//           display: "flex",
//           flexDirection: "column",
//           position: "fixed",
//           top: 0,
//           left: 0,
//           height: "100vh",
//           zIndex: 50,
//           boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
//         }}
//       >
//         <div
//           style={{
//             padding: "22px 18px 16px",
//             borderBottom: "1px solid var(--br)",
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//             <EstateLogo size={30} />
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 14,
//                   color: "var(--text)",
//                   fontWeight: 700,
//                   letterSpacing: -0.1,
//                 }}
//               >
//                 Mechtron
//               </div>
//               <div
//                 style={{
//                   fontSize: 9.5,
//                   color: "var(--dim)",
//                   letterSpacing: 1,
//                   textTransform: "uppercase",
//                   fontWeight: 600,
//                 }}
//               >
//                 Landlord Portal
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
//           <div className="section-label">Menu</div>
//           {TABS.map((n) => (
//             <button
//               key={n.id}
//               className={`nav-btn${tab === n.id ? " active" : ""}`}
//               onClick={() => setTab(n.id)}
//             >
//               <span style={{ opacity: 0.7 }}>{n.icon}</span>
//               {n.label}
//             </button>
//           ))}
//         </nav>
//         <div style={{ padding: "12px 10px", borderTop: "1px solid var(--br)" }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 9,
//               padding: "8px 6px",
//               marginBottom: 8,
//             }}
//           >
//             <Avatar t={me} size={30} />
//             <div>
//               <div
//                 style={{
//                   fontSize: 12.5,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                   lineHeight: 1.2,
//                 }}
//               >
//                 {me.name.split(" ")[0]}
//               </div>
//               <div style={{ fontSize: 10.5, color: "var(--dim)" }}>
//                 Landlord
//               </div>
//             </div>
//           </div>
//           <button
//             className="btn-ghost"
//             onClick={() => onLogout()}
//             style={{
//               width: "100%",
//               padding: "8px 0",
//               borderRadius: "var(--r-sm)",
//               fontSize: 12.5,
//             }}
//           >
//             Sign out
//           </button>
//         </div>
//       </aside>

//       <main style={{ marginLeft: 230, flex: 1, padding: "32px 36px 64px" }}>
//         {tab === "overview" && (
//           <LLOverview
//             me={me}
//             myProps={myProps}
//             // myTenants={myTenants}
//             tenants={tenants}
//             setTenants={setTenants} // ← Pass the setter
//             myPayments={myPayments}
//             myAdminPays={myAdminPays}
//             properties={properties}
//             setProperties={setProperties}
//           />
//         )}
//         {tab === "properties" && (
//           <LLProperties
//             me={me}
//             myProps={myProps}
//             tenants={tenants}
//             properties={properties}
//             setProperties={setProperties}
//             log={log}
//           />
//         )}
//         {tab === "tenants" && (
//           <LLTenants
//             me={me}
//             myTenants={myTenants}
//             setMyTenants={setMyTenants}
//             myProps={myProps}
//             tenants={tenants}
//             setTenants={setTenants}
//             properties={properties}
//             log={log}
//             push={push}
//           />
//         )}
//         {tab === "managers" && (
//           <LLManagers
//             properties={properties}
//             setProperties={setProperties}
//             me={me}
//             log={log}
//           />
//         )}
//         {tab === "payments" && (
//           <LLPayments
//             me={me}
//             myPayments={myPayments}
//             myTenants={myTenants}
//             myAdminPays={myAdminPays}
//             invoices={invoices}
//             setInvoices={setInvoices}
//           />
//         )}
//         {tab === "services" && (
//           <LLServices
//             mySvcReqs={mySvcReqs}
//             myTenants={myTenants}
//             tickets={tickets}
//             setTickets={setTickets}
//             me={me}
//           />
//         )}
//         {tab === "accounts" && (
//           <LLSubAccounts
//             me={me}
//             tenants={tenants}
//             setTenants={setTenants}
//             managers={myManagers}
//             setManagers={setManagers}
//             properties={myProps}
//             log={log}
//           />
//         )}
//         {tab === "will" && (
//           <LLWill me={me} myWills={myWills} setWills={setWills} log={log} />
//         )}
//         {tab === "profile" && <LLProfile me={me} log={log} />}
//       </main>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Avatar, EstateLogo } from "../../components/UI";
import {
  IcoDash,
  IcoBuild,
  IcoPeople,
  IcoCard,
  IcoStar,
  IcoList,
  IcoKey,
  IcoGear,
} from "../../components/Icons";
import {
  LLOverview,
  LLProperties,
  LLTenants,
  LLManagers,
  LLPayments,
  LLServices,
  LLWill,
  LLSubAccounts,
  LLProfile,
} from "./LandlordPages";

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

export default function LandlordPortal({
  tab,
  setTab,
  me,
  setMe,
  properties,
  setProperties,
  tenants,
  setTenants,
  myTenants,
  setMyTenants,
  payments,
  serviceRequests,
  wills,
  setWills,
  adminPayments,
  log,
  push,
  setScreen,
  managers,
  setManagers,
  invoices,
  setInvoices,
  tickets,
  setTickets,
  notifs,
  pa,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const myProps = properties.filter(
    (p) => me.properties?.includes(p.id) || p.landlordId === me.id
  );
  const myPayments = payments.filter((p) =>
    myTenants.some((t) => t.id === p.tenantId)
  );
  const myAdminPays = adminPayments.filter((p) => p.landlordId === me.id);
  const mySvcReqs = serviceRequests.filter((r) =>
    myTenants.some((t) => t.id === r.tenantId)
  );

  const myWills = wills.filter((w) => w.landlordId === me.id);
  const myManagers = managers.filter((m) => m.landlordId === me.id);

  const TABS = [
    { id: "overview", label: "Overview", icon: <IcoDash /> },
    { id: "properties", label: "Properties", icon: <IcoBuild /> },
    { id: "tenants", label: "Tenants", icon: <IcoPeople /> },
    { id: "managers", label: "Managers", icon: <IcoPeople /> },
    { id: "payments", label: "Payments", icon: <IcoCard /> },
    { id: "services", label: "Services", icon: <IcoStar /> },
    { id: "accounts", label: "Sub-Accounts", icon: <IcoKey /> },
    { id: "will", label: "Will", icon: <IcoList /> },
    { id: "profile", label: "Profile", icon: <IcoPeople /> },
  ];

  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [tenantsLoading, setTenantsLoading] = useState(true);

  useEffect(() => {
    if (!me?.id) return;

    setPropertiesLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getProperties",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.id,
            name: r.name,
            landlordId: r.landlordId,
            type: r.type,
            address: r.address,
            images: r.imageUrls,
            description: r.description,
            amenities: r.amenities,
            units: (r.units || []).map((unit) => ({
              id: unit.id,
              label: unit.label,
              status: unit.status,
              subtype: unit.subtype || "",
              measurement: unit.measurement || "",
            })),
          }));

          setProperties(mapped);
        } else {
          console.error("Failed to load Properties:", event?.message);
          setProperties([]);
        }

        setPropertiesLoading(false);
      },
      { escape: false }
    );
  }, [me?.id, setProperties]);

  useEffect(() => {
    if (!me?.id) return;
    setTenantsLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenants",
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
              Landlord Portal
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
            <div style={{ fontSize: 10.5, color: "var(--dim)" }}>Landlord</div>
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
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg0)",
      }}
    >
      {/* Desktop Sidebar - fixed on desktop */}
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
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: "var(--bg0)", // Use solid background color
              backgroundColor: "#ffffff", // Fallback solid white
              borderBottom: "1px solid var(--br)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
              zIndex: 100,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              backdropFilter: "none", // Remove any blur effect
              WebkitBackdropFilter: "none", // Remove Safari blur
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
                  Landlord Portal
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
                backgroundColor: "#B8860B", // Fallback gold
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
          </div>

          {/* Mobile Overlay Menu - renders outside main flow */}
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
        }}
      >
        {tab === "overview" && (
          <LLOverview
            me={me}
            myProps={myProps}
            tenants={tenants}
            setTenants={setTenants}
            myPayments={myPayments}
            myAdminPays={myAdminPays}
            properties={properties}
            setProperties={setProperties}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "properties" && (
          <LLProperties
            me={me}
            myProps={myProps}
            tenants={tenants}
            properties={properties}
            setProperties={setProperties}
            log={log}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "tenants" && (
          <LLTenants
            me={me}
            myTenants={myTenants}
            setMyTenants={setMyTenants}
            myProps={myProps}
            tenants={tenants}
            setTenants={setTenants}
            properties={properties}
            log={log}
            push={push}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "managers" && (
          <LLManagers
            properties={properties}
            setProperties={setProperties}
            me={me}
            log={log}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "payments" && (
          <LLPayments
            me={me}
            myPayments={myPayments}
            myTenants={myTenants}
            myAdminPays={myAdminPays}
            invoices={invoices}
            setInvoices={setInvoices}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "services" && (
          <LLServices
            mySvcReqs={mySvcReqs}
            myTenants={myTenants}
            tickets={tickets}
            setTickets={setTickets}
            me={me}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "accounts" && (
          <LLSubAccounts
            me={me}
            tenants={tenants}
            setTenants={setTenants}
            managers={myManagers}
            setManagers={setManagers}
            properties={myProps}
            log={log}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "will" && (
          <LLWill
            me={me}
            myWills={myWills}
            setWills={setWills}
            log={log}
            tab={tab}
            setTab={setTab}
          />
        )}
        {tab === "profile" && (
          <LLProfile me={me} log={log} tab={tab} setTab={setTab} />
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
          
          /* Make tables scroll horizontally if needed */
          .table-container {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
