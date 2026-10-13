<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    eyebrow?: string
    picture?: string
    domain?: string
  }>(),
  {
    description: '',
    eyebrow: 'Design. Kod. Charakter.',
    picture: 'architecture',
    domain: 'makoto.com.pl',
  },
)
const photos: Record<string, string> = {
  architecture: '/images/editorial/architecture-1280.webp',
  systems: '/images/editorial/systems-1280.webp',
  form: '/images/editorial/form-1280.webp',
  water: '/images/editorial/water-1920.webp',
}
const photo = computed(() =>
  Object.hasOwn(photos, props.picture) ? photos[props.picture] : photos.architecture,
)
const headingSize = computed(() =>
  props.title.length > 140 ? 42 : props.title.length > 100 ? 47 : props.title.length > 65 ? 57 : 69,
)
</script>

<template>
  <div
    class="relative flex h-[630px] w-[1200px] overflow-hidden bg-background font-social font-normal text-ink"
  >
    <img
      :src="photo"
      width="510"
      height="630"
      class="absolute top-0 right-0 h-[630px] w-[510px] object-cover opacity-55"
    />
    <div
      class="
        absolute top-0 right-0 h-[630px] w-[640px]
        bg-[linear-gradient(90deg,#090c10_0%,#090c1080_55%,#090c1020_100%)]
      "
    />
    <div class="absolute top-[52px] right-[56px] left-[56px] flex items-center justify-between">
      <img
        src="/brand/makoto.png"
        width="235"
        height="50"
        class="h-[50px] w-[235px] shrink-0 object-contain"
      />
      <span class="text-[15px] text-primary">{{ domain }}</span>
    </div>
    <div class="absolute top-[155px] left-[56px] flex w-[765px] flex-col">
      <div class="mb-[26px] flex items-center gap-[13px] text-[16px] text-primary">
        <span class="size-[7px] shrink-0 rounded-full bg-primary" />
        <span>{{ eyebrow }}</span>
      </div>
      <div
        class="max-h-[236px] overflow-hidden leading-[1.12] font-semibold tracking-[-2.3px]"
        :style="{ fontSize: `${headingSize}px` }"
      >
        {{ title }}
      </div>
      <div
        v-if="description"
        class="mt-[25px] max-h-[60px] w-[690px] overflow-hidden text-[18px] leading-[1.6] text-[#a8bdd2]"
      >
        {{ description }}
      </div>
    </div>
    <div
      class="absolute right-[56px] bottom-[42px] left-[56px] flex items-center justify-between pt-[22px]"
    >
      <div class="absolute top-0 right-0 left-0 h-[1px] bg-[#4c648055]" />
      <span class="font-serif text-[31px] text-primary italic">Twój pomysł. Mój warsztat.</span>
      <span class="text-[14px] text-[#c1d6e9]">Inowrocław / Kujawsko-Pomorskie</span>
    </div>
  </div>
</template>
