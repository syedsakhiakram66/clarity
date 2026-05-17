// ─── Clarity Design System ────────────────────────────────────────────────────
// Terminal-brutalist aesthetic. High contrast. Every gray is readable.
// Mobile-first responsive via inline style helpers.
// ─────────────────────────────────────────────────────────────────────────────

export const BREAKPOINT = 600; // px

// Call this in components: isMobile = useIsMobile()
import { useState, useEffect } from "react";
export function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= BREAKPOINT);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

export const s = {
  // ─── ROOT ───────────────────────────────────────────────────────────────────
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#d4d4d4",
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    overflowX: "hidden",
  },

  // ─── TOPBAR ─────────────────────────────────────────────────────────────────
  topbar: {
    padding: "14px 24px",
    borderBottom: "1px solid #2a2a2a",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "sticky",
    top: 0,
    background: "#0a0a0a",
    zIndex: 100,
  },
  brand: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: "5px",
    flexShrink: 0,
  },
  brandSub: {
    fontSize: "11px",
    color: "#666",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // ─── HOME ───────────────────────────────────────────────────────────────────
  home: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  homeContent: {
    flex: 1,
    maxWidth: "720px",
    margin: "0 auto",
    padding: "48px 20px 80px",
    width: "100%",
    boxSizing: "border-box",
  },

  // ─── TITLE ──────────────────────────────────────────────────────────────────
  titleBlock: {
    marginBottom: "40px",
  },
  titlePre: {
    fontSize: "11px",
    color: "#555",
    marginBottom: "14px",
    letterSpacing: "1px",
  },
  title: {
    fontSize: "clamp(26px, 5vw, 44px)",
    fontWeight: "bold",
    color: "#ffffff",
    lineHeight: 1.15,
    marginBottom: "14px",
    fontFamily: "inherit",
    margin: "0 0 14px 0",
  },
  titleAccent: {
    color: "#ffffff",
    borderBottom: "2px solid #ffffff",
    paddingBottom: "2px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    marginTop: "12px",
    lineHeight: 1.6,
  },

  // ─── HISTORY ────────────────────────────────────────────────────────────────
  historyBlock: {
    marginBottom: "28px",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    border: "1px solid #222",
    marginBottom: "6px",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
    gap: "12px",
  },

  // ─── EXAMPLE REPOS ──────────────────────────────────────────────────────────
  exampleBlock: {
    marginBottom: "28px",
  },
  exampleRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  exampleChip: {
    border: "1px solid #2a2a2a",
    padding: "12px 14px",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
    background: "#0f0f0f",
  },
  exampleName: {
    fontSize: "12px",
    color: "#d4d4d4",
    marginBottom: "4px",
    fontFamily: "inherit",
  },
  exampleMeta: {
    fontSize: "11px",
    color: "#666",
  },

  // ─── SEARCH ─────────────────────────────────────────────────────────────────
  searchBlock: {
    marginBottom: "24px",
  },
  searchLabel: {
    fontSize: "11px",
    color: "#666",
    marginBottom: "8px",
    letterSpacing: "1px",
  },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #2a2a2a",
    padding: "12px 14px",
    background: "#0f0f0f",
  },
  searchIcon: {
    color: "#555",
    fontSize: "16px",
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e8e8e8",
    fontSize: "14px",
    fontFamily: "inherit",
    minWidth: 0,
  },
  searchSpinner: {
    color: "#555",
    fontSize: "12px",
    flexShrink: 0,
  },
  dropdown: {
    border: "1px solid #2a2a2a",
    borderTop: "none",
    background: "#0f0f0f",
    maxHeight: "280px",
    overflowY: "auto",
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #1a1a1a",
    transition: "background 0.1s",
  },
  dropdownName: {
    fontSize: "13px",
    color: "#e8e8e8",
    marginBottom: "3px",
  },
  dropdownMeta: {
    fontSize: "11px",
    color: "#777",
  },
  selectedRepo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    background: "#0f0f0f",
    border: "1px solid #2a2a2a",
    borderTop: "none",
    flexWrap: "wrap",
  },
  selectedTag: {
    fontSize: "9px",
    color: "#fff",
    background: "#2a2a2a",
    padding: "3px 7px",
    letterSpacing: "2px",
    flexShrink: 0,
  },
  selectedName: {
    fontSize: "13px",
    color: "#ffffff",
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  selectedMeta: {
    fontSize: "11px",
    color: "#777",
    flexShrink: 0,
  },

  // ─── MODE SELECTION ──────────────────────────────────────────────────────────
  modeBlock: {
    marginBottom: "28px",
  },
  modeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  modeCard: {
    border: "1px solid #2a2a2a",
    padding: "16px",
    cursor: "pointer",
    background: "#0f0f0f",
    transition: "border-color 0.15s, background 0.15s",
  },
  modeCardActive: {
    borderColor: "#ffffff",
    background: "#161616",
  },
  modeLabel: {
    fontSize: "12px",
    color: "#ffffff",
    marginBottom: "6px",
    letterSpacing: "1px",
    fontWeight: "bold",
  },
  modeDesc: {
    fontSize: "12px",
    color: "#888",
    lineHeight: 1.5,
  },

  // ─── ANALYZE BUTTON ──────────────────────────────────────────────────────────
  analyzeBtn: {
    background: "#ffffff",
    color: "#000000",
    border: "none",
    padding: "16px 32px",
    fontSize: "13px",
    fontFamily: "inherit",
    fontWeight: "bold",
    letterSpacing: "3px",
    cursor: "pointer",
    width: "100%",
    display: "block",
    transition: "opacity 0.2s",
    marginTop: "8px",
  },

  // ─── LOADING ─────────────────────────────────────────────────────────────────
  loadingBlock: {
    marginBottom: "20px",
  },
  loadingBar: {
    height: "1px",
    background: "#222",
    marginBottom: "10px",
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    width: "40%",
    background: "#ffffff",
    animation: "slide 1.2s ease-in-out infinite",
  },
  loadingMsg: {
    fontSize: "11px",
    color: "#777",
    marginBottom: "4px",
  },
  loadingSteps: {
    marginTop: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  // ─── ERROR ───────────────────────────────────────────────────────────────────
  error: {
    fontSize: "12px",
    color: "#ff5555",
    marginBottom: "16px",
    fontFamily: "inherit",
    padding: "10px 14px",
    border: "1px solid #ff555533",
    background: "#110000",
    lineHeight: 1.5,
  },

  // ─── RESULTS ─────────────────────────────────────────────────────────────────
  results: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  resultsTopbar: {
    padding: "12px 20px",
    borderBottom: "1px solid #2a2a2a",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "sticky",
    top: 0,
    background: "#0a0a0a",
    zIndex: 100,
  },
  resultsRepo: {
    fontSize: "11px",
    color: "#666",
    flex: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    color: "#888",
    padding: "5px 12px",
    fontSize: "11px",
    fontFamily: "inherit",
    cursor: "pointer",
    flexShrink: 0,
    transition: "border-color 0.15s, color 0.15s",
    whiteSpace: "nowrap",
  },
  resultsContent: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "32px 20px 80px",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "left",
  },

  // ─── HERO ────────────────────────────────────────────────────────────────────
  modeBadge: {
    fontSize: "10px",
    color: "#666",
    letterSpacing: "2px",
    marginBottom: "12px",
  },
  heroBlock: {
    marginBottom: "32px",
    paddingBottom: "28px",
    borderBottom: "1px solid #1a1a1a",
  },
  heroTitle: {
    fontSize: "clamp(18px, 3vw, 28px)",
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "8px",
    wordBreak: "break-all",
  },
  heroStats: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  // ─── REPORT SECTIONS ─────────────────────────────────────────────────────────
  reportWrap: {
    display: "flex",
    flexDirection: "column",
  },
  section: {
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "28px",
    marginBottom: "28px",
  },
  sectionLabel: {
    fontSize: "10px",
    color: "#666",
    letterSpacing: "3px",
    marginBottom: "16px",
    textTransform: "uppercase",
  },
  sectionContent: {},
  bodyText: {
    fontSize: "14px",
    color: "#c8c8c8",
    lineHeight: 1.75,
    textAlign: "left",
    margin: "0 0 8px 0",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "12px",
  },
  chip: {
    fontSize: "11px",
    color: "#999",
    border: "1px solid #2a2a2a",
    padding: "4px 10px",
    background: "#0f0f0f",
  },

  // ─── FILE ROWS ───────────────────────────────────────────────────────────────
  fileRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  fileNum: {
    fontSize: "11px",
    color: "#555",
    width: "16px",
    flexShrink: 0,
    paddingTop: "2px",
  },
  filePath: {
    fontSize: "12px",
    color: "#e8e8e8",
    fontFamily: "inherit",
    marginBottom: "4px",
    wordBreak: "break-all",
  },
  fileWhy: {
    fontSize: "12px",
    color: "#999",
    lineHeight: 1.6,
  },

  // ─── CORE FUNCTION ───────────────────────────────────────────────────────────
  coreBlock: {
    border: "1px solid #222",
    padding: "16px",
    background: "#0f0f0f",
  },
  coreName: {
    fontSize: "15px",
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: "4px",
    wordBreak: "break-all",
  },
  corePath: {
    fontSize: "11px",
    color: "#666",
    marginBottom: "12px",
    wordBreak: "break-all",
  },

  // ─── DANGER ──────────────────────────────────────────────────────────────────
  dangerRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "14px",
    alignItems: "flex-start",
  },
  dangerTag: {
    color: "#ff5555",
    fontSize: "13px",
    flexShrink: 0,
    marginTop: "1px",
  },

  // ─── FIRST TASK ──────────────────────────────────────────────────────────────
  firstTask: {
    border: "1px solid #2a2a2a",
    padding: "16px",
    fontSize: "14px",
    color: "#e8e8e8",
    lineHeight: 1.75,
    background: "#0f0f0f",
  },

  // ─── IMPROVE SPECIFIC ────────────────────────────────────────────────────────
  scoreRow: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  score: {
    fontSize: "52px",
    fontWeight: "bold",
    lineHeight: 1,
    flexShrink: 0,
  },
  bigProblem: {
    border: "1px solid #ff444433",
    padding: "16px",
    background: "#0d0000",
  },
  bigProblemTitle: {
    fontSize: "15px",
    color: "#ff5555",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  issueRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "18px",
    alignItems: "flex-start",
  },
  severityTag: {
    fontSize: "9px",
    border: "1px solid",
    padding: "3px 6px",
    letterSpacing: "1px",
    flexShrink: 0,
    marginTop: "2px",
    whiteSpace: "nowrap",
  },
  issueTitle: {
    fontSize: "13px",
    color: "#e8e8e8",
    marginBottom: "4px",
    fontWeight: "bold",
  },
  missingRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "10px",
    alignItems: "flex-start",
  },
  missingDash: {
    color: "#555",
    flexShrink: 0,
    marginTop: "2px",
  },
  roadmapRow: {
    display: "flex",
    gap: "14px",
    marginBottom: "14px",
    alignItems: "flex-start",
  },
  roadmapNum: {
    fontSize: "11px",
    color: "#555",
    width: "16px",
    flexShrink: 0,
    paddingTop: "2px",
  },
};

// ─── Responsive style overrides ───────────────────────────────────────────────
// Usage in components: style={{ ...s.heroTitle, ...r(mobile, { fontSize: "18px" }) }}

export function r(isMobile, mobileStyles) {
  return isMobile ? mobileStyles : {};
}