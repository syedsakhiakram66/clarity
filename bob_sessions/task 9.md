**User:**

<task>
Improve the following code from file path clarity\frontend\src\App.jsx:64-72


```
setLoadingMsg("IBM Bob is analyzing the codebase...");
const response = await fetch(
  "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ZenApiKey ${import.meta.env.VITE_IBM_API_KEY}`,
    },
```

Please suggest improvements for:
1. Code readability and maintainability
2. Performance optimization
3. Best practices and patterns
4. Error handling and edge cases

Provide the improved code along with explanations for each enhancement.
</task>
<environment_details>
# VSCode Visible Files
clarity\frontend\src\App.jsx

# VSCode Open Tabs
clarity/frontend/.env,clarity/frontend/src/App.jsx

# Actively Running Terminals
## Terminal 1 (Active)
### Working Directory: `d:\Github\clarity`
### Original command: `cd clarity/frontend; npm run dev`
### New Output
[2m8:21:08 pm[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/src/App.jsx[22m
[2m8:21:20 pm[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/src/App.jsx[22m
[2m8:21:25 pm[22m [36m[1m[vite][22m[39m [90m[2m(client)[22m[39m [32mhmr update [39m[2m/src/App.jsx[22m
[2m8:21:32 pm[22m [31m[1m[vite][22m[39m [31mInternal server error: Transform failed with 2 errors:

[31m[PARSE_ERROR] [0m'async' modifier cannot be used here.
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/App.jsx:76:1 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m76 │[0m async[38;5;249m [0m[38;5;249mf[0m[38;5;249mu[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249mt[0m[38;5;249mi[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249m [0m[38;5;249ms[0m[38;5;249me[0m[38;5;249ma[0m[38;5;249mr[0m[38;5;249mc[0m[38;5;249mh[0m[38;5;249mG[0m[38;5;249mi[0m[38;5;249mt[0m[38;5;249mH[0m[38;5;249mu[0m[38;5;249mb[0m[38;5;249m([0m[38;5;249mq[0m[38;5;249mu[0m[38;5;249me[0m[38;5;249mr[0m[38;5;249my[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m{[0m
 [38;5;240m   │[0m ──┬──  
 [38;5;240m   │[0m   ╰──── 
 [38;5;240m   │[0m 
 [38;5;240m   │[0m [38;5;115mHelp[0m: No modifiers are allowed here.
[38;5;246m────╯[0m

[31m[PARSE_ERROR] [0mExpected `:` but found `Identifier`
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/App.jsx:76:16 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m76 │[0m [38;5;249ma[0m[38;5;249ms[0m[38;5;249my[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249m [0m[38;5;249mf[0m[38;5;249mu[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249mt[0m[38;5;249mi[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249m [0msearchGitHub[38;5;249m([0m[38;5;249mq[0m[38;5;249mu[0m[38;5;249me[0m[38;5;249mr[0m[38;5;249my[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m{[0m
 [38;5;240m   │[0m                ──────┬─────  
 [38;5;240m   │[0m                      ╰─────── `:` expected
[38;5;246m────╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36mD:/Github/clarity/clarity/frontend/src/App.jsx[39m
      at transformWithOxc (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:3339:19)
      at TransformPluginContext.transform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:3410:26)
      at EnvironmentPluginContainer.transform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:30271:51)
      at async loadAndTransform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:24532:26)
      at async viteTransformMiddleware (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:24326:20)
[2m8:21:34 pm[22m [31m[1m[vite][22m[39m [31mInternal server error: Transform failed with 2 errors:

[31m[PARSE_ERROR] [0m'async' modifier cannot be used here.
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/App.jsx:76:1 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m76 │[0m async[38;5;249m [0m[38;5;249mf[0m[38;5;249mu[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249mt[0m[38;5;249mi[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249m [0m[38;5;249ms[0m[38;5;249me[0m[38;5;249ma[0m[38;5;249mr[0m[38;5;249mc[0m[38;5;249mh[0m[38;5;249mG[0m[38;5;249mi[0m[38;5;249mt[0m[38;5;249mH[0m[38;5;249mu[0m[38;5;249mb[0m[38;5;249m([0m[38;5;249mq[0m[38;5;249mu[0m[38;5;249me[0m[38;5;249mr[0m[38;5;249my[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m{[0m
 [38;5;240m   │[0m ──┬──  
 [38;5;240m   │[0m   ╰──── 
 [38;5;240m   │[0m 
 [38;5;240m   │[0m [38;5;115mHelp[0m: No modifiers are allowed here.
[38;5;246m────╯[0m

[31m[PARSE_ERROR] [0mExpected `:` but found `Identifier`
    [38;5;246m╭[0m[38;5;246m─[0m[38;5;246m[[0m src/App.jsx:76:16 [38;5;246m][0m
    [38;5;246m│[0m
 [38;5;246m76 │[0m [38;5;249ma[0m[38;5;249ms[0m[38;5;249my[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249m [0m[38;5;249mf[0m[38;5;249mu[0m[38;5;249mn[0m[38;5;249mc[0m[38;5;249mt[0m[38;5;249mi[0m[38;5;249mo[0m[38;5;249mn[0m[38;5;249m [0msearchGitHub[38;5;249m([0m[38;5;249mq[0m[38;5;249mu[0m[38;5;249me[0m[38;5;249mr[0m[38;5;249my[0m[38;5;249m)[0m[38;5;249m [0m[38;5;249m{[0m
 [38;5;240m   │[0m                ──────┬─────  
 [38;5;240m   │[0m                      ╰─────── `:` expected
[38;5;246m────╯[0m
[39m
  Plugin: [35mvite:oxc[39m
  File: [36mD:/Github/clarity/clarity/frontend/src/App.jsx[39m
      at transformWithOxc (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:3339:19)
      at TransformPluginContext.transform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:3410:26)
      at EnvironmentPluginContainer.transform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:30271:51)
      at async loadAndTransform (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:24532:26)
      at async viteTransformMiddleware (file:///D:/Github/clarity/clarity/frontend/node_modules/vite/dist/node/chunks/node.js:24326:20)


# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T15:21:58.397Z
User time zone: Asia/Karachi, UTC+5:00

# Current Cost
$0.00

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>


# Current Workspace Directory (d:/Github/clarity) Files
clarity/
clarity/.gitattributes
clarity/backend/
clarity/frontend/
clarity/frontend/.env.example
clarity/frontend/.gitignore
clarity/frontend/eslint.config.js
clarity/frontend/IBM_WATSON_INTEGRATION.md
clarity/frontend/index.html
clarity/frontend/package-lock.json
clarity/frontend/package.json
clarity/frontend/README.md
clarity/frontend/vite.config.js
clarity/frontend/public/
clarity/frontend/public/favicon.svg
clarity/frontend/public/icons.svg
clarity/frontend/src/
clarity/frontend/src/App.jsx
clarity/frontend/src/index.css
clarity/frontend/src/main.jsx
clarity/frontend/src/assets/
clarity/frontend/src/assets/hero.png
clarity/frontend/src/assets/react.svg
clarity/frontend/src/assets/vite.svg
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I'll analyze the code and provide improvements. First, let me read the complete file to understand the context better.

<read_file>
<args>
<file>
<path>clarity/frontend/src/App.jsx</path>
</file>
</args>
</read_file>

---

**User:**

[read_file for 'clarity/frontend/src/App.jsx'. Reading multiple files at once is more efficient for the LLM. If other files are relevant to your current task, please read them simultaneously.] Result:
<files>
<file><path>clarity/frontend/src/App.jsx</path>
<content lines="1-811">
  1 | import { useState, useEffect, useRef } from "react";
  2 | 
  3 | // ─── Constants ────────────────────────────────────────────────────────────────
  4 | 
  5 | const MODES = [
  6 |   {
  7 |     id: "onboard",
  8 |     label: "[NEW HERE]",
  9 |     desc: "I just joined this repo and have no idea what's going on",
 10 |   },
 11 |   {
 12 |     id: "improve",
 13 |     label: "[IMPROVE IT]",
 14 |     desc: "I own this repo and want to know what to fix first",
 15 |   },
 16 | ];
 17 | 
 18 | const BOB_SYSTEM_ONBOARD = `You are IBM Bob, an expert software development partner with deep code understanding.
 19 | 
 20 | A developer just joined a new repository and needs onboarding. You have been given the full repository context.
 21 | 
 22 | Analyze it and return ONLY a valid JSON object in this exact format:
 23 | {
 24 |   "summary": "2-3 sentences. What does this project do? Who is it for? What problem does it solve?",
 25 |   "stack": ["tech1", "tech2", "tech3"],
 26 |   "topFiles": [
 27 |     { "path": "path/to/file", "why": "One sentence why this file matters most" },
 28 |     { "path": "path/to/file", "why": "One sentence why this file matters most" },
 29 |     { "path": "path/to/file", "why": "One sentence why this file matters most" }
 30 |   ],
 31 |   "coreFunction": { "name": "functionOrModuleName", "where": "file path", "why": "Why does everything depend on this?" },
 32 |   "dangerZones": [
 33 |     { "path": "path/to/file", "reason": "Why you should not touch this without deep understanding" }
 34 |   ],
 35 |   "firstTask": "A specific, concrete first contribution a new developer can make safely. Be specific about which file and what to do.",
 36 |   "mentalModel": "3-4 sentences. How should a new developer think about this codebase? What is the core mental model?"
 37 | }
 38 | 
 39 | Be specific. Use real file paths from the repo. Never be generic. Return ONLY valid JSON.`;
 40 | 
 41 | const BOB_SYSTEM_IMPROVE = `You are IBM Bob, an expert software development partner with deep code understanding.
 42 | 
 43 | A developer wants to improve their repository. You have been given the full repository context.
 44 | 
 45 | Analyze it and return ONLY a valid JSON object in this exact format:
 46 | {
 47 |   "healthScore": 72,
 48 |   "verdict": "2-3 sentences. Overall assessment of this codebase. Be honest and direct.",
 49 |   "biggestProblem": { "title": "Name of the biggest issue", "where": "file or area", "detail": "2-3 sentences explaining the problem and its impact" },
 50 |   "issues": [
 51 |     { "severity": "HIGH", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" },
 52 |     { "severity": "MEDIUM", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" },
 53 |     { "severity": "LOW", "title": "Issue title", "where": "file/area", "fix": "Specific fix recommendation" }
 54 |   ],
 55 |   "missingThings": ["Thing 1 that's missing", "Thing 2", "Thing 3"],
 56 |   "firstFix": "The single highest-impact thing to do first. Be specific about file and exactly what to change.",
 57 |   "roadmap": ["Week 1: ...", "Week 2: ...", "Week 3: ..."]
 58 | }
 59 | 
 60 | Be specific. Use real file paths. Be brutally honest. Return ONLY valid JSON.`;
 61 | 
 62 | // ─── IBM Watson API helpers ───────────────────────────────────────────────────
 63 | 
 64 | setLoadingMsg("IBM Bob is analyzing the codebase...");
 65 | const response = await fetch(
 66 |   "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
 67 |   {
 68 |     method: "POST",
 69 |     headers: {
 70 |       "Content-Type": "application/json",
 71 |       Authorization: `ZenApiKey ${import.meta.env.VITE_IBM_API_KEY}`,
 72 |     },
 73 | 
 74 | // ─── GitHub API helpers ───────────────────────────────────────────────────────
 75 | 
 76 | async function searchGitHub(query) {
 77 |   const res = await fetch(
 78 |     `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=6`
 79 |   );
 80 |   const data = await res.json();
 81 |   return data.items || [];
 82 | }
 83 | 
 84 | async function fetchRepoContext(owner, repo) {
 85 |   // Get repo info
 86 |   const infoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
 87 |   const info = await infoRes.json();
 88 | 
 89 |   // Get file tree
 90 |   const treeRes = await fetch(
 91 |     `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
 92 |   );
 93 |   const tree = await treeRes.json();
 94 | 
 95 |   // Get README
 96 |   let readme = "";
 97 |   try {
 98 |     const readmeRes = await fetch(
 99 |       `https://api.github.com/repos/${owner}/${repo}/readme`
100 |     );
101 |     const readmeData = await readmeRes.json();
102 |     readme = atob(readmeData.content.replace(/\n/g, ""));
103 |     readme = readme.slice(0, 3000);
104 |   } catch {}
105 | 
106 |   // Get top files content (limit to avoid token explosion)
107 |   const files = (tree.tree || [])
108 |     .filter(
109 |       (f) =>
110 |         f.type === "blob" &&
111 |         !f.path.includes("node_modules") &&
112 |         !f.path.includes(".git") &&
113 |         !f.path.includes("package-lock") &&
114 |         (f.path.endsWith(".js") ||
115 |           f.path.endsWith(".ts") ||
116 |           f.path.endsWith(".jsx") ||
117 |           f.path.endsWith(".tsx") ||
118 |           f.path.endsWith(".py") ||
119 |           f.path.endsWith(".go") ||
120 |           f.path.endsWith(".java") ||
121 |           f.path.endsWith(".rs") ||
122 |           f.path.endsWith(".cpp") ||
123 |           f.path.endsWith(".c"))
124 |     )
125 |     .slice(0, 8);
126 | 
127 |   let fileContents = "";
128 |   for (const file of files) {
129 |     try {
130 |       const res = await fetch(
131 |         `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`
132 |       );
133 |       const data = await res.json();
134 |       if (data.content) {
135 |         const content = atob(data.content.replace(/\n/g, "")).slice(0, 800);
136 |         fileContents += `\n\n=== ${file.path} ===\n${content}`;
137 |       }
138 |     } catch {}
139 |   }
140 | 
141 |   const allPaths = (tree.tree || [])
142 |     .filter((f) => f.type === "blob" && !f.path.includes("node_modules"))
143 |     .map((f) => f.path)
144 |     .slice(0, 60)
145 |     .join("\n");
146 | 
147 |   return `
148 | REPOSITORY: ${owner}/${repo}
149 | DESCRIPTION: ${info.description || "No description"}
150 | STARS: ${info.stargazers_count} | LANGUAGE: ${info.language} | FORKS: ${info.forks_count}
151 | TOPICS: ${(info.topics || []).join(", ")}
152 | 
153 | FILE STRUCTURE:
154 | ${allPaths}
155 | 
156 | README (truncated):
157 | ${readme}
158 | 
159 | KEY FILE CONTENTS:
160 | ${fileContents}
161 |   `.trim();
162 | }
163 | 
164 | // ─── Main Component ───────────────────────────────────────────────────────────
165 | 
166 | export default function Clarity() {
167 |   const [screen, setScreen] = useState("home"); // home | results
168 |   const [query, setQuery] = useState("");
169 |   const [searchResults, setSearchResults] = useState([]);
170 |   const [searching, setSearching] = useState(false);
171 |   const [selectedRepo, setSelectedRepo] = useState(null);
172 |   const [mode, setMode] = useState(null);
173 |   const [loading, setLoading] = useState(false);
174 |   const [loadingMsg, setLoadingMsg] = useState("");
175 |   const [result, setResult] = useState(null);
176 |   const [error, setError] = useState(null);
177 |   const searchRef = useRef(null);
178 |   const debounceRef = useRef(null);
179 | 
180 |   useEffect(() => {
181 |     if (screen === "home") searchRef.current?.focus();
182 |   }, [screen]);
183 | 
184 |   const handleSearch = (val) => {
185 |     setQuery(val);
186 |     setSelectedRepo(null);
187 |     setSearchResults([]);
188 |     if (debounceRef.current) clearTimeout(debounceRef.current);
189 |     if (!val.trim()) return;
190 |     debounceRef.current = setTimeout(async () => {
191 |       setSearching(true);
192 |       try {
193 |         const results = await searchGitHub(val);
194 |         setSearchResults(results);
195 |       } catch {
196 |         setError("GitHub search failed. Check your connection.");
197 |       }
198 |       setSearching(false);
199 |     }, 500);
200 |   };
201 | 
202 |   const handleSelectRepo = (repo) => {
203 |     setSelectedRepo(repo);
204 |     setQuery(repo.full_name);
205 |     setSearchResults([]);
206 |   };
207 | 
208 |   const handleAnalyze = async () => {
209 |     if (!selectedRepo || !mode) return;
210 |     setLoading(true);
211 |     setError(null);
212 |     setResult(null);
213 | 
214 |     const [owner, repo] = selectedRepo.full_name.split("/");
215 | 
216 |     try {
217 |       setLoadingMsg("Fetching repository...");
218 |       const context = await fetchRepoContext(owner, repo);
219 | 
220 |       setLoadingMsg("Bob is reading the codebase...");
221 |       await new Promise((r) => setTimeout(r, 800));
222 | 
223 |       setLoadingMsg("Generating Clarity Report...");
224 |       const systemPrompt =
225 |         mode === "onboard" ? BOB_SYSTEM_ONBOARD : BOB_SYSTEM_IMPROVE;
226 | 
227 |       // Get IBM Watson access token
228 |       setLoadingMsg("Authenticating with IBM Watson...");
229 |       const token = await getIBMAccessToken();
230 | 
231 |       setLoadingMsg("IBM Bob is analyzing the codebase...");
232 |       const response = await fetch(
233 |         "https://us-south.ml.cloud.ibm.com",
234 |         {
235 |           method: "POST",
236 |           headers: {
237 |             "Content-Type": "application/json",
238 |             Authorization: `Bearer ${token}`,
239 |           },
240 |           body: JSON.stringify({
241 |             model_id: "ibm/granite-3-8b-instruct",
242 |             project_id: import.meta.env.VITE_IBM_PROJECT_ID,
243 |             messages: [
244 |               {
245 |                 role: "system",
246 |                 content: systemPrompt,
247 |               },
248 |               {
249 |                 role: "user",
250 |                 content: `Analyze this repository and give me the ${mode === "onboard" ? "onboarding" : "improvement"} report:\n\n${context}`,
251 |               },
252 |             ],
253 |           }),
254 |         }
255 |       );
256 | 
257 |       const data = await response.json();
258 |       
259 |       // IBM Watson response format: data.choices[0].message.content
260 |       const text = data.choices?.[0]?.message?.content || "";
261 |       const clean = text.replace(/```json|```/g, "").trim();
262 |       const parsed = JSON.parse(clean);
263 |       setResult({ ...parsed, repo: selectedRepo, mode });
264 |       setScreen("results");
265 |     } catch (err) {
266 |       console.error("IBM Watson API Error:", err);
267 |       
268 |       // Provide more specific error messages
269 |       if (err.message?.includes("token") || err.message?.includes("auth")) {
270 |         setError("Authentication failed. Please check your IBM API key.");
271 |       } else if (err.message?.includes("project")) {
272 |         setError("Invalid project ID. Please check your IBM project configuration.");
273 |       } else if (err.message?.includes("JSON")) {
274 |         setError("Failed to parse AI response. The model may need adjustment.");
275 |       } else {
276 |         setError("Analysis failed. Please check your connection and try again.");
277 |       }
278 |     }
279 |     setLoading(false);
280 |     setLoadingMsg("");
281 |   };
282 | 
283 |   const reset = () => {
284 |     setScreen("home");
285 |     setQuery("");
286 |     setSearchResults([]);
287 |     setSelectedRepo(null);
288 |     setMode(null);
289 |     setResult(null);
290 |     setError(null);
291 |   };
292 | 
293 |   return (
294 |     <div style={s.root}>
295 |       {screen === "home" && (
296 |         <Home
297 |           query={query}
298 |           onSearch={handleSearch}
299 |           searching={searching}
300 |           searchResults={searchResults}
301 |           selectedRepo={selectedRepo}
302 |           onSelectRepo={handleSelectRepo}
303 |           mode={mode}
304 |           onMode={setMode}
305 |           onAnalyze={handleAnalyze}
306 |           loading={loading}
307 |           loadingMsg={loadingMsg}
308 |           error={error}
309 |           searchRef={searchRef}
310 |         />
311 |       )}
312 |       {screen === "results" && result && (
313 |         <Results result={result} onReset={reset} />
314 |       )}
315 |     </div>
316 |   );
317 | }
318 | 
319 | // ─── Home Screen ──────────────────────────────────────────────────────────────
320 | 
321 | function Home({ query, onSearch, searching, searchResults, selectedRepo, onSelectRepo, mode, onMode, onAnalyze, loading, loadingMsg, error, searchRef }) {
322 |   const canAnalyze = selectedRepo && mode && !loading;
323 | 
324 |   return (
325 |     <div style={s.home}>
326 |       {/* Header */}
327 |       <div style={s.topbar}>
328 |         <span style={s.brand}>CLARITY</span>
329 |         <span style={s.brandSub}>// repo intelligence · powered by IBM Bob</span>
330 |       </div>
331 | 
332 |       <div style={s.homeContent}>
333 |         {/* Title */}
334 |         <div style={s.titleBlock}>
335 |           <div style={s.titlePre}>$ clarity --analyze</div>
336 |           <h1 style={s.title}>
337 |             Drop into any codebase.<br />
338 |             <span style={s.titleAccent}>Know exactly where to start.</span>
339 |           </h1>
340 |           <p style={s.subtitle}>
341 |             Bob reads the entire repository. You get clarity.
342 |           </p>
343 |         </div>
344 | 
345 |         {/* Search */}
346 |         <div style={s.searchBlock}>
347 |           <div style={s.searchLabel}>// search github repos</div>
348 |           <div style={s.searchRow}>
349 |             <span style={s.searchIcon}>⌕</span>
350 |             <input
351 |               ref={searchRef}
352 |               style={s.searchInput}
353 |               value={query}
354 |               onChange={(e) => onSearch(e.target.value)}
355 |               placeholder="e.g. facebook/react, torvalds/linux, your-org/your-repo"
356 |               spellCheck={false}
357 |             />
358 |             {searching && <span style={s.searchSpinner}>...</span>}
359 |           </div>
360 | 
361 |           {/* Search results */}
362 |           {searchResults.length > 0 && (
363 |             <div style={s.dropdown}>
364 |               {searchResults.map((repo) => (
365 |                 <div
366 |                   key={repo.id}
367 |                   style={s.dropdownItem}
368 |                   onClick={() => onSelectRepo(repo)}
369 |                   onMouseEnter={(e) => e.currentTarget.style.background = "#1a1a1a"}
370 |                   onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
371 |                 >
372 |                   <div style={s.dropdownName}>{repo.full_name}</div>
373 |                   <div style={s.dropdownMeta}>
374 |                     ★ {repo.stargazers_count.toLocaleString()} · {repo.language || "unknown"} · {repo.description?.slice(0, 60) || "no description"}
375 |                   </div>
376 |                 </div>
377 |               ))}
378 |             </div>
379 |           )}
380 | 
381 |           {/* Selected repo */}
382 |           {selectedRepo && (
383 |             <div style={s.selectedRepo}>
384 |               <span style={s.selectedTag}>SELECTED</span>
385 |               <span style={s.selectedName}>{selectedRepo.full_name}</span>
386 |               <span style={s.selectedMeta}>★ {selectedRepo.stargazers_count?.toLocaleString()} · {selectedRepo.language}</span>
387 |             </div>
388 |           )}
389 |         </div>
390 | 
391 |         {/* Mode selection */}
392 |         {selectedRepo && (
393 |           <div style={s.modeBlock}>
394 |             <div style={s.searchLabel}>// what do you need?</div>
395 |             <div style={s.modeRow}>
396 |               {MODES.map((m) => (
397 |                 <div
398 |                   key={m.id}
399 |                   style={{
400 |                     ...s.modeCard,
401 |                     ...(mode === m.id ? s.modeCardActive : {}),
402 |                   }}
403 |                   onClick={() => onMode(m.id)}
404 |                 >
405 |                   <div style={s.modeLabel}>{m.label}</div>
406 |                   <div style={s.modeDesc}>{m.desc}</div>
407 |                 </div>
408 |               ))}
409 |             </div>
410 |           </div>
411 |         )}
412 | 
413 |         {/* Error */}
414 |         {error && <div style={s.error}>ERROR: {error}</div>}
415 | 
416 |         {/* Loading */}
417 |         {loading && (
418 |           <div style={s.loadingBlock}>
419 |             <div style={s.loadingBar}>
420 |               <div style={s.loadingFill} />
421 |             </div>
422 |             <div style={s.loadingMsg}>// {loadingMsg}</div>
423 |           </div>
424 |         )}
425 | 
426 |         {/* Analyze button */}
427 |         {canAnalyze && (
428 |           <button style={s.analyzeBtn} onClick={onAnalyze}>
429 |             RUN CLARITY →
430 |           </button>
431 |         )}
432 |       </div>
433 |     </div>
434 |   );
435 | }
436 | 
437 | // ─── Results Screen ───────────────────────────────────────────────────────────
438 | 
439 | function Results({ result, onReset }) {
440 |   const isOnboard = result.mode === "onboard";
441 | 
442 |   return (
443 |     <div style={s.results}>
444 |       {/* Header */}
445 |       <div style={s.resultsTopbar}>
446 |         <span style={s.brand}>CLARITY</span>
447 |         <span style={s.resultsRepo}>// {result.repo.full_name}</span>
448 |         <button style={s.backBtn} onClick={onReset}>← new repo</button>
449 |       </div>
450 | 
451 |       <div style={s.resultsContent}>
452 |         {/* Mode badge */}
453 |         <div style={s.modeBadge}>
454 |           {isOnboard ? "ONBOARDING REPORT" : "IMPROVEMENT REPORT"} · IBM Bob
455 |         </div>
456 | 
457 |         {isOnboard ? (
458 |           <OnboardReport result={result} />
459 |         ) : (
460 |           <ImproveReport result={result} />
461 |         )}
462 |       </div>
463 |     </div>
464 |   );
465 | }
466 | 
467 | function OnboardReport({ result: r }) {
468 |   return (
469 |     <div style={s.reportWrap}>
470 |       {/* Summary */}
471 |       <Section label="WHAT IS THIS">
472 |         <p style={s.bodyText}>{r.summary}</p>
473 |         <div style={s.chips}>
474 |           {r.stack?.map((t) => <span key={t} style={s.chip}>{t}</span>)}
475 |         </div>
476 |       </Section>
477 | 
478 |       {/* Mental model */}
479 |       <Section label="HOW TO THINK ABOUT THIS">
480 |         <p style={s.bodyText}>{r.mentalModel}</p>
481 |       </Section>
482 | 
483 |       {/* Top files */}
484 |       <Section label="READ THESE FIRST">
485 |         {r.topFiles?.map((f, i) => (
486 |           <div key={i} style={s.fileRow}>
487 |             <div style={s.fileNum}>{i + 1}</div>
488 |             <div>
489 |               <div style={s.filePath}>{f.path}</div>
490 |               <div style={s.fileWhy}>{f.why}</div>
491 |             </div>
492 |           </div>
493 |         ))}
494 |       </Section>
495 | 
496 |       {/* Core function */}
497 |       {r.coreFunction && (
498 |         <Section label="THE ONE FUNCTION EVERYTHING DEPENDS ON">
499 |           <div style={s.coreBlock}>
500 |             <div style={s.coreName}>{r.coreFunction.name}</div>
501 |             <div style={s.corePath}>in {r.coreFunction.where}</div>
502 |             <p style={s.bodyText}>{r.coreFunction.why}</p>
503 |           </div>
504 |         </Section>
505 |       )}
506 | 
507 |       {/* Danger zones */}
508 |       <Section label="DO NOT TOUCH">
509 |         {r.dangerZones?.map((d, i) => (
510 |           <div key={i} style={s.dangerRow}>
511 |             <span style={s.dangerTag}>⚠</span>
512 |             <div>
513 |               <div style={s.filePath}>{d.path}</div>
514 |               <div style={s.fileWhy}>{d.reason}</div>
515 |             </div>
516 |           </div>
517 |         ))}
518 |       </Section>
519 | 
520 |       {/* First task */}
521 |       <Section label="YOUR FIRST TASK">
522 |         <div style={s.firstTask}>{r.firstTask}</div>
523 |       </Section>
524 |     </div>
525 |   );
526 | }
527 | 
528 | function ImproveReport({ result: r }) {
529 |   const scoreColor = r.healthScore >= 70 ? "#00ff88" : r.healthScore >= 40 ? "#ffaa00" : "#ff4444";
530 | 
531 |   return (
532 |     <div style={s.reportWrap}>
533 |       {/* Health score */}
534 |       <Section label="CODEBASE HEALTH">
535 |         <div style={s.scoreRow}>
536 |           <div style={{ ...s.score, color: scoreColor }}>{r.healthScore}/100</div>
537 |           <p style={s.bodyText}>{r.verdict}</p>
538 |         </div>
539 |       </Section>
540 | 
541 |       {/* Biggest problem */}
542 |       {r.biggestProblem && (
543 |         <Section label="BIGGEST PROBLEM RIGHT NOW">
544 |           <div style={s.bigProblem}>
545 |             <div style={s.bigProblemTitle}>{r.biggestProblem.title}</div>
546 |             <div style={s.corePath}>in {r.biggestProblem.where}</div>
547 |             <p style={s.bodyText}>{r.biggestProblem.detail}</p>
548 |           </div>
549 |         </Section>
550 |       )}
551 | 
552 |       {/* Issues */}
553 |       <Section label="ALL ISSUES">
554 |         {r.issues?.map((issue, i) => (
555 |           <div key={i} style={s.issueRow}>
556 |             <span style={{
557 |               ...s.severityTag,
558 |               color: issue.severity === "HIGH" ? "#ff4444" : issue.severity === "MEDIUM" ? "#ffaa00" : "#888",
559 |               borderColor: issue.severity === "HIGH" ? "#ff4444" : issue.severity === "MEDIUM" ? "#ffaa00" : "#888",
560 |             }}>
561 |               {issue.severity}
562 |             </span>
563 |             <div>
564 |               <div style={s.issueTitle}>{issue.title}</div>
565 |               <div style={s.filePath}>{issue.where}</div>
566 |               <div style={s.fileWhy}>FIX: {issue.fix}</div>
567 |             </div>
568 |           </div>
569 |         ))}
570 |       </Section>
571 | 
572 |       {/* Missing things */}
573 |       <Section label="WHAT'S MISSING">
574 |         {r.missingThings?.map((m, i) => (
575 |           <div key={i} style={s.missingRow}>
576 |             <span style={s.missingDash}>—</span>
577 |             <span style={s.bodyText}>{m}</span>
578 |           </div>
579 |         ))}
580 |       </Section>
581 | 
582 |       {/* First fix */}
583 |       <Section label="DO THIS FIRST">
584 |         <div style={s.firstTask}>{r.firstFix}</div>
585 |       </Section>
586 | 
587 |       {/* Roadmap */}
588 |       <Section label="IMPROVEMENT ROADMAP">
589 |         {r.roadmap?.map((step, i) => (
590 |           <div key={i} style={s.roadmapRow}>
591 |             <div style={s.roadmapNum}>{i + 1}</div>
592 |             <div style={s.bodyText}>{step.replace(/^Week \d+: /, "")}</div>
593 |           </div>
594 |         ))}
595 |       </Section>
596 |     </div>
597 |   );
598 | }
599 | 
600 | function Section({ label, children }) {
601 |   return (
602 |     <div style={s.section}>
603 |       <div style={s.sectionLabel}>{label}</div>
604 |       <div style={s.sectionContent}>{children}</div>
605 |     </div>
606 |   );
607 | }
608 | 
609 | // ─── Styles ───────────────────────────────────────────────────────────────────
610 | 
611 | const s = {
612 |   root: {
613 |     minHeight: "100vh",
614 |     background: "#0d0d0d",
615 |     color: "#e0e0e0",
616 |     fontFamily: "'Courier New', 'Lucida Console', monospace",
617 |   },
618 | 
619 |   // HOME
620 |   home: { minHeight: "100vh", display: "flex", flexDirection: "column" },
621 |   topbar: {
622 |     padding: "12px 24px",
623 |     borderBottom: "1px solid #222",
624 |     display: "flex",
625 |     alignItems: "center",
626 |     gap: "12px",
627 |   },
628 |   brand: { fontSize: "14px", fontWeight: "bold", color: "#fff", letterSpacing: "4px" },
629 |   brandSub: { fontSize: "11px", color: "#444" },
630 |   homeContent: {
631 |     flex: 1,
632 |     maxWidth: "760px",
633 |     margin: "0 auto",
634 |     padding: "60px 24px",
635 |     width: "100%",
636 |   },
637 |   titleBlock: { marginBottom: "48px" },
638 |   titlePre: { fontSize: "11px", color: "#444", marginBottom: "16px" },
639 |   title: { fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "bold", color: "#fff", lineHeight: 1.2, marginBottom: "12px", fontFamily: "inherit" },
640 |   titleAccent: { color: "#fff", borderBottom: "2px solid #fff" },
641 |   subtitle: { fontSize: "14px", color: "#555" },
642 | 
643 |   // SEARCH
644 |   searchBlock: { marginBottom: "32px" },
645 |   searchLabel: { fontSize: "11px", color: "#444", marginBottom: "8px" },
646 |   searchRow: {
647 |     display: "flex",
648 |     alignItems: "center",
649 |     gap: "8px",
650 |     border: "1px solid #333",
651 |     padding: "10px 14px",
652 |     background: "#111",
653 |   },
654 |   searchIcon: { color: "#555", fontSize: "18px", flexShrink: 0 },
655 |   searchInput: {
656 |     flex: 1,
657 |     background: "transparent",
658 |     border: "none",
659 |     outline: "none",
660 |     color: "#e0e0e0",
661 |     fontSize: "14px",
662 |     fontFamily: "inherit",
663 |   },
664 |   searchSpinner: { color: "#444", fontSize: "12px" },
665 |   dropdown: {
666 |     border: "1px solid #333",
667 |     borderTop: "none",
668 |     background: "#111",
669 |   },
670 |   dropdownItem: {
671 |     padding: "10px 14px",
672 |     cursor: "pointer",
673 |     borderBottom: "1px solid #1a1a1a",
674 |     transition: "background 0.1s",
675 |   },
676 |   dropdownName: { fontSize: "13px", color: "#e0e0e0", marginBottom: "2px" },
677 |   dropdownMeta: { fontSize: "11px", color: "#555" },
678 |   selectedRepo: {
679 |     display: "flex",
680 |     alignItems: "center",
681 |     gap: "12px",
682 |     padding: "8px 14px",
683 |     background: "#111",
684 |     border: "1px solid #333",
685 |     borderTop: "none",
686 |   },
687 |   selectedTag: { fontSize: "10px", color: "#fff", background: "#333", padding: "2px 6px", letterSpacing: "1px" },
688 |   selectedName: { fontSize: "13px", color: "#fff", flex: 1 },
689 |   selectedMeta: { fontSize: "11px", color: "#555" },
690 | 
691 |   // MODE
692 |   modeBlock: { marginBottom: "32px" },
693 |   modeRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
694 |   modeCard: {
695 |     border: "1px solid #333",
696 |     padding: "16px",
697 |     cursor: "pointer",
698 |     background: "#111",
699 |     transition: "border-color 0.15s",
700 |   },
701 |   modeCardActive: { borderColor: "#fff", background: "#1a1a1a" },
702 |   modeLabel: { fontSize: "12px", color: "#fff", marginBottom: "6px", letterSpacing: "1px" },
703 |   modeDesc: { fontSize: "12px", color: "#555", lineHeight: 1.5 },
704 | 
705 |   // ANALYZE
706 |   analyzeBtn: {
707 |     background: "#fff",
708 |     color: "#000",
709 |     border: "none",
710 |     padding: "14px 32px",
711 |     fontSize: "13px",
712 |     fontFamily: "inherit",
713 |     fontWeight: "bold",
714 |     letterSpacing: "2px",
715 |     cursor: "pointer",
716 |   },
717 | 
718 |   // LOADING
719 |   loadingBlock: { marginBottom: "24px" },
720 |   loadingBar: { height: "2px", background: "#222", marginBottom: "8px", overflow: "hidden" },
721 |   loadingFill: {
722 |     height: "100%",
723 |     width: "40%",
724 |     background: "#fff",
725 |     animation: "slide 1.2s ease-in-out infinite",
726 |   },
727 |   loadingMsg: { fontSize: "11px", color: "#555" },
728 | 
729 |   error: { fontSize: "12px", color: "#ff4444", marginBottom: "16px", fontFamily: "inherit" },
730 | 
731 |   // RESULTS
732 |   results: { minHeight: "100vh", display: "flex", flexDirection: "column" },
733 |   resultsTopbar: {
734 |     padding: "12px 24px",
735 |     borderBottom: "1px solid #222",
736 |     display: "flex",
737 |     alignItems: "center",
738 |     gap: "12px",
739 |   },
740 |   resultsRepo: { fontSize: "11px", color: "#444", flex: 1 },
741 |   backBtn: {
742 |     background: "transparent",
743 |     border: "1px solid #333",
744 |     color: "#555",
745 |     padding: "4px 12px",
746 |     fontSize: "11px",
747 |     fontFamily: "inherit",
748 |     cursor: "pointer",
749 |   },
750 |   resultsContent: {
751 |     maxWidth: "760px",
752 |     margin: "0 auto",
753 |     padding: "40px 24px",
754 |     width: "100%",
755 |   },
756 |   modeBadge: {
757 |     fontSize: "11px",
758 |     color: "#555",
759 |     letterSpacing: "2px",
760 |     marginBottom: "32px",
761 |     borderBottom: "1px solid #1a1a1a",
762 |     paddingBottom: "16px",
763 |   },
764 |   reportWrap: { display: "flex", flexDirection: "column", gap: "0" },
765 | 
766 |   // SECTIONS
767 |   section: { borderBottom: "1px solid #1a1a1a", paddingBottom: "28px", marginBottom: "28px" },
768 |   sectionLabel: { fontSize: "10px", color: "#444", letterSpacing: "3px", marginBottom: "16px" },
769 |   sectionContent: {},
770 |   bodyText: { fontSize: "14px", color: "#aaa", lineHeight: 1.7 },
771 |   chips: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" },
772 |   chip: { fontSize: "11px", color: "#888", border: "1px solid #333", padding: "3px 10px" },
773 | 
774 |   // FILE ROWS
775 |   fileRow: { display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" },
776 |   fileNum: { fontSize: "11px", color: "#444", width: "16px", flexShrink: 0, paddingTop: "2px" },
777 |   filePath: { fontSize: "13px", color: "#e0e0e0", fontFamily: "inherit", marginBottom: "4px" },
778 |   fileWhy: { fontSize: "12px", color: "#666", lineHeight: 1.5 },
779 | 
780 |   // CORE FUNCTION
781 |   coreBlock: { border: "1px solid #222", padding: "16px" },
782 |   coreName: { fontSize: "16px", color: "#fff", fontWeight: "bold", marginBottom: "4px" },
783 |   corePath: { fontSize: "11px", color: "#444", marginBottom: "12px" },
784 | 
785 |   // DANGER
786 |   dangerRow: { display: "flex", gap: "12px", marginBottom: "12px", alignItems: "flex-start" },
787 |   dangerTag: { color: "#ff4444", fontSize: "14px", flexShrink: 0 },
788 | 
789 |   // FIRST TASK
790 |   firstTask: {
791 |     border: "1px solid #333",
792 |     padding: "16px",
793 |     fontSize: "14px",
794 |     color: "#fff",
795 |     lineHeight: 1.7,
796 |     background: "#111",
797 |   },
798 | 
799 |   // IMPROVE SPECIFIC
800 |   scoreRow: { display: "flex", gap: "24px", alignItems: "flex-start" },
801 |   score: { fontSize: "48px", fontWeight: "bold", lineHeight: 1, flexShrink: 0 },
802 |   bigProblem: { border: "1px solid #ff444433", padding: "16px", background: "#110000" },
803 |   bigProblemTitle: { fontSize: "16px", color: "#ff4444", fontWeight: "bold", marginBottom: "4px" },
804 |   issueRow: { display: "flex", gap: "16px", marginBottom: "16px", alignItems: "flex-start" },
805 |   severityTag: { fontSize: "10px", border: "1px solid", padding: "2px 6px", letterSpacing: "1px", flexShrink: 0, marginTop: "2px" },
806 |   issueTitle: { fontSize: "13px", color: "#e0e0e0", marginBottom: "4px" },
807 |   missingRow: { display: "flex", gap: "12px", marginBottom: "8px" },
808 |   missingDash: { color: "#444", flexShrink: 0 },
809 |   roadmapRow: { display: "flex", gap: "16px", marginBottom: "12px", alignItems: "flex-start" },
810 |   roadmapNum: { fontSize: "11px", color: "#444", width: "16px", flexShrink: 0, paddingTop: "2px" },
811 | };
</content>
</file>
</files>
<environment_details>
# VSCode Visible Files
clarity\frontend\src\App.jsx

# VSCode Open Tabs
clarity/frontend/.env,clarity/frontend/src/App.jsx

# Actively Running Terminals
## Terminal 1 (Active)
### Working Directory: `d:\Github\clarity`
### Original command: `cd clarity/frontend; npm run dev`

# Current Time
Current time in ISO 8601 UTC format: 2026-05-16T15:22:09.495Z
User time zone: Asia/Karachi, UTC+5:00

# Current Cost
$0.02

# Review Exclusions
The following file patterns are excluded from code reviews:
- .vscode/**

# Current Mode
<slug>code</slug>
<name>💻 Code</name>
You have not created a todo list yet. Create one with `update_todo_list` if your task is complicated or involves multiple steps.
</environment_details>

---

**Assistant:**

I can see the issue! Lines 64-72 are actually orphaned code that's not inside any function. This is causing the parse error. Let me analyze the full context and provide comprehensive improvements.

<attempt_completion>
<result>
## Code Analysis & Improvements

### **Critical Issue Found**
Lines 64-72 contain **orphaned code** outside any function scope, causing parse errors. This code appears to be a duplicate/leftover from the `handleAnalyze` function (lines 232-255).

### **Recommended Improvements**

#### 1. **Remove Orphaned Code (Lines 64-73)**
These lines should be deleted as they're duplicates and syntactically invalid:

```javascript
// DELETE THESE LINES (64-73):
setLoadingMsg("IBM Bob is analyzing the codebase...");
const response = await fetch(
  "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `ZenApiKey ${import.meta.env.VITE_IBM_API_KEY}`,
    },
```

#### 2. **Create Reusable API Service Module**
Extract API logic into a separate service for better maintainability:

```javascript
// Create: src/services/ibmWatsonService.js
const IBM_API_BASE = "https://us-south.ml.cloud.ibm.com/ml/v1";
const IBM_API_VERSION = "2023-05-29";

export async function getIBMAccessToken() {
  // Implementation for token retrieval
  const response = await fetch(`${IBM_API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apikey: import.meta.env.VITE_IBM_API_KEY,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

export async function analyzeCodebase(systemPrompt, context, token) {
  const response = await fetch(
    `${IBM_API_BASE}/text/chat?version=${IBM_API_VERSION}`,
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
          { role: "system", content: systemPrompt },
          { role: "user", content: context },
        ],
        parameters: {
          max_tokens: 2000,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed: ${response.statusText}`
    );
  }

  return response.json();
}
```

#### 3. **Improve Error Handling in handleAnalyze**
Add comprehensive error handling with specific error types:

```javascript
const handleAnalyze = async () => {
  if (!selectedRepo || !mode) return;
  
  setLoading(true);
  setError(null);
  setResult(null);

  const [owner, repo] = selectedRepo.full_name.split("/");

  try {
    // Fetch repository context
    setLoadingMsg("Fetching repository...");
    const context = await fetchRepoContext(owner, repo);

    setLoadingMsg("Bob is reading the codebase...");
    await new Promise((r) => setTimeout(r, 800));

    // Get system prompt
    const systemPrompt =
      mode === "onboard" ? BOB_SYSTEM_ONBOARD : BOB_SYSTEM_IMPROVE;

    // Authenticate with IBM Watson
    setLoadingMsg("Authenticating with IBM Watson...");
    const token = await getIBMAccessToken();

    // Analyze codebase
    setLoadingMsg("IBM Bob is analyzing the codebase...");
    const data = await analyzeCodebase(
      systemPrompt,
      `Analyze this repository and give me the ${
        mode === "onboard" ? "onboarding" : "improvement"
      } report:\n\n${context}`,
      token
    );

    // Parse response
    const text = data.choices?.[0]?.message?.content || "";
    if (!text) {
      throw new Error("Empty response from AI model");
    }

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    
    setResult({ ...parsed, repo: selectedRepo, mode });
    setScreen("results");
    
  } catch (err) {
    console.error("Analysis Error:", err);

    // Specific error messages
    let errorMessage = "Analysis failed. Please try again.";
    
    if (err.message?.includes("token") || err.message?.includes("Authentication")) {
      errorMessage = "Authentication failed. Check your IBM API key in .env file.";
    } else if (err.message?.includes("project")) {
      errorMessage = "Invalid project ID. Verify VITE_IBM_PROJECT_ID in .env.";
    } else if (err.message?.includes("JSON") || err.message?.includes("parse")) {
      errorMessage = "Failed to parse AI response. The model output may be malformed.";
    } else if (err.message?.includes("fetch") || err.message?.includes("network")) {
      errorMessage = "Network error. Check your internet connection.";
    } else if (err.message?.includes("rate limit")) {
      errorMessage = "API rate limit exceeded. Please wait and try again.";
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
    setLoadingMsg("");
  }
};
```

#### 4. **Add Request Timeout & Retry Logic**
```javascript
async function fetchWithTimeout(url, options, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
}
```

#### 5. **Add Environment Variable Validation**
```javascript
// Add at the top of App.jsx
function validateEnvVars() {
  const required = ['VITE_IBM_API_KEY', 'VITE_IBM_PROJECT_ID'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
}

// Use in component
useEffect(() => {
  if (!validateEnvVars()) {
    setError('Missing required environment variables. Check your .env file.');
  }
}, []);
```

### **Summary of Improvements**
1. ✅ **Remove orphaned code** (lines 64-73) - fixes parse error
2. ✅ **Extract API logic** into separate service module
3. ✅ **Add comprehensive error handling** with specific messages
4. ✅ **Implement request timeout** to prevent hanging
5. ✅ **Add environment validation** for better debugging
6. ✅ **Improve code organization** and maintainability
7. ✅ **Add proper TypeScript-ready structure** for future migration

### **Immediate Action Required**
Delete lines 64-73 to fix the current parse error, then implement the service module pattern for better code organization.
</result>
</attempt_completion>

