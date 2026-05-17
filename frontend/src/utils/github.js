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

  let readme = "";
  try {
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );
    const readmeData = await readmeRes.json();
    readme = atob(readmeData.content.replace(/\n/g, ""));
    readme = readme.slice(0, 5000);
  } catch {}

  const PRIORITY_NAMES = [
    "package.json", "requirements.txt", "go.mod", "Cargo.toml",
    "pyproject.toml", "Makefile", "docker-compose.yml", "Dockerfile",
    ".env.example", "config.js", "config.ts", "config.py",
    "index.js", "index.ts", "main.py", "main.go", "main.rs",
    "app.js", "app.ts", "app.py", "server.js", "server.ts",
  ];

  const CODE_EXTENSIONS = [
    ".js", ".ts", ".jsx", ".tsx", ".py", ".go",
    ".java", ".rs", ".cpp", ".c", ".rb", ".php",
  ];

  const IGNORE = [
    "node_modules", ".git", "package-lock", "yarn.lock",
    "dist/", "build/", ".min.",
  ];

  const shouldIgnore = (path) => IGNORE.some((i) => path.includes(i));

  const priorityFiles = allFiles.filter(
    (f) =>
      f.type === "blob" &&
      !shouldIgnore(f.path) &&
      PRIORITY_NAMES.some((name) => f.path.endsWith(name))
  );

  const codeFiles = allFiles.filter(
    (f) =>
      f.type === "blob" &&
      !shouldIgnore(f.path) &&
      CODE_EXTENSIONS.some((ext) => f.path.endsWith(ext)) &&
      !priorityFiles.includes(f)
  );

  const filesToFetch = [
    ...priorityFiles.slice(0, 6),
    ...codeFiles.slice(0, 10),
  ];

  let fileContents = "";
  for (const file of filesToFetch) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
        { headers }
      );
      const data = await res.json();
      if (data.content) {
        const isPriority = priorityFiles.includes(file);
        const limit = isPriority ? 2000 : 1000;
        const content = atob(data.content.replace(/\n/g, "")).slice(0, limit);
        fileContents += `\n\n=== ${file.path} ===\n${content}`;
      }
    } catch {}
  }

  const allPaths = allFiles
    .filter((f) => f.type === "blob" && !shouldIgnore(f.path))
    .map((f) => f.path)
    .slice(0, 100)
    .join("\n");

  return `
REPOSITORY: ${owner}/${repo}
DESCRIPTION: ${info.description || "No description"}
STARS: ${info.stargazers_count} | LANGUAGE: ${info.language} | FORKS: ${info.forks_count}
TOPICS: ${(info.topics || []).join(", ")}

FILE STRUCTURE (up to 100 files):
${allPaths}

README (truncated):
${readme}

KEY FILE CONTENTS:
${fileContents}
  `.trim();
}