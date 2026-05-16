import { s } from "../styles/index.js";
import { LoadingStep } from "./LoadingStep.jsx";

export function Home({
  query, onSearch, searching, searchResults, selectedRepo,
  onSelectRepo, mode, onMode, onAnalyze, loading, loadingMsg,
  error, searchRef,
}) {
  const canAnalyze = selectedRepo && mode && !loading;

  return (
    <div style={s.home}>
      <div style={s.topbar}>
        <span style={s.brand}>CLARITY</span>
        <span style={s.brandSub}>// repo intelligence · powered by IBM Bob</span>
      </div>

      <div style={s.homeContent}>
        <div style={s.titleBlock}>
          <div style={s.titlePre}>$ clarity --analyze</div>
          <h1 style={s.title}>
            Drop into any codebase.<br />
            <span style={s.titleAccent}>Know exactly where to start.</span>
          </h1>
          <p style={s.subtitle}>Bob reads the entire repository. You get clarity.</p>
        </div>

        {!query && (
          <div style={s.exampleBlock}>
            <div style={s.searchLabel}>// try these</div>
            <div style={s.exampleRow}>
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
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#333";
                    e.currentTarget.style.color = "#888";
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

          {searchResults.length > 0 && (
            <div style={s.dropdown}>
              {searchResults.map((repo) => (
                <div
                  key={repo.id}
                  style={s.dropdownItem}
                  onClick={() => onSelectRepo(repo)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={s.dropdownName}>{repo.full_name}</div>
                  <div style={s.dropdownMeta}>
                    ★ {repo.stargazers_count.toLocaleString()} · {repo.language || "unknown"} · {repo.description?.slice(0, 60) || "no description"}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedRepo && (
            <div style={s.selectedRepo}>
              <span style={s.selectedTag}>SELECTED</span>
              <span style={s.selectedName}>{selectedRepo.full_name}</span>
              <span style={s.selectedMeta}>
                {selectedRepo.language || ""}
                {selectedRepo.stargazers_count ? ` · ★ ${selectedRepo.stargazers_count.toLocaleString()}` : ""}
              </span>
            </div>
          )}
        </div>

        {selectedRepo && (
          <div style={s.modeBlock}>
            <div style={s.searchLabel}>// what do you need?</div>
            <div style={s.modeRow}>
              {[
                { id: "onboard", label: "[NEW HERE]", desc: "I just joined this repo and have no idea what's going on" },
                { id: "improve", label: "[IMPROVE IT]", desc: "I own this repo and want to know what to fix first" },
              ].map((m) => (
                <div
                  key={m.id}
                  style={{ ...s.modeCard, ...(mode === m.id ? s.modeCardActive : {}) }}
                  onClick={() => onMode(m.id)}
                >
                  <div style={s.modeLabel}>{m.label}</div>
                  <div style={s.modeDesc}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div style={s.error}>ERROR: {error}</div>}

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

        <button
          style={{ ...s.analyzeBtn, ...(loading ? { opacity: 0.4, cursor: "not-allowed" } : {}) }}
          onClick={onAnalyze}
          disabled={loading}
        >
          {loading ? "ANALYZING..." : "RUN CLARITY →"}
        </button>
      </div>
    </div>
  );
}