import { copyFileSync, cpSync, existsSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const project = join(root, "..");
const from = join(project, "out");
const to = join(project, "dist");

if (!existsSync(from)) {
  throw new Error("Next.js export folder `out` was not created. Static export failed.");
}

rmSync(to, { recursive: true, force: true });
cpSync(from, to, { recursive: true });
flattenNextRscFiles(to);
console.log("Static site copied to lms/dist — upload this folder's contents to your hosting public_html.");

function flattenNextRscFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      copyDotted(dir, entry.name, full);
    }
    flattenNextRscFiles(full);
  }
}

function copyDotted(parentDir, prefix, currentPath) {
  for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
    const full = join(currentPath, entry.name);
    if (entry.isDirectory()) {
      copyDotted(parentDir, `${prefix}.${entry.name}`, full);
      continue;
    }
    if (!entry.name.endsWith(".txt")) continue;
    const destName = entry.name === "__PAGE__.txt" ? `${prefix}.__PAGE__.txt` : `${prefix}.${entry.name}`;
    copyFileSync(full, join(parentDir, destName));
  }
}
