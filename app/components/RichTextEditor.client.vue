<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import {
  Undo2,
  Redo2,
  Underline,
  Strikethrough,
  Highlighter,
  ListOrdered,
  ListTodo,
  Quote,
  Table2,
  Keyboard,
  Subscript,
  Superscript,
  Link2,
  Unlink2,
  Paperclip,
  SquareCode,
  ArrowUp,
  ArrowDown,
} from '@lucide/vue'
import { richEditorExtensions } from '~/utils/editorExtensions'
import {
  alertTypes,
  calloutMeta,
  normalizeRichDocument,
  richText,
  safeHref,
  type AlertKind,
  type RichNode,
} from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
const props = defineProps<{ modelValue: RichNode }>()
const emit = defineEmits<{ 'update:modelValue': [value: RichNode]; error: [message: string] }>()
const more = ref(false),
  blockMenu = ref(false)
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const mode = ref<'link' | 'image' | 'file' | 'markdown'>('link'),
  modalError = ref(''),
  uploading = ref(false)
const fields = reactive({ url: '', label: '', alt: '', caption: '', markdown: '' })
let selection = { from: 1, to: 1 },
  editingImage = false
const editor = useEditor({
  content: props.modelValue,
  extensions: richEditorExtensions(),
  editorProps: {
    attributes: {
      class: [
        'rich-content min-h-[480px] p-[27px] text-[#c2cdd9] outline-none',
        'focus:shadow-[inset_0_0_0_1px_#8cb9e880] max-[760px]:px-[17px] max-[760px]:py-[21px] max-[760px]:text-[14px]',
        '[&_p.is-editor-empty:first-child::before]:pointer-events-none [&_p.is-editor-empty:first-child::before]:float-left [&_p.is-editor-empty:first-child::before]:h-0 [&_p.is-editor-empty:first-child::before]:text-[#788da3] [&_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
        '[&_.ProseMirror-selectednode]:outline-2 [&_.ProseMirror-selectednode]:outline-solid [&_.ProseMirror-selectednode]:outline-primary [&_.ProseMirror-selectednode]:outline-offset-[3px]',
        '[&_.selectedCell]:bg-[#2c4763] [&_.rich-callout-content_[data-placeholder]::before]:text-[14px] [&_figure_img]:cursor-pointer',
      ].join(' '),
      'data-ui': 'rich-editor-content',
      role: 'textbox',
      'aria-label': 'Treść wpisu',
      'aria-multiline': 'true',
      spellcheck: 'true',
    },
  },
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getJSON() as RichNode),
})
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && JSON.stringify(editor.value.getJSON()) !== JSON.stringify(value))
      editor.value.commands.setContent(value, { emitUpdate: false })
  },
)
onBeforeUnmount(() => editor.value?.destroy())
const words = computed(() => richText(props.modelValue).trim().split(/\s+/).filter(Boolean).length)
const heading = computed(() =>
  editor.value?.isActive('heading') ? String(editor.value.getAttributes('heading').level) : 'p',
)
function formatHeading(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === 'p') editor.value?.chain().focus().setParagraph().run()
  else
    editor.value
      ?.chain()
      .focus()
      .toggleHeading({ level: Number(value) as 2 | 3 | 4 | 5 | 6 })
      .run()
}
function callout(kind: AlertKind) {
  if (editor.value?.isActive('callout'))
    editor.value.chain().focus().updateAttributes('callout', { kind }).run()
  else editor.value?.chain().focus().toggleWrap('callout', { kind }).run()
  blockMenu.value = false
}
function insertBlock(kind: 'quote' | 'code' | 'table' | 'separator') {
  const chain = editor.value?.chain().focus()
  if (!chain) return
  if (kind === 'quote') chain.toggleBlockquote().run()
  else if (kind === 'code') chain.toggleCodeBlock().run()
  else if (kind === 'table') chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  else chain.setHorizontalRule().run()
  blockMenu.value = false
}
function removeLink() {
  editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
  dialog.value?.close()
}
function open(modeValue: typeof mode.value) {
  if (!editor.value) return
  selection = { from: editor.value.state.selection.from, to: editor.value.state.selection.to }
  mode.value = modeValue
  modalError.value = ''
  editingImage = modeValue === 'image' && editor.value.isActive('image')
  const image = editingImage ? editor.value.getAttributes('image') : {}
  Object.assign(fields, {
    url: modeValue === 'link' ? editor.value.getAttributes('link').href || '' : image.src || '',
    label: '',
    alt: image.alt || '',
    caption: image.caption || '',
    markdown: '',
  })
  blockMenu.value = false
  dialog.value?.showModal()
}
function applyDialog() {
  if (!editor.value || uploading.value) return
  try {
    if (mode.value === 'markdown') {
      const document = normalizeRichDocument(markdownToDocument(fields.markdown))
      editor.value
        .chain()
        .focus()
        .setTextSelection(selection)
        .insertContent(document.content || [])
        .run()
    } else if (mode.value === 'image') {
      if (!safeHref(fields.url, true))
        throw new Error('Podaj bezpieczny adres zdjęcia lub wgraj plik.')
      if (!fields.alt.trim()) throw new Error('Opisz krótko, co znajduje się na zdjęciu.')
      const attrs = {
        src: fields.url,
        alt: fields.alt.trim(),
        caption: fields.caption.trim(),
        title: '',
      }
      if (editingImage)
        editor.value
          .chain()
          .focus()
          .setNodeSelection(selection.from)
          .updateAttributes('image', attrs)
          .run()
      else editor.value.chain().focus().setTextSelection(selection).setImage(attrs).run()
    } else if (mode.value === 'file') {
      if (!safeHref(fields.url, true) || !fields.label.trim())
        throw new Error('Podaj adres pliku i nazwę linku.')
      editor.value
        .chain()
        .focus()
        .setTextSelection(selection)
        .insertContent({ type: 'file', attrs: { src: fields.url, name: fields.label.trim() } })
        .run()
    } else {
      if (!safeHref(fields.url))
        throw new Error('Podaj adres https://, e-mail lub ścieżkę zaczynającą się od /.')
      const chain = editor.value.chain().focus().setTextSelection(selection).extendMarkRange('link')
      if (selection.from === selection.to && fields.label.trim())
        chain
          .insertContent({
            type: 'text',
            text: fields.label.trim(),
            marks: [{ type: 'link', attrs: { href: fields.url } }],
          })
          .run()
      else chain.setLink({ href: fields.url }).run()
    }
    dialog.value?.close()
  } catch (error) {
    modalError.value = error instanceof Error ? error.message : 'Nie udało się wstawić treści.'
  }
}
async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 5000000) {
    modalError.value = 'Maksymalny rozmiar pliku to 5 MB.'
    return
  }
  uploading.value = true
  modalError.value = ''
  try {
    const data = new FormData()
    data.append('file', file)
    const result = await $fetch('/api/admin/media', { method: 'POST', body: data })
    fields.url = result.url
    if (mode.value === 'file' && !fields.label.trim()) fields.label = file.name
  } catch (error) {
    modalError.value = errorMessage(error)
  } finally {
    uploading.value = false
  }
}
function moveBlock(delta: number) {
  const current = editor.value
  if (!current) return
  const index = current.state.selection.$from.index(0),
    content = [...(current.getJSON().content || [])],
    target = index + delta
  if (target < 0 || target >= content.length) return
  ;[content[index], content[target]] = [content[target]!, content[index]!]
  current.commands.setContent({ type: 'doc', content })
  let position = 0
  for (let i = 0; i < target; i++) position += current.state.doc.child(i).nodeSize
  current.chain().focus().setNodeSelection(position).run()
}
</script>
<template>
  <div
    data-ui="rich-editor"
    class="relative rounded-card border border-solid border-[#35475b] bg-[#0d1620]"
  >
    <div
      data-ui="rich-toolbar"
      class="
        flex flex-wrap items-center gap-x-[13px] gap-y-[9px]
        rounded-[var(--radius-card)_var(--radius-card)_0_0] border-b [border-bottom-style:solid]
        border-b-[#2f4052] bg-[#182535] px-3.5 py-3 max-[760px]:gap-2 max-[760px]:p-2.5
        [&_[data-ui~='rich-tool-label']]:border-[#526d86]
        [&_[data-ui~='rich-tool-label']]:px-[11px]
        [&_[data-ui~='rich-tool-label']]:whitespace-nowrap
        [&_[data-ui~='rich-tool-label']]:text-primary [&_button]:inline-flex [&_button]:min-h-8.5
        [&_button]:items-center [&_button]:justify-center [&_button]:gap-[7px]
        [&_button]:rounded-control [&_button]:border [&_button]:border-solid
        [&_button]:border-transparent [&_button]:bg-transparent [&_button]:px-[9px]
        [&_button]:py-[7px] [&_button]:text-[12px] [&_button]:text-[#b7c7d8]
        [&_button:disabled]:cursor-default [&_button:disabled]:opacity-[0.35]
        [&_button:hover]:bg-[#263b51] [&_button:hover]:text-[#e4f1ff]
        [&_button[aria-pressed='true']]:border-[#56789a]
        [&_button[aria-pressed='true']]:bg-[#b5dcff22]
        [&_button[aria-pressed='true']]:text-primary [&_select]:m-0 [&_select]:h-8.5
        [&_select]:w-auto [&_select]:min-w-27.5 [&_select]:border-[#42566c]
        [&_select]:bg-[#101d2b] [&_select]:px-[9px] [&_select]:py-[7px] [&_select]:text-[12px]
      "
      role="toolbar"
      aria-label="Formatowanie tekstu"
    >
      <div
        data-ui="rich-tool-group"
        class="
          flex items-center gap-1 max-[760px]:flex-wrap
          [&_+_[data-ui~='rich-tool-group']]:border-l
          [&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          [&_+_[data-ui~='rich-tool-group']]:border-l-[#34475b]
          [&_+_[data-ui~='rich-tool-group']]:pl-3
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:border-l-0
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:pl-0
        "
      >
        <select
          :value="heading"
          aria-label="Styl akapitu"
          @change="formatHeading"
        >
          <option value="p">Akapit</option>
          <option
            v-for="level in [2, 3, 4, 5, 6]"
            :key="level"
            :value="level"
          >
            Nagłówek H{{ level }}
          </option>
        </select>
        <button
          type="button"
          aria-label="Pogrubienie"
          title="Pogrubienie · Ctrl+B"
          :aria-pressed="editor?.isActive('bold')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <AppIcon
            name="bold"
            :size="17"
          />
        </button>
        <button
          type="button"
          aria-label="Kursywa"
          title="Kursywa · Ctrl+I"
          :aria-pressed="editor?.isActive('italic')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <AppIcon
            name="italic"
            :size="17"
          />
        </button>
        <button
          type="button"
          aria-label="Podkreślenie"
          title="Podkreślenie · Ctrl+U"
          :aria-pressed="editor?.isActive('underline')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleUnderline().run()"
        >
          <Underline :size="17" />
        </button>
        <button
          type="button"
          aria-label="Wyróżnienie tekstu"
          title="Wyróżnij tekst"
          :aria-pressed="editor?.isActive('highlight')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleHighlight().run()"
        >
          <Highlighter :size="17" />
        </button>
      </div>
      <div
        data-ui="rich-tool-group"
        class="
          flex items-center gap-1 max-[760px]:flex-wrap
          [&_+_[data-ui~='rich-tool-group']]:border-l
          [&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          [&_+_[data-ui~='rich-tool-group']]:border-l-[#34475b]
          [&_+_[data-ui~='rich-tool-group']]:pl-3
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:border-l-0
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:pl-0
        "
      >
        <button
          type="button"
          aria-label="Lista punktowana"
          title="Lista punktowana"
          :aria-pressed="editor?.isActive('bulletList')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <AppIcon
            name="list"
            :size="18"
          />
        </button>
        <button
          type="button"
          aria-label="Lista numerowana"
          title="Lista numerowana"
          :aria-pressed="editor?.isActive('orderedList')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <ListOrdered :size="18" />
        </button>
        <button
          type="button"
          aria-label="Lista zadań"
          title="Lista zadań"
          :aria-pressed="editor?.isActive('taskList')"
          @mousedown.prevent
          @click="editor?.chain().focus().toggleTaskList().run()"
        >
          <ListTodo :size="18" />
        </button>
        <button
          type="button"
          aria-label="Wstaw link"
          title="Wstaw lub edytuj link"
          :aria-pressed="editor?.isActive('link')"
          @click="open('link')"
        >
          <Link2 :size="17" />
        </button>
        <button
          type="button"
          aria-label="Wstaw zdjęcie"
          title="Wstaw zdjęcie lub edytuj podpis"
          :aria-pressed="editor?.isActive('image')"
          @click="open('image')"
        >
          <AppIcon
            name="image"
            :size="18"
          />
        </button>
      </div>
      <div
        data-ui="rich-tool-group rich-tool-actions"
        class="
          ml-auto flex items-center gap-1 max-[760px]:ml-0 max-[760px]:flex-wrap
          [&_+_[data-ui~='rich-tool-group']]:border-l
          [&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          [&_+_[data-ui~='rich-tool-group']]:border-l-[#34475b]
          [&_+_[data-ui~='rich-tool-group']]:pl-3
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:border-l-0
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:[border-left-style:solid]
          max-[760px]:[&_+_[data-ui~='rich-tool-group']]:pl-0
        "
      >
        <button
          type="button"
          data-ui="rich-tool-label"
          :aria-expanded="blockMenu"
          aria-controls="rich-block-menu"
          @click="blockMenu = !blockMenu"
        >
          <AppIcon
            name="plus"
            :size="15"
          />
          Wstaw blok
        </button>
        <button
          type="button"
          aria-label="Cofnij"
          title="Cofnij · Ctrl+Z"
          :disabled="!editor?.can().undo()"
          @mousedown.prevent
          @click="editor?.chain().focus().undo().run()"
        >
          <Undo2 :size="17" />
        </button>
        <button
          type="button"
          aria-label="Ponów"
          title="Ponów · Ctrl+Shift+Z"
          :disabled="!editor?.can().redo()"
          @mousedown.prevent
          @click="editor?.chain().focus().redo().run()"
        >
          <Redo2 :size="17" />
        </button>
      </div>
    </div>
    <div
      v-if="blockMenu"
      id="rich-block-menu"
      data-ui="rich-block-menu"
      class="border-b [border-bottom-style:solid] border-b-[#3c536a] bg-[#122030] p-4.5 max-[760px]:p-[15px]"
      role="group"
      aria-label="Wyróżnienia i bloki"
    >
      <div
        data-ui="rich-block-menu-heading"
        class="
          mb-[15px] flex items-center justify-between gap-3 text-[13px] text-[#d4e3f3]
          [&_button]:rounded-[6px] [&_button]:p-[5px]
        "
      >
        <strong>Wyróżnienia w tekście</strong>
        <button
          type="button"
          aria-label="Zamknij wybór bloków"
          @click="blockMenu = false"
        >
          <AppIcon
            name="close"
            :size="16"
          />
        </button>
      </div>
      <div
        data-ui="rich-block-grid"
        class="grid grid-cols-2 gap-2 max-[760px]:grid-cols-1"
      >
        <button
          class="
            [&.rich-block-option]:flex [&.rich-block-option]:items-start
            [&.rich-block-option]:gap-[11px] [&.rich-block-option]:rounded-control
            [&.rich-block-option]:border [&.rich-block-option]:border-solid
            [&.rich-block-option]:border-[#364b61] [&.rich-block-option]:bg-[#18293c]
            [&.rich-block-option]:p-3 [&.rich-block-option]:text-left
            [&.rich-block-option]:text-primary [&.rich-block-option_span_>_small]:mt-1
            [&.rich-block-option_span_>_small]:block
            [&.rich-block-option_span_>_small]:text-[10px]
            [&.rich-block-option_span_>_small]:leading-[1.6]
            [&.rich-block-option_span_>_small]:text-[#a7b9cd] [&.rich-block-option_strong]:block
            [&.rich-block-option_strong]:text-[12px]
            [&.rich-block-option_strong]:[font-weight:650]
            [&.rich-block-option_strong_>_small]:ml-[5px]
            [&.rich-block-option_strong_>_small]:text-[8px]
            [&.rich-block-option_strong_>_small]:font-medium
            [&.rich-block-option_strong_>_small]:opacity-[0.65]
            [&.rich-block-option_svg]:shrink-0 [&.rich-block-option:hover]:border-[#7195b8]
            [&.rich-block-option:hover]:bg-[#20344a]
          "
          v-for="kind in alertTypes"
          :key="kind"
          type="button"
          :class="`rich-block-option rich-block-option-${kind}`"
          :aria-label="`Wstaw blok: ${calloutMeta[kind].label}`"
          @mousedown.prevent
          @click="callout(kind)"
        >
          <svg
            viewBox="0 0 24 24"
            width="21"
            height="21"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path :d="calloutMeta[kind].icon" />
          </svg>
          <span>
            <strong>
              {{ calloutMeta[kind].label }}
              <small>{{ kind.toUpperCase() }}</small>
            </strong>
            <small>{{ calloutMeta[kind].description }}</small>
          </span>
        </button>
      </div>
      <div
        data-ui="rich-extra-blocks"
        class="
          mt-3.5 flex flex-wrap gap-[7px] [&_button]:inline-flex [&_button]:min-h-8.5
          [&_button]:items-center [&_button]:justify-center [&_button]:gap-[7px]
          [&_button]:rounded-control [&_button]:border [&_button]:border-solid
          [&_button]:border-[#3d5269] [&_button]:bg-transparent [&_button]:px-[9px]
          [&_button]:py-[7px] [&_button]:text-[12px] [&_button]:text-[#b7c7d8]
          [&_button:hover]:bg-[#263b51] [&_button:hover]:text-[#e4f1ff]
        "
      >
        <button
          type="button"
          @mousedown.prevent
          @click="insertBlock('quote')"
        >
          <Quote :size="17" />
          Cytat
        </button>
        <button
          type="button"
          @mousedown.prevent
          @click="insertBlock('code')"
        >
          <SquareCode :size="17" />
          Kod
        </button>
        <button
          type="button"
          @mousedown.prevent
          @click="insertBlock('table')"
        >
          <Table2 :size="17" />
          Tabela
        </button>
        <button
          type="button"
          @click="open('file')"
        >
          <Paperclip :size="17" />
          Plik / link
        </button>
        <button
          type="button"
          @mousedown.prevent
          @click="insertBlock('separator')"
        >
          <AppIcon
            name="minus"
            :size="17"
          />
          Separator
        </button>
      </div>
    </div>
    <div
      data-ui="rich-secondary-toolbar"
      class="
        flex items-center justify-between px-[17px] py-2.5 text-[11px] text-[#8fa5bc]
        [&_button]:inline-flex [&_button]:items-center [&_button]:gap-[7px]
        [&_button]:text-[#b4c9df]
      "
    >
      <button
        type="button"
        :aria-expanded="more"
        @click="more = !more"
      >
        Więcej formatowania
        <AppIcon
          :name="more ? 'minus' : 'plus'"
          :size="13"
        />
      </button>
      <span>{{ words }} słów</span>
    </div>
    <div
      v-if="more"
      data-ui="rich-extra-tools"
      class="
        flex flex-wrap gap-[5px] border-b [border-bottom-style:solid] border-b-[#2b4055]
        px-[13px] pt-2 pb-[13px] [&_button]:inline-flex [&_button]:min-h-8.5
        [&_button]:items-center [&_button]:justify-center [&_button]:gap-[7px]
        [&_button]:rounded-control [&_button]:border [&_button]:border-solid
        [&_button]:border-transparent [&_button]:bg-transparent [&_button]:px-[9px]
        [&_button]:py-[7px] [&_button]:text-[11px] [&_button]:text-[#b7c7d8]
        [&_button:hover]:bg-[#263b51] [&_button:hover]:text-[#e4f1ff]
        [&_button[aria-pressed='true']]:border-[#56789a]
        [&_button[aria-pressed='true']]:bg-[#b5dcff22]
        [&_button[aria-pressed='true']]:text-primary
      "
      role="toolbar"
      aria-label="Dodatkowe formatowanie"
    >
      <button
        type="button"
        :aria-pressed="editor?.isActive('strike')"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <Strikethrough :size="16" />
        Przekreślenie
      </button>
      <button
        type="button"
        :aria-pressed="editor?.isActive('code')"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleCode().run()"
      >
        <AppIcon
          name="code"
          :size="16"
        />
        Kod w tekście
      </button>
      <button
        type="button"
        :aria-pressed="editor?.isActive('kbd')"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleMark('kbd').run()"
      >
        <Keyboard :size="16" />
        Klawisz
      </button>
      <button
        type="button"
        :aria-pressed="editor?.isActive('subscript')"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleSubscript().run()"
      >
        <Subscript :size="16" />
        Indeks dolny
      </button>
      <button
        type="button"
        :aria-pressed="editor?.isActive('superscript')"
        @mousedown.prevent
        @click="editor?.chain().focus().toggleSuperscript().run()"
      >
        <Superscript :size="16" />
        Indeks górny
      </button>
      <button
        type="button"
        @click="open('markdown')"
      >
        <AppIcon
          name="file"
          :size="16"
        />
        Wstaw Markdown
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="moveBlock(-1)"
      >
        <ArrowUp :size="16" />
        Blok w górę
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="moveBlock(1)"
      >
        <ArrowDown :size="16" />
        Blok w dół
      </button>
    </div>
    <div
      v-if="editor?.isActive('callout')"
      data-ui="rich-context-panel"
      class="
        flex flex-wrap [align-items:end] gap-4 border-t border-b [border-top-style:solid]
        [border-bottom-style:solid] border-t-[#3b536b] border-b-[#3b536b] bg-[#172739] px-4.5
        py-[15px] [&_>_[data-ui~='text-link']]:mb-[11px] [&_>_[data-ui~='text-link']]:text-[11px]
        [&_>_span]:mb-2.5 [&_>_span]:max-w-[220px] [&_>_span]:text-[11px]
        [&_>_span]:leading-[1.6] [&_>_span]:text-[#98acc2] [&_input]:mx-0 [&_input]:mt-[7px]
        [&_input]:mb-0 [&_input]:min-h-9 [&_input]:px-[11px]! [&_input]:py-[9px]!
        [&_input]:text-[12px]! [&_label]:m-0! [&_label]:min-w-[180px] [&_label]:flex-1
        [&_label]:text-[11px] [&_label]:text-[#a7bdd5] [&_label_>_span]:text-[#8197ae]
        [&_select]:mx-0 [&_select]:mt-[7px] [&_select]:mb-0 [&_select]:min-h-9
        [&_select]:px-[11px]! [&_select]:py-[9px]! [&_select]:text-[12px]!
      "
    >
      <label>
        Rodzaj wyróżnienia
        <select
          :value="editor.getAttributes('callout').kind"
          @change="callout(($event.target as HTMLSelectElement).value as AlertKind)"
        >
          <option
            v-for="kind in alertTypes"
            :key="kind"
            :value="kind"
          >
            {{ calloutMeta[kind].label }} / {{ kind.toUpperCase() }}
          </option>
        </select>
      </label>
      <label>
        Własny nagłówek
        <span>opcjonalnie</span>
        <input
          :value="editor.getAttributes('callout').title"
          :placeholder="calloutMeta[editor.getAttributes('callout').kind as AlertKind]?.label"
          maxlength="120"
          @input="
            editor.commands.updateAttributes('callout', {
              title: ($event.target as HTMLInputElement).value,
            })
          "
        />
      </label>
      <button
        type="button"
        data-ui="text-link"
        class="
          inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
          px-0 py-3 text-[12px] font-medium text-ink
          [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @mousedown.prevent
        @click="editor.chain().focus().lift('callout').run()"
      >
        Zmień na zwykły tekst
      </button>
    </div>
    <div
      v-if="editor?.isActive('codeBlock')"
      data-ui="rich-context-panel"
      class="
        flex flex-wrap [align-items:end] gap-4 border-t border-b [border-top-style:solid]
        [border-bottom-style:solid] border-t-[#3b536b] border-b-[#3b536b] bg-[#172739] px-4.5
        py-[15px] [&_>_[data-ui~='text-link']]:mb-[11px] [&_>_[data-ui~='text-link']]:text-[11px]
        [&_>_span]:mb-2.5 [&_>_span]:max-w-[220px] [&_>_span]:text-[11px]
        [&_>_span]:leading-[1.6] [&_>_span]:text-[#98acc2] [&_input]:mx-0 [&_input]:mt-[7px]
        [&_input]:mb-0 [&_input]:min-h-9 [&_input]:px-[11px]! [&_input]:py-[9px]!
        [&_input]:text-[12px]! [&_label]:m-0! [&_label]:min-w-[180px] [&_label]:flex-1
        [&_label]:text-[11px] [&_label]:text-[#a7bdd5] [&_label_>_span]:text-[#8197ae]
        [&_select]:mx-0 [&_select]:mt-[7px] [&_select]:mb-0 [&_select]:min-h-9
        [&_select]:px-[11px]! [&_select]:py-[9px]! [&_select]:text-[12px]!
      "
    >
      <label>
        Język kodu
        <select
          :value="editor.getAttributes('codeBlock').language || 'text'"
          @change="
            editor.commands.updateAttributes('codeBlock', {
              language: ($event.target as HTMLSelectElement).value,
            })
          "
        >
          <option
            v-for="language in [
              'text',
              'javascript',
              'typescript',
              'html',
              'vue',
              'css',
              'json',
              'bash',
              'sql',
              'python',
              'php',
            ]"
            :key="language"
            :value="language"
          >
            {{ language }}
          </option>
        </select>
      </label>
      <span>Wstaw kod. Kolory składni zobaczysz także na blogu.</span>
    </div>
    <div
      v-if="editor?.isActive('table')"
      data-ui="rich-table-tools"
      class="
        flex flex-wrap gap-[5px] border-b [border-bottom-style:solid] border-b-[#2b4055]
        bg-[#182638] px-[13px] py-2.5 [&_button]:inline-flex [&_button]:min-h-8.5
        [&_button]:items-center [&_button]:justify-center [&_button]:gap-[7px]
        [&_button]:rounded-control [&_button]:border [&_button]:border-solid
        [&_button]:border-transparent [&_button]:bg-transparent [&_button]:px-[9px]
        [&_button]:py-[7px] [&_button]:text-[12px] [&_button]:text-[#b7c7d8]
        [&_button:hover]:bg-[#263b51] [&_button:hover]:text-[#e4f1ff]
      "
      role="toolbar"
      aria-label="Narzędzia tabeli"
    >
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().addRowAfter().run()"
      >
        + Wiersz
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().addColumnAfter().run()"
      >
        + Kolumna
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().deleteRow().run()"
      >
        − Wiersz
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().deleteColumn().run()"
      >
        − Kolumna
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().mergeOrSplit().run()"
      >
        Scal / podziel
      </button>
      <button
        v-for="align in ['left', 'center', 'right']"
        :key="align"
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().setCellAttribute('textAlign', align).run()"
      >
        {{ { left: 'Do lewej', center: 'Środek', right: 'Do prawej' }[align] }}
      </button>
      <button
        type="button"
        @mousedown.prevent
        @click="editor.chain().focus().deleteTable().run()"
      >
        Usuń tabelę
      </button>
    </div>
    <EditorContent :editor="editor" />
    <p
      data-ui="rich-editor-help"
      class="
        m-0 rounded-[0_0_var(--radius-card)_var(--radius-card)] border-t [border-top-style:solid]
        border-t-[#2e4359] bg-[#122030] px-4.5 py-3 text-[10px] leading-[1.7] text-[#8fa6be]
      "
    >
      Zaznacz tekst, aby go sformatować. Blok wyróżnienia wstawisz w miejscu kursora. Ctrl / ⌘ + Z
      cofa zmianę.
    </p>
    <dialog
      ref="dialog"
      data-ui="rich-editor-dialog"
      class="
        m-auto max-h-[calc(100dvh_-_30px)] w-[min(580px,_calc(100vw_-_30px))] overflow-y-auto
        rounded-feature border border-solid border-[#46627f] bg-[#111d2b] p-7 text-[#e7eef7]
        shadow-[var(--shadow-float)] max-[760px]:p-5.5 [&_form]:grid [&_form]:gap-[19px]
        [&_form_>_p]:text-[12px] [&_form_>_p]:leading-[1.7] [&_form_>_p]:text-[#a7bbd2]
        [&_input]:mx-0 [&_input]:mt-2 [&_input]:mb-0 [&_input]:border [&_input]:border-solid
        [&_input]:border-[#405a76] [&_input]:bg-[#0c1724] [&_input]:text-[13px]!
        [&_label]:text-[12px] [&_label]:text-[#b5c8df] [&_label_span]:text-[10px]
        [&_label_span]:text-[#8fa8c4] [&_small]:mt-[7px] [&_small]:block [&_small]:text-[10px]
        [&_small]:text-[#8fa8c4] [&_textarea]:mx-0 [&_textarea]:mt-2 [&_textarea]:mb-0
        [&_textarea]:border [&_textarea]:border-solid [&_textarea]:border-[#405a76]
        [&_textarea]:bg-[#0c1724] [&_textarea]:text-[13px]! [&::backdrop]:bg-[#03070cbd]
        [&::backdrop]:[backdrop-filter:blur(4px)]
      "
      aria-labelledby="rich-dialog-title"
      @close="modalError = ''"
    >
      <div
        data-ui="rich-dialog-heading"
        class="
          mb-5 flex items-center justify-between gap-[15px] [&_button]:rounded-[8px]
          [&_button]:p-1.5 [&_h2]:m-0 [&_h2]:text-[24px] [&_h2]:tracking-[-0.03em]
        "
      >
        <h2 id="rich-dialog-title">
          {{
            mode === 'image'
              ? editingImage
                ? 'Edytuj zdjęcie'
                : 'Wstaw zdjęcie'
              : mode === 'markdown'
                ? 'Wstaw Markdown'
                : mode === 'file'
                  ? 'Wstaw plik'
                  : 'Wstaw link'
          }}
        </h2>
        <button
          type="button"
          aria-label="Zamknij okno edytora"
          :disabled="uploading"
          @click="dialog?.close()"
        >
          <AppIcon name="close" />
        </button>
      </div>
      <form @submit.prevent="applyDialog">
        <template v-if="mode === 'markdown'">
          <p>
            Tekst zostanie dodany w miejscu kursora. Obsługiwane są także wyróżnienia
            <code>&gt; [!TIP]</code>
            , tabele i listy zadań.
          </p>
          <label>
            Treść Markdown
            <textarea
              v-model="fields.markdown"
              rows="9"
              required
              maxlength="80000"
            />
          </label>
        </template>
        <template v-else>
          <label
            v-if="mode === 'image'"
            data-ui="rich-image-upload"
            class="
              rounded-control border border-dashed border-[#536f8d] bg-[#17273a] p-4.5
              [&_input]:mt-1.5 [&_input]:max-w-full [&_input]:border-0 [&_input]:border-solid
              [&_input]:px-0! [&_input]:py-2!
            "
          >
            {{ uploading ? 'Wgrywam zdjęcie…' : 'Wgraj zdjęcie JPG, PNG lub WebP' }}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              :disabled="uploading"
              @change="upload"
            />
            <small>Do 5 MB. Możesz też podać adres zdjęcia poniżej.</small>
          </label>
          <label
            v-if="mode === 'file'"
            data-ui="rich-image-upload"
            class="
              rounded-control border border-dashed border-[#536f8d] bg-[#17273a] p-4.5
              [&_input]:mt-1.5 [&_input]:max-w-full [&_input]:border-0 [&_input]:border-solid
              [&_input]:px-0! [&_input]:py-2!
            "
          >
            {{ uploading ? 'Wgrywam plik…' : 'Wgraj dokument PDF' }}
            <input
              type="file"
              accept="application/pdf,.pdf"
              :disabled="uploading"
              @change="upload"
            />
            <small>
              Do 5 MB. Możesz też podać adres pliku poniżej. Załącznik będzie dostępny dla
              czytelników po publikacji wpisu.
            </small>
          </label>
          <label>
            {{
              mode === 'image' ? 'Adres zdjęcia' : mode === 'file' ? 'Adres pliku' : 'Adres linku'
            }}
            <input
              v-model="fields.url"
              type="text"
              placeholder="https://…"
              maxlength="2048"
              required
            />
          </label>
          <template v-if="mode === 'image'">
            <label>
              Opis alternatywny
              <span>*</span>
              <input
                v-model="fields.alt"
                placeholder="Co przedstawia zdjęcie?"
                maxlength="300"
                required
              />
              <small>Opis dla czytników ekranu i wyszukiwarek.</small>
            </label>
            <label>
              Podpis pod zdjęciem
              <span>opcjonalnie</span>
              <input
                v-model="fields.caption"
                maxlength="500"
                placeholder="Podpis lub źródło zdjęcia"
              />
            </label>
          </template>
          <label v-else>
            {{
              mode === 'file'
                ? 'Nazwa pliku / tekst linku'
                : 'Tekst linku, jeśli nic nie zaznaczono'
            }}
            <input
              v-model="fields.label"
              maxlength="200"
              :required="mode === 'file'"
              placeholder="Czytelna nazwa"
            />
          </label>
        </template>
        <p
          v-if="modalError"
          data-ui="form-error"
          class="
            rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
            text-[11px] text-[#ffc0c0]
          "
          role="alert"
        >
          {{ modalError }}
        </p>
        <div
          data-ui="rich-dialog-actions"
          class="
            mt-[5px] flex items-center justify-between gap-3 max-[760px]:flex-wrap
            [&_[data-ui~='button']]:px-4.5 [&_[data-ui~='button']]:py-3
            [&_[data-ui~='button']]:text-[12px]
          "
        >
          <button
            type="button"
            data-ui="button button-outline"
            class="
              inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
              border-solid border-[#475362] bg-transparent px-6 py-[15px] text-[12px] font-bold
              whitespace-nowrap text-ink
              [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
              pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
              pointer-hover:hover:text-primary
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
            :disabled="uploading"
            @click="dialog?.close()"
          >
            Anuluj
          </button>
          <button
            v-if="mode === 'link' && editor?.isActive('link')"
            type="button"
            data-ui="text-link"
            class="
              inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
              px-0 py-3 text-[12px] font-medium text-ink
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
            @click="removeLink"
          >
            <Unlink2 :size="15" />
            Usuń link
          </button>
          <button
            type="submit"
            data-ui="button"
            class="
              inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
              border-solid border-primary bg-primary px-6 py-[15px] text-[12px] font-bold
              whitespace-nowrap text-[#111b27]
              [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
              pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
            :disabled="uploading"
          >
            {{ mode === 'image' && editingImage ? 'Zapisz zdjęcie' : 'Wstaw' }}
            <AppIcon
              name="right"
              :size="16"
            />
          </button>
        </div>
      </form>
    </dialog>
  </div>
</template>
