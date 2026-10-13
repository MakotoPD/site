<script setup lang="ts">
const { consent, decided, settingsOpen, save, acceptAll, rejectAll } = useCookieConsent()
const draft = reactive({ analytics: false })
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
watch(settingsOpen, async (open) => {
  await nextTick()
  if (open) {
    Object.assign(draft, consent.value)
    dialog.value?.showModal()
  } else dialog.value?.close()
})
</script>
<template>
  <aside
    v-if="!decided && !settingsOpen"
    data-ui="cookie-banner"
    class="
      fixed bottom-5.5 left-5.5 z-[100] w-[min(490px,_calc(100vw_-_44px))] rounded-[20px] border
      border-solid border-[#34414e] bg-[#111820] p-6.5 text-ink shadow-[0_16px_70px_#0008]
      max-[600px]:bottom-3 max-[600px]:left-3 max-[600px]:w-[calc(100vw_-_24px)] max-[600px]:p-5
    "
    aria-label="Ustawienia prywatności"
  >
    <span
      data-ui="eyebrow"
      class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
    >
      Twoja prywatność
    </span>
    <h2 class="mx-0 my-3 text-[25px] tracking-[-0.8px]">Ty wybierasz, co zapisujemy.</h2>
    <p
      class="
        text-[13px] leading-[1.7] text-[#a8b7c5] [&_a]:text-primary [&_a]:underline
        [&_a]:[text-underline-offset:3px]
      "
    >
      Za Twoją zgodą mierzę ruch i skuteczność strony. Niezbędne zabezpieczenia formularzy działają
      niezależnie od tego wyboru.
      <NuxtLink to="/prywatnosc">Poznaj szczegóły</NuxtLink>
      .
    </p>
    <div
      data-ui="cookie-actions"
      class="
        mt-5 flex flex-wrap gap-2.5 [&_[data-ui~='button']]:min-h-10.5
        [&_[data-ui~='button']]:px-4.5 [&_[data-ui~='button']]:py-3
        [&_[data-ui~='button']]:text-[12px] max-[600px]:[&_[data-ui~='button']]:flex-1
        max-[600px]:[&_[data-ui~='button']]:justify-center
      "
    >
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
        @click="acceptAll"
      >
        Akceptuj wszystkie
      </button>
      <button
        data-ui="button button-outline"
        class="
          inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
          border-solid border-[#475362] bg-transparent px-6 py-[15px] text-[12px] font-bold
          whitespace-nowrap text-ink
          [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
          pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
          pointer-hover:hover:text-primary [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @click="rejectAll"
      >
        Tylko niezbędne
      </button>
    </div>
    <button
      data-ui="cookie-settings-link"
      class="mt-[17px] inline-block text-[12px] text-primary underline [text-underline-offset:4px]"
      @click="settingsOpen = true"
    >
      Dostosuj ustawienia
    </button>
  </aside>
  <dialog
    ref="dialog"
    data-ui="cookie-dialog"
    class="
      m-auto max-h-[calc(100dvh_-_32px)] w-[min(550px,_calc(100vw_-_32px))] overflow-y-auto
      rounded-[20px] border border-solid border-[#34414e] bg-[#111820] p-6.5 text-ink
      shadow-[0_16px_70px_#0008] [&::backdrop]:bg-[#000a]
      [&::backdrop]:[backdrop-filter:blur(5px)]
    "
    aria-labelledby="cookie-title"
    @close="settingsOpen = false"
    @cancel="settingsOpen = false"
  >
    <div
      data-ui="cookie-dialog-heading"
      class="flex items-center justify-between"
    >
      <span
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
      >
        Ustawienia prywatności
      </span>
      <button
        data-ui="cookie-close"
        class="rounded-[8px] p-2"
        aria-label="Zamknij ustawienia"
        @click="settingsOpen = false"
      >
        <AppIcon name="close" />
      </button>
    </div>
    <h2
      class="mx-0 my-3 text-[25px] tracking-[-0.8px]"
      id="cookie-title"
    >
      Twój wybór.
    </h2>
    <p
      class="
        text-[13px] leading-[1.7] text-[#a8b7c5] [&_a]:text-primary [&_a]:underline
        [&_a]:[text-underline-offset:3px]
      "
    >
      Zgodę możesz zmienić w każdej chwili przez link w stopce.
    </p>
    <div
      data-ui="cookie-category"
      class="
        mt-3.5 flex items-center justify-between gap-4.5 border-t [border-top-style:solid]
        border-t-[#2b3641] px-0 py-5 [&_+_[data-ui~='cookie-category']]:mt-0 [&_input]:h-5
        [&_input]:w-5 [&_input]:shrink-0 [&_input]:[accent-color:#b5dcff] [&_p]:mt-[5px]
        [&_p]:max-w-[355px] [&_p]:text-[12px] [&_strong]:text-[14px]
      "
    >
      <div>
        <strong>Niezbędne</strong>
        <p
          class="
            text-[13px] leading-[1.7] text-[#a8b7c5] [&_a]:text-primary [&_a]:underline
            [&_a]:[text-underline-offset:3px]
          "
        >
          Zabezpieczenie formularzy, zapamiętanie tego wyboru i sesja administratora.
        </p>
      </div>
      <span
        data-ui="cookie-always"
        class="text-right text-[10px] text-primary"
      >
        Zawsze aktywne
      </span>
    </div>
    <label
      data-ui="cookie-category"
      class="
        mt-3.5 flex items-center justify-between gap-4.5 border-t [border-top-style:solid]
        border-t-[#2b3641] px-0 py-5 [&_+_[data-ui~='cookie-category']]:mt-0 [&_input]:h-5
        [&_input]:w-5 [&_input]:shrink-0 [&_input]:[accent-color:#b5dcff] [&_p]:mt-[5px]
        [&_p]:max-w-[355px] [&_p]:text-[12px] [&_strong]:text-[14px]
      "
    >
      <div>
        <strong>Analityka</strong>
        <p
          class="
            text-[13px] leading-[1.7] text-[#a8b7c5] [&_a]:text-primary [&_a]:underline
            [&_a]:[text-underline-offset:3px]
          "
        >
          Google Analytics i Umami pomagają sprawdzić, które treści są przydatne.
        </p>
      </div>
      <input
        v-model="draft.analytics"
        type="checkbox"
        aria-label="Zgoda na analitykę"
      />
    </label>
    <div
      data-ui="cookie-actions"
      class="
        mt-5 flex flex-wrap gap-2.5 [&_[data-ui~='button']]:min-h-10.5
        [&_[data-ui~='button']]:px-4.5 [&_[data-ui~='button']]:py-3
        [&_[data-ui~='button']]:text-[12px] max-[600px]:[&_[data-ui~='button']]:flex-1
        max-[600px]:[&_[data-ui~='button']]:justify-center
      "
    >
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
        @click="save(draft)"
      >
        Zapisz wybór
      </button>
      <button
        data-ui="button button-outline"
        class="
          inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
          border-solid border-[#475362] bg-transparent px-6 py-[15px] text-[12px] font-bold
          whitespace-nowrap text-ink
          [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
          pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
          pointer-hover:hover:text-primary [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @click="rejectAll"
      >
        Tylko niezbędne
      </button>
    </div>
    <NuxtLink
      to="/prywatnosc"
      data-ui="cookie-settings-link"
      class="mt-[17px] inline-block text-[12px] text-primary underline [text-underline-offset:4px]"
      @click="settingsOpen = false"
    >
      Polityka prywatności
    </NuxtLink>
  </dialog>
</template>
