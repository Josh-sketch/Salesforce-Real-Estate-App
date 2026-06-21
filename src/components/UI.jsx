import { STATUS } from "../data/constants";
import { getAC } from "../utils";
import { useEffect, useRef, useState } from "react";

export function RichTextEditor({ value, onChange, placeholder, height = 180 }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) return; // already initialized

    quillRef.current = new window.Quill(editorRef.current, {
      theme: "snow",
      placeholder: placeholder || "Write here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["clean"],
        ],
      },
    });

    // Fire onChange when content changes
    quillRef.current.on("text-change", () => {
      const html = quillRef.current.root.innerHTML;
      onChange(html);
    });
  }, []);

  // Sync value if set externally
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div
      style={{
        height: height,
        overflowY: "auto",
        border: "1px solid var(--br)",
        borderRadius: 8,
        background: "var(--bg2)",
        overflow: "hidden",
      }}
    >
      <div
        ref={editorRef}
        style={{ minHeight: 180, fontSize: 13, color: "var(--text)" }}
      />
    </div>
  );
}

export function Tag({ status }) {
  const s = STATUS[status] || {
    bg: "rgba(0,0,0,.06)",
    fg: "#6B6258",
    dot: "#6B6258",
    label: status,
  };
  return (
    <span className="tag" style={{ background: s.bg, color: s.fg }}>
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
}

export function Avatar({ t, size = 38 }) {
  const init = (t.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const col = getAC(t.id);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(145deg,${col},${col}99)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.33,
        flexShrink: 0,
        overflow: "hidden",
        boxShadow: `0 0 0 2px rgba(255,255,255,0.9), 0 0 0 3px ${col}30`,
      }}
    >
      {t.image ? (
        <img
          src={t.image}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        init
      )}
    </div>
  );
}

export function Lbl({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        color: "var(--sub)",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  half,
  span2,
}) {
  return (
    <div style={{ gridColumn: span2 ? "span 2" : half ? "span 1" : "span 2" }}>
      {label && <Lbl>{label}</Lbl>}
      <input
        className="field"
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export function SelectField({ label, value, onChange, options, half, span2 }) {
  return (
    <div style={{ gridColumn: span2 ? "span 2" : half ? "span 1" : "span 2" }}>
      {label && <Lbl>{label}</Lbl>}
      <select className="field" value={value || ""} onChange={onChange}>
        {options.map((o) => (
          <option key={o.value || o} value={o.value || o}>
            {o.label || o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Modal({ open, onClose, title, children, w = 520 }) {
  if (!open) return null;
  return (
    <div
      className="anim-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(250,248,245,.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 300,
        padding: 20,
      }}
    >
      <div
        className="anim-up"
        style={{
          background: "var(--bg1)",
          border: "1px solid var(--brg)",
          borderRadius: "var(--r-xl)",
          padding: "28px 30px",
          width: "100%",
          maxWidth: w,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 22,
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn-ghost"
            style={{
              width: 30,
              height: 30,
              borderRadius: "var(--r-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// export function PageTitle({ title, sub, right }) {
//   return (
//     <div
//       className="anim-up"
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-end",
//         marginBottom: 28,
//       }}
//     >
//       <div>
//         <h2
//           style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: 28,
//             fontWeight: 600,
//             color: "var(--text)",
//             marginBottom: 3,
//             letterSpacing: -0.3,
//           }}
//         >
//           {title}
//         </h2>
//         {sub && <p style={{ color: "var(--sub)", fontSize: 13 }}>{sub}</p>}
//       </div>
//       {right}
//     </div>
//   );
// }

// export function PageTitle({ title, sub, right }) {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   return (
//     <div
//       className="anim-up"
//       style={{
//         display: "flex",
//         flexDirection: isMobile ? "column" : "row",
//         justifyContent: "space-between",
//         alignItems: isMobile ? "flex-start" : "flex-end",
//         gap: isMobile ? 16 : 0,
//         marginBottom: 28,
//       }}
//     >
//       <div>
//         <h2
//           style={{
//             fontFamily: "'Cormorant Garamond',serif",
//             fontSize: isMobile ? 22 : 28,
//             fontWeight: 600,
//             color: "var(--text)",
//             marginBottom: 3,
//             letterSpacing: -0.3,
//           }}
//         >
//           {title}
//         </h2>
//         {sub && (
//           <p style={{ color: "var(--sub)", fontSize: isMobile ? 12 : 13 }}>
//             {sub}
//           </p>
//         )}
//       </div>
//       {right && (
//         <div
//           style={{
//             width: isMobile ? "100%" : "auto",
//           }}
//         >
//           {right}
//         </div>
//       )}
//     </div>
//   );
// }

export function PageTitle({ title, sub, right }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className="anim-up"
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "center" : "flex-end",
        textAlign: isMobile ? "center" : "left",
        gap: isMobile ? 16 : 0,
        marginBottom: 28,
      }}
    >
      <div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: isMobile ? 22 : 28,
            fontWeight: 600,
            color: "var(--text)",
            marginBottom: 3,
            letterSpacing: -0.3,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p style={{ color: "var(--sub)", fontSize: isMobile ? 12 : 13 }}>
            {sub}
          </p>
        )}
      </div>
      {right && (
        <div
          style={{
            width: isMobile ? "100%" : "auto",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}

export function StepHeader({ n, title }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "var(--r-sm)",
          background: "linear-gradient(135deg,var(--goldd),var(--goldl))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: 12,
          flexShrink: 0,
          boxShadow: "0 2px 6px rgba(139,103,40,.3)",
        }}
      >
        {n}
      </div>
      <span
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontWeight: 600,
          fontSize: 16,
          color: "var(--text)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

export function EstateLogo({ size = 32 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(145deg,var(--goldl),var(--goldd))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 2px 8px rgba(139,103,40,.25)`,
      }}
    >
      <svg
        width={size * 0.52}
        height={size * 0.52}
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d="M2 8L10 2L18 8V18H13V12H7V18H2V8Z" fill="#fff" />
      </svg>
    </div>
  );
}
