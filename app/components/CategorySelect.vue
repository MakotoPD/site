<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
const model = defineModel<string>({ required: true })
const props = defineProps<{ options: string[] }>()
const search = ref(''),
  created = computed(() => {
    const value = search.value.trim()
    return value.length >= 2 && !props.options.includes(value) ? value : ''
  })
</script>
<template>
  <ComboboxRoot
    v-model="model"
    open-on-click
  >
    <ComboboxAnchor class="relative">
      <ComboboxInput
        v-model="search"
        class="pr-10!"
        placeholder="Wybierz lub wpisz nową"
        maxlength="60"
        required
      />
      <ComboboxTrigger
        class="absolute right-0 bottom-0 grid h-[43px] w-10 place-items-center text-[#94a8c1]"
        aria-label="Pokaż kategorie"
      >
        <AppIcon
          name="down"
          :size="14"
        />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxPortal>
      <ComboboxContent
        position="popper"
        :side-offset="6"
        class="
          z-50 max-h-[min(280px,var(--reka-combobox-content-available-height))]
          w-(--reka-combobox-trigger-width) overflow-y-auto rounded-control border border-solid
          border-[#2e4763] bg-[#0d141d] p-1.5 text-[11px] text-[#c2cdd9]
          shadow-[0_18px_40px_#0008]
        "
      >
        <ComboboxViewport>
          <ComboboxItem
            v-for="option in options"
            :key="option"
            :value="option"
            class="
              flex cursor-pointer items-center justify-between gap-3 rounded-[4px] px-3 py-2.5
              outline-none data-highlighted:bg-[#1b2b3e] data-highlighted:text-primary
            "
          >
            {{ option }}
            <ComboboxItemIndicator>
              <AppIcon
                name="check"
                :size="14"
              />
            </ComboboxItemIndicator>
          </ComboboxItem>
          <ComboboxItem
            v-if="created"
            :value="created"
            :text-value="search"
            class="
              flex cursor-pointer items-center gap-2 rounded-[4px] px-3 py-2.5 text-primary
              outline-none data-highlighted:bg-[#1b2b3e]
            "
          >
            <AppIcon
              name="plus"
              :size="14"
            />
            Utwórz „{{ created }}”
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>
