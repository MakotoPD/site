import { calloutMeta, safeHref, type AlertKind, type RichNode } from './rich-content.ts'
import { syntaxHighlighter } from './highlight.ts'
export const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  )
function highlight(code: string, language: string) {
  if (code.length > 20000 || !syntaxHighlighter.registered(language)) return escapeHtml(code)
  type HighlightNode = ReturnType<typeof syntaxHighlighter.highlight>['children'][number]
  const render = (node: HighlightNode): string =>
    node.type === 'text'
      ? escapeHtml(node.value)
      : node.type === 'element'
        ? `<span class="${escapeHtml(((node.properties.className as string[]) || []).join(' '))}">${node.children.map((child) => render(child as HighlightNode)).join('')}</span>`
        : ''
  try {
    return syntaxHighlighter.highlight(language, code).children.map(render).join('')
  } catch {
    return escapeHtml(code)
  }
}
// HTML comes only from fixed tags, escaped text and allowlisted attributes.
export function renderRichDocument(node: RichNode): string {
  const content = () => (node.content || []).map(renderRichDocument).join('')
  const attrs = node.attrs || {}
  switch (node.type) {
    case 'doc':
      return content()
    case 'text': {
      let html = escapeHtml(node.text)
      const tags: Record<string, string> = {
        bold: 'strong',
        italic: 'em',
        strike: 's',
        underline: 'u',
        code: 'code',
        highlight: 'mark',
        kbd: 'kbd',
        subscript: 'sub',
        superscript: 'sup',
      }
      for (const mark of [...(node.marks || [])].reverse()) {
        if (tags[mark.type]) html = `<${tags[mark.type]}>${html}</${tags[mark.type]}>`
        else if (mark.type === 'link' && safeHref(mark.attrs?.href))
          html = `<a href="${escapeHtml(safeHref(mark.attrs?.href))}"${mark.attrs?.title ? ` title="${escapeHtml(mark.attrs.title)}"` : ''} rel="noopener noreferrer">${html}</a>`
      }
      return html
    }
    case 'paragraph':
      return `<p>${content()}</p>`
    case 'heading': {
      const level = [2, 3, 4, 5, 6].includes(Number(attrs.level)) ? Number(attrs.level) : 2
      return `<h${level}>${content()}</h${level}>`
    }
    case 'bulletList':
      return `<ul>${content()}</ul>`
    case 'orderedList':
      return `<ol start="${Number(attrs.start) || 1}">${content()}</ol>`
    case 'listItem':
      return `<li>${content()}</li>`
    case 'taskList':
      return `<ul class="rich-task-list" data-type="taskList">${content()}</ul>`
    case 'taskItem':
      return `<li data-type="taskItem" data-checked="${attrs.checked === true}"><label><input type="checkbox" disabled aria-label="Stan zadania"${attrs.checked ? ' checked' : ''}></label><div>${content()}</div></li>`
    case 'blockquote':
      return `<blockquote>${content()}</blockquote>`
    case 'callout': {
      const kind: AlertKind =
          attrs.kind && Object.hasOwn(calloutMeta, String(attrs.kind))
            ? (attrs.kind as AlertKind)
            : 'note',
        meta = calloutMeta[kind]
      return `<aside class="rich-callout rich-callout-${kind}" data-callout="${kind}" role="note" aria-label="${escapeHtml(meta.label)}"><div class="rich-callout-heading"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${meta.icon}"/></svg><span data-callout-title>${escapeHtml(attrs.title || meta.label)}</span></div><div class="rich-callout-content">${content()}</div></aside>`
    }
    case 'codeBlock': {
      const language = String(attrs.language || 'text')
      return `<pre data-language="${escapeHtml(language)}"><code class="hljs language-${escapeHtml(language.replace(/[^a-zA-Z0-9_+-]/g, ''))}">${highlight((node.content || []).map((n) => n.text || '').join(''), language)}</code></pre>`
    }
    case 'hardBreak':
      return '<br>'
    case 'horizontalRule':
      return '<hr>'
    case 'image': {
      const src = safeHref(attrs.src, true)
      return src
        ? `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(attrs.alt)}" loading="lazy" decoding="async"${attrs.width ? ` width="${Number(attrs.width)}"` : ''}${attrs.height ? ` height="${Number(attrs.height)}"` : ''}>${attrs.caption ? `<figcaption>${escapeHtml(attrs.caption)}</figcaption>` : ''}</figure>`
        : ''
    }
    case 'file': {
      const src = safeHref(attrs.src, true)
      return src
        ? `<a class="rich-file" href="${escapeHtml(src)}" download rel="noopener noreferrer"><span aria-hidden="true">↓</span>${escapeHtml(attrs.name || 'Pobierz plik')}</a>`
        : ''
    }
    case 'table': {
      const rows = node.content || [],
        hasHead = rows[0]?.content?.every((cell) => cell.type === 'tableHeader')
      return `<div class="rich-table-scroll" role="region" aria-label="Tabela we wpisie" tabindex="0"><table>${hasHead ? `<thead>${renderRichDocument(rows[0]!)}</thead>` : ''}<tbody>${(hasHead ? rows.slice(1) : rows).map(renderRichDocument).join('')}</tbody></table></div>`
    }
    case 'tableRow':
      return `<tr>${content()}</tr>`
    case 'tableHeader':
    case 'tableCell': {
      const tag = node.type === 'tableHeader' ? 'th' : 'td',
        align = ['left', 'center', 'right'].includes(String(attrs.textAlign))
          ? ` style="text-align:${attrs.textAlign}"`
          : ''
      return `<${tag}${tag === 'th' ? ' scope="col"' : ''} colspan="${Number(attrs.colspan) || 1}" rowspan="${Number(attrs.rowspan) || 1}"${align}>${content()}</${tag}>`
    }
    default:
      return ''
  }
}
