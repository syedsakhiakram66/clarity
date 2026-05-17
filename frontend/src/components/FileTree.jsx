import { useState, useEffect } from "react";

// ─── Classify files using Bob's report ───────────────────────────────────────

function classifyFiles(allPaths, result) {
  const isOnboard = result.mode === "onboard";

  const dangerPaths = new Set(
    result.dangerZones?.map((d) => d.path) || []
  );
  const topFilePaths = new Set(
    result.topFiles?.map((f) => f.path) || []
  );
  const corePath = result.coreFunction?.where || null;
  const biggestProblemPath = result.biggestProblem?.where || null;
  const issuePaths = new Set(
    result.issues?.map((i) => i.where) || []
  );

  return allPaths.map((path) => {
    if (dangerPaths.has(path)) {
      return { path, status: "danger", label: "DO NOT TOUCH", color: "#ff4444" };
    }
    if (path === corePath) {
      return { path, status: "core", label: "CORE", color: "#00ff88" };
    }
    if (topFilePaths.has(path)) {
      return { path, status: "read", label: "READ FIRST", color: "#ffaa00" };
    }
    if (!isOnboard && path === biggestProblemPath) {
      return { path, status: "problem", label: "BIGGEST PROBLEM", color: "#ff4444" };
    }
    if (!isOnboard && issuePaths.has(path)) {
      return { path, status: "issue", label: "HAS ISSUES", color: "#ffaa00" };
    }
    return { path, status: "normal", label: null, color: "#444" };
  });
}

// ─── Single File Row ──────────────────────────────────────────────────────────

function FileRow({ file, onClick, isSelected }) {
  const [hovered, setHovered] = useState(false);

  const isAnnotated = file.status !== "normal";

  return (
    <div
      onClick={() => onClick(file)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "7px 12px",
        cursor: "pointer",
        background: isSelected
          ? "#1a1a1a"
          : hovered
          ? "#111"
          : "transparent",
        borderLeft: isSelected
          ? `2px solid ${file.color}`
          : hovered && isAnnotated
          ? `2px solid ${file.color}55`
          : "2px solid transparent",
        transition: "all 0.15s",
      }}
    >
      {/* Left — path */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: "11px",
          color: isAnnotated ? file.color : hovered ? "#888" : "#555",
          flexShrink: 0,
          transition: "color 0.15s",
        }}>
          {file.status === "danger" ? "⚠" :
           file.status === "core" ? "★" :
           file.status === "read" ? "→" :
           file.status === "problem" ? "✕" :
           file.status === "issue" ? "!" :
           "·"}
        </span>
        <span style={{
          fontSize: "12px",
          color: isAnnotated ? file.color : hovered ? "#aaa" : "#555",
          fontFamily: "'Courier New', monospace",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.15s",
        }}>
          {file.path}
        </span>
      </div>

      {/* Right — label */}
      {isAnnotated && (
        <span style={{
          fontSize: "9px",
          color: file.color,
          border: `1px solid ${file.color}44`,
          padding: "2px 6px",
          letterSpacing: "1px",
          flexShrink: 0,
          marginLeft: "8px",
          opacity: hovered || isSelected ? 1 : 0.6,
          transition: "opacity 0.15s",
        }}>
          {file.label}
        </span>
      )}
    </div>
  );
}

// ─── File Content Viewer ──────────────────────────────────────────────────────

