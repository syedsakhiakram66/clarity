import { useState, useEffect } from 'react';
import { s } from "../styles/index.js";
import { LoadingStep } from "./LoadingStep.jsx";
import { getHistory, clearHistory } from "../utils/history.js";

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function Home({
  query,
  onSearch,
  searching,
  searchResults,
  selectedRepo,
  onSelectRepo,
  mode,
  onMode,
  onAnalyze,
  loading,
  loadingMsg,
  error,
  searchRef,
  privateToken,
  onPrivateToken,
}) {
  const mobile = useIsMobile();
  const canAnalyze = selectedRepo && mode && !loading;
  const [history, setHistory] = useState(() => getHistory());

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div style={s.home}>
      {/* Topbar */}
      <div style={s.topbar}>
        <span style={s.brand}>CLARITY</span>
        {!mobile && (
          <span style={s.brandSub}>
            // repo intelligence · powered by IBM Bob
          </span>
        )}
      </div>

      <div style={{
        ...s.homeContent,
        padding: mobile ? "32px 16px 80px" : "48px 20px 80px",
      }}>

        {/* History */}
        {history.length > 0 && !query && (
          <div style={s.historyBlock}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}>
              <div style={s.searchLabel}>// recent repos</div>
              <button
                onClick={handleClearHistory}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#555",
                  fontSize: "10px",
                  fontFamily: "inherit",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                clear
              </button>
            </div>
            {history.map((item, i) => (
              <div
                key={i}
                style={s.historyItem}
                onClick={() => onSelectRepo(item.repo)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#fff";
                  e.currentTarget.style.background = "#111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#222";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: "12px",
                    color: "#e0e0e0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>
                    {item.repo.full_name}
                  </div>
                  <div style={{ fontSize: "10px", color: "#555", marginTop: "2px" }}>
                    {item.mode === "onboard" ? "[NEW HERE]" : "[IMPROVE IT]"} · {timeAgo(item.analyzedAt)}
                  </div>
                </div>
                <div style={{ fontSize: "10px", color: "#444", letterSpacing: "1px", flexShrink: 0 }}>
                  re-run →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div style={s.titleBlock}>
          <div style={s.titlePre}>$ clarity --analyze</div>
          <h1 style={{
            ...s.title,
            fontSize: mobile ? "28px" : "clamp(26px, 5vw, 44px)",
          }}>
            Drop into any codebase.<br />
            <span style={s.titleAccent}>Know exactly where to start.</span>
          </h1>
          <p style={s.subtitle}>
            Bob reads the entire repository. You get clarity.
          </p>
        </div>

        {/* Example repos */}
        {!query && (
          <div style={s.exampleBlock}>
            <div style={s.searchLabel}>// try these</div>
            <div style={{
              ...s.exampleRow,
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            }}>
              {[
                { full_name: "facebook/react", language: "JavaScript", stargazers_count: 220000 },
                { full_name: "torvalds/linux", language: "C", stargazers_count: 170000 },
                { full_name: "antirez/redis", language: "C", stargazers_count: 66000 },
                { full_name: "django/django", language: "Python", stargazers_count: 80000 },
              ].map((repo) => (
                <div
                  key={repo.full_name}
                  style={s.exampleChip}
                  onClick={() => onSelectRepo(repo)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#fff";
                    e.currentTarget.style.background = "#161616";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.background = "#0f0f0f";
                  }}
                >
                  <div style={s.exampleName}>{repo.full_name}</div>
                  <div style={s.exampleMeta}>
                    {repo.language} · ★ {(repo.stargazers_count / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Private repo toggle */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              padding: "6px 0",
            }}
            onClick={() => {
              if (privateToken !== null) {
                onPrivateToken(null);
              } else {
                onPrivateToken("");
              }
            }}
          >
            <div style={{
              width: "28px",
              height: "14px",
              background: privateToken !== null ? "#fff" : "#222",
              border: "1px solid #333",
              position: "relative",
              transition: "background 0.2s",
              flexShrink: 0,
            }}>
              <div style={{
                position: "absolute",
                top: "2px",
                left: privateToken !== null ? "14px" : "2px",
                width: "8px",
                height: "8px",
                background: privateToken !== null ? "#000" : "#555",
                transition: "left 0.2s",
              }} />
            </div>
            <span style={{ fontSize: "11px", color: "#666", letterSpacing: "1px" }}>
              🔒 private repo
            </span>
          </div>

          {privateToken !== null && (
            <div style={{ marginTop: "8px" }}>
              <input
                value={privateToken}
                onChange={(e) => onPrivateToken(e.target.value)}
                placeholder="paste your github personal access token..."
                type="password"
                style={{
                  width: "100%",
                  background: "#0f0f0f",
                  border: "1px solid #2a2a2a",
                  color: "#e0e0e0",
                  padding: "10px 14px",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: "10px", color: "#444", marginTop: "6px", letterSpacing: "1px" }}>
                token stays in your browser only. never sent to our servers.
              </div>
            </div>
          )}
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
              placeholder={mobile ? "owner/repo or paste URL" : "e.g. facebook/react, torvalds/linux, your-org/your-repo"}
              spellCheck={false}
            />
            {searching && <span style={s.searchSpinner}>...</span>}
          </div>

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
                    ★ {repo.stargazers_count.toLocaleString()} · {repo.language || "unknown"}
                    {!mobile && ` · ${repo.description?.slice(0, 60) || "no description"}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedRepo && (
            <div style={s.selectedRepo}>
              <span style={s.selectedTag}>SELECTED</span>
              <span style={s.selectedName}>{selectedRepo.full_name}</span>
              {!mobile && (
                <span style={s.selectedMeta}>
                  {selectedRepo.language || ""}
                  {selectedRepo.stargazers_count
                    ? ` · ★ ${selectedRepo.stargazers_count.toLocaleString()}`
                    : ""}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mode selection */}
        {selectedRepo && (
          <div style={s.modeBlock}>
            <div style={s.searchLabel}>// what do you need?</div>
            <div style={{
              ...s.modeRow,
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            }}>
              {[
                { id: "onboard", label: "[NEW HERE]", desc: "I just joined this repo and have no idea what's going on" },
                { id: "improve", label: "[IMPROVE IT]", desc: "I own this repo and want to know what to fix first" },
              ].map((m) => (
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
            <div style={s.loadingSteps}>
              {[
                "fetching repository structure...",
                "reading key files...",
                "building context for Bob...",
                "IBM Bob is analyzing...",
                "generating your report...",
              ].map((step, i) => (
                <LoadingStep key={i} text={step} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Analyze button */}
        <button
          style={{
            ...s.analyzeBtn,
            ...(loading ? { opacity: 0.4, cursor: "not-allowed" } : {}),
          }}
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? "ANALYZING..." : "RUN CLARITY →"}
        </button>
      </div>
    </div>
  );
}