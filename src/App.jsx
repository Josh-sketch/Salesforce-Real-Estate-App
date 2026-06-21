// import { useState, useEffect, useRef } from "react";
// import { GLOBAL_CSS } from "./styles";
// import {
//   PA_INIT,
//   PROPERTIES_INIT,
//   LANDLORDS_INIT,
//   TENANTS_INIT,
//   PAYMENTS_INIT,
//   NOTIFS_INIT,
//   AUDIT_INIT,
//   SERVICE_REQUESTS_INIT,
//   WILLS_INIT,
//   ADMIN_PAYMENTS_INIT,
// } from "./data/constants";
// import Auth from "./pages/Auth";
// import LandlordPortal from "./pages/landlord/Landlord";
// import ManagerPortal from "./pages/manager/Manager";
// import Tenant from "./pages/tenant/Tenant";
// import { TODAY } from "./utils";

// // const SESSION_KEY = "mechtron_session";
// const SESSION_STORAGE_KEY = "mechtron_session";
// const TAB_KEY = "mechtron_tab";

// const MANAGERS_INIT = [
//   {
//     id: "MGR001",
//     name: "Tunde Adeyemi",
//     email: "tunde.mgr@mechtron.ng",
//     phone: "08055667788",
//     landlordId: "LL001",
//     password: null,
//     otp: "PASS-TMP1",
//     otpUsed: false,
//     status: "active",
//   },
// ];

// export default function App() {
//   // ── Restore session from localStorage on first load ──
//   // const savedSession = (() => {
//   //   try {
//   //     const raw = localStorage.getItem(SESSION_KEY);
//   //     return raw ? JSON.parse(raw) : null;
//   //   } catch {
//   //     return null;
//   //   }
//   // })();

//   // const [screen, setScreen] = useState(savedSession?.type ?? "auth");
//   // const [me, setMe] = useState(savedSession ?? null);
//   // const savedSession = (() => {
//   //   try {
//   //     const raw = localStorage.getItem(SESSION_KEY);
//   //     const parsed = raw ? JSON.parse(raw) : null;
//   //     if (!parsed) return null;
//   //     // Expire after 24 hours
//   //     const age = Date.now() - new Date(parsed.sessionStart).getTime();
//   //     if (age > 24 * 60 * 60 * 1000) {
//   //       localStorage.removeItem(SESSION_KEY);
//   //       return null;
//   //     }
//   //     return parsed;
//   //   } catch {
//   //     return null;
//   //   }
//   // })();

//   const savedSession = (() => {
//     try {
//       const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
//       const parsed = raw ? JSON.parse(raw) : null;
//       if (!parsed) return null;
//       // Optionally keep 24-hour expiry (still useful)
//       const age = Date.now() - new Date(parsed.sessionStart).getTime();
//       if (age > 24 * 60 * 60 * 1000) {
//         sessionStorage.removeItem(SESSION_STORAGE_KEY);
//         return null;
//       }
//       return parsed;
//     } catch {
//       return null;
//     }
//   })();

//   const [screen, setScreen] = useState(savedSession?.type ?? "auth");
//   const [me, setMe] = useState(savedSession ?? null);

//   const [tenants, setTenants] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [tickets, setTickets] = useState([]);
//   const [notifs, setNotifs] = useState(NOTIFS_INIT);
//   const [pa, setPa] = useState(PA_INIT);
//   const [audit, setAudit] = useState(AUDIT_INIT);
//   const [properties, setProperties] = useState([]);
//   const [landlords, setLandlords] = useState([]);
//   const [managers, setManagers] = useState([]);
//   const [serviceRequests, setServiceRequests] = useState(SERVICE_REQUESTS_INIT);
//   const [wills, setWills] = useState(WILLS_INIT);
//   const [adminPayments, setAdminPayments] = useState(ADMIN_PAYMENTS_INIT);
//   const [myTenants, setMyTenants] = useState([]);
//   const [myUnits, setMyUnits] = useState([]);
//   const getDefaultTab = () => {
//     if (!savedSession) return "home";
//     if (savedSession.type === "tenant") return "home";
//     return "overview"; // manager and landlord
//   };

//   // const [tab, setTab] = useState(() => {
//   //   try {
//   //     const raw = localStorage.getItem(TAB_KEY);
//   //     return raw ? JSON.parse(raw) : getDefaultTab();
//   //   } catch {
//   //     return getDefaultTab();
//   //   }
//   // });
//   const [tab, setTab] = useState(() => {
//     try {
//       // ✅ Only restore tab if there's an active session
//       if (!savedSession) {
//         localStorage.removeItem(TAB_KEY); // clean up stale tab
//         return "home";
//       }
//       const raw = localStorage.getItem(TAB_KEY);
//       return raw ? JSON.parse(raw) : getDefaultTab();
//     } catch {
//       return getDefaultTab();
//     }
//   });
//   const [invoices, setInvoices] = useState([]);

