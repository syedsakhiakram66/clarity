export const s = {
  root: {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#e0e0e0",
    fontFamily: "'Courier New', 'Lucida Console', monospace",
  },

  // HOME
  home: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  topbar: {
    padding: "12px 24px",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  brand: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: "4px",
  },
  brandSub: { fontSize: "11px", color: "#444" },
  homeContent: {
    flex: 1,
    maxWidth: "760px",
    margin: "0 auto",
    padding: "60px 24px",
    width: "100%",
  },
  titleBlock: { marginBottom: "48px" },
  titlePre: { fontSize: "11px", color: "#444", marginBottom: "16px" },
  title: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 1.2,
    marginBottom: "12px",
    fontFamily: "inherit",
  },
  titleAccent: { color: "#fff", borderBottom: "2px solid #fff" },
  subtitle: { fontSize: "14px", color: "#555" },

  // EXAMPLE REPOS
  exampleBlock: {
    marginBottom: "32px",
  },
  exampleRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  exampleChip: {
    border: "1px solid #333",
    padding: "10px 14px",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },
  exampleName: {
    fontSize: "12px",
    color: "inherit",
    marginBottom: "2px",
    fontFamily: "inherit",
  },
  exampleMeta: {
    fontSize: "11px",
    color: "#444",
  },

  // SEARCH
  searchBlock: { marginBottom: "32px" },
  searchLabel: { fontSize: "11px", color: "#444", marginBottom: "8px" },
  searchRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #333",
    padding: "10px 14px",
    background: "#111",
  },
  searchIcon: { color: "#555", fontSize: "18px", flexShrink: 0 },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e0e0e0",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  searchSpinner: { color: "#444", fontSize: "12px" },
  dropdown: {
    border: "1px solid #333",
    borderTop: "none",
    background: "#111",
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #1a1a1a",
    transition: "background 0.1s",
  },
  dropdownName: { fontSize: "13px", color: "#e0e0e0", marginBottom: "2px" },
  dropdownMeta: { fontSize: "11px", color: "#555" },
  selectedRepo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 14px",
    background: "#111",
    border: "1px solid #333",
    borderTop: "none",
  },
  selectedTag: {
    fontSize: "10px",
    color: "#fff",
    background: "#333",
    padding: "2px 6px",
    letterSpacing: "1px",
  },
  selectedName: { fontSize: "13px", color: "#fff", flex: 1 },
  selectedMeta: { fontSize: "11px", color: "#555" },

  // MODE
  modeBlock: { marginBottom: "32px" },
  modeRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  modeCard: {
    border: "1px solid #333",
    padding: "16px",
    cursor: "pointer",
    background: "#111",
    transition: "border-color 0.15s",
  },
  modeCardActive: { borderColor: "#fff", background: "#1a1a1a" },
  modeLabel: {
    fontSize: "12px",
    color: "#fff",
    marginBottom: "6px",
    letterSpacing: "1px",
  },
  modeDesc: { fontSize: "12px", color: "#555", lineHeight: 1.5 },

  // ANALYZE
  analyzeBtn: {
    background: "#fff",
    color: "#000",
    border: "none",
    padding: "14px 32px",
    fontSize: "13px",
    fontFamily: "inherit",
    fontWeight: "bold",
    letterSpacing: "2px",
    cursor: "pointer",
  },

  // LOADING
  loadingBlock: { marginBottom: "24px" },
  loadingBar: {
    height: "2px",
    background: "#222",
    marginBottom: "8px",
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    width: "40%",
    background: "#fff",
    animation: "slide 1.2s ease-in-out infinite",
  },
  loadingMsg: { fontSize: "11px", color: "#555" },

  error: {
    fontSize: "12px",
    color: "#ff4444",
    marginBottom: "16px",
    fontFamily: "inherit",
  },

  // RESULTS
  results: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  resultsTopbar: {
    padding: "12px 24px",
    borderBottom: "1px solid #222",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  resultsRepo: { fontSize: "11px", color: "#444", flex: 1 },
  backBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#555",
    padding: "4px 12px",
    fontSize: "11px",
    fontFamily: "inherit",
    cursor: "pointer",
  },
  resultsContent: {
    maxWidth: "760px",
    margin: "0 auto",
    padding: "40px 24px",
    width: "100%",
  },
  modeBadge: {
    fontSize: "11px",
    color: "#555",
    letterSpacing: "2px",
    marginBottom: "32px",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "16px",
  },
  reportWrap: { display: "flex", flexDirection: "column", gap: "0" },

  // SECTIONS
  section: {
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "28px",
    marginBottom: "28px",
  },
  sectionLabel: {
    fontSize: "10px",
    color: "#444",
    letterSpacing: "3px",
    marginBottom: "16px",
  },
  sectionContent: {},
  bodyText: { fontSize: "14px", color: "#aaa", lineHeight: 1.7 },
  chips: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" },
  chip: {
    fontSize: "11px",
    color: "#888",
    border: "1px solid #333",
    padding: "3px 10px",
  },

  // FILE ROWS
  fileRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  fileNum: {
    fontSize: "11px",
    color: "#444",
    width: "16px",
    flexShrink: 0,
    paddingTop: "2px",
  },
  filePath: {
    fontSize: "13px",
    color: "#e0e0e0",
    fontFamily: "inherit",
    marginBottom: "4px",
  },
  fileWhy: { fontSize: "12px", color: "#666", lineHeight: 1.5 },

  // CORE FUNCTION
  coreBlock: { border: "1px solid #222", padding: "16px" },
  coreName: {
    fontSize: "16px",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  corePath: { fontSize: "11px", color: "#444", marginBottom: "12px" },

  // DANGER
  dangerRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    alignItems: "flex-start",
  },
  dangerTag: { color: "#ff4444", fontSize: "14px", flexShrink: 0 },

  // FIRST TASK
  firstTask: {
    border: "1px solid #333",
    padding: "16px",
    fontSize: "14px",
    color: "#fff",
    lineHeight: 1.7,
    background: "#111",
  },

  // IMPROVE SPECIFIC
  scoreRow: { display: "flex", gap: "24px", alignItems: "flex-start" },
  score: { fontSize: "48px", fontWeight: "bold", lineHeight: 1, flexShrink: 0 },
  bigProblem: {
    border: "1px solid #ff444433",
    padding: "16px",
    background: "#110000",
  },
  bigProblemTitle: {
    fontSize: "16px",
    color: "#ff4444",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  issueRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    alignItems: "flex-start",
  },
  severityTag: {
    fontSize: "10px",
    border: "1px solid",
    padding: "2px 6px",
    letterSpacing: "1px",
    flexShrink: 0,
    marginTop: "2px",
  },
  issueTitle: { fontSize: "13px", color: "#e0e0e0", marginBottom: "4px" },
  missingRow: { display: "flex", gap: "12px", marginBottom: "8px" },
  missingDash: { color: "#444", flexShrink: 0 },
  roadmapRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
    alignItems: "flex-start",
  },
  roadmapNum: {
    fontSize: "11px",
    color: "#444",
    width: "16px",
    flexShrink: 0,
    paddingTop: "2px",
  },
  //loading
  loadingSteps: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
  },
  // hero
  heroBlock: {
    marginBottom: "48px",
    paddingBottom: "32px",
    borderBottom: "1px solid #1a1a1a",
  },
  heroTitle: {
    fontSize: "clamp(20px, 3vw, 32px)",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: "20px",
    marginTop: "8px",
  },
  heroStats: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
};