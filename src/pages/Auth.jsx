// import { useState } from "react";
// import { EstateLogo, Lbl } from "../components/UI";

// // Generate a random OTP
// export function genOTP() {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   let out = "";
//   for (let i = 0; i < 8; i++)
//     out += chars[Math.floor(Math.random() * chars.length)];
//   return out;
// }

// export default function Auth({
//   landlords,
//   setLandlords,
//   tenants,
//   setTenants,
//   managers,
//   setManagers,
//   onLogin,
// }) {
//   const [view, setView] = useState("login"); // login | signup
//   // Login state
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [err, setErr] = useState("");
//   const [busy, setBusy] = useState(false);
//   // OTP change flow
//   const [otpUser, setOtpUser] = useState(null); // { type, id, ... }
//   const [newPass, setNewPass] = useState("");
//   const [newPass2, setNewPass2] = useState("");
//   // Signup state
//   const [sf, setSf] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm: "",
//   });
//   const [signupDone, setSignupDone] = useState(false);

//   const go = async () => {
//     setErr("");
//     setBusy(true);

//     try {
//       const data = await new Promise((resolve, reject) => {
//         Visualforce.remoting.Manager.invokeAction(
//           "EstateController.login",
//           email,
//           pass,
//           function (result, event) {
//             if (event.status) resolve(result);
//             else reject(event.message);
//           }
//         );
//       });

//       console.log("LOGIN RESPONSE:", data); // 🔍 FULL RESPONSE

//       if (data.success) {
//         const role = (data.role || "tenant").toLowerCase();

//         const userObj = {
//           id: data.user.Id,
//           name: data.user.Name,
//           email: data.user.Email__c,
//           phone: data.user.Phone__c,
//           accountId: data.user.Account__c,
//           contactId: data.user.Contact__c,
//           bankName: data.user.Bank_Name__c,
//           accountName: data.user.Account_Name__c,
//           accountNumber: data.user.Account_Number__c,
//           type: role,
//           subaccounts: data.subaccounts || [],
//         };

//         console.log("LOGGED IN USER:", userObj); // 👤 USER
//         console.log("SUBACCOUNTS:", userObj.subaccounts); // 👥 SUBS

//         onLogin(userObj);
//       } else {
//         setErr(data.message || "Invalid login.");
//       }
//     } catch (e) {
//       console.error(e);
//       setErr("Login failed.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const commitNewPass = () => {
//     if (newPass.length < 6)
//       return setErr("Password must be at least 6 characters.");
//     if (newPass !== newPass2) return setErr("Passwords do not match.");
//     if (otpUser.type === "manager") {
//       setManagers((ms) =>
//         ms.map((m) =>
//           m.id === otpUser.id ? { ...m, password: newPass, otpUsed: true } : m
//         )
//       );
//       onLogin({ ...otpUser, password: newPass, otpUsed: true });
//     } else {
//       setTenants((ts) =>
//         ts.map((t) =>
//           t.id === otpUser.id ? { ...t, password: newPass, otpUsed: true } : t
//         )
//       );
//       onLogin({ ...otpUser, password: newPass, otpUsed: true });
//     }
//   };

//   const doSignup = async () => {
//     if (!sf.name || !sf.email || !sf.phone || !sf.password) {
//       setErr("All fields are required.");
//       return;
//     }

//     if (sf.password !== sf.confirm) {
//       setErr("Passwords do not match.");
//       return;
//     }

//     if (sf.password.length < 6) {
//       setErr("Password must be at least 6 characters.");
//       return;
//     }

//     setBusy(true);
//     setErr("");

//     try {
//       const data = await new Promise((resolve, reject) => {
//         Visualforce.remoting.Manager.invokeAction(
//           "EstateController.createLandlord",
//           sf.name,
//           sf.email,
//           sf.phone,
//           sf.password,
//           function (result, event) {
//             if (event.status) resolve(result);
//             else reject(event.message);
//           }
//         );
//       });

//       if (data.success) {
//         setSignupDone(true);

