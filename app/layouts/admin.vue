<script setup lang="ts">
const open = ref(false)
const route = useRoute()
const toast = useToast()
const links = [
  { to: '/admin', label: 'Przegląd', icon: 'dashboard' as const },
  { to: '/admin/zgloszenia', label: 'Zgłoszenia', icon: 'inbox' as const },
  { to: '/admin/blog', label: 'Blog', icon: 'file' as const },
  { to: '/admin/realizacje', label: 'Realizacje', icon: 'layers' as const },
  { to: '/admin/ustawienia', label: 'Ustawienia', icon: 'settings' as const },
]
watch(
  () => route.path,
  () => {
    open.value = false
  },
)
async function logout() {
  try {
    await $fetch('/api/admin/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  } catch (e) {
    toast.show(errorMessage(e), true)
  }
}
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
</script>
<template>
  <div
    data-ui="admin-app"
    class="flex min-h-[100vh] bg-[#0c1016]"
    @keydown.escape="open = false"
  >
    <aside
      data-ui="admin-sidebar"
      class="
        fixed top-0 right-auto bottom-0 left-0 z-[40] flex w-[230px] flex-col border-r
        [border-right-style:solid] border-r-[#222e3e] bg-[#0d141d] max-[1200px]:w-[205px]
        max-[960px]:w-[190px] max-[760px]:invisible max-[760px]:w-[240px]
        max-[760px]:[transform:translateX(-100%)]
        max-[760px]:[transition:transform_0.25s_var(--ease-out)] [&_nav]:grid [&_nav]:gap-1.5
        [&_nav]:px-3 [&_nav_a]:flex [&_nav_a]:items-center [&_nav_a]:gap-[13px]
        [&_nav_a]:rounded-card [&_nav_a]:border [&_nav_a]:border-solid
        [&_nav_a]:border-transparent [&_nav_a]:p-3.5 [&_nav_a]:text-[11px]
        [&_nav_a]:text-[#94a8c1] [&_nav_a.active]:border-[#2e4763] [&_nav_a.active]:bg-[#1b2b3e]
        [&_nav_a.active]:text-primary max-[760px]:[&.sidebar-open]:visible
        max-[760px]:[&.sidebar-open]:[transform:translateX(0)]
      "
      :class="{ 'sidebar-open': open }"
    >
      <NuxtLink
        to="/admin"
        data-ui="admin-brand"
        class="
          grid gap-3 border-b [border-bottom-style:solid] border-b-[#1b293a] px-[27px] py-8
          max-[960px]:px-[23px] [&_>_span:last-child]:pl-[33px] [&_>_span:last-child]:text-[8px]
          [&_>_span:last-child]:tracking-[0.19em] [&_>_span:last-child]:text-[#657d98]
          [&_[data-ui~='brand']]:text-[27px] max-[760px]:[&_[data-ui~='brand-image']]:w-39
        "
      >
        <BrandLogo />
        <span>STUDIO PANEL</span>
      </NuxtLink>
      <p
        data-ui="admin-nav-label"
        class="px-6 pt-[27px] pb-[13px] text-[8px] tracking-[0.14em] text-[#5c7390] uppercase"
      >
        Twoja przestrzeń
      </p>
      <nav aria-label="Panel administratora">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{
            active: link.to === '/admin' ? route.path === link.to : route.path.startsWith(link.to),
          }"
        >
          <AppIcon
            :name="link.icon"
            :size="18"
          />
          {{ link.label }}
          <span
            v-if="link.icon === 'inbox'"
            data-ui="sidebar-dot"
            class="ml-auto h-1 w-1 rounded-full bg-primary"
          />
        </NuxtLink>
      </nav>
      <div
        data-ui="admin-sidebar-bottom"
        class="
          mt-auto px-[25px] pt-[25px] pb-5 [&_>_a]:flex [&_>_a]:w-full [&_>_a]:items-center
          [&_>_a]:gap-3 [&_>_a]:border-0 [&_>_a]:border-none [&_>_a]:py-3 [&_>_a]:text-[10px]
          [&_>_a]:text-[#859eba] [&_>_a]:[background:none] [&_>_button]:flex [&_>_button]:w-full
          [&_>_button]:items-center [&_>_button]:gap-3 [&_>_button]:border-0
          [&_>_button]:border-none [&_>_button]:py-3 [&_>_button]:text-[10px]
          [&_>_button]:text-[#859eba] [&_>_button]:[background:none]
        "
      >
        <NuxtLink
          to="/"
          target="_blank"
        >
          <AppIcon
            name="external"
            :size="16"
          />
          Otwórz stronę
        </NuxtLink>
        <button @click="logout">
          <AppIcon
            name="logout"
            :size="16"
          />
          Wyloguj się
        </button>
        <div
          data-ui="admin-profile"
          class="
            mt-3 flex items-center gap-2.5 border-t [border-top-style:solid] border-t-[#25384d]
            pt-[23px] [&_>_[data-ui~='status-dot']]:ml-auto [&_>_[data-ui~='status-dot']]:h-1
            [&_>_[data-ui~='status-dot']]:w-1 [&_>_div_>_span]:mt-[3px] [&_>_div_>_span]:block
            [&_>_div_>_span]:text-[8px] [&_>_div_>_span]:text-[#6c86a3] [&_img]:shrink-0
            [&_img]:rounded-[50%] [&_strong]:block [&_strong]:text-[11px]
          "
        >
          <img
            src="/images/avatar.webp"
            alt=""
            width="34"
            height="34"
          />
          <div>
            <strong>Makoto</strong>
            <span>Administrator</span>
          </div>
          <span
            data-ui="status-dot"
            class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
          />
        </div>
      </div>
    </aside>
    <div
      v-if="open"
      data-ui="sidebar-backdrop"
      class="
        hidden max-[760px]:fixed max-[760px]:top-0 max-[760px]:right-0 max-[760px]:bottom-0
        max-[760px]:left-0 max-[760px]:z-[35] max-[760px]:block max-[760px]:bg-[#020710bb]
      "
      @click="open = false"
    />
    <div
      data-ui="admin-content"
      class="
        ml-[230px] w-[calc(100%_-_230px)] max-[1200px]:ml-[205px]
        max-[1200px]:w-[calc(100%_-_205px)] max-[960px]:ml-[190px]
        max-[960px]:w-[calc(100%_-_190px)] max-[760px]:ml-0 max-[760px]:w-full
      "
    >
      <header
        data-ui="admin-topbar"
        class="
          flex h-[75px] items-center justify-between gap-5 border-b [border-bottom-style:solid]
          border-b-[#202d3d] px-10 max-[1200px]:px-7 max-[960px]:px-[23px] max-[760px]:h-16.5
          max-[760px]:justify-start max-[760px]:gap-[15px] max-[760px]:px-5
          [&_>_span:first-of-type]:flex [&_>_span:first-of-type]:items-center
          [&_>_span:first-of-type]:gap-3.5 [&_>_span:first-of-type]:text-[10px]
          [&_>_span:first-of-type]:text-[#7890ac] [&_strong]:text-[10px] [&_strong]:font-normal
          [&_strong]:text-[#b1c3d9]
        "
      >
        <button
          data-ui="icon-button admin-menu"
          class="
            hidden h-10 w-10 items-center justify-center rounded-control border border-solid
            border-line bg-transparent text-ink max-[760px]:grid max-[760px]:h-8.5
            max-[760px]:w-8.5
          "
          aria-label="Menu panelu"
          :aria-expanded="open"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" />
        </button>
        <span>
          Makoto Studio
          <AppIcon
            name="chevron"
            :size="12"
          />
          <strong>
            {{
              route.path.includes('/zgloszenia')
                ? 'Zgłoszenia'
                : route.path.includes('/blog')
                  ? 'Blog'
                  : route.path.includes('/realizacje')
                    ? 'Realizacje'
                    : route.path.includes('/ustawienia')
                      ? 'Ustawienia'
                      : 'Przegląd'
            }}
          </strong>
        </span>
        <span
          data-ui="admin-topbar-status"
          class="
            flex items-center gap-2 text-[8px] text-[#6984a4] max-[960px]:hidden
            [&_[data-ui~='status-dot']]:h-1 [&_[data-ui~='status-dot']]:w-1
          "
        >
          <span
            data-ui="status-dot"
            class="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_12px_#b5dcff44]"
          />
          Twoje centrum dowodzenia
        </span>
      </header>
      <main
        data-ui="admin-main"
        class="
          mx-auto max-w-[1500px] px-10 pt-[43px] pb-17.5 max-[1200px]:px-7 max-[960px]:px-[23px]
          max-[760px]:px-5 max-[760px]:pt-7.5 max-[760px]:pb-12.5
        "
      >
        <slot />
      </main>
      <div
        data-ui="admin-bottom"
        class="
          border-t [border-top-style:solid] border-t-[#1c2939] px-10 py-5 text-[8px]
          text-[#536a86] max-[760px]:px-5
        "
      >
        Makoto Studio · Dane zapisują się na serwerze.
      </div>
    </div>
  </div>
</template>
