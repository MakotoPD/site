import { randomBytes, scryptSync } from 'node:crypto'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
const rl = createInterface({ input: process.stdin, output: process.stdout })
const email =
  (await rl.question('E-mail administratora [contact@makoto.com.pl]: ')).trim() ||
  'contact@makoto.com.pl'
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  rl.close()
  throw new Error('Nieprawidłowy e-mail.')
}
const password = randomBytes(18).toString('base64url')
const salt = randomBytes(16).toString('hex'),
  hash = salt + ':' + scryptSync(password, salt, 64).toString('hex')
let env = existsSync('.env')
  ? readFileSync('.env', 'utf8')
  : 'NUXT_PUBLIC_SITE_URL=https://makoto.com.pl\nNUXT_PUBLIC_INDEXABLE=false\n'
for (const [key, value] of Object.entries({
  NUXT_ADMIN_EMAIL: email,
  NUXT_ADMIN_PASSWORD_HASH: hash,
})) {
  const pattern = new RegExp(`^${key}=.*$`, 'm')
  env = pattern.test(env) ? env.replace(pattern, `${key}=${value}`) : env + `\n${key}=${value}`
}
writeFileSync('.env', env + '\n')
console.log(
  `\nAdministrator skonfigurowany.\nE-mail: ${email}\nHasło (zapisz w menedżerze haseł): ${password}\n\nZrestartuj serwer. Logowanie: /admin/login\n`,
)
rl.close()
