import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES = [
  {
    id: "onboard",
    label: "[NEW HERE]",
    desc: "I just joined this repo and have no idea what's going on",
  },
  {
    id: "improve",
    label: "[IMPROVE IT]",
    desc: "I own this repo and want to know what to fix first",
  },
];

const BOB_SYSTEM_ONBOARD = `You are IBM Bob, an expert software development partner with deep code understanding.

A developer just joined a new repository and needs onboarding. You have been given the full repository context.

Analyze it and return ONLY a valid JSON object in this exact format:
{
  "summary": "2-3 sentences. What does this project do? Who is it for? What problem does it solve?",
  "stack": ["tech1", "tech2", "tech3"],
  "topFiles": [
    { "path": "path/to/file", "why": "One sentence why this file matters most" },
    { "path": "path/to/file", "why": "One sentence why this file matters most" },
    { "path": "path/to/file", "why": "One sentence why this file matters most" }
  ],
  "coreFunction": { "name": "functionOrModuleName", "where": "file path", "why": "Why does everything depend on this?" },
  "dangerZones": [
    { "path": "path/to/file", "reason": "Why you should not touch this without deep understanding" }
  ],
  "firstTask": "A specific, concrete first contribution a new developer can make safely. Be specific about which file and what to do.",
  "mentalModel": "3-4 sentences. How should a new developer think about this codebase? What is the core mental model?"
}

Be specific. Use real file paths from the repo. Never be generic. Return ONLY valid JSON.`;

const BOB_SYSTEM_IMPROVE = `You are IBM Bob, an expert software development partner with deep code understanding.

A developer wants to improve their repository. You have been given the full repository context.

Analyze it and return ONLY a valid JSON object in this exact format:
{
  "healthScore": 72,
  "verdict": "2-3 sentences. Overall assessment of this codebase. Be honest and direct.",
  "biggestProblem": { "title": "Name of the biggest issue", "where": "file or area", "detail": "2-3 sentences explaining the problem and its impact" },
  "issues": [
    { "severity": "HIGH", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" },
    { "severity": "MEDIUM", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" },
    { "severity": "LOW", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" }
  ],
  "missingThings": ["Thing 1 that's missing", "Thing 2", "Thing 3"],
  "firstFix": "The single highest-impact thing to do first. Be specific about file and exactly what to change.",
  "roadmap": ["Week 1: ...", "Week 2: ...", "Week 3: ..."]
}

Be specific. Use real file paths. Be brutally honest. Return ONLY valid JSON.`;

// ─── IBM Watson API helpers ───────────────────────────────────────────────────

async function getIBMAccessToken() {
  const response = await fetch(
    "https://iam.cloud.ibm.com/identity/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: import.meta.env.VITE_IBM_API_KEY,
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
}

// ─── GitHub API helpers ───────────────────────────────────────────────────────

async function searchGitHub(query) {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=6`
  );
  const data = await res.json();
  return data.items || [];
}

async function fetchRepoContext(owner, repo) {
  // Get repo info
  const infoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  const info = await infoRes.json();

  // Get file tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
  );
  const tree = await treeRes.json();

  // Get README
  let readme = "";
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`
    );
    const readmeData = await readmeRes.json();
    readme = atob(readmeData.content.replace(/\n/g, ""));
    readme = readme.slice(0, 3000);
  } catch {}

  // Get top files content (limit to avoid token explosion)
  const files = (tree.tree || [])
    .filter(
      (f) =>
        f.type === "blob" &&
        !f.path.includes("node_modules") &&
        !f.path.includes(".git") &&
        !f.path.includes("package-lock") &&
        (f.path.endsWith(".js") ||
          f.path.endsWith(".ts") ||
          f.path.endsWith(".jsx") ||
          f.path.endsWith(".tsx") ||
          f.path.endsWith(".py") ||
          f.path.endsWith(".go") ||
          f.path.endsWith(".java") ||
          f.path.endsWith(".rs") ||
          f.path.endsWith(".cpp") ||
          f.path.endsWith(".c"))
    )
    .slice(0, 8);

  let fileContents = "";
  for (const file of files) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`
      );
      const data = await res.json();
      if (data.content) {
        const content = atob(data.content.replace(/\n/g, "")).slice(0, 800);
        fileContents += `\n\n=== ${file.path} ===\n${content}`;
      }
    } catch {}
  }

  const allPaths = (tree.tree || [])
    .filter((f) => f.type === "blob" && !f.path.includes("node_modules"))
    .map((f) => f.path)
    .slice(0, 60)
    .join("\n");

  return `
