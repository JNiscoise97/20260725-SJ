#!/usr/bin/env node
// Usage: node transform.js <fichier>

import fs from "fs"
import os from "os"
import path from "path"
import { spawnSync } from "child_process"

const file = process.argv[2]
if (!file) {
  console.error("Usage: node transform.js <fichier>")
  process.exit(1)
}

const content = fs.readFileSync(file, "utf8")

const result = content
  .split("\n")
  .map((line) => {
    if (line.startsWith("Mission : ")) {
      return line.slice("Mission : ".length) + "\n  TODO"
    }
    return line.replace("□ ", "    ")
  })
  .join("\n")

const tmp = path.join(os.tmpdir(), "_transform_clip.txt")
fs.writeFileSync(tmp, result, "utf8")
spawnSync("powershell.exe", [
  "-NoProfile", "-NonInteractive", "-Command",
  `Get-Content -Raw -Encoding UTF8 '${tmp}' | Set-Clipboard`,
])
fs.unlinkSync(tmp)
console.log("✓ Copié dans le presse-papier")
