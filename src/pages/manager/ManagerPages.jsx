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
import { fmt, TODAY } from "../../utils";

/* ── Overview ── */
// export function MgrOverview({
//   me,
//   myTenants,
//   setMyTenants,
//   myLandlord,
//   tab,
//   setTab,
//   tenants,
//   setTenants,
//   properties = [],
//   setProperties,
// }) {
//   return (
//     <div>
//       <div className="anim-up" style={{ marginBottom: 28 }}>
//         <h2
//           style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: 28,
//             fontWeight: 600,
//             color: "var(--text)",
//             marginBottom: 3,
//           }}
//         >
//           Welcome, <span className="gold-static">{me.name.split(" ")[0]}</span>
//         </h2>
//         <p style={{ color: "var(--sub)", fontSize: 13.5 }}>
//           Manager · {myLandlord ? `Managing for ${myLandlord.name}` : ""}
//         </p>
//       </div>
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
//           gap: 12,
//           marginBottom: 26,
//         }}
//       >
//         {[
//           // { label: "Properties", val: myProps.length, accent: "var(--gold)" },
//           { label: "Tenants", val: myTenants.length, accent: "var(--blue)" },
//           // { label: "Open Tickets", val: openTickets, accent: "var(--red)" },
//         ].map(({ label, val, accent }, i) => (
//           <div
//             key={i}
//             className="card anim-up"
//             style={{
//               padding: "16px 14px",
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
//                 fontSize: 26,
//                 fontWeight: 500,
//                 color: "var(--text)",
//               }}
//             >
//               {val}
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="card anim-up d2" style={{ padding: 22 }}>
//         <div
//           style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: 16,
//             fontWeight: 600,
//             color: "var(--text)",
//             marginBottom: 14,
//           }}
//         >
//           Properties Under Management
//         </div>
//         {properties.map((p, i, a) => (
//           <div
//             key={p.id}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               padding: "9px 0",
//               borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none",
//               fontSize: 13,
//             }}
//           >
//             <span style={{ fontWeight: 500, color: "var(--text)" }}>
//               {p.name}
//             </span>
//             <span style={{ color: "var(--sub)" }}>
//               {p.units.length} units ·{" "}
//               {(p.units || []).filter((u) => u.status === "occupied").length}{" "}
//               tenants
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
export function MgrOverview({
  me,
  myTenants,
  setMyTenants,
  myLandlord,
  tab,
  setTab,
  tenants,
  setTenants,
  properties = [],
  setProperties,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set loading to false when properties are received
  useEffect(() => {
    if (properties && properties.length >= 0) {
      setIsLoading(false);
    }
  }, [properties]);

  // Loading state
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
        Loading overview...
      </div>
    );
  }

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
            {me.name?.split(" ")[0] || "User"}
          </span>
        </h2>
        <p style={{ color: "var(--sub)", fontSize: isMobile ? 12.5 : 13.5 }}>
          Manager · {myLandlord ? `Managing for ${myLandlord.name}` : ""}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 26,
        }}
      >
        {[
          {
            label: "Tenants",
            val: myTenants?.length || 0,
            accent: "var(--blue)",
          },
          {
            label: "Properties",
            val: properties?.length || 0,
            accent: "var(--gold)",
          },
        ].map(({ label, val, accent }, i) => (
          <div
            key={i}
            className="card anim-up"
            style={{
              padding: isMobile ? "16px 14px" : "16px 14px",
              position: "relative",
              overflow: "hidden",
              animationDelay: `${i * 0.06}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg,transparent,${accent},transparent)`,
              }}
            />
            <Lbl>{label}</Lbl>
            <div
              style={{
                fontFamily: "'DM Mono',monospace",
                fontSize: isMobile ? 22 : 26,
                fontWeight: 500,
                color: "var(--text)",
              }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>

      <div className="card anim-up d2" style={{ padding: isMobile ? 18 : 22 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? 15 : 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 14,
          }}
        >
          Properties Under Management
        </div>
        {!properties || properties.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "var(--dim)",
              fontSize: 13,
            }}
          >
            No properties assigned yet.
          </div>
        ) : (
          properties.map((p, i, a) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none",
                fontSize: 13,
                flexWrap: isMobile ? "wrap" : "nowrap",
                gap: isMobile ? 8 : 0,
              }}
            >
              <span style={{ fontWeight: 500, color: "var(--text)" }}>
                {p.name}
              </span>
              <span
                style={{ color: "var(--sub)", fontSize: isMobile ? 11 : 12 }}
              >
                {p.units?.length || 0} units ·{" "}
                {(p.units || []).filter((u) => u.status === "occupied").length}{" "}
                tenants
              </span>
            </div>
          ))
        )}
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
/* ── Properties (manager can add for landlord) ── */
export function MgrProperties({
  me,
  myTenants,
  tab,
  setTab,
  properties = [],
  setProperties,
  log,
  landlordId,
  landlords,
}) {
  const blank = { name: "", type: "flat", address: "", units: [] };
  const [open, setOpen] = useState(false);
  // const [f, setF] = useState(blank);
  const [unitLabel, setUnitLabel] = useState("");
  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const landlord = landlords.find((l) => l.id === landlordId);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
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

  // const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const [unitF, setUnitF] = useState({ label: "", measurement: "" });

  const saveUnit = () => {
    if (!editUnit?.id) return;

    setBusy(true);
    setErr("");

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
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;

          if (data.success) {
            console.log("✅ Unit updated");

            // ✅ Update UI immediately
            setProperties((prev) =>
              prev.map((p) => ({
                ...p,
                units: (p.units || []).map((u) =>
                  u.id === editUnit.id ? { ...editUnit } : u
                ),
              }))
            );

            setEditOpen(false); // close modal
          } else {
            setErr(data.message);
          }
        } else {
          setErr(event.message || "Update failed");
        }

        setBusy(false);
      }
      // { escape: false }
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
        }
        setLoadingUnit(false);
      }
      // { escape: false }
    );
  };

  // Loading state
  if (!properties || properties.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}>
        Loading properties...
      </div>
    );
  }

  const landSubtypes = ["plot", "acre", "hectare"];

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

  if (selectedProp) {
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
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--br)",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(20px, 5vw, 28px)",
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
            <button
              className="btn-primary"
              onClick={() => setShowAddUnit(true)}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--r-sm)",
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              + Add Unit
            </button>
          </div>

          {/* Property Stats */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 24,
              paddingBottom: 20,
              borderBottom: "1px solid var(--br)",
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
                maxHeight: "min(400px, 60vh)",
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
                    {/* Left side */}
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

                    {/* Status */}
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

                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        // setEditUnit(unit);
                        // setEditOpen(true);
                        openEditModal(unit); // ← replaces the two-linerss
                      }}
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

        {/* Add Unit Modal */}
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
        <Modal
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            setEditUnit(null);
          }}
          title={`Edit ${editUnit?.label || "Unit"}`}
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
            <div style={{ display: "grid", gap: 14 }}>
              {/* Error */}
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

              {/* TYPE */}
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

              {/* ANNUAL FEE */}
              <div>
                <label style={labelStyle}>Annual Fee</label>
                <input
                  type="number"
                  value={editUnit.annualFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({ ...p, annualFee: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* AGREEMENT FEE */}
              <div>
                <label style={labelStyle}>Agreement Fee</label>
                <input
                  type="number"
                  value={editUnit.agreementFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({ ...p, agreementFee: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* AGENT FEE */}
              <div>
                <label style={labelStyle}>Agent Fee</label>
                <input
                  type="number"
                  value={editUnit.agentFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({ ...p, agentFee: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* CAUTION FEE */}
              <div>
                <label style={labelStyle}>Caution Fee</label>
                <input
                  type="number"
                  value={editUnit.cautionFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({ ...p, cautionFee: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* MAINTENANCE FEE */}
              <div>
                <label style={labelStyle}>Maintenance Fee</label>
                <input
                  type="number"
                  value={editUnit.maintenanceFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({
                      ...p,
                      maintenanceFee: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* SANITATION FEE */}
              <div>
                <label style={labelStyle}>Sanitation Fee</label>
                <input
                  type="number"
                  value={editUnit.sanitationFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({
                      ...p,
                      sanitationFee: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Security Fee</label>
                <input
                  type="number"
                  value={editUnit.securityFee || ""}
                  onChange={(e) =>
                    setEditUnit((p) => ({
                      ...p,
                      securityFee: e.target.value,
                    }))
                  }
                  style={inputStyle}
                />
              </div>

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    setEditOpen(false);
                    setEditUnit(null);
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
                  onClick={saveUnit}
                  disabled={busy}
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
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Properties"
        sub={`${properties.length} properties managed`}
        // right={
        //   <button
        //     className="btn-primary"
        //     onClick={() => {
        //       setF(blank);
        //       setOpen(true);
        //     }}
        //     style={{
        //       padding: "9px 20px",
        //       borderRadius: "var(--r-md)",
        //       fontSize: 13,
        //     }}
        //   >
        //     + Add Property
        //   </button>
        // }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 380px), 1fr))",
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
                minHeight: 280,
                overflow: "hidden",
              }}
              onClick={() => setSelectedProp(prop)}
            >
              {/* Card Header */}
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

                {/* Property Stats */}
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

              {/* Units List with Scroll */}
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
    </div>
  );
}

/* ── Tenants (manager can add + assign) ── */
// export function MgrTenants({
//   me,
//   myTenants,
//   setMyTenants,
//   myLandlord,
//   tab,
//   setTab,
//   tenants,
//   properties = [],
//   setProperties,
//   log,
//   push,
// }) {
//   const blank = {
//     tenantId: "", // Selected tenant ID
//     propertyId: "", // Selected property ID
//     unit: "", // Selected unit label
//     // rentDueDay: "1",
//     // leaseStart: "",
//     // leaseEnd: "",
//   };

//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");
//   const [assignOpen, setAssignOpen] = useState(false);
//   const [ed, setEd] = useState(null);
//   const [f, setF] = useState(blank);
//   const [assignF, setAssignF] = useState(blank);
//   // const [myTenantLoading, setmyTenantLoading] = useState(true);

//   const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));
//   const saf = (k, v) => setAssignF((p) => ({ ...p, [k]: v }));

//   // Get selected property and its units
//   const selectedProperty = properties.find((p) => p.id === assignF.propertyId);
//   const availUnits = selectedProperty?.units || [];
//   const availableTenants = tenants;

//   const saveManagerAssign = () => {
//     if (!assignF.tenantId) return setErr("Please select a tenant.");
//     if (!assignF.propertyId) return setErr("Please select a property.");
//     if (!assignF.unit) return setErr("Please select a unit.");

//     setBusy(true);
//     setErr("");

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.assignUnit",
//       assignF.propertyId,
//       assignF.unit,
//       assignF.tenantId,
//       myLandlord?.id,
//       function (result, event) {
//         setBusy(false);
//         if (event.status) {
//           const response =
//             typeof result === "string" ? JSON.parse(result) : result;
//           if (response?.success) {
//             console.log("✅ Unit assigned:", response);
//             setAssignOpen(false);
//             setAssignF(blank);
//             setErr("");
//             log?.(`Unit assigned successfully`);
//             // Re-fetch to reflect the new assignment
//             // ✅ Use the same method name as in useEffect
//             Visualforce.remoting.Manager.invokeAction(
//               "EstateController.getManagerUnits", // was: getUnits
//               me.id,
//               function (r2, e2) {
//                 if (e2.status && r2) {
//                   setMyTenants(
//                     r2.map((r) => ({
//                       id: r.Id,
//                       label: r.Name,
//                       tenancy: r.Tenancy_Status__c,
//                       occupancy: r.Occupancy_Status__c,
//                       tenantId: r.Tenant__c,
//                       tenantName: r.Tenant__r?.Name || "",
//                       tenantEmail: r.Tenant__r?.Email__c || "",
//                       propertyName: r.Property_Lookup__r?.Name || "",
//                     }))
//                   );
//                 }
//               },
//               { escape: false }
//             );
//           } else {
//             setErr(response?.message || "Failed to assign unit.");
//           }
//         } else {
//           setErr(event.message || "Remote action failed.");
//         }
//       },
//       { escape: false }
//     );
//   };

//   // if (myTenantLoading) {
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
//   //       Loading tenants...
//   //     </div>
//   //   );
//   // }

//   return (
//     <div>
//       <PageTitle
//         title="My Tenants"
//         sub={`${myTenants.length} tenant${myTenants.length === 1 ? "" : "s"}`}
//         right={
//           <button
//             className="btn-primary"
//             onClick={() => {
//               setEd(null);
//               setAssignF(blank);
//               setAssignOpen(true);
//             }}
//             style={{
//               padding: "9px 20px",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             + Assign Unit
//           </button>
//         }
//       />
//       <div style={{ display: "grid", gap: 12 }}>
//         {myTenants.map((t, i) => (
//           <div
//             key={t.id}
//             className="card anim-up"
//             style={{
//               padding: "16px 16px",
//               display: "flex",
//               alignItems: "flex-start",
//               flexWrap: "wrap",
//               gap: 12,
//               animationDelay: `${i * 0.04}s`,
//             }}
//           >
//             <Avatar t={{ ...t, name: t.tenantName }} size={44} />
//             <div style={{ flex: 1 }}>
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontWeight: 700,
//                   fontSize: 16,
//                   color: "var(--text)",
//                   marginBottom: 4,
//                 }}
//               >
//                 {t.tenantName}
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: "3px 14px",
//                   fontSize: 12.5,
//                   color: "var(--sub)",
//                 }}
//               >
//                 {t.propertyName && <span>🏢 {t.propertyName}</span>}
//                 <span>🏠 {t.label}</span>
//                 <span>📧 {t.tenantEmail}</span>
//                 {t.rentAmount && (
//                   <span
//                     style={{
//                       fontFamily: "'DM Mono',monospace",
//                       fontSize: 11.5,
//                     }}
//                   >
//                     {fmt(t.rentAmount)}/yr
//                   </span>
//                 )}
//                 {t.leaseEnd && <span>Lease → {t.leaseEnd}</span>}
//               </div>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 gap: 8,
//                 marginLeft: "auto",
//               }}
//             >
//               <Tag status={t.tenancy || "active"} />
//               <button
//                 className="btn-ghost"
//                 onClick={() => {
//                   setEd(t);
//                   setF({ ...t });
//                 }}
//                 style={{
//                   padding: "6px 14px",
//                   borderRadius: "var(--r-sm)",
//                   fontSize: 12,
//                 }}
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* Assign Unit Modal */}
//       <Modal
//         open={assignOpen}
//         onClose={() => setAssignOpen(false)}
//         title="Assign Unit to Tenant"
//         w={580}
//       >
//         <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 13 }}>
//           {/* Select Tenant */}
//           <div>
//             <Lbl>Select Tenant *</Lbl>
//             <select
//               className="field"
//               value={assignF.tenantId}
//               onChange={(e) => saf("tenantId", e.target.value)}
//               required
//             >
//               <option value="">Select tenant</option>
//               {availableTenants.map((tenant) => (
//                 <option key={tenant.id} value={tenant.id}>
//                   {tenant.name} - {tenant.email}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Select Property */}
//           <div>
//             <Lbl>Property *</Lbl>
//             <select
//               className="field"
//               value={assignF.propertyId}
//               onChange={(e) => {
//                 saf("propertyId", e.target.value);
//                 saf("unit", ""); // Reset unit when property changes
//               }}
//               required
//             >
//               <option value="">Select property</option>
//               {properties.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name} ({p.type})
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Select Unit */}
//           {/* <div style={{ gridColumn: "span 2" }}>
//           <Lbl>Unit / Space *</Lbl>
//           <select
//             className="field"
//             value={assignF.unit}
//             onChange={(e) => saf("unit", e.target.value)}
//             disabled={!assignF.propertyId}
//             required
//           >
//             <option value="">
//               {assignF.propertyId ? "Select unit" : "Select a property first"}
//             </option>
//             {availUnits.map((u) => (
//               <option key={u.id} value={u.label}>
//                 {u.label} {u.status === "vacant" ? "(Vacant)" : "(Occupied)"}
//               </option>
//             ))}
//           </select>
//         </div> */}
//           {/* Select Unit */}
//           <div>
//             <Lbl>Unit / Space *</Lbl>
//             <select
//               className="field"
//               value={assignF.unit}
//               onChange={(e) => saf("unit", e.target.value)}
//               disabled={!assignF.propertyId}
//               required
//             >
//               <option value="">
//                 {assignF.propertyId ? "Select unit" : "Select a property first"}
//               </option>
//               {availUnits.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {" "}
//                   {/* ✅ Changed from u.label to u.id */}
//                   {u.label} {u.status === "vacant" ? "(Vacant)" : "(Occupied)"}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Optional Lease Fields */}
//           {/* <Field
//           label="Rent Due Day (1-28)"
//           value={assignF.rentDueDay}
//           onChange={(e) => saf("rentDueDay", e.target.value)}
//           type="number"
//           half
//         />
//         <Field
//           label="Lease Start"
//           value={assignF.leaseStart}
//           onChange={(e) => saf("leaseStart", e.target.value)}
//           type="date"
//           half
//         />
//         <Field
//           label="Lease End"
//           value={assignF.leaseEnd}
//           onChange={(e) => saf("leaseEnd", e.target.value)}
//           type="date"
//           half
//         /> */}
//         </div>

//         <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//           <button
//             className="btn-ghost"
//             onClick={() => setAssignOpen(false)}
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
//             onClick={saveManagerAssign}
//             style={{
//               flex: 2,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             Assign
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

export function MgrTenants({
  me,
  myTenants,
  setMyTenants,
  myLandlord,
  tab,
  setTab,
  tenants,
  properties = [],
  setProperties,
  log,
  push,
}) {
  const blank = {
    tenantId: "",
    propertyId: "",
    unit: "",
  };

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [ed, setEd] = useState(null);
  const [f, setF] = useState(blank);
  const [assignF, setAssignF] = useState(blank);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Set loading to false when myTenants are received
  useEffect(() => {
    if (myTenants && myTenants.length >= 0) {
      setLoading(false);
    }
  }, [myTenants]);

  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const saf = (k, v) => setAssignF((p) => ({ ...p, [k]: v }));

  const selectedProperty = properties.find((p) => p.id === assignF.propertyId);
  const availUnits = selectedProperty?.units || [];
  const availableTenants = tenants;

  const saveManagerAssign = () => {
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
      myLandlord?.id,
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
              "EstateController.getManagerUnits",
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

  // Loading state
  if (loading) {
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

  // Determine button text based on status
  const getButtonText = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (["active", "accepted", "paid", "rent due"].includes(statusLower)) {
      return "Deactivate";
    } else if (statusLower === "assigned") {
      return "Unassign";
    }
    return "Edit";
  };

  const getButtonColor = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "assigned") return "var(--red, #dc3545)";
    return "var(--gold)";
  };

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

      {/* Responsive Grid */}
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
        {myTenants.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 60,
              color: "var(--dim)",
              gridColumn: "1 / -1",
            }}
          >
            No tenants assigned yet.
          </div>
        ) : (
          myTenants.map((t, i) => (
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
                height: "100%",
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
                  <span style={{ wordBreak: "break-all" }}>
                    {t.tenantEmail}
                  </span>
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
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
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

              {/* Status and Action Button */}
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
                    background: getButtonColor(t.tenancy),
                  }}
                >
                  {getButtonText(t.tenancy)}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Assign Unit Modal - Responsive */}
      <Modal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        title="Assign Unit to Tenant"
        w={isMobile ? "90%" : 580}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 13 }}>
          {/* Select Tenant */}
          <div>
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
          <div>
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
          <div>
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
            onClick={saveManagerAssign}
            disabled={busy}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
              opacity: busy ? 0.6 : 1,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Assigning..." : "Assign"}
          </button>
        </div>
      </Modal>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function MgrTickets({
  me,
  myTickets,
  myTenants,
  tab,
  setTab,
  tickets,
  setTickets,
  log,
}) {
  const [ed, setEd] = useState(null);
  const [resp, setResp] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);
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
    console.log("MgrTickets me:", me);
    console.log("MgrTickets me.id:", me?.id);
  }, [me]);

  useEffect(() => {
    if (!me?.id) return;
    setLoadingTickets(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getManagerCases",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((c) => ({
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
        setLoadingTickets(false);
      },
      { escape: false }
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
        title="Maintenance Tickets"
        sub={`${tickets.length} tickets`}
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
            No maintenance tickets.
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

// export function MgrSubAccounts({
//   tab,
//   setTab,
//   tenants,
//   setTenants,
//   me,
//   myLandlord,
// }) {
//   // ✅ All missing state declarations added
//   const [showAdd, setShowAdd] = useState(false);
//   const [showReset, setShowReset] = useState(false);
//   const [f, setF] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     role: "tenant",
//   });
//   const [selectedUser, setSelectedUser] = useState("");

//   const sf = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

//   const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//   // const subaccounts = [
//   //   ...managers.filter((m) => m.landlordId === me.id),
//   //   ...tenants.filter((t) => t.landlordId === me.id),
//   // ];

//   const [subaccounts, setSubaccounts] = useState([
//     // 👑 include logged-in user (me)
//     {
//       id: me?.id,
//       name: me?.name,
//       email: me?.email,
//       phone: me?.phone,
//       role: me?.type?.toUpperCase(), // MANAGER
//       isMe: true,
//     },

//     {
//       id: myLandlord?.id,
//       name: myLandlord?.name,
//       email: myLandlord?.email,
//       phone: myLandlord?.phone,
//       role: myLandlord?.role?.toUpperCase(), // MANAGER
//       isMe: false,
//     },

//     // 👥 include subaccounts from Salesforce
//     ...(me?.subaccounts || []).map((u) => ({
//       id: u.Id,
//       name: u.Name,
//       email: u.Email__c,
//       phone: u.Phone__c,
//       role: u.Role__c.toUpperCase(),
//       isMe: false,
//     })),
//   ]);

//   const handleCreateTenant = () => {
//     if (!f.name || !f.email || !f.phone) {
//       alert("Please fill all fields");
//       return;
//     }

//     const otp = genOTP();

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.createTenant",
//       f.name,
//       f.email,
//       f.phone,
//       f.role,
//       me.id,
//       myLandlord.id,
//       otp,
//       function (result, event) {
//         if (event.status && result?.success) {
//           const newUser = {
//             id: result.recordId,
//             name: f.name,
//             email: f.email,
//             phone: f.phone,
//             managerId: me.id,
//             landlordId: myLandlord.id,
//             otp: otp,
//             otpUsed: false,
//             status: "active",
//           };

//           setSubaccounts((prev) => [...prev, newUser]);

//           if (f.role === "tenant") {
//             // setManagers((prev) => [...prev, newUser]);
//           } else {
//             setTenants((prev) => [...prev, newUser]);
//           }

//           // alert(`Subaccount created. OTP: ${otp}`);
//           setF({ name: "", email: "", phone: "", role: "tenant" });
//           setShowAdd(false);
//         } else {
//           alert(
//             "Failed to create subaccount: " +
//               (event.message || result?.message || "Unknown error")
//           );
//         }
//       }
//     );
//   };

//   const handleResetOTP = () => {
//     if (!selectedUser) {
//       alert("Please select a user");
//       return;
//     }

//     // Find the selected user to get their email for hashing
//     const user = subaccounts.find((u) => u.id === selectedUser);
//     if (!user) {
//       alert("User not found");
//       return;
//     }

//     const newOTP = genOTP();

//     // Hash the OTP the same way as login: SHA-256(otp + email)
//     // We send the raw OTP + email to Apex and let it hash server-side
//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.resetUserOTP",
//       selectedUser,
//       newOTP, // ← Apex will hash this with the user's email
//       user.email, // ← needed for hashing
//       function (result, event) {
//         if (event.status) {
//           const data = typeof result === "string" ? JSON.parse(result) : result;

//           if (data.otpUsed) {
//             // 🔒 User already logged in and changed their password
//             alert("Password can only be changed by the selected user");
//             return;
//           }

//           if (data.success) {
//             alert(
//               `New OTP for ${user.name}: ${newOTP}\n\nShare this with the user to log in.`
//             );
//             setSelectedUser("");
//             setShowReset(false);
//           } else {
//             alert("Failed to reset OTP: " + data.message);
//           }
//         } else {
//           alert("Error: " + event.message);
//         }
//       },
//       { escape: false }
//     );
//   };

//   return (
//     <div>
//       <PageTitle
//         title="Sub-Accounts"
//         sub={`${subaccounts.length} accounts`}
//         right={
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               flexWrap: "wrap",
//               gap: 10,
//             }}
//           >
//             <button
//               className="btn-primary"
//               onClick={() => setShowAdd(true)}
//               style={{
//                 padding: "9px 20px",
//                 borderRadius: "var(--r-md)",
//                 fontSize: 13,
//               }}
//             >
//               + Add Subaccount
//             </button>
//             <button
//               className="btn-ghost"
//               onClick={() => setShowReset(true)}
//               style={{
//                 padding: "9px 20px",
//                 borderRadius: "var(--r-md)",
//                 fontSize: 13,
//               }}
//             >
//               Reset OTP
//             </button>
//           </div>
//         }
//       />

//       {/* Subaccounts list */}
//       <div style={{ display: "grid", gap: 12 }}>
//         {subaccounts.length === 0 && (
//           <div
//             style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}
//           >
//             No sub-accounts yet.
//           </div>
//         )}

//         {subaccounts.map((user, i) => (
//           <div
//             key={user.id}
//             className="card anim-up"
//             style={{
//               padding: "14px 16px",
//               display: "flex",
//               alignItems: "flex-start",
//               flexWrap: "wrap",
//               gap: 12,
//               animationDelay: `${i * 0.04}s`,

//               // 👑 highlight logged-in user
//               border: user.isMe
//                 ? "1px solid var(--gold)"
//                 : "1px solid var(--br)",
//             }}
//           >
//             <Avatar t={user} size={42} />

//             <div style={{ flex: 1 }}>
//               {/* NAME */}
//               <div
//                 style={{
//                   fontFamily: "'Cormorant Garamond',serif",
//                   fontWeight: 700,
//                   fontSize: 16,
//                   color: "var(--text)",
//                   marginBottom: 4,
//                 }}
//               >
//                 {user.name}{" "}
//                 {user.isMe && (
//                   <span style={{ fontSize: 12, color: "var(--gold)" }}>
//                     (You)
//                   </span>
//                 )}
//               </div>

//               {/* DETAILS */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexWrap: "wrap",
//                   gap: "3px 14px",
//                   fontSize: 12.5,
//                   color: "var(--sub)",
//                 }}
//               >
//                 <span>📧 {user.email}</span>
//                 <span>📱 {user.phone}</span>

//                 {/* ROLE */}
//                 <span
//                   style={{
//                     background: "var(--bg2)",
//                     padding: "2px 8px",
//                     borderRadius: "var(--r-sm)",
//                     fontSize: 11,
//                     color: "var(--text)",
//                   }}
//                 >
//                   👤 {user.role}
//                 </span>
//               </div>
//             </div>

//             <Tag status={user.isMe ? "owner" : "active"} />
//           </div>
//         ))}
//       </div>

//       {/* Add Subaccount Modal — only once */}
//       <Modal
//         open={showAdd}
//         onClose={() => setShowAdd(false)}
//         title="Add Subaccount"
//         w={520}
//       >
//         <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 13 }}>
//           <Field
//             label="Full Name"
//             value={f.name}
//             onChange={(e) => sf("name", e.target.value)}
//             span2
//             placeholder="e.g. Tunde Adeyemi"
//           />
//           <Field
//             label="Email Address"
//             value={f.email}
//             onChange={(e) => sf("email", e.target.value)}
//             span2
//             placeholder="user@email.com"
//           />
//           <Field
//             label="Phone Number"
//             value={f.phone}
//             onChange={(e) => sf("phone", e.target.value)}
//             span2
//             placeholder="080XXXXXXXX"
//           />
//           <SelectField
//             label="Role"
//             value={f.role}
//             onChange={(e) => sf("role", e.target.value)}
//             span2
//             options={[
//               // { value: "manager", label: "Manager" },
//               { value: "tenant", label: "Tenant" },
//             ]}
//           />
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
//             onClick={handleCreateTenant}
//             style={{
//               flex: 2,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             Create Subaccount
//           </button>
//         </div>
//       </Modal>

//       {/* Reset OTP Modal */}
//       <Modal
//         open={showReset}
//         onClose={() => setShowReset(false)}
//         title="Reset OTP"
//         w={480}
//       >
//         <div style={{ marginBottom: 16 }}>
//           <Lbl>Select User</Lbl>
//           <select
//             className="field"
//             value={selectedUser}
//             onChange={(e) => setSelectedUser(e.target.value)}
//           >
//             <option value="">Choose a subaccount</option>
//             {subaccounts.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.name} — {user.email}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
//           <button
//             className="btn-ghost"
//             onClick={() => setShowReset(false)}
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
//             onClick={handleResetOTP}
//             style={{
//               flex: 2,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             Generate New OTP
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

export function MgrSubAccounts({
  tab,
  setTab,
  tenants,
  setTenants,
  me,
  myLandlord,
}) {
  // ✅ All missing state declarations added
  const [showAdd, setShowAdd] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    role: "tenant",
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
    // 👑 include logged-in user (me)
    {
      id: me?.id,
      name: me?.name,
      email: me?.email,
      phone: me?.phone,
      role: me?.type?.toUpperCase(),
      isMe: true,
    },
    {
      id: myLandlord?.id,
      name: myLandlord?.name,
      email: myLandlord?.email,
      phone: myLandlord?.phone,
      role: myLandlord?.role?.toUpperCase(),
      isMe: false,
    },
    // 👥 include subaccounts from Salesforce
    ...(me?.subaccounts || []).map((u) => ({
      id: u.Id,
      name: u.Name,
      email: u.Email__c,
      phone: u.Phone__c,
      role: u.Role__c?.toUpperCase(),
      isMe: false,
    })),
  ]);

  const handleCreateTenant = () => {
    if (!f.name || !f.email || !f.phone) {
      alert("Please fill all fields");
      return;
    }

    const otp = genOTP();

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.createTenant",
      f.name,
      f.email,
      f.phone,
      f.role,
      me.id,
      myLandlord.id,
      otp,
      function (result, event) {
        if (event.status && result?.success) {
          const newUser = {
            id: result.recordId,
            name: f.name,
            email: f.email,
            phone: f.phone,
            managerId: me.id,
            landlordId: myLandlord.id,
            otp: otp,
            otpUsed: false,
            status: "active",
            isMe: false,
            role: f.role.toUpperCase(),
          };

          setSubaccounts((prev) => [...prev, newUser]);

          if (f.role === "tenant") {
            setTenants((prev) => [...prev, newUser]);
          }

          setF({ name: "", email: "", phone: "", role: "tenant" });
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
            gridTemplateColumns: isMobile ? "1fr" : "1fr",
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
            options={[{ value: "tenant", label: "Tenant" }]}
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
            onClick={handleCreateTenant}
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export function MgrSettings({ me, setMe, log, tab, setTab }) {
  const [cur, setCur] = useState("");
  const [np, setNp] = useState("");
  const [np2, setNp2] = useState("");
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (np.length < 6)
      return setMsg({
        type: "err",
        text: "New password must be at least 6 characters.",
      });
    if (np !== np2)
      return setMsg({ type: "err", text: "Passwords do not match." });

    setErr("");
    setBusy(true);

    try {
      const data = await new Promise((resolve, reject) => {
        Visualforce.remoting.Manager.invokeAction(
          "EstateController.changePassword",
          me?.id,
          cur,
          np2,
          function (result, event) {
            if (event.status) resolve(result);
            else reject(event.message);
          }
        );
      });

      if (data.success) {
        setMsg({ type: "ok", text: data.message });
        setCur("");
        setNp("");
        setNp2("");
      } else {
        setMsg({ type: "err", text: data.message });
      }
    } catch (e) {
      console.error(e);
      setMsg({ type: "err", text: "Something went wrong." });
      setErr("Password update failed.");
    }
  };

  return (
    <div style={{ maxWidth: 480, width: "100%", boxSizing: "border-box" }}>
      <PageTitle
        title="Account Settings"
        sub="Manage your portal credentials"
      />
      <div className="card anim-up" style={{ padding: 26 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 17,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 18,
          }}
        >
          Change Password
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div>
            <Lbl>Current Password</Lbl>
            <input
              className="field"
              type="password"
              value={cur}
              onChange={(e) => setCur(e.target.value)}
              placeholder="Your current password"
            />
          </div>
          <div>
            <Lbl>New Password</Lbl>
            <input
              className="field"
              type="password"
              value={np}
              onChange={(e) => setNp(e.target.value)}
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <Lbl>Confirm New Password</Lbl>
            <input
              className="field"
              type="password"
              value={np2}
              onChange={(e) => setNp2(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>
        </div>
        {msg && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 13px",
              borderRadius: "var(--r-sm)",
              background:
                msg.type === "ok" ? "var(--greenpale)" : "var(--redpale)",
              color: msg.type === "ok" ? "var(--green)" : "var(--red)",
              fontSize: 13,
            }}
          >
            {msg.type === "ok" ? "✓" : "⚠"} {msg.text}
          </div>
        )}
        <button
          className="btn-primary"
          onClick={save}
          style={{
            marginTop: 18,
            padding: "12px 28px",
            borderRadius: "var(--r-md)",
            fontSize: 13.5,
            width: "100%",
          }}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export function MgrProfile({ me, log, tab, setTab }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [f, setF] = useState({
    bankName: me.bankName || "",
    accountName: me.accountName || "",
    accountNumber: me.accountNumber || "",
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

  const labelStyle = {
    fontSize: 12,
    color: "var(--sub)",
    marginBottom: 4,
    display: "block",
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

      {/* ── Current Bank Details Display ── */}
      {/* {hasBankDetails && (
        <div
          className="card anim-up"
          style={{ padding: 24, maxWidth: 540, marginBottom: 20 }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Current Bank Details
          </div>

          <div style={{ display: "grid", gap: 14 }}>
         
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "var(--bg2)",
                borderRadius: 8,
                border: "1px solid var(--br)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--sub)" }}>
              </span>
              <span
                style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}
              >
                {me.bankName || "—"}
              </span>
            </div>

          
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "var(--bg2)",
                borderRadius: 8,
                border: "1px solid var(--br)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--sub)" }}>
                Account Name
              </span>
              <span
                style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}
              >
                {me.accountName || "—"}
              </span>
            </div>

        
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                background: "var(--bg2)",
                borderRadius: 8,
                border: "1px solid var(--br)",
              }}
            >
              <span style={{ fontSize: 12, color: "var(--sub)" }}>
                Account Number
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: 2,
                }}
              >
                {me.accountNumber || "—"}
              </span>
            </div>
          </div>
        </div>
      )} */}

      {/* ── Edit Bank Details Form ── */}
      <div
        className="card"
        style={{
          padding: "20px 16px",
          maxWidth: 540,
          width: "100%",
          boxSizing: "border-box",
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
          {hasBankDetails ? "Update Bank Details" : "Add Bank Details"}
        </div>
        <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 24 }}>
          This information will be used for Agent Fee disbursements.
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
                padding: "12px 28px",
                borderRadius: "var(--r-md)",
                fontSize: 13,
                width: "100%",
              }}
            >
              {busy ? "Saving..." : "Save Details"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
