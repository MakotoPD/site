<script setup lang="ts">
const props = defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
useSeoMeta({
  title: () =>
    `${props.error.statusCode === 404 ? 'Nie znaleziono strony' : 'Błąd strony'} — Makoto`,
  robots: 'noindex, nofollow',
})
</script>
<template>
  <div
    data-ui="error-page"
    class="
      flex min-h-[100vh] flex-col items-center justify-center p-7.5 text-center
      [&_h1]:text-[36px] [&_p]:mt-5 [&_p]:mb-7.5 [&_p]:text-muted
    "
  >
    <BrandLogo />
    <span
      data-ui="error-number"
      class="mt-[25px] mb-2.5 block font-serif text-[150px] text-primary"
    >
      {{ error.statusCode || 500 }}
    </span>
    <h1>
      {{
        error.statusCode === 404 ? 'Ten pomysł jeszcze nie istnieje.' : 'Coś wymaga małej poprawki.'
      }}
    </h1>
    <p>
      {{
        error.statusCode === 404
          ? 'Nie znaleziono strony. Wróćmy na dobry początek.'
          : 'Spróbuj ponownie za chwilę.'
      }}
    </p>
    <button
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
      @click="clearError({ redirect: '/' })"
    >
      Wróć na stronę główną
      <AppIcon name="arrow" />
    </button>
  </div>
</template>
