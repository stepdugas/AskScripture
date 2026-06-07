#!/usr/bin/env node
/**
 * One-shot refactor: remove SiteHeader/SiteFooter from every page
 * (now rendered in root layout). Strips:
 *   - `import { SiteHeader } from "@/components/site-header";`
 *   - `import { SiteFooter } from "@/components/site-footer";`
 *   - The wrapper div + <SiteHeader/> + <main className="flex-1"> + … + </main> + <SiteFooter/> + </div>
 *
 * Two wrapper variants supported (page.tsx returns a JSX tree directly):
 *   (a) <div className="min-h-screen flex flex-col"><SiteHeader/>...<main className="flex-1">CONTENT</main><SiteFooter/></div>
 *   (b) The Shell helper used by admin/page.tsx (skipped — handled in-file).
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src/app");

const filesToProcess = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) walk(full);
    else if (f.name === "page.tsx" || f.name === "not-found.tsx") {
      filesToProcess.push(full);
    }
  }
}
walk(APP);

let edited = 0;
let skipped = 0;
for (const file of filesToProcess) {
  let src = fs.readFileSync(file, "utf8");
  const orig = src;

  // Remove imports
  src = src.replace(
    /^import \{ SiteHeader \} from "@\/components\/site-header";\n/gm,
    "",
  );
  src = src.replace(
    /^import \{ SiteFooter \} from "@\/components\/site-footer";\n/gm,
    "",
  );

  // Remove wrapper. We rewrite the common pattern:
  //   <div className="min-h-screen flex flex-col">
  //     <SiteHeader />
  //     <main className="flex-1">
  //       ...CONTENT...
  //     </main>
  //     <SiteFooter />
  //   </div>
  // into just ...CONTENT...
  // Pattern is whitespace-tolerant.
  const wrapperPattern =
    /<div className="min-h-screen flex flex-col">\s*<SiteHeader\s*\/>\s*<main className="flex-1">([\s\S]*?)<\/main>\s*<SiteFooter\s*\/>\s*<\/div>/g;
  src = src.replace(wrapperPattern, (_m, content) => {
    // Trim outer whitespace from content for cleaner output
    return content.trim();
  });

  // Also handle the `<Shell>` helper used in admin/page.tsx — skip; it's local.

  if (src !== orig) {
    fs.writeFileSync(file, src);
    edited++;
    console.log("  edited:", path.relative(ROOT, file));
  } else {
    skipped++;
  }
}

console.log(`\nDone. Edited ${edited} files, skipped ${skipped}.`);
