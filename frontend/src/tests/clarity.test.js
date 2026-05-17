import { describe, it, expect, beforeEach, vi } from "vitest";
import { getHistory, addToHistory, clearHistory } from "../utils/history.js";
import { BOB_SYSTEM_ONBOARD, BOB_SYSTEM_IMPROVE } from "../constants/prompts.js";

// ─── Mock localStorage ────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

// ─── History tests ────────────────────────────────────────────────────────────

describe("history utils", () => {
  beforeEach(() => {
    clearHistory();
  });

  it("starts empty", () => {
    expect(getHistory()).toEqual([]);
  });

  it("saves a repo", () => {
    const repo = { full_name: "facebook/react", language: "JavaScript", stargazers_count: 220000 };
    addToHistory(repo, "onboard");
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].repo.full_name).toBe("facebook/react");
    expect(history[0].mode).toBe("onboard");
  });

  it("saves up to 5 repos", () => {
    for (let i = 0; i < 7; i++) {
      addToHistory({ full_name: `owner/repo${i}` }, "improve");
    }
    expect(getHistory()).toHaveLength(5);
  });

  it("does not duplicate repos — moves to front instead", () => {
    const repo = { full_name: "facebook/react" };
    addToHistory(repo, "onboard");
    addToHistory(repo, "improve");
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].mode).toBe("improve");
  });

  it("most recent repo is first", () => {
    addToHistory({ full_name: "first/repo" }, "onboard");
    addToHistory({ full_name: "second/repo" }, "improve");
    expect(getHistory()[0].repo.full_name).toBe("second/repo");
  });

  it("clears history", () => {
    addToHistory({ full_name: "facebook/react" }, "onboard");
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});

// ─── Prompt tests ─────────────────────────────────────────────────────────────

describe("prompts", () => {
  it("BOB_SYSTEM_ONBOARD is a non-empty string", () => {
    expect(typeof BOB_SYSTEM_ONBOARD).toBe("string");
    expect(BOB_SYSTEM_ONBOARD.length).toBeGreaterThan(100);
  });

  it("BOB_SYSTEM_IMPROVE is a non-empty string", () => {
    expect(typeof BOB_SYSTEM_IMPROVE).toBe("string");
    expect(BOB_SYSTEM_IMPROVE.length).toBeGreaterThan(100);
  });

  it("onboard prompt contains required JSON fields", () => {
    expect(BOB_SYSTEM_ONBOARD).toContain("summary");
    expect(BOB_SYSTEM_ONBOARD).toContain("topFiles");
    expect(BOB_SYSTEM_ONBOARD).toContain("dangerZones");
    expect(BOB_SYSTEM_ONBOARD).toContain("firstTask");
    expect(BOB_SYSTEM_ONBOARD).toContain("mentalModel");
    expect(BOB_SYSTEM_ONBOARD).toContain("coreFunction");
  });

  it("improve prompt contains required JSON fields", () => {
    expect(BOB_SYSTEM_IMPROVE).toContain("healthScore");
    expect(BOB_SYSTEM_IMPROVE).toContain("biggestProblem");
    expect(BOB_SYSTEM_IMPROVE).toContain("issues");
    expect(BOB_SYSTEM_IMPROVE).toContain("missingThings");
    expect(BOB_SYSTEM_IMPROVE).toContain("firstFix");
    expect(BOB_SYSTEM_IMPROVE).toContain("roadmap");
  });

  it("improve prompt contains scoring guide", () => {
    expect(BOB_SYSTEM_IMPROVE).toContain("SCORING GUIDE");
  });

  it("both prompts contain hallucination prevention rules", () => {
    expect(BOB_SYSTEM_IMPROVE).toContain("NEVER flag a security issue");
    expect(BOB_SYSTEM_IMPROVE).toContain("NEVER invent issues");
    expect(BOB_SYSTEM_ONBOARD).toContain("NEVER flag something as a danger zone");
  });
});

// ─── JSON parsing tests ───────────────────────────────────────────────────────

describe("JSON parsing logic", () => {
  // This mirrors the exact parsing logic in App.jsx
  function parseBobbResponse(text) {
    let clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON object found in response");
    clean = clean.slice(start, end + 1);
    return JSON.parse(clean);
  }

  it("parses clean JSON", () => {
    const input = '{"healthScore": 72, "verdict": "good"}';
    expect(parseBobbResponse(input)).toEqual({ healthScore: 72, verdict: "good" });
  });

  it("strips markdown fences", () => {
    const input = "```json\n{\"healthScore\": 72}\n```";
    expect(parseBobbResponse(input)).toEqual({ healthScore: 72 });
  });

  it("handles preamble before JSON", () => {
    const input = 'Here is the analysis:\n\n{"healthScore": 72, "verdict": "good"}';
    expect(parseBobbResponse(input)).toEqual({ healthScore: 72, verdict: "good" });
  });

  it("handles trailing text after JSON", () => {
    const input = '{"healthScore": 72}\n\nLet me know if you need anything else!';
    expect(parseBobbResponse(input)).toEqual({ healthScore: 72 });
  });

  it("handles preamble AND trailing text", () => {
    const input = 'Sure! Here you go:\n{"healthScore": 72, "verdict": "solid"}\nHope that helps!';
    expect(parseBobbResponse(input)).toEqual({ healthScore: 72, verdict: "solid" });
  });

  it("throws on empty string", () => {
    expect(() => parseBobbResponse("")).toThrow("No JSON object found");
  });

  it("throws on no JSON object", () => {
    expect(() => parseBobbResponse("Here is some text with no JSON")).toThrow("No JSON object found");
  });

  it("throws on malformed JSON", () => {
    expect(() => parseBobbResponse('{"healthScore": 72, "verdict": ')).toThrow();
  });
});

