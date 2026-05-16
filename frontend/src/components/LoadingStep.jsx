import { useState, useEffect } from "react";

export function LoadingStep({ text, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 2500);
    return () => clearTimeout(timer);
  }, [index]);

  if (!visible) return null;

  return (
    <div style={{
      fontSize: "11px",
      color: "#444",
      marginTop: "6px",
      animation: "fadein 0.4s ease",
    }}>
      <span style={{ color: "#00ff88" }}>✓</span> {text}
    </div>
  );
}