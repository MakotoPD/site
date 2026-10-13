<template>
  <div class="relative min-h-screen overflow-x-clip bg-[#090c10] text-[#f2f4f7]">
    <SeoIdentity />
    <a
      href="#main"
      data-ui="skip-link"
      class="fixed top-[-100px] left-5 z-[100] bg-primary p-3.5 text-background focus:top-3"
    >
      Przejdź do treści
    </a>
    <SiteHeader />
    <main
      id="main"
      class="relative"
    >
      <slot />
    </main>
    <SiteFooter />
    <CookieConsent />
  </div>
</template>
