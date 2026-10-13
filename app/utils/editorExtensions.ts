import { Extension, Mark, Node } from '@tiptap/core'
import type { DOMOutputSpec } from '@tiptap/pm/model'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { TableKit } from '@tiptap/extension-table'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { syntaxHighlighter } from '#shared/highlight'
import { calloutMeta, safeHref, type AlertKind } from '#shared/rich-content'

const CaptionImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
        rendered: false,
        parseHTML: (element) =>
          element.closest('figure')?.querySelector('figcaption')?.textContent || '',
      },
    }
  },
  renderHTML({ node }) {
    const attrs = node.attrs
    const image: DOMOutputSpec = [
      'img',
      {
        src: safeHref(attrs.src, true),
        alt: attrs.alt || '',
        ...(attrs.title ? { title: attrs.title } : {}),
        ...(attrs.width ? { width: attrs.width } : {}),
        ...(attrs.height ? { height: attrs.height } : {}),
      },
    ]
    return [
      'figure',
      {},
      image,
      ...(attrs.caption
        ? [['figcaption', { contenteditable: 'false' }, attrs.caption] as DOMOutputSpec]
        : []),
    ]
  },
})
const FileNode = Node.create({
  name: 'file',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: '', parseHTML: (el) => el.getAttribute('href') },
      name: { default: 'Pobierz plik', parseHTML: (el) => el.textContent || '' },
    }
  },
  parseHTML() {
    return [{ tag: 'a[data-file]' }]
  },
  renderHTML({ node }) {
    return [
      'a',
      { href: safeHref(node.attrs.src, true), 'data-file': '', download: '', class: 'rich-file' },
      ['span', { 'aria-hidden': 'true' }, '↓'],
      node.attrs.name,
    ]
  },
})
const Kbd = Mark.create({
  name: 'kbd',
  parseHTML() {
    return [{ tag: 'kbd' }]
  },
  renderHTML() {
    return ['kbd', 0]
  },
})
const LabeledCodeBlock = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || 'text'
    return [
      'pre',
      { ...HTMLAttributes, 'data-language': language },
      ['code', { class: `language-${language}` }, 0],
    ]
  },
})
const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,
  addAttributes() {
    return {
      kind: {
        default: 'note',
        rendered: false,
        parseHTML: (element) => element.getAttribute('data-callout') || 'note',
      },
      title: {
        default: '',
        rendered: false,
        parseHTML: (element) => element.querySelector('[data-callout-title]')?.textContent || '',
      },
    }
  },
  parseHTML() {
    return [
      { tag: 'aside[data-callout]', contentElement: '.rich-callout-content' },
      { tag: 'aside[data-callout]', contentElement: '.alert-content' },
    ]
  },
  renderHTML({ node }) {
    const kind: AlertKind = Object.hasOwn(calloutMeta, node.attrs.kind) ? node.attrs.kind : 'note'
    return [
      'aside',
      { 'data-callout': kind, class: `rich-callout rich-callout-${kind}`, role: 'note' },
      [
        'div',
        { class: 'rich-callout-heading', contenteditable: 'false' },
        [
          'http://www.w3.org/2000/svg svg',
          {
            'aria-hidden': 'true',
            width: 22,
            height: 22,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          ['path', { d: calloutMeta[kind].icon }],
        ],
        ['span', { 'data-callout-title': '' }, node.attrs.title || calloutMeta[kind].label],
      ],
      ['div', { class: 'rich-callout-content' }, 0],
    ]
  },
})
const TableAlignment = Extension.create({
  name: 'tableAlignment',
  addGlobalAttributes() {
    return [
      {
        types: ['tableCell', 'tableHeader'],
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element) =>
              ['left', 'center', 'right'].includes(element.style.textAlign)
                ? element.style.textAlign
                : null,
            renderHTML: (attrs) =>
              ['left', 'center', 'right'].includes(attrs.textAlign)
                ? { style: `text-align:${attrs.textAlign}` }
                : {},
          },
        },
      },
    ]
  },
})
export function richEditorExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4, 5, 6] },
      codeBlock: false,
      link: {
        openOnClick: false,
        defaultProtocol: 'https',
        isAllowedUri: (url) => !!safeHref(url),
      },
    }),
    CaptionImage,
    FileNode,
    Highlight,
    Kbd,
    Subscript,
    Superscript,
    Callout,
    TaskList,
    TaskItem.configure({
      nested: true,
      a11y: { checkboxLabel: (node) => `Zadanie: ${node.textContent || 'nowe zadanie'}` },
    }),
    TableKit.configure({ table: { resizable: false, renderWrapper: true } }),
    TableAlignment,
    LabeledCodeBlock.configure({ lowlight: syntaxHighlighter }),
    Placeholder.configure({
      placeholder: ({ node }) =>
        node.type.name === 'heading'
          ? 'Nagłówek sekcji'
          : 'Zacznij pisać. Dobry tekst zaczyna się od pierwszego zdania…',
    }),
  ]
}
