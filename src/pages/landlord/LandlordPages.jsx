// import { SelectField } from "../../components/UI";
import { useState, useEffect } from "react";
import {
  Tag,
  Avatar,
  Lbl,
  Field,
  Modal,
  PageTitle,
  RichTextEditor,
  SelectField,
} from "../../components/UI";
import { fmt, TODAY, daysUntil } from "../../utils";
import { ALL_SERVICES } from "../../data/constants";
import { genOTP } from "../Auth";

/* ── Overview ── */
// export function LLOverview({
//   me,
//   myProps,
//   tenants,
//   setTenants,
//   tab,
//   setTab,
//   // myTenants,
//   // setMyTenants, // ← ADD THIS
//   myPayments,
//   myAdminPays,
//   properties,
//   setProperties,
// }) {
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if mobile on mount and on resize
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   const revenue = myPayments
//     .filter((p) => p.status === "confirmed")
//     .reduce((a, p) => a + p.amount, 0);

//   return (
//     <div>
//       <div className="anim-up" style={{ marginBottom: 28 }}>
//         <h2
//           style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: isMobile ? 22 : 28,
//             fontWeight: 600,
//             color: "var(--text)",
//             marginBottom: 3,
//           }}
//         >
//           Welcome,{" "}
//           <span className="gold-static">
//             {me.name?.split(" ").slice(-1)[0] || "User"}
//           </span>
//         </h2>
//         <p style={{ color: "var(--sub)", fontSize: isMobile ? 12.5 : 13.5 }}>
//           Your estate overview · Full access
//         </p>
//       </div>

//       {/* Responsive Grid - 1 column on mobile, 3 columns on desktop */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
//           gap: isMobile ? 12 : 16,
//           marginBottom: 26,
//           paddingLeft: isMobile ? 0 : 0,
//           paddingRight: isMobile ? 0 : 0,
//         }}
//       >
//         {[
//           {
//             label: "Properties",
//             val: properties.length,
//             icon: "🏢",
//             accent: "var(--gold)",
//           },
//           {
//             label: "Tenants",
//             val: tenants.length,
//             icon: "👥",
//             accent: "var(--blue)",
//           },
//           // {
//           //   label: "Revenue Confirmed",
//           //   val: `₦${(revenue / 1000000).toFixed(2)}M`,
//           //   icon: "💰",
//           //   accent: "var(--green)",
//           // },
//         ].map(({ label, val, accent }, i) => (
//           <div
//             key={i}
//             className="card anim-up"
//             style={{
//               padding: isMobile ? 18 : 22,
//               position: "relative",
//               overflow: "hidden",
//               animationDelay: `${i * 0.06}s`,
//             }}
//           >
//             <div
//               style={{
//                 position: "absolute",
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: 2,
//                 background: `linear-gradient(90deg,transparent,${accent},transparent)`,
//               }}
//             />
//             <Lbl>{label}</Lbl>
//             <div
//               style={{
//                 fontFamily: "'DM Mono',monospace",
//                 fontSize: isMobile ? 22 : 26,
//                 fontWeight: 500,
//                 color: "var(--text)",
//                 lineHeight: 1.1,
//                 marginBottom: 5,
//               }}
//             >
//               {val}
//             </div>
//           </div>
//         ))}
//       </div>

