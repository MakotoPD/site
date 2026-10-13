import { existsSync } from 'node:fs'
import { dirname, resolve, delimiter } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const portable = resolve(root, '.tools', `node-v26.11.1-win-${process.arch}`, 'node.exe')
const executable =
  process.platform === 'win32' && existsSync(portable) ? portable : process.execPath
if (executable === process.execPath && Number(process.versions.node.split('.')[0]) < 26) {
  console.error('Use Node.js 26.11.1 or newer. On Windows run npm run runtime:setup first.')
  process.exit(1)
}
const [command, ...args] = process.argv.slice(2)
const target =
  command === 'nuxt'
    ? [resolve(root, 'node_modules/nuxt/bin/nuxt.mjs'), ...args]
    : [command, ...args]
if (!command) throw new Error('Missing project command')
const child = spawn(executable, target, {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, PATH: dirname(executable) + delimiter + process.env.PATH },
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('error', (error) => {
  console.error(error.message)
  process.exitCode = 1
})
child.on('exit', (code) => {
  process.exitCode = code ?? 1
})
