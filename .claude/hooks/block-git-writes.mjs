#!/usr/bin/env node
// PreToolUse hook (matcher: Bash).
// Blocks any command that would change Git / GitHub state.
// Reads the tool call as JSON on stdin; exit code 2 = block, and the
// message written to stderr is shown to the agent.
// No dependencies (works on Windows, macOS and Linux).

import { readFileSync } from "node:fs";

// Subcommands that are always blocked.
const ALWAYS_BLOCKED = new Set([
  "commit", "push", "add", "checkout", "switch", "merge", "rebase", "reset",
  "restore", "cherry-pick", "revert", "pull", "clean", "rm", "mv", "am",
  "apply", "worktree", "submodule", "gc", "filter-branch",
]);

// Subcommands that are blocked unless every argument is a read-only flag.
const READ_ONLY_FLAGS = {
  branch: new Set(["-a", "-r", "-v", "-vv", "--list", "-l", "--show-current", "--merged", "--no-merged", "--contains"]),
  tag: new Set(["-l", "--list"]),
  remote: new Set(["-v", "show", "get-url"]),
  config: new Set(["--get", "--get-all", "--list", "-l"]),
  stash: new Set(["list", "show"]),
};

// git global options that take a separate value.
const GLOBAL_OPTS_WITH_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace", "--exec-path"]);

function blockedReason(command) {
  // Treat quotes, backticks and $( ) as separators so `bash -c "git commit"` is seen too.
  const normalized = command.replace(/["'`]/g, " ").replace(/\$\(/g, " ; ");
  const segments = normalized.split(/&&|\|\||;|\||\n|\(|\)/);

  for (const segment of segments) {
    const tokens = segment.trim().split(/\s+/).filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      const bin = tokens[i].replace(/\\/g, "/").split("/").pop().toLowerCase();

      if (bin === "gh" || bin === "gh.exe") {
        const sub = tokens[i + 1];
        if (["pr", "repo", "release", "issue", "gist"].includes(sub)) {
          return `gh ${sub} (GitHub changes are made by the user only)`;
        }
        if (sub === "api" && /(-X|--method)\s*(POST|PUT|PATCH|DELETE)/i.test(segment)) {
          return "gh api with a write method";
        }
      }

      if (bin === "git" || bin === "git.exe") {
        let j = i + 1;
        while (j < tokens.length && tokens[j].startsWith("-")) {
          j += GLOBAL_OPTS_WITH_VALUE.has(tokens[j]) ? 2 : 1;
        }
        const sub = tokens[j];
        if (!sub) continue;
        const args = tokens.slice(j + 1);

        if (ALWAYS_BLOCKED.has(sub)) return `git ${sub}`;

        const allowed = READ_ONLY_FLAGS[sub];
        if (allowed && args.length > 0 && !args.every((a) => allowed.has(a))) {
          return `git ${sub} ${args.join(" ")}`;
        }
        if (sub === "stash" && args.length === 0) return "git stash";
      }
    }
  }
  return null;
}

let input = "";
try {
  input = readFileSync(0, "utf8");
} catch {
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(input);
} catch {
  process.exit(0);
}

const command = payload?.tool_input?.command;
if (payload?.tool_name !== "Bash" || typeof command !== "string") process.exit(0);

const reason = blockedReason(command);
if (reason) {
  process.stderr.write(
    `BLOCKED: "${reason}" changes Git/GitHub state. ` +
      `The user does all commits, branches, pushes and pull requests herself. ` +
      `Finish your work, then print a suggested commit message and stop.\n`
  );
  process.exit(2);
}
process.exit(0);