//       {myAdminPays.length > 0 && (
//         <div
//           className="card anim-up d2"
//           style={{ padding: isMobile ? 18 : 22 }}
//         >
//           <div
//             style={{
//               fontFamily: "'Cormorant Garamond',serif",
//               fontSize: isMobile ? 15 : 16,
//               fontWeight: 600,
//               color: "var(--text)",
//               marginBottom: 16,
//             }}
//           >
//             Admin Payments
//           </div>
//           {myAdminPays.map((p, i, a) => (
//             <div
//               key={p.id}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 padding: "9px 0",
//                 borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none",
//                 flexWrap: isMobile ? "wrap" : "nowrap",
//                 gap: isMobile ? 8 : 0,
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontSize: isMobile ? 12 : 13,
//                     fontWeight: 500,
//                     color: "var(--text)",
//                   }}
//                 >
//                   {p.period}
//                 </div>
//                 <div
//                   style={{
//                     fontSize: isMobile ? 10.5 : 11.5,
//                     color: "var(--dim)",
//                   }}
//                 >
//                   {p.date}
//                   {p.note && ` · ${p.note}`}
//                 </div>
//               </div>
//               <span
//                 style={{
//                   fontFamily: "'DM Mono',monospace",
//                   fontWeight: 600,
//                   fontSize: isMobile ? 12 : 14,
//                   color: "var(--text)",
//                 }}
//               >
//                 {fmt(p.amount)}
//               </span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export function LLOverview({
  me,
  myProps,
  tenants,
  setTenants,
  tab,
  setTab,
  // myTenants,
  // setMyTenants, // ← ADD THIS
  myPayments,
  myAdminPays,
  properties,
  setProperties,
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
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

  const revenue = myPayments
    .filter((p) => p.status === "confirmed")
    .reduce((a, p) => a + p.amount, 0);

  // Format revenue display
  const formatRevenue = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(2)}K`;
    }
    return `₦${amount.toFixed(2)}`;
  };

  return (
    <div>
      <div className="anim-up" style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 3,
          }}
        >
          Welcome,{" "}
          <span className="gold-static">
            {me.name?.split(" ").slice(-1)[0] || "User"}
          </span>
        </h2>
        <p style={{ color: "var(--sub)", fontSize: isMobile ? 12.5 : 13.5 }}>
          Your estate overview · Full access
        </p>
      </div>

      {/* Responsive Grid - 1 column on mobile, 3 columns on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          gap: isMobile ? 12 : 16,
          marginBottom: 26,
          paddingLeft: isMobile ? 0 : 0,
          paddingRight: isMobile ? 0 : 0,
        }}
      >
        {/* Properties Card */}
        <div
          className="card anim-up"
          style={{
            padding: isMobile ? 18 : 22,
            position: "relative",
            overflow: "hidden",
            animationDelay: `0.06s`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg,transparent,var(--gold),transparent)",
            }}
          />
          <Lbl>Properties</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: 5,
            }}
          >
            {properties.length}
          </div>
        </div>

        {/* Tenants Card */}
        <div
          className="card anim-up"
          style={{
            padding: isMobile ? 18 : 22,
            position: "relative",
            overflow: "hidden",
            animationDelay: `0.12s`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg,transparent,var(--blue),transparent)",
            }}
          />
          <Lbl>Tenants</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: 5,
            }}
          >
            {tenants.length}
          </div>
        </div>

        {/* Revenue Confirmed Card */}
        <div
          className="card-gold anim-up"
          style={{
            padding: isMobile ? 18 : 22,
            position: "relative",
            overflow: "hidden",
            animationDelay: `0.18s`,
            background:
              "linear-gradient(135deg, var(--goldpale) 0%, var(--bg) 100%)",
            border: "1px solid var(--gold)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg,transparent,var(--gold),transparent)",
            }}
          />
          <Lbl>Revenue Confirmed</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 700,
              color: "var(--gold)",
              lineHeight: 1.1,
              marginBottom: 5,
            }}
          >
            {formatRevenue(revenue)}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--dim)",
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>💰</span>
            <span>
              From {myPayments.filter((p) => p.status === "confirmed").length}{" "}
              payment(s)
            </span>
          </div>
        </div>
      </div>

      {myAdminPays.length > 0 && (
        <div
          className="card anim-up d2"
          style={{ padding: isMobile ? 18 : 22 }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: isMobile ? 15 : 16,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Admin Payments
          </div>
          {myAdminPays.map((p, i, a) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none",
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? 8 : 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 500,
                    color: "var(--text)",
                  }}
                >
                  {p.period}
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 10.5 : 11.5,
                    color: "var(--dim)",
                  }}
                >
                  {p.date}
                  {p.note && ` · ${p.note}`}
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontWeight: 600,
                  fontSize: isMobile ? 12 : 14,
                  color: "var(--text)",
                }}
              >
                {fmt(p.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// export function LLProperties({
//   properties = [],
//   setProperties,
//   tenants = [],
//   landlords = [],
//   tab,
//   setTab,
//   log,
//   me,
// }) {
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");
//   const [propTypes, setPropTypes] = useState([]);
//   const [propTypesLoading, setPropTypesLoading] = useState(true);
//   const [selectedProp, setSelectedProp] = useState(null);
//   const [showAdd, setShowAdd] = useState(false);
//   const [showAddUnit, setShowAddUnit] = useState(false);
//   const [editOpen, setEditOpen] = useState(false);
//   const [editUnit, setEditUnit] = useState(null);
//   const [loadingUnit, setLoadingUnit] = useState(false);
//   const [f, setF] = useState({
//     name: "",
//     type: "Flat / Apartment",
//     address: "",
//     unitCount: 1,
//     landSubtype: "plot",
//     landMeasurement: "",
//   });

//   const labelStyle = {
//     fontSize: 12,
//     color: "var(--sub)",
//     marginBottom: 4,
//     display: "block",
//   };

//   const inputStyle = {
//     width: "100%",
//     padding: "10px",
//     borderRadius: 8,
//     border: "1px solid #ddd",
//     outline: "none",
//     background: "var(--bg2)",
//   };

//   const textBoxStyle = {
//     width: "100%",
//     padding: "10px",
//     borderRadius: 8,
//     height: 500,
//     border: "1px solid #ddd",
//     outline: "none",
//     background: "var(--bg2)",
//   };

//   const [propertiesLoading, setPropertiesLoading] = useState(true);
//   const [uploadedImages, setUploadedImages] = useState([]); // Array of { url, publicId, file }
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   //const [tenantsLoading, setTenantsLoading] = useState(true);

//   const loadProperties = () => {
//     if (!me?.id) return;
//     setPropertiesLoading(true);
//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getProperties",
//       me.id,
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
//           setProperties(mapped);
//         } else {
//           console.error("Failed to load Properties:", event?.message);
//           setProperties([]);
//         }
//         setPropertiesLoading(false);
//       },
//       { escape: false }
//     );
//   };

//   // Initial load on mount or when me.id changes
//   useEffect(() => {
//     loadProperties();
//   }, [me?.id]);

//   const [unitF, setUnitF] = useState({ label: "", measurement: "" });

//   const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

//   const saveUnit = () => {
//     if (!editUnit?.id) return;

//     setBusy(true);
//     setErr("");

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.upUnit",
//       editUnit.id,
//       editUnit.type,
//       parseFloat(editUnit.annualFee || 0),
//       parseFloat(editUnit.agreementFee || 0),
//       parseFloat(editUnit.agentFee || 0),
//       parseFloat(editUnit.cautionFee || 0),
//       parseFloat(editUnit.maintenanceFee || 0),
//       parseFloat(editUnit.sanitationFee || 0),
//       parseFloat(editUnit.securityFee || 0),
//       function (result, event) {
//         if (event.status) {
//           const data = typeof result === "string" ? JSON.parse(result) : result;

//           if (data.success) {
//             console.log("✅ Unit updated");

//             // ✅ Update UI immediately
//             setProperties((prev) =>
//               prev.map((p) => ({
//                 ...p,
//                 units: (p.units || []).map((u) =>
//                   u.id === editUnit.id ? { ...editUnit } : u
//                 ),
//               }))
//             );

//             setEditOpen(false); // close modal
//           } else {
//             setErr(data.message);
//           }
//         } else {
//           setErr(event.message || "Update failed");
//         }

//         setBusy(false);
//       },
//       { escape: false }
//     );
//   };

//   const openEditModal = (unit) => {
//     setEditOpen(true);
//     setLoadingUnit(true);

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getUnitById",
//       unit.id || unit.Id,
//       function (result, event) {
//         if (event.status && result) {
//           setEditUnit({
//             id: result.Id,
//             label: result.Name,
//             type: result.Type__c,
//             annualFee: result.Annual_Fee__c,
//             agreementFee: result.Agreement_Fee__c,
//             agentFee: result.Agent_Fee__c,
//             cautionFee: result.Caution_Fee__c,
//             maintenanceFee: result.Maintenance_Fee__c,
//             securityFee: result.Security_Fee__c,
//             sanitationFee: result.Sanitation_Fee__c,
//           });
//         }
//         setLoadingUnit(false);
//       }
//     );
//   };
//   useEffect(() => {
//     console.log("📦 Properties received in LLProperties:", properties);
//   }, [properties]);

//   useEffect(() => {
//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getPropertyTypePicklist",
//       function (result, event) {
//         if (event.status && result) {
//           const mapped = result.map((r) => ({
//             value: r.value,
//             label: r.label,
//           }));
//           setPropTypes(mapped);
//         } else {
//           console.error("Failed to load property types:", event.message);
//         }
//         setPropTypesLoading(false);
//       },
//       { escape: false }
//     );
//   }, []);

//   // Loading state
//   if (!properties || properties.length === 0) {
//     return (
//       <div style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}>
//         Loading properties...
//       </div>
//     );
//   }

//   const landSubtypes = ["plot", "acre", "hectare"];

//   // const createProperty = async () => {
//   //   if (!f.name || !f.type || !f.address || !f.unitCount) {
//   //     setErr("Please fill all required fields.");
//   //     return;
//   //   }

//   //   console.log("Creating Property:", f);

//   //   setBusy(true);
//   //   setErr("");

//   //   try {
//   //     Visualforce.remoting.Manager.invokeAction(
//   //       "EstateController.createProperty",
//   //       f.name,
//   //       f.type,
//   //       me?.id,
//   //       f.address,
//   //       parseFloat(f.unitCount),
//   //       function (result, event) {
//   //         if (event.status) {
//   //           console.log("✅ Property created successfully");
//   //           setShowAdd(false);
//   //           setF({
//   //             name: "",
//   //             type: "Flat / Apartment",
//   //             address: "",
//   //             unitCount: 1,
//   //             landSubtype: "plot",
//   //             landMeasurement: "",
//   //           });
//   //           setErr("");
//   //         } else {
//   //           console.error("❌ Failed to create property:", event.message);
//   //           setErr(event.message || "Failed to create property");
//   //         }
//   //         setBusy(false);
//   //       },
//   //       { escape: false }
//   //     );
//   //   } catch (e) {
//   //     console.error("🔥 Error caught:", e);
//   //     setErr("An unexpected error occurred");
//   //     setBusy(false);
//   //   }
//   // };

//   const createProperty = async () => {
//     if (!f.name || !f.type || !f.address || !f.unitCount) {
//       setErr("Please fill all required fields.");
//       return;
//     }

//     setBusy(true);
//     setErr("");

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.createProperty",
//       f.name,
//       f.type,
//       me?.id,
//       f.address,
//       parseFloat(f.unitCount),
//       function (result, event) {
//         if (event.status) {
//           console.log("✅ Property created successfully");
//           setShowAdd(false);
//           setF({
//             name: "",
//             type: "Flat / Apartment",
//             address: "",
//             unitCount: 1,
//             landSubtype: "plot",
//             landMeasurement: "",
//           });
//           setErr("");
//           // ✅ Refresh the properties list after creation
//           loadProperties();
//         } else {
//           console.error("❌ Failed to create property:", event.message);
//           setErr(event.message || "Failed to create property");
//         }
//         setBusy(false);
//       },
//       { escape: false }
//     );
//   };

//   const addUnit = () => {
//     if (!unitF.label) return;
//     setProperties((ps) =>
//       ps.map((p) => {
//         if (p.id !== selectedProp.id) return p;
//         const newUnit = {
//           id: `UNIT_${Date.now()}`,
//           label: unitF.label,
//           status: "vacant",
//           measurement: unitF.measurement,
//         };
//         const updated = { ...p, units: [...(p.units || []), newUnit] };
//         setSelectedProp(updated);
//         return updated;
//       })
//     );
//     log(`Unit added to ${selectedProp.name}: ${unitF.label}`);
//     setShowAddUnit(false);
//     setUnitF({ label: "", measurement: "" });
//   };

//   const propIcon = (t) => {
//     if (!t) return "🏠";
//     const lower = t.toLowerCase();
//     return lower.includes("flat") || lower.includes("apartment")
//       ? "🏢"
//       : lower.includes("shop") || lower.includes("commercial")
//       ? "🏪"
//       : "🌱";
//   };

//   const getStatusColor = (status) => {
//     if (!status) return "var(--dim)";
//     const lower = status.toLowerCase();
//     if (lower === "occupied") return "#28a745";
//     if (lower === "vacant") return "#dc3545";
//     return "var(--dim)";
//   };

//   if (propertiesLoading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: 80,
//           color: "var(--dim)",
//           gap: 10,
//         }}
//       >
//         <span
//           style={{
//             width: 16,
//             height: 16,
//             border: "2px solid var(--br)",
//             borderTopColor: "var(--gold)",
//             borderRadius: "50%",
//             animation: "spin .7s linear infinite",
//             display: "inline-block",
//           }}
//         />
//         Loading Properties...
//       </div>
//     );
//   }

//   // If a property is selected, show detailed view
//   if (selectedProp) {
//     return (
//       <div>
//         <button
//           onClick={() => setSelectedProp(null)}
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//             background: "none",
//             border: "none",
//             cursor: "pointer",
//             color: "var(--gold)",
//             fontSize: 13,
//             fontWeight: 600,
//             marginBottom: 20,
//           }}
//         >
//           ← Back to properties
//         </button>
//         <div className="card" style={{ padding: 24 }}>
//           {/* Property Header */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               marginBottom: 24,
//               paddingBottom: 20,
//               borderBottom: "1px solid var(--br)",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond', serif",
//                   fontSize: 28,
//                   fontWeight: 700,
//                   color: "var(--text)",
//                   marginBottom: 6,
//                 }}
//               >
//                 {selectedProp.name}
//               </div>
//               <div style={{ fontSize: 13, color: "var(--sub)" }}>
//                 {selectedProp.address}
//               </div>
//             </div>
//             <button
//               className="btn-primary"
//               onClick={() => setShowAddUnit(true)}
//               style={{
//                 padding: "8px 16px",
//                 borderRadius: "var(--r-sm)",
//                 fontSize: 13,
//               }}
//             >
//               + Add Unit
//             </button>
//           </div>

//           {/* Property Stats */}
//           <div
//             style={{
//               display: "flex",
//               gap: 20,
//               marginBottom: 24,
//               paddingBottom: 20,
//               borderBottom: "1px solid var(--br)",
//             }}
//           >
//             <div>
//               <div
//                 style={{
//                   fontSize: 11,
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                   color: "var(--dim)",
//                   marginBottom: 4,
//                 }}
//               >
//                 TYPE
//               </div>
//               <div
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                 }}
//               >
//                 {selectedProp.type?.toUpperCase() || "PROPERTY"}
//               </div>
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontSize: 11,
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                   color: "var(--dim)",
//                   marginBottom: 4,
//                 }}
//               >
//                 TOTAL UNITS
//               </div>
//               <div
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                 }}
//               >
//                 {selectedProp.units?.length || 0}
//               </div>
//             </div>
//             <div>
//               <div
//                 style={{
//                   fontSize: 11,
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                   color: "var(--dim)",
//                   marginBottom: 4,
//                 }}
//               >
//                 OCCUPIED
//               </div>
//               <div
//                 style={{
//                   fontSize: 14,
//                   fontWeight: 600,
//                   color: "var(--text)",
//                 }}
//               >
//                 {
//                   (selectedProp.units || []).filter(
//                     (u) => u.status === "occupied"
//                   ).length
//                 }
//               </div>
//             </div>
//           </div>

//           <div>
//             <div
//               style={{
//                 fontSize: 13,
//                 fontWeight: 600,
//                 color: "var(--text)",
//                 marginBottom: 12,
//                 textTransform: "uppercase",
//                 letterSpacing: "0.5px",
//               }}
//             >
//               UNITS
//             </div>

//             <div
//               style={{
//                 maxHeight: 400,
//                 overflowY: "auto",
//                 paddingRight: 8,
//               }}
//             >
//               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                 {(selectedProp.units || []).map((unit) => (
//                   <div
//                     key={unit.id}
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       padding: "12px 16px",
//                       background: "var(--bg2)",
//                       borderRadius: "var(--r-sm)",
//                       border: "1px solid var(--br)",
//                       gap: 10,
//                     }}
//                   >
//                     {/* Left side */}
//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           fontSize: 14,
//                           fontWeight: 500,
//                           color: "var(--text)",
//                         }}
//                       >
//                         {unit.label}
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <span
//                       style={{
//                         fontSize: 12,
//                         fontWeight: 500,
//                         color: getStatusColor(unit.status),
//                         textTransform: "capitalize",
//                         minWidth: 70,
//                         textAlign: "right",
//                       }}
//                     >
//                       {unit.status || "vacant"}
//                     </span>

//                     {/* Edit Button */}
//                     <button
//                       onClick={() => {
//                         // setEditUnit(unit);
//                         // setEditOpen(true);
//                         openEditModal(unit); // ← replaces the two-linerss
//                       }}
//                       style={{
//                         marginLeft: 10,
//                         padding: "6px 10px",
//                         borderRadius: "var(--r-sm)",
//                         fontSize: 12,
//                         border: "1px solid var(--gold)",
//                         background: "transparent",
//                         color: "var(--gold)",
//                         cursor: "pointer",
//                         fontWeight: 600,
//                       }}
//                     >
//                       Edit
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add Unit Modal */}
//         <Modal
//           open={showAddUnit}
//           onClose={() => setShowAddUnit(false)}
//           title="Add Unit"
//         >
//           <div style={{ display: "grid", gap: 13 }}>
//             <Field
//               label="Unit Label"
//               value={unitF.label}
//               onChange={(e) =>
//                 setUnitF((p) => ({ ...p, label: e.target.value }))
//               }
//               span2
//               placeholder="e.g. Flat 5 / Shop 3 / Plot C"
//             />
//             {selectedProp?.type === "land" && (
//               <Field
//                 label="Measurement (optional)"
//                 value={unitF.measurement}
//                 onChange={(e) =>
//                   setUnitF((p) => ({ ...p, measurement: e.target.value }))
//                 }
//                 span2
//                 placeholder="e.g. 500 sqm"
//               />
//             )}
//           </div>
//           <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//             <button
//               className="btn-ghost"
//               onClick={() => setShowAddUnit(false)}
//               style={{
//                 flex: 1,
//                 padding: "10px 0",
//                 borderRadius: "var(--r-md)",
//                 fontSize: 13,
//               }}
//             >
//               Cancel
//             </button>
//             <button
//               className="btn-primary"
//               onClick={addUnit}
//               style={{
//                 flex: 2,
//                 padding: "10px 0",
//                 borderRadius: "var(--r-md)",
//                 fontSize: 13,
//               }}
//             >
//               Add Unit
//             </button>
//           </div>
//         </Modal>
//         <Modal
//           open={editOpen}
//           onClose={() => {
//             setEditOpen(false);
//             setEditUnit(null);
//           }}
//           title={`Edit ${editUnit?.label || "Unit"}`}
//         >
//           {loadingUnit ? (
//             <div
//               style={{
//                 padding: 20,
//                 textAlign: "center",
//                 color: "var(--sub)",
//                 fontSize: 13,
//               }}
//             >
//               Loading unit...
//             </div>
//           ) : editUnit ? (
//             <div style={{ display: "grid", gap: 14 }}>
//               {/* Error */}
//               {err && (
//                 <div
//                   style={{
//                     background: "rgba(220, 53, 69, 0.1)",
//                     color: "#dc3545",
//                     padding: 10,
//                     borderRadius: "var(--r-sm)",
//                     fontSize: 13,
//                   }}
//                 >
//                   {err}
//                 </div>
//               )}

//               {/* TYPE */}
//               <div>
//                 <label style={labelStyle}>Type</label>
//                 <select
//                   value={editUnit.type || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({ ...p, type: e.target.value }))
//                   }
//                   style={inputStyle}
//                 >
//                   <option value="">Select a type</option>
//                   <option value="Shop">Shop</option>
//                   <option value="Two Bedroom">Two Bedroom</option>
//                   <option value="Three Bedroom">Three Bedroom</option>
//                 </select>
//               </div>

//               {/* ANNUAL FEE */}
//               <div>
//                 <label style={labelStyle}>Annual Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.annualFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({ ...p, annualFee: e.target.value }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* AGREEMENT FEE */}
//               <div>
//                 <label style={labelStyle}>Agreement Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.agreementFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({ ...p, agreementFee: e.target.value }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* AGENT FEE */}
//               <div>
//                 <label style={labelStyle}>Agent Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.agentFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({ ...p, agentFee: e.target.value }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* CAUTION FEE */}
//               <div>
//                 <label style={labelStyle}>Caution Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.cautionFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({ ...p, cautionFee: e.target.value }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* MAINTENANCE FEE */}
//               <div>
//                 <label style={labelStyle}>Maintenance Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.maintenanceFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({
//                       ...p,
//                       maintenanceFee: e.target.value,
//                     }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* SANITATION FEE */}
//               <div>
//                 <label style={labelStyle}>Sanitation Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.sanitationFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({
//                       ...p,
//                       sanitationFee: e.target.value,
//                     }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               <div>
//                 <label style={labelStyle}>Security Fee</label>
//                 <input
//                   type="number"
//                   value={editUnit.securityFee || ""}
//                   onChange={(e) =>
//                     setEditUnit((p) => ({
//                       ...p,
//                       securityFee: e.target.value,
//                     }))
//                   }
//                   style={inputStyle}
//                 />
//               </div>

//               {/* ACTIONS */}
//               <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
//                 <button
//                   className="btn-ghost"
//                   onClick={() => {
//                     setEditOpen(false);
//                     setEditUnit(null);
//                   }}
//                   style={{
//                     flex: 1,
//                     padding: "10px 0",
//                     borderRadius: "var(--r-md)",
//                     fontSize: 13,
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary"
//                   onClick={saveUnit}
//                   disabled={busy}
//                   style={{
//                     flex: 2,
//                     padding: "10px 0",
//                     borderRadius: "var(--r-md)",
//                     fontSize: 13,
//                   }}
//                 >
//                   {busy ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>
//             </div>
//           ) : null}
//         </Modal>
//       </div>
//     );
//   }

//   // Properties Grid View
//   return (
//     <div>
//       <PageTitle
//         title="Properties"
//         sub={`${properties.length} managed properties`}
//         right={
//           <button
//             className="btn-primary"
//             onClick={() => setShowAdd(true)}
//             style={{
//               padding: "9px 20px",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             + Add Property
//           </button>
//         }
//       />

//       {/* Properties Grid - All cards have consistent height */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
//           gap: 20,
//         }}
//       >
//         {properties.map((prop, i) => {
//           const occupiedCount = (prop.units || []).filter(
//             (u) => u.status === "occupied"
//           ).length;
//           const vacantCount = (prop.units || []).filter(
//             (u) => u.status === "vacant"
//           ).length;

//           return (
//             <div
//               key={prop.id}
//               className="card anim-up"
//               style={{
//                 padding: 0,
//                 cursor: "pointer",
//                 animationDelay: `${i * 0.06}s`,
//                 display: "flex",
//                 flexDirection: "column",
//                 height: 420, // Fixed height for all cards
//                 overflow: "hidden",
//               }}
//               onClick={() => setSelectedProp(prop)}
//             >
//               {/* Card Header */}
//               <div
//                 style={{
//                   padding: "20px 20px 16px",
//                   borderBottom: "1px solid var(--br)",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     gap: 12,
//                     alignItems: "flex-start",
//                     marginBottom: 12,
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: 48,
//                       height: 48,
//                       borderRadius: "var(--r-md)",
//                       background: "var(--goldpale)",
//                       border: "1px solid var(--brg)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       fontSize: 24,
//                       flexShrink: 0,
//                     }}
//                   >
//                     {propIcon(prop.type)}
//                   </div>
//                   <div style={{ flex: 1, minWidth: 0 }}>
//                     <div
//                       style={{
//                         fontFamily: "'Cormorant Garamond', serif",
//                         fontWeight: 700,
//                         fontSize: 18,
//                         color: "var(--text)",
//                         marginBottom: 4,
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {prop.name}
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: "var(--sub)",
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {prop.address}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Property Stats */}
//                 <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         textTransform: "uppercase",
//                         color: "var(--dim)",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       TYPE
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "var(--text)",
//                       }}
//                     >
//                       {prop.type?.toUpperCase() || "-"}
//                     </div>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         textTransform: "uppercase",
//                         color: "var(--dim)",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       UNITS
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "var(--text)",
//                       }}
//                     >
//                       {prop.units?.length || 0}
//                     </div>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         textTransform: "uppercase",
//                         color: "var(--dim)",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       OCCUPIED
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "#28a745",
//                       }}
//                     >
//                       {occupiedCount}
//                     </div>
//                   </div>
//                   <div>
//                     <div
//                       style={{
//                         fontSize: 10,
//                         textTransform: "uppercase",
//                         color: "var(--dim)",
//                         letterSpacing: "0.5px",
//                       }}
//                     >
//                       VACANT
//                     </div>
//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "#dc3545",
//                       }}
//                     >
//                       {vacantCount}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Units List with Scroll */}
//               <div
//                 style={{
//                   flex: 1,
//                   overflowY: "auto",
//                   padding: "16px 20px",
//                 }}
//               >
//                 <div
//                   style={{
//                     fontSize: 11,
//                     fontWeight: 600,
//                     color: "var(--dim)",
//                     textTransform: "uppercase",
//                     letterSpacing: "0.5px",
//                     marginBottom: 12,
//                   }}
//                 >
//                   UNITS
//                 </div>
//                 <div
//                   style={{ display: "flex", flexDirection: "column", gap: 8 }}
//                 >
//                   {(prop.units || []).map((unit) => (
//                     <div
//                       key={unit.id}
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         padding: "8px 0",
//                         borderBottom: "1px solid var(--br)",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: 13,
//                           color: "var(--text)",
//                         }}
//                       >
//                         {unit.label}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: 11,
//                           fontWeight: 500,
//                           color: getStatusColor(unit.status),
//                           textTransform: "capitalize",
//                         }}
//                       >
//                         {unit.status || "vacant"}
//                       </span>
//                     </div>
//                   ))}
//                   {(!prop.units || prop.units.length === 0) && (
//                     <div
//                       style={{
//                         textAlign: "center",
//                         padding: 20,
//                         color: "var(--dim)",
//                         fontSize: 12,
//                         fontStyle: "italic",
//                       }}
//                     >
//                       No units added yet
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Add Property Modal */}
//       <Modal
//         open={showAdd}
//         onClose={() => setShowAdd(false)}
//         title="Add Property"
//         w={580}
//       >
//         {err && (
//           <div
//             style={{
//               background: "rgba(220, 53, 69, 0.1)",
//               color: "#dc3545",
//               padding: 10,
//               borderRadius: "var(--r-sm)",
//               marginBottom: 15,
//               fontSize: 13,
//             }}
//           >
//             {err}
//           </div>
//         )}
//         <div
//           style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
//         >
//           <Field
//             label="Property Name"
//             value={f.name}
//             onChange={(e) => sf("name", e.target.value)}
//             span2
//             placeholder="e.g. Greenview Residence"
//           />
//           <Field
//             label="Address"
//             value={f.address}
//             onChange={(e) => sf("address", e.target.value)}
//             span2
//           />
//           <SelectField
//             label="Property Type"
//             value={f.type}
//             onChange={(e) => sf("type", e.target.value)}
//             options={
//               propTypesLoading
//                 ? [{ value: "", label: "Loading..." }]
//                 : propTypes
//             }
//             half
//           />
//           {f.type !== "land" && (
//             <Field
//               label={f.type === "flat" ? "Number of Flats" : "Number of Shops"}
//               value={f.unitCount}
//               onChange={(e) => sf("unitCount", e.target.value)}
//               type="number"
//               half
//             />
//           )}
//           {f.type === "land" && (
//             <>
//               <SelectField
//                 label="Land Sub-type"
//                 value={f.landSubtype}
//                 onChange={(e) => sf("landSubtype", e.target.value)}
//                 half
//                 options={landSubtypes.map((s) => ({
//                   value: s,
//                   label: s.charAt(0).toUpperCase() + s.slice(1),
//                 }))}
//               />
//               <Field
//                 label="Number of Plots/Parcels"
//                 value={f.unitCount}
//                 onChange={(e) => sf("unitCount", e.target.value)}
//                 type="number"
//                 half
//               />
//             </>
//           )}
//         </div>
//         <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//           <button
//             className="btn-ghost"
//             onClick={() => setShowAdd(false)}
//             style={{
//               flex: 1,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             Cancel
//           </button>
//           <button
//             className="btn-primary"
//             onClick={createProperty}
//             disabled={busy}
//             style={{
//               flex: 2,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             {busy ? "Creating..." : "Create Property"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

export function LLProperties({
  properties = [],
  setProperties,
  tenants = [],
  landlords = [],
  tab,
  setTab,
  log,
  me,
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [propTypes, setPropTypes] = useState([]);
  const [propTypesLoading, setPropTypesLoading] = useState(true);
  const [selectedProp, setSelectedProp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const [loadingUnit, setLoadingUnit] = useState(false);
  const [f, setF] = useState({
    name: "",
    type: "Flat / Apartment",
    address: "",
    unitCount: 1,
    landSubtype: "plot",
    landMeasurement: "",
  });

  const [editPropOpen, setEditPropOpen] = useState(false);
  const [editPropForm, setEditPropForm] = useState({
    name: "",
    type: "",
    address: "",
    unitCount: 1,
    landSubtype: "plot",
    landMeasurement: "",
  });

  // ── Image upload state ──
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ── Cloudinary config ──
  const CLOUDINARY_CLOUD_NAME = "djciyaabj";
  const CLOUDINARY_UPLOAD_PRESET = "Mechtron Estate";
  const CLOUDINARY_FOLDER = "property_images";

  const [editPropDescription, setEditPropDescription] = useState("");
  const [editPropImages, setEditPropImages] = useState([]); // array of { url, publicId, isNew? }
  const [editPropUploading, setEditPropUploading] = useState(false);
  const [editPropUploadProgress, setEditPropUploadProgress] = useState(0);
  const [editPropFeatures, setEditPropFeatures] = useState([]);
  const [addPropDescription, setAddPropDescription] = useState("");
  const [addPropFeatures, setAddPropFeatures] = useState([]);

  const [editUnitDescription, setEditUnitDescription] = useState("");
  const [editUnitFeatures, setEditUnitFeatures] = useState([]); // array of feature strings
  const [editUnitImages, setEditUnitImages] = useState([]); // array of { url, publicId, isNew }
  const [editUnitUploading, setEditUnitUploading] = useState(false);
  const [editUnitUploadProgress, setEditUnitUploadProgress] = useState(0);
  const [editUnitRecurring, setEditUnitRecurring] = useState([]);

  const unitFeaturesList = [
    "All Rooms En-suite",
    "Guest Toilet",
    "Walk-in Closets",
    "POP Ceilings",
    "Air-Condition",
    "Water Heaters",
    "Fitted Cabinets",
    "Running water",
    "Heat Extractor",
    "Washing Machine",
    "Full Tiling",
    "Wide Glass Storefronts",
    "Fire Suppression Prep",
    "CCTV Conduit Routing",
    "Internal Security Gates",
    "Open-Plan Shell construction",
    "Server/UPS Closet",
    "Dual-Source Changeover Switches",
    "Ample Floor Sockets",
  ];

  const availableFeatures = [
    "On-grid Electricity",
    "House Generator (Off-Grid)",
    "Solar Electricity (Off-Grid)",
    "On-Grid Water Supply",
    "Borehole/Well",
    "Overhead Water Tank(s)",
    "High Perimeter Wall (Fence)",
    "Sturdy gate",
    "Gatehouse/Security Post",
    "Burglary Proofing",
    "Parking Lot",
    "Greenery",
    "Swimming Pool",
    "Lounge",
    "Tennis/Basketball Court",
  ];

  // Toggle a feature in the selected array
  const toggleFeature = (feature) => {
    setEditPropFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleAddFeature = (feature) => {
    setAddPropFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };
  const toggleUnitFeature = (feature) => {
    setEditUnitFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleRecurringFee = (feeKey) => {
    setEditUnitRecurring((prev) =>
      prev.includes(feeKey)
        ? prev.filter((f) => f !== feeKey)
        : [...prev, feeKey]
    );
  };

  const uploadUnitImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Mechtron Estate");
      formData.append("folder", "unit_images");
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable)
          setEditUnitUploadProgress((e.loaded / e.total) * 100);
      });
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else reject(new Error("Upload failed"));
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/djciyaabj/image/upload`
      );
      xhr.send(formData);
    });
  };

  const handleUnitImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (editUnitImages.length + files.length > 5) {
      setErr("You can upload a maximum of 5 images for a unit.");
      return;
    }
    setEditUnitUploading(true);
    setErr("");
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErr(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErr(`${file.name} exceeds 5MB limit.`);
        continue;
      }
      try {
        const result = await uploadUnitImageToCloudinary(file);
        setEditUnitImages((prev) => [...prev, { ...result, isNew: true }]);
      } catch (err) {
        setErr(err.message);
      }
    }
    setEditUnitUploading(false);
    setEditUnitUploadProgress(0);
    e.target.value = "";
  };

  const removeUnitImage = (index) => {
    setEditUnitImages((prev) => prev.filter((_, i) => i !== index));
  };

  const labelStyle = {
    fontSize: 12,
    color: "var(--sub)",
    marginBottom: 4,
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
    background: "var(--bg2)",
  };

  const [propertiesLoading, setPropertiesLoading] = useState(true);

  const openEditProperty = () => {
    // Parse existing images
    const existingUrls = selectedProp.images
      ? selectedProp.images.split(",").map((url) => url.trim())
      : [];
    const existingImages = existingUrls.map((url) => ({
      url,
      publicId: null,
      isNew: false,
    }));

    setEditPropForm({
      name: selectedProp.name || "",
      type: selectedProp.type || "Flat / Apartment",
      address: selectedProp.address || "",
      unitCount: selectedProp.units?.length || 1,
      landSubtype: "plot",
      landMeasurement: "",
    });

    let existingFeatures = [];
    if (selectedProp.features) {
      try {
        // try to parse as JSON (new format)
        existingFeatures = JSON.parse(selectedProp.features);
      } catch (e) {
        // old comma-separated string format → convert to array
        existingFeatures = selectedProp.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
      }
    }
    setEditPropFeatures(existingFeatures);
    setEditPropDescription(selectedProp.description || "");
    setEditPropImages(existingImages);
    setEditPropOpen(true);
    // setEditPropOpen(true);
  };

  const loadProperties = () => {
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
            description: r.description,
            images: r.imageUrls,
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
  };

  useEffect(() => {
    loadProperties();
  }, [me?.id]);

  const [unitF, setUnitF] = useState({ label: "", measurement: "" });
  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

  // ── Cloudinary upload function ──
  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Mechtron Estate");
      formData.append("folder", "property_images");

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setEditPropUploadProgress((e.loaded / e.total) * 100);
        }
      });
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve({ url: data.secure_url, publicId: data.public_id });
        } else {
          reject(new Error("Upload failed"));
        }
      };
      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/djciyaabj/image/upload`
      );
      xhr.send(formData);
    });
  };

  // ── Handle image selection (max 3) ──
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (uploadedImages.length + files.length > 3) {
      setErr("You can upload a maximum of 3 images.");
      return;
    }
    setUploadingImage(true);
    setErr("");

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErr(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErr(`${file.name} exceeds 5MB limit.`);
        continue;
      }
      try {
        const result = await uploadToCloudinary(file);
        setUploadedImages((prev) => [...prev, { ...result, file }]);
      } catch (err) {
        setErr(err.message);
      }
    }
    setUploadingImage(false);
    setUploadProgress(0);
    e.target.value = ""; // allow re-selecting same file
  };

  const handleEditPropImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    const currentCount = editPropImages.length;
    if (currentCount + files.length > 3) {
      setErr("You can upload a maximum of 3 images total.");
      return;
    }
    setEditPropUploading(true);
    setErr("");

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setErr(`${file.name} is not an image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErr(`${file.name} exceeds 5MB limit.`);
        continue;
      }
      try {
        const result = await uploadToCloudinary(file);
        setEditPropImages((prev) => [...prev, { ...result, isNew: true }]);
      } catch (err) {
        setErr(err.message);
      }
    }
    setEditPropUploading(false);
    setEditPropUploadProgress(0);
    e.target.value = "";
  };

  const removeEditPropImage = (index) => {
    setEditPropImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Save unit (unchanged) ──
  const saveUnit = () => {
    if (!editUnit?.id) return;
    setBusy(true);
    setErr("");

    const featuresJson = JSON.stringify(editUnitFeatures);
    const imageUrls = editUnitImages.map((img) => img.url).join(",");
    const recurringFeesJson = JSON.stringify(editUnitRecurring);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.upUnit",
      editUnit.id,
      editUnit.type,
      parseFloat(editUnit.annualFee || 0),
      parseFloat(editUnit.agreementFee || 0),
      parseFloat(editUnit.agentFee || 0),
      parseFloat(editUnit.cautionFee || 0),
      parseFloat(editUnit.maintenanceFee || 0),
      parseFloat(editUnit.sanitationFee || 0),
      parseFloat(editUnit.securityFee || 0),
      editUnitDescription,
      featuresJson,
      imageUrls,
      recurringFeesJson,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;
          if (data.success) {
            setProperties((prev) =>
              prev.map((p) => ({
                ...p,
                units: (p.units || []).map((u) =>
                  u.id === editUnit.id ? { ...editUnit } : u
                ),
              }))
            );
            setEditOpen(false);
          } else {
            setErr(data.message);
          }
        } else {
          setErr(event.message || "Update failed");
        }
        setBusy(false);
      },
      { escape: false }
    );
  };

  const openEditModal = (unit) => {
    setEditOpen(true);
    setLoadingUnit(true);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getUnitById",
      unit.id || unit.Id,
      function (result, event) {
        if (event.status && result) {
          setEditUnit({
            id: result.Id,
            label: result.Name,
            type: result.Type__c,
            annualFee: result.Annual_Fee__c,
            agreementFee: result.Agreement_Fee__c,
            agentFee: result.Agent_Fee__c,
            cautionFee: result.Caution_Fee__c,
            maintenanceFee: result.Maintenance_Fee__c,
            securityFee: result.Security_Fee__c,
            sanitationFee: result.Sanitation_Fee__c,
          });
          setEditUnitDescription(result.Description__c || "");
          // Parse features JSON
          let features = [];
          try {
            features = JSON.parse(result.Features__c || "[]");
          } catch (e) {
            features = [];
          }
          setEditUnitFeatures(features);
          // Load existing images
          const urls = result.Image__c
            ? result.Image__c.split(",").map((u) => u.trim())
            : [];
          setEditUnitImages(
            urls.map((url) => ({ url, publicId: null, isNew: false }))
          );
          // Load recurring fees array
          let recurringFees = [];
          try {
            recurringFees = JSON.parse(result.Recurring_Fees__c || "[]");
          } catch (e) {
            recurringFees = [];
          }
          setEditUnitRecurring(recurringFees);
        } else {
          console.error("Failed to load unit:", event.message);
          setErr("Could not load unit details.");
        }
        setLoadingUnit(false);
      }
    );
  };

  useEffect(() => {
    console.log("📦 Properties received in LLProperties:", properties);
  }, [properties]);

  useEffect(() => {
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getPropertyTypePicklist",
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            value: r.value,
            label: r.label,
          }));
          setPropTypes(mapped);
        } else {
          console.error("Failed to load property types:", event.message);
        }
        setPropTypesLoading(false);
      },
      { escape: false }
    );
  }, []);

  const landSubtypes = ["plot", "acre", "hectare"];

  // ── Create property with image URLs ──
  const createProperty = async () => {
    if (!f.name || !f.type || !f.address || !f.unitCount) {
      setErr("Please fill all required fields.");
      return;
    }
    setBusy(true);
    setErr("");

    const featuresJson = JSON.stringify(addPropFeatures);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.createProperty",
      f.name,
      f.type,
      me?.id,
      f.address,
      parseFloat(f.unitCount),
      addPropDescription, // ← description
      featuresJson, // ← features JSON
      function (result, event) {
        if (event.status) {
          console.log("✅ Property created successfully");
          setShowAdd(false);
          // Reset form
          setF({
            name: "",
            type: "Flat / Apartment",
            address: "",
            unitCount: 1,
            landSubtype: "plot",
            landMeasurement: "",
          });
          setAddPropDescription("");
          setAddPropFeatures([]);
          setErr("");
          loadProperties(); // refresh list
        } else {
          console.error("❌ Failed to create property:", event.message);
          setErr(event.message || "Failed to create property");
        }
        setBusy(false);
      },
      { escape: false }
    );
  };

  const updateProperty = async () => {
    if (!editPropForm.name || !editPropForm.type || !editPropForm.address) {
      setErr("Please fill all required fields.");
      return;
    }
    setBusy(true);
    setErr("");

    const featuresJson = JSON.stringify(editPropFeatures);
    const imageUrls = editPropImages.map((img) => img.url).join(",");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.updateProperty",
      selectedProp.id,
      editPropForm.name,
      editPropForm.type,
      editPropForm.address,
      parseFloat(editPropForm.unitCount),
      editPropDescription,
      imageUrls,
      featuresJson,
      function (result, event) {
        if (event.status) {
          console.log("✅ Property updated successfully");
          setEditPropOpen(false);
          // Refresh properties list and update selectedProp
          loadProperties();
          setSelectedProp((prev) => ({
            ...prev,
            name: editPropForm.name,
            type: editPropForm.type,
            address: editPropForm.address,
            description: editPropDescription,
            images: imageUrls,
          }));
          setErr("");
        } else {
          console.error("❌ Failed to update property:", event.message);
          setErr(event.message || "Failed to update property");
        }
        setBusy(false);
      },
      { escape: false }
    );
  };

  const addUnit = () => {
    if (!unitF.label) return;
    setProperties((ps) =>
      ps.map((p) => {
        if (p.id !== selectedProp.id) return p;
        const newUnit = {
          id: `UNIT_${Date.now()}`,
          label: unitF.label,
          status: "vacant",
          measurement: unitF.measurement,
        };
        const updated = { ...p, units: [...(p.units || []), newUnit] };
        setSelectedProp(updated);
        return updated;
      })
    );
    log(`Unit added to ${selectedProp.name}: ${unitF.label}`);
    setShowAddUnit(false);
    setUnitF({ label: "", measurement: "" });
  };

  const propIcon = (t) => {
    if (!t) return "🏠";
    const lower = t.toLowerCase();
    return lower.includes("flat") || lower.includes("apartment")
      ? "🏢"
      : lower.includes("shop") || lower.includes("commercial")
      ? "🏪"
      : "🌱";
  };

  const getStatusColor = (status) => {
    if (!status) return "var(--dim)";
    const lower = status.toLowerCase();
    if (lower === "occupied") return "#28a745";
    if (lower === "vacant") return "#dc3545";
    return "var(--dim)";
  };

  if (propertiesLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          color: "var(--dim)",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid var(--br)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin .7s linear infinite",
            display: "inline-block",
          }}
        />
        Loading Properties...
      </div>
    );
  }

  if (selectedProp) {
    // Parse image URLs (comma‑separated string)
    const imageUrls = selectedProp.images ? selectedProp.images.split(",") : [];

    return (
      <div>
        <button
          onClick={() => setSelectedProp(null)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--gold)",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          ← Back to properties
        </button>
        <div className="card" style={{ padding: 24 }}>
          {/* Property Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--br)",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {selectedProp.name}
              </div>
              <div style={{ fontSize: 13, color: "var(--sub)" }}>
                {selectedProp.address}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn-ghost"
                onClick={openEditProperty}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 13,
                }}
              >
                ✎ Edit Property
              </button>
              <button
                className="btn-primary"
                onClick={() => setShowAddUnit(true)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 13,
                }}
              >
                + Add Unit
              </button>
            </div>
          </div>

          {/* Property Stats */}
          <div
            style={{
              display: "flex",
              gap: 20,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--br)",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--dim)",
                  marginBottom: 4,
                }}
              >
                TYPE
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {selectedProp.type?.toUpperCase() || "PROPERTY"}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--dim)",
                  marginBottom: 4,
                }}
              >
                TOTAL UNITS
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {selectedProp.units?.length || 0}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "var(--dim)",
                  marginBottom: 4,
                }}
              >
                OCCUPIED
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                }}
              >
                {
                  (selectedProp.units || []).filter(
                    (u) => u.status === "occupied"
                  ).length
                }
              </div>
            </div>
          </div>

          {selectedProp.description && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                DESCRIPTION
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "var(--sub)",
                  lineHeight: 1.6,
                  background: "var(--bg2)",
                  padding: "16px 20px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--br)",
                }}
              >
                {selectedProp.description}
              </div>
            </div>
          )}

          {/* ── PROPERTY IMAGES GALLERY ── */}
          {imageUrls.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                PROPERTY IMAGES
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 12,
                }}
              >
                {imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url.trim()}
                    alt={`Property ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: "var(--r-md)",
                      cursor: "pointer",
                      border: "1px solid var(--br)",
                    }}
                    onClick={() => window.open(url.trim(), "_blank")}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedProp.amenities &&
            (() => {
              let featuresList = [];
              try {
                featuresList = JSON.parse(selectedProp.amenities);
              } catch (e) {
                featuresList = selectedProp.amenities
                  .split(",")
                  .map((f) => f.trim())
                  .filter((f) => f);
              }
              return featuresList.length > 0 ? (
                <div style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    FEATURES & AMENITIES
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {featuresList.map((feature, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "5px 12px",
                          borderRadius: "25%",
                          background: "var(--goldpale)",
                          color: "var(--sub)",
                          fontWeight: 500,
                          fontSize: 12,
                        }}
                      >
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

          {/* UNITS SECTION */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              UNITS
            </div>
            <div
              style={{
                maxHeight: 400,
                overflowY: "auto",
                paddingRight: 8,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(selectedProp.units || []).map((unit) => (
                  <div
                    key={unit.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 16px",
                      background: "var(--bg2)",
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--br)",
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--text)",
                        }}
                      >
                        {unit.label}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: getStatusColor(unit.status),
                        textTransform: "capitalize",
                        minWidth: 70,
                        textAlign: "right",
                      }}
                    >
                      {unit.status || "vacant"}
                    </span>
                    <button
                      onClick={() => openEditModal(unit)}
                      style={{
                        marginLeft: 10,
                        padding: "6px 10px",
                        borderRadius: "var(--r-sm)",
                        fontSize: 12,
                        border: "1px solid var(--gold)",
                        background: "transparent",
                        color: "var(--gold)",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* ── EDIT PROPERTY MODAL ── */}
        <Modal
          open={editPropOpen}
          onClose={() => {
            setEditPropOpen(false);
            setErr("");
          }}
          title="Edit Property"
          w={650}
        >
          {err && (
            <div
              style={{
                background: "rgba(220, 53, 69, 0.1)",
                color: "#dc3545",
                padding: 10,
                borderRadius: "var(--r-sm)",
                marginBottom: 15,
                fontSize: 13,
              }}
            >
              {err}
            </div>
          )}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
          >
            <Field
              label="Property Name"
              value={editPropForm.name}
              onChange={(e) =>
                setEditPropForm((p) => ({ ...p, name: e.target.value }))
              }
              span2
              placeholder="e.g. Greenview Residence"
            />
            <Field
              label="Address"
              value={editPropForm.address}
              onChange={(e) =>
                setEditPropForm((p) => ({ ...p, address: e.target.value }))
              }
              span2
            />
            <SelectField
              label="Property Type"
              value={editPropForm.type}
              onChange={(e) =>
                setEditPropForm((p) => ({ ...p, type: e.target.value }))
              }
              options={
                propTypesLoading
                  ? [{ value: "", label: "Loading..." }]
                  : propTypes
              }
              half
            />
            {editPropForm.type !== "land" && (
              <Field
                label={
                  editPropForm.type === "Flat / Apartment"
                    ? "Number of Flats"
                    : "Number of Shops"
                }
                value={editPropForm.unitCount}
                onChange={(e) =>
                  setEditPropForm((p) => ({ ...p, unitCount: e.target.value }))
                }
                type="number"
                half
              />
            )}
            {editPropForm.type === "Land / Plot" && (
              <>
                <SelectField
                  label="Land Sub-type"
                  value={editPropForm.landSubtype}
                  onChange={(e) =>
                    setEditPropForm((p) => ({
                      ...p,
                      landSubtype: e.target.value,
                    }))
                  }
                  half
                  options={landSubtypes.map((s) => ({
                    value: s,
                    label: s.charAt(0).toUpperCase() + s.slice(1),
                  }))}
                />
                <Field
                  label="Number of Plots/Parcels"
                  value={editPropForm.unitCount}
                  onChange={(e) =>
                    setEditPropForm((p) => ({
                      ...p,
                      unitCount: e.target.value,
                    }))
                  }
                  type="number"
                  half
                />
              </>
            )}
            {/* Description field – spans both columns */}
            <div style={{ gridColumn: "span 2" }}>
              <Lbl>Description (max 500 characters)</Lbl>
              <textarea
                className="field"
                rows={4}
                value={editPropDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 500)
                    setEditPropDescription(e.target.value);
                }}
                placeholder="Describe the property, amenities, special features, etc."
                style={{ resize: "vertical" }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: "var(--dim)",
                  textAlign: "right",
                  marginTop: 4,
                }}
              >
                {editPropDescription.length} / 500
              </div>
            </div>

            {/* Features Section */}
            <div style={{ gridColumn: "span 2", marginTop: 8 }}>
              <Lbl>Features & Amenities</Lbl>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "10px 16px",
                  background: "var(--bg2)",
                  padding: "16px",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--br)",
                }}
                className="features-grid"
              >
                {availableFeatures.map((feature) => (
                  <label
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--text)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={editPropFeatures.includes(feature)}
                      onChange={() => toggleFeature(feature)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            {/* Image Manager */}
            <div style={{ gridColumn: "span 2", marginTop: 8 }}>
              <Lbl>Property Images (max 3 total)</Lbl>
              <div
                style={{
                  border: "2px dashed var(--br)",
                  borderRadius: "var(--r-md)",
                  padding: "16px",
                  textAlign: "center",
                  background: "var(--bg2)",
                  cursor:
                    editPropImages.length >= 3 ? "not-allowed" : "pointer",
                  opacity: editPropImages.length >= 3 ? 0.6 : 1,
                }}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleEditPropImageSelect}
                  disabled={editPropUploading || editPropImages.length >= 3}
                  style={{ display: "none" }}
                  id="edit-prop-image-upload"
                />
                <label
                  htmlFor="edit-prop-image-upload"
                  style={{
                    display: "block",
                    cursor:
                      editPropImages.length >= 3 ? "not-allowed" : "pointer",
                  }}
                >
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                  <div style={{ fontSize: 13, color: "var(--text)" }}>
                    {editPropUploading
                      ? `Uploading... ${Math.round(editPropUploadProgress)}%`
                      : editPropImages.length >= 3
                      ? "Maximum 3 images reached"
                      : "Click to add new images (JPEG/PNG, max 5MB each)"}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}
                  >
                    {editPropImages.length}/3 used
                  </div>
                </label>
              </div>

              {/* Image previews with delete option */}
              {editPropImages.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {editPropImages.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img
                        src={img.url}
                        alt={`Property ${idx + 1}`}
                        style={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: "var(--r-sm)",
                          border: "1px solid var(--br)",
                        }}
                      />
                      <button
                        onClick={() => removeEditPropImage(idx)}
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--red)",
                          color: "#fff",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                      {!img.isNew && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: -4,
                            left: 0,
                            right: 0,
                            fontSize: 9,
                            textAlign: "center",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            borderRadius: "var(--r-sm)",
                            padding: "2px 4px",
                          }}
                        >
                          existing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              className="btn-ghost"
              onClick={() => {
                setEditPropOpen(false);
                setErr("");
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "var(--r-md)",
                fontSize: 13,
              }}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={updateProperty}
              disabled={busy || editPropUploading}
              style={{
                flex: 2,
                padding: "10px 0",
                borderRadius: "var(--r-md)",
                fontSize: 13,
              }}
            >
              {busy ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </Modal>
        ;{/* Responsive CSS for the features grid */}
        {/* Add Unit Modal (unchanged) */}
        <Modal
          open={showAddUnit}
          onClose={() => setShowAddUnit(false)}
          title="Add Unit"
        >
          <div style={{ display: "grid", gap: 13 }}>
            <Field
              label="Unit Label"
              value={unitF.label}
              onChange={(e) =>
                setUnitF((p) => ({ ...p, label: e.target.value }))
              }
              span2
              placeholder="e.g. Flat 5 / Shop 3 / Plot C"
            />
            {selectedProp?.type === "land" && (
              <Field
                label="Measurement (optional)"
                value={unitF.measurement}
                onChange={(e) =>
                  setUnitF((p) => ({ ...p, measurement: e.target.value }))
                }
                span2
                placeholder="e.g. 500 sqm"
              />
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              className="btn-ghost"
              onClick={() => setShowAddUnit(false)}
              style={{
                flex: 1,
                padding: "10px 0",
                borderRadius: "var(--r-md)",
                fontSize: 13,
              }}
            >
              Cancel
            </button>
            <button
              className="btn-primary"
              onClick={addUnit}
              style={{
                flex: 2,
                padding: "10px 0",
                borderRadius: "var(--r-md)",
                fontSize: 13,
              }}
            >
              Add Unit
            </button>
          </div>
        </Modal>
        {/* Edit Unit Modal (unchanged) */}
        <Modal
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditUnit(null);
            setEditUnitDescription("");
            setEditUnitFeatures([]);
            setEditUnitImages([]);
          }}
          title={`Edit ${editUnit?.label || "Unit"}`}
          w={800}
        >
          {loadingUnit ? (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                color: "var(--sub)",
                fontSize: 13,
              }}
            >
              Loading unit...
            </div>
          ) : editUnit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Error display */}
              {err && (
                <div
                  style={{
                    background: "rgba(220, 53, 69, 0.1)",
                    color: "#dc3545",
                    padding: 10,
                    borderRadius: "var(--r-sm)",
                    fontSize: 13,
                  }}
                >
                  {err}
                </div>
              )}

              {/* Two‑column layout for basic fields */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
                className="unit-details-grid"
              >
                {/* Left column */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {/* Type */}
                  <div>
                    <label style={labelStyle}>Type</label>
                    <select
                      value={editUnit.type || ""}
                      onChange={(e) =>
                        setEditUnit((p) => ({ ...p, type: e.target.value }))
                      }
                      style={inputStyle}
                    >
                      <option value="">Select a type</option>
                      <option value="Shop">Shop</option>
                      <option value="Two Bedroom">Two Bedroom</option>
                      <option value="Three Bedroom">Three Bedroom</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={labelStyle}>Description (max 500)</label>
                    <textarea
                      rows={3}
                      value={editUnitDescription}
                      onChange={(e) => {
                        if (e.target.value.length <= 500)
                          setEditUnitDescription(e.target.value);
                      }}
                      style={{
                        ...inputStyle,
                        resize: "vertical",
                        height: "350px",
                      }}
                      placeholder="Describe the unit, e.g., 'Spacious 2-bedroom with modern finishes'"
                    />
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--dim)",
                        textAlign: "right",
                        marginTop: 4,
                      }}
                    >
                      {editUnitDescription.length} / 500
                    </div>
                  </div>
                </div>

                {/* Right column – Fees with recurring checkboxes */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 14 }}
                >
                  {[
                    {
                      label: "Annual Fee",
                      field: "annualFee",
                      key: "annualFee",
                    },
                    {
                      label: "Agreement Fee",
                      field: "agreementFee",
                      key: "agreementFee",
                    },
                    { label: "Agent Fee", field: "agentFee", key: "agentFee" },
                    {
                      label: "Caution Fee",
                      field: "cautionFee",
                      key: "cautionFee",
                    },
                    {
                      label: "Maintenance Fee",
                      field: "maintenanceFee",
                      key: "maintenanceFee",
                    },
                    {
                      label: "Sanitation Fee",
                      field: "sanitationFee",
                      key: "sanitationFee",
                    },
                    {
                      label: "Security Fee",
                      field: "securityFee",
                      key: "securityFee",
                    },
                  ].map(({ label, field, key }) => (
                    <div key={key}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <label style={labelStyle}>{label}</label>
                          <input
                            type="number"
                            value={editUnit[field] || ""}
                            onChange={(e) =>
                              setEditUnit((p) => ({
                                ...p,
                                [field]: e.target.value,
                              }))
                            }
                            style={inputStyle}
                          />
                        </div>
                        <label
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            whiteSpace: "nowrap",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={editUnitRecurring.includes(key)}
                            onChange={() => toggleRecurringFee(key)}
                            style={{ width: 16, height: 16, cursor: "pointer" }}
                          />
                          <span style={{ fontSize: 11, color: "var(--dim)" }}>
                            Recurring
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Section */}
              <div>
                <label style={labelStyle}>Features & Amenities</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px 12px",
                    background: "var(--bg2)",
                    padding: "16px",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--br)",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                  className="unit-features-grid"
                >
                  {unitFeaturesList.map((feature) => (
                    <label
                      key={feature}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editUnitFeatures.includes(feature)}
                        onChange={() => toggleUnitFeature(feature)}
                        style={{ width: 16, height: 16, cursor: "pointer" }}
                      />
                      {feature}
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Uploader (max 5) */}
              <div>
                <label style={labelStyle}>Unit Images (max 5)</label>
                <div
                  style={{
                    border: "2px dashed var(--br)",
                    borderRadius: "var(--r-md)",
                    padding: "16px",
                    textAlign: "center",
                    background: "var(--bg2)",
                    cursor:
                      editUnitImages.length >= 5 ? "not-allowed" : "pointer",
                    opacity: editUnitImages.length >= 5 ? 0.6 : 1,
                  }}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    multiple
                    onChange={handleUnitImageSelect}
                    disabled={editUnitUploading || editUnitImages.length >= 5}
                    style={{ display: "none" }}
                    id="unit-image-upload"
                  />
                  <label
                    htmlFor="unit-image-upload"
                    style={{
                      display: "block",
                      cursor:
                        editUnitImages.length >= 5 ? "not-allowed" : "pointer",
                    }}
                  >
                    <div style={{ fontSize: 36, marginBottom: 8 }}>🖼️</div>
                    <div style={{ fontSize: 13, color: "var(--text)" }}>
                      {editUnitUploading
                        ? `Uploading... ${Math.round(editUnitUploadProgress)}%`
                        : editUnitImages.length >= 5
                        ? "Maximum 5 images reached"
                        : "Click to add images (JPEG/PNG, max 5MB each)"}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--dim)",
                        marginTop: 4,
                      }}
                    >
                      {editUnitImages.length}/5 used
                    </div>
                  </label>
                </div>
                {editUnitImages.length > 0 && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    {editUnitImages.map((img, idx) => (
                      <div key={idx} style={{ position: "relative" }}>
                        <img
                          src={img.url}
                          alt={`Unit ${idx + 1}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            borderRadius: "var(--r-sm)",
                            border: "1px solid var(--br)",
                          }}
                        />
                        <button
                          onClick={() => removeUnitImage(idx)}
                          style={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "var(--red)",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          ×
                        </button>
                        {!img.isNew && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: -4,
                              left: 0,
                              right: 0,
                              fontSize: 9,
                              textAlign: "center",
                              background: "rgba(0,0,0,0.6)",
                              color: "#fff",
                              borderRadius: "var(--r-sm)",
                              padding: "2px 4px",
                            }}
                          >
                            existing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button
                  className="btn-ghost"
                  onClick={() => setEditOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: "var(--r-md)",
                    fontSize: 13,
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={saveUnit}
                  disabled={busy || editUnitUploading}
                  style={{
                    flex: 2,
                    padding: "10px 0",
                    borderRadius: "var(--r-md)",
                    fontSize: 13,
                  }}
                >
                  {busy ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : null}
        </Modal>
        <style>{`
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .features-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
  @media (min-width: 1025px) {
    .features-grid {
      grid-template-columns: repeat(4, 1fr) !important;
    }
  }
  @media (max-width: 768px) {
    .unit-features-grid {
      grid-template-columns: repeat(1, 1fr) !important;
    }
    .unit-details-grid{
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .unit-features-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .unit-details-grid{
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
  @media (min-width: 1025px) {
    .unit-features-grid {
      grid-template-columns: repeat(4, 1fr) !important;
    }
  }
`}</style>
      </div>
    );
  }

  // ── Properties Grid View ──
  return (
    <div>
      <PageTitle
        title="Properties"
        sub={`${properties.length} managed properties`}
        right={
          <button
            className="btn-primary"
            onClick={() => setShowAdd(true)}
            style={{
              padding: "9px 20px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            + Add Property
          </button>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 20,
        }}
      >
        {properties.map((prop, i) => {
          const occupiedCount = (prop.units || []).filter(
            (u) => u.status === "occupied"
          ).length;
          const vacantCount = (prop.units || []).filter(
            (u) => u.status === "vacant"
          ).length;

          return (
            <div
              key={prop.id}
              className="card anim-up"
              style={{
                padding: 0,
                cursor: "pointer",
                animationDelay: `${i * 0.06}s`,
                display: "flex",
                flexDirection: "column",
                height: 420,
                overflow: "hidden",
              }}
              onClick={() => setSelectedProp(prop)}
            >
              {/* Card header (unchanged) */}
              <div
                style={{
                  padding: "20px 20px 16px",
                  borderBottom: "1px solid var(--br)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--r-md)",
                      background: "var(--goldpale)",
                      border: "1px solid var(--brg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {propIcon(prop.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 700,
                        fontSize: 18,
                        color: "var(--text)",
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {prop.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--sub)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {prop.address}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: "var(--dim)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      TYPE
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {prop.type?.toUpperCase() || "-"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: "var(--dim)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      UNITS
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {prop.units?.length || 0}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: "var(--dim)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      OCCUPIED
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#28a745",
                      }}
                    >
                      {occupiedCount}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        textTransform: "uppercase",
                        color: "var(--dim)",
                        letterSpacing: "0.5px",
                      }}
                    >
                      VACANT
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#dc3545",
                      }}
                    >
                      {vacantCount}
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 20px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--dim)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: 12,
                  }}
                >
                  UNITS
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {(prop.units || []).map((unit) => (
                    <div
                      key={unit.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid var(--br)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text)",
                        }}
                      >
                        {unit.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: getStatusColor(unit.status),
                          textTransform: "capitalize",
                        }}
                      >
                        {unit.status || "vacant"}
                      </span>
                    </div>
                  ))}
                  {(!prop.units || prop.units.length === 0) && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: 20,
                        color: "var(--dim)",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      No units added yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Add Property Modal with Image Uploader */}
      <Modal
        open={showAdd}
        onClose={() => {
          setShowAdd(false);
          setUploadedImages([]); // clear images
          setErr("");
        }}
        title="Add Property"
        w={580}
      >
        {err && (
          <div
            style={{
              background: "rgba(220, 53, 69, 0.1)",
              color: "#dc3545",
              padding: 10,
              borderRadius: "var(--r-sm)",
              marginBottom: 15,
              fontSize: 13,
            }}
          >
            {err}
          </div>
        )}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
        >
          <Field
            label="Property Name"
            value={f.name}
            onChange={(e) => sf("name", e.target.value)}
            span2
            placeholder="e.g. Greenview Residence"
          />
          <Field
            label="Address"
            value={f.address}
            onChange={(e) => sf("address", e.target.value)}
            span2
          />
          <SelectField
            label="Property Type"
            value={f.type}
            onChange={(e) => sf("type", e.target.value)}
            options={
              propTypesLoading
                ? [{ value: "", label: "Loading..." }]
                : propTypes
            }
            half
          />
          {f.type !== "land" && (
            <Field
              label={
                f.type === "Flat / Apartment"
                  ? "Number of Flats"
                  : "Number of Shops"
              }
              value={f.unitCount}
              onChange={(e) => sf("unitCount", e.target.value)}
              type="number"
              half
            />
          )}
          {f.type === "Land / Plot" && (
            <>
              <SelectField
                label="Land Sub-type"
                value={f.landSubtype}
                onChange={(e) => sf("landSubtype", e.target.value)}
                half
                options={landSubtypes.map((s) => ({
                  value: s,
                  label: s.charAt(0).toUpperCase() + s.slice(1),
                }))}
              />
              <Field
                label="Number of Plots/Parcels"
                value={f.unitCount}
                onChange={(e) => sf("unitCount", e.target.value)}
                type="number"
                half
              />
            </>
          )}

          <div style={{ gridColumn: "span 2" }}>
            <Lbl>Description (max 500 characters)</Lbl>
            <textarea
              className="field"
              rows={4}
              value={addPropDescription}
              onChange={(e) => {
                if (e.target.value.length <= 500)
                  setAddPropDescription(e.target.value);
              }}
              placeholder="Describe the property, amenities, special features, etc."
              style={{ resize: "vertical" }}
            />
            <div
              style={{
                fontSize: 11,
                color: "var(--dim)",
                textAlign: "right",
                marginTop: 4,
              }}
            >
              {addPropDescription.length} / 500
            </div>
          </div>

          <div style={{ gridColumn: "span 2", marginTop: 8 }}>
            <Lbl>Features & Amenities</Lbl>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px 16px",
                background: "var(--bg2)",
                padding: "16px",
                borderRadius: "var(--r-md)",
                border: "1px solid var(--br)",
              }}
              className="features-grid"
            >
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--text)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={addPropFeatures.includes(feature)}
                    onChange={() => toggleAddFeature(feature)}
                    style={{ width: 16, height: 16, cursor: "pointer" }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>

          {/* ── Image Upload Section (max 3) ── */}
          <div style={{ gridColumn: "span 2", marginTop: 8 }}>
            <Lbl>Property Images (max 3)</Lbl>
            <div
              style={{
                border: "2px dashed var(--br)",
                borderRadius: "var(--r-md)",
                padding: "16px",
                textAlign: "center",
                background: "var(--bg2)",
                cursor: uploadedImages.length >= 3 ? "not-allowed" : "pointer",
                opacity: uploadedImages.length >= 3 ? 0.6 : 1,
              }}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleImageSelect}
                disabled={uploadingImage || uploadedImages.length >= 3}
                style={{ display: "none" }}
                id="property-image-upload"
              />
              <label
                htmlFor="property-image-upload"
                style={{
                  display: "block",
                  cursor:
                    uploadedImages.length >= 3 ? "not-allowed" : "pointer",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>
                  {uploadingImage
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : uploadedImages.length >= 3
                    ? "Maximum 3 images reached"
                    : "Click or drag to upload images"}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}
                >
                  JPEG, PNG (max 5MB each) • {uploadedImages.length}/3 used
                </div>
              </label>
            </div>

            {/* Image previews */}
            {uploadedImages.length > 0 && (
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {uploadedImages.map((img, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <img
                      src={img.url}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: "var(--r-sm)",
                        border: "1px solid var(--br)",
                      }}
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "var(--red)",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            className="btn-ghost"
            onClick={() => {
              setShowAdd(false);
              setAddPropDescription("");
              setAddPropFeatures([]);
              setErr("");
            }}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={createProperty}
            disabled={busy}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            {busy ? "Creating..." : "Create Property"}
          </button>
        </div>
      </Modal>{" "}
      <style>{`
  @media (max-width: 768px) {
    .features-grid {
      grid-template-columns: repeat(1, 1fr) !important;
    }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .features-grid {
      grid-template-columns: repeat(3, 1fr) !important;
    }
  }
  @media (min-width: 1025px) {
    .features-grid {
      grid-template-columns: repeat(4, 1fr) !important;
    }
  }
`}</style>
      ;
    </div>
  );
}

export function LLTenants({
  me,
  myTenants,
  setMyTenants,
  myProps,
  tab,
  setTab,
  tenants = [],
  properties = [],
  setProperties,
  log,
  push,
}) {
  const blank = {
    tenantId: "", // Selected tenant ID
    propertyId: "", // Selected property ID
    unit: "", // Selected unit label
    // rentDueDay: "1",
    // leaseStart: "",
    // leaseEnd: "",
  };

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [ed, setEd] = useState(null);
  const [f, setF] = useState(blank);
  const [assignF, setAssignF] = useState(blank);
  const [myTenantLoading, setmyTenantLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check for mobile and tablet on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const saf = (k, v) => setAssignF((p) => ({ ...p, [k]: v }));

  // Get selected property and its units
  const selectedProperty = properties.find((p) => p.id === assignF.propertyId);
  const availUnits = selectedProperty?.units || [];

  // Get available tenants (tenants not yet assigned to a property? Or all tenants)
  const availableTenants = tenants; // Using the tenants prop

  useEffect(() => {
    if (!me?.id) return;

    setmyTenantLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getUnits",
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
          }));

          console.log("🏠 Units loaded for landlord:", me.id);
          console.log("📦 Full dataset:", mapped);

          setMyTenants(mapped);
        } else {
          console.error("Failed to load units:", event?.message);
          setMyTenants([]);
        }

        setmyTenantLoading(false);
      },
      { escape: false }
    );
  }, [me?.id]);

  const saveAssign = () => {
    if (!assignF.tenantId) return setErr("Please select a tenant.");
    if (!assignF.propertyId) return setErr("Please select a property.");
    if (!assignF.unit) return setErr("Please select a unit.");

    setBusy(true);
    setErr("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.assignUnit",
      assignF.propertyId,
      assignF.unit,
      assignF.tenantId,
      me?.id,
      function (result, event) {
        setBusy(false);
        if (event.status) {
          const response =
            typeof result === "string" ? JSON.parse(result) : result;
          if (response?.success) {
            console.log("✅ Unit assigned:", response);
            setAssignOpen(false);
            setAssignF(blank);
            setErr("");
            log?.(`Unit assigned successfully`);
            // Re-fetch to reflect the new assignment
            Visualforce.remoting.Manager.invokeAction(
              "EstateController.getUnits",
              me.id,
              function (r2, e2) {
                if (e2.status && r2) {
                  setMyTenants(
                    r2.map((r) => ({
                      id: r.Id,
                      label: r.Name,
                      tenancy: r.Tenancy_Status__c,
                      occupancy: r.Occupancy_Status__c,
                      tenantId: r.Tenant__c,
                      tenantName: r.Tenant__r?.Name || "",
                      tenantEmail: r.Tenant__r?.Email__c || "",
                      propertyName: r.Property_Lookup__r?.Name || "",
                    }))
                  );
                }
              },
              { escape: false }
            );
          } else {
            setErr(response?.message || "Failed to assign unit.");
          }
        } else {
          setErr(event.message || "Remote action failed.");
        }
      },
      { escape: false }
    );
  };

  if (myTenantLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          color: "var(--dim)",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid var(--br)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin .7s linear infinite",
            display: "inline-block",
          }}
        />
        Loading tenants...
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="My Tenants"
        sub={`${myTenants.length} tenant${myTenants.length === 1 ? "" : "s"}`}
        right={
          <button
            className="btn-primary"
            onClick={() => {
              setEd(null);
              setAssignF(blank);
              setAssignOpen(true);
            }}
            style={{
              padding: isMobile ? "8px 16px" : "9px 20px",
              borderRadius: "var(--r-md)",
              fontSize: isMobile ? 12 : 13,
            }}
          >
            + Assign Unit
          </button>
        }
      />

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : window.innerWidth > 1440
            ? "repeat(4, 1fr)"
            : "repeat(3, 1fr)",
        }}
      >
        {myTenants.map((t, i) => (
          <div
            key={t.id}
            className="card anim-up"
            style={{
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              animationDelay: `${i * 0.04}s`,
              height: "100%", // Ensure cards in the same row have equal height
            }}
          >
            {/* Avatar - Centered */}
            <Avatar
              t={{ ...t, name: t.tenantName }}
              size={isMobile ? 70 : 60}
            />

            {/* Tenant Name - Bold and prominent */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: isMobile ? 18 : 16,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              {t.tenantName}
            </div>

            {/* Tenant Details - Stacked vertically */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                width: "100%",
                marginBottom: 8,
              }}
            >
              {/* Email */}
              <div
                style={{
                  fontSize: isMobile ? 12 : 12.5,
                  color: "var(--sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span>📧</span>
                <span style={{ wordBreak: "break-all" }}>{t.tenantEmail}</span>
              </div>

              {/* Property and Unit */}
              <div
                style={{
                  fontSize: isMobile ? 12 : 12.5,
                  color: "var(--sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {t.propertyName && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span>🏢</span> {t.propertyName}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>🏠</span> {t.label}
                </span>
              </div>

              {/* Additional info if available */}
              {t.rentAmount && (
                <div
                  style={{
                    fontSize: isMobile ? 12 : 12.5,
                    color: "var(--sub)",
                    fontFamily: "'DM Mono',monospace",
                  }}
                >
                  {fmt(t.rentAmount)}/yr
                </div>
              )}
              {t.leaseEnd && (
                <div
                  style={{
                    fontSize: isMobile ? 12 : 12.5,
                    color: "var(--sub)",
                  }}
                >
                  Lease → {t.leaseEnd}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                width: "100%",
                marginTop: "auto",
              }}
            >
              <Tag status={t.tenancy || "active"} />
              <button
                className="btn-primary"
                onClick={() => {
                  setEd(t);
                  setF({ ...t });
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 13,
                  width: "100%",
                  background: (() => {
                    const status = (t.tenancy || "").toLowerCase();
                    if (status === "assigned") return "var(--red, #dc3545)";
                    return "var(--gold)";
                  })(),
                }}
              >
                {(() => {
                  const status = (t.tenancy || "").toLowerCase();
                  if (
                    ["active", "accepted", "paid", "rent due"].includes(status)
                  ) {
                    return "Deactivate";
                  } else if (status === "assigned") {
                    return "Unassign";
                  } else {
                    return "Edit";
                  }
                })()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Unit Modal - Keep existing modal code */}
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Unit to Tenant"
        w={isMobile ? "90%" : 580}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 13,
          }}
        >
          {/* Select Tenant */}
          <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
            <Lbl>Select Tenant *</Lbl>
            <select
              className="field"
              value={assignF.tenantId}
              onChange={(e) => saf("tenantId", e.target.value)}
              required
            >
              <option value="">Select tenant</option>
              {availableTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} - {tenant.email}
                </option>
              ))}
            </select>
          </div>

          {/* Select Property */}
          <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
            <Lbl>Property *</Lbl>
            <select
              className="field"
              value={assignF.propertyId}
              onChange={(e) => {
                saf("propertyId", e.target.value);
                saf("unit", "");
              }}
              required
            >
              <option value="">Select property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Select Unit */}
          <div style={{ gridColumn: isMobile ? "span 1" : "span 2" }}>
            <Lbl>Unit / Space *</Lbl>
            <select
              className="field"
              value={assignF.unit}
              onChange={(e) => saf("unit", e.target.value)}
              disabled={!assignF.propertyId}
              required
            >
              <option value="">
                {assignF.propertyId ? "Select unit" : "Select a property first"}
              </option>
              {availUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label} {u.status === "vacant" ? "(Vacant)" : "(Occupied)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            className="btn-ghost"
            onClick={() => setAssignOpen(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={saveAssign}
            disabled={busy}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            {busy ? "Assigning..." : "Assign"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function LLManagers({
  me,
  myProps,
  tab,
  setTab,
  properties = [],
  setProperties,
  log,
}) {
  const blank = {
    managerId: "",
    propertyId: "",
  };

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignF, setAssignF] = useState(blank);
  const [managers, setManagers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check for mobile and tablet on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const saf = (k, v) => setAssignF((p) => ({ ...p, [k]: v }));

  // ── Load Managers where Owner__c = me.id AND Role__c = Manager ──
  useEffect(() => {
    if (!me?.id) return;
    setLoadingManagers(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getManagersByLandlord",
      me?.id,
      function (result, event) {
        console.log("RAW result:", result);
        console.log("RAW event:", event);
        console.log("event.status:", event.status);
        console.log("event.message:", event.message);
        if (event.status && result) {
          const mapped = result.map((m) => ({
            id: m.id,
            name: m.name,
            email: m.email,
            phone: m.phone,
            role: m.role,

            properties:
              m.properties?.map((p) => ({
                id: p.Id,
                name: p.Name,
                address: p.Address__c,
                type: p.Property_Type__c,
              })) || [],
          }));
          console.log("👤 Managers loaded:", mapped);
          setManagers(mapped);
        } else {
          console.error("Failed to load managers:", event?.message);
          setManagers([]);
        }
        setLoadingManagers(false);
      },
      { escape: false }
    );
  }, [me?.id]);

  // ── Load Properties ──
  useEffect(() => {
    if (!me?.id) return;
    setPropertiesLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getLandlordProps",
      me?.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.Id,
            name: r.Name,
          }));
          console.log("🏠 Properties loaded:", mapped);
          setProperties(mapped);
        } else {
          console.error("Failed to load properties:", event?.message);
          setProperties([]);
        }
        setPropertiesLoading(false);
      },
      { escape: false }
    );
  }, [me?.id, setProperties]);

  const saveAssignProp = () => {
    if (!assignF.managerId) return setErr("Please select a manager.");
    if (!assignF.propertyId) return setErr("Please select a property.");

    // Find the selected manager and property
    const selectedManager = managers.find((m) => m.id === assignF.managerId);
    const selectedProperty = properties.find(
      (p) => p.id === assignF.propertyId
    );

    if (!selectedManager || !selectedProperty) {
      setErr("Selected manager or property not found");
      return;
    }

    // Check if property is already assigned to this manager
    const isAlreadyAssigned = selectedManager.properties.some(
      (p) => p.id === assignF.propertyId
    );

    if (isAlreadyAssigned) {
      setErr("Property is already assigned to this manager");
      setTimeout(() => setErr(""), 3000);
      return;
    }

    // Save current state for potential rollback
    const previousManagers = [...managers];
    const previousProperties = [...properties];

    // Optimistic update - add property to manager immediately
    setManagers((prevManagers) =>
      prevManagers.map((m) =>
        m.id === assignF.managerId
          ? {
              ...m,
              properties: [
                ...m.properties,
                {
                  id: selectedProperty.id,
                  name: selectedProperty.name,
                  address: selectedProperty.address,
                  type: selectedProperty.type,
                },
              ],
            }
          : m
      )
    );

    // Update property with manager info
    setProperties((prev) =>
      prev.map((p) =>
        p.id === assignF.propertyId
          ? {
              ...p,
              managerId: assignF.managerId,
              managerName: selectedManager.name,
            }
          : p
      )
    );

    setBusy(true);
    setErr("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.assignPropertyToManager",
      assignF.propertyId,
      assignF.managerId,
      function (result, event) {
        setBusy(false);

        if (event.status) {
          const response =
            typeof result === "string" ? JSON.parse(result) : result;

          if (response?.success) {
            // Success - refresh in background
            setTimeout(() => {
              refreshManagers();
              refreshProperties();
            }, 500);

            setAssignOpen(false);
            setAssignF(blank);
            log?.(
              `Property "${selectedProperty.name}" assigned to ${selectedManager.name} successfully`
            );
          } else {
            // Failed - rollback
            setManagers(previousManagers);
            setProperties(previousProperties);
            setErr(response?.message || "Failed to assign property.");
            setTimeout(() => setErr(""), 3000);
          }
        } else {
          // Failed - rollback
          setManagers(previousManagers);
          setProperties(previousProperties);
          setErr(event.message || "Remote action failed.");
          setTimeout(() => setErr(""), 3000);
        }
      },
      { escape: false }
    );
  };

  const unassignProperty = (propertyId, managerId, propertyName) => {
    if (window.confirm(`Remove "${propertyName}" from this manager?`)) {
      // Save current state for potential rollback
      const previousManagers = [...managers];
      const previousProperties = [...properties];

      // Optimistic update - remove property from UI immediately
      setManagers((prevManagers) =>
        prevManagers.map((m) =>
          m.id === managerId
            ? {
                ...m,
                properties: m.properties.filter((p) => p.id !== propertyId),
              }
            : m
        )
      );

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, managerId: "", managerName: "" } : p
        )
      );

      setBusy(true);

      Visualforce.remoting.Manager.invokeAction(
        "EstateController.assignPropertyToManager",
        propertyId,
        "",
        function (result, event) {
          setBusy(false);

          if (event.status) {
            const response =
              typeof result === "string" ? JSON.parse(result) : result;

            if (response?.success) {
              // Success - refresh in background to ensure consistency
              setTimeout(() => {
                refreshManagers();
                refreshProperties();
              }, 500);

              log?.(`Property "${propertyName}" unassigned successfully`);
            } else {
              // Failed - rollback the optimistic update
              setManagers(previousManagers);
              setProperties(previousProperties);
              setErr(response?.message || "Failed to unassign property");
              setTimeout(() => setErr(""), 3000);
            }
          } else {
            // Failed - rollback the optimistic update
            setManagers(previousManagers);
            setProperties(previousProperties);
            setErr(event.message || "Remote action failed.");
            setTimeout(() => setErr(""), 3000);
          }
        },
        { escape: false }
      );
    }
  };

  const isLoading = loadingManagers || propertiesLoading;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          color: "var(--dim)",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid var(--br)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin .7s linear infinite",
            display: "inline-block",
          }}
        />
        Loading…
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Property Managers"
        sub={`${managers.length} manager${managers.length === 1 ? "" : "s"}`}
        right={
          <button
            className="btn-primary"
            onClick={() => {
              setAssignF(blank);
              setAssignOpen(true);
            }}
            style={{
              padding: isMobile ? "8px 16px" : "9px 20px",
              borderRadius: "var(--r-md)",
              fontSize: isMobile ? 12 : 13,
            }}
          >
            + Assign Property
          </button>
        }
      />

      {/* ── Managers Grid - Responsive columns ── */}
      {managers.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--sub)",
            fontSize: 13,
          }}
        >
          No managers found. Add managers under Sub-Accounts first.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          }}
        >
          {managers.map((manager, i) => {
            const assignedProps = manager.properties || [];

            return (
              <div
                key={manager.id}
                className="card anim-up"
                style={{
                  padding: "20px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                  animationDelay: `${i * 0.04}s`,
                  height: "100%",
                }}
              >
                {/* Avatar - Centered */}
                <Avatar t={manager} size={isMobile ? 70 : 60} />

                {/* Manager Name - Bold and prominent */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 700,
                    fontSize: isMobile ? 18 : 16,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {manager.name}
                </div>

                {/* Manager Details - Stacked vertically */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    width: "100%",
                    marginBottom: 8,
                  }}
                >
                  {/* Email */}
                  <div
                    style={{
                      fontSize: isMobile ? 12 : 12.5,
                      color: "var(--sub)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <span>📧</span>
                    <span style={{ wordBreak: "break-all" }}>
                      {manager.email}
                    </span>
                  </div>

                  {/* Phone */}
                  {manager.phone && (
                    <div
                      style={{
                        fontSize: isMobile ? 12 : 12.5,
                        color: "var(--sub)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>📱</span>
                      <span>{manager.phone}</span>
                    </div>
                  )}

                  {/* Role Badge */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        padding: "4px 12px",
                        borderRadius: 99,
                        background: "var(--goldpale)",
                        color: "var(--gold)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {manager.role || "Manager"}
                    </span>
                  </div>

                  {/* Status Tag */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      marginTop: "auto",
                    }}
                  >
                    <Tag status="active" />
                  </div>
                </div>

                {/* Assigned Properties Section */}
                {assignedProps.length > 0 && (
                  <div style={{ width: "100%", marginTop: 8 }}>
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--dim)",
                        fontWeight: 600,
                        marginBottom: 10,
                        textAlign: "center",
                      }}
                    >
                      Assigned Properties ({assignedProps.length})
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 8,
                      }}
                    >
                      {/* {assignedProps.map((prop) => (
                        <div
                          key={prop.id}
                          style={{
                            padding: "10px 12px",
                            background: "var(--bg2)",
                            borderRadius: "var(--r-md)",
                            border: "1px solid var(--br)",
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--text)",
                              marginBottom: 3,
                              wordBreak: "break-word",
                            }}
                          >
                            {prop.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--sub)" }}>
                            {prop.type} · {prop.address}
                          </div>
                        </div>
                      ))} */}
                      {assignedProps.map((prop) => (
                        <div
                          key={prop.id}
                          style={{
                            padding: "10px 12px",
                            background: "var(--bg2)",
                            borderRadius: "var(--r-md)",
                            border: "1px solid var(--br)",
                            textAlign: "left",
                            position: "relative",
                          }}
                        >
                          {/* Close/Unassign Button */}
                          <button
                            onClick={() =>
                              unassignProperty(prop.id, manager.id, prop.name)
                            }
                            style={{
                              position: "absolute",
                              top: "-10px",
                              right: "-10px",
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "var(--red, #dc3545)",
                              color: "#ffffff",
                              border: "2px solid var(--bg)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontWeight: "bold",
                              padding: 0,
                              transition: "all 0.2s ease",
                              zIndex: 1,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.1)";
                              e.currentTarget.style.background =
                                "var(--red-dark, #c0392b)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                              e.currentTarget.style.background =
                                "var(--red, #dc3545)";
                            }}
                            title="Unassign property"
                          >
                            ×
                          </button>

                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--text)",
                              marginBottom: 3,
                              wordBreak: "break-word",
                              paddingRight: "16px",
                            }}
                          >
                            {prop.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: "var(--sub)" }}>
                            {prop.type} · {prop.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {assignedProps.length === 0 && (
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--dim)",
                      fontStyle: "italic",
                      textAlign: "center",
                      padding: "12px 0",
                    }}
                  >
                    No properties assigned yet.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Assign Property Modal - Responsive ── */}
      <Modal
        open={assignOpen}
        onClose={() => {
          setAssignOpen(false);
          setErr("");
        }}
        title="Assign Property to Manager"
        w={isMobile ? "90%" : 520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Select Manager */}
          <div>
            <Lbl>Select Manager *</Lbl>
            <select
              className="field"
              value={assignF.managerId}
              onChange={(e) => saf("managerId", e.target.value)}
            >
              <option value="">Choose a manager</option>
              {managers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.email}
                </option>
              ))}
            </select>
          </div>

          {/* Select Property */}
          <div>
            <Lbl>Select Property *</Lbl>
            <select
              className="field"
              value={assignF.propertyId}
              onChange={(e) => saf("propertyId", e.target.value)}
            >
              <option value="">Choose a property</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {err && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--red, #c0392b)",
                background: "var(--redpale, #fdf0ef)",
                border: "1px solid rgba(192,57,43,.2)",
                borderRadius: "var(--r-md)",
                padding: "8px 12px",
              }}
            >
              ⚠ {err}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            className="btn-ghost"
            onClick={() => {
              setAssignOpen(false);
              setErr("");
            }}
            disabled={busy}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
              opacity: busy ? 0.5 : 1,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={saveAssignProp}
            disabled={busy}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
              opacity: busy ? 0.5 : 1,
              cursor: busy ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {busy ? (
              <>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid #fff",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin .7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Assigning...
              </>
            ) : (
              "Assign Property"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}
export function LLPayments({ me, myTenants, tab, setTab }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check for mobile and tablet on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ── Load paid invoices where Payee__c === me.id ──
  useEffect(() => {
    console.log("LLPayments me:", me);
    if (!me?.id) {
      setLoading(false);
      return;
    }
    console.log("🏠 Payment Landlord:", me.id);
    setLoading(true);
    console.log("LLPayments me:", me);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getLandlordPaidInvoices",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((inv) => ({
            id: inv.Id,
            invoiceNum: inv.Invoice_Number__c,
            totalAmount: inv.Total_Amount__c,
            annualFee: inv.Annual_Fee__c,
            agentFee: inv.Agent_Fee__c,
            agreementFee: inv.Agreement_Fee__c,
            cautionlFee: inv.Caution_Fee__c,
            maintenanceFee: inv.Maintenance_Fee__c,
            securityFee: inv.Security_Fee__c,
            sanitationFee: inv.Sanitation_Fee__c,
            status: inv.Status__c,
            years: inv.Years__c,
            type: inv.Type__c,
            receiptUrl: inv.Receipt_URL__c,
            unitName: inv.Unit__r?.Name,
            unitType: inv.Unit__r?.Type__c,
            tenantName: inv.Payer__r?.Name,
            tenantId: inv.Payer__r?.Id,
            date: new Date(inv.CreatedDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          }));
          console.log("🏠 Payment loaded for Landlord:", mapped);
          setInvoices(mapped);
        } else {
          console.error("Failed to load invoices:", event.message);
          setInvoices([]);
        }
        setLoading(false);
      },
      { escape: false }
    );
  }, [me?.id]);

  // ── Confirm payment → set Status__c to Confirmed ──
  const confirmPayment = (inv) => {
    setConfirming(inv.id);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.confirmInvoicePayment",
      inv.id,
      function (result, event) {
        if (event.status) {
          setInvoices((prev) =>
            prev.map((i) =>
              i.id === inv.id ? { ...i, status: "Confirmed" } : i
            )
          );
        } else {
          console.error("Failed to confirm payment:", event.message);
        }
        setConfirming(null);
      },
      { escape: false }
    );
  };

  const grandTotal = invoices.reduce((a, i) => a + (i.totalAmount || 0), 0);

  // Status color helper
  const getStatusColor = (status) => {
    if (status === "Confirmed") return "#28a745";
    if (status === "Pending") return "#ffc107";
    return "var(--dim)";
  };

  return (
    <div>
      <PageTitle title="Payments" sub="Rent payments from your tenants" />

      {/* ── Stat Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          gap: 14,
          marginBottom: 28,
        }}
      >
        <div className="card-gold card anim-up" style={{ padding: 20 }}>
          <Lbl>Grand Total</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 500,
              color: "var(--gold)",
            }}
          >
            {fmt(grandTotal)}
          </div>
        </div>

        <div className="card anim-up" style={{ padding: 20 }}>
          <Lbl>Total Invoices</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: isMobile ? 22 : 26,
              fontWeight: 500,
              color: "var(--text)",
            }}
          >
            {invoices.length}
          </div>
        </div>
      </div>

      {/* ── Invoice Grid - Responsive columns ── */}
      {loading ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--sub)",
            fontSize: 13,
          }}
        >
          Loading payments…
        </div>
      ) : invoices.length === 0 ? (
        <div
          style={{
            padding: "40px 0",
            textAlign: "center",
            color: "var(--sub)",
            fontSize: 13,
          }}
        >
          No paid invoices yet.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          }}
        >
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="card anim-up"
              style={{
                padding: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderTop: `3px solid ${
                  inv.status === "Confirmed" ? "#28a745" : "var(--gold)"
                }`,
              }}
            >
              {/* Invoice Header */}
              <div
                style={{
                  padding: isMobile ? 16 : 20,
                  borderBottom: "1px solid var(--br)",
                  background: "var(--bg2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: isMobile ? 13 : 14,
                      color: "var(--text)",
                    }}
                  >
                    {inv.invoiceNum}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "3px 9px",
                      borderRadius: 99,
                      background:
                        inv.status === "Confirmed"
                          ? "var(--greenpale, #eaf7f0)"
                          : "var(--amberpale, #fff8e6)",
                      color: getStatusColor(inv.status),
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 12 : 13,
                    fontWeight: 600,
                    color: "var(--text)",
                  }}
                >
                  {`${inv.unitName} (${inv.unitType})`}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}
                >
                  {inv.date}
                </div>
              </div>

              {/* Invoice Details */}
              <div style={{ padding: isMobile ? 16 : 20, flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 11,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--dim)",
                  }}
                >
                  Breakdown
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  {/* Create array of fees and filter out zero values */}
                  {[
                    { label: "Annual Fee", value: inv.annualFee },
                    { label: "Agent Fee", value: inv.agentFee },
                    { label: "Agreement Fee", value: inv.agreementFee },
                    { label: "Caution Fee", value: inv.cautionlFee },
                    { label: "Maintenance Fee", value: inv.maintenanceFee },
                    { label: "Security Fee", value: inv.securityFee },
                    { label: "Sanitation Fee", value: inv.sanitationFee },
                  ]
                    .filter((fee) => fee.value > 0) // Only show fees greater than zero
                    .map((fee) => (
                      <div
                        key={fee.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: 12,
                          padding: "4px 0",
                        }}
                      >
                        <span style={{ color: "var(--sub)" }}>{fee.label}</span>
                        <span style={{ fontWeight: 500 }}>
                          ₦{fee.value?.toLocaleString()}
                        </span>
                      </div>
                    ))}

                  {/* Always show Years */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12,
                      padding: "4px 0",
                      borderTop: "1px solid var(--br)",
                      marginTop: 4,
                      paddingTop: 8,
                    }}
                  >
                    <span style={{ color: "var(--sub)" }}>Years</span>
                    <span style={{ fontWeight: 500 }}>
                      {Math.round(inv.years) || 1}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: "1px solid var(--br)",
                    fontWeight: 700,
                    fontSize: isMobile ? 14 : 15,
                    color: "var(--gold)",
                  }}
                >
                  <span>Total</span>
                  <span>₦{inv.totalAmount?.toLocaleString()}</span>
                </div>

                {/* Tenant Info */}
                <div
                  style={{
                    marginTop: 14,
                    paddingTop: 12,
                    borderTop: "1px solid var(--br)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--dim)",
                      marginBottom: 6,
                    }}
                  >
                    Tenant
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text)",
                    }}
                  >
                    {inv.tenantName || "—"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {inv.status !== "Confirmed" && (
                <div
                  style={{
                    padding: isMobile ? 12 : 16,
                    borderTop: "1px solid var(--br)",
                    background: "var(--bg2)",
                  }}
                >
                  <button
                    onClick={() => confirmPayment(inv)}
                    disabled={confirming === inv.id}
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      borderRadius: "var(--r-md)",
                      fontSize: 13,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      opacity: confirming === inv.id ? 0.6 : 1,
                      cursor: confirming === inv.id ? "not-allowed" : "pointer",
                    }}
                  >
                    {confirming === inv.id ? (
                      <>
                        <span
                          style={{
                            width: 14,
                            height: 14,
                            border: "2px solid #fff",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin .7s linear infinite",
                            display: "inline-block",
                          }}
                        />
                        Confirming...
                      </>
                    ) : (
                      "✓ Confirm Payment"
                    )}
                  </button>
                </div>
              )}

              {inv.status === "Confirmed" && inv.receiptUrl && (
                <div
                  style={{
                    padding: isMobile ? 12 : 16,
                    borderTop: "1px solid var(--br)",
                    background: "var(--bg2)",
                  }}
                >
                  <button
                    onClick={() => setPreviewUrl(inv.receiptUrl)}
                    className="btn-ghost"
                    style={{
                      width: "100%",
                      padding: "10px 0",
                      borderRadius: "var(--r-md)",
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    🧾 View Receipt
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Receipt Preview Modal ── */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg)",
              borderRadius: "var(--r-lg, 14px)",
              overflow: "hidden",
              maxWidth: isMobile ? "95%" : 540,
              width: "100%",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "1px solid var(--br)",
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 14 }}>
                Payment Receipt
              </div>
              <button
                onClick={() => setPreviewUrl(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 18,
                  cursor: "pointer",
                  color: "var(--sub)",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 20 }}>
              <img
                src={previewUrl}
                alt="Payment receipt"
                style={{
                  width: "100%",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--br)",
                  display: "block",
                }}
              />
            </div>

            <div style={{ padding: "0 20px 20px" }}>
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "10px 0",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--br)",
                  fontSize: 13,
                  color: "var(--sub)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                ↗ Open full size
              </a>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
