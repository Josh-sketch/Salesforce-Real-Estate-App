import { useState, useEffect } from "react";
import {
  Tag,
  Avatar,
  Lbl,
  Modal,
  PageTitle,
  StepHeader,
} from "../../components/UI";
import { fmt, TODAY, daysUntil, ordinal } from "../../utils";
import { ALL_SERVICES } from "../../data/constants";

export function THome({
  me,
  myP,
  myT,
  myN,
  daysLeft,
  myProp,
  myUnits,
  setMyUnits,
  tenancies,
  setTenancies,
  tab,
  setTab,
}) {
  // const [tab, setTab] = useState([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const lastOk = myP.filter((p) => p.status === "confirmed").slice(-1)[0];
  const pend = myP.find((p) => p.status === "pending");
  const leaseD = daysUntil(me.leaseEnd);
  const [myUnitLoading, setmyUnitLoading] = useState(true);
  const [loadingTenancy, setLoadingTenancy] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  const loadTenantUnits = () => {
    if (!me?.id) return;

    setmyUnitLoading(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenantUnits",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((r) => ({
            id: r.Id,
            label: r.Name,
            tenancy: r.Tenancy_Status__c,
            occupancy: r.Occupancy_Status__c,
            propertyName: r.Property_Lookup__r?.Name || "",
            LandlordName: r.Owner__r?.Name || "",
            rentAmount: r.Annual_Fee__c,
            agentFee: r.Agent_Fee__c,
            agreementFee: r.Agreement_Fee__c,
          }));

          console.log("🏠 Units loaded for Tenant:", me.id);
          console.log("🏠 myUnits:", mapped);
          setMyUnits(mapped);
        } else {
          console.error("Failed to load units:", event?.message);
          setMyUnits([]);
        }

        setmyUnitLoading(false);
      },
      { escape: false }
    );
  };

  useEffect(() => {
    loadTenantUnits();
  }, [me?.id]);

  // ── Load tenancy record where Tenant__c === me.id ──
  useEffect(() => {
    if (!me?.id) {
      setLoadingTenancy(false);
      return;
    }
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenancyByTenant",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((t) => ({
            id: t.Id,
            unitId: t.Unit__r?.Id,
            unitName: t.Unit__r?.Name,
            unitType: t.Unit__r?.Type__c,
            unitManager: t.Unit__r?.Manager__c,
            unitLandlord: t.Unit__r?.Owner__c,
            propertyName: t.Unit__r?.Property_Lookup__r?.Name,
            propertyId: t.Unit__r?.Property_Lookup__c,
            landlordName: t.Unit__r?.Owner__r?.Name,
            start: t.Start__c
              ? new Date(t.Start__c).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—",
            end: t.End__c
              ? new Date(t.End__c).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—",
            daysLeft: t.Remaining_Days__c ?? null,
            duration: t.Duration__c,
            status: t.Status__c,
          }));
          setTenancies(mapped); // ← array, not single object

          console.log("🏠Tenancy:", mapped);
        } else {
          setTenancies([]);
        }
        setLoadingTenancy(false);
      },
      { escape: false }
    );
  }, [me?.id]);

  const urgC =
    daysLeft <= 3
      ? "var(--red)"
      : daysLeft <= 14
      ? "var(--amber)"
      : "var(--green)";

  const acceptOffer = (unit) => {
    setBusy(true);
    setErr("");
    console.log("This is acceptoffer", unit);
    console.log("UNIT ID:", unit.id);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.acceptOffer",
      unit.id,
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;

          if (data.success) {
            console.log("✅ Unit Accepted");

            // 🔥 Reload fresh data from Salesforce
            loadTenantUnits();
            setTimeout(() => setTab("pay"), 500);
          } else {
            setErr(data.message);
          }
        } else {
          setErr(event.message || "Failed to accept Unit");
        }

        setBusy(false);
      },
      { escape: false }
    );
  };

  // const leaseUrgent = tenancy?.daysLeft != null && tenancy.daysLeft < 90;

  if (myUnitLoading) {
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
        Loading Units...
      </div>
    );
  }

  return (
    <div>
      {/* ── Greeting ── */}
      <div className="anim-up" style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 30,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 3,
            letterSpacing: -0.3,
          }}
        >
          Good day, <span className="gold-static">{me.name.split(" ")[0]}</span>
        </h2>
      </div>
      {loadingTenancy ? (
        <div
          style={{
            padding: "14px 18px",
            fontSize: 13,
            color: "var(--sub)",
            marginBottom: 20,
          }}
        >
          Loading tenancy…
        </div>
      ) : tenancies.length > 0 ? (
        <div
          style={{
            marginBottom: 24,
          }}
        >
          {tenancies.map((tenancy, i) => {
            const leaseUrgent =
              tenancy?.daysLeft != null && tenancy.daysLeft < 90;

            return (
              <div
                key={tenancy.id}
                className="card anim-up"
                style={{
                  marginBottom: 0,
                  padding: "20px 24px",
                  borderLeft: `3px solid ${
                    leaseUrgent ? "var(--red)" : "var(--gold)"
                  }`,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--sub)",
                    marginBottom: 14,
                  }}
                >
                  Tenancy Details
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "repeat(2, 1fr)"
                      : "repeat(4, 1fr)",
                    gap: 16,
                  }}
                >
                  {[
                    ["Property", tenancy.propertyName],
                    ["Unit", `${tenancy.unitName} (${tenancy.unitType})`],
                    ["Landlord", tenancy.landlordName],
                    ["Status", tenancy.status],
                    ["Start Date", tenancy.start],
                    ["End Date", tenancy.end],
                    [
                      "Duration",
                      tenancy.duration
                        ? `${tenancy.duration} yr${
                            tenancy.duration > 1 ? "s" : ""
                          }`
                        : "—",
                    ],
                    [
                      "Days Left",
                      tenancy.daysLeft != null
                        ? `${tenancy.daysLeft} days`
                        : "—",
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: "var(--dim)",
                          marginBottom: 4,
                        }}
                      >
                        {label}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color:
                            label === "Days Left" && leaseUrgent
                              ? "var(--red)"
                              : "var(--text)",
                        }}
                      >
                        {value || "—"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Expiry warning */}
                {leaseUrgent && (
                  <div
                    style={{
                      marginTop: 14,
                      padding: "10px 14px",
                      background: "var(--redpale, #fdf0ef)",
                      borderRadius: "var(--r-md)",
                      fontSize: 12.5,
                      color: "var(--red)",
                    }}
                  >
                    ⚠ Your tenancy expires in {tenancy.daysLeft} days. Please
                    contact your landlord to renew.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="card anim-up"
          style={{
            marginBottom: 24,
            padding: "16px 20px",
            fontSize: 13,
            color: "var(--sub)",
          }}
        >
          No active tenancy found.
        </div>
      )}
      {/* ── Stat Cards ── */}
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="card anim-up d2" style={{ padding: 22 }}>
          <Lbl>Last Confirmed Payment</Lbl>
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 21,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            {lastOk ? lastOk.period : "No confirmed payments"}
          </div>
          {lastOk && <Tag status="confirmed" />}
        </div>
        <div
          className="card anim-up d3"
          style={{
            padding: 22,
            borderColor: leaseUrgent ? "rgba(192,57,43,.3)" : "var(--br)",
          }}
        >
          <Lbl>Days Until Lease Ends</Lbl>
          <div
            style={{
              fontFamily: "'DM Mono',monospace",
              fontSize: 38,
              fontWeight: 500,
              color: leaseUrgent ? "var(--red)" : "var(--text)",
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {tenancy?.daysLeft ?? "—"}
            <span
              style={{ fontSize: 14, fontWeight: 400, color: "var(--sub)" }}
            >
              {" "}
              days
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--sub)" }}>
            {tenancy?.end}
          </div>
        </div>
      </div> */}
      <div className="card anim-up d4" style={{ padding: 22 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 16,
          }}
        >
          Recent Notifications
        </div>
        {myN.length === 0 && (
          <div style={{ color: "var(--sub)", fontSize: 13 }}>
            No notifications yet.
          </div>
        )}
        {myN.slice(0, 4).map((n, i, a) => (
          <div
            key={n.id}
            style={{
              display: "flex",
              gap: 11,
              padding: "10px 0",
              borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>
              {n.type === "alert" ? "⚠️" : n.type === "reminder" ? "🔔" : "ℹ️"}
            </span>
            <div
              style={{
                flex: 1,
                fontSize: 13,
                color: "var(--sub)",
                lineHeight: 1.6,
              }}
            >
              {n.message}
            </div>
            {!n.read && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--red)",
                  flexShrink: 0,
                  marginTop: 5,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gap: 14, marginTop: 32 }}>
        {myUnits.map((u, i) => (
          <div
            key={u.id}
            className="card anim-up"
            style={{
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              borderRadius: "var(--r-lg)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {/* Avatar */}
            {/* <Avatar u={{ name: u.propertyName }} size={46} /> */}

            {/* Info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {u.propertyName}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px 14px",
                  fontSize: 12.5,
                  color: "var(--sub)",
                }}
              >
                <span>🏠 {u.label}</span>
                <span>👤 {u.LandlordName}</span>

                {u.rentAmount && (
                  <span
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 11.5,
                      background: "var(--goldpale)",
                      padding: "2px 6px",
                      borderRadius: 6,
                    }}
                  >
                    {fmt(u.rentAmount)}/yr
                  </span>
                )}

                {u.leaseEnd && <span>📅 {u.leaseEnd}</span>}
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                onClick={() => {
                  setEd(u);
                  setF({ ...u });
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 12,
                  border: "1px solid var(--red)",
                  background: "transparent",
                  color: "var(--red)",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>

              <button
                onClick={() => acceptOffer(u)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "var(--r-sm)",
                  fontSize: 12,
                  border: "none",
                  background: "var(--gold)",
                  color: "#000",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TPay({
  me,
  myP,
  setPayments,
  pa,
  log,
  invoices,
  setInvoices,
  tab,
  setTab,
}) {
  const [file, setFile] = useState(null);
  const [invNum, setInvNum] = useState("");
  const [amount, setAmount] = useState(String(Math.round(me.rentAmount / 12)));
  const [done, setDone] = useState(false);
  const [loadingInv, setLoadingInv] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [declarantName, setDeclarantName] = useState("");
  const [agreedClauses, setAgreedClauses] = useState({});
  const [agreement, setAgreement] = useState([]);
  const [agreementError, setAgreementError] = useState("");
  const [loadingAgreement, setLoadingAgreement] = useState(false);
  const pend = myP.find((p) => p.status === "pending");

  const CLOUDINARY_CLOUD_NAME = "djciyaabj"; // 🔁 replace
  const CLOUDINARY_UPLOAD_PRESET = "Mechtron Estate"; // 🔁 replace (unsigned preset)
  const CLOUDINARY_FOLDER = "rent_receipts"; // 🔁 change folder name if needed

  // Derived: all 5 clauses must be checked

  const sections = [
    {
      id: "rent",
      title: "Rent Policy",
      content: agreement?.rentPolicy,
    },
    {
      id: "maintenance",
      title: "Maintenance Policy",
      content: agreement?.maintenancePolicy,
    },
    {
      id: "landlord",
      title: "Landlord Responsibilities",
      content: agreement?.landlordResponsibility,
    },
    {
      id: "rules",
      title: "Tenancy Rules",
      content: agreement?.tenancyPolicy,
    },
  ].filter((s) => s.content);

  const allClausesAgreed =
    sections.length > 0 && sections.every((s) => agreedClauses[s.id] === true);

  const clausesData = sections.reduce((acc, section) => {
    acc[section.id] = {
      agreed: agreedClauses[section.id] || false,
      title: section.title,
      content: section.content,
    };
    return acc;
  }, {});

  const updateYears = (invId, years) => {
    // ✅ Update UI instantly
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invId) return inv;

        const annual = inv.annualFee || 0;
        const agent = inv.agentFee || 0;
        const agreement = inv.agreementFee || 0;
        const caution = inv.cautionFee || 0;
        const maintenance = inv.maintenanceFee || 0;
        const security = inv.securityFee || 0;
        const sanitation = inv.sanitationFee || 0;
        const processing = inv.processingFee || 0;

        const total =
          annual * years +
          agent +
          agreement +
          caution +
          maintenance +
          security +
          sanitation +
          processing;

        return { ...inv, years, total };
      })
    );

    // 🚀 Persist to Salesforce
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.updateInvoiceYears",
      invId,
      years,
      function (result, event) {
        if (!event.status)
          console.error("Failed to update invoice:", event.message);
      },
      { escape: false }
    );
  };

  const loadTenancyAgreement = (landlordId) => {
    setLoadingAgreement(true);
    setAgreementError("");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenancyAgreement",
      landlordId, // ← dynamic
      function (result, event) {
        console.log("Agreement result:", result);
        console.log("Agreement event:", event);
        if (event.status && result) {
          const data = typeof result === "string" ? JSON.parse(result) : result;
          if (data.success) {
            setAgreement(data.data);
          } else {
            setAgreementError(data.message || "No agreement found.");
          }
        } else {
          setAgreementError(event.message || "Failed to load agreement.");
        }
        setLoadingAgreement(false);
      },
      { escape: false }
    );
  };

  const submit = async () => {
    if (!allClausesAgreed || !declarantName.trim()) return;

    setUploading(true);
    setUploadError("");

    const inv = invoices[0];

    try {
      // ── 1. Save contract to Salesforce first ──
      await new Promise((resolve, reject) => {
        Visualforce.remoting.Manager.invokeAction(
          "EstateController.saveContract",
          inv.invoiceNum,
          inv.payeeiD,
          me?.id,
          declarantName.trim(),
          JSON.stringify(clausesData),
          inv.unitid,
          function (result, event) {
            if (event.status) resolve(result);
            else reject(new Error(event.message));
          },
          { escape: false }
        );
      });
    } catch (err) {
      console.error("Submit failed:", err);
      setUploadError(err.message || "Something went wrong. Please try again.");
      setUploading(false);
      return;
    }

    // ── 2. Launch Paystack OUTSIDE the try/catch and NOT in a Promise ──
    const handler = PaystackPop.setup({
      key: "pk_test_b1a18a669448d65f893f912ca95758491948ef8f",
      email: me.email,
      amount: (inv.total || inv.totalAmount) * 100,
      currency: "NGN",
      ref: `PAY-${inv.invoiceNum}-${Date.now()}`,
      metadata: {
        invoiceNum: inv.invoiceNum,
        tenantName: me.name,
        landlordName: inv.payeeName,
      },
      callback: function (response) {
        // ← must be plain function, not arrow in some versions
        Visualforce.remoting.Manager.invokeAction(
          "EstateController.markInvoicePaid",
          inv.invoiceNum,
          response.reference,
          function (result, event) {
            if (event.status) {
              setInvoices((prev) =>
                prev.map((i) =>
                  i.invoiceNum === inv.invoiceNum ? { ...i, status: "Paid" } : i
                )
              );
              log(`${me.name} paid invoice ${inv.invoiceNum}`);
              setDone(true);
            } else {
              setUploadError(
                "Payment received but failed to update. Contact support."
              );
            }
            setUploading(false);
          },
          { escape: false }
        );
      },
      onClose: function () {
        setUploadError("Payment was cancelled.");
        setUploading(false);
      },
    });

    handler.openIframe();
  };

  useEffect(() => {
    if (!me?.id) return;
    setLoadingInv(true);
    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenantInvoices",
      me.id,
      function (result, event) {
        if (event.status && result) {
          const mapped = result.map((inv) => ({
            id: inv.Id,
            invoiceNum: inv.Invoice_Number__c,
            annualFee: inv.Annual_Fee__c,
            agreementFee: inv.Agreement_Fee__c,
            agentFee: inv.Agent_Fee__c,
            cautionFee: inv.Caution_Fee__c,
            maintenanceFee: inv.Maintenance_Fee__c,
            securityFee: inv.Security_Fee__c,
            sanitationFee: inv.Sanitation_Fee__c,
            processingFee: inv.Processing_Fee__c,
            totalAmount: inv.Total_Amount__c,
            type: inv.Type__c,
            status: inv.Status__c,
            unitid: inv.Unit__c,
            unitName: inv.Unit__r?.Name,
            unitType: inv.Unit__r?.Type__c,
            property: inv.Unit__r?.Property_Lookup__r?.Name,
            payeeBank: inv.Payee__r?.Bank_Name__c,
            payeeAccName: inv.Payee__r?.Account_Name__c,
            payeeAccNum: inv.Payee__r?.Account_Number__c,
            payeeiD: inv.Payee__c,
            payeeName: inv.Payee__r?.Name,
            payeeEmail: inv.Payee__r?.Email__c,
            payerName: inv.Payer__r?.Name,
            payerEmail: inv.Payer__r?.Email__c,
            years: inv.Years__c,
            date: new Date(inv.CreatedDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          }));
          console.log("load invoices:", mapped);
          setInvoices(mapped);
        } else {
          console.error("Failed to load invoices:", event.message);
          setInvoices([]);
        }
        setLoadingInv(false);
      },
      { escape: false }
    );
  }, [me?.id]);

  useEffect(() => {
    if (invoices.length > 0 && invoices[0].payeeiD) {
      // ← payeeiD not payeeId
      loadTenancyAgreement(invoices[0].payeeiD);
    }
  }, [invoices]);

  if (done)
    return (
      <div
        className="anim-up"
        style={{ textAlign: "center", padding: "80px 20px" }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--greenpale)",
            border: "1px solid rgba(26,122,74,.28)",
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
            marginBottom: 8,
          }}
        >
          Receipt Submitted
        </h2>
        <p
          style={{
            color: "var(--sub)",
            fontSize: 13.5,
            maxWidth: 360,
            margin: "0 auto 26px",
            lineHeight: 1.7,
          }}
        >
          Your receipt has been sent to the admin for review. You'll receive a
          notification once confirmed.
        </p>
        <button
          className="btn-primary"
          onClick={() => {
            setDone(false);
            setFile(null);
            setInvNum("");
          }}
          style={{
            padding: "10px 28px",
            borderRadius: "var(--r-md)",
            fontSize: 13.5,
          }}
        >
          Submit another
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 1200 }}>
      <PageTitle
        title="Pay Rent"
        sub="Review your invoice, sign the agreement, then submit"
      />

      {loadingInv ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--sub)",
            fontSize: 13,
          }}
        >
          Loading rent invoices…
        </div>
      ) : invoices.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--sub)",
            fontSize: 13,
          }}
        >
          No invoices found.
        </div>
      ) : (
        invoices.map((inv) => (
          <div
            key={inv.id}
            className="card"
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.2fr 2px 1.5fr" /* invoice | divider | contract */,
              alignItems: "stretch",
              overflow: "hidden",
              borderRadius: "var(--r-lg)",
              marginBottom: 20,
            }}
          >
            {/* ══ COL 1: Invoice (1fr) ══ */}
            <div style={{ padding: 24 }}>
              {/* Invoice number */}
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
                {inv.invoiceNum}
              </div>

              {/* Breakdown */}
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 12,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--sub)",
                }}
              >
                Breakdown
              </div>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
                {`${inv.unitName} (${inv.unitType})`}
              </div>

              {[
                ["Annual Fee", `₦${inv.annualFee}`],
                ["Agent Fee", `₦${inv.agentFee}`],
                ["Agreement Fee", `₦${inv.agreementFee}`],
                ["Caution Fee", `₦${inv.cautionFee}`],
                ["Maintenance Fee", `₦${inv.maintenanceFee}`],
                ["Security Fee", `₦${inv.securityFee}`],
                ["Sanitation Fee", `₦${inv.sanitationFee}`],
                ["Processing Fee", `₦${inv.processingFee}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12.5,
                    padding: "5px 0",
                    borderBottom: "1px solid var(--br)",
                  }}
                >
                  <span style={{ color: "var(--sub)" }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {/* Years selector */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 12.5,
                  padding: "7px 0",
                  borderBottom: "1px solid var(--br)",
                }}
              >
                <span style={{ color: "var(--sub)" }}>Years</span>
                <select
                  value={Math.round(inv.years) || 1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) updateYears(inv.id, val);
                  }}
                  style={{
                    fontSize: 12.5,
                    padding: "2px 6px",
                    borderRadius: 4,
                    border: "1px solid var(--br)",
                    background: "var(--bg2)",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--gold)",
                }}
              >
                <span>Total</span>
                <span>₦{(inv.total || inv.totalAmount)?.toLocaleString()}</span>
              </div>

              {/* Others */}
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 14,
                  borderTop: "1px solid var(--br)",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 12,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--sub)",
                  }}
                >
                  Others
                </div>
                {[
                  ["Rent Type", inv.type],
                  ["Date Issued", inv.date],
                  ["Status", inv.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: 12.5,
                      padding: "5px 0",
                      borderBottom: "1px solid var(--br)",
                    }}
                  >
                    <span style={{ color: "var(--sub)" }}>{label}</span>
                    <span style={{ fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══ COL 2: Divider ══ */}
            <div
              style={{
                width: 2,
                background:
                  "repeating-linear-gradient(to bottom, #8B6914 0px, #8B6914 10px, transparent 10px, transparent 18px)",
                alignSelf: "stretch",
              }}
            />

            {/* ══ COL 3: Tenancy Contract (2fr) ══ */}
            <div style={{ padding: 28 }}>
              {pend && (
                <div
                  style={{
                    background: "var(--amberpale)",
                    border: "1px solid rgba(155,106,0,.2)",
                    borderRadius: "var(--r-md)",
                    padding: "12px 16px",
                    marginBottom: 20,
                    fontSize: 13,
                    color: "var(--amber)",
                  }}
                >
                  ⚠ You have a pending payment currently under review.
                </div>
              )}

              {/* Contract Header */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: 24,
                  borderBottom: "1px solid var(--br)",
                  paddingBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "var(--dim)",
                    marginBottom: 6,
                  }}
                >
                  Mechtron Estate Management
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  Tenancy Agreement
                </div>
                <div style={{ fontSize: 12, color: "var(--sub)" }}>
                  This agreement is entered into on{" "}
                  {new Date().toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Parties */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                  padding: "16px 20px",
                  background: "var(--bg2)",
                  borderRadius: "var(--r-md)",
                  border: "1px solid var(--br)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--gold)",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    Landlord
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {inv.payeeName || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>
                    {inv.payeeEmail || "—"}
                  </div>
                </div>
                <div
                  style={{ borderLeft: "1px solid var(--br)", paddingLeft: 20 }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--gold)",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    Tenant
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {me?.name || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>
                    {me?.email || "—"}
                  </div>
                </div>
                <div
                  style={{ borderLeft: "1px solid var(--br)", paddingLeft: 20 }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      color: "var(--gold)",
                      fontWeight: 700,
                      marginBottom: 10,
                    }}
                  >
                    Property
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: 4,
                    }}
                  >
                    {inv.unitName || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>
                    {inv.property || "—"}
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--sub)",
                    marginBottom: 10,
                    lineHeight: 1.7,
                  }}
                >
                  I,{" "}
                  <input
                    className="field"
                    value={declarantName}
                    onChange={(e) => setDeclarantName(e.target.value)}
                    placeholder="Enter your full name"
                    style={{
                      display: "inline-block",
                      width: 220,
                      padding: "4px 10px",
                      fontSize: 13,
                      borderRadius: "var(--r-sm)",
                      border: "1px solid var(--br)",
                      background: "var(--bg2)",
                      marginLeft: 4,
                      marginRight: 4,
                    }}
                  />
                  , hereby agree to the following terms and conditions of this
                  tenancy:
                </div>
              </div>

              {/* Terms */}
              {/* <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  marginBottom: 24,
                }}
              >
                {[
                  { id: "rent", text: "To pay my rent as at when due." },
                  {
                    id: "maintain",
                    text: "To maintain this property in good condition.",
                  },
                  {
                    id: "rules",
                    text: "To follow the estate rules and regulations.",
                  },
                  {
                    id: "damage",
                    text: "Not to cause willful damage to the property.",
                  },
                  {
                    id: "subletting",
                    text: "Not to sublet the property without written consent.",
                  },
                  {
                    id: "Landlord Responsibility",
                    text: "Landlord Responsibility [view]",
                  },
                ].map((clause, i, arr) => (
                  <div
                    key={clause.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 0",
                      borderBottom:
                        i < arr.length - 1 ? "1px solid var(--br)" : "none",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        flex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--dim)",
                          fontFamily: "'DM Mono',monospace",
                          minWidth: 20,
                          paddingTop: 1,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text)",
                          lineHeight: 1.6,
                        }}
                      >
                        {clause.text}
                      </span>
                    </div>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreedClauses[clause.id] || false}
                        onChange={(e) =>
                          setAgreedClauses((prev) => ({
                            ...prev,
                            [clause.id]: e.target.checked,
                          }))
                        }
                        style={{ display: "none" }}
                      />
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: agreedClauses[clause.id]
                            ? "2px solid var(--gold)"
                            : "2px solid var(--br)",
                          background: agreedClauses[clause.id]
                            ? "var(--goldpale)"
                            : "var(--bg2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all .15s",
                        }}
                      >
                        {agreedClauses[clause.id] && (
                          <svg width="12" height="12" viewBox="0 0 12 12">
                            <polyline
                              points="2 6 5 9 10 3"
                              stroke="var(--gold)"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div> */}
              {/* Agreement Sections */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                {sections.map((section, i) => (
                  <div
                    key={section.id}
                    style={{
                      border: "1px solid var(--br)",
                      borderRadius: "var(--r-md)",
                      overflow: "hidden",
                      background: "var(--bg2)",
                    }}
                  >
                    {/* Section Header */}
                    <div
                      style={{
                        padding: "14px 18px",
                        borderBottom: "1px solid var(--br)",
                        background: "rgba(212,175,55,.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            textTransform: "uppercase",
                            letterSpacing: "0.14em",
                            color: "var(--gold)",
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          Section {i + 1}
                        </div>

                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--text)",
                          }}
                        >
                          {section.title}
                        </div>
                      </div>

                      {/* Checkbox */}
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={agreedClauses[section.id] || false}
                          onChange={(e) =>
                            setAgreedClauses((prev) => ({
                              ...prev,
                              [section.id]: e.target.checked,
                            }))
                          }
                          style={{ display: "none" }}
                        />

                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 6,
                            border: agreedClauses[section.id]
                              ? "2px solid var(--gold)"
                              : "2px solid var(--br)",
                            background: agreedClauses[section.id]
                              ? "var(--goldpale)"
                              : "var(--bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all .15s",
                          }}
                        >
                          {agreedClauses[section.id] && (
                            <svg width="12" height="12" viewBox="0 0 12 12">
                              <polyline
                                points="2 6 5 9 10 3"
                                stroke="var(--gold)"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Section Content */}
                    <div
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      style={{
                        padding: "18px",
                        fontSize: 13,
                        lineHeight: 1.8,
                        color: "var(--text)",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Progress note */}
              {Object.keys(agreedClauses).length > 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--sub)",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  {Object.values(agreedClauses).filter(Boolean).length} of{" "}
                  {sections.length} {/* ← was hardcoded 5 */}
                  clauses agreed
                </div>
              )}

              {/* Submit */}
              <button
                onClick={submit}
                disabled={
                  !allClausesAgreed || !declarantName.trim() || uploading
                }
                className={
                  allClausesAgreed && declarantName.trim() && !uploading
                    ? "btn-primary"
                    : ""
                }
                style={{
                  width: "100%",
                  padding: "13px 0",
                  borderRadius: "var(--r-md)",
                  fontSize: 14,
                  border: "none",
                  fontWeight: 700,
                  cursor:
                    allClausesAgreed && declarantName.trim() && !uploading
                      ? "pointer"
                      : "not-allowed",
                  background:
                    allClausesAgreed && declarantName.trim() && !uploading
                      ? undefined
                      : "var(--bg3)",
                  color:
                    allClausesAgreed && declarantName.trim() && !uploading
                      ? undefined
                      : "var(--dim)",
                }}
              >
                {uploading ? "Submitting…" : "Submit & Proceed to Payment →"}
              </button>

              {uploadError && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12.5,
                    color: "var(--red, #c0392b)",
                    background: "var(--redpale, #fdf0ef)",
                    border: "1px solid rgba(192,57,43,.2)",
                    borderRadius: "var(--r-md)",
                    padding: "8px 12px",
                  }}
                >
                  ⚠ {uploadError}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export function THistory({ myP, me, tab, setTab }) {
  const downloadAgreement = () => {
    const content = `TENANCY AGREEMENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nMECHTRON ESTATE MANAGEMENT\n\nTENANT: ${
      me.name
    }\nEMAIL: ${me.email}\nPHONE: ${me.phone}\n\nPROPERTY DETAILS:\nUnit: ${
      me.unit
    }\nFloor: ${me.floor}\n\nTENANCY TERMS:\nLease Start Date: ${
      me.leaseStart
    }\nLease End Date: ${me.leaseEnd}\nAnnual Rent: ₦${Number(
      me.rentAmount
    ).toLocaleString("en-NG")}\nMonthly Rent: ₦${Math.round(
      me.rentAmount / 12
    ).toLocaleString(
      "en-NG"
    )}\nRent Due Day: 185 of each month\n\nTERMS AND CONDITIONS:\n1. The tenant agrees to pay rent on or before the due date.\n2. The tenant shall maintain the property in good condition.\n3. Subletting without prior written consent is strictly prohibited.\n4. The tenant shall report maintenance issues promptly.\n5. A security deposit equivalent to two (2) months' rent shall be held.\n6. One (1) month's written notice is required for lease termination.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nMechtron Estate Management Ltd\n`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tenancy_Agreement_${me.name.replace(/ /g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageTitle
        title="Payment History"
        sub={`${myP.length} total submissions`}
        right={
          <button
            className="btn-primary"
            onClick={downloadAgreement}
            style={{
              padding: "9px 20px",
              borderRadius: "var(--r-md)",
              fontSize: 13,
              display: "flex",
              gap: 7,
              alignItems: "center",
            }}
          >
            ⬇ Download Tenancy Agreement
          </button>
        }
      />
      {myP.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--sub)" }}>
          No payment history yet.
        </div>
      )}
      <div style={{ display: "grid", gap: 11 }}>
        {myP.map((p, i) => (
          <div
            key={p.id}
            className="card anim-up"
            style={{
              padding: "17px 20px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              animationDelay: `${i * 0.04}s`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "var(--r-md)",
                background:
                  p.status === "confirmed"
                    ? "var(--greenpale)"
                    : p.status === "pending"
                    ? "var(--amberpale)"
                    : "var(--redpale)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {p.status === "confirmed"
                ? "✓"
                : p.status === "pending"
                ? "⏳"
                : "✕"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                {p.period}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--dim)" }}>
                <span style={{ fontFamily: "'DM Mono',monospace" }}>
                  {p.id}
                </span>{" "}
                · Submitted {p.submittedDate} · 📎 {p.receiptName}
              </div>
              {p.adminNote && (
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--sub)",
                    marginTop: 4,
                    background: "var(--bg2)",
                    padding: "3px 8px",
                    borderRadius: 4,
                    display: "inline-block",
                  }}
                >
                  Admin: {p.adminNote}
                </div>
              )}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontWeight: 500,
                  fontSize: 16,
                  color: "var(--text)",
                  marginBottom: 5,
                }}
              >
                {fmt(p.amount)}
              </div>
              <Tag status={p.status} />
              {p.confirmedDate && (
                <div
                  style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 4 }}
                >
                  Confirmed {p.confirmedDate}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// export function TTickets({
//   me,
//   myT,
//   tickets,
//   setTickets,
//   log,
//   tab,
//   setTab,
//   tenancies,
// }) {
//   const [open, setOpen] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitErr, setSubmitErr] = useState("");
//   const [loadingTickets, setLoadingTickets] = useState(true);

//   useEffect(() => {
//     if (!me?.id) return;
//     setLoadingTickets(true);

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.getTenantCases",
//       me.id,
//       function (result, event) {
//         if (event.status && result) {
//           const mapped = result.map((c) => ({
//             id: c.Id,
//             title: c.Subject,
//             unitId: c.Unit__c,
//             unitName: c.Unit__r?.Name,
//             propertyName: c.Property__r?.Name,
//             category: c.Type,
//             priority: c.Priority,
//             description: c.Description,
//             status: c.Status,
//             adminResponse: c.Comments || "",
//             submittedDate: c.CreatedDate
//               ? new Date(c.CreatedDate).toLocaleDateString("en-GB", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })
//               : "—",
//             updatedDate: c.LastModifiedDate
//               ? new Date(c.LastModifiedDate).toLocaleDateString("en-GB", {
//                   day: "numeric",
//                   month: "long",
//                   year: "numeric",
//                 })
//               : "—",
//           }));
//           console.log("🎫 Cases loaded:", mapped);
//           setTickets(mapped);
//         } else {
//           console.error("Failed to load cases:", event?.message);
//           setTickets([]);
//         }
//         setLoadingTickets(false);
//       },
//       { escape: false }
//     );
//   }, [me?.id]);

//   const submitTicket = () => {
//     if (!f.title || !f.description) return;
//     if (!f.unitId) return setSubmitErr("Please select a unit.");

//     setSubmitting(true);
//     setSubmitErr("");

//     // Get landlord ID and property ID from the selected tenancy
//     const selectedTenancy = tenancies.find((t) => t.unitId === f.unitId);

//     Visualforce.remoting.Manager.invokeAction(
//       "EstateController.createCase",
//       f.title,
//       f.unitId,
//       selectedTenancy?.propertyId || "",
//       f.category,
//       f.priority,
//       f.description,
//       selectedTenancy?.unitLandlord || "",
//       selectedTenancy?.unitManager || "",
//       me.id,
//       function (result, event) {
//         if (event.status) {
//           const data = typeof result === "string" ? JSON.parse(result) : result;
//           if (data.success) {
//             // Add to local state so UI updates immediately
//             setTickets((ts) => [
//               ...ts,
//               {
//                 ...f,
//                 id: data.recordId || `TKT-${Date.now()}`,
//                 tenantId: me.id,
//                 status: "open",
//                 submittedDate: TODAY.toISOString().split("T")[0],
//                 updatedDate: TODAY.toISOString().split("T")[0],
//                 adminResponse: "",
//               },
//             ]);
//             log(`Ticket submitted by ${me.name}: ${f.title}`);
//             setOpen(false);
//             setF(blank);
//             setSubmitErr("");
//           } else {
//             setSubmitErr(data.message || "Failed to submit ticket.");
//           }
//         } else {
//           setSubmitErr(event.message || "Remote action failed.");
//         }
//         setSubmitting(false);
//       },
//       { escape: false }
//     );
//   };

//   const blank = {
//     title: "",
//     unitId: "",
//     category: "General",
//     priority: "medium",
//     description: "",
//   };

//   const [f, setF] = useState(blank);
//   const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

//   const submit = () => {
//     if (!f.title || !f.description) return;
//     setTickets((ts) => [
//       ...ts,
//       {
//         ...f,
//         id: `TKT-${Date.now()}`,
//         tenantId: me.id,
//         status: "open",
//         submittedDate: TODAY.toISOString().split("T")[0],
//         updatedDate: TODAY.toISOString().split("T")[0],
//         adminResponse: "",
//       },
//     ]);
//     log(`Ticket submitted by ${me.name}: ${f.title}`);
//     setOpen(false);
//     setF(blank);
//   };

//   if (loadingTickets) {
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
//         Loading tickets…
//       </div>
//     );
//   }

//   return (
//     <div>
//       <PageTitle
//         title="Maintenance Requests"
//         sub={`${tickets.length} requests`}
//         right={
//           <button
//             className="btn-primary"
//             onClick={() => setOpen(true)}
//             style={{
//               padding: "9px 20px",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             + New request
//           </button>
//         }
//       />
//       {/* {myT.length === 0 && (
//         <div style={{ textAlign: "center", padding: 60, color: "var(--sub)" }}>
//           No maintenance requests yet.
//         </div>
//       )} */}
//       <div style={{ display: "grid", gap: 11 }}>
//         {tickets.map((tk, i) => (
//           <div
//             key={tk.id}
//             className="card anim-up"
//             style={{ padding: "17px 20px", animationDelay: `${i * 0.04}s` }}
//           >
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "flex-start",
//                 marginBottom: 7,
//                 gap: 8,
//               }}
//             >
//               <div>
//                 <div
//                   style={{
//                     fontFamily: "'Cormorant Garamond',serif",
//                     fontWeight: 700,
//                     fontSize: 16,
//                     color: "var(--text)",
//                     marginBottom: 4,
//                   }}
//                 >
//                   {tk.title}
//                 </div>
//                 <div style={{ fontSize: 11.5, color: "var(--dim)" }}>
//                   <span style={{ fontFamily: "'DM Mono',monospace" }}>
//                     {tk.id}
//                   </span>{" "}
//                   · {tk.category} · {tk.submittedDate}
//                 </div>
//               </div>
//               <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
//                 <Tag status={tk.priority} />
//                 <Tag status={tk.status} />
//               </div>
//             </div>
//             <p style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.65 }}>
//               {tk.description}
//             </p>
//             {tk.adminResponse && (
//               <div
//                 style={{
//                   marginTop: 10,
//                   background: "var(--greenpale)",
//                   border: "1px solid rgba(26,122,74,.18)",
//                   borderRadius: "var(--r-sm)",
//                   padding: "8px 12px",
//                   fontSize: 12.5,
//                   color: "var(--green)",
//                 }}
//               >
//                 💬 Admin: {tk.adminResponse}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <Modal
//         open={open}
//         onClose={() => setOpen(false)}
//         title="New Maintenance Request"
//       >
//         <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
//           <div>
//             <Lbl>Issue title</Lbl>
//             <input
//               className="field"
//               value={f.title}
//               onChange={(e) => sf("title", e.target.value)}
//               placeholder="Brief summary of the issue"
//             />
//           </div>
//           <div>
//             <Lbl>Unit</Lbl>
//             <select
//               className="field"
//               value={f.unitId}
//               onChange={(e) => sf("unitId", e.target.value)}
//             >
//               <option value="">Select unit</option>
//               {tenancies.map((t) => (
//                 <option key={t.unitId} value={t.unitId}>
//                   {t.unitName} ({t.propertyName})
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
//           >
//             <div>
//               <Lbl>Category</Lbl>
//               <select
//                 value={f.category}
//                 onChange={(e) => sf("category", e.target.value)}
//                 className="field"
//               >
//                 {[
//                   "Plumbing",
//                   "Electrical",
//                   "General",
//                   "Security",
//                   "Appliance",
//                   "Structural",
//                   "Pest Control",
//                 ].map((c) => (
//                   <option key={c}>{c}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <Lbl>Priority</Lbl>
//               <select
//                 value={f.priority}
//                 onChange={(e) => sf("priority", e.target.value)}
//                 className="field"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>
//           </div>
//           <div>
//             <Lbl>Full description</Lbl>
//             <textarea
//               value={f.description}
//               onChange={(e) => sf("description", e.target.value)}
//               rows={4}
//               className="field"
//               style={{ resize: "none" }}
//               placeholder="Describe the issue in detail..."
//             />
//           </div>
//         </div>
//         {submitErr && (
//           <div style={{ fontSize: 12.5, color: "var(--red)", marginTop: 8 }}>
//             ⚠ {submitErr}
//           </div>
//         )}
//         <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
//           <button
//             className="btn-ghost"
//             onClick={() => setOpen(false)}
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
//             onClick={submitTicket}
//             disabled={submitting}
//             style={{
//               flex: 2,
//               padding: "10px 0",
//               borderRadius: "var(--r-md)",
//               fontSize: 13,
//             }}
//           >
//             {submitting ? "Submitting…" : "Submit request"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// }

export function TTickets({
  me,
  myT,
  tickets,
  setTickets,
  log,
  tab,
  setTab,
  tenancies,
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [loadingTickets, setLoadingTickets] = useState(true);

  // Cloudinary states
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "djciyaabj";
  const CLOUDINARY_UPLOAD_PRESET = "Mechtron Estate";
  const CLOUDINARY_FOLDER = "ticket_images";

  useEffect(() => {
    if (!me?.id) return;
    setLoadingTickets(true);

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.getTenantCases",
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

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", CLOUDINARY_FOLDER);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          setUploadProgress(percent);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
          });
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
      );
      xhr.send(formData);
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file`);
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`);
        }

        return await uploadImageToCloudinary(file);
      });

      const results = await Promise.all(uploadPromises);
      setUploadedImages((prev) => [...prev, ...results]);
      setUploadingImage(false);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      setSubmitErr(error.message);
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitTicket = async () => {
    if (!f.title || !f.description) return;
    if (!f.unitId) return setSubmitErr("Please select a unit.");

    setSubmitting(true);
    setSubmitErr("");

    const selectedTenancy = tenancies.find((t) => t.unitId === f.unitId);

    // Get image URLs as comma-separated string
    const imageUrls = uploadedImages.map((img) => img.url).join(",");

    Visualforce.remoting.Manager.invokeAction(
      "EstateController.createCase",
      f.title,
      f.unitId,
      selectedTenancy?.propertyId || "",
      f.category,
      f.priority,
      f.description,
      selectedTenancy?.unitLandlord || "",
      selectedTenancy?.unitManager || "",
      me.id,
      imageUrls, // Pass image URLs to Apex
      function (result, event) {
        if (event.status) {
          const data = typeof result === "string" ? JSON.parse(result) : result;
          if (data.success) {
            // Add to local state so UI updates immediately
            setTickets((ts) => [
              ...ts,
              {
                ...f,
                id: data.recordId || `TKT-${Date.now()}`,
                tenantId: me.id,
                status: "open",
                submittedDate: TODAY.toISOString().split("T")[0],
                updatedDate: TODAY.toISOString().split("T")[0],
                adminResponse: "",
                imageUrls: imageUrls.split(","),
              },
            ]);
            log(`Ticket submitted by ${me.name}: ${f.title}`);
            setOpen(false);
            setF(blank);
            setUploadedImages([]); // Clear uploaded images
            setSubmitErr("");
          } else {
            setSubmitErr(data.message || "Failed to submit ticket.");
          }
        } else {
          setSubmitErr(event.message || "Remote action failed.");
        }
        setSubmitting(false);
      },
      { escape: false }
    );
  };

  const blank = {
    title: "",
    unitId: "",
    category: "General",
    priority: "medium",
    description: "",
  };

  const [f, setF] = useState(blank);
  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

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
        title="Maintenance Requests"
        sub={`${tickets.length} requests`}
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
            + New request
          </button>
        }
      />

      <div style={{ display: "grid", gap: 11 }}>
        {tickets.map((tk, i) => (
          <div
            key={tk.id}
            className="card anim-up"
            style={{ padding: "17px 20px", animationDelay: `${i * 0.04}s` }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 7,
                gap: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text)",
                    marginBottom: 4,
                  }}
                >
                  {tk.title}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--dim)" }}>
                  <span style={{ fontFamily: "'DM Mono',monospace" }}>
                    {tk.id}
                  </span>{" "}
                  · {tk.category} · {tk.submittedDate}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                <Tag status={tk.priority} />
                <Tag status={tk.status} />
              </div>
            </div>
            <p style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.65 }}>
              {tk.description}
            </p>
            {/* Display uploaded images */}
            {/* {tk.imageUrls && tk.imageUrls.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 12,
                  flexWrap: "wrap",
                }}
              >
                {tk.imageUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Ticket attachment ${idx + 1}`}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "var(--r-sm)",
                      cursor: "pointer",
                      border: "1px solid var(--br)",
                    }}
                    onClick={() => window.open(url, "_blank")}
                  />
                ))}
              </div>
            )} */}
            {tk.imageUrls && tk.imageUrls.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={tk.imageUrls[0]}
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
            {tk.adminResponse && (
              <div
                style={{
                  marginTop: 10,
                  background: "var(--greenpale)",
                  border: "1px solid rgba(26,122,74,.18)",
                  borderRadius: "var(--r-sm)",
                  padding: "8px 12px",
                  fontSize: 12.5,
                  color: "var(--green)",
                }}
              >
                💬 Admin: {tk.adminResponse}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setUploadedImages([]);
          setSubmitErr("");
        }}
        title="New Maintenance Request"
        w={600}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <div>
            <Lbl>Issue title</Lbl>
            <input
              className="field"
              value={f.title}
              onChange={(e) => sf("title", e.target.value)}
              placeholder="Brief summary of the issue"
            />
          </div>

          <div>
            <Lbl>Unit</Lbl>
            <select
              className="field"
              value={f.unitId}
              onChange={(e) => sf("unitId", e.target.value)}
            >
              <option value="">Select unit</option>
              {tenancies.map((t) => (
                <option key={t.unitId} value={t.unitId}>
                  {t.unitName} ({t.propertyName})
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}
          >
            <div>
              <Lbl>Category</Lbl>
              <select
                value={f.category}
                onChange={(e) => sf("category", e.target.value)}
                className="field"
              >
                {[
                  "Plumbing",
                  "Electrical",
                  "General",
                  "Security",
                  "Appliance",
                  "Structural",
                  "Pest Control",
                ].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <Lbl>Priority</Lbl>
              <select
                value={f.priority}
                onChange={(e) => sf("priority", e.target.value)}
                className="field"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <Lbl>Full description</Lbl>
            <textarea
              value={f.description}
              onChange={(e) => sf("description", e.target.value)}
              rows={4}
              className="field"
              style={{ resize: "none" }}
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <Lbl>Upload Photos (Optional)</Lbl>
            <div
              style={{
                border: "2px dashed var(--br)",
                borderRadius: "var(--r-md)",
                padding: "20px",
                textAlign: "center",
                background: "var(--bg2)",
              }}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                style={{ display: "none" }}
                id="ticket-image-upload"
              />
              <label
                htmlFor="ticket-image-upload"
                style={{
                  cursor: uploadingImage ? "not-allowed" : "pointer",
                  display: "block",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 10 }}>📸</div>
                <div style={{ fontSize: 13, color: "var(--text)" }}>
                  {uploadingImage ? "Uploading..." : "Click to upload images"}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--dim)", marginTop: 5 }}
                >
                  JPEG, PNG (Max 5MB each)
                </div>
              </label>
            </div>

            {/* Upload Progress */}
            {uploadingImage && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    height: 4,
                    background: "var(--br)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: "100%",
                      background: "var(--gold)",
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--sub)",
                    marginTop: 5,
                    textAlign: "center",
                  }}
                >
                  Uploading... {Math.round(uploadProgress)}%
                </div>
              </div>
            )}

            {/* Image Previews */}
            {uploadedImages.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  Uploaded Images ({uploadedImages.length})
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        display: "inline-block",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`Upload ${idx + 1}`}
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
              </div>
            )}
          </div>
        </div>

        {submitErr && (
          <div style={{ fontSize: 12.5, color: "var(--red)", marginTop: 8 }}>
            ⚠ {submitErr}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button
            className="btn-ghost"
            onClick={() => {
              setOpen(false);
              setUploadedImages([]);
              setSubmitErr("");
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
            onClick={submitTicket}
            disabled={submitting || uploadingImage}
            style={{
              flex: 2,
              padding: "10px 0",
              borderRadius: "var(--r-md)",
              fontSize: 13,
              opacity: submitting || uploadingImage ? 0.6 : 1,
              cursor: submitting || uploadingImage ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Submitting…" : "Submit request"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function TServices({
  me,
  mySvcs,
  setServiceRequests,
  log,
  tab,
  setTab,
}) {
  const [confirm, setConfirm] = useState(null);

  const requestService = (svc) => {
    setServiceRequests((rs) => [
      ...rs,
      {
        id: `SR${Date.now()}`,
        tenantId: me.id,
        serviceId: svc.id,
        status: "pending",
        date: TODAY.toISOString().split("T")[0],
        addedToRent: false,
      },
    ]);
    log(`${me.name} requested service: ${svc.name}`);
    setConfirm(null);
  };
  const cancelService = (req) => {
    setServiceRequests((rs) => rs.filter((r) => r.id !== req.id));
    log(
      `${me.name} cancelled service: ${
        ALL_SERVICES.find((s) => s.id === req.serviceId)?.name
      }`
    );
  };
  const byCategory = ALL_SERVICES.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {});

  return (
    <div>
      <PageTitle
        title="Estate Services"
        sub="Add services to your monthly payments"
      />
      {mySvcs.length > 0 && (
        <div
          className="card anim-up"
          style={{ padding: 22, marginBottom: 24, borderColor: "var(--brg)" }}
        >
          <div
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 16,
              fontWeight: 600,
              color: "var(--text)",
              marginBottom: 16,
            }}
          >
            Your Active Services
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {mySvcs.map((req) => {
              const svc = ALL_SERVICES.find((s) => s.id === req.serviceId);
              return (
                <div
                  key={req.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: "var(--bg2)",
                    borderRadius: "var(--r-md)",
                    border: "1px solid var(--br)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{svc?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13.5,
                        color: "var(--text)",
                      }}
                    >
                      {svc?.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--sub)" }}>
                      {svc?.category}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontWeight: 600,
                        fontSize: 13,
                        color: "var(--text)",
                        marginBottom: 4,
                      }}
                    >
                      {fmt(svc?.price || 0)}/mo
                    </div>
                    <Tag
                      status={
                        req.status === "approved" ? "confirmed" : "pending"
                      }
                    />
                  </div>
                  <button
                    className="btn-danger"
                    onClick={() => cancelService(req)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "var(--r-sm)",
                      fontSize: 11.5,
                      marginLeft: 8,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid var(--br)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "var(--sub)" }}>
              Total monthly add-ons
            </span>
            <span
              style={{
                fontFamily: "'DM Mono',monospace",
                fontWeight: 700,
                fontSize: 16,
                color: "var(--gold)",
              }}
            >
              {fmt(
                mySvcs.reduce(
                  (a, r) =>
                    a +
                    (ALL_SERVICES.find((s) => s.id === r.serviceId)?.price ||
                      0),
                  0
                )
              )}
              /mo
            </span>
          </div>
        </div>
      )}

      {Object.entries(byCategory).map(([cat, svcs]) => (
        <div key={cat} className="anim-up" style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--sub)",
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            {cat}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: 12,
            }}
          >
            {svcs.map((svc) => {
              const existing = mySvcs.find((r) => r.serviceId === svc.id);
              return (
                <div
                  key={svc.id}
                  className="card"
                  style={{
                    padding: 20,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {existing && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background:
                          "linear-gradient(90deg,transparent,var(--goldl),transparent)",
                      }}
                    />
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "var(--r-md)",
                        background: "var(--goldpale)",
                        border: "1px solid var(--brg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                      }}
                    >
                      {svc.icon}
                    </div>
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontWeight: 700,
                        fontSize: 14,
                        color: "var(--gold)",
                      }}
                    >
                      {fmt(svc.price)}/mo
                    </span>
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--text)",
                      marginBottom: 5,
                    }}
                  >
                    {svc.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: "var(--sub)",
                      lineHeight: 1.5,
                      marginBottom: 14,
                    }}
                  >
                    {svc.desc}
                  </div>
                  {existing ? (
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Tag
                        status={
                          existing.status === "approved"
                            ? "confirmed"
                            : "pending"
                        }
                      />
                      <span style={{ fontSize: 11.5, color: "var(--dim)" }}>
                        · Already subscribed
                      </span>
                    </div>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => setConfirm(svc)}
                      style={{
                        width: "100%",
                        padding: "9px 0",
                        borderRadius: "var(--r-sm)",
                        fontSize: 13,
                      }}
                    >
                      + Add to my services
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Add Service"
        w={440}
      >
        {confirm && (
          <>
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>
                {confirm.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {confirm.name}
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "var(--sub)",
                  marginBottom: 12,
                }}
              >
                {confirm.desc}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--gold)",
                }}
              >
                {fmt(confirm.price)}
                <span style={{ fontSize: 14, color: "var(--sub)" }}>
                  /month
                </span>
              </div>
            </div>
            <div
              style={{
                background: "var(--amberpale)",
                border: "1px solid rgba(155,106,0,.15)",
                borderRadius: "var(--r-sm)",
                padding: "10px 14px",
                fontSize: 12.5,
                color: "var(--amber)",
                marginBottom: 20,
              }}
            >
              This service will be added to your monthly charges. The estate
              admin will confirm and activate it.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-ghost"
                onClick={() => setConfirm(null)}
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
                onClick={() => requestService(confirm)}
                style={{
                  flex: 2,
                  padding: "10px 0",
                  borderRadius: "var(--r-md)",
                  fontSize: 13,
                }}
              >
                Request Service
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

export function TNotifs({ myN, tab, setTab }) {
  const typeColor = (t) =>
    t === "alert"
      ? "var(--red)"
      : t === "reminder"
      ? "var(--amber)"
      : "var(--blue)";
  const typeIcon = (t) =>
    t === "alert" ? "⚠️" : t === "reminder" ? "🔔" : "ℹ️";
  const typeBg = (t) =>
    t === "alert"
      ? "var(--redpale)"
      : t === "reminder"
      ? "var(--amberpale)"
      : "var(--bluepale)";

  return (
    <div>
      <PageTitle
        title="Notifications"
        sub={`${myN.length} notifications · ${
          myN.filter((n) => !n.read).length
        } unread`}
      />
      {myN.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--sub)" }}>
          No notifications yet.
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {[...myN].reverse().map((n, i) => (
          <div
            key={n.id}
            className="card anim-up"
            style={{
              padding: "16px 18px",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              animationDelay: `${i * 0.04}s`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "var(--r-md)",
                background: typeBg(n.type),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              {typeIcon(n.type)}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text)",
                  lineHeight: 1.65,
                  margin: "0 0 5px",
                }}
              >
                {n.message}
              </p>
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: "var(--dim)",
                }}
              >
                {n.date}
              </span>
            </div>
            {!n.read && (
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--red)",
                  flexShrink: 0,
                  marginTop: 6,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TSettings({
  me,
  tenants,
  setTenants,
  setMe,
  log,
  tab,
  setTab,
}) {
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
    <div style={{ maxWidth: 480 }}>
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
            padding: "11px 28px",
            borderRadius: "var(--r-md)",
            fontSize: 13.5,
          }}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
