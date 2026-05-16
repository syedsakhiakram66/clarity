import { useState } from "react";
import { s } from "../styles/index.js";
import { Section } from "./Section.jsx";
import { StatPill } from "./StatPill.jsx";

export function Results({ result, onReset }) {
  const isOnboard = result.mode === "onboard";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={s.results}>
      <div style={s.resultsTopbar}>
        <span style={s.brand}>CLARITY</span>
        <span style={s.resultsRepo}>// {result.repo.full_name}</span>
        <button style={s.backBtn} onClick={onReset}>← new repo</button>
      </div>

      <div style={s.resultsContent}>
        <div style={s.heroBlock}>
          <div style={s.modeBadge}>
            {isOnboard ? "ONBOARDING REPORT" : "IMPROVEMENT REPORT"} · IBM Bob
          </div>
          <div style={s.heroTitle}>{result.repo.full_name}</div>
          <div style={s.heroStats}>
            <StatPill label="STARS" value={`★ ${(result.repo.stargazers_count / 1000).toFixed(1)}k`} />
            <StatPill label="LANGUAGE" value={result.repo.language || "?"} />
            <StatPill label="FORKS" value={result.repo.forks_count?.toLocaleString() || "?"} />
            {!isOnboard && <StatPill label="HEALTH" value={`${result.healthScore}/100`} />}
          </div>
          <button
            style={{
              ...s.backBtn,
              marginTop: "20px",
              color: copied ? "#00ff88" : "#555",
              borderColor: copied ? "#00ff88" : "#333",
            }}
            onClick={handleCopy}
          >
            {copied ? "✓ copied to clipboard" : "⎘ export report"}
          </button>
        </div>

        {isOnboard ? <OnboardReport result={result} /> : <ImproveReport result={result} />}
      </div>
    </div>
  );
}

function OnboardReport({ result: r }) {
  return (
    <div style={s.reportWrap}>
      <Section label="WHAT IS THIS">
        <p style={s.bodyText}>{r.summary}</p>
        <div style={s.chips}>
          {r.stack?.map((t) => <span key={t} style={s.chip}>{t}</span>)}
        </div>
      </Section>

      <Section label="HOW TO THINK ABOUT THIS">
        <p style={s.bodyText}>{r.mentalModel}</p>
      </Section>

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
            <div>
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

function ImproveReport({ result: r }) {
  const scoreColor = r.healthScore >= 70 ? "#00ff88" : r.healthScore >= 40 ? "#ffaa00" : "#ff4444";

  return (
    <div style={s.reportWrap}>
      <Section label="CODEBASE HEALTH">
        <div style={s.scoreRow}>
          <div style={{ ...s.score, color: scoreColor }}>{r.healthScore}/100</div>
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