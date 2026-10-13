<script setup lang="ts">
import { calculateQuote } from '#shared/pricing'
import type { QuoteBrief, QuoteInput } from '#shared/types'
import { locations } from '#shared/locations'
import {
  quoteExtraQuestions,
  quoteProjectCopy,
  quoteUndecidedLabels,
  quoteShortDescriptions,
  quoteBaseIncluded,
  quoteAppPurposes,
  quoteExtraIncluded,
} from '#shared/quote-content'

const { settings } = await useSite()
const route = useRoute()
const city = computed(() => locations.find((c) => c.slug === route.query.city)?.name || '')
const validProject = settings.value.projects.find((p) => p.id === route.query.project)?.id || ''
const input = reactive<QuoteInput>({
  project: validProject,
  extras: [],
  monthly: [],
  pages: validProject === 'landing' ? 1 : 5,
  languages: 1,
  urgent: false,
  design: 'base',
  productRange: 'small',
  productEntry: 'self',
  appPurpose: 'unsure',
})
const helpMode = ref(false),
  guideChoice = ref(''),
  showContact = ref(false),
  sent = ref(false)
const choicesRoot = ref<HTMLElement | null>(null),
  detailsRoot = ref<HTMLElement | null>(null),
  guideRoot = ref<HTMLElement | null>(null),
  contactRoot = ref<HTMLElement | null>(null)
const answers = reactive<Record<string, string>>(
  Object.fromEntries(settings.value.extras.map((e) => [e.id, 'unsure'])),
)
const pageChoice = ref('base'),
  languageChoice = ref('one'),
  timingChoice = ref('standard'),
  monthlyUnsure = ref(false)
const selectedProject = computed(() => settings.value.projects.find((p) => p.id === input.project))
const visibleExtras = computed(() =>
  settings.value.extras.filter((e) =>
    input.project === 'application'
      ? e.id === 'integrations'
      : !(input.project === 'store' && e.id === 'cms'),
  ),
)
const visibleMonthly = computed(() =>
  settings.value.monthly.filter((e) => input.project !== 'application' || e.id !== 'seo'),
)
const quote = computed(() => (input.project ? calculateQuote(input, settings.value) : null))
const hasPages = computed(() => input.project === 'website')
const selectedAppPurpose = computed(() =>
  quoteAppPurposes.find((p) => p.value === input.appPurpose),
)
const includedExtras = computed(() => input.extras.filter((id) => quoteExtraIncluded[id]))
const designOptions = computed(() => [
  ...settings.value.designs.map((d) => ({
    value: d.id,
    label: d.label,
    price: d.price ? '+ ' + formatMoney(d.price) : 'W cenie',
    explanation: d.description,
  })),
  {
    value: 'unsure',
    label: 'Nie wiem jeszcze',
    explanation:
      'Pokażę różnice na przykładach i pomogę dobrać kierunek. Na potrzeby szacunku zostawiam podstawowy układ, bez dopłaty za wygląd.',
  },
])
const productOptions = computed(() => [
  ...settings.value.productImports.map((p) => ({
    value: p.id,
    label: p.label,
    explanation:
      'To wielkość katalogu na start. Sam wybór liczby produktów nie dolicza opłaty za ich wprowadzenie — tę usługę wybierasz osobno poniżej.',
  })),
  {
    value: 'enterprise',
    label: 'Ponad 1000 produktów',
    explanation:
      'Duży katalog może wymagać importu, dodatkowych filtrów i dostosowania wydajności. Wyświetlam kwotę początkową; pełny zakres wycenimy indywidualnie.',
  },
  {
    value: 'unsure',
    label: 'Nie wiem jeszcze',
    explanation:
      'Liczbę ustalimy po obejrzeniu oferty. Nie doliczam teraz kosztu wprowadzania katalogu; jeśli wybierzesz tę usługę, oznaczę ją do indywidualnej wyceny.',
  },
])
const productEntryOptions = computed(() => {
  const range = settings.value.productImports.find((p) => p.id === input.productRange)
  return [
    {
      value: 'self',
      label: 'Dodam produkty samodzielnie',
      price: 'W cenie',
      explanation:
        'Otrzymujesz panel zarządzania produktami i instrukcję obsługi. Samodzielnie dodajesz zdjęcia, ceny i opisy; liczba wpisywanych produktów nie nalicza opłaty za usługę wprowadzenia.',
    },
    {
      value: 'makoto',
      label: 'Zlecę wprowadzenie Makoto',
      price: range ? '+ ' + formatMoney(range.price) : 'Wycena indywidualna',
      explanation:
        range?.description ||
        'Najpierw ustalimy wielkość katalogu i jakość danych. Wycena obejmie uzgodniony import lub wprowadzenie produktów, a jego koszt potwierdzę po rozmowie.',
    },
    {
      value: 'unsure',
      label: 'Nie wiem jeszcze',
      explanation:
        'Dobierzemy sposób dodawania produktów po sprawdzeniu katalogu. Ta odpowiedź nie dolicza dopłaty i zapisuje temat do omówienia.',
    },
  ]
})
const brief = computed<QuoteBrief>(() => ({
  goal: (input.project || 'unsure') as QuoteBrief['goal'],
  undecided: input.project
    ? [
        ...visibleExtras.value.filter((e) => answers[e.id] === 'unsure').map((e) => e.id),
        ...(hasPages.value && pageChoice.value === 'unsure' ? ['pages'] : []),
        ...(languageChoice.value === 'unsure' ? ['languages'] : []),
        ...(timingChoice.value === 'unsure' ? ['urgent'] : []),
        ...(monthlyUnsure.value ? ['monthly'] : []),
        ...(input.project !== 'application' && input.design === 'unsure' ? ['design'] : []),
        ...(input.project === 'store' && input.productRange === 'unsure' ? ['products'] : []),
        ...(input.project === 'store' && input.productEntry === 'unsure' ? ['productEntry'] : []),
        ...(input.project === 'application' && input.appPurpose === 'unsure' ? ['appPurpose'] : []),
      ]
    : ['project'],
}))
const undecidedText = computed(() =>
  brief.value.undecided.map((id) => quoteUndecidedLabels[id]).join(', '),
)
const undecidedCountLabel = computed(() => {
  const n = brief.value.undecided.length
  return (
    n +
    (n === 1
      ? ' sprawa do omówienia'
      : n >= 2 && n <= 4
        ? ' sprawy do omówienia'
        : ' spraw do omówienia')
  )
})
const guideOptions = [
  {
    value: 'landing',
    label: 'Przedstawić jedną ofertę',
    detail: 'Np. nową usługę, wydarzenie lub produkt i zebrać zapisy.',
  },
  {
    value: 'website',
    label: 'Przedstawić całą firmę',
    detail: 'Pokazać usługi, realizacje i ułatwić kontakt.',
  },
  {
    value: 'store',
    label: 'Umożliwić zakupy online',
    detail: 'Klient wybiera produkty, płaci i składa zamówienie.',
  },
  {
    value: 'application',
    label: 'Dać dostęp do narzędzia',
    detail: 'Np. rezerwacji, konta klienta lub pracy zespołu.',
  },
]
const recommendation = computed(() =>
  settings.value.projects.find((p) => p.id === guideChoice.value),
)
watch(answers, () => {
  input.extras = visibleExtras.value.filter((e) => answers[e.id] === 'yes').map((e) => e.id)
})
watch(pageChoice, (value) => {
  input.pages = input.project === 'landing' ? 1 : value === 'custom' ? Math.max(6, input.pages) : 5
})
watch(languageChoice, (value) => {
  if (value !== 'many') input.languages = 1
  else if (input.languages < 2) input.languages = 2
})
watch(timingChoice, (value) => {
  input.urgent = value === 'urgent'
})
async function moveTo(element: HTMLElement | null) {
  await nextTick()
  element?.focus({ preventScroll: true })
  element?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}
