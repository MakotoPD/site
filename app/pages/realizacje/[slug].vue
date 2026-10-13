<script setup lang="ts">
import { projects } from '#shared/defaults'
import { siteOrigin } from '#shared/seo'
const route = useRoute()
const site = siteOrigin(useRuntimeConfig().public.siteUrl)
const project = projects.find((p) => p.slug === route.params.slug)
if (!project) throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono projektu.' })
const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length]!
usePageSeo(project.title, project.description)
useStructuredData('makoto-project', () => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.title,
  description: project.detail,
  url: site + `/realizacje/${project.slug}`,
  creator: { '@id': site + '/#person' },
  ...(project.image ? { image: new URL(project.image, site).href } : {}),
}))
const root = ref<HTMLElement | null>(null)
useMotion(root)
</script>
<template>
  <div
    v-if="project"
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
        project-heading pt-20.5 pb-15 max-[760px]:pt-12.5 max-[760px]:pb-10.5
        [&_>_p:not([data-ui~='section-label'])]:mt-[27px]
        [&_>_p:not([data-ui~='section-label'])]:text-[13px]
        [&_>_p:not([data-ui~='section-label'])]:text-[#95a2b3]
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:mt-5.5
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:text-[12px]
        [&_[data-ui~='section-label']]:mb-[25px] [&_[data-ui~='text-link']]:mb-[35px]
        [&_h1]:text-[clamp(50px,_6.7vw,_90px)] max-[760px]:[&_h1]:text-[clamp(45px,_8vw,_65px)]
      "
    >
      <NuxtLink
        to="/realizacje"
        data-ui="text-link"
        class="
          inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
          px-0 py-3 text-[12px] font-medium text-ink
          [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        data-hero
      >
        <AppIcon
          name="left"
          :size="17"
        />
        Wszystkie realizacje
      </NuxtLink>
      <p
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        data-hero
      >
        {{ project.category }}
      </p>
      <h1 data-hero>
        {{ project.title }}
        <span
          data-ui="blue"
          class="text-primary"
        >
          .
        </span>
      </h1>
      <p data-hero>{{ project.description }}</p>
    </header>
    <div
      data-ui="case-image"
      class="
        relative min-h-[400px] w-full rounded-card p-[65px] max-[760px]:min-h-0 max-[760px]:p-6.5
        [&_>_span]:flex [&_>_span]:min-h-[340px] [&_>_span]:items-center
        [&_>_span]:justify-center [&_>_span]:gap-10 [&_>_span]:text-[clamp(50px,_10vw,_150px)]
        [&_>_span]:font-bold [&_>_span]:tracking-[-0.06em] max-[760px]:[&_>_span]:min-h-[220px]
        max-[760px]:[&_>_span]:text-[54px] [&_img]:w-full [&_img]:rounded-control
        [&_img]:shadow-[0_20px_40px_#0004]
      "
      :style="{ background: project.color }"
      data-reveal
    >
      <img
        v-if="project.image"
        :src="project.image"
        :alt="`Projekt ${project.title}`"
        width="1600"
        height="900"
      />
      <span v-else>
        {{ project.title }}
        <span
          data-ui="serif"
          class="font-serif font-normal tracking-[-0.025em] italic"
        >
          ↗
        </span>
      </span>
    </div>
    <section
      data-ui="case-details"
      class="
        grid grid-cols-2 gap-25 py-22.5 max-[760px]:grid-cols-1 max-[760px]:gap-7.5
        max-[760px]:py-[55px] [&_[data-ui~='text-link']]:flex [&_h2]:text-[46px]
        max-[760px]:[&_h2]:text-[40px] [&_p]:text-[14px] [&_p]:text-[#a1acba]
        max-[760px]:[&_p]:text-[12px]
      "
      data-reveal
    >
      <div>
        <SectionLabel text="O projekcie" />
        <h2>
          Forma i funkcja.
          <br />
          <span
            data-ui="serif blue"
            class="font-serif font-normal tracking-[-0.025em] text-primary italic"
          >
            W dobrym rytmie.
          </span>
        </h2>
      </div>
      <div>
        <p>{{ project.detail }}</p>
        <div
          data-ui="case-tech"
          class="
            my-[25px] flex flex-wrap gap-2.5 [&_span]:rounded-full [&_span]:border
            [&_span]:border-solid [&_span]:border-[#2a3a4e] [&_span]:bg-[#17212e] [&_span]:px-3.5
            [&_span]:py-[7px] [&_span]:text-[10px] [&_span]:text-primary
          "
        >
          <span
            v-for="tech in project.technologies"
            :key="tech"
          >
            {{ tech }}
          </span>
        </div>
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Zobacz stronę
          <AppIcon
            name="external"
            :size="17"
          />
        </a>
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
          Porozmawiajmy o podobnym projekcie
          <AppIcon name="arrow" />
        </NuxtLink>
      </div>
    </section>
    <NuxtLink
      :to="`/realizacje/${next.slug}`"
      data-ui="next-project"
      class="
        block border-t [border-top-style:solid] border-t-line pt-[45px] pb-[65px]
        [&_>_span:last-child]:mt-5 [&_>_span:last-child]:flex [&_>_span:last-child]:items-center
        [&_>_span:last-child]:justify-between [&_>_span:last-child]:text-[65px]
        [&_>_span:last-child]:tracking-[-0.05em] max-[760px]:[&_>_span:last-child]:text-[43px]
        [&_svg]:text-primary max-[760px]:[&_svg]:w-[35px]
      "
    >
      <span
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
      >
        Następna historia
      </span>
      <span>
        {{ next.title }}
        <AppIcon
          name="arrow"
          :size="48"
        />
      </span>
    </NuxtLink>
  </div>
</template>
