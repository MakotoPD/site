<script setup lang="ts">
import { projects } from '#shared/defaults'
const root = ref<HTMLElement | null>(null)
useMotion(root)
const { settings } = await useSite()
const { data: posts } = await useFetch('/api/posts', { default: () => [] })
usePageSeo(
  'Strony internetowe i aplikacje w Inowrocławiu',
  'Makoto: autorskie strony internetowe w Inowrocławiu i Kujawsko-Pomorskiem. Projekt UI/UX, aplikacje, CMS i wycena. Zobacz realizacje Patryka Dąbrowskiego.',
)
const faq = [
  [
    'Ile kosztuje autorska strona internetowa?',
    'Cena zależy od zakresu i funkcji. W kalkulatorze zobaczysz orientacyjny koszt przed pierwszą rozmową. Szczegółową ofertę przygotowuję po poznaniu Twoich potrzeb.',
  ],
  [
    'Jak długo trwa realizacja projektu?',
    'Prosta strona zwykle wymaga kilku tygodni. Rozbudowane aplikacje potrzebują więcej czasu. Konkretny harmonogram ustalamy przed rozpoczęciem współpracy.',
  ],
  [
    'Czy mogę samodzielnie zmieniać treści?',
    'Tak. Mogę wdrożyć panel CMS, w którym samodzielnie zmienisz treści i opublikujesz wpisy na blogu. Dostajesz dostęp oraz instrukcję obsługi.',
  ],
  [
    'Czy pracujesz z klientami z całej Polski?',
    'Tak, cały proces możemy przeprowadzić zdalnie: od pierwszej rozmowy po akceptację projektu i wdrożenie.',
  ],
  [
    'Mam już stronę. Czy możesz ją przebudować?',
    'Oczywiście. Zaczynamy od sprawdzenia obecnej strony, jej treści i celów. Następnie proponuję kierunek przebudowy i plan przeniesienia potrzebnych materiałów.',
  ],
]
</script>
<template>
  <div ref="root">
    <section
      data-ui="hero shell"
      class="
        relative mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
        max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
        max-[400px]:w-[calc(100%_-_32px)] [&_h1]:text-[clamp(50px,_5.8vw,_84px)]
        [&_h1]:leading-[1.11] [&_h1]:[font-weight:450] max-[1200px]:[&_h1]:text-[64px]
        max-[960px]:[&_h1]:text-[54px] max-[760px]:[&_h1]:text-[clamp(40px,_7.2vw,_59px)]
        max-[400px]:[&_h1]:text-[40px] min-[1600px]:[&_h1]:text-[89px]
        [&_h1_[data-ui~='serif']]:text-[1.08em]
      "
    >
      <div
        data-ui="hero-topline"
        class="
          flex items-center justify-between pt-[29px] pb-0 max-[760px]:pt-[25px]
          [&_[data-ui~='eyebrow']]:text-[9px]
        "
        data-hero="0"
      >
        <span
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          <span
            data-ui="status-dot"
            class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
          />
          {{ settings.availability }}
        </span>
        <span
          data-ui="eyebrow hero-location"
          class="
            flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted
            uppercase max-[760px]:hidden
          "
        >
          Independent designer & developer · PL
        </span>
      </div>
      <div
        data-ui="hero-body"
        class="
          relative flex min-h-[588px] items-center pt-16 pb-14.5 max-[1200px]:min-h-[570px]
          max-[960px]:min-h-[530px] max-[760px]:block max-[760px]:min-h-0 max-[760px]:pt-[45px]
          max-[760px]:pb-[25px] min-[1600px]:min-h-[665px]
        "
      >
        <div
          data-ui="hero-copy"
          class="
            pointer-events-none relative z-[2] w-[72%] max-[1200px]:w-[75%] max-[960px]:w-[80%]
            max-[760px]:w-full [&_a]:pointer-events-auto
          "
        >
          <div
            data-ui="hero-kicker"
            class="
              mb-7 flex items-center gap-[9px] text-[11px] text-[#a1acb9] max-[760px]:mb-5.5
              max-[760px]:text-[10px]
            "
            data-hero="1"
          >
            <span
              data-ui="tiny-cross"
              class="text-primary"
            >
              <AppIcon
                name="asterisk"
                :size="15"
              />
            </span>
            Strony internetowe / Kujawsko-Pomorskie
          </div>
          <h1 data-hero="2">
            <span
              data-ui="hero-line"
              class="whitespace-nowrap"
            >
              Strony z
              <span
                data-ui="serif blue"
                class="font-serif font-normal tracking-[-0.025em] text-primary italic"
              >
                pomysłem.
              </span>
            </span>
            <br />
            <span
              data-ui="hero-line"
              class="whitespace-nowrap"
            >
              Kod z
              <span
                data-ui="serif blue"
                class="font-serif font-normal tracking-[-0.025em] text-primary italic"
              >
                charakterem.
              </span>
            </span>
          </h1>
          <p
            data-ui="hero-description"
            class="
              mt-[27px] max-w-[500px] text-[13px] leading-[1.9] text-[#a3acb8]
              max-[960px]:text-[12px] max-[760px]:mt-6 max-[760px]:text-[12px]
            "
            data-hero="3"
          >
            Projektuję autorskie strony internetowe i aplikacje
            <br class="desktop-break" />
            dla firm z Inowrocławia i całego Kujawsko-Pomorskiego.
          </p>
          <div
            data-ui="hero-buttons"
            class="
              mt-[31px] flex items-center gap-7 max-[960px]:gap-5 max-[760px]:mt-6.5
              max-[400px]:gap-4 max-[960px]:[&_>_[data-ui~='button']]:gap-[15px]
              max-[960px]:[&_>_[data-ui~='button']]:px-4
              max-[960px]:[&_>_[data-ui~='button']]:py-[13px]
              max-[960px]:[&_>_[data-ui~='button']]:text-[10px]
              max-[760px]:[&_>_[data-ui~='button']]:min-h-12
              max-[760px]:[&_>_[data-ui~='button']]:px-[19px]
              max-[760px]:[&_>_[data-ui~='button']]:py-[13px]
              max-[760px]:[&_>_[data-ui~='button']]:text-[11px]
              max-[400px]:[&_>_[data-ui~='button']]:gap-[11px]
              max-[400px]:[&_>_[data-ui~='button']]:px-[13px]
              max-[400px]:[&_>_[data-ui~='button']]:py-3
              max-[400px]:[&_>_[data-ui~='button']]:text-[10px]
              max-[400px]:[&_>_[data-ui~='text-link']]:gap-[9px]
              max-[400px]:[&_>_[data-ui~='text-link']]:text-[9px]
              max-[760px]:[&_[data-ui~='text-link']]:text-[11px]
            "
            data-hero="4"
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
              Stwórzmy coś dobrego
              <AppIcon name="arrow" />
            </NuxtLink>
            <NuxtLink
              to="/realizacje"
              data-ui="text-link"
              class="
                inline-flex items-center justify-start gap-3.5 border-0 border-solid
                bg-transparent px-0 py-3 text-[12px] font-medium text-ink
                [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
              "
            >
              Zobacz realizacje
              <AppIcon
                name="down"
                :size="17"
              />
            </NuxtLink>
          </div>
          <div
            data-ui="hero-person"
            class="
              mt-[43px] flex items-center gap-3 max-[760px]:mt-[29px] [&_div]:grid [&_div]:gap-1
              [&_div]:text-[10px] [&_img]:h-10 [&_img]:w-10 [&_img]:shrink-0
              [&_img]:rounded-[50%] [&_img]:object-cover [&_img]:[filter:saturate(0.7)]
              [&_small]:text-[9px] [&_small]:text-muted
            "
            data-hero="5"
          >
            <img
              src="/images/avatar.webp"
              alt="Patryk Dąbrowski"
              width="44"
              height="44"
            />
            <div>
              <span>Hej, jestem Patryk.</span>
              <small>Twój pomysł. Mój warsztat.</small>
            </div>
            <span
              data-ui="person-line"
              class="mx-[9px] h-6 w-[1px] bg-[#394451]"
            />
            <span
              data-ui="person-signature"
              class="[transform:rotate(-9deg)] font-serif text-[28px] text-muted italic"
            >
              makoto
            </span>
          </div>
        </div>
        <div
          data-ui="hero-art"
          class="
            pointer-events-auto absolute top-[15px] right-[-15px] h-[530px] w-[49%]
            before:pointer-events-none before:absolute before:top-[14%] before:right-0
            before:bottom-[14%] before:left-0 before:content-['']
            before:[background:radial-gradient(ellipse,_#40658a1e_0%,_transparent_65%)]
            max-[1200px]:top-[43px] max-[1200px]:right-[-20px] max-[1200px]:h-[450px]
            max-[1200px]:w-[47%] max-[960px]:top-[45px] max-[960px]:right-[-5px]
            max-[960px]:h-[415px] max-[960px]:w-[49%] max-[960px]:opacity-[0.8]
            max-[760px]:relative max-[760px]:top-auto max-[760px]:right-auto
            max-[760px]:mt-[-5px] max-[760px]:h-[345px] max-[760px]:w-full
            max-[760px]:opacity-[1] max-[400px]:h-[300px] min-[1600px]:top-10.5
            min-[1600px]:h-[565px]
          "
        >
          <div
            data-ui="orbital"
            class="
              orbital-one absolute top-[13%] left-[8%] h-[78%] w-[84%] [transform:rotate(-28deg)]
              rounded-[50%] border border-solid border-[#738aa41c] max-[760px]:top-[8%]
              max-[760px]:left-[19%] max-[760px]:h-[84%] max-[760px]:w-[62%]
            "
          />
          <div
            data-ui="orbital orbital-two"
            class="
              absolute top-[20%] left-[-1%] h-[62%] w-[102%] [transform:rotate(30deg)]
              rounded-[50%] border border-dashed border-[#738aa41c] max-[760px]:top-[17%]
              max-[760px]:left-[8.5%] max-[760px]:h-[65%] max-[760px]:w-[83%]
            "
          />
          <span
            data-ui="art-coordinate coordinate-top"
            class="
              absolute top-[18%] right-[11%] text-[7px] tracking-[0.12em] text-[#657484]
              max-[760px]:top-[18%] max-[760px]:right-[12%]
            "
          >
            MK / FORM 001
          </span>
          <span
            data-ui="art-coordinate coordinate-bottom"
            class="
              absolute bottom-[6%] left-[24%] text-[7px] tracking-[0.12em] text-[#657484]
              max-[760px]:bottom-[4%] max-[760px]:left-[31%]
            "
          >
            DESIGNED TO MAKE A DIFFERENCE
          </span>
          <span
            data-ui="art-marker marker-one"
            class="absolute top-[29%] right-[6%] text-[17px] text-[#8193a6] max-[760px]:right-[13%]"
          >
            +
          </span>
          <span
            data-ui="art-marker marker-two"
            class="absolute bottom-[17%] left-[3%] text-[17px] text-[#8193a6] max-[760px]:left-[11%]"
          >
            +
          </span>
          <ClientOnly>
            <HeroSculpture />
            <template #fallback>
              <div
                data-ui="sculpture-placeholder"
                class="grid h-full place-items-center text-[300px] text-primary opacity-[0.2]"
              >
                <AppIcon
                  name="asterisk"
                  :size="300"
                />
              </div>
            </template>
          </ClientOnly>
          <div
            data-ui="art-tag"
            class="
              absolute right-[-2%] bottom-[17%] z-[2] flex [transform:rotate(-5deg)] items-center
              gap-2 rounded-control border border-solid border-[#61799340] bg-[#111922c9] px-4
              py-3 text-[10px] text-[#b5c4d3] [backdrop-filter:blur(12px)]
              max-[1200px]:right-[-6%] max-[1200px]:bottom-[11%] max-[960px]:bottom-[6%]
              max-[960px]:text-[8px] max-[760px]:right-[7%] max-[760px]:bottom-[15%]
              max-[760px]:text-[9px] [&_[data-ui~='status-dot']]:h-1
              [&_[data-ui~='status-dot']]:w-1
            "
          >
            <span
              data-ui="status-dot"
              class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
            />
            Kreatywność bez szablonu
          </div>
        </div>
      </div>
      <div
        data-ui="hero-bottom"
        class="
          flex h-18 items-center justify-between border-t [border-top-style:solid] border-t-line
          text-[8px] tracking-[0.07em] text-[#7a8492] max-[760px]:h-15.5 max-[760px]:gap-[15px]
          max-[760px]:[&_>_span:first-child]:text-[7px]
        "
      >
        <span>DESIGN W GŁOWIE. JAKOŚĆ W KODZIE.</span>
        <a
          href="#realizacje"
          data-ui="scroll-hint"
          class="
            flex items-center gap-4 text-[9px] tracking-[0] max-[760px]:gap-[9px]
            max-[760px]:text-[8px] [&_span]:grid [&_span]:h-[29px] [&_span]:w-[29px]
            [&_span]:place-items-center [&_span]:rounded-[50%] [&_span]:border
            [&_span]:border-solid [&_span]:border-[#34404c] [&_span]:text-primary
          "
        >
          Przewiń i poznaj mój świat
          <span>
            <AppIcon
              name="down"
              :size="16"
            />
          </span>
        </a>
        <span
          data-ui="hero-year"
          class="max-[1200px]:hidden"
        >
          EST. MAKOTO / {{ new Date().getFullYear() }}
        </span>
      </div>
    </section>
    <TechnologyStrip />
    <section
      id="realizacje"
      data-ui="section shell"
      class="
        mx-auto w-[min(1320px,_calc(100%_-_112px))] py-25 max-[1200px]:w-[calc(100%_-_80px)]
        max-[960px]:w-[calc(100%_-_48px)] max-[960px]:py-[75px] max-[760px]:w-[calc(100%_-_40px)]
        max-[760px]:py-15.5 max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
        data-reveal
      >
        <div>
          <SectionLabel
            number="01"
            text="Wybrane realizacje"
          />
          <h2>
            Pomysły zamienione
            <br />
            w
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              cyfrowe doświadczenia.
            </span>
          </h2>
        </div>
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
          Wszystkie projekty
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
      <div
        data-ui="projects-grid"
        class="grid grid-cols-2 gap-8.5 max-[760px]:grid-cols-1 max-[760px]:gap-[35px]"
      >
        <ProjectCard
          v-for="(project, i) in projects.slice(0, 2)"
          :key="project.slug"
          :project="project"
          :index="i"
          data-reveal
        />
      </div>
    </section>
    <ServicesShowcase />
    <section
      data-ui="section about-section shell"
      class="
        mx-auto grid w-[min(1320px,_calc(100%_-_112px))] grid-cols-[0.92fr_1fr] items-center
        gap-25 py-25 max-[1200px]:w-[calc(100%_-_80px)] max-[1200px]:gap-[65px]
        max-[960px]:w-[calc(100%_-_48px)] max-[960px]:gap-[45px] max-[960px]:py-[75px]
        max-[760px]:w-[calc(100%_-_40px)] max-[760px]:grid-cols-1 max-[760px]:gap-10
        max-[760px]:py-15.5 max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="about-image"
        class="
          relative max-[760px]:max-w-[490px] [&_img]:[aspect-ratio:1] [&_img]:w-full
          [&_img]:rounded-card [&_img]:object-cover [&_img]:[filter:saturate(0.4)]
        "
        data-reveal
      >
        <img
          src="/images/avatar.webp"
          alt="Patryk Dąbrowski — projektant i programista Makoto"
          width="700"
          height="700"
          loading="lazy"
        />
        <span
          data-ui="image-label"
          class="absolute bottom-5.5 left-6 text-[8px] tracking-[0.16em] text-[#fafbff] [text-shadow:0_1px_6px_#000]"
        >
          PATRYK DĄBROWSKI / MAKOTO
        </span>
        <div
          data-ui="about-sticker"
          class="
            absolute right-[-34px] bottom-9 grid [transform:rotate(-9deg)] bg-primary px-[23px]
            py-[15px] text-[23px] leading-[1.3] font-semibold tracking-[-0.04em] text-[#182536]
            shadow-[0_9px_25px_#0004] max-[960px]:right-[-15px] max-[960px]:text-[20px]
            max-[760px]:right-[15px] max-[760px]:bottom-7.5 [&_span:last-child]:font-serif
            [&_span:last-child]:italic
          "
        >
          <span>design</span>
          <span>
            meets code
            <AppIcon
              name="arrow"
              class="inline-block h-[1em] w-[1em] align-[-0.12em]"
            />
          </span>
        </div>
      </div>
      <div
        data-ui="about-copy"
        class="
          [&_[data-ui~='text-link']]:mt-[5px] [&_h2]:mb-6 [&_h2]:text-[clamp(35px,_4vw,_55px)]
          max-[760px]:[&_h2]:text-[43px] [&_p]:mb-5 [&_p]:max-w-[460px] [&_p]:text-[12px]
          [&_p]:text-[#98a3b1] max-[760px]:[&_p]:max-w-[none] max-[760px]:[&_p]:text-[12px]
        "
        data-reveal
      >
        <SectionLabel
          number="03"
          text="Człowiek po drugiej stronie"
        />
        <h2>
          Dobry design.
          <br />
          Solidny kod.
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            Osobiste podejście.
          </span>
        </h2>
        <p>
          Jestem Patryk, w internecie Makoto. Projektuję i tworzę cyfrowe doświadczenia — od
          tożsamości marki po działającą aplikację.
        </p>
        <p>
          Najlepsze projekty powstają wtedy, kiedy design i technologia mówią tym samym językiem.
          Dlatego zajmuję się jednym i drugim. Ty rozmawiasz bezpośrednio z osobą, która realizuje
          Twój pomysł.
        </p>
        <NuxtLink
          to="/o-mnie"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Poznaj mnie bliżej
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </section>
    <EstimateBanner />
    <section
      data-ui="section shell"
      class="
        process-section mx-auto w-[min(1320px,_calc(100%_-_112px))] py-25
        max-[1200px]:w-[calc(100%_-_80px)] max-[960px]:w-[calc(100%_-_48px)]
        max-[960px]:py-[75px] max-[760px]:w-[calc(100%_-_40px)] max-[760px]:py-15.5
        max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
        data-reveal
      >
        <div>
          <SectionLabel
            number="04"
            text="Jak pracuję"
          />
          <h2>
            Prosty proces.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              Dobry efekt.
            </span>
          </h2>
        </div>
        <p
          data-ui="section-description"
          class="pb-[3px] text-[12px] text-muted max-[760px]:mt-5.5 max-[760px]:text-[11px]"
        >
          Wiesz, co dzieje się z Twoim projektem.
          <br />
          Na każdym etapie.
        </p>
      </div>
      <div
        data-ui="process-grid"
        class="
          grid grid-cols-[repeat(4,_1fr)] gap-[35px] max-[960px]:gap-[23px]
          max-[760px]:grid-cols-2 max-[760px]:gap-x-[25px] max-[760px]:gap-y-[35px]
          [&_h3]:mb-[15px] [&_h3]:text-[17px] max-[960px]:[&_h3]:text-[14px]
          max-[760px]:[&_h3]:text-[16px] [&_p]:text-[11px] [&_p]:text-[#8a95a4]
          max-[760px]:[&_p]:text-[11px]
        "
      >
        <article
          v-for="(step, i) in [
            {
              title: 'Poznajemy pomysł',
              text: 'Rozmawiamy o Twoim biznesie, odbiorcach i celach. Ustalamy zakres, wycenę i harmonogram.',
            },
            {
              title: 'Nadajemy mu formę',
              text: 'Projektuję kierunek wizualny i interfejs. Wspólnie dopracowujemy to, co najważniejsze.',
            },
            {
              title: 'Wprawiamy go w ruch',
              text: 'Zamieniam projekt w działającą stronę. Dodaję animacje i integracje, sprawdzam detale.',
            },
            {
              title: 'Puszczamy w świat',
              text: 'Testujemy, wdrażamy i przekazuję Ci panel. Twoja strona jest gotowa na kolejny rozdział.',
            },
          ]"
          :key="step.title"
          data-reveal
        >
          <span
            data-ui="process-number"
            class="
              mb-5.5 flex justify-between border-b [border-bottom-style:solid] border-b-[#37424f]
              pb-6 font-serif text-[30px] text-primary italic [&_svg]:mt-2 [&_svg]:w-[17px]
              [&_svg]:text-[#586575]
            "
          >
            0{{ i + 1 }}
            <AppIcon name="right" />
          </span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </article>
      </div>
    </section>
    <section
      v-if="posts.length"
      data-ui="section blog-section shell"
      class="
        mx-auto w-[min(1320px,_calc(100%_-_112px))] border-t [border-top-style:solid]
        border-t-line py-25 max-[1200px]:w-[calc(100%_-_80px)] max-[960px]:w-[calc(100%_-_48px)]
        max-[960px]:py-[75px] max-[760px]:w-[calc(100%_-_40px)] max-[760px]:py-15.5
        max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
        data-reveal
      >
        <div>
          <SectionLabel
            number="05"
            text="Z mojego warsztatu"
          />
          <h2>
            Trochę wiedzy.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              Dużo praktyki.
            </span>
          </h2>
        </div>
        <NuxtLink
          to="/blog"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Przejdź do bloga
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
      <div
        data-ui="blog-grid"
        class="
          grid grid-cols-[repeat(3,_1fr)] gap-7 max-[960px]:gap-4.5 max-[760px]:grid-cols-1
          max-[760px]:gap-[35px]
        "
      >
        <NuxtLink
          v-for="post in posts.slice(0, 3)"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          data-ui="blog-card"
          class="
            [&_h3]:mt-3 [&_h3]:text-[19px] [&_h3]:leading-[1.5] max-[760px]:[&_h3]:text-[23px]
            [&_p]:mt-[13px] [&_p]:text-[11px] [&_p]:text-[#8591a1]
            pointer-hover:[&:hover_[data-ui~='blog-art']_img]:[transform:scale(1.035)]
          "
          data-reveal
        >
          <div
            data-ui="blog-art"
            class="
              relative grid [aspect-ratio:1.55] place-items-center overflow-hidden rounded-card
              border border-solid border-[#ffffff0b] bg-[#162332] max-[760px]:[aspect-ratio:1.7]
              [&_>_span]:font-serif [&_>_span]:text-[68px] [&_>_span]:tracking-[-0.12em]
              [&_>_span]:text-primary max-[760px]:[&_>_span]:text-[80px] [&_>_svg]:absolute
              [&_>_svg]:right-4 [&_>_svg]:bottom-[15px] [&_>_svg]:w-4 [&_img]:h-full
              [&_img]:w-full [&_img]:object-cover
              [&_img]:[transition:transform_0.5s_var(--ease-out)]
              [&.blog-art-design]:bg-[#223131] [&.blog-art-proces]:bg-[#2c2d3a]
            "
            :class="`blog-art-${post.category.toLowerCase()}`"
          >
            <img
              v-if="post.cover"
              :src="post.cover"
              :alt="post.title"
              loading="lazy"
            />
            <span
              v-else
              aria-hidden="true"
            >
              {{ post.category === 'Design' ? 'Aa' : '{ / }' }}
            </span>
            <AppIcon name="arrow" />
          </div>
          <div
            data-ui="blog-meta"
            class="
              mt-[21px] flex justify-between gap-2 text-[8px] tracking-[0.03em] text-[#8b9aac]
              uppercase max-[760px]:text-[9px] [&_>_span]:text-primary
            "
          >
            <span>{{ post.category }}</span>
            <time :datetime="post.publishedAt || post.createdAt">
              {{ formatDate(post.publishedAt || post.createdAt) }}
            </time>
          </div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.excerpt }}</p>
        </NuxtLink>
      </div>
    </section>
    <section
      data-ui="section shell regional-section"
      class="
        mx-auto w-[min(1320px,_calc(100%_-_112px))] border-t [border-top-style:solid]
        border-t-line py-25 max-[1200px]:w-[calc(100%_-_80px)] max-[960px]:w-[calc(100%_-_48px)]
        max-[960px]:py-[75px] max-[760px]:w-[calc(100%_-_40px)] max-[760px]:py-15.5
        max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
      >
        <div>
          <SectionLabel text="Blisko Twojej firmy / Cały region" />
          <h2>
            Strony dla lokalnych firm.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              W całym Kujawsko-Pomorskiem.
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
          Poznaj obszar współpracy
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
      <RegionLinks />
    </section>
    <section
      data-ui="section faq-section shell"
      class="
        mx-auto grid w-[min(1320px,_calc(100%_-_112px))] grid-cols-[0.8fr_1fr] gap-25 border-t
        [border-top-style:solid] border-t-line py-25 max-[1200px]:w-[calc(100%_-_80px)]
        max-[960px]:w-[calc(100%_-_48px)] max-[960px]:gap-[45px] max-[960px]:py-[75px]
        max-[760px]:w-[calc(100%_-_40px)] max-[760px]:grid-cols-1 max-[760px]:gap-[35px]
        max-[760px]:py-15.5 max-[400px]:w-[calc(100%_-_32px)] [&_>_div_>_p]:mt-[23px]
        [&_>_div_>_p]:text-[11px] [&_>_div_>_p]:text-[#8996a7]
      "
    >
      <div data-reveal>
        <SectionLabel
          number="06"
          text="Zanim zaczniemy"
        />
        <h2>
          Może już masz
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            kilka pytań.
          </span>
        </h2>
        <p>
          Jeśli nie znajdziesz tu odpowiedzi,
          <br />
          po prostu
          <NuxtLink
            to="/kontakt"
            data-ui="blue"
            class="text-primary"
          >
            napisz do mnie
            <AppIcon
              name="arrow"
              class="inline-block h-[1em] w-[1em] align-[-0.12em]"
            />
          </NuxtLink>
          .
        </p>
      </div>
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
        data-reveal
      >
        <details
          v-for="(item, i) in faq"
          :key="item[0]"
        >
          <summary>
            <span
              data-ui="faq-num"
              class="text-[9px] text-[#6c7e91]"
            >
              0{{ i + 1 }}
            </span>
            {{ item[0] }}
            <AppIcon name="plus" />
          </summary>
          <p>{{ item[1] }}</p>
        </details>
      </div>
    </section>
  </div>
</template>
