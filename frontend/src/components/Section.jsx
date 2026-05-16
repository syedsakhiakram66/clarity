import { s } from "../styles/index.js";

export function Section({ label, children }) {
  return (
    <div style={s.section}>
      <div style={s.sectionLabel}>{label}</div>
      <div style={s.sectionContent}>{children}</div>
    </div>
  );
}