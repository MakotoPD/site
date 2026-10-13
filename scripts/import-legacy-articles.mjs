// Import the two public articles already listed in makoto.com.pl's sitemap.
import { writeFileSync } from 'node:fs'
const slugs = ['co-przygotowac-przed-zamowieniem-strony', 'jak-porownac-wyceny-strony-internetowej']
function inline(node) {
  if (node.type === 'hardBreak') return '\n'
  let value = node.text || (node.content || []).map(inline).join('')
  for (const mark of node.marks || []) {
    if (mark.type === 'bold') value = `**${value}**`
    if (mark.type === 'italic') value = `*${value}*`
    if (mark.type === 'link') {
      const href = String(mark.attrs?.href || '')
        .replace(/^\/pl\/strony-internetowe$/, '/uslugi/strony-internetowe')
        .replace(/^\/pl\/opieka-techniczna$/, '/uslugi/opieka-techniczna')
        .replace(/^\/pl\/work$/, '/realizacje')
        .replace(/^\/pl\/kontakt$/, '/kontakt')
      if (/^(https?:\/\/|\/[^/])/.test(href)) value = `[${value}](${href})`
    }
  }
  return value
}
function block(node) {
  if (node.type === 'heading')
    return '#'.repeat(Math.max(2, Math.min(node.attrs?.level || 2, 6))) + ' ' + inline(node)
  if (node.type === 'paragraph') return inline(node)
  if (node.type === 'bulletList' || node.type === 'orderedList')
    return (node.content || [])
      .map(
        (item, i) =>
          (node.type === 'bulletList' ? '- ' : `${i + 1}. `) + item.content.map(block).join(' '),
      )
      .join('\n')
  return (node.content || []).map(block).join('\n\n')
}
const articles = []
for (const slug of slugs) {
  const response = await fetch(`https://makoto.com.pl/api/content/article?locale=pl&slug=${slug}`)
  if (!response.ok) throw new Error('Could not read public article: ' + slug)
  const entry = await response.json()
  articles.push({
    slug: entry.slug,
    title: entry.title,
    excerpt: entry.summary,
    content: block(entry.body),
    category: 'Poradniki',
    cover: '',
    publishedAt: entry.publishedAt,
    updatedAt: entry.updatedAt,
  })
}
writeFileSync('server/data/legacy-articles.json', JSON.stringify(articles, null, 2))
console.log('Imported 2 public articles with original publication dates.')
