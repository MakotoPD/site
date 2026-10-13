<script setup lang="ts">
import type { Post } from '#shared/types'
import { emptyDocument, normalizeRichDocument, richText, type RichNode } from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
import { renderRichDocument } from '#shared/rich-render'
definePageMeta({ layout: 'admin', middleware: 'admin' })
const route = useRoute(),
  id = ref(String(route.params.id)),
  isNew = computed(() => id.value === 'nowy')
const state = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  document: emptyDocument() as RichNode,
  category: 'Warsztat',
  cover: '',
  status: 'draft' as Post['status'],
})
const pending = ref(false),
  uploading = ref(false),
  dirty = ref(false),
  preview = ref(false),
  error = ref(''),
  saved = ref('')
const confirm = ref<HTMLDialogElement | null>(null),
  toast = useToast()
if (!isNew.value) {
  const post = await useRequestFetch()(`/api/admin/posts/${id.value}`)
  Object.assign(state, post, {
    document: post.document || normalizeRichDocument(markdownToDocument(post.content)),
  })
}
useHead({ title: () => `${isNew.value ? 'Nowy wpis' : state.title} — Makoto Studio` })
const html = computed(() => renderRichDocument(state.document))
const words = computed(() => richText(state.document).trim().split(/\s+/).filter(Boolean).length)
let automaticSlug = isNew.value
watch(
  () => state.title,
  (title) => {
    if (automaticSlug)
      state.slug = title
        .replace(/[łŁ]/g, 'l')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
  },
)
watch(
  state,
  () => {
    dirty.value = true
    saved.value = ''
  },
  { deep: true },
)
async function save(status?: Post['status']) {
  if (pending.value) return
  pending.value = true
  error.value = ''
  const previousStatus = state.status
  if (status) state.status = status
  try {
    const document = normalizeRichDocument(state.document)
    const post = await $fetch<Post>(
      isNew.value ? '/api/admin/posts' : `/api/admin/posts/${id.value}`,
      {
        method: isNew.value ? 'POST' : 'PUT',
        body: {
          title: state.title,
          slug: state.slug,
          excerpt: state.excerpt,
          document,
          category: state.category,
          cover: state.cover,
          status: state.status,
        },
      },
    )
    id.value = post.id
    automaticSlug = false
    await nextTick()
    dirty.value = false
    saved.value =
      'Zapisano ' + new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    toast.show(state.status === 'published' ? 'Wpis opublikowany na blogu.' : 'Szkic zapisany.')
    if (route.params.id === 'nowy') await navigateTo(`/admin/blog/${post.id}`, { replace: true })
  } catch (e) {
    state.status = previousStatus
    error.value =
      e instanceof Error && !(e as { data?: unknown }).data ? e.message : errorMessage(e)
  } finally {
    pending.value = false
  }
}
async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const data = new FormData()
    data.append('file', file)
    const result = await $fetch('/api/admin/media', { method: 'POST', body: data })
    state.cover = result.url
    toast.show('Okładka dodana.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    uploading.value = false
  }
}
async function remove() {
  pending.value = true
  try {
    await $fetch(`/api/admin/posts/${id.value}`, { method: 'DELETE' })
    dirty.value = false
    confirm.value?.close()
    await navigateTo('/admin/blog')
    toast.show('Wpis usunięty.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    pending.value = false
  }
}
onBeforeRouteLeave(() => !dirty.value || window.confirm('Masz niezapisane zmiany. Opuścić edytor?'))
function beforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
</script>
<template>
  <div>
    <NuxtLink
      to="/admin/blog"
      data-ui="text-link editor-back"
      class="
        mb-5 inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
        px-0 pt-0 pb-3 text-[9px] font-medium text-ink
        [&_svg]:[transition:transform_0.25s_var(--ease-out)]
        pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
      "
    >
      <AppIcon
        name="left"
        :size="15"
      />
      Wszystkie wpisy
    </NuxtLink>
    <div
      data-ui="admin-page-heading"
      class="
        mb-[35px] flex items-center justify-between gap-5 max-[760px]:mb-[27px]
        max-[760px]:flex-wrap max-[760px]:items-start max-[760px]:gap-5.5
        max-[760px]:[&_>_[data-ui~='button']]:min-h-10 [&_[data-ui~='eyebrow']]:mb-4
        [&_[data-ui~='eyebrow']]:text-[8px] max-[760px]:[&_[data-ui~='eyebrow']]:mb-3.5
        [&_h1]:text-[40px] [&_h1]:font-medium [&_h1]:tracking-[-0.04em]
        max-[960px]:[&_h1]:text-[33px] max-[760px]:[&_h1]:text-[33px]
        [&_p:not([data-ui~='eyebrow'])]:mt-3 [&_p:not([data-ui~='eyebrow'])]:text-[10px]
        [&_p:not([data-ui~='eyebrow'])]:text-[#7e94b0]
        max-[760px]:[&_p:not([data-ui~='eyebrow'])]:text-[10px]
      "
    >
      <div>
        <h1>
          {{ isNew ? 'Nowa historia' : 'Edytuj historię' }}
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>{{ saved || (dirty ? 'Masz niezapisane zmiany.' : 'Twój warsztat, Twoje słowa.') }}</p>
      </div>
      <div
        data-ui="editor-actions"
        class="
          flex gap-3 max-[960px]:gap-2 max-[760px]:w-full max-[760px]:justify-between
          max-[960px]:[&_[data-ui~='button']]:gap-2 max-[960px]:[&_[data-ui~='button']]:px-3
          max-[960px]:[&_[data-ui~='button']]:text-[10px]
          max-[760px]:[&_[data-ui~='button']]:px-4.5
          max-[760px]:[&_[data-ui~='button']]:text-[10px]
        "
      >
        <button
          data-ui="button button-outline button-small"
          class="
            inline-flex min-h-10.5 items-center justify-center gap-6 rounded-control border
            border-solid border-[#475362] bg-transparent px-4.5 py-[11px] text-[11px] font-bold
            whitespace-nowrap text-ink
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
            pointer-hover:hover:text-primary [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          :disabled="pending"
          @click="save('draft')"
        >
          {{ state.status === 'published' ? 'Zmień na szkic' : 'Zapisz szkic' }}
        </button>
        <button
          data-ui="button button-small"
          class="
            inline-flex min-h-10.5 items-center justify-center gap-6 rounded-control border
            border-solid border-primary bg-primary px-4.5 py-[11px] text-[11px] font-bold
            whitespace-nowrap text-[#111b27]
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          :disabled="pending"
          @click="save('published')"
        >
          <AppIcon
            class="[&.spin]:animate-spin"
            :name="pending ? 'loading' : 'send'"
            :size="15"
            :class="{ spin: pending }"
          />
          {{ state.status === 'published' ? 'Zapisz publikację' : 'Opublikuj' }}
        </button>
      </div>
    </div>
    <p
      v-if="error"
      data-ui="form-error editor-error"
      class="
        mb-[25px] rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
        text-[11px] text-[#ffc0c0]
      "
      role="alert"
    >
      {{ error }}
    </p>
    <div
      data-ui="editor-layout"
      class="
        grid grid-cols-[1fr_285px] [align-items:start] gap-[25px]
        max-[1200px]:grid-cols-[1fr_250px] max-[1200px]:gap-5 max-[960px]:grid-cols-1
      "
    >
      <section
        data-ui="admin-panel editor-main"
        class="
          overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823] p-[27px]
          max-[1200px]:p-[23px] max-[760px]:p-5 [&_>_label]:mb-[27px] [&_>_label]:text-[10px]
        "
      >
        <label>
          Tytuł wpisu
          <input
            v-model="state.title"
            data-ui="editor-title"
            class="py-4! text-[23px]! tracking-[-0.03em] max-[760px]:text-[21px]! [&::placeholder]:text-[15px]"
            placeholder="Masz coś dobrego do opowiedzenia?"
            maxlength="180"
            minlength="3"
            required
          />
        </label>
        <label>
          Krótki opis
          <textarea
            v-model="state.excerpt"
            rows="3"
            placeholder="Dwa zdania, które zachęcą do czytania…"
            maxlength="400"
            required
          />
        </label>
        <div
          data-ui="markdown-heading rich-editor-heading"
          class="
            mb-2.5 flex items-center justify-between text-[10px] text-[#a5bedb]
            max-[760px]:flex-wrap max-[760px]:gap-3 [&_>_span]:flex [&_>_span]:items-center
            [&_>_span]:gap-3 [&_>_span]:text-[13px] max-[760px]:[&_>_span]:flex-wrap
            max-[760px]:[&_>_span]:gap-2 [&_[data-ui~='text-link']]:text-[12px]
            [&_small]:text-[10px] [&_small]:font-normal [&_small]:text-[#91a9c3]
          "
        >
          <span>
            Treść wpisu
            <small>Tiptap · {{ words }} słów</small>
          </span>
          <button
            type="button"
            data-ui="text-link"
            class="
              inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
              px-0 py-3 text-[12px] font-medium text-ink
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
            :aria-pressed="preview"
            @click="preview = !preview"
          >
            <AppIcon
              :name="preview ? 'edit' : 'eye'"
              :size="15"
            />
            {{ preview ? 'Wróć do pisania' : 'Podgląd artykułu' }}
          </button>
        </div>
        <div v-show="!preview">
          <ClientOnly>
            <RichTextEditor
              v-model="state.document"
              @error="error = $event"
            />
            <template #fallback>
              <div
                data-ui="rich-editor-loading"
                class="
                  grid min-h-[480px] place-items-center rounded-card border border-solid
                  border-[#35475b] text-[13px] text-[#91acc9]
                "
              >
                Ładowanie edytora…
              </div>
            </template>
          </ClientOnly>
        </div>
        <div
          v-if="preview"
          data-ui="prose rich-content rich-article-preview"
          class="
            prose rich-content min-h-[480px] rounded-card border border-solid border-[#34485d]
            bg-background p-6.5 max-[760px]:px-[17px] max-[760px]:py-[21px]
            max-[760px]:text-[14px]
          "
          v-html="html"
        />
        <p
          data-ui="editor-footnote"
          class="mt-[15px] text-[8px] text-[#5e7da3]"
        >
          Tytuł jest nagłówkiem H1. W treści używaj H2–H6. Wyróżnienia, zdjęcia i tabele zobaczysz
          również w podglądzie.
        </p>
      </section>
      <aside
        data-ui="editor-aside"
        class="
          grid gap-5 max-[960px]:grid-cols-2 max-[760px]:grid-cols-1
          [&_>_[data-ui~='admin-panel']]:p-[23px] max-[1200px]:[&_>_[data-ui~='admin-panel']]:p-5
          [&_>_[data-ui~='text-link']]:mt-0
          max-[960px]:[&_>_[data-ui~='text-link']]:[grid-column:1/-1]
          [&_[data-ui~='text-link']]:mt-[15px] [&_[data-ui~='text-link']]:text-[9px]
          [&_h2]:mb-[23px] [&_h2]:text-[14px] [&_label]:mt-[21px] [&_label]:text-[9px]
          [&_label_>_small]:mt-2.5 [&_label_>_small]:block [&_label_>_small]:text-[8px]
          [&_label_>_small]:[overflow-wrap:anywhere] [&_label_>_small]:text-[#657fa0]
        "
      >
        <section
          data-ui="admin-panel"
          class="overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]"
        >
          <h2>Ustawienia wpisu</h2>
          <label>
            Adres wpisu
            <input
              v-model="state.slug"
              @input="automaticSlug = false"
              placeholder="tytul-twojego-wpisu"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              maxlength="180"
            />
            <small>/blog/{{ state.slug || 'twoj-wpis' }}</small>
          </label>
          <label>
            Kategoria
            <input
              v-model="state.category"
              placeholder="Warsztat"
              maxlength="60"
              list="categories"
            />
            <datalist id="categories">
              <option>Warsztat</option>
              <option>Design</option>
              <option>Proces</option>
              <option>Nuxt</option>
              <option>Produkty</option>
            </datalist>
          </label>
          <div
            data-ui="editor-status"
            class="mt-7 flex items-center justify-between text-[10px] text-[#7794b7]"
          >
            <span>Status</span>
            <span
              data-ui="badge"
              class="
                rounded-full border border-solid border-[#3c4d63] bg-[#233045] px-[9px] py-[5px]
                text-[8px] whitespace-nowrap text-[#a1b9d4] [&.badge-draft]:border-[#3a4a5d]
                [&.badge-draft]:bg-[#1b2839] [&.badge-draft]:text-[#95aac2]
                [&.badge-won]:border-[#3c725c] [&.badge-won]:bg-[#193629]
                [&.badge-won]:text-[#b1e8d2]
              "
              :class="state.status === 'published' ? 'badge-won' : 'badge-draft'"
            >
              {{ state.status === 'published' ? 'Opublikowany' : 'Szkic' }}
            </span>
          </div>
          <NuxtLink
            v-if="!isNew && state.status === 'published'"
            :to="`/blog/${state.slug}`"
            target="_blank"
            data-ui="text-link"
            class="
              inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
              px-0 py-3 text-[12px] font-medium text-ink
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
          >
            Zobacz na stronie
            <AppIcon
              name="external"
              :size="15"
            />
          </NuxtLink>
        </section>
        <section
          data-ui="admin-panel"
          class="overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]"
        >
          <h2>Okładka</h2>
          <img
            v-if="state.cover"
            :src="state.cover"
            alt="Okładka wpisu"
            data-ui="cover-preview"
            class="mb-3.5 [aspect-ratio:1.6] w-full rounded-control object-cover"
          />
          <label
            data-ui="upload-control"
            class="
              relative mt-0! flex cursor-pointer flex-col items-center gap-3 rounded-control
              border border-dashed border-[#3f5e83] bg-[#17273d] px-2.5 py-7.5 [&_>_small]:mt-0!
              [&_>_small]:text-[8px] [&_>_span]:text-[10px] [&_>_svg]:text-[#8cb9e8]
              [&_input]:absolute [&_input]:top-0 [&_input]:right-0 [&_input]:bottom-0
              [&_input]:left-0 [&_input]:m-0! [&_input]:h-full [&_input]:cursor-pointer
              [&_input]:opacity-[0]
            "
          >
            <AppIcon
              class="[&.spin]:animate-spin"
              :name="uploading ? 'loading' : 'image'"
              :class="{ spin: uploading }"
              :size="22"
            />
            <span>
              {{ uploading ? 'Wgrywanie…' : state.cover ? 'Zmień okładkę' : 'Dodaj zdjęcie' }}
            </span>
            <small>JPG, PNG, WebP · do 5 MB</small>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              :disabled="uploading"
              @change="upload"
            />
          </label>
          <button
            v-if="state.cover"
            data-ui="text-link"
            class="
              inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
              px-0 py-3 text-[12px] font-medium text-ink
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
            @click="state.cover = ''"
          >
            Usuń okładkę
            <AppIcon
              name="close"
              :size="13"
            />
          </button>
        </section>
        <section
          data-ui="admin-panel rich-editor-aside-help"
          class="
            overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]
            [&_>_svg]:mb-[15px] [&_>_svg]:text-primary [&_p]:mt-[13px] [&_p]:text-[12px]
            [&_p]:leading-[1.8] [&_p]:text-[#93adc9]
          "
        >
          <AppIcon
            name="sparkles"
            :size="21"
          />
          <h2>Tekst z charakterem.</h2>
          <p>
            W menu „Wstaw blok” znajdziesz wskazówki, informacje i ostrzeżenia. Używaj ich tam,
            gdzie naprawdę pomagają czytelnikowi.
          </p>
        </section>
        <button
          v-if="!isNew"
          data-ui="text-link danger-icon"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-[#edb4bd]!
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          @click="confirm?.showModal()"
        >
          <AppIcon
            name="trash"
            :size="15"
          />
          Usuń wpis
        </button>
      </aside>
    </div>
    <dialog
      ref="confirm"
      data-ui="confirm-dialog"
      class="
        w-[calc(100%_-_35px)] max-w-[440px] rounded-feature border border-solid border-[#436080]
        bg-[#142135] p-8 text-ink shadow-[0_20px_60px_#0008] max-[760px]:p-[27px] [&_>_div]:flex
        [&_>_div]:justify-end [&_>_div]:gap-[13px] [&_>_svg]:mb-[23px] [&_>_svg]:text-[#edbac4]
        [&_[data-ui~='button']]:min-h-11 [&_[data-ui~='button']]:px-[15px]
        [&_[data-ui~='button']]:py-[11px] [&_[data-ui~='button']]:text-[11px] [&_h2]:text-[28px]
        [&_p]:mt-5 [&_p]:mb-7 [&_p]:text-[11px] [&_p]:text-[#8da6c6] [&::backdrop]:bg-[#060c18c9]
        [&::backdrop]:[backdrop-filter:blur(4px)]
      "
    >
      <h2>Usunąć ten wpis?</h2>
      <p>„{{ state.title }}” zostanie trwale usunięty z bloga i panelu.</p>
      <div>
        <button
          data-ui="button button-outline"
          class="
            inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
            border-solid border-[#475362] bg-transparent px-6 py-[15px] text-[12px] font-bold
            whitespace-nowrap text-ink
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
            pointer-hover:hover:text-primary [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          :disabled="pending"
          @click="confirm?.close()"
        >
          Anuluj
        </button>
        <button
          data-ui="button button-danger"
          class="
            inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
            border-solid border-[#eab4b4] bg-[#eab4b4] px-6 py-[15px] text-[12px] font-bold
            whitespace-nowrap text-[#321717]
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          :disabled="pending"
          @click="remove"
        >
          Usuń wpis
        </button>
      </div>
    </dialog>
  </div>
</template>
