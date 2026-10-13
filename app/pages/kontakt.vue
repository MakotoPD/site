<script setup lang="ts">
const { settings } = await useSite()
const root = ref<HTMLElement | null>(null)
useMotion(root)
usePageSeo(
  'Kontakt — Inowrocław',
  'Makoto, Patryk Dąbrowski: Młyńska 5/1, Inowrocław. Strony i aplikacje dla całego Kujawsko-Pomorskiego. Zadzwoń lub prześlij pomysł na projekt.',
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
        text="Kontakt / Let's make it happen"
        data-hero="0"
      />
      <h1 data-hero="1">
        Wszystko zaczyna się
        <br />
        od
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          jednego „hej”.
        </span>
      </h1>
      <p data-hero="2">
        Opowiedz mi, co chodzi Ci po głowie.
        <br />
        Razem znajdziemy sposób, żeby to zrealizować.
      </p>
    </header>
    <section
      data-ui="contact-grid"
      class="
        grid grid-cols-[0.85fr_1fr] gap-22.5 pb-25 max-[1200px]:gap-[55px]
        max-[960px]:grid-cols-[1fr_1.2fr] max-[960px]:gap-7.5 max-[760px]:grid-cols-1
        max-[760px]:gap-10 max-[760px]:pb-[65px]
      "
    >
      <div
        data-ui="contact-info"
        class="
          pt-6 max-[760px]:pt-0 [&_>_p:last-of-type]:flex [&_>_p:last-of-type]:items-center
          [&_>_p:last-of-type]:gap-2.5 [&_>_p:last-of-type]:text-[11px]
          [&_>_p:last-of-type]:text-[#9aa7b6]
        "
        data-reveal
      >
        <p
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          Wolisz napisać bezpośrednio?
        </p>
        <a
          :href="`mailto:${settings.email}`"
          data-ui="contact-email"
          class="
            mt-5 mb-[45px] flex items-center gap-5 text-[23px] tracking-[-0.02em] text-primary
            max-[960px]:text-[19px] max-[760px]:mt-[15px] max-[760px]:mb-7.5
            max-[760px]:text-[26px] max-[400px]:text-[22px]
          "
        >
          {{ settings.email }}
          <AppIcon name="arrow" />
        </a>
        <a
          v-if="settings.phone"
          :href="'tel:' + settings.phone.replace(/[^+0-9]/g, '')"
          data-ui="contact-phone"
          class="mt-5.5 inline-flex items-center gap-[9px] text-[18px] text-primary"
        >
          {{ settings.phone }}
          <AppIcon
            name="arrow"
            :size="18"
          />
        </a>
        <address
          data-ui="contact-nap"
          class="
            mt-[25px] mb-7.5 text-[12px] leading-[1.8] text-[#98aec9] not-italic [&_a]:mt-2
            [&_a]:block [&_a]:text-[11px] [&_a]:text-primary
          "
        >
          {{ settings.streetAddress }}
          <br />
          {{ settings.postalCode }} {{ settings.addressLocality }}
          <a
            v-if="settings.googleMapsUrl"
            :href="settings.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Profil firmy w Google
            <AppIcon
              name="arrow"
              class="inline-block h-[1em] w-[1em] align-[-0.12em]"
            />
          </a>
        </address>
        <div
          data-ui="contact-person"
          class="
            mb-[27px] flex items-center gap-4.5 [&_img]:h-15 [&_img]:w-15 [&_img]:shrink-0
            [&_img]:rounded-[50%] [&_img]:object-cover [&_p]:text-[11px] [&_p]:text-muted
            [&_strong]:text-[13px]
          "
        >
          <img
            src="/images/avatar.webp"
            alt="Patryk Dąbrowski"
            width="60"
            height="60"
          />
          <div>
            <strong>{{ settings.name }}</strong>
            <p>Designer & Developer</p>
          </div>
        </div>
        <p>
          <span
            data-ui="status-dot"
            class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
          />
          {{ settings.availability }}
        </p>
        <div
          data-ui="contact-aside"
          class="
            mt-[65px] max-w-[360px] rounded-card border border-solid border-line p-[25px]
            max-[760px]:mt-7.5 max-[760px]:max-w-[none] [&_>_svg]:mb-[15px]
            [&_>_svg]:text-primary [&_[data-ui~='text-link']]:mt-3
            [&_[data-ui~='text-link']]:text-[11px] [&_h3]:text-[18px] [&_p]:mt-3
            [&_p]:text-[11px] [&_p]:text-muted
          "
        >
          <AppIcon
            name="options"
            :size="24"
          />
          <h3>Jeszcze nie znasz zakresu?</h3>
          <p>Kalkulator pomoże Ci uporządkować pomysł i poznać orientacyjny budżet.</p>
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
            Przejdź do kalkulatora
            <AppIcon
              name="arrow"
              :size="18"
            />
          </NuxtLink>
        </div>
      </div>
      <div
        data-ui="form-panel"
        class="
          rounded-card border border-solid border-line bg-[#10151c] p-[35px] max-[960px]:p-[27px]
          max-[760px]:p-[25px] [&_>_[data-ui~='muted']]:mt-[9px] [&_>_[data-ui~='muted']]:mb-8
          [&_>_[data-ui~='muted']]:text-[10px] [&_>_h2]:text-[25px]
        "
      >
        <h2>Twój pomysł ma znaczenie.</h2>
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
