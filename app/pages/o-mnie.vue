<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
useMotion(root)
usePageSeo(
  'O mnie: Patryk Dąbrowski, projektant i programista',
  'Patryk Dąbrowski — Makoto. Projektant i programista łączący design z technologią. Poznaj mój sposób pracy.',
)
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
        text="O mnie / Behind the screen"
        data-hero="0"
      />
      <h1 data-hero="1">
        Hej, jestem Patryk.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Możesz mówić Makoto.
        </span>
      </h1>
    </header>
    <section
      data-ui="about-section about-page"
      class="
        grid grid-cols-[0.92fr_1fr] items-center gap-25 pb-15 max-[1200px]:gap-[65px]
        max-[960px]:gap-[45px] max-[760px]:grid-cols-1 max-[760px]:gap-10
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
          alt="Patryk Dąbrowski — Makoto"
          width="700"
          height="700"
        />
        <span
          data-ui="image-label"
          class="absolute bottom-5.5 left-6 text-[8px] tracking-[0.16em] text-[#fafbff] [text-shadow:0_1px_6px_#000]"
        >
          DESIGNER / DEVELOPER / MAKER
        </span>
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
        <h2>
          Design w głowie.
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            Kod w palcach.
          </span>
        </h2>
        <p>
          Projektuję strony, tworzę aplikacje i pracuję nad identyfikacją wizualną. Lubię moment, w
          którym pomysł przestaje być tylko szkicem i staje się czymś, z czego można korzystać.
        </p>
        <p>
          Łączę umiejętności projektanta i programisty. Dzięki temu mogę zadbać o całość: od układu
          pierwszego ekranu po logikę formularza i działanie panelu.
        </p>
        <p>
          Pracuję bezpośrednio z klientem. Ustalamy cele, dzielimy się pomysłami i wspólnie
          dopracowujemy kierunek. Wiesz, kto odpowiada za Twój projekt, i możesz do mnie po prostu
          napisać.
        </p>
        <NuxtLink
          to="/kontakt"
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
          Poznajmy Twój pomysł
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </section>
    <section
      data-ui="section"
      class="py-25 max-[960px]:py-[75px] max-[760px]:py-15.5"
    >
      <SectionLabel text="Mój sposób pracy" />
      <div
        data-ui="values-grid"
        class="
          mt-10 grid grid-cols-[repeat(3,_1fr)] gap-[55px] max-[760px]:mt-7.5
          max-[760px]:grid-cols-1 max-[760px]:gap-[35px] [&_h3]:mb-5 [&_h3]:text-[30px]
          max-[760px]:[&_h3]:mb-3 max-[760px]:[&_h3]:text-[29px] [&_p]:text-[12px]
          [&_p]:text-muted
        "
      >
        <article
          v-for="value in [
            {
              title: 'Z ciekawością',
              text: 'Zanim zaproponuję rozwiązanie, chcę zrozumieć problem. Pytam o użytkowników, potrzeby i kontekst.',
            },
            {
              title: 'Z dbałością',
              text: 'Liczy się cały projekt. Typografia, działanie na telefonie i formularz są tak samo ważne jak pierwszy ekran.',
            },
            {
              title: 'Po partnersku',
              text: 'Jasna komunikacja, konkretny zakres i informacja o postępach. Bez zgadywania, co dzieje się z projektem.',
            },
          ]"
          :key="value.title"
          data-reveal
        >
          <h3>
            {{ value.title }}
            <span
              data-ui="blue"
              class="text-primary"
            >
              .
            </span>
          </h3>
          <p>{{ value.text }}</p>
        </article>
      </div>
    </section>
  </div>
</template>
