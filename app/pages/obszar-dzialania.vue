<script setup lang="ts">
import { servicePages, servicePath } from '#shared/services'
import { pageGraph } from '#shared/schema'
import { siteOrigin, regionName } from '#shared/seo'
const site = siteOrigin(useRuntimeConfig().public.siteUrl)
usePageSeo(
  'Strony internetowe — Kujawsko-Pomorskie',
  'Strony internetowe dla firm: Inowrocław, Toruń, Bydgoszcz, Grudziądz, Włocławek i całe Kujawsko-Pomorskie. Oferta, kontakt i wycena Makoto.',
)
useStructuredData('makoto-page', () => ({
  '@context': 'https://schema.org',
  '@graph': [
    ...pageGraph(
      site,
      '/obszar-dzialania',
      'Strony internetowe — Kujawsko-Pomorskie',
      'Obszar obsługi Makoto w województwie kujawsko-pomorskim.',
      [
        { name: 'Makoto', path: '/' },
        { name: 'Obszar działania', path: '/obszar-dzialania' },
      ],
    ),
    {
      '@type': 'Service',
      '@id': site + '/obszar-dzialania#service',
      serviceType: 'Projektowanie stron internetowych',
      name: 'Strony internetowe w województwie kujawsko-pomorskim',
      provider: { '@id': site + '/#business' },
      areaServed: { '@type': 'AdministrativeArea', name: regionName },
    },
  ],
}))
const root = ref<HTMLElement | null>(null)
useMotion(root)
</script>
<template>
  <div
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
      <span aria-current="page">Obszar działania</span>
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
        text="Kujawsko-Pomorskie / Z pomysłem, blisko Ciebie"
        data-hero
      />
      <h1 data-hero>
        Strony internetowe
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Kujawsko-Pomorskie.
        </span>
      </h1>
      <p data-hero>
        Makoto — Patryk Dąbrowski — projektuje strony, sklepy i aplikacje dla firm z Inowrocławia,
        Torunia, Bydgoszczy, Grudziądza i Włocławka. Współpracuję również z przedsiębiorcami z
        mniejszych miejscowości całego województwa.
      </p>
      <div
        data-ui="local-heading-actions"
        class="
          mt-[27px] flex flex-wrap items-center gap-[23px] max-[760px]:gap-[15px]
          max-[760px]:[&_[data-ui~='button']]:px-5
          max-[760px]:[&_[data-ui~='button']]:text-[11px] [&_[data-ui~='text-link']]:mb-0
        "
        data-hero
      >
        <NuxtLink
          to="/wycena"
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
          Sprawdź budżet projektu
          <AppIcon name="arrow" />
        </NuxtLink>
        <NuxtLink
          to="/kontakt"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Porozmawiajmy o Twojej firmie
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </header>
    <RegionLinks />
    <section
      data-ui="section local-hub-intro"
      class="
        max-w-[850px] py-25 max-[960px]:py-[75px] max-[760px]:py-15.5 [&_h2]:mb-[27px]
        [&_h2]:text-[42px] max-[760px]:[&_h2]:text-[34px] [&_p]:mb-5 [&_p]:text-[14px]
        [&_p]:text-[#a3b3c6] max-[760px]:[&_p]:text-[12px]
      "
    >
      <SectionLabel text="Wspólny region. Różne potrzeby." />
      <h2>
        Oferta wynika z Twojego biznesu.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Lokalizacja to jej kontekst.
        </span>
      </h2>
      <p>
        Strona lokalnego usługodawcy powinna jasno pokazywać specjalizację, rzeczywisty obszar pracy
        i kontakt. Firma B2B może potrzebować katalogu, specyfikacji i formularzy dopasowanych do
        wyceny. Sklep wymaga kolejnych kroków zakupu, a organizator wydarzenia — informacji o
        programie, terminie i zapisach. Zakres ustalamy po rozmowie o Twoich odbiorcach.
      </p>
      <p>
        Współpracę możemy prowadzić zdalnie: od briefu, przez prezentację makiet, po odbiór
        wdrożenia. Ważne jest przygotowanie aktualnych treści, wskazanie osoby do akceptacji oraz
        określenie najważniejszych funkcji. Nie musisz mieć gotowej listy technologii; wystarczy
        wyjaśnić, jaki problem ma rozwiązać strona.
      </p>
      <p>
        Makoto ma publiczny adres w Inowrocławiu. Pozostałe miasta opisują obszar obsługi. Sposób
        spotkania ustalamy wcześniej, a pracę nad projektem dokumentujemy przez uzgodnione etapy. Na
        podstronach miast znajdziesz przykładowe scenariusze i pytania do briefu, które pomogą
        uporządkować pomysł.
      </p>
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
        Co mogę przygotować
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          dla Twojej firmy?
        </span>
      </h2>
      <div
        data-ui="table-scroll"
        class="overflow-x-auto"
      >
        <table
          data-ui="local-answer-table"
          class="
            w-full border-collapse text-[12px] [&_a]:text-primary [&_a]:underline
            [&_a]:[text-underline-offset:4px] [&_td]:border-b [&_td]:[border-bottom-style:solid]
            [&_td]:border-b-line [&_td]:px-4.5 [&_td]:py-5 [&_td]:text-left [&_td]:text-[#94a9c1]
            [&_th]:border-b [&_th]:[border-bottom-style:solid] [&_th]:border-b-line [&_th]:px-4.5
            [&_th]:py-5 [&_th]:text-left [&_th]:font-medium [&_th]:text-[#bdd4ed]
          "
        >
          <thead>
            <tr>
              <th>Potrzeba</th>
              <th>Zakres do uzgodnienia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="service in servicePages"
              :key="service.slug"
            >
              <th>
                <NuxtLink :to="servicePath(service.slug)">{{ service.name }}</NuxtLink>
              </th>
              <td>{{ service.lead }}</td>
            </tr>
          </tbody>
        </table>
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
        Jak ocenić ofertę
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          na stronę internetową?
        </span>
      </h2>
      <div>
        <p>
          Porównuj przede wszystkim zakres: liczbę podstron, sposób przygotowania treści, możliwość
          edycji, integracje i warunki odbioru. Samo hasło „strona z SEO” nie wyjaśnia, co będzie
          wykonane. W Makoto opisuję elementy projektu, które można zweryfikować: strukturę,
          metadane, dane firmy, formularze, wdrożenie i uzgodnione testy.
        </p>
        <p>
          Kalkulator pokazuje orientacyjne kwoty projektu oraz osobno usługi miesięczne. Ostateczna
          oferta zależy od briefu i potwierdzenia technicznych możliwości. Domeny, abonamenty
          operatorów i koszty zewnętrznych usług wymagają osobnego uwzględnienia. Jeśli
          przebudowujesz serwis, przekaż też listę dotychczasowych adresów.
        </p>
        <NuxtLink
          to="/wycena"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Przejdź przez kalkulator wyceny
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
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
        <SectionLabel text="Cały region / Jeden spójny proces" />
        <h2>
          Zacznijmy od tego,
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            czego potrzebujesz.
          </span>
        </h2>
        <p>
          Podaj miejscowość i opisz cel projektu. Mogę przygotować autorską stronę, przebudować
          istniejącą ofertę albo zaplanować aplikację z potrzebnymi integracjami.
        </p>
      </div>
      <BusinessContact />
    </section>
  </div>
</template>
