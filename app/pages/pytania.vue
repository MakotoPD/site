<script setup lang="ts">
import { pageGraph } from '#shared/schema'
import { siteOrigin } from '#shared/seo'
const { settings } = await useSite(),
  site = siteOrigin(useRuntimeConfig().public.siteUrl)
usePageSeo(
  'Strony internetowe — pytania i odpowiedzi',
  'Kto tworzy strony w Makoto, jaki jest zakres, budżet i obszar pracy? Konkretne odpowiedzi o stronach internetowych w Kujawsko-Pomorskiem.',
)
const websitePrice = computed(
  () => settings.value.projects.find((p) => p.id === 'website')?.price || 0,
)
const answers = computed(() => [
  {
    title: 'Kto stoi za Makoto?',
    text: `Makoto to marka, pod którą ${settings.value.name} projektuje i tworzy strony internetowe, sklepy oraz aplikacje. Łączy projektowanie interfejsów z wdrożeniem, a klient rozmawia bezpośrednio z osobą prowadzącą projekt.`,
    path: '/o-mnie',
    link: 'Poznaj autora projektów',
  },
  {
    title: 'Gdzie Makoto obsługuje projekty?',
    text: 'Obszar współpracy obejmuje Inowrocław, Toruń, Bydgoszcz, Grudziądz, Włocławek oraz całe województwo kujawsko-pomorskie. Projekty można prowadzić zdalnie: od briefu i akceptacji makiet po odbiór wdrożenia.',
    path: '/obszar-dzialania',
    link: 'Obszar obsługi i podstrony miast',
  },
  {
    title: 'Ile kosztuje strona firmowa?',
    text: `Orientacyjna cena bazowa w kalkulatorze to ${formatMoney(websitePrice.value)} netto za stronę firmową z maksymalnie 5 podstronami. CMS, dodatkowe języki, integracje i inne rozszerzenia zmieniają zakres. Ostateczna cena wymaga potwierdzenia po rozmowie; domena i zewnętrzne abonamenty są osobnymi kosztami.`,
    path: '/wycena',
    link: 'Oblicz orientacyjny budżet',
  },
  {
    title: 'Czy mogę samodzielnie zmieniać treści?',
    text: 'Tak, jeżeli panel CMS jest częścią projektu. Ustalamy, które elementy mają być edytowalne. Panel może obsługiwać treści usług, realizacje, szkice i publikację bloga. Po wdrożeniu otrzymujesz instrukcję obsługi.',
    path: '/uslugi/strony-internetowe',
    link: 'Zakres tworzenia stron',
  },
  {
    title: 'Jak sprawdzić doświadczenie?',
    text: 'W portfolio Makoto znajdziesz opisane projekty i użyte narzędzia. Treści odwołują się do rzeczywistych realizacji; nie przypisują im niepotwierdzonych wzrostów sprzedaży lub pozycji w Google.',
    path: '/realizacje',
    link: 'Zobacz portfolio',
  },
  {
    title: 'Co oznacza SEO i GEO w projekcie?',
    text: 'SEO techniczne porządkuje dostęp do treści, indeksowanie, metadane i adresy. Przygotowanie pod wyszukiwarki AI obejmuje również jasne opisy usług, dane firmy i odpowiedzi na pytania. Nie gwarantuje to konkretnego miejsca ani cytowania w odpowiedzi AI.',
    path: '/uslugi/seo-techniczne',
    link: 'Co obejmuje SEO techniczne i GEO',
  },
  {
    title: 'Jak długo trwa współpraca?',
    text: 'Termin zależy od liczby widoków, dostępności treści i integracji. Kalkulator pokazuje orientacyjny zakres tygodni. Wiążący harmonogram ustalamy po briefie i potwierdzeniu dostępności, zanim rozpocznie się projekt.',
    path: '/kontakt',
    link: 'Zapytaj o zakres i termin',
  },
  {
    title: 'Czy Makoto ma oddziały w każdym mieście?',
    text: `Makoto ma publiczny adres: ${settings.value.streetAddress}, ${settings.value.postalCode} ${settings.value.addressLocality}. Podstrony Torunia, Bydgoszczy, Grudziądza i Włocławka opisują obszar obsługi projektów. Formę spotkania uzgadniamy wcześniej.`,
    path: '/kontakt',
    link: 'Aktualny kontakt i Profil Firmy w Google',
  },
])
useStructuredData('makoto-page', () => ({
  '@context': 'https://schema.org',
  '@graph': pageGraph(
    site,
    '/pytania',
    'Pytania o Makoto i tworzenie stron internetowych',
    'Publiczne informacje o autorze, usługach, cenach i obszarze działania.',
    [
      { name: 'Makoto', path: '/' },
      { name: 'Pytania i odpowiedzi', path: '/pytania' },
    ],
  ),
}))
</script>
<template>
  <div
    data-ui="shell"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)]
    "
  >
    <header
      data-ui="page-heading local-heading"
      class="
        max-w-[1000px] pt-[45px] pb-15 max-[760px]:pt-7.5 max-[760px]:pb-10.5
        [&_>_p]:max-w-[780px] [&_>_p:not([data-ui~='section-label'])]:mt-[27px]
        [&_>_p:not([data-ui~='section-label'])]:text-[13px]
        [&_>_p:not([data-ui~='section-label'])]:text-[#95a2b3]
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:mt-5.5
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:text-[12px]
        [&_[data-ui~='section-label']]:mb-[25px] [&_[data-ui~='text-link']]:mb-[35px]
        [&_h1]:text-[clamp(48px,_6.1vw,_82px)] max-[760px]:[&_h1]:text-[48px]
      "
    >
      <SectionLabel text="Dobre pytania / Konkretne odpowiedzi" />
      <h1>
        Strony internetowe.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Co warto wiedzieć?
        </span>
      </h1>
      <p>
        Informacje o Makoto, zakresie współpracy i budżecie. Dobry punkt wyjścia, zanim opiszesz
        swój projekt.
      </p>
    </header>
    <div
      data-ui="answer-grid"
      class="mt-7.5 mb-15 grid grid-cols-2 gap-5 max-[760px]:grid-cols-1"
    >
      <article
        v-for="answer in answers"
        :key="answer.title"
        data-ui="answer-card"
        class="
          rounded-card border border-solid border-line bg-surface p-[27px] [&_a]:text-primary
          [&_a]:underline [&_h2]:mb-5 [&_h2]:text-[26px] [&_p]:text-[12px] [&_p]:text-[#98acc5]
        "
      >
        <h2>{{ answer.title }}</h2>
        <p>{{ answer.text }}</p>
        <NuxtLink
          :to="answer.path"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          {{ answer.link }}
          <AppIcon
            name="arrow"
            :size="16"
          />
        </NuxtLink>
      </article>
    </div>
  </div>
</template>
