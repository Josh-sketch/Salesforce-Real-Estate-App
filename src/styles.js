export const GLOBAL_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg0: #FAF8F5;
  --bg1: #FFFFFF;
  --bg2: #F5F2EC;
  --bg3: #EDE8DF;
  --bg4: #E0D9CE;
  --br:  rgba(0,0,0,0.07);
  --brg: rgba(139,103,40,0.25);
  --gold: #8B6728;
  --goldl:#C49A3C;
  --goldd:#5C4218;
  --goldpale: rgba(139,103,40,0.08);
  --cream:#FAF8F5;
  --text: #1A1612;
  --sub:  #6B6258;
  --dim:  #9E9589;
  --green:#1A7A4A;
  --greenpale: rgba(26,122,74,0.09);
  --red:  #C0392B;
  --redpale: rgba(192,57,43,0.08);
  --amber:#9B6A00;
  --amberpale: rgba(155,106,0,0.09);
  --blue: #1A5276;
  --bluepale: rgba(26,82,118,0.08);
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 22px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.06);
}

body { background: var(--bg0); color: var(--text); font-family: 'Outfit', sans-serif; }
button, input, textarea, select { font-family: 'Outfit', sans-serif; outline: none; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 4px; }

input::placeholder, textarea::placeholder { color: var(--dim); }
select option { background: #fff; color: var(--text); }

@keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
@keyframes spin     { to { transform: rotate(360deg); } }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.45} }
@keyframes slideIn  { from { transform:translateX(-8px); opacity:0; } to { transform:translateX(0); opacity:1; } }

.anim-up  { animation: fadeUp  .45s cubic-bezier(.22,.68,0,1.1) both; }
.anim-in  { animation: fadeIn  .3s ease both; }
.d1 { animation-delay:.06s } .d2 { animation-delay:.12s } .d3 { animation-delay:.18s } .d4 { animation-delay:.24s } .d5 { animation-delay:.30s }

.gold-gradient {
  background: linear-gradient(125deg, var(--goldd), var(--goldl), var(--gold));
  background-size: 250% auto;
  animation: shimmer 4s linear infinite;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.gold-static {
  background: linear-gradient(135deg, var(--goldd), var(--goldl));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}

.btn-primary {
  background: linear-gradient(135deg, var(--goldd) 0%, var(--goldl) 100%);
  border: none; color: #fff; font-weight: 600;
  cursor: pointer; transition: opacity .18s, transform .18s, box-shadow .18s;
  position: relative; overflow: hidden;
  box-shadow: 0 2px 8px rgba(139,103,40,0.25);
}
.btn-primary:hover { opacity: .9; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(139,103,40,0.3); }
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  background: var(--bg1); border: 1px solid var(--br);
  color: var(--sub); cursor: pointer;
  transition: border-color .18s, color .18s, background .18s, box-shadow .18s;
  box-shadow: var(--shadow-sm);
}
.btn-ghost:hover { border-color: var(--brg); color: var(--gold); background: var(--goldpale); box-shadow: var(--shadow-md); }

.btn-danger {
  background: var(--redpale); border: 1px solid rgba(192,57,43,.2);
  color: var(--red); cursor: pointer; transition: background .18s;
}
.btn-danger:hover { background: rgba(192,57,43,.15); }

.card {
  background: var(--bg1);
  border: 1px solid var(--br);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color .2s, box-shadow .2s;
}
.card:hover { border-color: rgba(0,0,0,.1); box-shadow: var(--shadow-md); }
.card-gold {
  background: linear-gradient(145deg, var(--goldpale), rgba(196,154,60,0.03));
  border: 1px solid var(--brg);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
}

.field {
  width: 100%;
  background: var(--bg0);
  border: 1.5px solid var(--br);
  border-radius: var(--r-sm);
  padding: 10px 13px;
  font-size: 13.5px;
  color: var(--text);
  transition: border-color .18s, box-shadow .18s;
}
.field:focus { border-color: var(--brg); box-shadow: 0 0 0 3px rgba(139,103,40,0.08); background: var(--bg1); }

.nav-btn {
  display: flex; align-items: center; gap: 11px;
  padding: 10px 14px; border-radius: var(--r-md);
  border: none; cursor: pointer; font-size: 13px; font-weight: 500;
  width: 100%; text-align: left;
  background: transparent; color: var(--sub);
  transition: all .16s;
}
.nav-btn:hover { background: var(--bg2); color: var(--text); }
.nav-btn.active {
  background: var(--goldpale);
  color: var(--gold); border: 1px solid var(--brg);
  font-weight: 600;
}

.tr:hover { background: var(--bg2); }
.divider { height: 1px; background: var(--br); }

.tag {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 9px; border-radius: 20px;
  font-size: 11px; font-weight: 600; letter-spacing: .3px;
}

.sidebar-paper {
  background: linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%);
  border-right: 1px solid var(--br);
}

.section-label {
  font-size: 9.5px; color: var(--dim); font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 16px 4px 7px;
}
`;
