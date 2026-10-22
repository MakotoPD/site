<script setup lang="ts">
const services = [
  {
    title: 'Strony internetowe',
    first: 'Strony',
    second: 'internetowe.',
    slug: 'strony-internetowe',
    image: 'architecture',
    width: 1280,
    height: 853,
    position: '50% 35%',
    caption: 'Dobry adres dla Twojej marki',
    text: 'Od pierwszego wrażenia do konkretnego zapytania. Strona, która opowiada o Twojej firmie i pomaga jej rosnąć.',
    tags: 'DESIGN / NUXT / SEO',
    cta: 'Poznaj możliwości',
  },
  {
    title: 'Aplikacje webowe',
    first: 'Aplikacje',
    second: 'webowe.',
    slug: 'aplikacje-webowe',
    image: 'systems',
    width: 1280,
    height: 1037,
    position: '50% 60%',
    caption: 'Mniej chaosu. Więcej możliwości.',
    text: 'Panele, integracje i narzędzia skrojone pod sposób, w jaki pracujesz.',
    tags: 'SYSTEMY / API / AUTOMATYZACJA',
    cta: 'Zobacz, co możemy zbudować',
  },
  {
    title: 'Design & branding',
    first: 'Design',
    second: '& branding.',
    slug: 'projektowanie-ui-ux',
    image: 'form',
    width: 1280,
    height: 853,
    position: '50% 50%',
    caption: 'Forma, która zostaje w pamięci',
    text: 'Własny charakter marki. Przemyślany interfejs. Detale, które tworzą całość.',
    tags: 'UI/UX / FIGMA / IDENTYFIKACJA',
    cta: 'Porozmawiajmy o designie',
  },
]
</script>
<template>
  <section
    id="uslugi"
    data-ui="services-section section"
    class="bg-[#0c1118] py-25 max-[960px]:py-[75px] max-[760px]:py-15.5"
    aria-labelledby="services-heading"
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
        data-ui="section-heading"
        class="
          mb-12 flex items-end justify-between gap-7.5 max-[760px]:mb-7.5 max-[760px]:block
          [&_[data-ui~='text-link']]:pb-[9px] max-[760px]:[&_[data-ui~='text-link']]:mt-5
        "
        data-reveal
      >
        <div>
          <SectionLabel
            number="02"
            text="W czym mogę pomóc"
          />
          <h2 id="services-heading">
            Od pierwszego szkicu
            <br />
            do
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              ostatniej linijki kodu.
            </span>
          </h2>
        </div>
        <p
          data-ui="section-description"
          class="pb-[3px] text-[12px] text-muted max-[760px]:mt-5.5 max-[760px]:text-[11px]"
        >
          Jeden twórca. Spójny proces.
          <br />
          Każdy detal ma swoje miejsce.
        </p>
      </div>
      <div
        data-ui="service-grid"
        class="
          grid grid-cols-[1.25fr_1fr] [grid-template-rows:repeat(2,_minmax(310px,_auto))] gap-4.5
          max-[1050px]:grid-cols-[1.1fr_1fr]
          max-[1050px]:[grid-template-rows:repeat(2,_minmax(320px,_auto))] max-[1050px]:gap-3.5
          max-[760px]:grid-cols-1 max-[760px]:[grid-template-rows:none] max-[760px]:gap-4
        "
      >
        <NuxtLink
          v-for="(service, i) in services"
          :key="service.slug"
          :to="`/uslugi/${service.slug}`"
          :aria-label="`${service.title} — poznaj usługę`"
          data-ui="service-card"
          class="
            block min-w-0 overflow-hidden rounded-card border border-solid border-[#425367]
            bg-[#101b28] [transition:border-color_180ms_ease] focus-visible:border-primary
            focus-visible:[outline-offset:6px] max-[760px]:[grid-row:auto]
            max-[760px]:min-h-[420px] pointer-hover:hover:border-[#a4c7e7]
            [&_[data-ui~='ascii-content']]:flex [&_[data-ui~='ascii-content']]:flex-col
            [&_[data-ui~='ascii-content']]:justify-between [&_[data-ui~='ascii-content']]:px-8.5
            [&_[data-ui~='ascii-content']]:py-[29px]
            max-[1050px]:[&_[data-ui~='ascii-content']]:p-[25px]
            max-[760px]:[&_[data-ui~='ascii-content']]:p-[25px]
            max-[400px]:[&_[data-ui~='ascii-content']]:p-[23px] [&_h3]:text-[36px]
            [&_h3]:leading-[0.99] [&_h3]:tracking-[-0.035em] [&_h3]:text-[#f4f7fa]
            max-[1050px]:[&_h3]:text-[33px] max-[760px]:[&_h3]:text-[41px]
            [&_h3_[data-ui~='serif']]:text-[1.16em] [&_h3_[data-ui~='serif']]:text-primary
            [&_p]:mt-[17px] [&_p]:max-w-[345px] [&_p]:text-[12px] [&_p]:leading-[1.7]
            [&_p]:text-[#c5cfda] max-[760px]:[&_p]:max-w-[340px] max-[760px]:[&_p]:text-[13px]
            [&.service-card-featured]:[grid-row:span_2]
            max-[760px]:[&.service-card-featured]:[grid-row:auto]
            max-[760px]:[&.service-card-featured]:min-h-[510px]
            [&.service-card-featured_[data-ui~='ascii-content']]:px-[39px]
            [&.service-card-featured_[data-ui~='ascii-content']]:py-8.5
            max-[1050px]:[&.service-card-featured_[data-ui~='ascii-content']]:p-[25px]
            max-[760px]:[&.service-card-featured_[data-ui~='ascii-content']]:p-[25px]
            max-[400px]:[&.service-card-featured_[data-ui~='ascii-content']]:p-[23px]
            [&.service-card-featured_[data-ui~='ascii-photo']]:[filter:grayscale(0.85)_saturate(0.35)]
            [&.service-card-featured_[data-ui~='service-card-copy']]:pt-40
            max-[760px]:[&.service-card-featured_[data-ui~='service-card-copy']]:pt-25
            [&.service-card-featured_[data-ui~='service-card-footer']]:mt-[29px]
            [&.service-card-featured_[data-ui~='service-card-footer']]:pt-[23px]
            max-[760px]:[&.service-card-featured_[data-ui~='service-card-footer']]:mt-5.5
            max-[760px]:[&.service-card-featured_[data-ui~='service-card-footer']]:pt-[17px]
            max-[760px]:[&.service-card-featured_[data-ui~='service-card-footer']]:text-[11px]
            [&.service-card-featured_h3]:text-[clamp(46px,_4vw,_62px)]
            max-[1050px]:[&.service-card-featured_h3]:text-[47px]
            max-[760px]:[&.service-card-featured_h3]:text-[49px]
            max-[400px]:[&.service-card-featured_h3]:text-[45px]
            [&.service-card-featured_p]:mt-[23px] [&.service-card-featured_p]:max-w-[410px]
            [&.service-card-featured_p]:text-[14px]
            max-[1050px]:[&.service-card-featured_p]:text-[13px]
            max-[760px]:[&.service-card-featured_p]:max-w-[340px]
            max-[760px]:[&.service-card-featured_p]:text-[13px]
            pointer-hover:[&:hover_[data-ui~='service-card-arrow']]:bg-primary
            pointer-hover:[&:hover_[data-ui~='service-card-arrow']]:text-[#112133]
            motion-reduce:[&:hover_[data-ui~='service-card-arrow']_svg]:[transform:none]
            pointer-hover:[&:hover_[data-ui~='service-card-arrow']_svg]:[transform:rotate(45deg)]
            [&:nth-child(3)_[data-ui~='ascii-photo']]:[filter:brightness(0.7)_saturate(0.25)]
          "
          :class="{ 'service-card-featured': i === 0 }"
          data-reveal
        >
          <AsciiSurface
            :src="`/images/editorial/${service.image}-1280.webp`"
            :srcset="`/images/editorial/${service.image}-640.webp 640w, /images/editorial/${service.image}-1280.webp 1280w`"
            :sizes="
              i === 0
                ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1400px) 55vw, 740px'
                : '(max-width: 760px) calc(100vw - 40px), (max-width: 1400px) 40vw, 550px'
            "
            :width="service.width"
            :height="service.height"
            :position="service.position"
          >
            <div
              data-ui="service-card-top"
              class="flex items-center justify-between gap-4"
            >
              <span
                data-ui="service-card-number"
                class="[font-family:ui-monospace,_Consolas,_monospace] text-[15px] text-[#e0efff]"
              >
                0{{ i + 1 }}
              </span>
              <span
                data-ui="service-card-tags"
                class="
                  text-right text-[8px] tracking-[0.12em] text-[#d3e4f5] max-[1050px]:text-[7px]
                  max-[760px]:text-[7px]
                "
              >
                {{ service.tags }}
              </span>
            </div>
            <div
              data-ui="service-card-copy"
              class="pt-8.5 max-[760px]:pt-25"
            >
              <span
                data-ui="service-card-caption"
                class="mb-2.5 block text-[10px] tracking-[0.025em] text-[#c1d8ed] max-[760px]:text-[10px]"
              >
                {{ service.caption }}
              </span>
              <h3>
                {{ service.first }}
                <br />
                <span
                  data-ui="serif"
                  class="font-serif font-normal tracking-[-0.025em] italic"
                >
                  {{ service.second }}
                </span>
              </h3>
              <p>{{ service.text }}</p>
              <div
                data-ui="service-card-footer"
                class="
                  mt-[19px] flex items-center justify-between gap-4 border-t
                  [border-top-style:solid] border-t-[#c2d7ed35] pt-[19px] text-[11px]
                  text-[#e3edf7] max-[760px]:mt-5.5 max-[760px]:pt-[17px] max-[760px]:text-[11px]
                "
              >
                <span>{{ service.cta }}</span>
                <span
                  data-ui="service-card-arrow"
                  class="
                    grid h-[39px] w-[39px] flex-none place-items-center rounded-full border
                    border-solid border-[#acc8e573] text-primary
                    [transition:background_180ms_ease,_color_180ms_ease]
                    [&_svg]:[transition:transform_180ms_var(--ease-out)]
                  "
                >
                  <AppIcon
                    name="arrow"
                    :size="22"
                  />
                </span>
              </div>
            </div>
          </AsciiSurface>
        </NuxtLink>
      </div>
      <div
        data-ui="service-grid-footnote"
        class="
          mt-[21px] flex items-center justify-between gap-5 max-[760px]:mt-[17px]
          max-[760px]:flex-wrap max-[760px]:gap-1 [&_>_span]:text-[11px]
          [&_>_span]:text-[#8d9cac] [&_[data-ui~='text-link']]:text-[11px]
          [&_[data-ui~='text-link']]:text-[#c6d9ec]
        "
      >
        <span>
          Pomysł. Forma. Działający projekt. Także
          <NuxtLink
            class="text-primary underline"
            to="/uslugi/seo-techniczne"
          >pozycjonowanie stron Inowrocław</NuxtLink>.
        </span>
        <NuxtLink
          to="/uslugi"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Cały zakres współpracy
          <AppIcon
            name="arrow"
            :size="16"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
