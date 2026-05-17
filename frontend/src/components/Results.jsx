import { useState, useEffect } from "react";
import { s } from "../styles/index.js";
import { Section } from "./Section.jsx";
import { StatPill } from "./StatPill.jsx";
import { BobChat } from "./BobChat.jsx";
import { FileTree } from "./FileTree.jsx";

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handler = () => setMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return mobile;
}

export function Results({ result, onReset, repoContext }) {
  const mobile = useIsMobile();
  const isOnboard = result.mode === "onboard";
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("report");

  const handleCopy = () => {
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "report", label: "REPORT" },
    { id: "bob", label: mobile ? "⚡ BOB" : "⚡ FIX WITH BOB" },
    { id: "tree", label: mobile ? "🗂 TREE" : "🗂 FILE TREE" },
  ];

  return (
    <div style={s.results}>
      {/* Topbar */}
      <div style={s.resultsTopbar}>
        <span style={s.brand}>CLARITY</span>
        {!mobile && (
          <span style={s.resultsRepo}>// {result.repo.full_name}</span>
        )}
        <div style={{ flex: 1 }} />
        <button style={s.backBtn} onClick={onReset}>
          ← {mobile ? "back" : "new repo"}
        </button>
      </div>

      <div style={{
        ...s.resultsContent,
        padding: mobile ? "24px 16px 80px" : "32px 20px 80px",
      }}>

        {/* Hero */}
        <div style={s.heroBlock}>
          <div style={s.modeBadge}>
            {isOnboard ? "ONBOARDING REPORT" : "IMPROVEMENT REPORT"} · IBM Bob
          </div>
          <div style={{
            ...s.heroTitle,
            fontSize: mobile ? "20px" : "clamp(18px, 3vw, 28px)",
          }}>
            {result.repo.full_name}
          </div>
          <div style={{
            ...s.heroStats,
            gap: mobile ? "6px" : "8px",
          }}>
            {result.repo.stargazers_count > 0 && (
              <StatPill
                label="STARS"
                value={`★ ${(result.repo.stargazers_count / 1000).toFixed(1)}k`}
              />
            )}
            <StatPill label="LANGUAGE" value={result.repo.language || "?"} />
            {!mobile && result.repo.forks_count > 0 && (
              <StatPill
                label="FORKS"
                value={result.repo.forks_count?.toLocaleString() || "?"}
              />
            )}
            {!isOnboard && (
              <StatPill label="HEALTH" value={`${result.healthScore}/100`} />
            )}
          </div>
          <button
            style={{
              ...s.backBtn,
              marginTop: "16px",
              color: copied ? "#00ff88" : "#666",
              borderColor: copied ? "#00ff88" : "#2a2a2a",
            }}
            onClick={handleCopy}
          >
            {copied ? "✓ copied" : "⎘ export report"}
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          marginBottom: "28px",
          borderBottom: "1px solid #1a1a1a",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab.id
                  ? "2px solid #fff"
                  : "2px solid transparent",
                color: activeTab === tab.id ? "#fff" : "#555",
                padding: mobile ? "10px 14px" : "10px 20px",
                fontSize: mobile ? "10px" : "11px",
                fontFamily: "inherit",
                letterSpacing: mobile ? "1px" : "2px",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "report" ? (
          isOnboard
            ? <OnboardReport result={result} mobile={mobile} />
            : <ImproveReport result={result} mobile={mobile} />
        ) : activeTab === "bob" ? (
          <BobChat result={result} repoContext={repoContext} />
        ) : (
          <FileTree result={result} repoContext={repoContext} privateToken={result.privateToken} />
        )}
      </div>
    </div>
  );
}

function OnboardReport({ result: r, mobile }) {
  return (
    <div style={s.reportWrap}>
      <Section label="WHAT IS THIS">
        <p style={s.bodyText}>{r.summary}</p>
        <div style={s.chips}>
          {r.stack?.map((t) => (
            <span key={t} style={s.chip}>{t}</span>
          ))}
        </div>
      </Section>

      <Section label="HOW TO THINK ABOUT THIS">
        <p style={s.bodyText}>{r.mentalModel}</p>
      </Section>

      <Section label="READ THESE FIRST">
        {r.topFiles?.map((f, i) => (
          <div key={i} style={s.fileRow}>
            <div style={s.fileNum}>{i + 1}</div>
            <div style={{ minWidth: 0 }}>
              <div style={s.filePath}>{f.path}</div>
              <div style={s.fileWhy}>{f.why}</div>
            </div>
          </div>
        ))}
      </Section>

      {r.coreFunction && (
        <Section label="THE ONE FUNCTION EVERYTHING DEPENDS ON">
          <div style={s.coreBlock}>
            <div style={s.coreName}>{r.coreFunction.name}</div>
            <div style={s.corePath}>in {r.coreFunction.where}</div>
            <p style={s.bodyText}>{r.coreFunction.why}</p>
          </div>
        </Section>
      )}

      <Section label="DO NOT TOUCH">
        {r.dangerZones?.map((d, i) => (
          <div key={i} style={s.dangerRow}>
            <span style={s.dangerTag}>⚠</span>
            <div style={{ minWidth: 0 }}>
              <div style={s.filePath}>{d.path}</div>
              <div style={s.fileWhy}>{d.reason}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section label="YOUR FIRST TASK">
        <div style={s.firstTask}>{r.firstTask}</div>
      </Section>
    </div>
  );
}

function ImproveReport({ result: r, mobile }) {
  const scoreColor =
    r.healthScore >= 70 ? "#00ff88"
    : r.healthScore >= 40 ? "#ffaa00"
    : "#ff5555";

  return (
    <div style={s.reportWrap}>
      <Section label="CODEBASE HEALTH">
        <div style={{
          ...s.scoreRow,
          flexDirection: mobile ? "column" : "row",
          gap: mobile ? "12px" : "20px",
        }}>
          <div style={{ ...s.score, color: scoreColor, fontSize: mobile ? "40px" : "52px" }}>
            {r.healthScore}/100
          </div>
          <p style={s.bodyText}>{r.verdict}</p>
        </div>
      </Section>

      {r.biggestProblem && (
        <Section label="BIGGEST PROBLEM RIGHT NOW">
          <div style={s.bigProblem}>
            <div style={s.bigProblemTitle}>{r.biggestProblem.title}</div>
            <div style={s.corePath}>in {r.biggestProblem.where}</div>
            <p style={s.bodyText}>{r.biggestProblem.detail}</p>
          </div>
        </Section>
      )}

      <Section label="ALL ISSUES">
        {r.issues?.map((issue, i) => (
          <div key={i} style={s.issueRow}>
            <span style={{
              ...s.severityTag,
              color: issue.severity === "HIGH" ? "#ff5555"
                : issue.severity === "MEDIUM" ? "#ffaa00"
                : "#666",
              borderColor: issue.severity === "HIGH" ? "#ff5555"
                : issue.severity === "MEDIUM" ? "#ffaa00"
                : "#666",
            }}>
              {mobile ? issue.severity[0] : issue.severity}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={s.issueTitle}>{issue.title}</div>
              <div style={s.filePath}>{issue.where}</div>
              <div style={s.fileWhy}>FIX: {issue.fix}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section label="WHAT'S MISSING">
        {r.missingThings?.map((m, i) => (
          <div key={i} style={s.missingRow}>
            <span style={s.missingDash}>—</span>
            <span style={s.bodyText}>{m}</span>
          </div>
        ))}
      </Section>

      <Section label="DO THIS FIRST">
        <div style={s.firstTask}>{r.firstFix}</div>
      </Section>

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