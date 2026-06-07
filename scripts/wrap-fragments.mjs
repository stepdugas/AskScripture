#!/usr/bin/env node
/**
 * After strip-chrome.mjs removed wrapper divs, some pages return multiple
 * sibling JSX elements at the top of their return statement. Wrap them in
 * a React fragment.
 *
 * Approach: for each page.tsx / not-found.tsx, look at the *exported default
 * function*'s return statement. If the content immediately after `return (`
 * begins with whitespace and then a JSX comment `{/* ` or a JSX element that
 * we know was originally a wrapped child (e.g. `<section`, `<div className="mx-auto`),
 * insert a `<>` after `return (` and `</>` before the closing `)`.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src/app");

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full, out);
    else if (f.name === "page.tsx" || f.name === "not-found.tsx") out.push(full);
  }
  return out;
}

const files = walk(APP);
let edited = 0;
for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  const orig = src;

  // Find each `return (` and try to match a balanced parens block.
  // Then look at the trimmed first non-whitespace character.
  // If it starts with `{/*` (comment) or there's a top-level pattern of
  // multiple JSX siblings, wrap in fragment.

  // Heuristic: replace `return (\n[whitespace]{/*` with `return (\n<>\n{/*`,
  // and similarly for `return (\n[whitespace]<section`,
  // `return (\n[whitespace]<article`, `return (\n[whitespace]<div className="mx-auto`.
  // Then find the corresponding closing `);` for those returns and insert `</>`.

  // Easier: scan tokens.
  // We rely on the indentation pattern of strip-chrome's output:
  //   return (
  //         {/* ... */}                   <- 8 space indent
  //         <section ...>
  //         ...
  //       );

  const lines = src.split("\n");
  const outLines = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    outLines.push(line);
    // Look for a `return (` line followed by content that suggests fragment.
    if (/^\s*return \(\s*$/.test(line)) {
      const next = lines[i + 1] ?? "";
      const startsWithComment = /^\s+\{\/\*/.test(next);
      const startsWithSection = /^\s+<(section|article|div className="mx-auto|>)/.test(next);
      if (startsWithComment || startsWithSection) {
        // Insert a fragment open
        outLines.push("    <>");
        // Now we need to find the matching `);` at the same nesting level.
        // Track paren depth starting from this `(`.
        let depth = 1;
        i++; // move past the `return (`
        while (i < lines.length && depth > 0) {
          const cur = lines[i];
          // Count parens in this line, ignoring those inside strings (rough)
          // Simpler: just look for the literal `  );` line at the right
          // indentation. The strip-chrome output uses `  );` at module
          // function level.
          if (/^\s*\);\s*$/.test(cur) && depth === 1) {
            outLines.push("    </>");
            outLines.push(cur);
            depth = 0;
            i++;
            break;
          }
          outLines.push(cur);
          // Best-effort paren depth tracking on this line
          for (const ch of cur) {
            if (ch === "(") depth++;
            else if (ch === ")") depth--;
          }
          i++;
        }
        continue;
      }
    }
    i++;
  }
  src = outLines.join("\n");

  if (src !== orig) {
    fs.writeFileSync(file, src);
    edited++;
    console.log("  wrapped:", path.relative(ROOT, file));
  }
}

console.log(`\nDone. Wrapped ${edited} files.`);