//         setSf({
//           name: "",
//           email: "",
//           phone: "",
//           password: "",
//           confirm: "",
//         });
//       } else {
//         setErr(data.message || "Signup failed.");
//       }
//     } catch (e) {
//       console.error(e);
//       setErr("Error creating account.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   // ── OTP change password screen ──
//   if (otpUser) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "var(--bg0)",
//           padding: 20,
//         }}
//       >
//         <div
//           className="anim-up card"
//           style={{ maxWidth: 420, width: "100%", padding: "36px 32px" }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               marginBottom: 26,
//             }}
//           >
//             <EstateLogo size={36} />
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 16,
//                   fontWeight: 700,
//                   color: "var(--text)",
//                 }}
//               >
//                 Mechtron Estate
//               </div>
//               <div
//                 style={{
//                   fontSize: 10,
//                   color: "var(--dim)",
//                   textTransform: "uppercase",
//                   letterSpacing: 1.2,
//                 }}
//               >
//                 Set your password
//               </div>
//             </div>
//           </div>
//           <div
//             style={{
//               background: "var(--bluepale)",
//               border: "1px solid rgba(26,82,118,.18)",
//               borderRadius: "var(--r-md)",
//               padding: "13px 15px",
//               marginBottom: 22,
//               fontSize: 13,
//               color: "var(--blue)",
//               lineHeight: 1.6,
//             }}
//           >
//             👋 Welcome, <strong>{otpUser.name.split(" ")[0]}</strong>! You've
//             signed in with a one-time password. Please set a permanent password
//             to continue.
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
//             <div>
//               <Lbl>New Password</Lbl>
//               <input
//                 className="field"
//                 type="password"
//                 value={newPass}
//                 onChange={(e) => setNewPass(e.target.value)}
//                 placeholder="Min. 6 characters"
//               />
//             </div>
//             <div>
//               <Lbl>Confirm Password</Lbl>
//               <input
//                 className="field"
//                 type="password"
//                 value={newPass2}
//                 onChange={(e) => setNewPass2(e.target.value)}
//                 placeholder="Repeat password"
//                 onKeyDown={(e) => e.key === "Enter" && commitNewPass()}
//               />
//             </div>
//           </div>
//           {err && (
//             <div
//               style={{
//                 marginTop: 12,
//                 background: "var(--redpale)",
//                 border: "1px solid rgba(192,57,43,.2)",
//                 borderRadius: "var(--r-sm)",
//                 padding: "9px 12px",
//                 color: "var(--red)",
//                 fontSize: 12.5,
//               }}
//             >
//               ⚠ {err}
//             </div>
//           )}
//           <button
//             className="btn-primary"
//             onClick={commitNewPass}
//             style={{
//               width: "100%",
//               marginTop: 18,
//               padding: "12px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 14,
//             }}
//           >
//             Set Password & Continue →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{ minHeight: "100vh", display: "flex", background: "var(--bg0)" }}
//     >
//       {/* Left panel */}
//       <div
//         style={{
//           width: 480,
//           background: "var(--bg1)",
//           borderRight: "1px solid var(--br)",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "space-between",
//           padding: "52px 52px",
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <div
//           style={{
//             position: "absolute",
//             top: -100,
//             right: -100,
//             width: 380,
//             height: 380,
//             borderRadius: "50%",
//             background:
//               "radial-gradient(circle,rgba(139,103,40,.07) 0%,transparent 70%)",
//             pointerEvents: "none",
//           }}
//         />
//         <div
//           style={{
//             position: "absolute",
//             bottom: -60,
//             left: -80,
//             width: 300,
//             height: 300,
//             borderRadius: "50%",
//             background:
//               "radial-gradient(circle,rgba(196,154,60,.05) 0%,transparent 70%)",
//             pointerEvents: "none",
//           }}
//         />
//         <div className="anim-up">
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 12,
//               marginBottom: 56,
//             }}
//           >
//             <EstateLogo size={44} />
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 20,
//                   color: "var(--text)",
//                   fontWeight: 700,
//                   lineHeight: 1.1,
//                   letterSpacing: -0.3,
//                 }}
//               >
//                 Mechtron
//               </div>
//               <div
//                 style={{
//                   fontSize: 10,
//                   color: "var(--sub)",
//                   letterSpacing: 1.8,
//                   textTransform: "uppercase",
//                   fontWeight: 600,
//                 }}
//               >
//                 Estate Management
//               </div>
//             </div>
//           </div>
//           <h1
//             style={{
//               fontFamily: "'Cormorant Garamond',serif",
//               fontSize: 50,
//               fontWeight: 300,
//               color: "var(--text)",
//               lineHeight: 1.08,
//               marginBottom: 20,
//               letterSpacing: -0.5,
//             }}
//           >
//             Your estate.
//             <br />
//             <span className="gold-gradient" style={{ fontWeight: 700 }}>
//               Managed well.
//             </span>
//           </h1>
//           <p
//             style={{
//               color: "var(--sub)",
//               fontSize: 14.5,
//               lineHeight: 1.9,
//               maxWidth: 340,
//             }}
//           >
//             A complete property management platform for landlords, managers, and
//             tenants — built for discerning estates.
//           </p>
//         </div>
//         <div
//           className="anim-up d3"
//           style={{ display: "flex", flexDirection: "column", gap: 12 }}
//         >
//           {[
//             "Unified login for all roles",
//             "Rent payment confirmation & receipts",
//             "Maintenance ticket tracking",
//             "Property & tenant management",
//             "Manager sub-accounts with OTP access",
//             "Full tenancy agreement downloads",
//           ].map((f, i) => (
//             <div
//               key={i}
//               style={{ display: "flex", alignItems: "center", gap: 10 }}
//             >
//               <div
//                 style={{
//                   width: 20,
//                   height: 20,
//                   borderRadius: 6,
//                   background: "var(--goldpale)",
//                   border: "1px solid var(--brg)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexShrink: 0,
//                 }}
//               >
//                 <svg width="10" height="10" viewBox="0 0 12 12">
//                   <polyline
//                     points="2 6 5 9 10 3"
//                     stroke="var(--gold)"
//                     strokeWidth="1.8"
//                     fill="none"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>
//               <span style={{ fontSize: 13, color: "var(--sub)" }}>{f}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 40,
//         }}
//       >
//         <div className="anim-up d2" style={{ width: "100%", maxWidth: 420 }}>
//           {view === "login" ? (
//             <>
//               <h2
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 30,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                   marginBottom: 4,
//                 }}
//               >
//                 Sign in
//               </h2>
//               <p
//                 style={{
//                   color: "var(--sub)",
//                   fontSize: 13.5,
//                   marginBottom: 28,
//                 }}
//               >
//                 Welcome back — enter your credentials to continue.
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 14,
//                   marginBottom: 20,
//                 }}
//               >
//                 <div>
//                   <Lbl>Email address</Lbl>
//                   <input
//                     className="field"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="your@email.com"
//                   />
//                 </div>
//                 <div>
//                   <Lbl>Password</Lbl>
//                   <input
//                     className="field"
//                     type="password"
//                     value={pass}
//                     onChange={(e) => setPass(e.target.value)}
//                     placeholder="••••••••"
//                     onKeyDown={(e) => e.key === "Enter" && go()}
//                   />
//                 </div>
//               </div>
//               {err && (
//                 <div
//                   style={{
//                     background: "var(--redpale)",
//                     border: "1px solid rgba(192,57,43,.2)",
//                     borderRadius: "var(--r-sm)",
//                     padding: "10px 13px",
//                     color: "var(--red)",
//                     fontSize: 12.5,
//                     marginBottom: 14,
//                     display: "flex",
//                     gap: 7,
//                     alignItems: "center",
//                   }}
//                 >
//                   ⚠ {err}
//                 </div>
//               )}
//               <button
//                 className="btn-primary"
//                 onClick={go}
//                 style={{
//                   width: "100%",
//                   padding: "13px 0",
//                   borderRadius: "var(--r-md)",
//                   fontSize: 14.5,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                 }}
//               >
//                 {busy ? (
//                   <span
//                     style={{
//                       width: 16,
//                       height: 16,
//                       border: "2px solid #fff",
//                       borderTopColor: "transparent",
//                       borderRadius: "50%",
//                       animation: "spin .7s linear infinite",
//                       display: "inline-block",
//                     }}
//                   />
//                 ) : (
//                   "Sign In →"
//                 )}
//               </button>
//               <div style={{ marginTop: 20, textAlign: "center" }}>
//                 <span style={{ color: "var(--sub)", fontSize: 13 }}>
//                   Are you a landlord or a house Agent?{" "}
//                 </span>
//                 <button
//                   onClick={() => {
//                     setView("signup");
//                     setErr("");
//                   }}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "var(--gold)",
//                     fontWeight: 600,
//                     fontSize: 13,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Create an account →
//                 </button>
//               </div>
//               <div
//                 style={{
//                   marginTop: 18,
//                   padding: "13px 15px",
//                   background: "var(--bg2)",
//                   borderRadius: "var(--r-md)",
//                   border: "1px solid var(--br)",
//                 }}
//               >
//                 <Lbl style={{ marginBottom: 6 }}>Demo credentials</Lbl>
//                 <div
//                   style={{
//                     fontFamily: "'DM Mono',monospace",
//                     fontSize: 11.5,
//                     color: "var(--dim)",
//                     lineHeight: 2,
//                   }}
//                 >
//                   <div>Landlord: emekaokafor@gmail.com · Emeka34</div>
//                   <div>Manager: mechtrondispatcher@gmail.com ·Tundra96</div>
//                   <div>Tenant: yemiagbaje@mechtron.com · Agbajs34</div>
//                 </div>
//               </div>
//             </>
//           ) : signupDone ? (
//             <div className="anim-up" style={{ textAlign: "center" }}>
//               <div
//                 style={{
//                   width: 72,
//                   height: 72,
//                   borderRadius: "50%",
//                   background: "var(--greenpale)",
//                   border: "1px solid rgba(26,122,74,.3)",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: 32,
//                   margin: "0 auto 20px",
//                 }}
//               >
//                 ✓
//               </div>
//               <h2
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 26,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                   marginBottom: 10,
//                 }}
//               >
//                 Account Created!
//               </h2>
//               <p
//                 style={{
//                   color: "var(--sub)",
//                   fontSize: 13.5,
//                   lineHeight: 1.7,
//                   marginBottom: 26,
//                 }}
//               >
//                 Your landlord account has been created. Sign in to get started.
//               </p>
//               <button
//                 className="btn-primary"
//                 onClick={() => {
//                   setView("login");
//                   setSignupDone(false);
//                   setSf({
//                     name: "",
//                     email: "",
//                     phone: "",
//                     password: "",
//                     confirm: "",
//                   });
//                 }}
//                 style={{
//                   padding: "11px 32px",
//                   borderRadius: "var(--r-md)",
//                   fontSize: 14,
//                 }}
//               >
//                 Go to Sign In →
//               </button>
//             </div>
//           ) : (
//             <>
//               <h2
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 30,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                   marginBottom: 4,
//                 }}
//               >
//                 Create account
//               </h2>
//               <p
//                 style={{
//                   color: "var(--sub)",
//                   fontSize: 13.5,
//                   marginBottom: 28,
//                 }}
//               >
//                 Register as a landlord to manage your properties.
//               </p>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   gap: 13,
//                   marginBottom: 18,
//                 }}
//               >
//                 {[
//                   ["Full Name", "name", "text", "Chief Emeka Okafor"],
//                   ["Email Address", "email", "email", "your@email.com"],
//                   ["Phone Number", "phone", "tel", "080XXXXXXXX"],
//                   ["Password", "password", "password", "Min. 6 characters"],
//                   [
//                     "Confirm Password",
//                     "confirm",
//                     "password",
//                     "Repeat password",
//                   ],
//                 ].map(([lbl, k, type, ph]) => (
//                   <div key={k}>
//                     <Lbl>{lbl}</Lbl>
//                     <input
//                       className="field"
//                       type={type}
//                       value={sf[k]}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, [k]: e.target.value }))
//                       }
//                       placeholder={ph}
//                     />
//                   </div>
//                 ))}
//               </div>
//               {err && (
//                 <div
//                   style={{
//                     background: "var(--redpale)",
//                     border: "1px solid rgba(192,57,43,.2)",
//                     borderRadius: "var(--r-sm)",
//                     padding: "10px 13px",
//                     color: "var(--red)",
//                     fontSize: 12.5,
//                     marginBottom: 14,
//                   }}
//                 >
//                   ⚠ {err}
//                 </div>
//               )}
//               <button
//                 className="btn-primary"
//                 onClick={doSignup}
//                 style={{
//                   width: "100%",
//                   padding: "13px 0",
//                   borderRadius: "var(--r-md)",
//                   fontSize: 14.5,
//                 }}
//               >
//                 Create Landlord Account →
//               </button>
//               <div style={{ marginTop: 16, textAlign: "center" }}>
//                 <button
//                   onClick={() => {
//                     setView("login");
//                     setErr("");
//                   }}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     color: "var(--sub)",
//                     fontSize: 13,
//                     cursor: "pointer",
//                   }}
//                 >
//                   ← Back to Sign In
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { EstateLogo, Lbl } from "../components/UI";