function FileViewer({ file, owner, repo }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load file content when file changes
  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      // Reset state for new file
      setContent(null);
      setLoading(true);
      setError(null);

      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (!token) {
          throw new Error("GitHub token not configured");
        }

        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!isMounted) return;

        if (data.content) {
          // Decode base64 content
          const decoded = atob(data.content.replace(/\n/g, ""));
          setContent(decoded);
        } else {
          setError("File content not available");
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to fetch file");
        console.error("Error loading file:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadContent();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [file.path, owner, repo]);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      borderLeft: "1px solid #1a1a1a",
      minWidth: 0,
    }}>
      {/* File header */}
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: "12px",
            color: file.color,
            fontFamily: "inherit",
          }}>
            {file.path}
          </div>
          {file.label && (
            <div style={{ fontSize: "10px", color: file.color + "99", marginTop: "2px", letterSpacing: "1px" }}>
              {file.label}
            </div>
          )}
        </div>
        {content && (
          <button
            onClick={handleCopy}
            style={{
              background: "transparent",
              border: "1px solid #333",
              color: copied ? "#00ff88" : "#444",
              fontSize: "10px",
              fontFamily: "inherit",
              padding: "4px 10px",
              cursor: "pointer",
              letterSpacing: "1px",
            }}
          >
            {copied ? "✓ copied" : "copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading && (
          <div style={{ padding: "24px 16px", fontSize: "12px", color: "#444" }}>
            loading...
          </div>
        )}
        {error && (
          <div style={{ padding: "24px 16px", fontSize: "12px", color: "#ff4444" }}>
            {error}
          </div>
        )}
        {content && (
          <pre style={{
            margin: 0,
            padding: "16px",
            fontSize: "11px",
            color: "#888",
            lineHeight: 1.7,
            fontFamily: "'Courier New', monospace",
            overflowX: "auto",
          }}>
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend({ isOnboard }) {
  const items = isOnboard
    ? [
        { color: "#00ff88", icon: "★", label: "Core function" },
        { color: "#ffaa00", icon: "→", label: "Read first" },
        { color: "#ff4444", icon: "⚠", label: "Danger zone" },
        { color: "#555",    icon: "·", label: "Other files" },
      ]
    : [
        { color: "#00ff88", icon: "★", label: "Core function" },
        { color: "#ffaa00", icon: "!", label: "Has issues" },
        { color: "#ff4444", icon: "⚠", label: "Danger / biggest problem" },
        { color: "#555",    icon: "·", label: "Other files" },
      ];

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      padding: "10px 12px",
      borderBottom: "1px solid #1a1a1a",
      flexShrink: 0,
    }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "11px", color: item.color }}>{item.icon}</span>
          <span style={{ fontSize: "10px", color: "#444", letterSpacing: "1px" }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main FileTree Component ──────────────────────────────────────────────────

export function FileTree({ result, repoContext }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filter, setFilter] = useState("");

  const isOnboard = result.mode === "onboard";
  const [owner, repo] = result.repo.full_name.split("/");

  // Extract file paths from repoContext
  const allPaths = repoContext
    .split("FILE STRUCTURE (up to 100 files):\n")[1]
    ?.split("\n\nREADME")[0]
    ?.split("\n")
    .filter(Boolean) || [];

  const classified = classifyFiles(allPaths, result);

  // Sort — annotated files first
  const sorted = [...classified].sort((a, b) => {
    const order = { danger: 0, problem: 0, core: 1, read: 2, issue: 3, normal: 4 };
    return order[a.status] - order[b.status];
  });

  const filtered = sorted.filter((f) =>
    f.path.toLowerCase().includes(filter.toLowerCase())
  );

  // Stats
  const dangerCount = classified.filter((f) => f.status === "danger" || f.status === "problem").length;
  const annotatedCount = classified.filter((f) => f.status !== "normal").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>

      {/* Stats bar */}
      <div style={{
        display: "flex",
        gap: "24px",
        padding: "10px 12px",
        borderBottom: "1px solid #1a1a1a",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "10px", color: "#444" }}>
          <span style={{ color: "#e0e0e0" }}>{allPaths.length}</span> files
        </span>
        <span style={{ fontSize: "10px", color: "#444" }}>
          <span style={{ color: "#ffaa00" }}>{annotatedCount}</span> annotated by Bob
        </span>
        <span style={{ fontSize: "10px", color: "#444" }}>
          <span style={{ color: "#ff4444" }}>{dangerCount}</span> flagged
        </span>
      </div>

      {/* Legend */}
      <Legend isOnboard={isOnboard} />

      {/* Search */}
      <div style={{
        padding: "8px 12px",
        borderBottom: "1px solid #1a1a1a",
        flexShrink: 0,
      }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="filter files..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e0e0e0",
            fontSize: "12px",
            fontFamily: "inherit",
            width: "100%",
          }}
        />
      </div>

      {/* Tree + Viewer */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* File list */}
        <div style={{
          width: selectedFile ? "40%" : "100%",
          overflowY: "auto",
          flexShrink: 0,
          transition: "width 0.2s ease",
        }}>
          {filtered.map((file) => (
            <FileRow
              key={file.path}
              file={file}
              isSelected={selectedFile?.path === file.path}
              onClick={(f) => setSelectedFile(
                selectedFile?.path === f.path ? null : f
              )}
            />
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: "24px 12px", fontSize: "12px", color: "#444" }}>
              no files match "{filter}"
            </div>
          )}
        </div>

        {/* File viewer */}
        {selectedFile && (
          <FileViewer
            file={selectedFile}
            owner={owner}
            repo={repo}
          />
        )}
      </div>
    </div>
  );
}

