<script setup lang="ts">
const open = ref(false)
const route = useRoute()
const links = [
  { to: '/uslugi', label: 'Usługi' },
  { to: '/realizacje', label: 'Realizacje' },
  { to: '/obszar-dzialania', label: 'Region' },
  { to: '/o-mnie', label: 'O mnie' },
  { to: '/blog', label: 'Blog' },
  { to: '/kontakt', label: 'Kontakt' },
]
watch(
  () => route.path,
  () => {
    open.value = false
  },
)
function closeOnEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
</script>
<template>
  <header
    data-ui="site-header"
    class="
      sticky top-0 z-[50] border-b [border-bottom-style:solid] border-b-[#ffffff0c]
      bg-[#090c10ec] [backdrop-filter:blur(18px)] max-[360px]:[&_[data-ui~='brand-image']]:w-24.5
    "
    @keydown="closeOnEscape"
  >
    <div
      data-ui="header-inner shell"
      class="
        mx-auto flex h-21.5 w-[min(1320px,_calc(100%_-_112px))] items-center justify-between
        gap-7.5 max-[1200px]:w-[calc(100%_-_80px)] max-[960px]:h-19
        max-[960px]:w-[calc(100%_-_48px)] max-[960px]:gap-5 max-[760px]:h-[73px]
        max-[760px]:w-[calc(100%_-_40px)] max-[400px]:w-[calc(100%_-_32px)] max-[360px]:gap-2
      "
    >
      <NuxtLink
        to="/"
        aria-label="Makoto — strona główna"
      >
        <BrandLogo />
      </NuxtLink>
      <nav
        data-ui="desktop-nav"
        class="
          ml-20 flex items-center gap-7.5 max-[1200px]:ml-0 max-[1200px]:gap-5.5
          max-[960px]:gap-[17px] max-[760px]:hidden [&_a]:text-[11px] [&_a]:text-[#b2bac5]
          [&_a]:[transition:color_0.15s_ease] max-[960px]:[&_a]:text-[10px]
          [&_a.router-link-active]:text-primary pointer-hover:[&_a:hover]:text-primary
        "
        aria-label="Nawigacja główna"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
      <div
        data-ui="header-actions"
        class="
          flex items-center gap-3 max-[760px]:gap-[9px]
          max-[960px]:[&_>_[data-ui~='button']]:gap-3
          max-[960px]:[&_>_[data-ui~='button']]:px-3.5
          max-[960px]:[&_>_[data-ui~='button']]:py-2.5
          max-[400px]:[&_>_[data-ui~='button']]:gap-2 max-[400px]:[&_>_[data-ui~='button']]:px-3
          max-[400px]:[&_>_[data-ui~='button']]:py-2.5
          max-[400px]:[&_>_[data-ui~='button']]:text-[10px]
        "
      >
        <NuxtLink
          to="/wycena"
          data-ui="button button-small"
          class="
            inline-flex min-h-10.5 items-center justify-center gap-6 rounded-control border
            border-solid border-primary bg-primary px-4.5 py-[11px] text-[11px] font-bold
            whitespace-nowrap text-[#111b27]
            [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
            pointer-hover:hover:border-[#d0e9ff] pointer-hover:hover:bg-[#d0e9ff]
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Wyceń projekt
          <AppIcon
            name="arrow"
            :size="16"
          />
        </NuxtLink>
        <button
          data-ui="menu-toggle icon-button"
          class="
            hidden h-10 w-10 items-center justify-center rounded-control border border-solid
            border-line bg-transparent text-ink max-[760px]:inline-flex
          "
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? 'Zamknij menu' : 'Otwórz menu'"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" />
        </button>
      </div>
    </div>
    <nav
      v-if="open"
      id="mobile-nav"
      data-ui="mobile-nav shell"
      class="
        mx-auto w-[min(1320px,_calc(100%_-_112px))] pt-3 pb-7.5
        max-[1200px]:w-[calc(100%_-_80px)] max-[960px]:w-[calc(100%_-_48px)]
        max-[760px]:w-[calc(100%_-_40px)] max-[400px]:w-[calc(100%_-_32px)] [&_a]:flex
        [&_a]:items-center [&_a]:gap-6 [&_a]:border-b [&_a]:[border-bottom-style:solid]
        [&_a]:border-b-line [&_a]:px-0 [&_a]:py-4.5 [&_a]:text-[21px] [&_a_span]:text-[11px]
        [&_a_span]:text-muted [&_a_svg]:ml-auto
      "
      aria-label="Menu mobilne"
    >
      <NuxtLink
        v-for="(link, i) in links"
        :key="link.to"
        :to="link.to"
      >
        <span>0{{ i + 1 }}</span>
        {{ link.label }}
        <AppIcon name="arrow" />
      </NuxtLink>
    </nav>
  </header>
</template>