/* ── Services ── */
// export function LLServices({
//   mySvcReqs,
//   myTenants,
//   tab,
//   setTab,
//   tickets,
//   setTickets,
//   me,
// }) {
//   console.log("🔵 LLServices component rendering", { meId: me?.id });
//   const [loadingTickets, setLoadingTickets] = useState(true);
//   const [ed, setEd] = useState(null);
//   const [resp, setResp] = useState("");

//   useEffect(() => {
//     console.log("🟡 me changed:", me);
//   }, [me]);

//   useEffect(() => {
//     console.log("🟢 Running main useEffect, me?.id =", me?.id);
//     if (!me?.id) {
//       console.log("❌ No me.id, skipping API call");
//       return;
//     }
//     setLoadingTickets(true);
//     console.log("Loading Tickets");

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getLandlordCases",
//       me.id,
//       function (result, event) {
//         try {
//           if (event.status) {
//             const mapped = (result || []).map((c) => ({
//               id: c.Id,
//               title: c.Subject,
//               unitId: c.Unit__c,
//               unitName: c.Unit__r?.Name,
//               propertyName: c.Property__r?.Name,
//               category: c.Type,
//               priority: c.Priority,
//               description: c.Description,
//               status: c.Status,
//               adminResponse: c.Comments || "",
//               submittedDate: c.CreatedDate
//                 ? new Date(c.CreatedDate).toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })
//                 : "—",
//               updatedDate: c.LastModifiedDate
//                 ? new Date(c.LastModifiedDate).toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })
//                 : "—",
//             }));

