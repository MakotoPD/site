<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
useMotion(root)
usePageSeo(
  'Strony, aplikacje i design — oferta',
  'Strony firmowe, sklepy, aplikacje, UI/UX i SEO techniczne dla firm z Kujawsko-Pomorskiego. Sprawdź zakres usług Makoto i sposób wyceny.',
)
const serviceSlugs = [
  'strony-internetowe',
  'aplikacje-webowe',
  'sklepy-internetowe',
  'projektowanie-ui-ux',
]
const services = [
  {
    title: 'Strony internetowe',
    subtitle: 'Twoja marka. Twoje zasady.',
    icon: 'monitor' as const,
    desc: 'Projektuję od podstaw, bez gotowych szablonów. Tworzę szybkie, responsywne strony, które dobrze wyglądają i pomagają odwiedzającym znaleźć to, czego potrzebują.',
    features: [
      'Autorski projekt UI/UX',
      'Nuxt, Vue i Tailwind CSS',
      'Responsywność i dostępność',
      'Animacje GSAP i interakcje',
      'SEO techniczne i analityka',
      'Panel do zarządzania treścią',
    ],
    project: 'website',
  },
  {
    title: 'Aplikacje webowe',
    subtitle: 'Dobre narzędzie robi różnicę.',
    icon: 'code' as const,
    desc: 'Tworzę aplikacje dopasowane do Twoich procesów. Od panelu klienta i systemu rezerwacji po produkt SaaS. Projektuję interfejs, implementuję logikę i łączę całość z potrzebnymi usługami.',
    features: [
      'Projektowanie produktu',
      'Frontend i backend',
      'API i integracje',
      'Logowanie i role użytkowników',
      'Bazy danych',
      'Wdrożenie i dalszy rozwój',
    ],
    project: 'application',
  },
  {
    title: 'Sklepy internetowe',
    subtitle: 'Od odkrycia do zamówienia.',
    icon: 'shop' as const,
    desc: 'Czytelny katalog, wygodne zakupy i spójny wizerunek marki. Buduję sklepy z myślą o kupującym oraz o Twojej codziennej pracy z zamówieniami.',
    features: [
      'Projekt doświadczenia zakupowego',
      'Katalog i warianty produktów',
      'Płatności online',
      'Integracje z dostawą',
      'Panel zamówień',
      'SEO produktów',
    ],
    project: 'store',
  },
  {
    title: 'Design & branding',
    subtitle: 'Charakter, który widać.',
    icon: 'palette' as const,
    desc: 'Projektuję identyfikacje wizualne i interfejsy, które są czymś więcej niż dekoracją. Spójna typografia, kolory i forma pomagają opowiedzieć historię Twojej marki.',
    features: [
      'Projekt logo',
      'System identyfikacji',
      'Typografia i kolory',
      'Makiety w Figma',
      'System komponentów',
      'Materiały cyfrowe',
    ],
    project: 'landing',
  },
]
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
      <SectionLabel
        text="Usługi / Design + Development"
        data-hero
      />
      <h1 data-hero>
        Dobry pomysł.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Właściwe wykonanie.
        </span>
      </h1>
      <p data-hero>
        Design, technologia i dbałość o szczegóły.
        <br />
        Wszystko, czego potrzebuje Twój cyfrowy projekt.
      </p>
    </header>
    <section
      v-for="(service, i) in services"
      :key="service.title"
      data-ui="service-detail"
      class="
        grid grid-cols-2 gap-25 border-t [border-top-style:solid] border-t-line py-[65px]
        last:pb-25 max-[960px]:gap-12.5 max-[760px]:grid-cols-1 max-[760px]:gap-7.5
        max-[760px]:py-10 max-[760px]:[&_[data-ui~='eyebrow']]:text-[9px] [&_h2]:text-[44px]
        max-[760px]:[&_h2]:text-[37px] [&_p]:text-[13px] [&_p]:text-[#98a4b4]
        max-[760px]:[&_p]:text-[12px]
      "
      data-reveal
    >
      <div
        data-ui="service-detail-heading"
        class="
          [&_>_svg]:mt-[25px] [&_>_svg]:mb-5.5 [&_>_svg]:text-primary
          max-[760px]:[&_>_svg]:mt-5.5 max-[760px]:[&_>_svg]:mb-4 max-[760px]:[&_>_svg]:w-9
        "
      >
        <span
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          0{{ i + 1 }} / {{ service.subtitle }}
        </span>
        <AppIcon
          :name="service.icon"
          :size="45"
        />
        <h2>{{ service.title }}</h2>
      </div>
      <div>
        <p>{{ service.desc }}</p>
        <ul
          data-ui="feature-grid"
          class="
            my-7.5 grid list-none grid-cols-2 gap-4.5 p-0 max-[760px]:gap-x-2.5
            max-[760px]:gap-y-4.5 [&_li]:flex [&_li]:items-center [&_li]:gap-2.5
            [&_li]:text-[11px] max-[760px]:[&_li]:text-[10px] [&_svg]:text-primary
          "
        >
          <li
            v-for="feature in service.features"
            :key="feature"
          >
            <AppIcon
              name="check"
              :size="17"
            />
            {{ feature }}
          </li>
        </ul>
        <NuxtLink
          :to="`/uslugi/${serviceSlugs[i]}`"
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
        >
          Poznaj pełny zakres
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </section>
    <section
      data-ui="local-related"
      class="
        pt-[35px] pb-17.5 [&_>_div]:flex [&_>_div]:flex-wrap [&_>_div]:gap-x-6.5
        [&_>_div]:gap-y-[13px] [&_>_h2]:mb-[25px] [&_>_h2]:text-[30px] [&_a]:text-[11px]
        [&_a]:text-primary
      "
    >
      <h2>Po wdrożeniu</h2>
      <div>
        <NuxtLink to="/uslugi/seo-techniczne">SEO techniczne i GEO</NuxtLink>
        <NuxtLink to="/uslugi/opieka-techniczna">Opieka techniczna</NuxtLink>
        <NuxtLink to="/obszar-dzialania">Obszar współpracy: Kujawsko-Pomorskie</NuxtLink>
        <NuxtLink to="/pytania">Pytania i odpowiedzi</NuxtLink>
      </div>
    </section>
  </div>
</template>
