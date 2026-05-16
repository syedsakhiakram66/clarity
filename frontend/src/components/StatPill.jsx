export function StatPill({ label, value }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      border: "1px solid #222",
      padding: "12px 20px",
      minWidth: "80px",
    }}>
      <div style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>{value}</div>
      <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px", marginTop: "4px" }}>{label}</div>
    </div>
  );
}