export function genOTP() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function Auth({
  landlords,
  setLandlords,
  tenants,
  setTenants,
  managers,
  setManagers,
  onLogin,
}) {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpUser, setOtpUser] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [sf, setSf] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [signupDone, setSignupDone] = useState(false);

  const go = async () => {
    setErr("");
    setBusy(true);
    try {
      const data = await new Promise((resolve, reject) => {
        Visualforce.remoting.Manager.invokeAction(
          "EstateController.login",
          email,
          pass,
          function (result, event) {
            if (event.status) resolve(result);
            else reject(event.message);
          }
        );
      });
      console.log("LOGIN RESPONSE:", data);
      if (data.success) {
        const role = (data.role || "tenant").toLowerCase();
        const userObj = {
          id: data.user.Id,
          name: data.user.Name,
          email: data.user.Email__c,
          phone: data.user.Phone__c,
          accountId: data.user.Account__c,
          contactId: data.user.Contact__c,
          bankName: data.user.Bank_Name__c,
          accountName: data.user.Account_Name__c,
          accountNumber: data.user.Account_Number__c,
          type: role,
          subaccounts: data.subaccounts || [],
        };
        console.log("LOGGED IN USER:", userObj);
        onLogin(userObj);
      } else {
        setErr(data.message || "Invalid login.");
      }
    } catch (e) {
      console.error(e);
      setErr("Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const commitNewPass = () => {
    if (newPass.length < 6)
      return setErr("Password must be at least 6 characters.");
    if (newPass !== newPass2) return setErr("Passwords do not match.");
    if (otpUser.type === "manager") {
      setManagers((ms) =>
        ms.map((m) =>
          m.id === otpUser.id ? { ...m, password: newPass, otpUsed: true } : m
        )
      );
    } else {
      setTenants((ts) =>
        ts.map((t) =>
          t.id === otpUser.id ? { ...t, password: newPass, otpUsed: true } : t
        )
      );
    }
    onLogin({ ...otpUser, password: newPass, otpUsed: true });
  };

  const doSignup = async () => {
    if (!sf.name || !sf.email || !sf.phone || !sf.password)
      return setErr("All fields are required.");
    if (sf.password !== sf.confirm) return setErr("Passwords do not match.");
    if (sf.password.length < 6)
      return setErr("Password must be at least 6 characters.");
    setBusy(true);
    setErr("");
    try {
      const data = await new Promise((resolve, reject) => {
        Visualforce.remoting.Manager.invokeAction(
          "EstateController.createLandlord",
          sf.name,
          sf.email,
          sf.phone,
          sf.password,
          function (result, event) {
            if (event.status) resolve(result);
            else reject(event.message);
          }
        );
      });
      if (data.success) {
        setSignupDone(true);
        setSf({ name: "", email: "", phone: "", password: "", confirm: "" });
      } else {
        setErr(data.message || "Signup failed.");
      }
    } catch (e) {
      console.error(e);
      setErr("Error creating account.");
    } finally {
      setBusy(false);
    }
  };

  const ErrBox = ({ msg }) =>
    !msg ? null : (
      <div
        style={{
          background: "var(--redpale)",
          border: "1px solid rgba(192,57,43,.2)",
          borderRadius: "var(--r-sm)",
          padding: "10px 13px",
          color: "var(--red)",
          fontSize: 12.5,
          marginBottom: 14,
          display: "flex",
          gap: 7,
          alignItems: "center",
        }}
      >
        ⚠ {msg}
      </div>
    );

  const Spinner = () => (
    <span
      style={{
        width: 16,
        height: 16,
        border: "2px solid #fff",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin .7s linear infinite",
        display: "inline-block",
      }}
    />
  );

  // ── OTP set-password screen ───────────────────────────────────────────────
  if (otpUser) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg0)",
          padding: "20px 16px",
        }}
      >
        <div
          className="anim-up card"
          style={{ width: "100%", maxWidth: 420, padding: "32px 24px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <EstateLogo size={32} />
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--text)",
                }}
              >
                Mechtron Estate
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--dim)",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Set your password
              </div>
            </div>
          </div>
          <div
            style={{
              background: "var(--bluepale)",
              border: "1px solid rgba(26,82,118,.18)",
              borderRadius: "var(--r-md)",
              padding: "12px 14px",
              marginBottom: 20,
              fontSize: 13,
              color: "var(--blue)",
              lineHeight: 1.6,
            }}
          >
            👋 Welcome, <strong>{otpUser.name.split(" ")[0]}</strong>! You
            signed in with a one-time password. Please set a permanent password
            to continue.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div>
              <Lbl>New Password</Lbl>
              <input
                className="field"
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <Lbl>Confirm Password</Lbl>
              <input
                className="field"
                type="password"
                value={newPass2}
                onChange={(e) => setNewPass2(e.target.value)}
                placeholder="Repeat password"
                onKeyDown={(e) => e.key === "Enter" && commitNewPass()}
              />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <ErrBox msg={err} />
          </div>
          <button
            className="btn-primary"
            onClick={commitNewPass}
            style={{
              width: "100%",
              marginTop: 6,
              padding: "14px 0",
              borderRadius: "var(--r-md)",
              fontSize: 15,
            }}
          >
            Set Password & Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile top bar (only visible < 768px) ── */}
      <div className="auth-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <EstateLogo size={26} />
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text)",
              }}
            >
              Mechtron
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--sub)",
                letterSpacing: 1.4,
                textTransform: "uppercase",
              }}
            >
              Estate Management
            </div>
          </div>
        </div>
      </div>

      <div className="auth-root">
        {/* ── Left panel — hidden on mobile ── */}
        <div className="auth-left">
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 380,
              height: 380,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(139,103,40,.07) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -60,
              left: -80,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(196,154,60,.05) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div className="anim-up">
            <div
              className="auth-left-logo"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 52,
              }}
            >
              <EstateLogo size={44} />
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 20,
                    color: "var(--text)",
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  Mechtron
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--sub)",
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  Estate Management
                </div>
              </div>
            </div>
            <div className="auth-left-hero">
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 46,
                  fontWeight: 300,
                  color: "var(--text)",
                  lineHeight: 1.08,
                  marginBottom: 18,
                  letterSpacing: -0.5,
                }}
              >
                Your estate.
                <br />
                <span className="gold-gradient" style={{ fontWeight: 700 }}>
                  Managed well.
                </span>
              </h1>
              <p
                style={{
                  color: "var(--sub)",
                  fontSize: 14,
                  lineHeight: 1.9,
                  maxWidth: 320,
                }}
              >
                A complete property management platform for landlords, managers,
                and tenants.
              </p>
            </div>
          </div>

          <div
            className="auth-left-features anim-up d3"
            style={{ display: "flex", flexDirection: "column", gap: 11 }}
          >
            {/* <div
              className="auth-features-label"
              style={{
                display: "none",
                fontSize: 11,
                fontWeight: 700,
                color: "var(--dim)",
                textTransform: "uppercase",
                letterSpacing: 1.4,
                marginBottom: 14,
              }}
            >
              What's included
            </div> */}
            {[
              "Unified login for all roles",
              "Rent payment confirmation & receipts",
              "Maintenance ticket tracking",
              "Property & tenant management",
              "Manager sub-accounts with OTP access",
              "Full tenancy agreement downloads",
            ].map((f, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: "var(--goldpale)",
                    border: "1px solid var(--brg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12">
                    <polyline
                      points="2 6 5 9 10 3"
                      stroke="var(--gold)"
                      strokeWidth="1.8"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: "var(--sub)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="auth-right">
          <div className="auth-form anim-up d2">
            {/* LOGIN */}
            {view === "login" && (
              <>
                <h2 className="auth-heading">Sign in</h2>
                <p className="auth-sub">
                  Welcome back — enter your credentials to continue.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <Lbl>Email address</Lbl>
                    <input
                      className="field"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Lbl>Password</Lbl>
                    <input
                      className="field"
                      type="password"
                      autoComplete="current-password"
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      placeholder="••••••••"
                      onKeyDown={(e) => e.key === "Enter" && go()}
                    />
                  </div>
                </div>
                <ErrBox msg={err} />
                <button
                  className="btn-primary auth-btn"
                  onClick={go}
                  disabled={busy}
                >
                  {busy ? <Spinner /> : "Sign In →"}
                </button>
                <div style={{ marginTop: 18, textAlign: "center" }}>
                  <span style={{ color: "var(--sub)", fontSize: 13 }}>
                    Landlord or house agent?{" "}
                  </span>
                  <button
                    onClick={() => {
                      setView("signup");
                      setErr("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--gold)",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Create an account →
                  </button>
                </div>
                <div
                  style={{
                    marginTop: 16,
                    padding: "13px 15px",
                    background: "var(--bg2)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--br)",
                  }}
                >
                  <Lbl style={{ marginBottom: 6 }}>Demo credentials</Lbl>
                  <div
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11,
                      color: "var(--dim)",
                      lineHeight: 2.1,
                    }}
                  >
                    <div>Landlord: emekaokafor@gmail.com · Emeka34</div>
                    <div>Manager: mechtrondispatcher@gmail.com · Tundra96</div>
                    <div>Tenant: mechtrons28@gmail.com · Agbajs34</div>
                  </div>
                </div>
              </>
            )}

            {/* SIGNUP SUCCESS */}
            {view === "signup" && signupDone && (
              <div
                className="anim-up"
                style={{ textAlign: "center", paddingTop: 20 }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--greenpale)",
                    border: "1px solid rgba(26,122,74,.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    margin: "0 auto 20px",
                  }}
                >
                  ✓
                </div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 26,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 10,
                  }}
                >
                  Account Created!
                </h2>
                <p
                  style={{
                    color: "var(--sub)",
                    fontSize: 13.5,
                    lineHeight: 1.7,
                    marginBottom: 26,
                  }}
                >
                  Your landlord account has been created. Sign in to get
                  started.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setView("login");
                    setSignupDone(false);
                    setSf({
                      name: "",
                      email: "",
                      phone: "",
                      password: "",
                      confirm: "",
                    });
                  }}
                  style={{
                    padding: "13px 32px",
                    borderRadius: "var(--r-md)",
                    fontSize: 14,
                  }}
                >
                  Go to Sign In →
                </button>
              </div>
            )}

            {/* SIGNUP FORM */}
            {view === "signup" && !signupDone && (
              <>
                <h2 className="auth-heading">Create account</h2>
                <p className="auth-sub">
                  Register as a landlord to manage your properties.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                    marginBottom: 16,
                  }}
                >
                  {[
                    ["Full Name", "name", "text", "Chief Emeka Okafor"],
                    ["Email Address", "email", "email", "your@email.com"],
                    ["Phone Number", "phone", "tel", "080XXXXXXXX"],
                    ["Password", "password", "password", "Min. 6 characters"],
                    [
                      "Confirm Password",
                      "confirm",
                      "password",
                      "Repeat password",
                    ],
                  ].map(([lbl, k, type, ph]) => (
                    <div key={k}>
                      <Lbl>{lbl}</Lbl>
                      <input
                        className="field"
                        type={type}
                        value={sf[k]}
                        onChange={(e) =>
                          setSf((p) => ({ ...p, [k]: e.target.value }))
                        }
                        placeholder={ph}
                        inputMode={
                          type === "email"
                            ? "email"
                            : type === "tel"
                            ? "tel"
                            : undefined
                        }
                        autoComplete={
                          type === "password"
                            ? "new-password"
                            : type === "email"
                            ? "email"
                            : "off"
                        }
                      />
                    </div>
                  ))}
                </div>
                <ErrBox msg={err} />
                <button
                  className="btn-primary auth-btn"
                  onClick={doSignup}
                  disabled={busy}
                >
                  {busy ? <Spinner /> : "Create Landlord Account →"}
                </button>
                <div style={{ marginTop: 16, textAlign: "center" }}>
                  <button
                    onClick={() => {
                      setView("login");
                      setErr("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--sub)",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Base layout ── */
        .auth-topbar {
          display: none;
        }
        .auth-root {
          min-height: 100vh;
          display: flex;
          background: var(--bg0);
        }
        .auth-left {
          width: 460px;
          flex-shrink: 0;
          background: var(--bg1);
          border-right: 1px solid var(--br);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 48px;
          position: relative;
          overflow: hidden;
        }
        .auth-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }
        .auth-form {
          width: 100%;
          max-width: 420px;
        }
        .auth-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 4px;
        }
        .auth-sub {
          color: var(--sub);
          font-size: 13.5px;
          margin-bottom: 26px;
        }
        .auth-btn {
          width: 100%;
          padding: 14px 0;
          border-radius: var(--r-md);
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* ── Tablet ── */
        @media (max-width: 900px) {
          .auth-left { width: 360px; padding: 40px 32px; }
        }

        /* ── Mobile ── */
        @media (max-width: 680px) {
          /* Show sticky top bar */
          .auth-topbar {
            display: flex;
            align-items: center;
            padding: 14px 20px;
            background: var(--bg1);
            border-bottom: 1px solid var(--br);
            position: sticky;
            top: 0;
            z-index: 20;
          }

          /* Stack: form on top, left panel below */
          .auth-root { flex-direction: column; }

          /* Form panel — full width, no centering */
          .auth-right {
            flex: unset;
            width: 100%;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 28px 20px 36px;
          }
          .auth-form { max-width: 100%; }

          /* Left panel — full width, below the form */
          .auth-left {
            width: 100% !important;
            flex-shrink: unset;
            border-right: none;
            border-top: 1px solid var(--br);
            padding: 32px 20px 48px;
            /* Hide the big heading/paragraph — keep only the feature list */
          }
          /* Hide only the logo block on mobile
             (logo is already in the topbar) */
          .auth-left-logo { display: none !important; }

          /* Keep hero text visible on mobile */
          .auth-left-hero h1 { font-size: 32px !important; margin-bottom: 12px !important; }
          .auth-left-hero p { font-size: 13.5px !important; max-width: 100% !important; }

          /* Show "What's included" label on mobile */
          .auth-features-label { display: block !important; margin-bottom: 16px !important; }

          /* Feature list gets a 2-column grid on mobile */
          .auth-left-features {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 10px 16px;
          }

          /* Headings slightly smaller */
          .auth-heading { font-size: 24px !important; }
          .auth-sub { font-size: 13px !important; margin-bottom: 22px !important; }

          /* Prevent iOS zoom — font-size must be >= 16px */
          .field {
            font-size: 16px !important;
            padding: 13px 14px !important;
          }

          /* Bigger tap target on submit */
          .auth-btn {
            padding: 15px 0 !important;
            font-size: 15px !important;
          }

          /* Demo credentials — wrap mono text */
          .auth-form [style*="DM Mono"] div {
            word-break: break-all;
            font-size: 10.5px !important;
          }
        }

        /* ── Very small phones ── */
        @media (max-width: 380px) {
          .auth-right { padding: 22px 16px 52px; }
          .auth-heading { font-size: 22px !important; }
        }
      `}</style>
    </>
  );
}

// import { useState } from "react";
// import { EstateLogo, Lbl } from "../components/UI";

// export function genOTP() {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   let out = "";
//   for (let i = 0; i < 8; i++)
//     out += chars[Math.floor(Math.random() * chars.length)];
//   return out;
// }

// export default function Auth({
//   landlords,
//   setLandlords,
//   tenants,
//   setTenants,
//   managers,
//   setManagers,
//   onLogin,
// }) {
//   const [view, setView] = useState("login");
//   const [email, setEmail] = useState("");
//   const [pass, setPass] = useState("");
//   const [err, setErr] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [otpUser, setOtpUser] = useState(null);
//   const [newPass, setNewPass] = useState("");
//   const [newPass2, setNewPass2] = useState("");
//   const [sf, setSf] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirm: "",
//   });
//   const [signupDone, setSignupDone] = useState(false);

//   const go = async () => {
//     setErr("");
//     setBusy(true);
//     try {
//       const data = await new Promise((resolve, reject) => {
//         Visualforce.remoting.Manager.invokeAction(
//           "EstateController.login",
//           email,
//           pass,
//           function (result, event) {
//             if (event.status) resolve(result);
//             else reject(event.message);
//           }
//         );
//       });
//       if (data.success) {
//         const role = (data.role || "tenant").toLowerCase();
//         const userObj = {
//           id: data.user.Id,
//           name: data.user.Name,
//           email: data.user.Email__c,
//           phone: data.user.Phone__c,
//           accountId: data.user.Account__c,
//           contactId: data.user.Contact__c,
//           bankName: data.user.Bank_Name__c,
//           accountName: data.user.Account_Name__c,
//           accountNumber: data.user.Account_Number__c,
//           type: role,
//           subaccounts: data.subaccounts || [],
//         };
//         onLogin(userObj);
//       } else {
//         setErr(data.message || "Invalid login.");
//       }
//     } catch (e) {
//       console.error(e);
//       setErr("Login failed.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const commitNewPass = () => {
//     if (newPass.length < 6)
//       return setErr("Password must be at least 6 characters.");
//     if (newPass !== newPass2) return setErr("Passwords do not match.");
//     if (otpUser.type === "manager") {
//       setManagers((ms) =>
//         ms.map((m) =>
//           m.id === otpUser.id ? { ...m, password: newPass, otpUsed: true } : m
//         )
//       );
//     } else {
//       setTenants((ts) =>
//         ts.map((t) =>
//           t.id === otpUser.id ? { ...t, password: newPass, otpUsed: true } : t
//         )
//       );
//     }
//     onLogin({ ...otpUser, password: newPass, otpUsed: true });
//   };

//   const doSignup = async () => {
//     if (!sf.name || !sf.email || !sf.phone || !sf.password)
//       return setErr("All fields are required.");
//     if (sf.password !== sf.confirm) return setErr("Passwords do not match.");
//     if (sf.password.length < 6)
//       return setErr("Password must be at least 6 characters.");
//     setBusy(true);
//     setErr("");
//     try {
//       const data = await new Promise((resolve, reject) => {
//         Visualforce.remoting.Manager.invokeAction(
//           "EstateController.createLandlord",
//           sf.name,
//           sf.email,
//           sf.phone,
//           sf.password,
//           function (result, event) {
//             if (event.status) resolve(result);
//             else reject(event.message);
//           }
//         );
//       });
//       if (data.success) {
//         setSignupDone(true);
//         setSf({ name: "", email: "", phone: "", password: "", confirm: "" });
//       } else {
//         setErr(data.message || "Signup failed.");
//       }
//     } catch (e) {
//       console.error(e);
//       setErr("Error creating account.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   const ErrBox = ({ msg }) =>
//     !msg ? null : (
//       <div
//         style={{
//           background: "var(--redpale)",
//           border: "1px solid rgba(192,57,43,.2)",
//           borderRadius: "var(--r-sm)",
//           padding: "10px 13px",
//           color: "var(--red)",
//           fontSize: 12.5,
//           marginBottom: 14,
//           display: "flex",
//           gap: 7,
//           alignItems: "center",
//         }}
//       >
//         ⚠ {msg}
//       </div>
//     );

//   const Spinner = () => (
//     <span
//       style={{
//         width: 16,
//         height: 16,
//         border: "2px solid #fff",
//         borderTopColor: "transparent",
//         borderRadius: "50%",
//         animation: "spin .7s linear infinite",
//         display: "inline-block",
//       }}
//     />
//   );

//   // ── OTP set-password screen (unchanged) ──
//   if (otpUser) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           background: "var(--bg0)",
//           padding: "20px 16px",
//         }}
//       >
//         <div
//           className="anim-up card"
//           style={{ width: "100%", maxWidth: 420, padding: "32px 24px" }}
//         >
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//               marginBottom: 24,
//             }}
//           >
//             <EstateLogo size={32} />
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontSize: 15,
//                   fontWeight: 700,
//                   color: "var(--text)",
//                 }}
//               >
//                 Mechtron Estate
//               </div>
//               <div
//                 style={{
//                   fontSize: 10,
//                   color: "var(--dim)",
//                   textTransform: "uppercase",
//                   letterSpacing: 1.2,
//                 }}
//               >
//                 Set your password
//               </div>
//             </div>
//           </div>
//           <div
//             style={{
//               background: "var(--bluepale)",
//               border: "1px solid rgba(26,82,118,.18)",
//               borderRadius: "var(--r-md)",
//               padding: "12px 14px",
//               marginBottom: 20,
//               fontSize: 13,
//               color: "var(--blue)",
//               lineHeight: 1.6,
//             }}
//           >
//             👋 Welcome, <strong>{otpUser.name.split(" ")[0]}</strong>! You
//             signed in with a one-time password. Please set a permanent password
//             to continue.
//           </div>
//           <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
//             <div>
//               <Lbl>New Password</Lbl>
//               <input
//                 className="field"
//                 type="password"
//                 value={newPass}
//                 onChange={(e) => setNewPass(e.target.value)}
//                 placeholder="Min. 6 characters"
//               />
//             </div>
//             <div>
//               <Lbl>Confirm Password</Lbl>
//               <input
//                 className="field"
//                 type="password"
//                 value={newPass2}
//                 onChange={(e) => setNewPass2(e.target.value)}
//                 placeholder="Repeat password"
//                 onKeyDown={(e) => e.key === "Enter" && commitNewPass()}
//               />
//             </div>
//           </div>
//           <div style={{ marginTop: 12 }}>
//             <ErrBox msg={err} />
//           </div>
//           <button
//             className="btn-primary"
//             onClick={commitNewPass}
//             style={{
//               width: "100%",
//               marginTop: 6,
//               padding: "14px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 15,
//             }}
//           >
//             Set Password & Continue →
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ── Main Auth Layout ─────────────────────────────────────────────────────
//   const FeatureCard = ({ icon, title, description }) => (
//     <div className="auth-feature-card">
//       <div className="auth-feature-icon">{icon}</div>
//       <div className="auth-feature-title">{title}</div>
//       <div className="auth-feature-desc">{description}</div>
//     </div>
//   );

//   return (
//     <>
//       {/* Mobile top bar */}
//       <div className="auth-topbar">
//         <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
//           <EstateLogo size={26} />
//           <div>
//             <div
//               style={{
//                 fontFamily: "'Cormorant Garamond',serif",
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "var(--text)",
//               }}
//             >
//               Mechtron
//             </div>
//             <div
//               style={{
//                 fontSize: 9,
//                 color: "var(--sub)",
//                 letterSpacing: 1.4,
//                 textTransform: "uppercase",
//               }}
//             >
//               Estate Management
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="auth-root">
//         {/* Left panel – marketing content with feature cards */}
//         <div className="auth-left">
//           <div className="auth-left-content">
//             <div className="auth-left-logo">
//               <EstateLogo size={44} />
//               <div>
//                 <div className="auth-left-brand">Mechtron</div>
//                 <div className="auth-left-sub">Estate Management</div>
//               </div>
//             </div>
//             <h1 className="auth-left-hero-title">
//               Smart Real Estate Management
//             </h1>
//             <p className="auth-left-hero-desc">
//               Manage your properties, tenants, payments and service requests
//               from one powerful platform.
//             </p>

//             <div className="auth-features-grid">
//               <FeatureCard
//                 icon="🏢"
//                 title="PROPERTIES"
//                 description="Manage all your properties"
//               />
//               <FeatureCard
//                 icon="👥"
//                 title="TENANTS"
//                 description="Organize and manage your tenants"
//               />
//               <FeatureCard
//                 icon="💰"
//                 title="PAYMENTS"
//                 description="Track payments and financials"
//               />
//             </div>

//             <div className="auth-left-footer">
//               Secure. Reliable. Built for Property Owners.
//             </div>
//           </div>
//         </div>

//         {/* Right panel – form (login / signup) */}
//         <div className="auth-right">
//           <div className="auth-form anim-up d2">
//             {view === "login" && (
//               <>
//                 <h2 className="auth-heading">Sign in</h2>
//                 <p className="auth-sub">
//                   Welcome back — enter your credentials to continue.
//                 </p>
//                 <div className="auth-fields">
//                   <div>
//                     <Lbl>Email address</Lbl>
//                     <input
//                       className="field"
//                       type="email"
//                       inputMode="email"
//                       autoComplete="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       placeholder="your@email.com"
//                     />
//                   </div>
//                   <div>
//                     <Lbl>Password</Lbl>
//                     <input
//                       className="field"
//                       type="password"
//                       autoComplete="current-password"
//                       value={pass}
//                       onChange={(e) => setPass(e.target.value)}
//                       placeholder="••••••••"
//                       onKeyDown={(e) => e.key === "Enter" && go()}
//                     />
//                   </div>
//                 </div>
//                 <ErrBox msg={err} />
//                 <button
//                   className="btn-primary auth-btn"
//                   onClick={go}
//                   disabled={busy}
//                 >
//                   {busy ? <Spinner /> : "Sign In →"}
//                 </button>
//                 <div className="auth-switch">
//                   <span style={{ color: "var(--sub)", fontSize: 13 }}>
//                     Landlord or house agent?{" "}
//                   </span>
//                   <button
//                     onClick={() => {
//                       setView("signup");
//                       setErr("");
//                     }}
//                     className="auth-switch-link"
//                   >
//                     Create an account →
//                   </button>
//                 </div>
//                 <div className="auth-demo">
//                   <Lbl style={{ marginBottom: 6 }}>Demo credentials</Lbl>
//                   <div className="auth-demo-text">
//                     <div>Landlord: emekaokafor@gmail.com · Emeka34</div>
//                     <div>Manager: mechtrondispatcher@gmail.com · Tundra96</div>
//                     <div>Tenant: mechtrons28@gmail.com · Agbajs34</div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {view === "signup" && signupDone && (
//               <div className="auth-success">
//                 <div className="auth-success-icon">✓</div>
//                 <h2 className="auth-success-title">Account Created!</h2>
//                 <p className="auth-success-desc">
//                   Your landlord account has been created. Sign in to get
//                   started.
//                 </p>
//                 <button
//                   className="btn-primary"
//                   onClick={() => {
//                     setView("login");
//                     setSignupDone(false);
//                     setSf({
//                       name: "",
//                       email: "",
//                       phone: "",
//                       password: "",
//                       confirm: "",
//                     });
//                   }}
//                 >
//                   Go to Sign In →
//                 </button>
//               </div>
//             )}

//             {view === "signup" && !signupDone && (
//               <>
//                 <h2 className="auth-heading">Create Your Landlord Account</h2>
//                 <p className="auth-sub">
//                   Join hundreds of property owners already using Mechtron Estate
//                 </p>
//                 <div className="auth-fields">
//                   <div>
//                     <Lbl>Full Name</Lbl>
//                     <input
//                       className="field"
//                       type="text"
//                       value={sf.name}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, name: e.target.value }))
//                       }
//                       placeholder="Enter your full name"
//                     />
//                   </div>
//                   <div>
//                     <Lbl>Email Address</Lbl>
//                     <input
//                       className="field"
//                       type="email"
//                       inputMode="email"
//                       autoComplete="email"
//                       value={sf.email}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, email: e.target.value }))
//                       }
//                       placeholder="Enter your email address"
//                     />
//                   </div>
//                   <div>
//                     <Lbl>Phone Number</Lbl>
//                     <input
//                       className="field"
//                       type="tel"
//                       inputMode="tel"
//                       autoComplete="tel"
//                       value={sf.phone}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, phone: e.target.value }))
//                       }
//                       placeholder="Enter your phone number"
//                     />
//                   </div>
//                   <div>
//                     <Lbl>Password</Lbl>
//                     <input
//                       className="field"
//                       type="password"
//                       autoComplete="new-password"
//                       value={sf.password}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, password: e.target.value }))
//                       }
//                       placeholder="Create a password"
//                     />
//                   </div>
//                   <div>
//                     <Lbl>Confirm Password</Lbl>
//                     <input
//                       className="field"
//                       type="password"
//                       value={sf.confirm}
//                       onChange={(e) =>
//                         setSf((p) => ({ ...p, confirm: e.target.value }))
//                       }
//                       placeholder="Confirm your password"
//                     />
//                   </div>
//                 </div>
//                 <ErrBox msg={err} />
//                 <button
//                   className="btn-primary auth-btn"
//                   onClick={doSignup}
//                   disabled={busy}
//                 >
//                   {busy ? <Spinner /> : "Create Account"}
//                 </button>
//                 <div className="auth-terms">
//                   By creating an account, you agree to our{" "}
//                   <button className="auth-link">Terms of Service</button> and{" "}
//                   <button className="auth-link">Privacy Policy</button>.
//                 </div>
//                 <div className="auth-or">
//                   <span>OR</span>
//                 </div>
//                 <button className="auth-google">
//                   <svg width="20" height="20" viewBox="0 0 24 24">
//                     <path
//                       fill="currentColor"
//                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                     />
//                     <path
//                       fill="currentColor"
//                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                     />
//                   </svg>
//                   Continue with Google
//                 </button>
//                 <div className="auth-signin-redirect">
//                   Already have an account?{" "}
//                   <button
//                     onClick={() => {
//                       setView("login");
//                       setErr("");
//                     }}
//                     className="auth-link"
//                   >
//                     Sign in
//                   </button>
//                 </div>
//                 <div className="auth-copyright">
//                   © 2025 Mechtron. All rights reserved.
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       <style>{`
//         /* ── Base layout ── */
//         .auth-topbar {
//           display: none;
//         }
//         .auth-root {
//           min-height: 100vh;
//           display: flex;
//           background: var(--bg0);
//         }
//         .auth-left {
//           width: 520px;
//           flex-shrink: 0;
//           background: var(--bg1);
//           border-right: 1px solid var(--br);
//           display: flex;
//           flex-direction: column;
//           position: relative;
//           overflow-y: auto;
//         }
//         .auth-left-content {
//           padding: 52px 48px;
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           justify-content: space-between;
//         }
//         .auth-left-logo {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 48px;
//         }
//         .auth-left-brand {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 20px;
//           font-weight: 700;
//           color: var(--text);
//           line-height: 1.1;
//         }
//         .auth-left-sub {
//           font-size: 10px;
//           color: var(--sub);
//           letter-spacing: 1.8px;
//           text-transform: uppercase;
//           font-weight: 600;
//         }
//         .auth-left-hero-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 42px;
//           font-weight: 500;
//           color: var(--text);
//           line-height: 1.15;
//           margin-bottom: 18px;
//         }
//         .auth-left-hero-desc {
//           color: var(--sub);
//           font-size: 15px;
//           line-height: 1.7;
//           max-width: 380px;
//           margin-bottom: 42px;
//         }
//         .auth-features-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           margin-bottom: 48px;
//         }
//         .auth-feature-card {
//           background: var(--bg2);
//           border-radius: var(--r-md);
//           padding: 20px 16px;
//           border: 1px solid var(--br);
//           text-align: center;
//           transition: all 0.2s;
//         }
//         .auth-feature-icon {
//           font-size: 32px;
//           margin-bottom: 12px;
//         }
//         .auth-feature-title {
//           font-weight: 700;
//           font-size: 14px;
//           color: var(--text);
//           margin-bottom: 6px;
//           letter-spacing: 0.5px;
//         }
//         .auth-feature-desc {
//           font-size: 12px;
//           color: var(--dim);
//           line-height: 1.4;
//         }
//         .auth-left-footer {
//           font-size: 13px;
//           color: var(--dim);
//           text-align: center;
//           border-top: 1px solid var(--br);
//           padding-top: 28px;
//           margin-top: auto;
//         }

//         .auth-right {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 40px 32px;
//         }
//         .auth-form {
//           width: 100%;
//           max-width: 480px;
//         }
//         .auth-heading {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 32px;
//           font-weight: 600;
//           color: var(--text);
//           margin-bottom: 8px;
//         }
//         .auth-sub {
//           color: var(--sub);
//           font-size: 14px;
//           margin-bottom: 28px;
//         }
//         .auth-fields {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           margin-bottom: 20px;
//         }
//         .auth-btn {
//           width: 100%;
//           padding: 14px 0;
//           border-radius: var(--r-md);
//           font-size: 16px;
//           font-weight: 600;
//           background: var(--gold);
//           color: #000;
//           border: none;
//           cursor: pointer;
//           transition: background 0.2s;
//         }
//         .auth-btn:hover:not(:disabled) {
//           background: #a47c1a;
//         }
//         .auth-switch {
//           margin-top: 20px;
//           text-align: center;
//         }
//         .auth-switch-link {
//           background: none;
//           border: none;
//           color: var(--gold);
//           font-weight: 600;
//           font-size: 13px;
//           cursor: pointer;
//         }
//         .auth-demo {
//           margin-top: 24px;
//           padding: 16px 18px;
//           background: var(--bg2);
//           border-radius: var(--r-md);
//           border: 1px solid var(--br);
//         }
//         .auth-demo-text {
//           font-family: 'DM Mono', monospace;
//           font-size: 11px;
//           color: var(--dim);
//           line-height: 2;
//         }
//         .auth-terms {
//           font-size: 12px;
//           color: var(--sub);
//           text-align: center;
//           margin: 20px 0 16px;
//         }
//         .auth-or {
//           text-align: center;
//           position: relative;
//           margin: 16px 0;
//         }
//         .auth-or span {
//           background: var(--bg);
//           padding: 0 12px;
//           color: var(--dim);
//           font-size: 12px;
//         }
//         .auth-or::before {
//           content: "";
//           position: absolute;
//           top: 50%;
//           left: 0;
//           right: 0;
//           height: 1px;
//           background: var(--br);
//           z-index: 0;
//         }
//         .auth-google {
//           width: 100%;
//           padding: 12px;
//           border-radius: var(--r-md);
//           background: var(--bg1);
//           border: 1px solid var(--br);
//           color: var(--text);
//           font-size: 14px;
//           font-weight: 500;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 10px;
//           cursor: pointer;
//           transition: background 0.2s;
//         }
//         .auth-google:hover {
//           background: var(--bg2);
//         }
//         .auth-signin-redirect {
//           text-align: center;
//           margin: 20px 0 16px;
//           font-size: 13px;
//           color: var(--sub);
//         }
//         .auth-link {
//           background: none;
//           border: none;
//           color: var(--gold);
//           font-weight: 600;
//           cursor: pointer;
//           text-decoration: underline;
//         }
//         .auth-copyright {
//           text-align: center;
//           font-size: 11px;
//           color: var(--dim);
//           margin-top: 32px;
//         }
//         .auth-success {
//           text-align: center;
//           padding: 20px 0;
//         }
//         .auth-success-icon {
//           width: 72px;
//           height: 72px;
//           border-radius: 50%;
//           background: var(--greenpale);
//           border: 1px solid rgba(26,122,74,.3);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 36px;
//           margin: 0 auto 20px;
//         }
//         .auth-success-title {
//           font-family: 'Cormorant Garamond', serif;
//           font-size: 28px;
//           font-weight: 600;
//           margin-bottom: 12px;
//         }
//         .auth-success-desc {
//           color: var(--sub);
//           font-size: 14px;
//           line-height: 1.6;
//           margin-bottom: 28px;
//         }

//         /* ── Tablet ── */
//         @media (max-width: 950px) {
//           .auth-left { width: 420px; }
//           .auth-left-content { padding: 40px 32px; }
//           .auth-left-hero-title { font-size: 34px; }
//           .auth-heading { font-size: 28px; }
//         }

//         /* ── Mobile (≤ 680px) ── */
//         @media (max-width: 680px) {
//           .auth-topbar {
//             display: flex;
//             align-items: center;
//             padding: 14px 20px;
//             background: var(--bg1);
//             border-bottom: 1px solid var(--br);
//             position: sticky;
//             top: 0;
//             z-index: 20;
//           }
//           .auth-root {
//             flex-direction: column;
//           }
//           .auth-right {
//             flex: none;
//             width: 100%;
//             padding: 28px 20px 36px;
//           }
//           .auth-form {
//             max-width: 100%;
//           }
//           .auth-left {
//             width: 100%;
//             border-right: none;
//             border-top: 1px solid var(--br);
//           }
//           .auth-left-logo {
//             display: none;
//           }
//           .auth-left-content {
//             padding: 32px 20px 48px;
//           }
//           .auth-left-hero-title {
//             font-size: 28px;
//             margin-bottom: 12px;
//           }
//           .auth-left-hero-desc {
//             font-size: 14px;
//             margin-bottom: 32px;
//           }
//           .auth-features-grid {
//             grid-template-columns: 1fr;
//             gap: 12px;
//             margin-bottom: 32px;
//           }
//           .auth-feature-card {
//             display: flex;
//             align-items: center;
//             text-align: left;
//             gap: 16px;
//             padding: 14px 16px;
//           }
//           .auth-feature-icon {
//             font-size: 28px;
//             margin-bottom: 0;
//           }
//           .auth-feature-title {
//             margin-bottom: 2px;
//           }
//           .auth-feature-desc {
//             font-size: 11px;
//           }
//           .auth-left-footer {
//             padding-top: 20px;
//             font-size: 12px;
//           }
//           .auth-heading {
//             font-size: 24px;
//           }
//           .field {
//             font-size: 16px !important;
//             padding: 13px 14px !important;
//           }
//           .auth-btn {
//             padding: 15px 0 !important;
//           }
//         }

//         /* Animations */
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </>
//   );
// }
