import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import * as prettier from 'prettier'
import { wrapTailwind } from './wrap-tailwind.mjs'

const check = process.argv.includes('--check')
const excluded = new Set([
  '.git',
  '.tools',
  '.nuxt',
  '.output',
  '.data',
  'node_modules',
  'public',
  'test-results',
])
function files(directory = '.') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excluded.has(entry.name)) return []
    const file = join(directory, entry.name)
    return entry.isDirectory() ? files(file) : [file]
  })
}
let changes = 0
for (const file of files()) {
  const info = await prettier.getFileInfo(file, { ignorePath: '.prettierignore' })
  if (info.ignored || !info.inferredParser) continue
  const source = readFileSync(file, 'utf8')
  const options = await prettier.resolveConfig(file)
  let formatted = await prettier.format(source, { ...options, filepath: file })
  if (file.endsWith('.vue')) formatted = wrapTailwind(formatted)
  if (source !== formatted) {
    changes++
    if (check) console.log('Needs formatting: ' + file)
    else writeFileSync(file, formatted)
  }
}
console.log(
  check
    ? `Format check: ${changes ? changes + ' files need formatting' : 'PASS'}`
    : `Formatted ${changes} files.`,
)
if (check && changes) process.exitCode = 1
