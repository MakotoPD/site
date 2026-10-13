<script setup lang="ts">
const { settings } = await useSite()
</script>
<template>
  <aside
    data-ui="local-contact-card"
    class="
      [align-self:start] rounded-card border border-solid border-line bg-surface p-[25px]
      [&_>_p]:mt-[17px] [&_>_p]:text-[9px] [&_>_p]:text-[#7e93ad]
      [&_[data-ui~='eyebrow']]:text-[8px] [&_a]:flex [&_a]:items-center [&_a]:gap-2.5
      [&_a]:py-[9px] [&_a]:text-[11px] [&_a]:[overflow-wrap:anywhere] [&_a]:text-primary
      [&_address]:text-[12px] [&_address]:leading-[1.9] [&_address]:text-[#9fb2c9]
      [&_address]:not-italic [&_h3]:my-[19px] [&_h3]:text-[21px]
    "
  >
    <span
      data-ui="eyebrow"
      class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
    >
      Makoto / Kontakt
    </span>
    <h3>{{ settings.name }}</h3>
    <address v-if="settings.streetAddress && settings.addressLocality">
      {{ settings.streetAddress }}
      <br />
      {{ settings.postalCode }} {{ settings.addressLocality }}
    </address>
    <a
      v-if="settings.phone"
      :href="`tel:${settings.phone.replace(/[^+0-9]/g, '')}`"
    >
      {{ settings.phone }}
      <AppIcon
        name="arrow"
        :size="15"
      />
    </a>
    <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
    <a
      v-if="settings.googleMapsUrl"
      :href="settings.googleMapsUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      Profil firmy w Google
      <AppIcon
        name="external"
        :size="14"
      />
    </a>
    <p>
      Współpraca z firmami w całym województwie kujawsko-pomorskim. Formę kontaktu i spotkania
      ustalamy wcześniej.
    </p>
  </aside>
</template>
