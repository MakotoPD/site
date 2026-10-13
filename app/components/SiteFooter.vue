<script setup lang="ts">
const { settings } = await useSite()
const { openSettings } = useCookieConsent()
</script>
<template>
  <footer
    data-ui="site-footer"
    class="border-t [border-top-style:solid] border-t-line bg-[#0d1218]"
  >
    <div
      data-ui="shell"
      class="
        mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
        max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
        max-[400px]:w-[calc(100%_-_32px)]
      "
    >
      <div
        data-ui="footer-cta"
        class="
          flex items-center justify-between gap-7.5 border-b [border-bottom-style:solid]
          border-b-line py-[75px] max-[760px]:py-[55px] [&_[data-ui~='eyebrow']]:mb-6
          [&_h2]:text-[clamp(45px,_5vw,_73px)] max-[760px]:[&_h2]:text-[42px]
          max-[400px]:[&_h2]:text-[35px]
        "
      >
        <div>
          <p
            data-ui="eyebrow"
            class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            <span
              data-ui="status-dot"
              class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
            />
            Twój następny krok
          </p>
          <h2>
            Masz pomysł?
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              Nadajmy mu kształt.
            </span>
          </h2>
        </div>
        <NuxtLink
          to="/kontakt"
          data-ui="round-cta"
          class="
            grid h-29 w-29 place-items-center rounded-[50%] border border-solid border-[#48627d]
            text-primary [transition:background_0.2s_ease,_color_0.2s_ease] max-[760px]:h-17
            max-[760px]:w-17 max-[760px]:shrink-0 pointer-hover:hover:bg-primary
            pointer-hover:hover:text-background max-[760px]:[&_svg]:w-[31px]
          "
          aria-label="Porozmawiajmy o projekcie"
        >
          <AppIcon
            name="arrow"
            :size="52"
          />
        </NuxtLink>
      </div>
      <div
        data-ui="footer-main"
        class="
          grid grid-cols-[1.4fr_0.8fr_1fr] gap-17.5 py-13 max-[960px]:gap-[35px]
          max-[760px]:grid-cols-2 max-[760px]:gap-[35px] max-[760px]:py-10 max-[400px]:gap-[25px]
          max-[760px]:[&_>_div:first-child]:[grid-column:1/-1]
          max-[760px]:[&_>_div:last-child]:pl-[15px] [&_>_div:last-child_>_a]:mt-[15px]
          [&_>_div:last-child_>_a]:flex [&_>_div:last-child_>_a]:max-w-37.5
          [&_>_div:last-child_>_a]:items-center [&_>_div:last-child_>_a]:justify-between
          [&_>_div:last-child_>_a]:text-[10px] [&_>_div:last-child_>_a]:text-[#b2bdca]
          max-[760px]:[&_>_div:last-child_>_a]:text-[11px] [&_[data-ui~='eyebrow']]:mt-[5px]
          [&_[data-ui~='eyebrow']]:mb-5 [&_[data-ui~='eyebrow']]:text-[8px]
          pointer-hover:[&_a:hover]:text-primary [&_nav]:grid [&_nav]:grid-cols-2
          [&_nav]:[align-content:start] [&_nav]:gap-x-7.5 [&_nav]:gap-y-[19px] [&_nav]:pt-[5px]
          [&_nav]:text-[10px] [&_nav]:text-[#a0aab6] max-[760px]:[&_nav]:gap-4
          max-[760px]:[&_nav]:text-[11px] max-[400px]:[&_nav]:grid-cols-1 [&_p]:mt-4
          [&_p]:text-[10px] [&_p]:text-[#7e8c9d]
        "
      >
        <div>
          <BrandLogo />
          <p>
            {{ settings.tagline }}
            <br />
            Internet z odrobiną charakteru.
          </p>
          <address
            data-ui="footer-business-data"
            class="mt-5 grid gap-1 text-[10px] leading-[1.8] text-[#91a5bf] not-italic [&_a]:text-primary"
          >
            <span>Makoto · {{ settings.name }}</span>
            <span v-if="settings.nip">NIP: {{ settings.nip }}</span>
            <span v-if="settings.streetAddress">
              {{ settings.streetAddress }}, {{ settings.postalCode }} {{ settings.addressLocality }}
            </span>
            <a
              v-if="settings.phone"
              :href="'tel:' + settings.phone.replace(/[^+0-9]/g, '')"
            >
              {{ settings.phone }}
            </a>
          </address>
          <a
            :href="`mailto:${settings.email}`"
            data-ui="footer-email"
            class="mt-5.5 flex items-center gap-3.5 text-[12px]"
          >
            {{ settings.email }}
            <AppIcon
              name="arrow"
              :size="16"
            />
          </a>
        </div>
        <nav aria-label="Nawigacja w stopce">
          <NuxtLink to="/uslugi">Usługi</NuxtLink>
          <NuxtLink to="/realizacje">Realizacje</NuxtLink>
          <NuxtLink to="/o-mnie">O mnie</NuxtLink>
          <NuxtLink to="/blog">Blog</NuxtLink>
          <NuxtLink to="/wycena">Kalkulator wyceny</NuxtLink>
          <NuxtLink to="/pytania">Pytania i odpowiedzi</NuxtLink>
          <NuxtLink to="/uslugi/seo-techniczne">SEO i GEO</NuxtLink>
          <NuxtLink to="/uslugi/opieka-techniczna">Opieka techniczna</NuxtLink>
        </nav>
        <div>
          <p
            data-ui="eyebrow"
            class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            Znajdziesz mnie również tutaj
          </p>
          <a
            v-if="settings.googleMapsUrl"
            :href="settings.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Profil Google
            <AppIcon
              name="arrow"
              :size="16"
            />
          </a>
          <a
            href="https://github.com/makotopd"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <AppIcon
              name="arrow"
              :size="16"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/makotopd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
            <AppIcon
              name="arrow"
              :size="16"
            />
          </a>
          <span
            data-ui="footer-local"
            class="mt-[27px] block text-[8px] text-[#788799] max-[760px]:text-[8px]"
          >
            Obsługa całego województwa kujawsko-pomorskiego
          </span>
        </div>
      </div>
      <div
        data-ui="footer-regional"
        class="
          flex items-center justify-between gap-6 border-t [border-top-style:solid] border-t-line
          py-[25px] max-[760px]:block [&_>_a]:text-[10px] [&_>_a]:text-[#9ab8db] [&_>_nav]:flex
          [&_>_nav]:flex-wrap [&_>_nav]:gap-5 [&_>_nav]:text-[9px] [&_>_nav]:text-[#7794b6]
          max-[760px]:[&_>_nav]:mt-[17px] max-[760px]:[&_>_nav]:gap-[15px]
        "
      >
        <NuxtLink to="/obszar-dzialania">Strony internetowe / Kujawsko-Pomorskie</NuxtLink>
        <RegionLinks compact />
      </div>
      <div
        data-ui="footer-bottom"
        class="
          flex items-center justify-between gap-5 border-t [border-top-style:solid] border-t-line
          py-6 text-[8px] text-[#6c7a8d] max-[760px]:flex-col max-[760px]:items-start
          max-[760px]:gap-[15px] max-[760px]:text-[8px] [&_>_div]:flex [&_>_div]:gap-6.5
          max-[760px]:[&_>_div]:w-full max-[760px]:[&_>_div]:justify-start
          max-[760px]:[&_>_div]:gap-5 max-[760px]:[&_>_div_>_span]:ml-auto
        "
      >
        <span>© {{ new Date().getFullYear() }} Makoto. Z pomysłem, od podstaw.</span>
        <div>
          <NuxtLink to="/prywatnosc">Prywatność</NuxtLink>
          <button
            type="button"
            @click="openSettings"
          >
            Ustawienia cookie
          </button>
          <NuxtLink
            to="/admin"
            external
          >
            Panel
          </NuxtLink>
          <span>
            Design & code by Makoto
            <AppIcon
              name="arrow"
              class="inline-block h-[1em] w-[1em] align-[-0.12em]"
            />
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
