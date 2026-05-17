const DEFAULT_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
};

export function getHeaders(privateToken = null) {
  if (privateToken) {
    return { Authorization: `Bearer ${privateToken}` };
  }
  return DEFAULT_HEADERS;
}

export async function searchGitHub(query, privateToken = null) {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&per_page=6`,
    { headers: getHeaders(privateToken) }
  );

  if (res.status === 403 || res.status === 429) {
    throw new Error("GitHub rate limit hit. Wait a minute and try again.");
  }

  if (!res.ok) {
    throw new Error(`GitHub search failed (${res.status})`);
  }

  const data = await res.json();
  return data.items || [];
}

export async function fetchRepoContext(owner, repo, privateToken = null) {
  const headers = getHeaders(privateToken);

  const infoRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );

  if (infoRes.status === 403 || infoRes.status === 429) {
    throw new Error("GitHub rate limit hit. Wait a minute and try again.");
  }
  if (infoRes.status === 404) {
    throw new Error("Repository not found. If it's private, make sure your token has access.");
  }

  const info = await infoRes.json();

  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers }
  );
  const tree = await treeRes.json();
  const allFiles = tree.tree || [];

  // ── README ────────────────────────────────────────────────────────
  let readme = "";
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    const readmeData = await readmeRes.json();
    readme = atob(readmeData.content.replace(/\n/g, ""));
    readme = readme.slice(0, 6000);
  } catch {}

  const IGNORE = [
    "node_modules", ".git", "package-lock", "yarn.lock",
    "dist/", "build/", ".min.", "__pycache__", ".pyc",
    "coverage/", ".next/", "vendor/",
  ];
  const shouldIgnore = (path) => IGNORE.some((i) => path.includes(i));

  // ── SMART FILE CATEGORIES ─────────────────────────────────────────

  const ENTRY_POINTS = [
    "index.js", "index.ts", "main.py", "main.go", "main.rs",
    "app.js", "app.ts", "app.py", "server.js", "server.ts",
    "manage.py", "wsgi.py", "asgi.py", "cmd/main.go",
  ];

  const CONFIG_FILES = [
    "package.json", "requirements.txt", "go.mod", "Cargo.toml",
    "pyproject.toml", "Makefile", "docker-compose.yml", "Dockerfile",
    ".env.example", "vite.config.js", "vite.config.ts",
    "webpack.config.js", "tsconfig.json", "jest.config.js",
    "setup.py", "setup.cfg",
  ];

  const AUTH_PATTERNS = [
    "auth", "login", "jwt", "token", "session",
    "middleware", "guard", "permission", "security",
  ];

  const API_PATTERNS = [
    "route", "router", "controller", "handler", "endpoint",
    "api", "view", "urls.py", "schema",
  ];

  const DB_PATTERNS = [
    "model", "schema", "migration", "database", "db",
    "repository", "store", "entity",
  ];

  const TEST_PATTERNS = [
    "test", "spec", "__test__", ".test.", ".spec.",
  ];

  const CODE_EXTENSIONS = [
    ".js", ".ts", ".jsx", ".tsx", ".py", ".go",
    ".java", ".rs", ".cpp", ".c", ".rb", ".php",
  ];

  const isCode = (path) => CODE_EXTENSIONS.some((ext) => path.endsWith(ext));

  const blob = (f) => f.type === "blob" && !shouldIgnore(f.path);

  // Categorize all files
  const entryFiles = allFiles.filter(f => blob(f) && ENTRY_POINTS.some(e => f.path.endsWith(e)));
  const configFiles = allFiles.filter(f => blob(f) && CONFIG_FILES.some(e => f.path.endsWith(e)));
  const authFiles = allFiles.filter(f => blob(f) && isCode(f.path) && AUTH_PATTERNS.some(p => f.path.toLowerCase().includes(p)));
  const apiFiles = allFiles.filter(f => blob(f) && isCode(f.path) && API_PATTERNS.some(p => f.path.toLowerCase().includes(p)));
  const dbFiles = allFiles.filter(f => blob(f) && isCode(f.path) && DB_PATTERNS.some(p => f.path.toLowerCase().includes(p)));
  const testFiles = allFiles.filter(f => blob(f) && isCode(f.path) && TEST_PATTERNS.some(p => f.path.toLowerCase().includes(p)));

  // Build fetch plan — priority order, deduplicated
  const seen = new Set();
  const plan = [];

  const add = (files, limit, charLimit) => {
    for (const f of files) {
      if (plan.length >= 20) break;
      if (seen.has(f.path)) continue;
      seen.add(f.path);
      plan.push({ ...f, charLimit });
      if (plan.filter(x => x.charLimit === charLimit).length >= limit) break;
    }
  };

  add(configFiles, 6, 2500);   // configs — full view
  add(entryFiles, 4, 2500);    // entry points — full view
  add(authFiles, 3, 2000);     // auth — security analysis
  add(apiFiles, 3, 1500);      // routes — structure analysis
  add(dbFiles, 3, 1500);       // models — data analysis
  add(testFiles, 2, 1000);     // tests — coverage analysis

  // Fetch all planned files
  let fileContents = "";
  for (const file of plan) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers }
      );
      const data = await res.json();
      if (data.content) {
        const content = atob(data.content.replace(/\n/g, "")).slice(0, file.charLimit);
        fileContents += `\n\n=== ${file.path} ===\n${content}`;
      }
    } catch {}
  }

  // Full file tree
  const allPaths = allFiles
    .filter(f => f.type === "blob" && !shouldIgnore(f.path))
    .map(f => f.path)
    .slice(0, 150)
    .join("\n");

  // File category summary for Bob
  const categorySummary = `
ENTRY POINTS: ${entryFiles.map(f => f.path).join(", ") || "none found"}
AUTH/SECURITY FILES: ${authFiles.map(f => f.path).slice(0, 5).join(", ") || "none found"}
API/ROUTE FILES: ${apiFiles.map(f => f.path).slice(0, 5).join(", ") || "none found"}
DATABASE/MODEL FILES: ${dbFiles.map(f => f.path).slice(0, 5).join(", ") || "none found"}
TEST FILES: ${testFiles.length} found${testFiles.length > 0 ? ` (${testFiles.slice(0, 3).map(f => f.path).join(", ")})` : " — no tests detected"}
  `.trim();

  return `
REPOSITORY: ${owner}/${repo}
DESCRIPTION: ${info.description || "No description"}
STARS: ${info.stargazers_count} | LANGUAGE: ${info.language} | FORKS: ${info.forks_count}
TOPICS: ${(info.topics || []).join(", ")}
OPEN ISSUES: ${info.open_issues_count} | LICENSE: ${info.license?.name || "none"}

CODEBASE STRUCTURE ANALYSIS:
${categorySummary}

FILE TREE (up to 150 files):
${allPaths}

README:
${readme}

KEY FILE CONTENTS:
${fileContents}
  `.trim();
}