// ─── File classification tests ────────────────────────────────────────────────

describe("file classification", () => {
  // Mirror of classifyFiles from FileTree.jsx
  function classifyFiles(allPaths, result) {
    const dangerPaths = new Set(result.dangerZones?.map((d) => d.path) || []);
    const topFilePaths = new Set(result.topFiles?.map((f) => f.path) || []);
    const corePath = result.coreFunction?.where || null;
    const biggestProblemPath = result.biggestProblem?.where || null;
    const issuePaths = new Set(result.issues?.map((i) => i.where) || []);

    return allPaths.map((path) => {
      if (dangerPaths.has(path)) return { path, status: "danger" };
      if (path === corePath) return { path, status: "core" };
      if (topFilePaths.has(path)) return { path, status: "read" };
      if (path === biggestProblemPath) return { path, status: "problem" };
      if (issuePaths.has(path)) return { path, status: "issue" };
      return { path, status: "normal" };
    });
  }

  const mockOnboardResult = {
    mode: "onboard",
    dangerZones: [{ path: "src/core/engine.js", reason: "complex" }],
    topFiles: [{ path: "src/index.js", why: "entry point" }],
    coreFunction: { where: "src/core/render.js", name: "render" },
  };

  const mockImproveResult = {
    mode: "improve",
    dangerZones: [{ path: "src/auth/middleware.js", reason: "security" }],
    issues: [{ where: "src/api/client.js", severity: "HIGH", title: "no error handling" }],
    biggestProblem: { where: "src/db/connection.js", title: "no connection pooling" },
    coreFunction: { where: "src/core/render.js", name: "render" },
  };

  it("classifies danger zones correctly", () => {
    const result = classifyFiles(["src/core/engine.js"], mockOnboardResult);
    expect(result[0].status).toBe("danger");
  });

  it("classifies core function correctly", () => {
    const result = classifyFiles(["src/core/render.js"], mockOnboardResult);
    expect(result[0].status).toBe("core");
  });

  it("classifies top files correctly", () => {
    const result = classifyFiles(["src/index.js"], mockOnboardResult);
    expect(result[0].status).toBe("read");
  });

  it("classifies normal files correctly", () => {
    const result = classifyFiles(["src/utils/helpers.js"], mockOnboardResult);
    expect(result[0].status).toBe("normal");
  });

  it("classifies issue files correctly", () => {
    const result = classifyFiles(["src/api/client.js"], mockImproveResult);
    expect(result[0].status).toBe("issue");
  });

  it("classifies biggest problem correctly", () => {
    const result = classifyFiles(["src/db/connection.js"], mockImproveResult);
    expect(result[0].status).toBe("problem");
  });

  it("danger takes priority over everything", () => {
    // A file that is both a danger zone and a top file
    const result = classifyFiles(["src/core/engine.js"], {
      ...mockOnboardResult,
      topFiles: [{ path: "src/core/engine.js", why: "important" }],
    });
    expect(result[0].status).toBe("danger");
  });

  it("handles empty result gracefully", () => {
    const result = classifyFiles(["src/index.js"], { mode: "onboard" });
    expect(result[0].status).toBe("normal");
  });

  it("handles empty file list", () => {
    const result = classifyFiles([], mockOnboardResult);
    expect(result).toEqual([]);
  });
});

// ─── GitHub URL parsing tests ─────────────────────────────────────────────────

describe("GitHub URL parsing", () => {
  // Mirror of the URL detection logic in App.jsx
  function parseGitHubUrl(val) {
    const match = val.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/);
    if (!match) return null;
    const [, owner, repo] = match;
    return `${owner}/${repo.replace(/\.git$/, "")}`;
  }

  it("parses standard GitHub URL", () => {
    expect(parseGitHubUrl("https://github.com/facebook/react")).toBe("facebook/react");
  });

  it("parses GitHub URL without https", () => {
    expect(parseGitHubUrl("github.com/facebook/react")).toBe("facebook/react");
  });

  it("parses GitHub URL with .git suffix", () => {
    expect(parseGitHubUrl("https://github.com/facebook/react.git")).toBe("facebook/react");
  });

  it("parses GitHub URL with trailing slash path", () => {
    expect(parseGitHubUrl("https://github.com/torvalds/linux")).toBe("torvalds/linux");
  });

  it("returns null for non-GitHub URL", () => {
    expect(parseGitHubUrl("https://gitlab.com/facebook/react")).toBeNull();
  });

  it("returns null for plain text", () => {
    expect(parseGitHubUrl("facebook/react")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseGitHubUrl("")).toBeNull();
  });

  it("handles repos with hyphens and dots", () => {
    expect(parseGitHubUrl("https://github.com/my-org/my.repo")).toBe("my-org/my.repo");
  });
});