REPOSITORY: ${owner}/${repo}
DESCRIPTION: ${info.description || "No description"}
STARS: ${info.stargazers_count} | LANGUAGE: ${info.language} | FORKS: ${info.forks_count}
TOPICS: ${(info.topics || []).join(", ")}

FILE STRUCTURE:
${allPaths}

README (truncated):
${readme}

KEY FILE CONTENTS:
${fileContents}
  `.trim();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Clarity() {
  const [screen, setScreen] = useState("home"); // home | results
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (screen === "home") searchRef.current?.focus();
  }, [screen]);

  const handleSearch = (val) => {
    setQuery(val);
    setSelectedRepo(null);
    setSearchResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) return;
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchGitHub(val);
        setSearchResults(results);
      } catch {
        setError("GitHub search failed. Check your connection.");
      }
      setSearching(false);
    }, 500);
  };

  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setQuery(repo.full_name);
    setSearchResults([]);
  };

  const handleAnalyze = async () => {
    if (!selectedRepo || !mode) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const [owner, repo] = selectedRepo.full_name.split("/");

    try {
      setLoadingMsg("Fetching repository...");
      const context = await fetchRepoContext(owner, repo);

      setLoadingMsg("Bob is reading the codebase...");
      await new Promise((r) => setTimeout(r, 800));

      setLoadingMsg("Generating Clarity Report...");
      const systemPrompt =
        mode === "onboard" ? BOB_SYSTEM_ONBOARD : BOB_SYSTEM_IMPROVE;

      // Get IBM Watson access token
      setLoadingMsg("Authenticating with IBM Watson...");
      const token = await getIBMAccessToken();

      setLoadingMsg("IBM Bob is analyzing the codebase...");
      const response = await fetch(
        "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            model_id: "ibm/granite-3-8b-instruct",
            project_id: import.meta.env.VITE_IBM_PROJECT_ID,
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: `Analyze this repository and give me the ${mode === "onboard" ? "onboarding" : "improvement"} report:\n\n${context}`,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      
      // IBM Watson response format: data.choices[0].message.content
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult({ ...parsed, repo: selectedRepo, mode });
      setScreen("results");
    } catch (err) {
      console.error("IBM Watson API Error:", err);
      
      // Provide more specific error messages
      if (err.message?.includes("token") || err.message?.includes("auth")) {
        setError("Authentication failed. Please check your IBM API key.");
      } else if (err.message?.includes("project")) {
        setError("Invalid project ID. Please check your IBM project configuration.");
      } else if (err.message?.includes("JSON")) {
        setError("Failed to parse AI response. The model may need adjustment.");
      } else {
        setError("Analysis failed. Please check your connection and try again.");
      }
    }
    setLoading(false);
    setLoadingMsg("");
  };

  const reset = () => {
    setScreen("home");
    setQuery("");
    setSearchResults([]);
    setSelectedRepo(null);
    setMode(null);
    setResult(null);
    setError(null);
  };

  return (
    <div style={s.root}>
      {screen === "home" && (
        <Home
          query={query}
          onSearch={handleSearch}
          searching={searching}
          searchResults={searchResults}
          selectedRepo={selectedRepo}
          onSelectRepo={handleSelectRepo}
          mode={mode}
          onMode={setMode}
          onAnalyze={handleAnalyze}
          loading={loading}
          loadingMsg={loadingMsg}
          error={error}
          searchRef={searchRef}
        />
      )}
      {screen === "results" && result && (
        <Results result={result} onReset={reset} />
      )}
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────

function Home({ query, onSearch, searching, searchResults, selectedRepo, onSelectRepo, mode, onMode, onAnalyze, loading, loadingMsg, error, searchRef }) {
  const canAnalyze = selectedRepo && mode && !loading;

  return (
    <div style={s.home}>
      {/* Header */}
      <div style={s.topbar}>
        <span style={s.brand}>CLARITY</span>
        <span style={s.brandSub}>// repo intelligence · powered by IBM Bob</span>
      </div>

      <div style={s.homeContent}>
        {/* Title */}
        <div style={s.titleBlock}>
          <div style={s.titlePre}>$ clarity --analyze</div>
          <h1 style={s.title}>
            Drop into any codebase.<br />
            <span style={s.titleAccent}>Know exactly where to start.</span>
          </h1>
          <p style={s.subtitle}>
            Bob reads the entire repository. You get clarity.
          </p>
        </div>

        {/* Search */}
        <div style={s.searchBlock}>
          <div style={s.searchLabel}>// search github repos</div>
          <div style={s.searchRow}>
            <span style={s.searchIcon}>⌕</span>
            <input
              ref={searchRef}
              style={s.searchInput}
              value={query}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="e.g. facebook/react, torvalds/linux, your-org/your-repo"
              spellCheck={false}
            />
            {searching && <span style={s.searchSpinner}>...</span>}
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div style={s.dropdown}>
              {searchResults.map((repo) => (
                <div
                  key={repo.id}
                  style={s.dropdownItem}
                  onClick={() => onSelectRepo(repo)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <div style={s.dropdownName}>{repo.full_name}</div>
                  <div style={s.dropdownMeta}>
                    ★ {repo.stargazers_count.toLocaleString()} · {repo.language || "unknown"} · {repo.description?.slice(0, 60) || "no description"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected repo */}
          {selectedRepo && (
            <div style={s.selectedRepo}>
              <span style={s.selectedTag}>SELECTED</span>
              <span style={s.selectedName}>{selectedRepo.full_name}</span>
              <span style={s.selectedMeta}>★ {selectedRepo.stargazers_count?.toLocaleString()} · {selectedRepo.language}</span>
            </div>
          )}
        </div>

        {/* Mode selection */}
        {selectedRepo && (
          <div style={s.modeBlock}>
            <div style={s.searchLabel}>// what do you need?</div>
            <div style={s.modeRow}>
              {MODES.map((m) => (
                <div
                  key={m.id}
                  style={{
                    ...s.modeCard,
                    ...(mode === m.id ? s.modeCardActive : {}),
                  }}
                  onClick={() => onMode(m.id)}
                >
                  <div style={s.modeLabel}>{m.label}</div>
                  <div style={s.modeDesc}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div style={s.error}>ERROR: {error}</div>}

        {/* Loading */}
        {loading && (
          <div style={s.loadingBlock}>
            <div style={s.loadingBar}>
              <div style={s.loadingFill} />
            </div>
            <div style={s.loadingMsg}>// {loadingMsg}</div>
          </div>
        )}

        {/* Analyze button */}
        {canAnalyze && (
          <button style={s.analyzeBtn} onClick={onAnalyze}>
            RUN CLARITY →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────

function Results({ result, onReset }) {
  const isOnboard = result.mode === "onboard";

  return (
    <div style={s.results}>
      {/* Header */}
      <div style={s.resultsTopbar}>
        <span style={s.brand}>CLARITY</span>
        <span style={s.resultsRepo}>// {result.repo.full_name}</span>
        <button style={s.backBtn} onClick={onReset}>← new repo</button>
      </div>

      <div style={s.resultsContent}>
        {/* Mode badge */}
        <div style={s.modeBadge}>
          {isOnboard ? "ONBOARDING REPORT" : "IMPROVEMENT REPORT"} · IBM Bob
        </div>

        {isOnboard ? (
          <OnboardReport result={result} />
        ) : (
          <ImproveReport result={result} />
        )}
      </div>
    </div>
  );
}

function OnboardReport({ result: r }) {
  return (
    <div style={s.reportWrap}>
      {/* Summary */}
      <Section label="WHAT IS THIS">
        <p style={s.bodyText}>{r.summary}</p>
        <div style={s.chips}>
          {r.stack?.map((t) => <span key={t} style={s.chip}>{t}</span>)}
        </div>
      </Section>

      {/* Mental model */}
      <Section label="HOW TO THINK ABOUT THIS">
        <p style={s.bodyText}>{r.mentalModel}</p>
      </Section>

      {/* Top files */}
      <Section label="READ THESE FIRST">
        {r.topFiles?.map((f, i) => (
          <div key={i} style={s.fileRow}>
            <div style={s.fileNum}>{i + 1}</div>
            <div>
              <div style={s.filePath}>{f.path}</div>
              <div style={s.fileWhy}>{f.why}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Core function */}
      {r.coreFunction && (
        <Section label="THE ONE FUNCTION EVERYTHING DEPENDS ON">
          <div style={s.coreBlock}>
            <div style={s.coreName}>{r.coreFunction.name}</div>
            <div style={s.corePath}>in {r.coreFunction.where}</div>
            <p style={s.bodyText}>{r.coreFunction.why}</p>
          </div>
        </Section>
      )}

      {/* Danger zones */}
      <Section label="DO NOT TOUCH">
        {r.dangerZones?.map((d, i) => (
          <div key={i} style={s.dangerRow}>
            <span style={s.dangerTag}>⚠</span>
            <div>
              <div style={s.filePath}>{d.path}</div>
              <div style={s.fileWhy}>{d.reason}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* First task */}
      <Section label="YOUR FIRST TASK">
        <div style={s.firstTask}>{r.firstTask}</div>
      </Section>
    </div>
  );
}

function ImproveReport({ result: r }) {
  const scoreColor = r.healthScore >= 70 ? "#00ff88" : r.healthScore >= 40 ? "#ffaa00" : "#ff4444";

  return (
    <div style={s.reportWrap}>
      {/* Health score */}
      <Section label="CODEBASE HEALTH">
        <div style={s.scoreRow}>
          <div style={{ ...s.score, color: scoreColor }}>{r.healthScore}/100</div>
          <p style={s.bodyText}>{r.verdict}</p>
        </div>
      </Section>

      {/* Biggest problem */}
      {r.biggestProblem && (
        <Section label="BIGGEST PROBLEM RIGHT NOW">
          <div style={s.bigProblem}>
            <div style={s.bigProblemTitle}>{r.biggestProblem.title}</div>
            <div style={s.corePath}>in {r.biggestProblem.where}</div>
            <p style={s.bodyText}>{r.biggestProblem.detail}</p>
          </div>
        </Section>
      )}

      {/* Issues */}
      <Section label="ALL ISSUES">
        {r.issues?.map((issue, i) => (
          <div key={i} style={s.issueRow}>
            <span style={{
              ...s.severityTag,
              color: issue.severity === "HIGH" ? "#ff4444" : issue.severity === "MEDIUM" ? "#ffaa00" : "#888",
              borderColor: issue.severity === "HIGH" ? "#ff4444" : issue.severity === "MEDIUM" ? "#ffaa00" : "#888",
            }}>
              {issue.severity}
            </span>
            <div>
              <div style={s.issueTitle}>{issue.title}</div>
              <div style={s.filePath}>{issue.where}</div>
              <div style={s.fileWhy}>FIX: {issue.fix}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Missing things */}
      <Section label="WHAT'S MISSING">
        {r.missingThings?.map((m, i) => (
          <div key={i} style={s.missingRow}>
            <span style={s.missingDash}>—</span>
            <span style={s.bodyText}>{m}</span>
          </div>
        ))}
      </Section>

      {/* First fix */}
      <Section label="DO THIS FIRST">
        <div style={s.firstTask}>{r.firstFix}</div>
      </Section>

      {/* Roadmap */}
      <Section label="IMPROVEMENT ROADMAP">
        {r.roadmap?.map((step, i) => (
          <div key={i} style={s.roadmapRow}>
            <div style={s.roadmapNum}>{i + 1}</div>
            <div style={s.bodyText}>{step.replace(/^Week \d+: /, "")}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={s.section}>
      <div style={s.sectionLabel}>{label}</div>
      <div style={s.sectionContent}>{children}</div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
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
  brand: { fontSize: "14px", fontWeight: "bold", color: "#fff", letterSpacing: "4px" },
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
  title: { fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "bold", color: "#fff", lineHeight: 1.2, marginBottom: "12px", fontFamily: "inherit" },
  titleAccent: { color: "#fff", borderBottom: "2px solid #fff" },
  subtitle: { fontSize: "14px", color: "#555" },

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
  selectedTag: { fontSize: "10px", color: "#fff", background: "#333", padding: "2px 6px", letterSpacing: "1px" },
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
  modeLabel: { fontSize: "12px", color: "#fff", marginBottom: "6px", letterSpacing: "1px" },
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
  loadingBar: { height: "2px", background: "#222", marginBottom: "8px", overflow: "hidden" },
  loadingFill: {
    height: "100%",
    width: "40%",
    background: "#fff",
    animation: "slide 1.2s ease-in-out infinite",
  },
  loadingMsg: { fontSize: "11px", color: "#555" },

  error: { fontSize: "12px", color: "#ff4444", marginBottom: "16px", fontFamily: "inherit" },

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
  section: { borderBottom: "1px solid #1a1a1a", paddingBottom: "28px", marginBottom: "28px" },
  sectionLabel: { fontSize: "10px", color: "#444", letterSpacing: "3px", marginBottom: "16px" },
  sectionContent: {},
  bodyText: { fontSize: "14px", color: "#aaa", lineHeight: 1.7 },
  chips: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" },
  chip: { fontSize: "11px", color: "#888", border: "1px solid #333", padding: "3px 10px" },

  // FILE ROWS
  fileRow: { display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" },
  fileNum: { fontSize: "11px", color: "#444", width: "16px", flexShrink: 0, paddingTop: "2px" },
  filePath: { fontSize: "13px", color: "#e0e0e0", fontFamily: "inherit", marginBottom: "4px" },
  fileWhy: { fontSize: "12px", color: "#666", lineHeight: 1.5 },

  // CORE FUNCTION
  coreBlock: { border: "1px solid #222", padding: "16px" },
  coreName: { fontSize: "16px", color: "#fff", fontWeight: "bold", marginBottom: "4px" },
  corePath: { fontSize: "11px", color: "#444", marginBottom: "12px" },

  // DANGER
  dangerRow: { display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" },
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
  bigProblem: { border: "1px solid #ff444433", padding: "16px", background: "#110000" },
  bigProblemTitle: { fontSize: "16px", color: "#ff4444", fontWeight: "bold", marginBottom: "4px" },
  issueRow: { display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" },
  severityTag: { fontSize: "10px", border: "1px solid", padding: "2px 6px", letterSpacing: "1px", flexShrink: 0, marginTop: "2px" },
  issueTitle: { fontSize: "13px", color: "#e0e0e0", marginBottom: "4px" },
  missingRow: { display: "flex", gap: "12px", marginBottom: "8px" },
  missingDash: { color: "#444", flexShrink: 0 },
  roadmapRow: { display: "flex", gap: "16px", marginBottom: "12px", alignItems: "flex-start" },
  roadmapNum: { fontSize: "11px", color: "#444", width: "16px", flexShrink: 0, paddingTop: "2px" },
};