async function chooseProject(id: string) {
  if (input.project === id && !helpMode.value) {
    await moveTo(detailsRoot.value)
    return
  }
  input.project = id
  input.pages = id === 'landing' ? 1 : 5
  input.languages = 1
  input.urgent = false
  input.extras = []
  input.monthly = []
  input.design = 'base'
  input.productRange = 'small'
  input.productEntry = 'self'
  input.appPurpose = 'unsure'
  for (const key in answers) answers[key] = 'unsure'
  pageChoice.value = 'base'
  languageChoice.value = 'one'
  timingChoice.value = 'standard'
  monthlyUnsure.value = false
  helpMode.value = false
  await nextTick()
  await moveTo(detailsRoot.value)
}
async function chooseHelp() {
  input.project = ''
  input.extras = []
  input.monthly = []
  helpMode.value = true
  guideChoice.value = ''
  await nextTick()
  await moveTo(guideRoot.value)
}
async function openContact() {
  showContact.value = true
  await nextTick()
  await moveTo(contactRoot.value)
}
function toggleMonthly(id: string) {
  monthlyUnsure.value = false
  const index = input.monthly.indexOf(id)
  if (index < 0) input.monthly.push(id)
  else input.monthly.splice(index, 1)
}
function deferMonthly() {
  monthlyUnsure.value = !monthlyUnsure.value
  if (monthlyUnsure.value) input.monthly = []
}
function extraOptions(id: string, price: number) {
  const question = quoteExtraQuestions[id]!
  const explanations: Record<string, { no: string; yes: string }> = {
    cms: {
      no: 'Strona powstaje bez panelu edycji. Późniejsze zmiany możesz zlecać osobno albo w ramach uzgodnionej opieki.',
      yes: 'Dostajesz panel do zmiany uzgodnionych tekstów i zdjęć oraz prowadzenia bloga. Pokażę, jak zapisywać szkice i publikować wpisy.',
    },
    copy: {
      no: 'Dostarczasz gotowe teksty. Układam je w uzgodnionej strukturze strony i wdrażam w projekcie.',
      yes: 'Przygotowuję teksty do uzgodnionych sekcji na podstawie informacji o firmie. Opisy całego katalogu produktów i tłumaczenia wymagają osobnego określenia zakresu.',
    },
    identity: {
      no: 'Pracuję na Twoim logo, kolorach i dostępnych materiałach marki. Prześlij pliki, które można wykorzystać w projekcie.',
      yes: 'Przygotowuję logo, paletę kolorów, typografię i podstawowe zasady ich używania. Kierunek uzgadniamy przed wdrożeniem strony.',
    },
    motion: {
      no: 'Interfejs otrzymuje podstawowe przejścia i czytelną informację o interakcjach. To wariant uwzględniony w cenie projektu.',
      yes: 'Dodaję uzgodnione sceny przy przewijaniu i autorskie interakcje. Dostosowuję je do telefonu, wydajności i preferencji ograniczonego ruchu.',
    },
    integrations: {
      no: 'Wdrażam standardowe funkcje wybranego wariantu projektu. Dodatkowe połączenia z zewnętrznymi systemami możemy zaplanować później.',
      yes: 'Uzgodnimy narzędzia, dane i sposób ich przesyłania. Kwota jest dopłatą startową; rozbudowane połączenia z magazynem, CRM lub złożonym API potwierdzę po sprawdzeniu zakresu.',
    },
  }
  return [
    { value: 'no', label: question.no, price: 'Bez dopłaty', explanation: explanations[id]?.no },
    {
      value: 'yes',
      label: question.yes,
      price: '+ ' + formatMoney(price),
      explanation: explanations[id]?.yes,
    },
    {
      value: 'unsure',
      label: 'Nie wiem jeszcze',
      explanation:
        'Pomogę zdecydować po rozmowie o projekcie. Nie doliczam teraz tej usługi; odpowiedź zapisze się jako temat do omówienia.',
    },
  ]
}
usePageSeo(
  'Kalkulator wyceny',
  'Opisz cel projektu, wybierz potrzebne funkcje i poznaj orientacyjny budżet. Nie wiesz, czego potrzebujesz? Kalkulator pomoże dobrać stronę lub aplikację.',
)
</script>

