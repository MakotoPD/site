<script setup lang="ts">
import type { Project } from '#shared/types'
import { emptyDocument, normalizeRichDocument, type RichNode } from '#shared/rich-content'
import { markdownToDocument } from '#shared/markdown'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Realizacje — Makoto Studio' })
const { data } = await useFetch('/api/admin/projects', { default: () => [] })
const items = ref<(Project & { document: RichNode })[]>(
  structuredClone(toRaw(data.value)).map((project) => ({
    ...project,
    document: project.document || normalizeRichDocument(markdownToDocument(project.detail)),
  })),
)
const categories = computed(() =>
  [...new Set(items.value.map((p) => p.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'pl'),
  ),
)
const pending = ref(false),
  uploading = ref(-1),
  toast = useToast()
function add() {
  items.value.push({
    slug: '',
    title: '',
    category: '',
    description: '',
    detail: '',
    document: emptyDocument(),
    image: '',
    color: '#203044',
    technologies: [],
    url: '',
  })
}
function move(index: number, by: number) {
  const [item] = items.value.splice(index, 1)
  items.value.splice(index + by, 0, item!)
}
function remove(index: number) {
  if (window.confirm(`Usunąć realizację „${items.value[index]!.title || 'bez tytułu'}”?`))
    items.value.splice(index, 1)
}
async function upload(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = index
  try {
    const body = new FormData()
    body.append('file', file)
    items.value[index]!.image = (await $fetch('/api/admin/media', { method: 'POST', body })).url
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    uploading.value = -1
  }
}
async function save() {
  pending.value = true
  try {
    await $fetch<Project[]>('/api/admin/projects', {
      method: 'PUT',
      body: items.value,
    })
    toast.show('Realizacje zapisane.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    pending.value = false
  }
}
</script>
<template>
  <form @submit.prevent="save">
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
        <p
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          Portfolio
        </p>
        <h1>
          Realizacje
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>Kolejność poniżej to kolejność na stronie. Dwie pierwsze trafiają na stronę główną.</p>
      </div>
      <button
        data-ui="button button-small"
        class="
          inline-flex min-h-10.5 items-center justify-center gap-6 rounded-control border
          border-solid border-primary bg-primary px-4.5 py-[11px] text-[11px] font-bold
          whitespace-nowrap text-[#111b27]
          [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
          pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
        "
        type="submit"
        :disabled="pending"
      >
        <AppIcon
          class="[&.spin]:animate-spin"
          :name="pending ? 'loading' : 'save'"
          :size="16"
          :class="{ spin: pending }"
        />
        Zapisz realizacje
      </button>
    </div>
    <section
      v-for="(project, i) in items"
      :key="i"
      data-ui="admin-panel settings-panel"
      class="
        mb-6 overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823] p-7
        max-[760px]:p-[23px] [&_h2]:text-[18px] [&_h2]:tracking-[-0.02em]
      "
    >
      <div
        data-ui="settings-section-heading"
        class="mb-3 flex items-center justify-between gap-5 max-[760px]:gap-[15px]"
      >
        <h2>{{ String(i + 1).padStart(2, '0') }} · {{ project.title || 'Nowa realizacja' }}</h2>
        <div
          class="
            flex gap-2 [&_button]:grid [&_button]:h-9 [&_button]:w-9
            [&_button]:place-items-center [&_button]:rounded-control [&_button]:border
            [&_button]:border-solid [&_button]:border-[#2e4763] [&_button]:bg-transparent
            [&_button]:text-[#94a8c1]
          "
        >
          <button
            type="button"
            aria-label="Przesuń wyżej"
            :disabled="i === 0"
            @click="move(i, -1)"
          >
            <AppIcon
              name="down"
              class="rotate-180"
              :size="16"
            />
          </button>
          <button
            type="button"
            aria-label="Przesuń niżej"
            :disabled="i === items.length - 1"
            @click="move(i, 1)"
          >
            <AppIcon
              name="down"
              :size="16"
            />
          </button>
          <button
            type="button"
            aria-label="Usuń realizację"
            @click="remove(i)"
          >
            <AppIcon
              name="trash"
              :size="16"
            />
          </button>
        </div>
      </div>
      <div
        data-ui="settings-fields"
        class="mt-[25px] grid grid-cols-2 gap-6 max-[960px]:gap-5 max-[760px]:grid-cols-1 [&_label]:text-[10px]"
      >
        <label>
          Tytuł
          <input
            v-model="project.title"
            required
            minlength="2"
            maxlength="80"
            @change="project.slug ||= slugify(project.title)"
          />
        </label>
        <label>
          Adres (/realizacje/…)
          <input
            v-model="project.slug"
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxlength="180"
          />
        </label>
        <label>
          Kategoria
          <CategorySelect
            v-model="project.category"
            :options="categories"
          />
        </label>
        <label>
          Krótki opis (na karcie)
          <input
            v-model="project.description"
            required
            minlength="10"
            maxlength="200"
          />
        </label>
        <label>
          Technologie (po przecinku)
          <input
            :value="project.technologies.join(', ')"
            @change="
              project.technologies = ($event.target as HTMLInputElement).value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            "
          />
        </label>
        <label>
          Link do strony
          <input
            v-model="project.url"
            type="url"
            maxlength="300"
            placeholder="https://…"
          />
        </label>
        <div class="col-span-full text-[10px] [&_[data-ui~='rich-editor-content']]:min-h-[220px]">
          Opis projektu (podstrona realizacji)
          <ClientOnly>
            <RichTextEditor
              v-model="project.document"
              class="mt-2.5"
              @error="toast.show($event, true)"
            />
          </ClientOnly>
        </div>
        <label>
          Kolor tła
          <input
            v-model="project.color"
            type="color"
            class="h-11 p-1!"
          />
        </label>
        <div class="text-[10px]">
          Zdjęcie
          <div class="mt-2.5 flex items-center gap-4">
            <img
              v-if="project.image"
              :src="project.image"
              alt=""
              class="h-16 w-28 rounded-control object-cover"
              :style="{ background: project.color }"
            />
            <label
              class="
                relative flex cursor-pointer items-center gap-2 rounded-control border
                border-dashed border-[#3f5e83] bg-[#17273d] px-4 py-3 [&_input]:absolute
                [&_input]:inset-0 [&_input]:m-0! [&_input]:cursor-pointer [&_input]:opacity-0
              "
            >
              <AppIcon
                class="[&.spin]:animate-spin"
                :name="uploading === i ? 'loading' : 'image'"
                :class="{ spin: uploading === i }"
                :size="16"
              />
              {{ project.image ? 'Zmień' : 'Dodaj zdjęcie' }}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                :disabled="uploading !== -1"
                @change="upload($event, i)"
              />
            </label>
            <button
              v-if="project.image"
              type="button"
              class="border-0 bg-transparent text-[#94a8c1]"
              @click="project.image = ''"
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    </section>
    <p
      data-ui="admin-hint"
      class="mb-6 text-[9px] text-[#6684a9]"
    >
      Kategoria zaczynająca się od „Strona” trafia do filtra Strony, pozostałe do Aplikacje. Bez
      zdjęcia karta pokazuje nazwę projektu na kolorowym tle.
    </p>
    <div class="flex flex-wrap gap-4">
      <button
        type="button"
        data-ui="button"
        class="
          inline-flex min-h-13 items-center justify-center gap-3 rounded-control border
          border-solid border-[#2e4763] bg-transparent px-6 py-[15px] text-[12px] font-bold
          text-ink
        "
        @click="add"
      >
        <AppIcon
          name="plus"
          :size="17"
        />
        Dodaj realizację
      </button>
      <button
        data-ui="button"
        class="
          inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
          border-solid border-primary bg-primary px-6 py-[15px] text-[12px] font-bold
          whitespace-nowrap text-[#111b27]
          [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
          pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
        "
        type="submit"
        :disabled="pending"
      >
        Zapisz wszystkie zmiany
        <AppIcon
          name="save"
          :size="17"
        />
      </button>
    </div>
  </form>
</template>
