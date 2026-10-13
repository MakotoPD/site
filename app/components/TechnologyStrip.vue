<script setup lang="ts">
const technologies = [
  { name: 'Nuxt', icon: 'i-simple-icons-nuxt' },
  { name: 'Vue.js', icon: 'i-simple-icons-vuedotjs' },
  { name: 'Tailwind CSS', icon: 'i-simple-icons-tailwindcss' },
  { name: 'GSAP', icon: 'i-simple-icons-gsap' },
  { name: 'Figma', icon: 'i-simple-icons-figma' },
]
</script>

<template>
  <div
    data-ui="tech-strip"
    class="border-y border-white/[0.02] bg-[#0e1218]"
  >
    <div
      data-ui="shell"
      class="
        mx-auto flex min-h-[105px] w-[min(1320px,calc(100%-112px))] items-center justify-between
        gap-[25px] max-[1200px]:w-[calc(100%-80px)] max-[960px]:w-[calc(100%-48px)]
        max-[760px]:min-h-0 max-[760px]:w-[calc(100%-40px)] max-[760px]:flex-wrap
        max-[760px]:justify-center max-[760px]:gap-y-[22px] max-[760px]:py-[25px]
        max-[400px]:w-[calc(100%-32px)]
      "
    >
      <span
        class="text-[9px] leading-[1.7] tracking-[0.01em] text-[#737f8e] max-[760px]:w-full max-[760px]:text-center"
      >
        Dobry pomysł zasługuje
        <br class="max-[760px]:hidden" />
        na dobre narzędzia.
      </span>
      <span
        v-for="technology in technologies"
        :key="technology.name"
        data-ui="tech-logo"
        class="
          flex items-center gap-[7px] text-[21px] font-[650] tracking-[-0.05em] whitespace-nowrap
          text-[#929ca9] max-[960px]:text-[18px] max-[760px]:text-[17px]
        "
        :role="technology.name === 'GSAP' ? 'img' : undefined"
        :aria-label="technology.name === 'GSAP' ? 'GSAP' : undefined"
      >
        <Icon
          :name="technology.icon"
          :class="
            technology.name === 'GSAP'
              ? 'size-[76px]! max-[760px]:h-[40px]! max-[760px]:w-[64px]!'
              : 'size-[26px]! max-[760px]:size-[22px]!'
          "
          class="shrink-0"
          aria-hidden="true"
        />
        <template v-if="technology.name !== 'GSAP'">{{ technology.name }}</template>
      </span>
      <span
        class="text-right text-[9px] leading-[1.7] tracking-[0.01em] text-[#737f8e] max-[1200px]:hidden"
      >
        Narzędzia się zmieniają.
        <br />
        Dobry warsztat zostaje.
      </span>
    </div>
  </div>
</template>
