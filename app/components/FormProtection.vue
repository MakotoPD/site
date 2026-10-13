<script setup lang="ts">
import { turnstileTestSiteKey, type TurnstileAction } from '#shared/turnstile'
defineProps<{ action: TurnstileAction }>()
const token = defineModel<string>({ default: '' })
const config = useRuntimeConfig()
const widget = useTemplateRef<{ reset: () => void }>('widget')
const container = useTemplateRef<HTMLDivElement>('container')
const ready = ref(false),
  widgetSize = ref<'compact' | 'flexible'>('flexible')
let resizeObserver: ResizeObserver | undefined
const siteKey = import.meta.dev ? turnstileTestSiteKey : config.public.turnstile.siteKey
const failed = ref(false)
let refresh: ReturnType<typeof setTimeout> | undefined
watch(token, (value) => {
  clearTimeout(refresh)
  if (value) refresh = setTimeout(reset, 240000)
})
onMounted(() => {
  function measure() {
    const size = (container.value?.clientWidth || 300) < 300 ? 'compact' : 'flexible'
    if (size !== widgetSize.value) {
      token.value = ''
      widgetSize.value = size
    }
    ready.value = true
  }
  measure()
  resizeObserver = new ResizeObserver(measure)
  if (container.value) resizeObserver.observe(container.value)
})
onBeforeUnmount(() => {
  clearTimeout(refresh)
  resizeObserver?.disconnect()
})
function reset() {
  token.value = ''
  failed.value = false
  widget.value?.reset()
}
function invalidate() {
  token.value = ''
  failed.value = true
}
defineExpose({ reset })
</script>
<template>
  <div
    ref="container"
    data-ui="form-protection"
    class="my-4.5 min-h-16.5 max-w-full [&_iframe]:max-w-full"
  >
    <ClientOnly>
      <NuxtTurnstile
        v-if="siteKey && ready"
        :key="widgetSize"
        ref="widget"
        v-model="token"
        :site-key="siteKey"
        :options="{
          theme: 'dark',
          size: widgetSize,
          action,
          language: 'pl',
          'expired-callback': invalidate,
          'error-callback': invalidate,
          'timeout-callback': invalidate,
        }"
        :reset-interval="86400000"
      />
      <p
        v-else-if="!siteKey"
        data-ui="form-error"
        class="
          rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
          text-[11px] text-[#ffc0c0]
        "
      >
        Formularz jest chwilowo niedostępny. Napisz na
        <a href="mailto:contact@makoto.com.pl">contact@makoto.com.pl</a>
        .
      </p>
      <template #fallback>
        <p
          data-ui="form-note"
          class="mt-[-8px] text-[9px] text-[#748297]"
        >
          Ładowanie zabezpieczenia formularza…
        </p>
      </template>
    </ClientOnly>
    <p
      v-if="failed"
      data-ui="form-error"
      class="
        rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
        text-[11px] text-[#ffc0c0]
      "
      role="status"
    >
      Ponów weryfikację zabezpieczenia.
      <button
        type="button"
        data-ui="text-link"
        class="
          inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
          px-0 py-3 text-[12px] font-medium text-ink
          [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @click="reset"
      >
        Spróbuj ponownie
      </button>
    </p>
  </div>
</template>