//   // ── Save tab whenever it changes ──
//   useEffect(() => {
//     try {
//       localStorage.setItem(TAB_KEY, JSON.stringify(tab));
//     } catch (e) {
//       console.error("Failed to save tab:", e);
//     }
//   }, [tab]);

//   useEffect(() => {
//     if (me) {
//       try {
//         sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(me));
//       } catch (e) {
//         console.error("Failed to save session:", e);
//       }
//     } else {
//       sessionStorage.removeItem(SESSION_STORAGE_KEY);
//     }
//   }, [me]);

//   const log = (a, by) =>
//     setAudit((p) => [
//       {
//         action: a,
//         by: by || "System",
//         date: new Date().toLocaleString("en-NG"),
//       },
//       ...p,
//     ]);

//   const push = (tid, msg, type = "info") =>
//     setNotifs((p) => [
//       ...p,
//       {
//         id: `N${Date.now()}`,
//         tenantId: tid,
//         message: msg,
//         date: new Date().toISOString().split("T")[0],
//         read: false,
//         type,
//       },
//     ]);

//   // ── Save session whenever `me` changes ──
//   useEffect(() => {
//     if (me) {
//       try {
//         localStorage.setItem(SESSION_KEY, JSON.stringify(me));
//         console.log("✅ Session saved:", me);
//       } catch (e) {
//         console.error("Failed to save session:", e);
//       }
//     } else {
//       localStorage.removeItem(SESSION_KEY);
//     }
//   }, [me]);

//   // ── Login handler ──
//   const handleLogin = (user) => {
//     setMe(user);
//     setScreen(user.type);
//     setTab(user.type === "tenant" ? "home" : "overview"); // ✅ set correct default on login
//   };

//   // ── Logout handler — clears session and returns to auth ──
//   // const handleLogout = () => {
//   //   localStorage.removeItem(SESSION_KEY);
//   //   localStorage.removeItem(TAB_KEY); // ✅ clear saved tab on logout
//   //   setMe(null);
//   //   setScreen("auth");
//   //   setInvoices([]);
//   //   setMyTenants([]);
//   //   setMyUnits([]);
//   //   setTab("home"); // ✅ reset to string not []
//   // };

//   const handleLogout = () => {
//     sessionStorage.removeItem(SESSION_STORAGE_KEY);
//     localStorage.removeItem(TAB_KEY);
//     setMe(null);
//     setScreen("auth");
//     setInvoices([]);
//     setMyTenants([]);
//     setMyUnits([]);
//     setTab("home");
//   };

//   // Inside App component, after handleLogout
//   const inactivityTimerRef = useRef(null);

//   const resetInactivityTimer = () => {
//     if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
//     inactivityTimerRef.current = setTimeout(() => {
//       console.log("⏰ Session expired due to inactivity");
//       handleLogout();
//     }, 30 * 60 * 1000); // 30 minutes
//   };

//   // Set up event listeners for user activity
//   useEffect(() => {
//     const events = ["mousedown", "keydown", "scroll", "touchstart"];
//     const reset = () => resetInactivityTimer();

//     // Initial start
//     resetInactivityTimer();

//     // Add event listeners
//     events.forEach((ev) => window.addEventListener(ev, reset));

//     // Cleanup
//     return () => {
//       events.forEach((ev) => window.removeEventListener(ev, reset));
//       if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
//     };
//   }, []);

//   // useEffect(() => {
//   //   const handleBeforeUnload = () => {
//   //     localStorage.removeItem(SESSION_KEY);
//   //     localStorage.removeItem(TAB_KEY);
//   //   };
//   //   window.addEventListener("beforeunload", handleBeforeUnload);
//   //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   // }, []);