<template>
  <div
    data-ui="shell calculator-page quote-builder"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)] max-[760px]:pb-[75px]
      max-[400px]:w-[calc(100%_-_32px)]
      [&_[data-ui~='calculator-layout']]:grid-cols-[minmax(0,_1fr)_340px]
      [&_[data-ui~='calculator-layout']]:[align-items:start]
      max-[1100px]:[&_[data-ui~='calculator-layout']]:grid-cols-[minmax(0,_1fr)_295px]
      max-[1100px]:[&_[data-ui~='calculator-layout']]:gap-7
      max-[760px]:[&_[data-ui~='calculator-layout']]:grid-cols-[minmax(0,_1fr)]
      max-[760px]:[&_[data-ui~='calculator-layout']]:pb-[45px]
      [&_[data-ui~='calculator-note']]:text-[11px] [&_[data-ui~='calculator-note']]:leading-[1.7]
      [&_[data-ui~='calculator-note']_>_svg]:mt-0.5
      [&_[data-ui~='calculator-note']_>_svg]:shrink-0
      max-[760px]:[&_[data-ui~='mobile-quote-bar']]:z-[25]
      max-[760px]:[&_[data-ui~='mobile-quote-bar']_>_div]:min-w-0
      max-[760px]:[&_[data-ui~='mobile-quote-bar']_>_div_>_strong]:text-[17px]
      max-[760px]:[&_[data-ui~='mobile-quote-bar']_[data-ui~='button']]:gap-2.5
      max-[760px]:[&_[data-ui~='mobile-quote-bar']_[data-ui~='button']]:px-[13px]
      max-[760px]:[&_[data-ui~='mobile-quote-bar']_[data-ui~='button']]:text-[10px]
      [&_[data-ui~='option-card']]:min-w-0 [&_[data-ui~='option-card']]:p-6
      max-[1100px]:[&_[data-ui~='option-card']]:p-5
      max-[540px]:[&_[data-ui~='option-card']]:p-5.5
      [&_[data-ui~='option-card']_[data-ui~='option-scope']]:mt-3
      [&_[data-ui~='option-card']_[data-ui~='option-scope']]:text-[12px]
      [&_[data-ui~='option-card']_[data-ui~='option-scope']]:leading-[1.6]
      max-[540px]:[&_[data-ui~='option-card']_[data-ui~='option-scope']]:text-[11px]
      [&_[data-ui~='option-card']_h3]:max-w-[290px] [&_[data-ui~='option-card']_h3]:text-[22px]
      [&_[data-ui~='option-card']_h3]:leading-[1.35]
      max-[1100px]:[&_[data-ui~='option-card']_h3]:text-[18px]
      max-[760px]:[&_[data-ui~='option-card']_h3]:text-[22px]
      max-[540px]:[&_[data-ui~='option-card']_h3]:max-w-[none]
      max-[540px]:[&_[data-ui~='option-card']_h3]:text-[20px] [&_[data-ui~='option-card']_p]:mt-2
      [&_[data-ui~='option-card']_p]:text-[14px] [&_[data-ui~='option-card']_p]:leading-[1.65]
      [&_[data-ui~='option-card']_p]:text-muted
      max-[760px]:[&_[data-ui~='option-card']_p]:text-[14px]
      [&_[data-ui~='option-card-top']]:mb-4 [&_[data-ui~='option-price']]:flex
      [&_[data-ui~='option-price']]:items-center [&_[data-ui~='option-price']]:gap-[5px]
      [&_[data-ui~='option-price']]:text-[15px]
      max-[540px]:[&_[data-ui~='option-price']]:text-[15px]
      [&_[data-ui~='option-price']_>_svg]:ml-auto [&_[data-ui~='page-heading']]:pt-11
      [&_[data-ui~='page-heading']]:pb-9.5 max-[760px]:[&_[data-ui~='page-heading']]:pt-10
      max-[760px]:[&_[data-ui~='page-heading']]:pb-[35px]
      [&_[data-ui~='page-heading']_>_p:not([data-ui~='section-label'])]:max-w-[650px]
      [&_[data-ui~='page-heading']_>_p:not([data-ui~='section-label'])]:text-[14px]
      max-[760px]:[&_[data-ui~='page-heading']_>_p:not([data-ui~='section-label'])]:text-[12px]
      [&_[data-ui~='page-heading']_h1]:text-[clamp(45px,_4.8vw,_64px)]
      max-[760px]:[&_[data-ui~='page-heading']_h1]:text-[clamp(41px,_7.8vw,_58px)]
      max-[760px]:[&_[data-ui~='project-options']]:grid-cols-2
      max-[540px]:[&_[data-ui~='project-options']]:grid-cols-1
      [&_[data-ui~='quote-disclaimer']]:text-[12px]
      [&_[data-ui~='quote-disclaimer']]:leading-[1.8]
      max-[760px]:[&_[data-ui~='quote-disclaimer']]:text-[11px]
      [&_[data-ui~='quote-lines']]:text-[12px]
      [&_[data-ui~='quote-lines']_>_div_>_span]:text-[13px]
      [&_[data-ui~='quote-lines']_>_div_>_strong]:text-[13px]
      [&_[data-ui~='quote-next']_p]:text-[13px] [&_[data-ui~='quote-summary']]:top-26.5
      [&_[data-ui~='quote-summary']]:max-h-[calc(100svh_-_125px)]
      [&_[data-ui~='quote-summary']]:overflow-y-auto
      [&_[data-ui~='quote-summary']]:[overscroll-behavior:contain]
      [&_[data-ui~='quote-summary']]:p-6.5 max-[1100px]:[&_[data-ui~='quote-summary']]:p-[23px]
      max-[760px]:[&_[data-ui~='quote-summary']]:static
      max-[760px]:[&_[data-ui~='quote-summary']]:[order:0]
      max-[760px]:[&_[data-ui~='quote-summary']]:max-h-[none]
      max-[760px]:[&_[data-ui~='quote-summary']]:overflow-visible
      [&_[data-ui~='quote-summary']_h2]:text-[25px]
      [&_[data-ui~='quote-summary']_h2]:leading-[1.2]
      [&_[data-ui~='quote-summary']_h2]:tracking-[-0.045em]
      max-[760px]:[&_[data-ui~='quote-summary']_h2]:block
      [&_[data-ui~='quote-summary-cta']]:text-[12px] [&_[data-ui~='quote-summary-top']]:mb-5.5
      [&_[data-ui~='quote-summary-top']_[data-ui~='eyebrow']]:text-[8px]
      [&_[data-ui~='quote-time']]:text-[11px] [&_[data-ui~='quote-time']_strong]:text-[11px]
      [&_[data-ui~='quote-total']_>_span]:text-[11px]
      [&_[data-ui~='quote-total']_>_strong]:text-[43px]
    "
  >
    <header
      data-ui="page-heading"
      class="
        pt-20.5 pb-15 max-[760px]:pt-12.5 max-[760px]:pb-10.5
        [&_>_p:not([data-ui~='section-label'])]:mt-[27px]
        [&_>_p:not([data-ui~='section-label'])]:text-[13px]
        [&_>_p:not([data-ui~='section-label'])]:text-[#95a2b3]
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:mt-5.5
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:text-[12px]
        [&_[data-ui~='section-label']]:mb-[25px] [&_[data-ui~='text-link']]:mb-[35px]
        [&_h1]:text-[clamp(50px,_6.7vw,_90px)] max-[760px]:[&_h1]:text-[clamp(45px,_8vw,_65px)]
      "
    >
      <SectionLabel text="Wycena / Zacznij od pomysłu" />
      <h1>
        Twój projekt.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Przejrzysta wycena.
        </span>
      </h1>
      <p>
        Wybierz rodzaj projektu i dopasuj jego zakres.
        <br />
        Każda opcja ma wyjaśnienie, a podsumowanie od razu pokazuje jej koszt.
      </p>
    </header>
    <div
      data-ui="calculator-layout"
      class="
        grid grid-cols-[1fr_360px] [align-items:start] gap-[55px] pt-2.5 pb-27.5
        max-[1200px]:grid-cols-[1fr_315px] max-[1200px]:gap-[35px]
        max-[960px]:grid-cols-[1fr_275px] max-[960px]:gap-6 max-[760px]:grid-cols-1
        max-[760px]:gap-7.5 max-[760px]:pb-15
      "
    >
      <div
        data-ui="calculator-main"
        class="[scroll-margin-top:110px] [outline:none] max-[760px]:[scroll-margin-top:90px]"
      >
        <section
          v-if="!sent"
          ref="choicesRoot"
          data-ui="quote-section"
          class="
            quote-project-section [scroll-margin-top:110px] [outline:none]
            max-[760px]:[scroll-margin-top:92px] [&_+_[data-ui~='quote-section']]:mt-11
          "
          tabindex="-1"
          aria-labelledby="project-heading"
        >
          <div
            data-ui="quote-section-heading"
            class="
              mb-6.5 flex items-start gap-[17px] max-[760px]:grid
              max-[760px]:grid-cols-[34px_minmax(0,_1fr)] max-[760px]:flex-wrap max-[760px]:gap-3
              max-[760px]:[&_>_div]:[grid-column:2] max-[760px]:[&_>_div]:min-w-0
              max-[540px]:[&_>_div]:flex-1 [&_h2]:text-[28px] [&_h2]:leading-[1.3]
              [&_h2]:tracking-[-0.035em] max-[760px]:[&_h2]:text-[25px] [&_p]:mt-[9px]
              [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-muted
              max-[760px]:[&_p]:text-[13px]
            "
          >
            <span
              data-ui="quote-section-number"
              class="
                grid h-8.5 w-8.5 shrink-0 place-items-center rounded-control border border-solid
                border-line text-[11px] text-primary max-[760px]:[grid-row:1]
              "
            >
              01
            </span>
            <div>
              <h2 id="project-heading">W czym ma pomóc Twój projekt?</h2>
              <p>Wybierz najbliższy cel. Każdy wariant możesz dopasować.</p>
            </div>
          </div>
          <button
            data-ui="quote-help-trigger"
            class="
              mt-0 mb-4.5 flex w-full items-center gap-4 rounded-card border border-dashed
              border-[#51667c] bg-surface px-6 py-[21px] text-left text-ink
              [transition:border-color_160ms_ease,_background_160ms_ease]
              motion-reduce:[transition-duration:0ms] max-[760px]:p-5
              pointer-hover:hover:border-primary [&_>_span:nth-child(2)]:flex-1
              [&_>_svg]:shrink-0 [&_>_svg]:text-primary [&_small]:mt-[5px] [&_small]:block
              [&_small]:text-[11px] [&_small]:text-muted [&_strong]:block [&_strong]:text-[15px]
              [&_strong]:[font-weight:550] [&.selected]:border-primary
              [&.selected]:bg-[var(--surface-accent)]
              [&.selected_.option-checkbox]:border-primary
              [&.selected_.option-checkbox]:bg-primary
              [&.selected_.option-checkbox]:text-background
              [&.selected_[data-ui~='option-radio']]:border-primary
              [&.selected_[data-ui~='option-radio']]:bg-primary
              [&.selected_[data-ui~='option-radio']]:text-background
            "
            :class="{ selected: helpMode }"
            :aria-expanded="helpMode"
            aria-controls="quote-guide"
            @click="chooseHelp()"
          >
            <span
              data-ui="quote-help-icon"
              class="grid shrink-0 place-items-center text-primary"
            >
              <AppIcon
                name="sparkles"
                :size="23"
              />
            </span>
            <span>
              <strong>Nie wiem, czego potrzebuję</strong>
              <small>Pomóż mi wybrać lub porozmawiajmy o pomyśle.</small>
            </span>
            <AppIcon
              name="down"
              :size="19"
            />
          </button>
          <div
            data-ui="project-options"
            class="grid grid-cols-2 gap-[15px] max-[760px]:gap-3 max-[540px]:grid-cols-1 max-[400px]:gap-2.5"
            role="group"
            aria-label="Cel projektu"
          >
            <button
              v-for="project in settings.projects"
              :key="project.id"
              data-ui="option-card"
              class="
                flex flex-col rounded-card border border-solid border-[#2a3544] bg-[#11171f] p-6
                text-left text-ink [transition:border-color_0.2s_ease,_background_0.2s_ease]
                max-[960px]:p-[19px] max-[760px]:p-5 max-[540px]:p-5.5 max-[400px]:p-4
                pointer-hover:hover:border-[#8facc9] [&_[data-ui~='option-scope']]:mt-2
                [&_[data-ui~='option-scope']]:mb-1 [&_[data-ui~='option-scope']]:block
                [&_[data-ui~='option-scope']]:text-[10px]
                [&_[data-ui~='option-scope']]:text-primary [&_h3]:text-[18px]
                max-[960px]:[&_h3]:text-[16px] max-[760px]:[&_h3]:text-[17px]
                max-[540px]:[&_h3]:text-[19px] max-[400px]:[&_h3]:text-[15px] [&_p]:mt-2
                [&_p]:mb-5 [&_p]:min-h-0 [&_p]:text-[12px] [&_p]:leading-[1.7]
                [&_p]:text-[#8a9bb0] max-[400px]:[&_p]:text-[9px] [&.selected]:border-primary
                [&.selected]:bg-[#162332] [&.selected_.option-checkbox]:border-primary
                [&.selected_.option-checkbox]:bg-primary
                [&.selected_.option-checkbox]:text-background
                [&.selected_[data-ui~='option-radio']]:border-primary
                [&.selected_[data-ui~='option-radio']]:bg-primary
                [&.selected_[data-ui~='option-radio']]:text-background
              "
              :class="{ selected: input.project === project.id }"
              :aria-pressed="input.project === project.id"
              aria-controls="project-details"
              :aria-expanded="input.project === project.id"
              @click="chooseProject(project.id)"
            >
              <div
                data-ui="option-card-top"
                class="mb-5 flex w-full items-start justify-between text-primary max-[540px]:mb-4 max-[400px]:mb-[23px]"
              >
                <AppIcon
                  :name="quoteProjectCopy[project.id]?.icon || 'monitor'"
                  :size="26"
                />
                <span
                  data-ui="option-radio"
                  class="grid h-5 w-5 place-items-center rounded-[50%] border border-solid border-[#657487]"
                >
                  <AppIcon
                    v-if="input.project === project.id"
                    name="check"
                    :size="14"
                  />
                </span>
              </div>
              <h3>{{ project.label }}</h3>
              <span data-ui="option-scope">{{ quoteProjectCopy[project.id]?.scope }}</span>
              <p>{{ quoteShortDescriptions[project.id] || project.description }}</p>
              <span
                data-ui="option-price"
                class="
                  mt-auto block pt-1 text-[14px] font-semibold text-[#c5def5]
                  max-[400px]:text-[12px] [&_small]:ml-[3px] [&_small]:text-[9px]
                  [&_small]:font-normal [&_small]:text-[#7e94ac]
                "
              >
                od {{ formatMoney(project.price) }}
                <small>netto</small>
                <AppIcon
                  name="down"
                  :size="17"
                />
              </span>
            </button>
          </div>

          <p
            data-ui="calculator-note"
            class="mt-5.5 flex items-start gap-[9px] text-[10px] text-[#8094ab] [&_svg]:text-primary"
          >
            <AppIcon
              name="check"
              :size="16"
            />
            Wersja mobilna i wdrożenie w każdym wariancie. Pełny zakres znajdziesz pod konfiguracją.
          </p>
        </section>
        <Transition name="quote-reveal">
          <section
            v-if="helpMode && !sent"
            id="quote-guide"
            ref="guideRoot"
            data-ui="quote-section quote-guide"
            class="
              [scroll-margin-top:110px] rounded-card border border-solid border-[#3b536a]
              bg-[#111923] p-[27px] [outline:none] max-[760px]:[scroll-margin-top:92px]
              max-[760px]:p-5.5 max-[540px]:px-4.5 max-[540px]:py-[21px]
              [&_+_[data-ui~='quote-section']]:mt-11
              [&_[data-ui~='quote-answer-copy']_strong]:text-[12px]
              [&_[data-ui~='quote-answer-grid']]:grid-cols-2
              max-[760px]:[&_[data-ui~='quote-answer-grid']]:grid-cols-1
            "
            tabindex="-1"
            aria-labelledby="guide-heading"
          >
            <div
              data-ui="quote-section-heading"
              class="
                mb-6.5 flex items-start gap-[17px] max-[760px]:grid
                max-[760px]:grid-cols-[34px_minmax(0,_1fr)] max-[760px]:flex-wrap
                max-[760px]:gap-3 max-[760px]:[&_>_div]:[grid-column:2]
                max-[760px]:[&_>_div]:min-w-0 max-[540px]:[&_>_div]:flex-1 [&_h2]:text-[28px]
                [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.035em] max-[760px]:[&_h2]:text-[25px]
                [&_p]:mt-[9px] [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-muted
                max-[760px]:[&_p]:text-[13px]
              "
            >
              <span
                data-ui="quote-section-number"
                class="
                  grid h-8.5 w-8.5 shrink-0 place-items-center rounded-control border
                  border-solid border-line text-[11px] text-primary max-[760px]:[grid-row:1]
                "
              >
                02
              </span>
              <div>
                <h2 id="guide-heading">Zacznijmy od jednej rzeczy.</h2>
                <p>Co ma móc zrobić osoba, która wejdzie na Twoją stronę?</p>
              </div>
            </div>
            <QuoteChoiceGroup
              v-model="guideChoice"
              name="guide-purpose"
              question="Wybierz sytuację najbliższą Twojemu pomysłowi"
              :options="guideOptions"
            />
            <Transition name="quote-reveal">
              <div
                v-if="recommendation"
                data-ui="quote-recommendation"
                class="
                  mt-[23px] rounded-card border border-solid border-[#426481]
                  bg-[var(--surface-accent)] p-[23px] max-[540px]:p-[19px] [&_>_div]:mt-5
                  [&_>_div]:flex [&_>_div]:flex-wrap [&_>_div]:items-center
                  [&_>_div]:justify-between [&_>_div]:gap-5
                  max-[540px]:[&_[data-ui~='button']]:w-full
                  max-[540px]:[&_[data-ui~='button']]:justify-between [&_h3]:mt-[13px]
                  [&_h3]:text-[23px] [&_p]:mt-3 [&_p]:text-[12px] [&_p]:leading-[1.8]
                  [&_p]:text-[#acbbce] [&_strong]:text-[15px] [&_strong]:font-medium
                  [&_strong]:text-primary
                "
                role="status"
              >
                <span
                  data-ui="eyebrow"
                  class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
                >
                  Dobry punkt wyjścia
                </span>
                <h3>{{ recommendation.label }}</h3>
                <p>{{ recommendation.description }}</p>
                <div>
                  <strong>od {{ formatMoney(recommendation.price) }} netto</strong>
                  <button
                    data-ui="button button-small"
                    class="
                      inline-flex min-h-10.5 items-center justify-center gap-6 rounded-control
                      border border-solid border-primary bg-primary px-4.5 py-[11px] text-[11px]
                      font-bold whitespace-nowrap text-[#111b27]
                      [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
                      pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
                      [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                      pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
                    "
                    @click="chooseProject(recommendation.id)"
                  >
                    Dopasuj ten wariant
                    <AppIcon name="right" />
                  </button>
                </div>
              </div>
            </Transition>
            <div
              data-ui="quote-guide-shortcut"
              class="
                mt-[25px] [&_[data-ui~='text-link']]:mt-2.5
                [&_[data-ui~='text-link']]:text-[12px] [&_p]:text-[12px] [&_p]:text-muted
              "
            >
              <p>
                Trudno to jeszcze określić? Wystarczy kilka zdań o firmie i problemie, który chcesz
                rozwiązać.
              </p>
              <button
                data-ui="text-link"
                class="
                  inline-flex items-center justify-start gap-3.5 border-0 border-solid
                  bg-transparent px-0 py-3 text-[12px] font-medium text-ink
                  [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                  pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
                "
                @click="openContact()"
              >
                Wolę opisać pomysł
                <AppIcon
                  name="right"
                  :size="17"
                />
              </button>
            </div>
          </section>
        </Transition>
        <Transition name="quote-reveal">
          <section
            v-if="selectedProject && !sent"
            id="project-details"
            ref="detailsRoot"
            data-ui="quote-section"
            class="
              quote-details [scroll-margin-top:110px] [outline:none]
              max-[760px]:[scroll-margin-top:92px] [&_+_[data-ui~='quote-section']]:mt-11
            "
            tabindex="-1"
            aria-labelledby="details-heading"
          >
            <div
              data-ui="quote-section-heading"
              class="
                mb-6.5 flex items-start gap-[17px] max-[760px]:grid
                max-[760px]:grid-cols-[34px_minmax(0,_1fr)] max-[760px]:flex-wrap
                max-[760px]:gap-3 max-[760px]:[&_>_div]:[grid-column:2]
                max-[760px]:[&_>_div]:min-w-0 max-[540px]:[&_>_div]:flex-1 [&_h2]:text-[28px]
                [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.035em] max-[760px]:[&_h2]:text-[25px]
                [&_p]:mt-[9px] [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-muted
                max-[760px]:[&_p]:text-[13px]
              "
            >
              <span
                data-ui="quote-section-number"
                class="
                  grid h-8.5 w-8.5 shrink-0 place-items-center rounded-control border
                  border-solid border-line text-[11px] text-primary max-[760px]:[grid-row:1]
                "
              >
                02
              </span>
              <div>
                <h2 id="details-heading">{{ selectedProject.label }} — wybierz zakres</h2>
                <p>
                  Kliknij odpowiedź, żeby zobaczyć, co dokładnie oznacza. Możesz też wybrać „Nie
                  wiem”.
                </p>
              </div>
              <button
                data-ui="text-link quote-change"
                class="
                  ml-auto inline-flex items-center justify-start gap-3.5 border-0 border-solid
                  bg-transparent px-0 pt-[7px] pb-3 text-[10px] font-medium whitespace-nowrap
                  text-ink max-[1100px]:text-[9px] max-[760px]:[grid-column:2] max-[760px]:m-0
                  max-[760px]:justify-self-start max-[760px]:p-0 max-[760px]:text-[12px]
                  [&_svg]:[transform:rotate(180deg)]
                  [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                  pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
                "
                @click="moveTo(choicesRoot)"
              >
                Zmień projekt
                <AppIcon
                  name="down"
                  :size="14"
                />
              </button>
            </div>
            <div
              data-ui="quote-scope-note"
              class="
                mb-2.5 flex gap-[15px] rounded-card border border-solid border-[#3b536a]
                bg-[var(--surface-accent)] p-5 [&_>_svg]:mt-0.5 [&_>_svg]:shrink-0
                [&_>_svg]:text-primary [&_p]:text-[14px] [&_p]:leading-[1.8] [&_p]:text-[#b2bfd0]
                max-[760px]:[&_p]:text-[13px] [&_strong]:[font-weight:550] [&_strong]:text-ink
              "
            >
              <AppIcon
                :name="quoteProjectCopy[input.project]?.icon || 'monitor'"
                :size="22"
              />
              <p v-if="input.project === 'landing'">
                <strong>Jedna strona, jeden adres.</strong>
                Ofertę, korzyści i kontakt umieszczamy w kolejnych sekcjach. Osobne podstrony
                wymagają wariantu strony firmowej.
              </p>
              <p v-else-if="input.project === 'website'">
                <strong>Do 5 podstron w cenie bazowej.</strong>
                Na przykład: strona główna, o firmie, oferta, realizacje i kontakt. Kolejne
                podstrony: +250 zł każda.
              </p>
              <p v-else-if="input.project === 'store'">
                <strong>Katalog, koszyk i zamówienia.</strong>
                Liczbę produktów, płatności, dostawę i połączenia z innymi systemami potwierdzimy po
                rozmowie.
              </p>
              <p v-else>
                <strong>Najpierw proces, później funkcje.</strong>
                Kwota bazowa to punkt wyjścia. Zakres ekranów, kont i logiki aplikacji wymaga
                indywidualnego ustalenia.
              </p>
            </div>
            <QuoteChoiceGroup
              v-if="hasPages"
              v-model="pageChoice"
              name="quote-pages"
              question="Jak rozbudowana ma być strona firmowa?"
              hint="Podstrona ma własny adres, np. oferta, o firmie lub kontakt. Sekcje na jednej stronie nie zwiększają liczby podstron."
              :options="[
                {
                  value: 'base',
                  label: 'Do 5 podstron',
                  price: 'W cenie',
                  explanation:
                    'W cenie bazowej przygotowuję do 5 podstron. Wspólnie ustalimy menu, np. strona główna, oferta, realizacje, o firmie i kontakt.',
                },
                {
                  value: 'custom',
                  label: 'Więcej podstron',
                  price: '+250 zł / podstrona',
                  explanation:
                    'Wybierz łączną liczbę poniżej. Pierwsze 5 jest w cenie, każda kolejna kosztuje 250 zł netto. To wariant dla rozbudowanych ofert lub osobnych opisów usług.',
                },
                {
                  value: 'unsure',
                  label: 'Nie wiem jeszcze',
                  explanation:
                    'Ułożymy strukturę po rozmowie o ofercie. Na potrzeby wstępnej kwoty przyjmuję do 5 podstron i zapisuję liczbę jako temat do omówienia.',
                },
              ]"
            >
              <Transition name="quote-reveal">
                <div
                  v-if="pageChoice === 'custom'"
                  data-ui="quote-followup"
                  class="
                    mt-[15px] rounded-card border border-solid border-line bg-surface p-5
                    [&_>_label]:flex [&_>_label]:items-center [&_>_label]:justify-between
                    [&_>_label]:text-[12px] [&_>_label_strong]:text-[20px]
                    [&_>_label_strong]:text-primary [&_input[type='range']]:mt-5.5
                    [&_input[type='range']]:mb-2.5 [&_input[type='range']]:w-full
                    [&_input[type='range']]:[accent-color:var(--blue)] [&_select]:text-[12px]
                  "
                >
                  <label for="pages">
                    Łączna liczba podstron
                    <strong>{{ input.pages }}</strong>
                  </label>
                  <input
                    id="pages"
                    v-model.number="input.pages"
                    type="range"
                    min="6"
                    max="30"
                  />
                  <div
                    data-ui="quote-range-caption"
                    class="flex justify-between gap-2.5 text-[10px] text-muted max-[760px]:text-[9px]"
                  >
                    <span>6</span>
                    <span>5 w cenie, pozostałe +250 zł</span>
                    <span>30</span>
                  </div>
                </div>
              </Transition>
              <p
                v-if="pageChoice === 'unsure'"
                data-ui="quote-assumption"
                class="mt-3.5 text-[11px] text-primary"
              >
                Na potrzeby szacunku przyjmuję do 5 podstron. Strukturę potwierdzimy po rozmowie.
              </p>
            </QuoteChoiceGroup>
            <template v-if="input.project === 'store'">
              <QuoteChoiceGroup
                v-model="input.productRange!"
                name="quote-products"
                question="Ile produktów będzie w sklepie na start?"
                hint="Wybierz orientacyjną wielkość katalogu. Warianty, np. rozmiar i kolor, uzgodnimy przy przygotowaniu danych."
                :options="productOptions"
              />
              <QuoteChoiceGroup
                v-model="input.productEntry!"
                name="quote-product-entry"
                question="Kto wprowadzi produkty do sklepu?"
                hint="Panel dodawania produktów jest w cenie sklepu. Osobno wyceniana jest praca przy wprowadzeniu katalogu przez Makoto."
                :options="productEntryOptions"
              />
            </template>
            <QuoteChoiceGroup
              v-if="input.project !== 'application'"
              v-model="input.design!"
              name="quote-design"
              question="Jak przygotujemy wygląd projektu?"
              hint="Wybierasz sposób projektowania. Logo, teksty i zdjęcia są osobnymi materiałami, które omówimy w kolejnych pytaniach."
              :options="designOptions"
            />
            <QuoteChoiceGroup
              v-else
              v-model="input.appPurpose!"
              name="quote-app-purpose"
              question="Jaki proces ma obsługiwać aplikacja?"
              hint="Wybierz najbliższy przykład. Funkcje i cenę końcową ustalimy po rozmowie o sposobie pracy Twojej firmy."
              :options="quoteAppPurposes"
            />
            <QuoteChoiceGroup
              v-for="extra in visibleExtras"
              :key="extra.id"
              v-model="answers[extra.id]!"
              :name="'quote-' + extra.id"
              :question="quoteExtraQuestions[extra.id]!.question"
              :hint="quoteExtraQuestions[extra.id]!.hint"
              :options="extraOptions(extra.id, extra.price)"
            />
            <QuoteChoiceGroup
              v-model="languageChoice"
              name="quote-languages"
              question="W ilu językach ma być dostępny projekt?"
              hint="Dodatkowa wersja językowa ma własne treści i adresy. Przygotowanie tłumaczeń ustalimy osobno."
              :options="[
                {
                  value: 'one',
                  label: 'Jeden język',
                  price: 'W cenie',
                  explanation:
                    'Przygotowuję projekt w jednym uzgodnionym języku. To wariant uwzględniony w cenie bazowej.',
                },
                {
                  value: 'many',
                  label: 'Więcej niż jeden',
                  price: '+800 zł / język',
                  explanation:
                    'Wybierz łączną liczbę języków poniżej. Dopłata obejmuje dodatkową wersję i przełączanie języka. Tłumaczenia dostarczasz lub wyceniamy osobno.',
                },
                {
                  value: 'unsure',
                  label: 'Nie wiem jeszcze',
                  explanation:
                    'Dobierzemy wersje do rzeczywistych odbiorców. Wstępna kwota obejmuje jeden język; dodatkowe wersje potwierdzimy przy ustalaniu zakresu.',
                },
              ]"
            >
              <Transition name="quote-reveal">
                <div
                  v-if="languageChoice === 'many'"
                  data-ui="quote-followup"
                  class="
                    mt-[15px] rounded-card border border-solid border-line bg-surface p-5
                    [&_>_label]:flex [&_>_label]:items-center [&_>_label]:justify-between
                    [&_>_label]:text-[12px] [&_>_label_strong]:text-[20px]
                    [&_>_label_strong]:text-primary [&_input[type='range']]:mt-5.5
                    [&_input[type='range']]:mb-2.5 [&_input[type='range']]:w-full
                    [&_input[type='range']]:[accent-color:var(--blue)] [&_select]:text-[12px]
                  "
                >
                  <label for="languages">Łączna liczba języków</label>
                  <select
                    id="languages"
                    v-model.number="input.languages"
                  >
                    <option
                      v-for="n in [2, 3, 4, 5]"
                      :key="n"
                      :value="n"
                    >
                      {{ n }} języki · +{{ formatMoney((n - 1) * 800) }}
                    </option>
                  </select>
                </div>
              </Transition>
            </QuoteChoiceGroup>
            <QuoteChoiceGroup
              v-model="timingChoice"
              name="quote-timing"
              question="Jak pilny jest termin realizacji?"
              hint="Jeśli masz datę wydarzenia lub planowanego startu, podaj ją w formularzu."
              :options="[
                {
                  value: 'standard',
                  label: 'Standardowy harmonogram',
                  price: 'W cenie',
                  explanation:
                    'Ustalamy etapy i termin zgodnie z zakresem projektu oraz dostępnością. Ten wariant nie dolicza dopłaty za priorytet.',
                },
                {
                  value: 'urgent',
                  label: 'Realizacja priorytetowa',
                  price: '+25%',
                  explanation:
                    'Kalkulator dodaje 25% do wycenionych elementów jednorazowych. Przyspieszony termin potwierdzę po sprawdzeniu dostępności i gotowości materiałów.',
                },
                {
                  value: 'unsure',
                  label: 'Nie wiem jeszcze',
                  explanation:
                    'Termin ustalimy po rozmowie. Szacunek pozostaje w standardowym trybie, bez dopłaty za priorytet.',
                },
              ]"
            />
            <div
              data-ui="quote-question quote-aftercare"
              class="
                m-0 min-w-0 border-t-0 border-r-0 border-b border-l-0 border-solid border-b-line
                px-0 py-[27px] [&_h3]:mb-2 [&_h3]:text-[20px] [&_h3]:[font-weight:550]
                max-[760px]:[&_h3]:text-[19px] [&_legend]:float-left [&_legend]:mb-2
                [&_legend]:w-full [&_legend]:text-[20px] [&_legend]:leading-[1.5]
                [&_legend]:[font-weight:550] [&_legend]:tracking-[-0.025em]
                max-[760px]:[&_legend]:text-[19px] [&_legend_+_*]:clear-both
              "
            >
              <h3>Co po uruchomieniu?</h3>
              <p
                data-ui="quote-question-hint"
                class="mb-4.5 max-w-[660px] text-[14px] leading-[1.8] text-muted max-[760px]:text-[13px]"
              >
                Opcjonalne usługi miesięczne. Ich koszt pokazuję osobno od wykonania projektu.
              </p>
              <div
                data-ui="quote-monthly-options"
                class="
                  grid gap-2.5 [&_[data-ui~='quote-answer']]:items-start
                  [&_[data-ui~='quote-answer']]:p-4.5
                  max-[540px]:[&_[data-ui~='quote-answer']]:flex-wrap
                  max-[540px]:[&_[data-ui~='quote-answer']]:p-[15px]
                  [&_[data-ui~='quote-answer-copy']_small]:text-[11px]
                  [&_[data-ui~='quote-answer-copy']_strong]:text-[12px]
                  max-[540px]:[&_[data-ui~='quote-answer-price']]:basis-full
                  max-[540px]:[&_[data-ui~='quote-answer-price']]:pl-[25px]
                "
              >
                <label
                  v-for="option in visibleMonthly"
                  :key="option.id"
                  data-ui="quote-answer"
                  class="
                    relative flex min-w-0 cursor-pointer items-start gap-2.5 rounded-control
                    border border-solid border-line bg-surface px-[13px] py-[15px]
                    [transition:background_160ms_ease,_border-color_160ms_ease]
                    motion-reduce:[transition-duration:0ms] max-[760px]:p-[17px]
                    pointer-hover:hover:border-[#7994b0] [&_input]:absolute [&_input]:m-0!
                    [&_input]:h-[1px] [&_input]:w-[1px]! [&_input]:opacity-[0]
                    [&.is-selected]:border-[#809db9] [&.is-selected]:bg-[var(--surface-accent)]
                    [&.is-selected_[data-ui~='quote-answer-checkbox']]:bg-primary
                    [&.is-selected_[data-ui~='quote-answer-radio']]:border-primary
                    [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:h-[7px]
                    [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:w-[7px]
                    [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:rounded-[50%]
                    [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:bg-primary
                    [&.selected_.option-checkbox]:border-primary
                    [&.selected_.option-checkbox]:bg-primary
                    [&.selected_.option-checkbox]:text-background
                    [&.selected_[data-ui~='option-radio']]:border-primary
                    [&.selected_[data-ui~='option-radio']]:bg-primary
                    [&.selected_[data-ui~='option-radio']]:text-background
                    [&:focus-within]:[outline:2px_solid_var(--blue)]
                    [&:focus-within]:[outline-offset:3px]
                  "
                  :class="{ 'is-selected': input.monthly.includes(option.id) }"
                >
                  <input
                    type="checkbox"
                    :checked="input.monthly.includes(option.id)"
                    @change="toggleMonthly(option.id)"
                  />
                  <span
                    data-ui="quote-answer-radio quote-answer-checkbox"
                    class="
                      mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[4px] border
                      border-solid border-[#687a8d] text-background
                    "
                    aria-hidden="true"
                  >
                    <AppIcon
                      v-if="input.monthly.includes(option.id)"
                      name="check"
                      :size="12"
                    />
                  </span>
                  <span
                    data-ui="quote-answer-copy"
                    class="
                      min-w-0 flex-1 pr-[7px] [&_small]:mt-[5px] [&_small]:block
                      [&_small]:text-[12px] [&_small]:leading-[1.6] [&_small]:text-muted
                      max-[760px]:[&_small]:text-[11px] [&_strong]:block [&_strong]:text-[14px]
                      [&_strong]:leading-[1.5] [&_strong]:font-medium
                      max-[760px]:[&_strong]:text-[14px]
                    "
                  >
                    <strong>{{ option.label }}</strong>
                    <small>{{ option.description }}</small>
                  </span>
                  <span
                    data-ui="quote-answer-price"
                    class="text-[10px] whitespace-nowrap text-primary max-[760px]:text-[11px]"
                  >
                    {{ formatMoney(option.price) }} / mies.
                  </span>
                </label>
              </div>
              <button
                data-ui="quote-defer"
                class="
                  flex items-center gap-2 border-0 border-solid px-0 pt-3.5 pb-0 text-left
                  text-[11px] text-muted [background:none] [&[aria-pressed='true']]:text-primary
                "
                :aria-pressed="monthlyUnsure"
                @click="deferMonthly()"
              >
                <AppIcon
                  :name="monthlyUnsure ? 'check' : 'plus'"
                  :size="15"
                />
                Nie wiem jeszcze — omówmy opiekę po wdrożeniu
              </button>
            </div>
            <div
              data-ui="quote-included"
              class="
                mt-[35px] rounded-card border border-solid border-[#40556b] bg-surface p-7
                max-[760px]:p-5.5 [&_>_p]:mt-[15px] [&_>_p]:text-[14px] [&_>_p]:leading-[1.8]
                [&_>_p]:text-muted max-[760px]:[&_>_p]:text-[13px]
                [&_[data-ui~='quote-included-costs']]:mt-7
                [&_[data-ui~='quote-included-costs']]:border-t
                [&_[data-ui~='quote-included-costs']]:[border-top-style:solid]
                [&_[data-ui~='quote-included-costs']]:border-t-line
                [&_[data-ui~='quote-included-costs']]:pt-5.5
                [&_[data-ui~='quote-included-costs']]:text-[12px] [&_h3]:mt-[15px]
                [&_h3]:text-[28px] [&_h3]:tracking-[-0.04em] max-[760px]:[&_h3]:text-[25px]
                [&_li]:flex [&_li]:gap-[11px] [&_li]:text-[14px] [&_li]:leading-[1.7]
                max-[760px]:[&_li]:text-[13px] [&_li_svg]:mt-[3px] [&_li_svg]:shrink-0
                [&_li_svg]:text-primary [&_ul]:mt-[23px] [&_ul]:grid [&_ul]:list-none
                [&_ul]:gap-3.5 [&_ul]:p-0
              "
              aria-labelledby="included-heading"
            >
              <span
                data-ui="eyebrow"
                class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
              >
                Zakres / {{ selectedProject.label }}
              </span>
              <h3 id="included-heading">
                {{
                  input.project === 'application'
                    ? 'Co obejmuje współpraca?'
                    : 'Co obejmuje cena bazowa?'
                }}
              </h3>
              <p>
                {{
                  input.project === 'application'
                    ? 'Cena od ' +
                      formatMoney(selectedProject.price) +
                      ' jest punktem wyjścia. Konkretne funkcje i kryteria odbioru ustalamy indywidualnie.'
                    : 'Ten zakres jest punktem wyjścia dla wybranego wariantu. Dopłaty za wygląd i dodatkowe usługi pokazuję w podsumowaniu.'
                }}
              </p>
              <ul>
                <li
                  v-for="item in quoteBaseIncluded[input.project]"
                  :key="item"
                >
                  <AppIcon
                    name="check"
                    :size="17"
                  />
                  <span>{{ item }}</span>
                </li>
              </ul>
              <div
                v-if="input.project === 'application' && selectedAppPurpose?.features.length"
                data-ui="quote-included-extra"
                class="
                  mt-6.5 border-t [border-top-style:solid] border-t-line pt-6 [&_>_p]:mt-3
                  [&_>_p]:text-[13px] [&_>_p]:text-muted [&_h4]:text-[17px]
                  [&_h4]:[font-weight:550] [&_h4]:text-primary
                "
              >
                <h4>{{ selectedAppPurpose.label }} — funkcje do uzgodnienia</h4>
                <p>Przykładowy zakres, który doprecyzujemy przed ofertą:</p>
                <ul>
                  <li
                    v-for="feature in selectedAppPurpose.features"
                    :key="feature"
                  >
                    <AppIcon
                      name="check"
                      :size="16"
                    />
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              <div
                v-for="id in includedExtras"
                :key="id"
                data-ui="quote-included-extra"
                class="
                  mt-6.5 border-t [border-top-style:solid] border-t-line pt-6 [&_>_p]:mt-3
                  [&_>_p]:text-[13px] [&_>_p]:text-muted [&_h4]:text-[17px]
                  [&_h4]:[font-weight:550] [&_h4]:text-primary
                "
              >
                <h4>{{ quoteExtraIncluded[id]!.title }} — wybrany dodatek</h4>
                <ul>
                  <li
                    v-for="item in quoteExtraIncluded[id]!.items"
                    :key="item"
                  >
                    <AppIcon
                      name="check"
                      :size="16"
                    />
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
              <p data-ui="quote-included-costs">
                Osobno płatne są domena, hosting, abonamenty operatorów, ewentualne licencje i
                tłumaczenia. Opiekę miesięczną wybierasz niezależnie od wykonania projektu.
              </p>
            </div>
            <div
              data-ui="quote-next"
              class="
                mt-7 flex flex-wrap items-center justify-between gap-5
                max-[540px]:[&_[data-ui~='button']]:w-full
                max-[540px]:[&_[data-ui~='button']]:justify-between [&_p]:max-w-[260px]
                [&_p]:text-[11px] [&_p]:text-muted
              "
            >
              <p>Możesz wysłać projekt także z pytaniami pozostawionymi do ustalenia.</p>
              <button
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
                @click="openContact()"
              >
                Poproś o ofertę
                <AppIcon name="right" />
              </button>
            </div>
          </section>
        </Transition>
        <Transition name="quote-reveal">
          <section
            v-if="showContact"
            id="quote-contact"
            ref="contactRoot"
            data-ui="quote-section quote-contact"
            class="
              [scroll-margin-top:110px] rounded-card border border-solid border-line bg-surface
              p-7 [outline:none] max-[760px]:[scroll-margin-top:92px] max-[760px]:p-5.5
              max-[540px]:px-4.5 max-[540px]:py-[21px] [&_+_[data-ui~='quote-section']]:mt-11
              [&_[data-ui~='contact-form']]:mt-[25px]
              max-[540px]:[&_[data-ui~='form-row']]:grid-cols-1
            "
            tabindex="-1"
            aria-labelledby="contact-heading"
          >
            <template v-if="!sent">
              <div
                data-ui="quote-section-heading"
                class="
                  mb-6.5 flex items-start gap-[17px] max-[760px]:grid
                  max-[760px]:grid-cols-[34px_minmax(0,_1fr)] max-[760px]:flex-wrap
                  max-[760px]:gap-3 max-[760px]:[&_>_div]:[grid-column:2]
                  max-[760px]:[&_>_div]:min-w-0 max-[540px]:[&_>_div]:flex-1 [&_h2]:text-[28px]
                  [&_h2]:leading-[1.3] [&_h2]:tracking-[-0.035em] max-[760px]:[&_h2]:text-[25px]
                  [&_p]:mt-[9px] [&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-muted
                  max-[760px]:[&_p]:text-[13px]
                "
              >
                <span
                  data-ui="quote-section-number"
                  class="
                    grid h-8.5 w-8.5 shrink-0 place-items-center rounded-control border
                    border-solid border-line text-[11px] text-primary max-[760px]:[grid-row:1]
                  "
                >
                  03
                </span>
                <div>
                  <h2 id="contact-heading">Porozmawiajmy o Twoim pomyśle.</h2>
                  <p v-if="quote">
                    Wyślę wybraną konfigurację i sprawy, które chcesz jeszcze omówić.
                  </p>
                  <p v-else>
                    Nie musisz wybierać typu strony. Dobierzemy zakres na podstawie Twojej
                    wiadomości.
                  </p>
                </div>
              </div>
              <div
                v-if="brief.undecided.length && quote"
                data-ui="quote-contact-note"
                class="
                  rounded-control border border-solid border-[#3b536a] bg-[var(--surface-accent)]
                  px-4 py-3.5 text-[11px] leading-[1.8] text-[#b7c6d6]
                "
              >
                Do omówienia: {{ undecidedText }}.
              </div>
            </template>
            <ContactForm
              source="calculator"
              :configuration="input.project ? input : undefined"
              :brief="brief"
              :city="city"
              @sent="sent = true"
            />
          </section>
        </Transition>
      </div>
      <aside
        v-if="!sent"
        data-ui="quote-summary"
        class="
          sticky top-[115px] rounded-card border border-solid border-[#2d4259] bg-[#111b27]
          p-[27px] max-[1200px]:p-[23px] max-[960px]:p-[21px] max-[760px]:static
          max-[760px]:[order:-1] max-[760px]:p-6 [&_h3]:mt-[23px] [&_h3]:mb-6.5
          [&_h3]:text-[21px] max-[760px]:[&_h3]:hidden
        "
        aria-labelledby="summary-heading"
      >
        <div
          data-ui="quote-summary-top"
          class="
            flex items-center justify-between gap-2.5 text-primary max-[760px]:mb-2.5
            [&_[data-ui~='eyebrow']]:text-[8px] [&_[data-ui~='eyebrow']]:text-[#9fbbd9]
          "
        >
          <span
            data-ui="eyebrow"
            class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            Na bieżąco / Bez zobowiązań
          </span>
          <AppIcon
            name="options"
            :size="20"
          />
        </div>
        <h2 id="summary-heading">Twój orientacyjny budżet.</h2>
        <template v-if="quote">
          <div
            data-ui="quote-lines"
            class="
              grid gap-[15px] border-b [border-bottom-style:solid] border-b-[#324255] pb-[27px]
              max-[760px]:gap-2.5 max-[760px]:pt-3.5 max-[760px]:pb-4.5 [&_>_div]:flex
              [&_>_div]:justify-between [&_>_div]:gap-3.5 [&_>_div]:text-[10px]
              [&_>_div]:text-[#9db0c8] [&_strong]:text-[10px] [&_strong]:font-medium
              [&_strong]:whitespace-nowrap [&_strong]:text-[#d3e1f3]
            "
          >
            <div
              v-for="line in quote.lines"
              :key="line.label"
            >
              <span>{{ line.label }}</span>
              <strong>{{ formatMoney(line.price) }}</strong>
            </div>
          </div>
          <div
            data-ui="quote-total"
            class="
              grid gap-[9px] py-6.5 max-[760px]:py-4.5 [&_>_small]:text-[9px]
              [&_>_small]:text-[#859eba] max-[760px]:[&_>_small]:text-[9px] [&_>_span]:text-[9px]
              [&_>_span]:text-[#96abc5] [&_>_strong]:text-[43px] [&_>_strong]:leading-[1.1]
              [&_>_strong]:[font-weight:450] [&_>_strong]:tracking-[-0.05em]
              [&_>_strong]:text-primary max-[960px]:[&_>_strong]:text-[36px]
              max-[760px]:[&_>_strong]:text-[43px]
            "
          >
            <span>{{ quote.requiresIndividual ? 'Kwota początkowa' : 'Wykonanie projektu' }}</span>
            <strong aria-live="polite">
              {{ quote.requiresIndividual ? 'od ' : '' }}{{ formatMoney(quote.total) }}
            </strong>
            <small>netto / jednorazowo</small>
          </div>
          <div
            v-if="quote.requiresIndividual"
            data-ui="quote-individual-note"
            class="
              mt-4 rounded-control border border-solid border-[#49627c]
              bg-[var(--surface-accent)] p-[15px] text-[#d2dce8] [&_>_strong]:text-[12px]
              [&_>_strong]:text-primary [&_ul]:mt-[9px] [&_ul]:pl-4 [&_ul]:text-[12px]
              [&_ul]:leading-[1.7]
            "
          >
            <strong>Pełna wycena po rozmowie</strong>
            <ul>
              <li
                v-for="reason in quote.individualReasons"
                :key="reason"
              >
                {{ reason }}
              </li>
            </ul>
          </div>
          <dl
            v-if="quote.selections?.length"
            data-ui="quote-selected-summary"
            class="
              grid gap-[5px] border-b [border-bottom-style:solid] border-b-line py-[17px]
              [&_dd]:text-[12px] [&_dd]:leading-[1.6] [&_dd]:text-[#d0dce8] [&_dt]:mt-2
              [&_dt]:text-[11px] [&_dt]:text-muted
            "
          >
            <template
              v-for="selection in quote.selections"
              :key="selection.label"
            >
              <dt>{{ selection.label }}</dt>
              <dd>{{ selection.value }}</dd>
            </template>
          </dl>
          <div
            v-if="quote.monthly"
            data-ui="quote-monthly"
            class="
              grid gap-2.5 border-t [border-top-style:solid] border-t-[#2d4057] py-[15px]
              text-[9px] text-[#8da7c3] [&_>_div]:flex [&_>_div]:items-center
              [&_>_div]:justify-between [&_>_div]:gap-3.5 [&_>_p]:mt-2.5 [&_>_p]:flex
              [&_>_p]:items-center [&_>_p]:justify-between [&_>_p]:gap-3.5 [&_strong]:font-medium
              [&_strong]:text-[#c4ddf8]
            "
          >
            <div
              v-for="line in quote.monthlyLines"
              :key="line.label"
            >
              <span>{{ line.label }}</span>
              <strong>{{ formatMoney(line.price) }}</strong>
            </div>
            <p>
              Miesięcznie
              <strong>{{ formatMoney(quote.monthly) }} netto</strong>
            </p>
          </div>
          <div
            data-ui="quote-time"
            class="
              flex gap-3 rounded-control bg-[#1b2c3d] p-[13px] text-[10px] text-[#a8bdd3]
              max-[960px]:p-2.5 max-[960px]:text-[9px] max-[760px]:text-[10px] [&_>_span]:flex
              [&_>_span]:w-full [&_>_span]:justify-between [&_>_span]:gap-2.5
              [&_strong]:text-[10px] [&_strong]:font-medium max-[960px]:[&_strong]:text-[9px]
              max-[760px]:[&_strong]:text-[10px]
            "
          >
            <AppIcon
              name="clock"
              :size="18"
            />
            <span>
              Szacowany czas
              <strong>{{ quote.weeks }} tygodni</strong>
            </span>
          </div>
          <details
            v-if="brief.undecided.length"
            data-ui="quote-uncertainties"
            class="
              mt-[19px] border-t border-b [border-top-style:solid] [border-bottom-style:solid]
              border-t-line border-b-line py-3.5 [&_p]:mt-3 [&_p]:text-[10px] [&_p]:leading-[1.8]
              [&_p]:text-muted [&_summary]:flex [&_summary]:cursor-pointer [&_summary]:list-none
              [&_summary]:items-center [&_summary]:justify-between [&_summary]:text-[12px]
              [&_summary]:text-primary [&_summary::-webkit-details-marker]:hidden
              [&_ul]:mt-[13px] [&_ul]:pl-[17px] [&_ul]:text-[11px] [&_ul]:leading-[1.9]
              [&_ul]:text-[#b4bfcc] [&[open]_summary_svg]:[transform:rotate(45deg)]
            "
          >
            <summary>
              {{ undecidedCountLabel }}
              <AppIcon
                name="plus"
                :size="15"
              />
            </summary>
            <ul>
              <li
                v-for="id in brief.undecided"
                :key="id"
              >
                {{ quoteUndecidedLabels[id] }}
              </li>
            </ul>
            <p>
              Opcje „Nie wiem” nie doliczają dodatków. Zakres i ewentualne koszty potwierdzimy przed
              ofertą.
            </p>
          </details>
        </template>
        <div
          v-else
          data-ui="quote-builder-empty"
          class="
            pt-[29px] pb-2.5 text-primary [&_h3]:mt-5 [&_h3]:text-[16px] [&_h3]:font-medium
            [&_h3]:text-ink [&_p]:mt-3 [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-muted
          "
        >
          <AppIcon
            :name="helpMode ? 'sparkles' : 'options'"
            :size="29"
          />
          <h3>{{ helpMode ? 'Najpierw pomysł, potem wycena.' : 'Zacznij od celu projektu.' }}</h3>
          <p>
            {{
              helpMode
                ? 'Możesz opisać potrzebę bez wybierania funkcji i bez deklarowania budżetu.'
                : 'Wybierz jeden z wariantów. Pytania rozwiną się od razu, a kwota będzie zmieniać się przy odpowiedziach.'
            }}
          </p>
        </div>
        <button
          data-ui="button quote-summary-cta"
          class="
            mt-5.5 inline-flex min-h-13 w-full items-center justify-between gap-6 rounded-control
            border border-solid border-primary bg-primary px-4.5 py-[15px] text-[11px] font-bold
            whitespace-nowrap text-[#111b27]
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
          :disabled="!quote && !helpMode"
          @click="openContact()"
        >
          {{ quote ? 'Poproś o pełną ofertę' : 'Opisz swój pomysł' }}
          <AppIcon
            name="right"
            :size="17"
          />
        </button>
        <p
          data-ui="quote-disclaimer"
          class="mt-5.5 text-[9px] leading-[1.8] text-[#7f99b5] max-[760px]:mt-[15px] max-[760px]:text-[9px]"
        >
          To szacunek, nie wiążąca oferta. Dokładny zakres, termin i cenę potwierdzimy po rozmowie.
          Domena, tłumaczenia i zewnętrzne abonamenty są osobnymi kosztami.
        </p>
      </aside>
    </div>
    <div
      v-if="(quote || helpMode) && !sent && !showContact"
      data-ui="mobile-quote-bar"
      class="
        hidden max-[760px]:fixed max-[760px]:right-0 max-[760px]:bottom-0 max-[760px]:left-0
        max-[760px]:z-[40] max-[760px]:flex max-[760px]:items-center max-[760px]:justify-between
        max-[760px]:gap-[15px] max-[760px]:border-t max-[760px]:[border-top-style:solid]
        max-[760px]:border-t-[#3b536f] max-[760px]:bg-[#111d2ded] max-[760px]:px-5
        max-[760px]:pt-[13px] max-[760px]:pb-[max(13px,_env(safe-area-inset-bottom))]
        max-[760px]:shadow-[0_-10px_40px_#0004] max-[760px]:[backdrop-filter:blur(18px)]
        max-[760px]:[&_>_div]:grid max-[760px]:[&_>_div]:gap-1
        max-[760px]:[&_>_div_>_span]:text-[8px] max-[760px]:[&_>_div_>_span]:text-[#8ca6c7]
        max-[760px]:[&_[data-ui~='button']]:gap-[15px]
        max-[760px]:[&_[data-ui~='button']]:px-[15px]
        max-[760px]:[&_[data-ui~='button']]:text-[10px] max-[760px]:[&_small]:text-[8px]
        max-[760px]:[&_small]:text-[#6f8aab] max-[760px]:[&_strong]:text-[24px]
        max-[760px]:[&_strong]:leading-[1.1] max-[760px]:[&_strong]:font-medium
        max-[760px]:[&_strong]:tracking-[-0.04em] max-[760px]:[&_strong]:text-primary
      "
    >
      <div>
        <span>
          {{
            quote?.requiresIndividual
              ? 'Kwota początkowa / netto'
              : quote
                ? 'Projekt / netto'
                : 'Zakres do ustalenia'
          }}
        </span>
        <strong>
          {{
            quote
              ? (quote.requiresIndividual ? 'od ' : '') + formatMoney(quote.total)
              : 'Zacznijmy od rozmowy'
          }}
        </strong>
        <small v-if="quote?.monthly">+ {{ formatMoney(quote.monthly) }} / mies.</small>
      </div>
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
        @click="openContact()"
      >
        {{ quote ? 'Poproś o ofertę' : 'Opisz pomysł' }}
        <AppIcon
          name="right"
          :size="16"
        />
      </button>
    </div>
  </div>
</template>
