import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'
const logo = readFileSync('public/brand/makoto.webp').toString('base64')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#090c10"/><image x="80" y="65" width="282" height="60" href="data:image/png;base64,${logo}"/><text x="80" y="306" fill="#f2f4f7" font-family="sans-serif" font-size="76">Strony z pomysłem.</text><text x="80" y="405" fill="#b5dcff" font-family="serif" font-style="italic" font-size="88">Kod z charakterem.</text><text x="80" y="540" fill="#929ba8" font-family="sans-serif" font-size="24">KUJAWSKO-POMORSKIE · MAKOTO.COM.PL</text><circle cx="1050" cy="140" r="210" stroke="#293f56" stroke-width="1" fill="none"/><circle cx="1050" cy="140" r="170" stroke="#293f56" stroke-width="1" fill="none"/></svg>`
writeFileSync('public/images/social.svg', svg)
await sharp(Buffer.from(svg)).png().toFile('public/images/social.png')
console.log('Social preview uses the original Makoto logo.')
