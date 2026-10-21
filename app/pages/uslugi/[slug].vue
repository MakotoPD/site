<script setup lang="ts">
import { servicePages, servicePath } from '#shared/services'
import { pageGraph } from '#shared/schema'
import { siteOrigin, regionName } from '#shared/seo'
const route = useRoute(),
  service = servicePages.find((s) => s.slug === route.params.slug)
if (!service) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono usługi.' })
const { settings } = await useSite(),
  site = siteOrigin(useRuntimeConfig().public.siteUrl)
const price = computed(() =>
  service.priceId
    ? settings.value.projects.find((p) => p.id === service.priceId)?.price
    : service.monthlyId
      ? settings.value.monthly.find((p) => p.id === service.monthlyId)?.price
      : null,
)
usePageSeo(service.title, service.description)
useStructuredData('makoto-page', () => ({
  '@context': 'https://schema.org',
  '@graph': [
    ...pageGraph(site, servicePath(service.slug), service.title, service.description, [
      { name: 'Makoto', path: '/' },
      { name: 'Usługi', path: '/uslugi' },
      { name: service.name, path: servicePath(service.slug) },
    ]),
    {
      '@type': 'Service',
      '@id': site + servicePath(service.slug) + '#service',
      name: service.name,
      serviceType: service.title,
      description: service.lead,
      provider: { '@id': site + '/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: regionName },
      url: site + servicePath(service.slug),
    },
  ],
}))
const root = ref<HTMLElement | null>(null)
useMotion(root)
</script>
<template>
  <div
    v-if="service"
    ref="root"
    data-ui="shell"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)]
    "
  >
    <nav
      data-ui="breadcrumbs"
      class="
        flex flex-wrap items-center gap-2.5 pt-[35px] text-[10px] text-[#8295ac] max-[760px]:pt-6
        max-[760px]:text-[9px] [&_>_span]:text-[#5d738c] [&_a]:text-primary
      "
      aria-label="Ścieżka strony"
    >
      <NuxtLink to="/">Makoto</NuxtLink>
      <span>/</span>
      <NuxtLink to="/uslugi">Usługi</NuxtLink>
      <span>/</span>
      <span aria-current="page">{{ service.name }}</span>
    </nav>
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
      <SectionLabel
        text="Usługi / Kujawsko-Pomorskie"
        data-hero="0"
      />
      <!-- The dot is drawn with CSS so the heading text stays "Title." without a space. -->
      <h1
        data-hero="1"
        class="
          after:font-serif after:font-normal after:tracking-[-0.025em] after:text-primary
          after:italic after:content-['.']
        "
      >
        {{ service.title }}
      </h1>
      <p data-hero="2">{{ service.lead }}</p>
      <div
        data-ui="local-heading-actions"
        class="
          mt-[27px] flex flex-wrap items-center gap-[23px] max-[760px]:gap-[15px]
          max-[760px]:[&_[data-ui~='button']]:px-5
          max-[760px]:[&_[data-ui~='button']]:text-[11px] [&_[data-ui~='text-link']]:mb-0!
        "
        data-hero="3"
      >
        <NuxtLink
          :to="service.project ? `/wycena?project=${service.project}` : '/kontakt'"
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
        >
          {{ service.project ? 'Wyceń zakres projektu' : 'Porozmawiajmy o zakresie' }}
          <AppIcon name="arrow" />
        </NuxtLink>
        <NuxtLink
          to="/realizacje"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Zobacz portfolio
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </header>
    <section
      v-if="service.slug === 'seo-techniczne'"
      class="mb-14 rounded-card border border-solid border-line bg-surface p-7 max-[760px]:p-5"
      aria-label="SEO lokalne Inowrocław"
    >
      <h2 class="mb-4 text-[clamp(24px,3vw,34px)]">Pozycjonowanie lokalne w Inowrocławiu</h2>
      <p class="mb-5 max-w-[760px] text-[13px] leading-[1.8] text-muted">
        Jeśli strona pojawia się na lokalne zapytania, ale nie zdobywa kliknięć,
        warto sprawdzić jej prezentację w wynikach i dopasowanie treści do potrzeb klientów.
        Analizuję dane Search Console, strukturę oferty i techniczne przeszkody, a następnie
        proponuję zmiany oraz sposób pomiaru ich skuteczności.
      </p>
      <div class="flex flex-wrap gap-5 text-[12px]">
        <NuxtLink class="text-primary underline" to="/kontakt">Zapytaj o analizę strony</NuxtLink>
        <NuxtLink class="text-primary underline" to="/strony-internetowe/inowroclaw">
          Tworzenie stron internetowych w Inowrocławiu
        </NuxtLink>
      </div>
    </section>
    <ServiceOutcomes :service="service" />
    <section
      v-for="section in service.sections"
      :key="section.title"
      data-ui="local-editorial"
      class="
        grid grid-cols-[270px_1fr] gap-17.5 border-t [border-top-style:solid] border-t-line py-15
        max-[1200px]:grid-cols-[240px_1fr] max-[1200px]:gap-[45px] max-[760px]:grid-cols-1
        max-[760px]:gap-[25px] max-[760px]:py-10 [&_h2]:text-[34px] [&_h2]:leading-[1.2]
        max-[760px]:[&_h2]:text-[32px] [&_li]:my-[15px] [&_li]:pl-[5px] [&_p]:mb-5
        [&_p]:text-[13px] [&_p]:text-[#a1afc0] max-[760px]:[&_p]:text-[12px] [&_ul]:mx-0
        [&_ul]:mt-5.5 [&_ul]:mb-0 [&_ul]:pl-5 [&_ul]:text-[12px] [&_ul]:leading-[1.8]
        [&_ul]:text-[#b7c8dc]
      "
    >
      <h2>{{ section.title }}</h2>
      <div>
        <p
          v-for="paragraph in section.paragraphs"
          :key="paragraph"
        >
          {{ paragraph }}
        </p>
        <ul v-if="section.items">
          <li
            v-for="item in section.items"
            :key="item"
          >
            {{ item }}
          </li>
        </ul>
        <p
          v-if="service.slug === 'seo-techniczne' && section.title.includes('AI')"
          data-ui="local-source"
          class="
            mt-[25px] rounded-[0_var(--radius-control)_var(--radius-control)_0] border-l-[2px]
            [border-left-style:solid] border-l-[#526f90] bg-[#111b27] px-5 py-4 [&_a]:text-[10px]
            [&_a]:text-primary [&_a]:underline [&_a]:[text-underline-offset:4px] [&_p]:mx-0
            [&_p]:mt-0 [&_p]:mb-[13px] [&_p]:text-[10px]
          "
        >
          Podstawa zaleceń:
          <a
            href="https://developers.google.com/search/docs/appearance/ai-features"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Search Central — funkcje AI i witryna
          </a>
          .
        </p>
      </div>
    </section>
    <section
      v-if="price !== null && price !== undefined"
      data-ui="local-price"
      class="
        mt-[25px] mb-[65px] grid grid-cols-[1fr_auto] gap-5 rounded-card border border-solid
        border-line bg-surface p-7.5 max-[760px]:mb-[45px] max-[760px]:grid-cols-1
        max-[760px]:p-[25px] [&_>_div:last-child]:grid [&_>_div:last-child]:content-center
        [&_>_div:last-child]:[justify-items:end] [&_>_div:last-child]:gap-4
        max-[760px]:[&_>_div:last-child]:justify-items-start [&_h2]:mb-4 [&_h2]:text-[28px]
        [&_p]:max-w-[620px] [&_p]:text-[11px] [&_p]:text-[#8fa2b9] [&_strong]:text-[30px]
        [&_strong]:font-medium [&_strong]:tracking-[-0.04em] [&_strong]:text-primary
        [&_strong_small]:text-[10px] [&_strong_small]:font-normal [&_strong_small]:tracking-[0]
      "
    >
      <div>
        <h2>Orientacyjny punkt wyjścia</h2>
        <p>
          Cena z aktualnego cennika Makoto. Dokładny zakres i koszt wymagają potwierdzenia po
          rozmowie. Opłaty za domenę oraz usługi zewnętrzne rozlicza się osobno.
        </p>
      </div>
      <div>
        <strong>
          od {{ formatMoney(price) }}
          <small>netto{{ service.monthlyId ? ' / mies.' : '' }}</small>
        </strong>
        <NuxtLink
          :to="service.project ? `/wycena?project=${service.project}` : '/kontakt'"
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
        >
          Ustalmy szczegóły
          <AppIcon
            name="arrow"
            :size="17"
          />
        </NuxtLink>
      </div>
    </section>
    <section
      data-ui="local-editorial"
      class="
        grid grid-cols-[270px_1fr] gap-17.5 border-t [border-top-style:solid] border-t-line py-15
        max-[1200px]:grid-cols-[240px_1fr] max-[1200px]:gap-[45px] max-[760px]:grid-cols-1
        max-[760px]:gap-[25px] max-[760px]:py-10 [&_h2]:text-[34px] [&_h2]:leading-[1.2]
        max-[760px]:[&_h2]:text-[32px] [&_li]:my-[15px] [&_li]:pl-[5px] [&_p]:mb-5
        [&_p]:text-[13px] [&_p]:text-[#a1afc0] max-[760px]:[&_p]:text-[12px] [&_ul]:mx-0
        [&_ul]:mt-5.5 [&_ul]:mb-0 [&_ul]:pl-5 [&_ul]:text-[12px] [&_ul]:leading-[1.8]
        [&_ul]:text-[#b7c8dc]
      "
    >
      <h2>
        Odpowiedzi
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          przed decyzją.
        </span>
      </h2>
      <div
        data-ui="faq-list"
        class="
          border-t [border-top-style:solid] border-t-line [&_details]:border-b
          [&_details]:[border-bottom-style:solid] [&_details]:border-b-line [&_details_p]:mt-0
          [&_details_p]:mr-[25px] [&_details_p]:mb-6 [&_details_p]:ml-7.5
          [&_details_p]:text-[11px] [&_details_p]:text-muted
          [&_details[open]_summary_>_svg]:[transform:rotate(45deg)] [&_summary]:flex
          [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center
          [&_summary]:gap-[15px] [&_summary]:py-[23px] [&_summary]:text-[11px]
          [&_summary]:font-medium max-[760px]:[&_summary]:py-5.5
          max-[760px]:[&_summary]:text-[12px] [&_summary_>_svg]:ml-auto [&_summary_>_svg]:w-4
          [&_summary::-webkit-details-marker]:hidden
        "
      >
        <details
          v-for="(answer, i) in service.faq"
          :key="answer[0]"
        >
          <summary>
            <span
              data-ui="faq-num"
              class="text-[9px] text-[#6c7e91]"
            >
              0{{ i + 1 }}
            </span>
            {{ answer[0] }}
            <AppIcon name="plus" />
          </summary>
          <p>{{ answer[1] }}</p>
        </details>
      </div>
    </section>
    <section
      data-ui="section regional-section"
      class="border-t [border-top-style:solid] border-t-line py-25 max-[960px]:py-[75px] max-[760px]:py-15.5"
    >
      <div
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
      >
        <div>
          <SectionLabel text="Obszar współpracy" />
          <h2>
            Projekt dla Twojej firmy.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              W całym regionie.
            </span>
          </h2>
        </div>
        <NuxtLink
          to="/obszar-dzialania"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Całe Kujawsko-Pomorskie
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
      <RegionLinks />
    </section>
    <section
      data-ui="local-form-section"
      class="
        mt-7.5 mb-20 grid grid-cols-2 [align-items:start] gap-20 max-[1200px]:gap-[45px]
        max-[760px]:mb-[55px] max-[760px]:grid-cols-1 max-[760px]:gap-7.5
        [&_>_div_>_h2]:text-[47px] max-[760px]:[&_>_div_>_h2]:text-[39px] [&_>_div_>_p]:mt-6
        [&_>_div_>_p]:text-[12px] [&_>_div_>_p]:text-muted
        [&_[data-ui~='form-panel']_>_h2]:text-[25px]
      "
    >
      <div>
        <SectionLabel text="Następny krok" />
        <h2>
          Jaki cel
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            ma Twój projekt?
          </span>
        </h2>
        <p>
          Wiadomość pomoże ustalić właściwy zakres. Napisz o firmie, odbiorcach, obecnej stronie i
          oczekiwanym terminie.
        </p>
      </div>
      <div
        data-ui="form-panel"
        class="
          rounded-card border border-solid border-line bg-[#10151c] p-[35px] max-[960px]:p-[27px]
          max-[760px]:p-[25px] [&_>_[data-ui~='muted']]:mt-[9px] [&_>_[data-ui~='muted']]:mb-8
          [&_>_[data-ui~='muted']]:text-[10px] [&_>_h2]:text-[25px]
        "
      >
        <h2>Porozmawiajmy o szczegółach.</h2>
        <p
          data-ui="muted"
          class="text-muted"
        >
          Pola z gwiazdką są wymagane.
        </p>
        <ContactForm />
      </div>
    </section>
  </div>
</template>
