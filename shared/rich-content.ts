export interface RichNode {
  type: string
  text?: string
  attrs?: Record<string, unknown>
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  content?: RichNode[]
}
export const alertTypes = [
  'note',
  'tip',
  'info',
  'success',
  'important',
  'warning',
  'caution',
] as const
export type AlertKind = (typeof alertTypes)[number]
export const calloutMeta: Record<AlertKind, { label: string; description: string; icon: string }> =
  {
    note: {
      label: 'Notatka',
      description: 'Dodatkowy kontekst do tekstu.',
      icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10M7 12h7M7 16h10M16 3h5v5h-5z',
    },
    tip: {
      label: 'Wskazówka',
      description: 'Praktyczna rada dla czytelnika.',
      icon: 'M9 18h6M10 22h4M9 15c0-3-4-3-4-7a7 7 0 0 1 14 0c0 4-4 4-4 7z',
    },
    info: {
      label: 'Informacja',
      description: 'Fakt, który warto znać.',
      icon: 'M12 11v6M12 7v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    },
    success: {
      label: 'Dobry efekt',
      description: 'Potwierdzony rezultat lub dobre rozwiązanie.',
      icon: 'M8 12l3 3 5-6M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    },
    important: {
      label: 'Ważne',
      description: 'Coś, czego nie warto pomijać.',
      icon: 'M12 8v5M12 16v.1M3 5l9-3 9 3v7c0 5-6 9-9 10-3-1-9-5-9-10z',
    },
    warning: {
      label: 'Uwaga',
      description: 'Ryzyko lub częsty błąd.',
      icon: 'M12 9v4M12 17v.1M10 3L2 18q-1 3 2 3h16q3 0 2-3L14 3q-2-2-4 0',
    },
    caution: {
      label: 'Ostrożnie',
      description: 'Działanie, które wymaga szczególnej uwagi.',
      icon: 'M4 22v-7a8 8 0 0 1 16 0v7M2 22h20M12 2v2M3 5l2 2M21 5l-2 2M12 12v5M12 19v.1',
    },
  }
export function emptyDocument(): RichNode {
  return { type: 'doc', content: [{ type: 'paragraph' }] }
}
export function safeHref(value: unknown, media = false) {
  if (
    typeof value !== 'string' ||
    !value ||
    value.length > 2048 ||
    /[\u0000-\u0020\u007f\\]/.test(value)
  )
    return ''
  if (value.startsWith('/') && !value.startsWith('//')) return value
  if (!media && /^#[a-zA-Z0-9_-]+$/.test(value)) return value
  try {
    const url = new URL(value)
    return (media ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:', 'tel:']).includes(
      url.protocol,
    )
      ? value
      : ''
  } catch {
    return ''
  }
}
const blocks = new Set([
  'paragraph',
  'heading',
  'bulletList',
  'orderedList',
  'blockquote',
  'codeBlock',
  'horizontalRule',
  'image',
  'file',
  'callout',
  'taskList',
  'table',
])
const marks = new Set([
  'bold',
  'italic',
  'strike',
  'underline',
  'code',
  'link',
  'highlight',
  'kbd',
  'subscript',
  'superscript',
])
const containers: Record<string, Set<string>> = {
  doc: blocks,
  paragraph: new Set(['text', 'hardBreak']),
  heading: new Set(['text', 'hardBreak']),
  codeBlock: new Set(['text']),
  blockquote: blocks,
  callout: blocks,
  bulletList: new Set(['listItem']),
  orderedList: new Set(['listItem']),
  listItem: blocks,
  taskList: new Set(['taskItem']),
  taskItem: blocks,
  table: new Set(['tableRow']),
  tableRow: new Set(['tableHeader', 'tableCell']),
  tableHeader: blocks,
  tableCell: blocks,
}
function record(value: unknown): Record<string, unknown> {
  if (value === undefined || value === null) return {}
  if (typeof value !== 'object' || Array.isArray(value))
    throw new Error('Nieprawidłowe właściwości bloku.')
  return value as Record<string, unknown>
}
function shortText(value: unknown, limit = 500) {
  if (value == null) return ''
  if (typeof value !== 'string' || value.length > limit)
    throw new Error('Tekst bloku jest zbyt długi.')
  return value
}
function integer(value: unknown, fallback: number, max: number) {
  if (value == null) return fallback
  if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > max)
    throw new Error('Nieprawidłowy rozmiar bloku.')
  return Number(value)
}

// Canonicalize an allowlisted JSON document. Unknown attributes never reach HTML.
export function normalizeRichDocument(value: unknown): RichNode {
  if (JSON.stringify(value)?.length > 250000) throw new Error('Treść wpisu jest zbyt duża.')
  let count = 0,
    textLength = 0
  function walk(input: unknown, depth: number, parent?: string): RichNode {
    if (!input || typeof input !== 'object' || Array.isArray(input) || depth > 24 || ++count > 5000)
      throw new Error('Nieprawidłowa struktura wpisu.')
    const source = input as RichNode,
      type = source.type
    if (!type || (parent ? !containers[parent]?.has(type) : type !== 'doc'))
      throw new Error('Nieobsługiwany blok lub jego położenie.')
    const node: RichNode = { type },
      attrs = record(source.attrs)
    if (type === 'text') {
      if (
        typeof source.text !== 'string' ||
        !source.text ||
        (textLength += source.text.length) > 80000
      )
        throw new Error('Nieprawidłowy lub zbyt długi tekst.')
      node.text = source.text
      if (source.marks !== undefined) {
        if (!Array.isArray(source.marks) || source.marks.length > 10)
          throw new Error('Nieprawidłowe formatowanie.')
        node.marks = source.marks.map((mark) => {
          if (!mark || !marks.has(mark.type) || parent === 'codeBlock')
            throw new Error('Nieobsługiwane formatowanie.')
          if (mark.type !== 'link') return { type: mark.type }
          const a = record(mark.attrs),
            href = safeHref(a.href)
          if (!href) throw new Error('Nieprawidłowy adres linku.')
          return { type: 'link', attrs: { href, title: shortText(a.title, 200) } }
        })
      }
    } else if (source.marks?.length) throw new Error('Formatowanie musi dotyczyć tekstu.')
    if (type === 'heading') {
      if (![2, 3, 4, 5, 6].includes(Number(attrs.level))) throw new Error('Użyj nagłówka H2–H6.')
      node.attrs = { level: Number(attrs.level) }
    }
    if (type === 'orderedList') node.attrs = { start: integer(attrs.start, 1, 10000) }
    if (type === 'callout') {
      if (!alertTypes.includes(attrs.kind as AlertKind))
        throw new Error('Nieznany rodzaj wyróżnienia.')
      node.attrs = { kind: attrs.kind, title: shortText(attrs.title, 120) }
    }
    if (type === 'taskItem') {
      if (typeof attrs.checked !== 'boolean') throw new Error('Nieprawidłowy stan zadania.')
      node.attrs = { checked: attrs.checked }
    }
    if (type === 'codeBlock') {
      const language = shortText(attrs.language, 30) || 'text'
      if (!/^[a-zA-Z0-9_+-]+$/.test(language)) throw new Error('Nieprawidłowy język kodu.')
      node.attrs = { language }
    }
    if (type === 'image' || type === 'file') {
      const src = safeHref(attrs.src, true)
      if (!src) throw new Error('Nieprawidłowy adres pliku.')
      if (type === 'image') {
        const alt = shortText(attrs.alt, 300).trim()
        if (!alt) throw new Error('Dodaj opis alternatywny zdjęcia.')
        node.attrs = {
          src,
          alt,
          title: shortText(attrs.title, 300),
          caption: shortText(attrs.caption, 500),
        }
        for (const dimension of ['width', 'height'])
          if (attrs[dimension] != null) node.attrs[dimension] = integer(attrs[dimension], 1, 8000)
      } else node.attrs = { src, name: shortText(attrs.name, 200) || 'Pobierz plik' }
    }
    if (type === 'tableHeader' || type === 'tableCell') {
      if (attrs.textAlign != null && !['left', 'center', 'right'].includes(String(attrs.textAlign)))
        throw new Error('Nieprawidłowe wyrównanie tabeli.')
      node.attrs = {
        colspan: integer(attrs.colspan, 1, 50),
        rowspan: integer(attrs.rowspan, 1, 50),
        textAlign: attrs.textAlign || null,
      }
      if (attrs.colwidth != null) {
        if (!Array.isArray(attrs.colwidth) || attrs.colwidth.length > 50)
          throw new Error('Nieprawidłowa szerokość tabeli.')
        node.attrs.colwidth = attrs.colwidth.map((width) => integer(width, 1, 2000))
      }
    }
    if (source.content !== undefined) {
      if (!containers[type] || !Array.isArray(source.content))
        throw new Error('Nieprawidłowa zawartość bloku.')
      node.content = source.content.map((child) => walk(child, depth + 1, type))
    }
    if (
      containers[type] &&
      !['doc', 'paragraph', 'heading', 'codeBlock'].includes(type) &&
      !node.content?.length
    )
      throw new Error('Blok nie może być pusty.')
    if (['listItem', 'taskItem'].includes(type) && node.content?.[0]?.type !== 'paragraph')
      throw new Error('Lista musi zaczynać się od akapitu.')
    return node
  }
  return walk(value, 0)
}
export function validateRichDocument(value: unknown): asserts value is RichNode {
  normalizeRichDocument(value)
}
export function richText(node: RichNode): string {
  if (node.type === 'text') return node.text || ''
  if (node.type === 'hardBreak') return '\n'
  if (node.type === 'image') return String(node.attrs?.caption || node.attrs?.alt || '')
  return (node.content || [])
    .map(richText)
    .join(['paragraph', 'heading', 'codeBlock'].includes(node.type) ? '' : '\n')
}
const escapeMarkdown = (text: string) => text.replace(/([\\`*_[\]<>])/g, '\\$1')
export function richDocumentMarkdown(node: RichNode): string {
  const children = () => (node.content || []).map(richDocumentMarkdown)
  if (node.type === 'text') {
    let value = escapeMarkdown(node.text || '')
    for (const mark of [...(node.marks || [])].reverse()) {
      const wrappers: Record<string, [string, string]> = {
        bold: ['**', '**'],
        italic: ['*', '*'],
        strike: ['~~', '~~'],
        code: ['`', '`'],
        kbd: ['<kbd>', '</kbd>'],
        highlight: ['<mark>', '</mark>'],
        subscript: ['<sub>', '</sub>'],
        superscript: ['<sup>', '</sup>'],
        underline: ['<u>', '</u>'],
      }
      if (mark.type === 'link') value = `[${value}](<${safeHref(mark.attrs?.href)}>)`
      else if (wrappers[mark.type])
        value = wrappers[mark.type]![0] + value + wrappers[mark.type]![1]
    }
    return value
  }
  const blocks = children()
  switch (node.type) {
    case 'doc':
      return blocks.join('\n\n')
    case 'paragraph':
      return blocks.join('')
    case 'heading':
      return '#'.repeat(Number(node.attrs?.level) || 2) + ' ' + blocks.join('')
    case 'hardBreak':
      return '  \n'
    case 'horizontalRule':
      return '---'
    case 'blockquote':
      return blocks
        .join('\n\n')
        .split('\n')
        .map((line) => '> ' + line)
        .join('\n')
    case 'callout':
      return (
        `> [!${String(node.attrs?.kind || 'note').toUpperCase()}]\n` +
        (node.attrs?.title ? `> **${escapeMarkdown(String(node.attrs.title))}**\n>\n` : '') +
        blocks
          .join('\n\n')
          .split('\n')
          .map((line) => '> ' + line)
          .join('\n')
      )
    case 'bulletList':
      return blocks.map((block) => '- ' + block.replace(/\n/g, '\n  ')).join('\n')
    case 'orderedList':
      return blocks
        .map(
          (block, i) => `${Number(node.attrs?.start || 1) + i}. ` + block.replace(/\n/g, '\n   '),
        )
        .join('\n')
    case 'listItem':
      return blocks.join('\n\n')
    case 'taskList':
      return blocks.join('\n')
    case 'taskItem':
      return `- [${node.attrs?.checked ? 'x' : ' '}] ` + blocks.join('\n\n').replace(/\n/g, '\n  ')
    case 'codeBlock': {
      const code = richText(node),
        fence = '`'.repeat(
          Math.max(3, Math.max(...(code.match(/`+/g) || ['']).map((s) => s.length)) + 1),
        )
      return `${fence}${String(node.attrs?.language || '')}\n${code}\n${fence}`
    }
    case 'image':
      return (
        `![${escapeMarkdown(String(node.attrs?.alt || ''))}](<${safeHref(node.attrs?.src, true)}>)` +
        (node.attrs?.caption ? '\n\n*' + escapeMarkdown(String(node.attrs.caption)) + '*' : '')
      )
    case 'file':
      return `[${escapeMarkdown(String(node.attrs?.name || 'Pobierz plik'))}](<${safeHref(node.attrs?.src, true)}>)`
    case 'table': {
      const rows = (node.content || []).map((row) =>
        (row.content || []).map((cell) =>
          richDocumentMarkdown(cell).replace(/\n/g, ' ').replace(/\|/g, '\\|'),
        ),
      )
      if (!rows.length) return ''
      const cols = Math.max(...rows.map((row) => row.length)),
        line = (row: string[]) =>
          '| ' + Array.from({ length: cols }, (_, i) => row[i] || '').join(' | ') + ' |'
      return [line(rows[0]!), line(Array(cols).fill('---')), ...rows.slice(1).map(line)].join('\n')
    }
    default:
      return blocks.join('\n\n')
  }
}