//             console.log("🎫 Cases loaded:", mapped);
//             setTickets(mapped);
//           } else {
//             console.error("Failed to load cases:", event?.message);
//             setTickets([]);
//           }
//         } catch (err) {
//           console.error("Ticket mapping error:", err);
//           setTickets([]);
//         } finally {
//           setLoadingTickets(false);
//         }
//       },
//       { escape: false, timeout: 30000 } // Add timeout
//     );
//   }, [me?.id]);

//   const updateTicket = (id, status) => {
//     setTickets((ts) =>
//       ts.map((t) =>
//         t.id === id
//           ? {
//               ...t,
//               status,
//               adminResponse: resp,
//               updatedDate: TODAY.toISOString().split("T")[0],
//             }
//           : t
//       )
//     );
//     log(`Ticket ${id} updated to ${status}`);
//     setEd(null);
//     setResp("");
//   };

//   // if (loadingTickets) {
//   //   return (
//   //     <div
//   //       style={{
//   //         display: "flex",
//   //         alignItems: "center",
//   //         justifyContent: "center",
//   //         padding: 80,
//   //         color: "var(--dim)",
//   //         gap: 10,
//   //       }}
//   //     >
//   //       <span
//   //         style={{
//   //           width: 16,
//   //           height: 16,
//   //           border: "2px solid var(--br)",
//   //           borderTopColor: "var(--gold)",
//   //           borderRadius: "50%",
//   //           animation: "spin .7s linear infinite",
//   //           display: "inline-block",
//   //         }}
//   //       />
//   //       Loading tickets…
//   //     </div>
//   //   );
//   // }

