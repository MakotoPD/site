<script setup lang="ts">
import { locations, localPath } from '#shared/locations'
defineProps<{ compact?: boolean; exclude?: string }>()
</script>
<template>
  <nav
    v-if="compact"
    aria-label="Miasta obsługiwane przez Makoto"
  >
    <NuxtLink
      v-for="city in locations.filter((c) => c.slug !== exclude)"
      :key="city.slug"
      :to="localPath(city.slug)"
    >
      {{ city.name }}
    </NuxtLink>
  </nav>
  <div
    v-else
    data-ui="region-city-grid"
    class="
      grid grid-cols-[repeat(5,_1fr)] gap-3.5 max-[1200px]:grid-cols-[repeat(3,_1fr)]
      max-[760px]:grid-cols-2 max-[760px]:gap-3
    "
  >
    <NuxtLink
      v-for="(city, i) in locations.filter((c) => c.slug !== exclude)"
      :key="city.slug"
      :to="localPath(city.slug)"
      data-ui="region-city-card"
      class="
        flex flex-col gap-4 rounded-card border border-solid border-line bg-surface px-[19px]
        py-6 [transition:border-color_0.2s_ease,_background_0.2s_ease] max-[760px]:px-4.5
        max-[760px]:py-[23px] pointer-hover:hover:border-[#688eb8]
        pointer-hover:hover:bg-[#142235] [&_>_svg]:mt-auto [&_>_svg]:text-primary
        [&_[data-ui~='eyebrow']]:text-[8px] [&_h3]:text-[20px] max-[760px]:[&_h3]:text-[22px]
        [&_p]:text-[10px] [&_p]:text-muted
      "
    >
      <span
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
      >
        0{{ i + 1 }} / Strony WWW
      </span>
      <h3>{{ city.name }}</h3>
      <p>{{ city.kicker }}</p>
      <AppIcon
        name="arrow"
        :size="22"
      />
    </NuxtLink>
  </div>
</template>
