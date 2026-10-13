<script setup lang="ts">
defineProps<{ number?: string; text: string }>()
</script>
<template>
  <p
    data-ui="section-label"
    class="
      mb-7 flex items-center gap-2.5 text-[9px] tracking-[0.11em] text-[#99a8b9] uppercase
      max-[760px]:mb-5 max-[760px]:text-[8px]
    "
  >
    <span
      v-if="number"
      data-ui="section-number"
      class="mr-1 text-[9px] text-primary"
    >
      {{ number }}
    </span>
    <span>{{ text }}</span>
    <span
      data-ui="label-line"
      class="ml-[3px] h-[1px] w-8 bg-[#566579]"
    />
  </p>
</template>
