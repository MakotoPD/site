<script setup lang="ts">
import type { Project } from '#shared/types'
defineProps<{ project: Project; index?: number }>()
</script>
<template>
  <NuxtLink
    :to="`/realizacje/${project.slug}`"
    data-ui="project-card"
    class="
      pointer-hover:[&:hover_[data-ui~='project-open']]:bg-primary
      pointer-hover:[&:hover_[data-ui~='project-open']]:text-background
    "
  >
    <div
      data-ui="project-visual"
      class="
        relative [aspect-ratio:1.37] overflow-hidden rounded-card border border-solid
        border-[#ffffff08] before:pointer-events-none before:absolute before:top-0 before:right-0
        before:bottom-0 before:left-0 before:bg-[url(/images/grain.svg)] before:opacity-[0.23]
        before:content-[''] max-[760px]:[aspect-ratio:1.37] [&_img]:absolute [&_img]:top-[19%]
        [&_img]:left-[7%] [&_img]:h-[65%] [&_img]:w-[87%] [&_img]:rounded-control
        [&_img]:object-cover [&_img]:[object-position:top] [&_img]:shadow-[0_22px_60px_#0005]
        [&_img]:[transition:transform_0.6s_var(--ease-out)]
      "
      :style="{ backgroundColor: project.color }"
    >
      <span
        data-ui="project-index"
        class="absolute top-5.5 left-[25px] z-[2] text-[8px] tracking-[0.12em] text-[#ffffff60]"
      >
        {{ String((index || 0) + 1).padStart(2, '0') }} / SELECTED WORK
      </span>
      <img
        v-if="project.image"
        :src="project.image"
        :alt="`Podgląd projektu ${project.title}`"
        loading="lazy"
        width="1200"
        height="700"
        data-parallax
      />
      <div
        v-else
        data-ui="project-type-art"
        class="
          relative flex h-full flex-col items-center justify-center [&_>_span:first-child]:z-[1]
          [&_>_span:first-child]:text-[clamp(36px,_5vw,_65px)] [&_>_span:first-child]:font-bold
          [&_>_span:first-child]:tracking-[-0.06em]
        "
      >
        <span>{{ project.title }}</span>
        <span
          data-ui="project-type-caption"
          class="z-[1] mt-2 text-[9px] tracking-[0.12em] text-[#ffffff60] uppercase"
        >
          {{ project.category }}
        </span>
        <div
          data-ui="art-cross"
          class="absolute [transform:rotate(20deg)] [font-family:serif] text-[280px] text-[#ffffff07]"
        >
          ✳
        </div>
      </div>
      <span
        data-ui="project-open"
        class="
          absolute right-5 bottom-5 grid h-10.5 w-10.5 place-items-center rounded-[50%] border
          border-solid border-[#ffffff16] bg-[#ffffff13] [backdrop-filter:blur(12px)]
          [transition:background_0.2s_ease,_color_0.2s_ease]
        "
      >
        <AppIcon
          name="arrow"
          :size="24"
        />
      </span>
    </div>
    <div
      data-ui="project-caption"
      class="
        mt-5.5 flex items-end justify-between gap-5 max-[760px]:mt-4.5
        [&_[data-ui~='eyebrow']]:text-[8px] [&_[data-ui~='eyebrow']]:tracking-[0.08em]
        [&_[data-ui~='eyebrow']]:text-[#92a2b4] [&_h3]:mt-2 [&_h3]:text-[26px]
        max-[760px]:[&_h3]:text-[25px] [&_p]:max-w-[200px] [&_p]:text-[10px] [&_p]:leading-[1.8]
        [&_p]:text-muted max-[1200px]:[&_p]:max-w-[155px] max-[760px]:[&_p]:max-w-[190px]
        max-[400px]:[&_p]:max-w-[155px]
      "
    >
      <div>
        <span
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          {{ project.category }}
        </span>
        <h3>{{ project.title }}</h3>
      </div>
      <p>{{ project.description }}</p>
    </div>
  </NuxtLink>
</template>
