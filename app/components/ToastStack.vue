<script setup lang="ts">
const { messages } = useToast()
</script>
<template>
  <div
    data-ui="toast-stack"
    class="
      pointer-events-none fixed right-[25px] bottom-[25px] z-[100] grid w-[calc(100%_-_50px)]
      max-w-[420px] gap-2.5
    "
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup name="toast">
      <div
        v-for="message in messages"
        :key="message.id"
        data-ui="toast"
        class="
          pointer-events-auto flex items-center gap-3 rounded-card border border-solid
          border-[#426383] bg-[#18283aec] p-[17px] text-[11px] text-[#d4e8fe]
          shadow-[0_10px_40px_#0005] [backdrop-filter:blur(16px)] [&_>_button]:ml-auto
          [&_>_button]:border-0 [&_>_button]:border-none [&_>_button]:text-[inherit]
          [&_>_button]:[background:none] [&_>_svg]:text-primary [&.toast-error]:border-[#94575b]
          [&.toast-error]:bg-[#2f1c23] [&.toast-error]:text-[#ffd0d0]
        "
        :class="{ 'toast-error': message.error }"
      >
        <AppIcon :name="message.error ? 'close' : 'success'" />
        <span>{{ message.text }}</span>
        <button
          aria-label="Zamknij powiadomienie"
          @click="messages = messages.filter((m) => m.id !== message.id)"
        >
          <AppIcon
            name="close"
            :size="16"
          />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