//   return (
//     <div>
//       <PageTitle
//         title="Tenant Service Requests"
//         sub={`${tickets.length} requests`}
//       />
//       {tickets.length === 0 && (
//         <div style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}>
//           No service requests yet.
//         </div>
//       )}
//       <div style={{ display: "grid", gap: 12 }}>
//         {tickets.map((tk, i) => {
//           const t = myTenants.find((x) => x.id === tk.tenantId);
//           return (
//             <div
//               key={tk.id}
//               className="card anim-up"
//               style={{ padding: "18px 22px", animationDelay: `${i * 0.04}s` }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "flex-start",
//                   flexWrap: "wrap",
//                   gap: 8,
//                   marginBottom: 8,
//                 }}
//               >
//                 <div
//                   style={{
//                     fontWeight: 600,
//                     fontSize: 14.5,
//                     color: "var(--text)",
//                   }}
//                 >
//                   {tk.title}
//                 </div>
//                 <div style={{ display: "flex", gap: 6 }}>
//                   <Tag status={tk.priority} />
//                   <Tag status={tk.status} />
//                 </div>
//               </div>
//               <div
//                 style={{ fontSize: 12.5, color: "var(--sub)", marginBottom: 8 }}
//               >
//                 {tk.description}
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: "4px 12px",
//                   fontSize: 12,
//                   color: "var(--dim)",
//                   marginBottom: 10,
//                 }}
//               >
//                 {t && <span>👤 {t.name}</span>}
//                 <span>📂 {tk.category}</span>
//                 <span>📅 {tk.submittedDate}</span>
//               </div>
//               {ed === tk.id ? (
//                 <div style={{ marginTop: 10 }}>
//                   <Lbl>Response</Lbl>
//                   <textarea
//                     className="field"
//                     rows={3}
//                     value={resp}
//                     onChange={(e) => setResp(e.target.value)}
//                     placeholder="Add your response..."
//                     style={{ marginBottom: 10, resize: "vertical" }}
//                   />
//                   <div style={{ display: "flex", gap: 8 }}>
//                     {["in_progress", "resolved"].map((s) => (
//                       <button
//                         key={s}
//                         className="btn-primary"
//                         onClick={() => updateTicket(tk.id, s)}
//                         style={{
//                           padding: "7px 14px",
//                           borderRadius: "var(--r-sm)",
//                           fontSize: 12,
//                         }}
//                       >
//                         → {s === "in_progress" ? "In Progress" : "Resolved"}
//                       </button>
//                     ))}
//                     <button
//                       className="btn-ghost"
//                       onClick={() => setEd(null)}
//                       style={{
//                         padding: "7px 14px",
//                         borderRadius: "var(--r-sm)",
//                         fontSize: 12,
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   className="btn-ghost"
//                   onClick={() => {
//                     setEd(tk.id);
//                     setResp(tk.adminResponse || "");
//                   }}
//                   style={{
//                     padding: "6px 14px",
//                     borderRadius: "var(--r-sm)",
//                     fontSize: 12,
//                   }}
//                 >
//                   Respond
//                 </button>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