//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         resetInactivityTimer();
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () =>
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   const shared = {
//     tenants,
//     setTenants,
//     payments,
//     setPayments,
//     tickets,
//     setTickets,
//     notifs,
//     setNotifs,
//     pa,
//     setPa,
//     audit,
//     log,
//     push,
//     setScreen,
//     properties,
//     setProperties,
//     landlords,
//     setLandlords,
//     managers,
//     setManagers,
//     serviceRequests,
//     setServiceRequests,
//     wills,
//     setWills,
//     adminPayments,
//     setAdminPayments,
//     myTenants,
//     setMyTenants,
//     myUnits,
//     setMyUnits,
//     tab,
//     setTab,
//     invoices,
//     setInvoices,
//     onLogout: handleLogout, // ← pass to all portals
//   };

//   return (
//     <>
//       <style>{GLOBAL_CSS}</style>
//       {screen === "auth" && <Auth {...shared} onLogin={handleLogin} />}
//       {screen === "landlord" && me?.type === "landlord" && (
//         <LandlordPortal {...shared} me={me} setMe={setMe} />
//       )}
//       {screen === "manager" && me?.type === "manager" && (
//         <ManagerPortal {...shared} me={me} setMe={setMe} />
//       )}
//       {screen === "tenant" && me?.type === "tenant" && (
//         <Tenant {...shared} me={me} setMe={setMe} />
//       )}
//     </>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { GLOBAL_CSS } from "./styles";
import {
  PA_INIT,
  NOTIFS_INIT,
  AUDIT_INIT,
  SERVICE_REQUESTS_INIT,
  WILLS_INIT,
  ADMIN_PAYMENTS_INIT,
} from "./data/constants";
import Auth from "./pages/Auth";
import LandlordPortal from "./pages/landlord/Landlord";
import ManagerPortal from "./pages/manager/Manager";
import Tenant from "./pages/tenant/Tenant";

const SESSION_STORAGE_KEY = "mechtron_session";
const TAB_KEY = "mechtron_tab";

export default function App() {
  // ── Restore session from sessionStorage (cleared on tab close) ──
  const savedSession = (() => {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (!parsed) return null;
      // Optional 24-hour expiry
      const age = Date.now() - new Date(parsed.sessionStart).getTime();
      if (age > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  })();

  const [screen, setScreen] = useState(savedSession?.type ?? "auth");
  const [me, setMe] = useState(savedSession ?? null);

  // State declarations
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifs, setNotifs] = useState(NOTIFS_INIT);
  const [pa, setPa] = useState(PA_INIT);
  const [audit, setAudit] = useState(AUDIT_INIT);
  const [properties, setProperties] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [managers, setManagers] = useState([]);
  const [serviceRequests, setServiceRequests] = useState(SERVICE_REQUESTS_INIT);
  const [wills, setWills] = useState(WILLS_INIT);
  const [adminPayments, setAdminPayments] = useState(ADMIN_PAYMENTS_INIT);
  const [myTenants, setMyTenants] = useState([]);
  const [myUnits, setMyUnits] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const getDefaultTab = () => {
    if (!savedSession) return "home";
    if (savedSession.type === "tenant") return "home";
    return "overview";
  };

  const [tab, setTab] = useState(() => {
    try {
      if (!savedSession) {
        localStorage.removeItem(TAB_KEY);
        return "home";
      }
      const raw = localStorage.getItem(TAB_KEY);
      return raw ? JSON.parse(raw) : getDefaultTab();
    } catch {
      return getDefaultTab();
    }
  });

  // ── Save tab to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, JSON.stringify(tab));
    } catch (e) {
      console.error("Failed to save tab:", e);
    }
  }, [tab]);

  // ── Save session to sessionStorage (cleared on tab close) ──
  useEffect(() => {
    if (me) {
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(me));
      } catch (e) {
        console.error("Failed to save session:", e);
      }
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [me]);

  const log = (a, by) =>
    setAudit((p) => [
      {
        action: a,
        by: by || "System",
        date: new Date().toLocaleString("en-NG"),
      },
      ...p,
    ]);

  const push = (tid, msg, type = "info") =>
    setNotifs((p) => [
      ...p,
      {
        id: `N${Date.now()}`,
        tenantId: tid,
        message: msg,
        date: new Date().toISOString().split("T")[0],
        read: false,
        type,
      },
    ]);

  // ── Login handler ──
  const handleLogin = (user) => {
    setMe(user);
    setScreen(user.type);
    setTab(user.type === "tenant" ? "home" : "overview");
  };

  // ── Logout handler ──
  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(TAB_KEY);
    setMe(null);
    setScreen("auth");
    setInvoices([]);
    setMyTenants([]);
    setMyUnits([]);
    setTab("home");
  };

  // ── Inactivity timer (30 minutes) ──
  const inactivityTimerRef = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      console.log("⏰ Session expired due to inactivity");
      handleLogout();
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const reset = () => resetInactivityTimer();

    resetInactivityTimer();
    events.forEach((ev) => window.addEventListener(ev, reset));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reset));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // ── Reset timer when tab becomes visible again ──
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetInactivityTimer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const shared = {
    tenants,
    setTenants,
    payments,
    setPayments,
    tickets,
    setTickets,
    notifs,
    setNotifs,
    pa,
    setPa,
    audit,
    log,
    push,
    setScreen,
    properties,
    setProperties,
    landlords,
    setLandlords,
    managers,
    setManagers,
    serviceRequests,
    setServiceRequests,
    wills,
    setWills,
    adminPayments,
    setAdminPayments,
    myTenants,
    setMyTenants,
    myUnits,
    setMyUnits,
    tab,
    setTab,
    invoices,
    setInvoices,
    onLogout: handleLogout,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {screen === "auth" && <Auth {...shared} onLogin={handleLogin} />}
      {screen === "landlord" && me?.type === "landlord" && (
        <LandlordPortal {...shared} me={me} setMe={setMe} />
      )}
      {screen === "manager" && me?.type === "manager" && (
        <ManagerPortal {...shared} me={me} setMe={setMe} />
      )}
      {screen === "tenant" && me?.type === "tenant" && (
        <Tenant {...shared} me={me} setMe={setMe} />
      )}
    </>
  );
}
