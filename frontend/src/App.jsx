import { useState, useRef } from "react";
import { Home } from "./components/Home.jsx";
import { Results } from "./components/Results.jsx";
import { BOB_SYSTEM_ONBOARD, BOB_SYSTEM_IMPROVE } from "./constants/prompts.js";
import { fetchRepoContext } from "./utils/github.js";
import { s } from "./styles/index.js";
import { getHistory, addToHistory } from "./utils/history.js";

export default function Clarity() {
  const [screen, setScreen] = useState("home");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoContext, setRepoContext] = useState(null);
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  

  const handleSearch = (val) => {
    setQuery(val);
    setSelectedRepo(null);
    setSearchResults([]);

    const githubUrl = val.match(
      /github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/,
    );
    if (githubUrl) {
      const [, owner, repo] = githubUrl;
      const repoName = `${owner}/${repo.replace(/\.git$/, "")}`;
      setQuery(repoName);
      setSelectedRepo({ full_name: repoName });
      setSearchResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) return;
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { searchGitHub } = await import("./utils/github.js");
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
      setRepoContext(context); // add this line

      setLoadingMsg("Bob is reading the codebase...");
      await new Promise((r) => setTimeout(r, 800));

      setLoadingMsg("IBM Bob is analyzing the codebase...");
      const systemPrompt =
        mode === "onboard" ? BOB_SYSTEM_ONBOARD : BOB_SYSTEM_IMPROVE;

      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          context: `Analyze this repository and give me the ${mode === "onboard" ? "onboarding" : "improvement"} report:\n\n${context}`,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");

      const text = data.text || "";
      let parsed;

      try {
        let clean = text.replace(/```json|```/g, "").trim();
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start === -1 || end === -1)
          throw new Error("No JSON object found in response");
        clean = clean.slice(start, end + 1);
        parsed = JSON.parse(clean);
      } catch (e) {
        console.log("RAW IBM OUTPUT:", text);
        throw new Error(`Failed to parse Bob's response: ${e.message}`);
      }

      setResult({ ...parsed, repo: selectedRepo, mode });
      setResult({ ...parsed, repo: selectedRepo, mode });
      addToHistory(selectedRepo, mode); // add this
      setScreen("results");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.message ||
          "Analysis failed. Please check your connection and try again.",
      );
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
        <Results result={result} repoContext={repoContext} onReset={reset} />
      )}
    </div>
  );
}
