<script setup lang="ts">
import { identityGraph } from '#shared/schema'
const { settings } = await useSite()
const site = useRuntimeConfig().public.siteUrl
useStructuredData('makoto-identity', () => identityGraph(settings.value, site))
</script>
<template>
  <span
    hidden
    aria-hidden="true"
  />
</template>
