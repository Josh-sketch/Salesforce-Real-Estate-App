import { useState } from "react";
import { Tag, Avatar, Lbl, Field, SelectField, Modal, PageTitle } from "../../components/UI";
import { fmt, TODAY, daysUntil } from "../../utils";
import { ALL_SERVICES } from "../../data/constants";

/* ── Admin: Overview ── */
export function ADash({ tenants, payments, tickets, properties }) {
  const confirmed = payments.filter((p) => p.status === "confirmed");
  const pending = payments.filter((p) => p.status === "pending");
  const revenue = confirmed.reduce((a, p) => a + p.amount, 0);

  const SC = ({ label, val, sub, accent = "var(--gold)", icon, delay = 0 }) => (
    <div className="card anim-up" style={{ padding: 22, animationDelay: `${delay}s`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${accent}80,${accent},${accent}80,transparent)` }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Lbl>{label}</Lbl>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 28, fontWeight: 500, color: "var(--text)", lineHeight: 1.1, marginBottom: 5 }}>{val}</div>
          {sub && <div style={{ fontSize: 11.5, color: "var(--sub)" }}>{sub}</div>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: "var(--r-md)", background: "var(--bg2)", border: "1px solid var(--br)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <PageTitle title="Overview" sub="Estate performance at a glance" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 26 }}>
        <SC label="Active Tenants" val={tenants.filter((t) => t.status === "active").length} sub={`of ${tenants.length} total`} icon="👥" delay={0} />
        <SC label="Revenue (Conf.)" val={`₦${(revenue / 1000000).toFixed(2)}M`} sub={`${confirmed.length} payments`} accent="var(--green)" icon="💰" delay={0.06} />
        <SC label="Pending Review" val={pending.length} sub="awaiting action" accent="var(--amber)" icon="⏳" delay={0.12} />
        <SC label="Properties" val={properties.length} sub="managed estates" accent="var(--blue)" icon="🏢" delay={0.18} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        <div className="card anim-up d2" style={{ padding: 22 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 18 }}>Recent Payments</div>
          {payments.slice(0, 5).map((p, i, a) => {
            const t = tenants.find((t) => t.id === p.tenantId);
            return (
              <div key={p.id} className="tr" style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none" }}>
                {t && <Avatar t={t} size={32} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 12.5, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t?.name}</div>
                  <div style={{ fontSize: 11, color: "var(--dim)" }}>{p.period}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 500, fontSize: 12, color: "var(--text)", marginBottom: 3 }}>{fmt(p.amount)}</div>
                  <Tag status={p.status} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="card anim-up d3" style={{ padding: 22 }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 18 }}>Properties</div>
          {properties.map((prop, i, a) => (
            <div key={prop.id} style={{ padding: "10px 0", borderBottom: i < a.length - 1 ? "1px solid var(--br)" : "none" }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 3 }}>{prop.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "var(--dim)" }}>{prop.type.toUpperCase()}</span>
                <span style={{ fontSize: 11.5, color: "var(--sub)" }}>{prop.units.length} units</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Admin: Properties ── */
export function AProperties({ properties, setProperties, tenants, landlords, log }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(false);
  const [f, setF] = useState({ name: "", type: "flat", address: "", landlordId: "", unitCount: 1, landSubtype: "plot", landMeasurement: "" });
  const [unitF, setUnitF] = useState({ label: "", measurement: "" });
  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const propTypes = [{ value: "flat", label: "Flat / Apartment" }, { value: "shop", label: "Shop / Commercial" }, { value: "land", label: "Land / Plot" }];
  const landSubtypes = ["plot", "acre", "hectare"];

  const generateUnits = (type, count, subtype) => {
    const units = [];
    for (let i = 1; i <= count; i++) {
      if (type === "flat") units.push({ id: `UNIT_${Date.now()}_${i}`, label: `Flat ${i}`, status: "vacant" });
      else if (type === "shop") units.push({ id: `UNIT_${Date.now()}_${i}`, label: `Shop ${i}`, status: "vacant" });
      else units.push({ id: `UNIT_${Date.now()}_${i}`, label: `${subtype.charAt(0).toUpperCase() + subtype.slice(1)} ${i}`, subtype, measurement: "" });
    }
    return units;
  };

  const saveProperty = () => {
    if (!f.name || !f.type) return;
    const units = generateUnits(f.type, parseInt(f.unitCount) || 1, f.landSubtype);
    const newProp = { id: `PROP${Date.now()}`, name: f.name, type: f.type, landlordId: f.landlordId, address: f.address, units };
    setProperties((p) => [...p, newProp]);
    log(`New property added: ${f.name} (${f.type})`);
    setShowAdd(false);
    setF({ name: "", type: "flat", address: "", landlordId: "", unitCount: 1, landSubtype: "plot", landMeasurement: "" });
  };

  const addUnit = () => {
    if (!unitF.label) return;
    setProperties((ps) => ps.map((p) => {
      if (p.id !== selectedProp.id) return p;
      const newUnit = { id: `UNIT_${Date.now()}`, label: unitF.label, status: "vacant", measurement: unitF.measurement };
      const updated = { ...p, units: [...p.units, newUnit] };
      setSelectedProp(updated);
      return updated;
    }));
    log(`Unit added to ${selectedProp.name}: ${unitF.label}`);
    setShowAddUnit(false);
    setUnitF({ label: "", measurement: "" });
  };

  const propIcon = (t) => (t === "flat" ? "🏢" : t === "shop" ? "🏪" : "🌱");

  return (
    <div>
      <PageTitle title="Properties" sub={`${properties.length} managed properties`} right={<button className="btn-primary" onClick={() => setShowAdd(true)} style={{ padding: "9px 20px", borderRadius: "var(--r-md)", fontSize: 13 }}>+ Add Property</button>} />

      {selectedProp ? (
        <div>
          <button onClick={() => setSelectedProp(null)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "var(--gold)", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>← Back to properties</button>
          <div className="card anim-up" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: "var(--r-md)", background: "var(--goldpale)", border: "1px solid var(--brg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{propIcon(selectedProp.type)}</div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 3 }}>{selectedProp.name}</div>
                  <div style={{ fontSize: 12.5, color: "var(--sub)" }}>{selectedProp.address}</div>
                </div>
              </div>
              <button className="btn-primary" onClick={() => setShowAddUnit(true)} style={{ padding: "8px 16px", borderRadius: "var(--r-sm)", fontSize: 13 }}>+ Add Unit</button>
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>Units & Tenants</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 }}>
              {selectedProp.units.map((unit) => {
                const tenant = tenants.find((t) => t.propertyId === selectedProp.id && t.unit === unit.label);
                return (
                  <div key={unit.id} style={{ padding: 16, background: "var(--bg2)", borderRadius: "var(--r-md)", border: "1px solid var(--br)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{unit.label}</div>
                      <Tag status={tenant ? "active" : "inactive"} />
                    </div>
                    {unit.subtype && <div style={{ fontSize: 11.5, color: "var(--dim)", marginBottom: 6 }}>Type: {unit.subtype} {unit.measurement && `· ${unit.measurement}`}</div>}
                    {tenant ? (
                      <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                        <Avatar t={tenant} size={28} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{tenant.name}</div>
                          <div style={{ fontSize: 11, color: "var(--dim)" }}>{tenant.email}</div>
                        </div>
                      </div>
                    ) : <div style={{ fontSize: 12.5, color: "var(--dim)", fontStyle: "italic" }}>Vacant</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {properties.map((prop, i) => {
            const propTenants = tenants.filter((t) => t.propertyId === prop.id);
            const ll = landlords.find((l) => l.id === prop.landlordId);
            return (
              <div key={prop.id} className="card anim-up" style={{ padding: 22, cursor: "pointer", animationDelay: `${i * 0.06}s` }} onClick={() => setSelectedProp(prop)}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "var(--goldpale)", border: "1px solid var(--brg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{propIcon(prop.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 3 }}>{prop.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--sub)" }}>{prop.address}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="tag" style={{ background: "var(--bluepale)", color: "var(--blue)" }}>{prop.type.toUpperCase()}</span>
                  <span className="tag" style={{ background: "var(--bg2)", color: "var(--sub)" }}>{prop.units.length} units</span>
                  <span className="tag" style={{ background: "var(--greenpale)", color: "var(--green)" }}>{propTenants.length} tenants</span>
                </div>
                {ll && <div style={{ marginTop: 10, fontSize: 11.5, color: "var(--dim)" }}>Landlord: {ll.name}</div>}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Property" w={580}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <Field label="Property Name" value={f.name} onChange={(e) => sf("name", e.target.value)} span2 placeholder="e.g. Greenview Residence" />
          <SelectField label="Property Type" value={f.type} onChange={(e) => sf("type", e.target.value)} options={propTypes} half />
          <SelectField label="Landlord" value={f.landlordId} onChange={(e) => sf("landlordId", e.target.value)} half options={[{ value: "", label: "Select landlord" }, ...landlords.map((l) => ({ value: l.id, label: l.name }))]} />
          <Field label="Address" value={f.address} onChange={(e) => sf("address", e.target.value)} span2 />
          {f.type !== "land" && <Field label={f.type === "flat" ? "Number of Flats" : "Number of Shops"} value={f.unitCount} onChange={(e) => sf("unitCount", e.target.value)} type="number" half />}
          {f.type === "land" && (
            <>
              <SelectField label="Land Sub-type" value={f.landSubtype} onChange={(e) => sf("landSubtype", e.target.value)} half options={landSubtypes.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
              <Field label="Number of Plots/Parcels" value={f.unitCount} onChange={(e) => sf("unitCount", e.target.value)} type="number" half />
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
          <button className="btn-primary" onClick={saveProperty} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Create Property</button>
        </div>
      </Modal>

      <Modal open={showAddUnit} onClose={() => setShowAddUnit(false)} title="Add Unit">
        <div style={{ display: "grid", gap: 13 }}>
          <Field label="Unit Label" value={unitF.label} onChange={(e) => setUnitF((p) => ({ ...p, label: e.target.value }))} span2 placeholder="e.g. Flat 5 / Shop 3 / Plot C" />
          {selectedProp?.type === "land" && <Field label="Measurement (optional)" value={unitF.measurement} onChange={(e) => setUnitF((p) => ({ ...p, measurement: e.target.value }))} span2 placeholder="e.g. 500 sqm" />}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={() => setShowAddUnit(false)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
          <button className="btn-primary" onClick={addUnit} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Add Unit</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Admin: Tenants ── */
export function ATenants({ tenants, setTenants, payments, properties, log, push }) {
  const blank = { name: "", email: "", phone: "", propertyId: "", unit: "", floor: "", rentAmount: "", rentDueDay: "1", leaseStart: "", leaseEnd: "", password: "", image: null };
  const [open, setOpen] = useState(false);
  const [ed, setEd] = useState(null);
  const [f, setF] = useState(blank);
  const [selectedPropId, setSelectedPropId] = useState("");
  const sf = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const selectedPropUnits = properties.find((p) => p.id === (ed ? f.propertyId : selectedPropId))?.units || [];

  const openForm = (t = null) => {
    setEd(t); setF(t ? { ...t } : blank);
    setSelectedPropId(t?.propertyId || ""); setOpen(true);
  };
  const onImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => sf("image", ev.target.result);
    r.readAsDataURL(file);
  };
  const save = () => {
    if (!f.name || !f.email || !f.unit) return;
    if (ed) {
      setTenants((ts) => ts.map((t) => (t.id === ed.id ? { ...t, ...f } : t)));
      log(`Tenant updated: ${f.name}`);
    } else {
      const id = `T${String(tenants.length + 1).padStart(3, "0")}`;
      setTenants((ts) => [...ts, { ...f, id, propertyId: selectedPropId, status: "active", rentAmount: Number(f.rentAmount) }]);
      log(`New tenant created: ${f.name}`);
      push(id, `Welcome to Mechtron Estate Management, ${f.name.split(" ")[0]}! Your tenant portal is now active.`);
    }
    setOpen(false);
  };

  return (
    <div>
      <PageTitle title="Tenants" sub={`${tenants.length} registered tenants`} right={<button className="btn-primary" onClick={() => openForm()} style={{ padding: "9px 20px", borderRadius: "var(--r-md)", fontSize: 13 }}>+ Add Tenant</button>} />
      <div style={{ display: "grid", gap: 12 }}>
        {tenants.map((t, i) => {
          const lp = payments.filter((p) => p.tenantId === t.id && p.status === "confirmed").slice(-1)[0];
          const leaseD = daysUntil(t.leaseEnd);
          const prop = properties.find((p) => p.id === t.propertyId);
          return (
            <div key={t.id} className="card anim-up" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, animationDelay: `${i * 0.04}s` }}>
              <Avatar t={t} size={46} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{t.name}</span>
                  <Tag status="active" />
                  {leaseD < 90 && <span className="tag" style={{ background: "var(--redpale)", color: "var(--red)" }}>⚠ Lease expiring</span>}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 16px", color: "var(--sub)", fontSize: 12.5 }}>
                  {prop && <span>🏢 {prop.name}</span>}
                  <span>🏠 {t.unit}</span>
                  <span>📧 {t.email}</span>
                  <span>📱 {t.phone}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11.5 }}>{fmt(t.rentAmount)}/yr</span>
                  <span>Lease → {t.leaseEnd}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 10.5, color: "var(--dim)", marginBottom: 3 }}>Last confirmed</div>
                <div style={{ fontWeight: 500, fontSize: 12.5, color: "var(--text)", marginBottom: 9 }}>{lp ? lp.period : "—"}</div>
                <button className="btn-ghost" onClick={() => openForm(t)} style={{ padding: "6px 16px", borderRadius: "var(--r-sm)", fontSize: 12 }}>Edit</button>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={ed ? "Edit Tenant" : "New Tenant"} w={620}>
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "var(--bg2)", margin: "0 auto 10px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: "2px dashed var(--br)" }}>
            {f.image ? <img src={f.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : "👤"}
          </div>
          <label style={{ cursor: "pointer", color: "var(--gold)", fontSize: 12.5, fontWeight: 600 }}>
            {f.image ? "Change photo" : "Upload photo"}
            <input type="file" accept="image/*" onChange={onImg} style={{ display: "none" }} />
          </label>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <Field label="Full Name" value={f.name} onChange={(e) => sf("name", e.target.value)} span2 />
          <Field label="Email" value={f.email} onChange={(e) => sf("email", e.target.value)} type="email" half />
          <Field label="Phone" value={f.phone} onChange={(e) => sf("phone", e.target.value)} half />
          <div style={{ gridColumn: "span 2" }}>
            <Lbl>Property</Lbl>
            <select className="field" value={ed ? f.propertyId : selectedPropId} onChange={(e) => { ed ? sf("propertyId", e.target.value) : setSelectedPropId(e.target.value); sf("unit", ""); }}>
              <option value="">Select property</option>
              {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <Lbl>Unit / Space</Lbl>
            <select className="field" value={f.unit} onChange={(e) => sf("unit", e.target.value)}>
              <option value="">Select unit</option>
              {selectedPropUnits.map((u) => <option key={u.id} value={u.label}>{u.label}</option>)}
            </select>
          </div>
          <Field label="Floor" value={f.floor} onChange={(e) => sf("floor", e.target.value)} half />
          <Field label="Annual Rent (₦)" value={f.rentAmount} onChange={(e) => sf("rentAmount", e.target.value)} type="number" half />
          <Field label="Due Day (1–28)" value={f.rentDueDay} onChange={(e) => sf("rentDueDay", e.target.value)} type="number" half />
          <Field label="Lease Start" value={f.leaseStart} onChange={(e) => sf("leaseStart", e.target.value)} type="date" half />
          <Field label="Lease End" value={f.leaseEnd} onChange={(e) => sf("leaseEnd", e.target.value)} type="date" half />
          {!ed && <Field label="Password" value={f.password} onChange={(e) => sf("password", e.target.value)} type="password" span2 />}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={() => setOpen(false)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
          <button className="btn-primary" onClick={save} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>{ed ? "Save changes" : "Create tenant"}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Admin: Payments ── */
export function APayments({ tenants, payments, setPayments, log, push }) {
  const [filter, setFilter] = useState("all");
  const [rev, setRev] = useState(null);
  const [note, setNote] = useState("");

  const list = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  const confirm = (p) => {
    setPayments((ps) => ps.map((x) => x.id === p.id ? { ...x, status: "confirmed", confirmedDate: TODAY.toISOString().split("T")[0], adminNote: note } : x));
    const t = tenants.find((t) => t.id === p.tenantId);
    log(`${p.id} confirmed — ${t?.name}, ${p.period}`);
    push(p.tenantId, `Your payment of ${fmt(p.amount)} for ${p.period} has been confirmed ✓`, "info");
    setRev(null); setNote("");
  };
  const reject = (p) => {
    setPayments((ps) => ps.map((x) => x.id === p.id ? { ...x, status: "rejected", adminNote: note } : x));
    const t = tenants.find((t) => t.id === p.tenantId);
    log(`${p.id} rejected — ${t?.name}: ${note}`);
    push(p.tenantId, `Your payment for ${p.period} was rejected. ${note || "Please resubmit a clearer receipt."}`, "alert");
    setRev(null); setNote("");
  };

  return (
    <div>
      <PageTitle title="Payments" sub="Review tenant payment receipts" />
      <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
        {["all", "pending", "confirmed", "rejected"].map((f) => {
          const count = f === "all" ? payments.length : payments.filter((p) => p.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter === f ? "var(--brg)" : "var(--br)"}`, cursor: "pointer", fontWeight: 600, fontSize: 12, background: filter === f ? "var(--goldpale)" : "var(--bg1)", color: filter === f ? "var(--gold)" : "var(--sub)", transition: "all .16s", boxShadow: filter === f ? "var(--shadow-sm)" : "none" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} <span style={{ opacity: 0.6 }}>({count})</span>
            </button>
          );
        })}
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--br)", background: "var(--bg2)" }}>
              {["Ref","Tenant","Period","Amount","Receipt","Submitted","Status",""].map((h) => (
                <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--dim)", letterSpacing: 1.1, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((p, i) => {
              const t = tenants.find((t) => t.id === p.tenantId);
              return (
                <tr key={p.id} className="tr" style={{ borderBottom: i < list.length - 1 ? "1px solid var(--br)" : "none" }}>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--dim)" }}>{p.id}</span></td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      {t && <Avatar t={t} size={28} />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text)" }}>{t?.name}</div>
                        <div style={{ fontSize: 11, color: "var(--dim)" }}>{t?.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--sub)", whiteSpace: "nowrap" }}>{p.period}</td>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 500, fontSize: 13, color: "var(--text)" }}>{fmt(p.amount)}</span></td>
                  <td style={{ padding: "13px 16px" }}><span style={{ fontSize: 11.5, color: "var(--gold)" }}>📎 {p.receiptName}</span></td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "var(--dim)", whiteSpace: "nowrap" }}>{p.submittedDate}</td>
                  <td style={{ padding: "13px 16px" }}><Tag status={p.status} /></td>
                  <td style={{ padding: "13px 16px" }}>
                    {p.status === "pending" ? (
                      <button className="btn-ghost" onClick={() => { setRev(p); setNote(""); }} style={{ padding: "5px 12px", borderRadius: "var(--r-sm)", fontSize: 11.5 }}>Review</button>
                    ) : <span style={{ fontSize: 11, color: "var(--dim)" }}>{p.confirmedDate || "—"}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={!!rev} onClose={() => setRev(null)} title="Review Payment" w={500}>
        {rev && (() => {
          const t = tenants.find((t) => t.id === rev.tenantId);
          return (
            <>
              <div style={{ background: "var(--bg2)", borderRadius: "var(--r-md)", padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                  {t && <Avatar t={t} size={42} />}
                  <div><div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{t?.name}</div><div style={{ fontSize: 12, color: "var(--sub)" }}>{t?.unit}</div></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[["Ref", rev.id], ["Period", rev.period], ["Amount", fmt(rev.amount)], ["File", rev.receiptName]].map(([k, v]) => (
                    <div key={k}><Lbl>{k}</Lbl><div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", fontFamily: k === "Ref" || k === "Amount" ? "'DM Mono',monospace" : "inherit" }}>{v}</div></div>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <Lbl>Admin note (optional)</Lbl>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="field" style={{ resize: "none" }} placeholder="Visible to tenant..." />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setRev(null)} className="btn-ghost" style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
                <button onClick={() => reject(rev)} className="btn-danger" style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Reject</button>
                <button onClick={() => confirm(rev)} className="btn-primary" style={{ flex: 1.4, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Confirm</button>
              </div>
            </>
          );
        })()}
      </Modal>
    </div>
  );
}

/* ── Admin: Tickets ── */
export function ATickets({ tenants, tickets, setTickets, log, push }) {
  const [upd, setUpd] = useState(null);
  const [resp, setResp] = useState("");
  const [stat, setStat] = useState("");

  const save = () => {
    setTickets((ts) => ts.map((t) => t.id === upd.id ? { ...t, status: stat || t.status, adminResponse: resp, updatedDate: TODAY.toISOString().split("T")[0] } : t));
    log(`TKT ${upd.id} → ${stat || upd.status}`);
    push(upd.tenantId, `Ticket update: "${upd.title}" is now ${(stat || upd.status).replace("_", " ")}.`, "info");
    setUpd(null);
  };

  return (
    <div>
      <PageTitle title="Maintenance Tickets" sub={`${tickets.filter((t) => t.status === "open").length} open · ${tickets.filter((t) => t.status === "in_progress").length} in progress`} />
      <div style={{ display: "grid", gap: 12 }}>
        {tickets.map((tk, i) => {
          const t = tenants.find((t) => t.id === tk.tenantId);
          return (
            <div key={tk.id} className="card anim-up" style={{ padding: "18px 22px", animationDelay: `${i * 0.04}s` }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {t && <Avatar t={t} size={38} />}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>{tk.title}</span>
                    <div style={{ display: "flex", gap: 5 }}><Tag status={tk.priority} /><Tag status={tk.status} /></div>
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--dim)", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace" }}>{tk.id}</span> · {t?.name} · {t?.unit} · {tk.category} · {tk.submittedDate}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.65 }}>{tk.description}</p>
                  {tk.adminResponse && <div style={{ marginTop: 10, background: "var(--greenpale)", border: "1px solid rgba(26,122,74,.18)", borderRadius: "var(--r-sm)", padding: "8px 12px", fontSize: 12.5, color: "var(--green)" }}>💬 {tk.adminResponse}</div>}
                </div>
                {tk.status !== "resolved" && (
                  <button className="btn-ghost" onClick={() => { setUpd(tk); setResp(tk.adminResponse); setStat(tk.status); }} style={{ padding: "7px 15px", borderRadius: "var(--r-sm)", fontSize: 12, flexShrink: 0 }}>Update</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!upd} onClose={() => setUpd(null)} title="Update Ticket">
        {upd && (
          <>
            <div style={{ fontSize: 13, color: "var(--sub)", marginBottom: 16, padding: "9px 12px", background: "var(--bg2)", borderRadius: "var(--r-sm)" }}>{upd.title}</div>
            <div style={{ marginBottom: 13 }}>
              <Lbl>New status</Lbl>
              <select value={stat} onChange={(e) => setStat(e.target.value)} className="field">
                <option value="open">Open</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <Lbl>Response to tenant</Lbl>
              <textarea value={resp} onChange={(e) => setResp(e.target.value)} rows={4} className="field" style={{ resize: "none" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={() => setUpd(null)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
              <button className="btn-primary" onClick={save} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Save update</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/* ── Admin: Landlords ── */
export function ALandlords({ landlords, setLandlords, properties, adminPayments, setAdminPayments, log }) {
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showPay, setShowPay] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [payF, setPayF] = useState({ amount: "", period: "", note: "" });

  const createLandlord = async () => {
    if (!f.name || !f.email || !f.phone || !f.password) { setErr("Please fill all required fields."); return; }
    setBusy(true); setErr("");
    try {
      const res = await fetch("/services/apexrest/auth/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.name, email: f.email, password: f.password, phone: f.phone }) });
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data.success) { setSuccess("Landlord created successfully!"); setF({ name: "", email: "", phone: "", password: "" }); }
      else setErr(data.message || "Failed to create landlord.");
    } catch (e) { setErr("Error creating landlord."); }
    finally { setBusy(false); }
  };

  const savePayment = () => {
    if (!payF.amount || !payF.period) return;
    setAdminPayments((ps) => [...ps, { id: `AP${Date.now()}`, landlordId: selected.id, amount: Number(payF.amount), period: payF.period, note: payF.note, date: TODAY.toISOString().split("T")[0], status: "paid" }]);
    log(`Admin payment received from ${selected.name}: ${fmt(payF.amount)}`);
    setShowPay(false); setPayF({ amount: "", period: "", note: "" });
  };

  return (
    <div>
      <PageTitle title="Landlords" sub={`${landlords.length} registered landlords`} right={<button className="btn-primary" onClick={() => setShowAdd(true)} style={{ padding: "9px 20px", borderRadius: "var(--r-md)", fontSize: 13 }}>+ Add Landlord</button>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
        {landlords.map((ll, i) => {
          const llProps = properties.filter((p) => p.id === ll.id || ll.properties?.includes(p.id));
          const llPays = adminPayments.filter((p) => p.landlordId === ll.id);
          return (
            <div key={ll.id} className="card anim-up" style={{ padding: 22, animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <Avatar t={ll} size={46} />
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 17, color: "var(--text)", marginBottom: 2 }}>{ll.name}</div>
                  <div style={{ fontSize: 12, color: "var(--sub)" }}>{ll.email}</div>
                  <div style={{ fontSize: 12, color: "var(--dim)" }}>{ll.phone}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <span className="tag" style={{ background: "var(--bluepale)", color: "var(--blue)" }}>{llProps.length} properties</span>
                <span className="tag" style={{ background: "var(--goldpale)", color: "var(--gold)" }}>{llPays.length} payments</span>
              </div>
              <button className="btn-ghost" onClick={() => setSelected(ll)} style={{ width: "100%", padding: "8px 0", borderRadius: "var(--r-sm)", fontSize: 12.5 }}>View Details →</button>
            </div>
          );
        })}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""} w={600}>
        {selected && (() => {
          const pays = adminPayments.filter((p) => p.landlordId === selected.id);
          const llProps = properties.filter((p) => selected.properties?.includes(p.id));
          return (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18, background: "var(--bg2)", borderRadius: "var(--r-md)", padding: 16 }}>
                {[["Email", selected.email], ["Phone", selected.phone]].map(([k, v]) => (
                  <div key={k}><Lbl>{k}</Lbl><div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{v}</div></div>
                ))}
              </div>
              {llProps.length > 0 && (
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10 }}>Properties</div>
                  {llProps.map((p) => <div key={p.id} style={{ padding: "8px 12px", background: "var(--bg2)", borderRadius: "var(--r-sm)", marginBottom: 6, fontSize: 13, color: "var(--text)" }}>{p.name} · {p.type}</div>)}
                </div>
              )}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 600, color: "var(--text)" }}>Admin Payments</div>
                  <button className="btn-primary" onClick={() => setShowPay(true)} style={{ padding: "6px 14px", borderRadius: "var(--r-sm)", fontSize: 12 }}>+ Record Payment</button>
                </div>
                {pays.length === 0 ? <div style={{ fontSize: 12.5, color: "var(--dim)" }}>No payments recorded.</div> : pays.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "var(--bg2)", borderRadius: "var(--r-sm)", marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{p.period}</div>
                      <div style={{ fontSize: 11, color: "var(--dim)" }}>{p.date} {p.note && `· ${p.note}`}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{fmt(p.amount)}</span>
                      <Tag status="confirmed" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          );
        })()}
      </Modal>

      <Modal open={showPay} onClose={() => setShowPay(false)} title="Record Payment from Landlord">
        <div style={{ display: "grid", gap: 13 }}>
          <Field label="Amount (₦)" value={payF.amount} onChange={(e) => setPayF((p) => ({ ...p, amount: e.target.value }))} type="number" span2 />
          <Field label="Period" value={payF.period} onChange={(e) => setPayF((p) => ({ ...p, period: e.target.value }))} span2 placeholder="e.g. Q1 2025" />
          <Field label="Note (optional)" value={payF.note} onChange={(e) => setPayF((p) => ({ ...p, note: e.target.value }))} span2 placeholder="e.g. Management fee" />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={() => setShowPay(false)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
          <button className="btn-primary" onClick={savePayment} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Save Payment</button>
        </div>
      </Modal>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Landlord">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>
          <Field label="Full Name" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} span2 />
          <Field label="Email" value={f.email} onChange={(e) => setF((p) => ({ ...p, email: e.target.value }))} type="email" half />
          <Field label="Phone" value={f.phone} onChange={(e) => setF((p) => ({ ...p, phone: e.target.value }))} half />
          <Field label="Password" value={f.password} onChange={(e) => setF((p) => ({ ...p, password: e.target.value }))} type="password" span2 />
        </div>
        {err && <div style={{ color: "var(--red)", fontSize: 12.5, marginTop: 10 }}>⚠ {err}</div>}
        {success && <div style={{ color: "var(--green)", fontSize: 12.5, marginTop: 10 }}>✓ {success}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button className="btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>Cancel</button>
          <button className="btn-primary" onClick={createLandlord} style={{ flex: 2, padding: "10px 0", borderRadius: "var(--r-md)", fontSize: 13 }}>{busy ? "Creating..." : "Create Landlord Account"}</button>
        </div>
      </Modal>
    </div>
  );
}

/* ── Admin: Services ── */
export function AServices({ serviceRequests, tenants }) {
  return (
    <div>
      <PageTitle title="Tenant Services" sub={`${serviceRequests.length} service requests · ${serviceRequests.filter((r) => r.status === "pending").length} pending`} />
      <div style={{ display: "grid", gap: 12 }}>
        {serviceRequests.map((req, i) => {
          const t = tenants.find((t) => t.id === req.tenantId);
          const svc = ALL_SERVICES.find((s) => s.id === req.serviceId);
          return (
            <div key={req.id} className="card anim-up" style={{ padding: "16px 22px", display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 0.04}s` }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--r-md)", background: "var(--goldpale)", border: "1px solid var(--brg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{svc?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 3 }}>{svc?.name}</div>
                <div style={{ fontSize: 12, color: "var(--sub)" }}>{t?.name} · {t?.unit} · {req.date}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 5 }}>{fmt(svc?.price || 0)}/mo</div>
                <Tag status={req.status === "approved" ? "confirmed" : "pending"} />
              </div>
            </div>
          );
        })}
        {serviceRequests.length === 0 && <div style={{ textAlign: "center", padding: 60, color: "var(--dim)" }}>No service requests yet.</div>}
      </div>
    </div>
  );
}

/* ── Admin: Settings ── */
export function ASettings({ pa, setPa, log }) {
  const [f, setF] = useState({ ...pa });
  const [saved, setSaved] = useState(false);
  const save = () => { setPa(f); log(`Payment account updated: ${f.bankName}`); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  return (
    <div>
      <PageTitle title="Settings" sub="Configure estate payment and system settings" />
      <div className="card anim-up" style={{ padding: 28, maxWidth: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--br)" }}>
          <div style={{ width: 36, height: 36, borderRadius: "var(--r-md)", background: "var(--goldpale)", border: "1px solid var(--brg)", display: "flex", alignItems: "center", justifyContent: "center" }}>💳</div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 16, color: "var(--text)" }}>Rent Payment Account</div>
            <div style={{ fontSize: 12, color: "var(--sub)" }}>Shown to tenants when generating payment details</div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 13 }}>
          {[["Bank Name", "bankName"], ["Account Name", "accountName"], ["Account Number", "accountNumber"], ["Sort Code", "sortCode"]].map(([l, k]) => (
            <div key={k}><Lbl>{l}</Lbl><input className="field" value={f[k] || ""} onChange={(e) => setF((p) => ({ ...p, [k]: e.target.value }))} /></div>
          ))}
        </div>
        {saved && <div style={{ background: "var(--greenpale)", border: "1px solid rgba(26,122,74,.22)", borderRadius: "var(--r-sm)", padding: "9px 13px", color: "var(--green)", fontSize: 12.5, fontWeight: 600, marginTop: 14 }}>✓ Changes saved</div>}
        <button className="btn-primary" onClick={save} style={{ width: "100%", padding: "11px 0", borderRadius: "var(--r-md)", fontSize: 13.5, marginTop: 16 }}>Save changes</button>
      </div>
    </div>
  );
}

/* ── Admin: Audit ── */
export function AAudit({ audit }) {
  return (
    <div>
      <PageTitle title="Audit Log" sub="All admin actions timestamped for accountability" />
      <div className="card anim-up" style={{ overflow: "hidden" }}>
        {audit.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 20px", borderBottom: i < audit.length - 1 ? "1px solid var(--br)" : "none" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{l.action}</div>
            <span style={{ fontSize: 11.5, color: "var(--sub)", whiteSpace: "nowrap" }}>{l.by}</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--dim)", whiteSpace: "nowrap" }}>{l.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
