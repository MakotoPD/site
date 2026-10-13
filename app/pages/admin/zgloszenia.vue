<script setup lang="ts">
import type { Lead } from '#shared/types'
import { leadStatuses } from '#shared/defaults'
import { quoteUndecidedLabels } from '#shared/quote-content'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Zgłoszenia — Makoto Studio' })
const { data, error, refresh } = await useFetch('/api/admin/leads', { default: () => [] })
const search = ref(''),
  status = ref('all'),
  source = ref('all'),
  selectedId = ref(String(useRoute().query.lead || ''))
const selected = computed(() => data.value.find((l) => l.id === selectedId.value))
const filtered = computed(() =>
  data.value.filter(
    (l) =>
      (status.value === 'all' || l.status === status.value) &&
      (source.value === 'all' || l.source === source.value) &&
      `${l.name} ${l.email} ${l.company} ${l.city || ''} ${l.message}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
  ),
)
const editor = reactive({ status: 'new' as Lead['status'], notes: '' }),
  pending = ref(false),
  toast = useToast()
watch(
  selected,
  (lead) => {
    if (lead) {
      editor.status = lead.status
      editor.notes = lead.notes
    }
  },
  { immediate: true },
)
async function save() {
  if (!selected.value) return
  pending.value = true
  try {
    await $fetch(`/api/admin/leads/${selected.value.id}`, { method: 'PATCH', body: editor })
    await refresh()
    toast.show('Zgłoszenie zaktualizowane.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    pending.value = false
  }
}
const confirm = ref<HTMLDialogElement | null>(null)
async function remove() {
  if (!selected.value) return
  pending.value = true
  try {
    await $fetch(`/api/admin/leads/${selected.value.id}`, { method: 'DELETE' })
    selectedId.value = ''
    await refresh()
    confirm.value?.close()
    toast.show('Zgłoszenie usunięte.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    pending.value = false
  }
}
</script>
<template>
  <div>
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
          Ludzie i ich pomysły
        </p>
        <h1>
          Zgłoszenia
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>Formularze, konfiguracje wycen i kolejne kroki współpracy.</p>
      </div>
      <a
        href="/api/admin/leads/export"
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
      >
        <AppIcon
          name="download"
          :size="16"
        />
        Eksport CSV
      </a>
    </div>
    <div
      data-ui="admin-filter"
      class="
        mb-[25px] flex items-center gap-[15px] max-[960px]:flex-wrap
        max-[960px]:[&_[data-ui~='search-field']]:basis-full [&_select]:mt-0 [&_select]:w-[175px]
        [&_select]:border-[#2d405a] [&_select]:text-[10px] max-[960px]:[&_select]:flex-1
      "
    >
      <div
        data-ui="search-field"
        class="
          relative flex-1 [&_>_svg]:absolute [&_>_svg]:top-3.5 [&_>_svg]:left-[13px]
          [&_>_svg]:text-[#6783a3] [&_input]:mt-0! [&_input]:border-[#2d405a]! [&_input]:pl-10!
          [&_input]:text-[11px]!
        "
      >
        <AppIcon
          name="search"
          :size="17"
        />
        <input
          v-model="search"
          aria-label="Szukaj zgłoszeń"
          placeholder="Szukaj po imieniu, e-mailu lub firmie…"
        />
      </div>
      <select
        v-model="status"
        aria-label="Filtruj po statusie"
      >
        <option value="all">Wszystkie statusy</option>
        <option
          v-for="(label, value) in leadStatuses"
          :key="value"
          :value="value"
        >
          {{ label }}
        </option>
      </select>
      <select
        v-model="source"
        aria-label="Filtruj po źródle"
      >
        <option value="all">Wszystkie źródła</option>
        <option value="calculator">Kalkulator</option>
        <option value="contact">Formularz</option>
      </select>
    </div>
    <div
      v-if="error"
      data-ui="admin-error"
      class="
        rounded-[5px] border border-solid border-[#6c424e] bg-[#362128] p-5.5 text-[12px]
        text-[#f7c6d1] [&_button]:ml-[15px] [&_button]:border-0 [&_button]:border-none
        [&_button]:bg-transparent [&_button]:text-[inherit] [&_button]:underline
      "
      role="alert"
    >
      Nie udało się pobrać zgłoszeń.
      <button @click="refresh()">Ponów</button>
    </div>
    <div
      data-ui="leads-layout"
      class="
        grid gap-[25px] [&.selected_.option-checkbox]:border-primary
        [&.selected_.option-checkbox]:bg-primary [&.selected_.option-checkbox]:text-background
        [&.selected_[data-ui~='option-radio']]:border-primary
        [&.selected_[data-ui~='option-radio']]:bg-primary
        [&.selected_[data-ui~='option-radio']]:text-background [&.with-detail]:grid-cols-2
        [&.with-detail]:[align-items:start] max-[1200px]:[&.with-detail]:gap-5
        max-[960px]:[&.with-detail]:grid-cols-1
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-item']]:flex-wrap
        max-[960px]:[&.with-detail_[data-ui~='lead-list-item']]:flex-nowrap
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-right']]:mt-[5px]
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-right']]:w-full
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-right']]:grid-cols-2
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-right']]:items-center
        max-[960px]:[&.with-detail_[data-ui~='lead-list-right']]:mt-0
        max-[960px]:[&.with-detail_[data-ui~='lead-list-right']]:grid
        max-[960px]:[&.with-detail_[data-ui~='lead-list-right']]:w-auto
        max-[960px]:[&.with-detail_[data-ui~='lead-list-right']]:grid-cols-1
        max-[1200px]:[&.with-detail_[data-ui~='lead-list-right']_[data-ui~='badge']]:justify-self-start
        max-[960px]:[&.with-detail_[data-ui~='lead-list-right']_[data-ui~='badge']]:justify-self-end
      "
      :class="{ 'with-detail': selected }"
    >
      <section
        data-ui="admin-panel leads-list"
        class="
          overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]
          [&_[data-ui~='admin-panel-heading']]:p-5
        "
      >
        <div
          data-ui="admin-panel-heading"
          class="
            flex items-center justify-between gap-5 border-b [border-bottom-style:solid]
            border-b-[#253448] px-[25px] py-[21px] max-[760px]:p-5
            [&_[data-ui~='muted']]:text-[8px] [&_[data-ui~='muted']]:text-[#6d84a2]
            [&_[data-ui~='text-link']]:p-0 [&_[data-ui~='text-link']]:text-[9px]
            [&_h2]:text-[15px] [&_h2]:tracking-[-0.02em]
          "
        >
          <h2>{{ filtered.length }} {{ filtered.length === 1 ? 'zgłoszenie' : 'zgłoszeń' }}</h2>
          <span
            data-ui="muted"
            class="text-muted"
          >
            Najnowsze na górze
          </span>
        </div>
        <div
          v-if="!filtered.length"
          data-ui="admin-empty"
          class="
            flex min-h-[280px] flex-col items-center justify-center px-7 py-[55px] text-center
            max-[760px]:px-5.5 max-[760px]:py-10 [&_>_svg]:text-[#87a9d0]
            [&_[data-ui~='text-link']]:mt-[17px] [&_[data-ui~='text-link']]:text-[10px]
            [&_h3]:mt-[23px] [&_h3]:text-[18px] max-[760px]:[&_h3]:text-[16px] [&_p]:mt-[13px]
            [&_p]:max-w-[300px] [&_p]:text-[10px] [&_p]:text-[#7089a8]
          "
        >
          <AppIcon
            name="inbox"
            :size="32"
          />
          <h3>
            {{
              search || status !== 'all' || source !== 'all'
                ? 'Brak pasujących zgłoszeń.'
                : 'Pierwszy pomysł dopiero przed nami.'
            }}
          </h3>
          <p>
            {{
              data.length
                ? 'Zmień filtry lub szukaną frazę.'
                : 'Po wysłaniu formularza zgłoszenie pojawi się tutaj.'
            }}
          </p>
        </div>
        <button
          v-for="lead in filtered"
          :key="lead.id"
          data-ui="lead-list-item"
          class="
            flex w-full items-start gap-[13px] border-t-0 border-r-0 border-b border-l-0
            [border-top-style:none] [border-right-style:none] [border-bottom-style:solid]
            [border-left-style:none] border-b-[#24364d] bg-transparent px-5 py-5.5 text-left
            text-[inherit] last:border-b-0 last:[border-bottom-style:none] max-[760px]:p-4.5
            [&.selected]:bg-[#1a2b41] [&.selected]:shadow-[inset_2px_0_var(--blue)]
            [&.selected_.option-checkbox]:border-primary [&.selected_.option-checkbox]:bg-primary
            [&.selected_.option-checkbox]:text-background
            [&.selected_[data-ui~='option-radio']]:border-primary
            [&.selected_[data-ui~='option-radio']]:bg-primary
            [&.selected_[data-ui~='option-radio']]:text-background
          "
          :class="{ selected: selectedId === lead.id }"
          @click="selectedId = lead.id"
        >
          <span
            data-ui="lead-avatar"
            class="
              grid h-9 w-9 shrink-0 place-items-center rounded-[50%] border border-solid
              border-[#314b6a] bg-[#1d3048] text-[15px] font-medium text-primary
            "
          >
            {{ lead.name.charAt(0) }}
          </span>
          <span
            data-ui="lead-list-main"
            class="
              grid min-w-0 flex-1 gap-[5px] [&_>_span]:mt-2 [&_>_span]:text-[8px]
              [&_>_span]:text-[#617d9e] max-[760px]:[&_>_span]:text-[7px]
              [&_small]:overflow-hidden [&_small]:text-[9px] [&_small]:text-ellipsis
              [&_small]:text-[#7895b8] max-[760px]:[&_small]:text-[8px] [&_strong]:text-[11px]
              [&_strong]:font-medium
            "
          >
            <strong>{{ lead.name }}</strong>
            <small>{{ lead.company || lead.email }}</small>
            <span>
              {{ lead.source === 'calculator' ? 'Kalkulator' : 'Formularz kontaktowy' }} ·
              {{ formatDate(lead.createdAt) }}
            </span>
          </span>
          <span
            data-ui="lead-list-right"
            class="
              grid [justify-items:end] gap-[15px] [&_>_strong]:text-[11px]
              [&_>_strong]:font-medium [&_>_strong]:text-[#afd1f8]
            "
          >
            <span
              data-ui="badge"
              class="
                rounded-full border border-solid border-[#3c4d63] bg-[#233045] px-[9px] py-[5px]
                text-[8px] whitespace-nowrap text-[#a1b9d4] [&.badge-closed]:border-[#3a4a5d]
                [&.badge-closed]:bg-[#1b2839] [&.badge-closed]:text-[#95aac2]
                [&.badge-contacted]:border-[#5e527e] [&.badge-contacted]:bg-[#2a2440]
                [&.badge-contacted]:text-[#d2c6f2] [&.badge-draft]:border-[#3a4a5d]
                [&.badge-draft]:bg-[#1b2839] [&.badge-draft]:text-[#95aac2]
                [&.badge-new]:border-[#436991] [&.badge-new]:bg-[#203c59]
                [&.badge-new]:text-primary [&.badge-proposal]:border-[#766440]
                [&.badge-proposal]:bg-[#302b1e] [&.badge-proposal]:text-[#f3d4a0]
                [&.badge-won]:border-[#3c725c] [&.badge-won]:bg-[#193629]
                [&.badge-won]:text-[#b1e8d2]
              "
              :class="`badge-${lead.status}`"
            >
              {{ leadStatuses[lead.status] }}
            </span>
            <strong v-if="lead.quote">{{ formatMoney(lead.quote.total) }}</strong>
          </span>
        </button>
      </section>
      <section
        v-if="selected"
        data-ui="admin-panel lead-detail"
        class="
          overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]
          [&_[data-ui~='admin-panel-heading']]:px-5.5
          [&_[data-ui~='admin-panel-heading']]:py-[17px] [&_[data-ui~='icon-button']]:h-7.5
          [&_[data-ui~='icon-button']]:w-7.5 [&_[data-ui~='icon-button']]:border-[#334b68]
        "
      >
        <div
          data-ui="admin-panel-heading"
          class="
            flex items-center justify-between gap-5 border-b [border-bottom-style:solid]
            border-b-[#253448] px-[25px] py-[21px] max-[760px]:p-5
            [&_[data-ui~='muted']]:text-[8px] [&_[data-ui~='muted']]:text-[#6d84a2]
            [&_[data-ui~='text-link']]:p-0 [&_[data-ui~='text-link']]:text-[9px]
            [&_h2]:text-[15px] [&_h2]:tracking-[-0.02em]
          "
        >
          <h2>Szczegóły zgłoszenia</h2>
          <button
            data-ui="icon-button"
            class="
              inline-flex h-10 w-10 items-center justify-center rounded-control border
              border-solid border-line bg-transparent text-ink
            "
            aria-label="Zamknij szczegóły"
            @click="selectedId = ''"
          >
            <AppIcon
              name="close"
              :size="17"
            />
          </button>
        </div>
        <div
          data-ui="lead-detail-body"
          class="
            p-[27px] max-[1200px]:p-[23px] max-[760px]:p-[23px]
            [&_>_[data-ui~='eyebrow']]:mb-[19px] [&_>_[data-ui~='eyebrow']]:text-[8px]
            [&_>_[data-ui~='eyebrow']]:text-[#769dc9] [&_>_h2]:mb-[9px] [&_>_h2]:text-[29px]
          "
        >
          <span
            data-ui="eyebrow"
            class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            {{ selected.source === 'calculator' ? 'Kalkulator wyceny' : 'Formularz kontaktowy' }}
          </span>
          <h2>{{ selected.name }}</h2>
          <p
            v-if="selected.company"
            data-ui="lead-company"
            class="mb-3 text-[11px] text-[#8aa3c2]"
          >
            {{ selected.company }}
          </p>
          <a
            :href="`mailto:${selected.email}`"
            data-ui="lead-contact"
            class="flex items-center gap-[9px] py-1.5 text-[11px] [overflow-wrap:anywhere] text-primary"
          >
            <AppIcon
              name="mail"
              :size="16"
            />
            {{ selected.email }}
          </a>
          <a
            v-if="selected.phone"
            :href="`tel:${selected.phone.replace(/[^+0-9]/g, '')}`"
            data-ui="lead-contact"
            class="flex items-center gap-[9px] py-1.5 text-[11px] [overflow-wrap:anywhere] text-primary"
          >
            {{ selected.phone }}
          </a>
          <p
            v-if="selected.city"
            data-ui="lead-company"
            class="mb-3 text-[11px] text-[#8aa3c2]"
          >
            Miejscowość: {{ selected.city }}
          </p>
          <NuxtLink
            v-if="selected.originPage"
            :to="selected.originPage"
            target="_blank"
            data-ui="text-link"
            class="
              inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
              px-0 py-3 text-[12px] font-medium text-ink
              [&_svg]:[transition:transform_0.25s_var(--ease-out)]
              pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
            "
          >
            Strona zgłoszenia: {{ selected.originPage }}
            <AppIcon
              name="external"
              :size="13"
            />
          </NuxtLink>
          <p
            data-ui="lead-date"
            class="mt-[17px] text-[8px] text-[#5f7b9e]"
          >
            {{ formatDate(selected.createdAt) }} ·
            {{
              new Date(selected.createdAt).toLocaleTimeString('pl-PL', {
                hour: '2-digit',
                minute: '2-digit',
              })
            }}
          </p>
          <div
            data-ui="lead-message"
            class="
              mt-6 border-t border-b [border-top-style:solid] [border-bottom-style:solid]
              border-t-[#2a3d57] border-b-[#2a3d57] py-[23px] [&_h3]:mb-3.5 [&_h3]:text-[12px]
              [&_p]:text-[11px] [&_p]:[overflow-wrap:anywhere] [&_p]:whitespace-pre-wrap
              [&_p]:text-[#a4b9d2]
            "
          >
            <h3>Wiadomość</h3>
            <p>{{ selected.message }}</p>
          </div>
          <div
            v-if="selected.quote"
            data-ui="lead-quote"
            class="
              mt-6 rounded-card border border-solid border-[#304969] bg-[#162439] p-5
              [&_>_div]:mt-3 [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:gap-3
              [&_>_div]:text-[9px] [&_>_div]:text-[#8dabc9] [&_>_p]:mt-5 [&_>_p]:text-[8px]
              [&_>_p]:text-[#6685a9] [&_h3]:mb-3.5 [&_h3]:text-[12px] [&_strong]:text-[9px]
              [&_strong]:font-medium [&_strong]:whitespace-nowrap [&_strong]:text-[#bddeff]
            "
          >
            <h3>Konfiguracja projektu</h3>
            <div
              v-for="line in selected.quote.lines"
              :key="line.label"
            >
              <span>{{ line.label }}</span>
              <strong>{{ formatMoney(line.price) }}</strong>
            </div>
            <dl
              v-if="selected.quote.selections?.length"
              data-ui="quote-selected-summary"
              class="
                grid gap-[5px] border-b [border-bottom-style:solid] border-b-line py-[17px]
                [&_dd]:text-[12px] [&_dd]:leading-[1.6] [&_dd]:text-[#d0dce8] [&_dt]:mt-2
                [&_dt]:text-[11px] [&_dt]:text-muted
              "
            >
              <template
                v-for="selection in selected.quote.selections"
                :key="selection.label"
              >
                <dt>{{ selection.label }}</dt>
                <dd>{{ selection.value }}</dd>
              </template>
            </dl>
            <div
              data-ui="lead-quote-total"
              class="mt-[19px]! border-t [border-top-style:solid] border-t-[#39516e] pt-[15px] [&_strong]:text-[15px]"
            >
              <span>
                {{ selected.quote.requiresIndividual ? 'Kwota początkowa netto' : 'Razem netto' }}
              </span>
              <strong>
                {{ selected.quote.requiresIndividual ? 'od ' : ''
                }}{{ formatMoney(selected.quote.total) }}
              </strong>
            </div>
            <ul
              v-if="selected.quote.requiresIndividual"
              data-ui="lead-undecided"
              class="mt-[15px] pl-[17px] text-[11px] leading-[1.9] text-[#b7c6d6]"
            >
              <li
                v-for="reason in selected.quote.individualReasons"
                :key="reason"
              >
                {{ reason }}
              </li>
            </ul>
            <div
              v-for="line in selected.quote.monthlyLines"
              :key="line.label"
            >
              <span>{{ line.label }}</span>
              <strong>{{ formatMoney(line.price) }} / mies.</strong>
            </div>
            <div v-if="selected.quote.monthly">
              <span>Miesięcznie netto</span>
              <strong>{{ formatMoney(selected.quote.monthly) }}</strong>
            </div>
            <p>
              {{
                selected.quote.configuration.project === 'website'
                  ? `${selected.quote.configuration.pages} podstron`
                  : selected.quote.configuration.project === 'store'
                    ? 'Sklep internetowy'
                    : selected.quote.configuration.project === 'application'
                      ? 'Aplikacja webowa'
                      : 'Landing page'
              }}
              · {{ selected.quote.configuration.languages }} wersji językowych ·
              {{ selected.quote.configuration.urgent ? 'Priorytetowo' : 'Standardowy termin' }}
            </p>
          </div>
          <div
            v-if="selected.brief?.undecided.length"
            data-ui="lead-quote"
            class="
              mt-6 rounded-card border border-solid border-[#304969] bg-[#162439] p-5
              [&_>_div]:mt-3 [&_>_div]:flex [&_>_div]:justify-between [&_>_div]:gap-3
              [&_>_div]:text-[9px] [&_>_div]:text-[#8dabc9] [&_>_p]:mt-5 [&_>_p]:text-[8px]
              [&_>_p]:text-[#6685a9] [&_h3]:mb-3.5 [&_h3]:text-[12px] [&_strong]:text-[9px]
              [&_strong]:font-medium [&_strong]:whitespace-nowrap [&_strong]:text-[#bddeff]
            "
          >
            <h3>Do omówienia z klientem</h3>
            <p v-if="selected.brief.goal === 'unsure'">
              Klient potrzebuje pomocy w doborze rodzaju projektu.
            </p>
            <ul
              data-ui="lead-undecided"
              class="mt-[15px] pl-[17px] text-[11px] leading-[1.9] text-[#b7c6d6]"
            >
              <li
                v-for="id in selected.brief.undecided"
                :key="id"
              >
                {{ quoteUndecidedLabels[id] || id }}
              </li>
            </ul>
          </div>
          <form
            data-ui="lead-editor"
            class="mt-6.5 grid gap-5 [&_label]:text-[10px]"
            @submit.prevent="save"
          >
            <label>
              Status
              <select v-model="editor.status">
                <option
                  v-for="(label, value) in leadStatuses"
                  :key="value"
                  :value="value"
                >
                  {{ label }}
                </option>
              </select>
            </label>
            <label>
              Twoje notatki
              <textarea
                v-model="editor.notes"
                rows="5"
                placeholder="Ustalenia, kolejne kroki, ważne informacje…"
                maxlength="10000"
              />
            </label>
            <div
              data-ui="lead-editor-actions"
              class="flex items-center justify-between gap-[15px]"
            >
              <button
                type="submit"
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
              >
                <AppIcon
                  name="save"
                  :size="15"
                />
                Zapisz zmiany
              </button>
              <button
                type="button"
                data-ui="icon-button danger-icon"
                class="
                  inline-flex h-10 w-10 items-center justify-center rounded-control border
                  border-solid border-line bg-transparent text-[#edb4bd]!
                "
                aria-label="Usuń zgłoszenie"
                @click="confirm?.showModal()"
              >
                <AppIcon
                  name="trash"
                  :size="17"
                />
              </button>
            </div>
          </form>
        </div>
      </section>
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
      <AppIcon
        name="trash"
        :size="28"
      />
      <h2>Usunąć zgłoszenie?</h2>
      <p>
        Dane {{ selected?.name }} i historia tego zgłoszenia zostaną usunięte. Tej operacji nie
        można cofnąć.
      </p>
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
          Usuń zgłoszenie
        </button>
      </div>
    </dialog>
  </div>
</template>