export function LLServices({
  mySvcReqs,
  myTenants,
  tab,
  setTab,
  tickets,
  setTickets,
  me,
}) {
  console.log("🔵 LLServices component rendering", { meId: me?.id });
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ed, setEd] = useState(null);
  const [resp, setResp] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check for mobile and tablet on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    console.log("🟡 me changed:", me);
  }, [me]);

  useEffect(() => {
    console.log("🟢 Running main useEffect, me?.id =", me?.id);
    if (!me?.id) {
      console.log("❌ No me.id, skipping API call");
      setLoadingTickets(false);
      return;
    }
    setLoadingTickets(true);
    console.log("Loading Tickets");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getLandlordCases",
      me.id,
      function (result, event) {
        try {
          if (event.status) {
            const mapped = (result || []).map((c) => ({
              id: c.Id,
              title: c.Subject,
              unitId: c.Unit__c,
              unitName: c.Unit__r?.Name,
              propertyName: c.Property__r?.Name,
              category: c.Type,
              priority: c.Priority,
              description: c.Description,
              status: c.Status,
              adminResponse: c.Comments || "",
              imageUrls: c.Image_URL__c ? [c.Image_URL__c] : [],
              submittedDate: c.CreatedDate
                ? new Date(c.CreatedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
              updatedDate: c.LastModifiedDate
                ? new Date(c.LastModifiedDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—",
            }));

            console.log("🎫 Cases loaded:", mapped);
            setTickets(mapped);
          } else {
            console.error("Failed to load cases:", event?.message);
            setTickets([]);
          }
        } catch (err) {
          console.error("Ticket mapping error:", err);
          setTickets([]);
        } finally {
          setLoadingTickets(false);
        }
      },
      { escape: false, timeout: 30000 }
    );
  }, [me?.id]);

  const updateTicket = (id, status) => {
    setTickets((ts) =>
      ts.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              adminResponse: resp,
              updatedDate: TODAY.toISOString().split("T")[0],
            }
          : t
      )
    );
    log(`Ticket ${id} updated to ${status}`);
    setEd(null);
    setResp("");
  };

  if (loadingTickets) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 80,
          color: "var(--dim)",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            border: "2px solid var(--br)",
            borderTopColor: "var(--gold)",
            borderRadius: "50%",
            animation: "spin .7s linear infinite",
            display: "inline-block",
          }}
        />
        Loading tickets…
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Tenant Service Requests"
        sub={`${tickets.length} requests`}
      />

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : "repeat(2, 1fr)",
        }}
      >
        {tickets.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "var(--dim)",
              gridColumn: "1 / -1",
            }}
          >
            No service requests yet.
          </div>
        )}

        {tickets.map((tk, i) => {
          const t = myTenants?.find((x) => x.id === tk.tenantId);
          return (
            <div
              key={tk.id}
              className="card anim-up"
              style={{
                padding: isMobile ? "18px 16px" : "20px 24px",
                animationDelay: `${i * 0.04}s`,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              {/* Title Row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "flex-start",
                  gap: isMobile ? 10 : 8,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: isMobile ? 15 : 16,
                    color: "var(--text)",
                    flex: 1,
                  }}
                >
                  {tk.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <Tag status={tk.priority} />
                  <Tag status={tk.status} />
                </div>
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: isMobile ? 12.5 : 13,
                  color: "var(--sub)",
                  marginBottom: 12,
                  lineHeight: 1.5,
                }}
              >
                {tk.description}
              </div>

              {/* Metadata Row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? "6px 12px" : "4px 16px",
                  fontSize: isMobile ? 11 : 12,
                  color: "var(--dim)",
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: "1px solid var(--br)",
                }}
              >
                {t && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span>👤</span> {t.tenantName || t.name}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>📂</span> {tk.category}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span>📅</span> {tk.submittedDate}
                </span>
                {tk.propertyName && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span>🏢</span> {tk.propertyName}
                  </span>
                )}
                {tk.unitName && (
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span>🏠</span> {tk.unitName}
                  </span>
                )}
              </div>

              {/* ===== Image Display ===== */}
              {tk.imageUrls && tk.imageUrls.length > 0 && (
                <div style={{ marginTop: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--dim)",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Attachment
                  </div>
                  <img
                    src={tk.imageUrls[0]} // show first image (only one since single upload)
                    alt="Ticket attachment"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: "var(--r-sm)",
                      cursor: "pointer",
                      border: "1px solid var(--br)",
                    }}
                    onClick={() => window.open(tk.imageUrls[0], "_blank")}
                  />
                </div>
              )}

              {/* Response Section */}
              {ed === tk.id ? (
                <div style={{ marginTop: 8 }}>
                  <Lbl>Response</Lbl>
                  <textarea
                    className="field"
                    rows={3}
                    value={resp}
                    onChange={(e) => setResp(e.target.value)}
                    placeholder="Add your response..."
                    style={{
                      marginBottom: 12,
                      resize: "vertical",
                      fontSize: isMobile ? 13 : 14,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexDirection: isMobile ? "column" : "row",
                    }}
                  >
                    {["in_progress", "resolved"].map((s) => (
                      <button
                        key={s}
                        className="btn-primary"
                        onClick={() => updateTicket(tk.id, s)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: "var(--r-sm)",
                          fontSize: isMobile ? 12 : 12,
                          flex: isMobile ? 1 : "auto",
                        }}
                      >
                        → {s === "in_progress" ? "In Progress" : "Resolved"}
                      </button>
                    ))}
                    <button
                      className="btn-ghost"
                      onClick={() => setEd(null)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "var(--r-sm)",
                        fontSize: isMobile ? 12 : 12,
                        flex: isMobile ? 1 : "auto",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEd(tk.id);
                    setResp(tk.adminResponse || "");
                  }}
                  style={{
                    padding: isMobile ? "8px 16px" : "6px 16px",
                    borderRadius: "var(--r-sm)",
                    fontSize: isMobile ? 13 : 12,
                    marginTop: "auto",
                    alignSelf: "flex-start",
                  }}
                >
                  Respond
                </button>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function LLSubAccounts({
  managers,
  setManagers,
  tab,
  setTab,
  tenants,
  setTenants,
  me,
}) {
  // ✅ All missing state declarations added
  const [showAdd, setShowAdd] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    role: "manager",
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Check for mobile and tablet on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const sf = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const [subaccounts, setSubaccounts] = useState([
    // 👑 logged-in user
    {
      id: me?.id,
      name: me?.name,
      email: me?.email,
      phone: me?.phone,
      role: me?.type?.toUpperCase(),
      isMe: true,
    },
    // 👥 existing subaccounts from Salesforce session
    ...(me?.subaccounts || []).map((u) => ({
      id: u.Id,
      name: u.Name,
      email: u.Email__c,
      phone: u.Phone__c,
      role: u.Role__c,
      isMe: false,
    })),
  ]);

  const handleCreateSubaccount = () => {
    if (!f.name || !f.email || !f.phone) {
      return;
    }

    const otp = genOTP();

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.createSubaccount",
      f.name,
      f.email,
      f.phone,
      f.role,
      me.id,
      otp,
      function (result, event) {
        if (event.status && result?.success) {
          const newUser = {
            id: result.recordId,
            name: f.name,
            email: f.email,
            phone: f.phone,
            role: f.role.toUpperCase(),
            isMe: false,
          };

          setSubaccounts((prev) => [...prev, newUser]);

          if (f.role === "manager") {
            setManagers((prev) => [...prev, newUser]);
          } else {
            setTenants((prev) => [...prev, newUser]);
          }

          setF({ name: "", email: "", phone: "", role: "manager" });
          setShowAdd(false);
        } else {
          alert(
            "Failed to create subaccount: " +
              (event.message || result?.message || "Unknown error")
          );
        }
      }
    );
  };

  const handleResetOTP = () => {
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    const user = subaccounts.find((u) => u.id === selectedUser);
    if (!user) {
      alert("User not found");
      return;
    }

    const newOTP = genOTP();

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.resetUserOTP",
      selectedUser,
      newOTP,
      user.email,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;

          if (data.otpUsed) {
            alert("Password can only be changed by the selected user");
            return;
          }

          if (data.success) {
            alert(
              `New OTP for ${user.name}: ${newOTP}\n\nShare this with the user to log in.`
            );
            setSelectedUser("");
            setShowReset(false);
          } else {
            alert("Failed to reset OTP: " + data.message);
          }
        } else {
          alert("Error: " + event.message);
        }
      },
      { escape: false }
    );
  };

  return (
    <div>
      <PageTitle
        title="Sub-Accounts"
        sub={`${subaccounts.length} accounts`}
        right={
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: isMobile ? 8 : 12,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              className="btn-primary"
              onClick={() => setShowAdd(true)}
              style={{
                padding: isMobile ? "8px 16px" : "9px 20px",
                borderRadius: "var(--r-md)",
                fontSize: isMobile ? 12 : 13,
                width: isMobile ? "100%" : "auto",
              }}
            >
              + Add Subaccount
            </button>
            <button
              className="btn-ghost"
              onClick={() => setShowReset(true)}
              style={{
                padding: isMobile ? "8px 16px" : "9px 20px",
                borderRadius: "var(--r-md)",
                fontSize: isMobile ? 12 : 13,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Reset OTP
            </button>
          </div>
        }
      />

      {/* Subaccounts Grid - Responsive columns */}
      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
            ? "repeat(2, 1fr)"
            : "repeat(3, 1fr)",
        }}
      >
        {subaccounts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "var(--dim)",
              gridColumn: "1 / -1",
            }}
          >
            No sub-accounts yet.
          </div>
        )}

        {subaccounts.map((user, i) => (
          <div
            key={user.id}
            className="card anim-up"
            style={{
              padding: "20px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              animationDelay: `${i * 0.04}s`,
              height: "100%",
              border: user.isMe
                ? "2px solid var(--gold)"
                : "1px solid var(--br)",
              position: "relative",
            }}
          >
            {/* Avatar - Centered */}
            <Avatar t={user} size={isMobile ? 70 : 60} />

            {/* User Name - Bold and prominent */}
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: isMobile ? 18 : 16,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              {user.name}{" "}
              {user.isMe && (
                <span style={{ fontSize: 12, color: "var(--gold)" }}>
                  (You)
                </span>
              )}
            </div>

            {/* User Details - Stacked vertically */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
                marginBottom: 8,
              }}
            >
              {/* Email */}
              <div
                style={{
                  fontSize: isMobile ? 12 : 12.5,
                  color: "var(--sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span>📧</span>
                <span style={{ wordBreak: "break-all" }}>{user.email}</span>
              </div>

              {/* Phone */}
              <div
                style={{
                  fontSize: isMobile ? 12 : 12.5,
                  color: "var(--sub)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  flexWrap: "wrap",
                }}
              >
                <span>📱</span>
                <span>{user.phone}</span>
              </div>

              {/* Role Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    padding: "4px 12px",
                    borderRadius: 99,
                    background: user.isMe ? "var(--goldpale)" : "var(--bg2)",
                    color: user.isMe ? "var(--gold)" : "var(--text)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  👤 {user.role}
                </span>
              </div>
            </div>

            {/* Status Tag */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "auto",
              }}
            >
              <Tag status={user.isMe ? "owner" : "active"} />
            </div>
          </div>
        ))}
      </div>

      {/* Add Subaccount Modal - Responsive */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Subaccount"
        w={isMobile ? "90%" : 520}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 13,
          }}
        >
          <Field
            label="Full Name"
            value={f.name}
            onChange={(e) => sf("name", e.target.value)}
            span2={!isMobile}
            placeholder="e.g. Tunde Adeyemi"
          />
          <Field
            label="Email Address"
            value={f.email}
            onChange={(e) => sf("email", e.target.value)}
            span2={!isMobile}
            placeholder="user@email.com"
          />
          <Field
            label="Phone Number"
            value={f.phone}
            onChange={(e) => sf("phone", e.target.value)}
            span2={!isMobile}
            placeholder="080XXXXXXXX"
          />
          <SelectField
            label="Role"
            value={f.role}
            onChange={(e) => sf("role", e.target.value)}
            span2={!isMobile}
            options={[
              { value: "manager", label: "Manager" },
              { value: "tenant", label: "Tenant" },
            ]}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            className="btn-ghost"
            onClick={() => setShowAdd(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleCreateSubaccount}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Create Subaccount
          </button>
        </div>
      </Modal>

      {/* Reset OTP Modal - Responsive */}
      <Modal
        open={showReset}
        onClose={() => setShowReset(false)}
        title="Reset OTP"
        w={isMobile ? "90%" : 480}
      >
        <div style={{ marginBottom: 16 }}>
          <Lbl>Select User</Lbl>
          <select
            className="field"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Choose a subaccount</option>
            {subaccounts.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.email}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <button
            className="btn-ghost"
            onClick={() => setShowReset(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleResetOTP}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Generate New OTP
          </button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Will ── */
export function LLWill({ me, myWills, setWills, log, tab, setTab }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", content: "" });
  const save = () => {
    if (!f.title || !f.content) return;
    const id = `W${String(Date.now()).slice(-4)}`;
    const d = TODAY.toISOString().split("T")[0];
    setWills((ws) => [
      ...ws,
      { id, landlordId: me.id, ...f, createdDate: d, lastUpdated: d },
    ]);
    log("Will document created");
    setOpen(false);
    setF({ title: "", content: "" });
  };
  return (
    <div>
      <PageTitle
        title="Will & Estate Documents"
        sub="Manage your estate succession documents"
        right={
          <button
            className="btn-primary"
            onClick={() => setOpen(true)}
            style={{
              padding: "9px 20px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            + New Document
          </button>
        }
      />
      {myWills.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}>
          No will documents yet.
        </div>
      )}
      <div style={{ display: "grid", gap: 14 }}>
        {myWills.map((w, i) => (
          <div
            key={w.id}
            className="card anim-up"
            style={{ padding: 22, animationDelay: `${i * 0.05}s` }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontWeight: 700,
                fontSize: 18,
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              {w.title}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--dim)", marginBottom: 12 }}
            >
              Created {w.createdDate} · Last updated {w.lastUpdated}
            </div>
            <div
              style={{ fontSize: 13.5, color: "var(--sub)", lineHeight: 1.7 }}
            >
              {w.content}
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Will Document"
        w={580}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div>
            <Lbl>Document Title</Lbl>
            <input
              className="field"
              value={f.title}
              onChange={(e) => setF((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Property Distribution Will"
            />
          </div>
          <div>
            <Lbl>Content</Lbl>
            <textarea
              className="field"
              value={f.content}
              onChange={(e) => setF((p) => ({ ...p, content: e.target.value }))}
              rows={7}
              placeholder="Write your will content here..."
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            className="btn-ghost"
            onClick={() => setOpen(false)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={save}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            Save Document
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function LLProfile({ me, log, tab, setTab }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [agreement, setAgreement] = useState([]);
  const [loadingAgreement, setLoadingAgreement] = useState(false);
  const [agreementError, setAgreementError] = useState("");
  const [f, setF] = useState({
    bankName: me.bankName || "",
    accountName: me.accountName || "",
    accountNumber: me.accountNumber || "",
    rentPol: "",
    landlordRes: "",
    maintenancePol: "",
    tenancyRules: "",
  });

  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--br)",
    outline: "none",
    background: "var(--bg2)",
    fontSize: 13,
    color: "var(--text)",
    boxSizing: "border-box",
  };

  const textBoxStyle = {
    width: "100%",
    height: 180,
    maxHeight: 180,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--br)",
    outline: "none",
    background: "var(--bg2)",
    fontSize: 13,
    color: "var(--text)",
    boxSizing: "border-box",
    resize: "vertical", // ← lets user resize if needed
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 12,
    color: "var(--sub)",
    marginBottom: 4,
    display: "block",
  };

  const loadTenancyAgreement = () => {
    if (!me?.id) return;

    setLoadingAgreement(true);
    setAgreementError("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenancyAgreement",
      me.id,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;

          if (data.success) {
            setAgreement(data.data);

            console.log("✅ Tenancy Agreement:", data.data);
          } else {
            setAgreementError(data.message);
          }
        } else {
          setAgreementError(event.message || "Failed to load agreement");
        }

        setLoadingAgreement(false);
      },
      { escape: false }
    );
  };

  useEffect(() => {
    if (me?.id) {
      loadTenancyAgreement();
    }
  }, [me?.id]);

  useEffect(() => {
    if (agreement) {
      setF((prev) => ({
        ...prev,

        rentPol: agreement.rentPolicy || "",
        landlordRes: agreement.landlordResponsibility || "",
        maintenancePol: agreement.maintenancePolicy || "",
        tenancyRules: agreement.tenancyPolicy || "",
      }));
    }
  }, [agreement]);

  const saveAgreementDetails = () => {
    console.log(f.rentPol);
    console.log(f.landlordRes);
    console.log(f.maintenancePol);
    console.log(f.tenancyRules);
    if (!f.rentPol || !f.landlordRes || !f.maintenancePol || !f.tenancyRules) {
      setErr("Please fill all fields.");
      return;
    }

    setBusy(true);
    setErr("");
    setSuccess("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.saveTenancyAgreement", // ← was saveBankDetails
      me?.id,
      f.rentPol,
      f.landlordRes,
      f.maintenancePol,
      f.tenancyRules,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;
          if (data.success) {
            setSuccess("Tenancy Agreement saved successfully.");
            log("Tenancy Agreement details updated.");
          } else {
            setErr(data.message || "Failed to save.");
          }
        } else {
          setErr(event.message || "An error occurred.");
        }
        setBusy(false);
      },
      { escape: false }
    );
  };

  const saveBankDetails = () => {
    if (!f.bankName || !f.accountName || !f.accountNumber) {
      setErr("Please fill all fields.");
      return;
    }

    setBusy(true);
    setErr("");
    setSuccess("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.saveBankDetails",
      me?.id,
      f.bankName,
      f.accountName,
      f.accountNumber,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;
          if (data.success) {
            setSuccess("Bank details saved successfully.");
            log("Bank details updated.");
          } else {
            setErr(data.message || "Failed to save.");
          }
        } else {
          setErr(event.message || "An error occurred.");
        }
        setBusy(false);
      },
      { escape: false }
    );
  };

  const hasBankDetails = me.bankName || me.accountName || me.accountNumber;

  return (
    <div>
      <PageTitle title="Profile" sub="Manage your account details" />

      <div className="card" style={{ padding: 28, maxWidth: 540 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          {hasBankDetails ? "Update Bank Details" : "Add Bank Details"}
        </div>
        <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 24 }}>
          This information will be used for rent payments and disbursements.
        </div>

        {err && (
          <div
            style={{
              background: "rgba(220, 53, 69, 0.1)",
              color: "#dc3545",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {err}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "rgba(40, 167, 69, 0.1)",
              color: "#28a745",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {success}
          </div>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={labelStyle}>Bank Name</label>
            <input
              type="text"
              value={f.bankName}
              onChange={(e) => sf("bankName", e.target.value)}
              style={inputStyle}
              placeholder="e.g. First Bank"
            />
          </div>

          <div>
            <label style={labelStyle}>Account Name</label>
            <input
              type="text"
              value={f.accountName}
              onChange={(e) => sf("accountName", e.target.value)}
              style={inputStyle}
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label style={labelStyle}>Account Number</label>
            <input
              type="text"
              value={f.accountNumber}
              onChange={(e) => sf("accountNumber", e.target.value)}
              style={inputStyle}
              placeholder="e.g. 0123456789"
              maxLength={10}
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              className="btn-primary"
              onClick={saveBankDetails}
              disabled={busy}
              style={{
                padding: "10px 28px",
                borderRadius: "var(--r-md)",
                fontSize: 13,
                float: "right",
              }}
            >
              {busy ? "Saving..." : "Save Details"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          display: "grid",
          gap: 16,
          marginTop: 32,
          padding: 32,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text)",
            marginBottom: 4,
          }}
        >
          Tenancy Agreement
        </div>
        <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 24 }}>
          This information will be used to create the content of Tenancy
          Agreement Contract.
        </div>

        {err && (
          <div
            style={{
              background: "rgba(220, 53, 69, 0.1)",
              color: "#dc3545",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {err}
          </div>
        )}
        {/* <div>
          <label style={labelStyle}>Rent Payment Policy</label>
          <textarea
            value={f.rentPol}
            onChange={(e) => sf("rentPol", e.target.value)}
            style={textBoxStyle}
            placeholder="e.g. Rent is due on the 1st of every month..."
          />
          
        </div> */}
        <div style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={labelStyle}>Rent Payment Policy</label>
            <RichTextEditor
              style={textBoxStyle}
              value={f.rentPol}
              onChange={(html) => sf("rentPol", html)}
              placeholder="e.g. Rent is due on the 1st of every month..."
              height={200}
            />
          </div>

          <div>
            <label style={labelStyle}>Landlord Responsibility</label>
            <RichTextEditor
              style={textBoxStyle}
              value={f.landlordRes}
              onChange={(html) => sf("landlordRes", html)}
              placeholder="e.g. Landlord is responsible for..."
            />
          </div>
          <div>
            <label style={labelStyle}>Maintenance Policy</label>
            <RichTextEditor
              value={f.maintenancePol}
              onChange={(html) => sf("maintenancePol", html)}
              placeholder="e.g. Tenant must report damage within..."
              height={200}
            />
          </div>
          <div>
            <label style={labelStyle}>Tenancy Rules</label>
            <RichTextEditor
              value={f.tenancyRules}
              onChange={(html) => sf("tenancyRules", html)}
              placeholder="e.g. No subletting, no pets..."
              height={200}
            />
          </div>
        </div>

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <button
            className="btn-primary"
            onClick={saveAgreementDetails}
            disabled={busy}
            style={{
              padding: "10px 28px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
            }}
          >
            {busy ? "Saving..." : "Save Details"}
          </button>
        </div>
      </div>
    </div>
  );
}
