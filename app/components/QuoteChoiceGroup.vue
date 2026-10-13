<script setup lang="ts">
const props = defineProps<{
  name: string
  question: string
  hint?: string
  options: { value: string; label: string; detail?: string; price?: string; explanation?: string }[]
}>()
const model = defineModel<string>({ required: true })
const selected = computed(() => props.options.find((o) => o.value === model.value))
</script>

<template>
  <fieldset
    data-ui="quote-question"
    class="
      m-0 min-w-0 border-t-0 border-r-0 border-b border-l-0 border-solid border-b-line px-0
      py-[27px] [&_legend]:float-left [&_legend]:mb-2 [&_legend]:w-full [&_legend]:text-[20px]
      [&_legend]:leading-[1.5] [&_legend]:[font-weight:550] [&_legend]:tracking-[-0.025em]
      max-[760px]:[&_legend]:text-[19px] [&_legend_+_*]:clear-both
    "
  >
    <legend>{{ question }}</legend>
    <p
      v-if="hint"
      :id="`${name}-hint`"
      data-ui="quote-question-hint"
      class="mb-4.5 max-w-[660px] text-[14px] leading-[1.8] text-muted max-[760px]:text-[13px]"
    >
      {{ hint }}
    </p>
    <div
      data-ui="quote-answer-grid"
      class="
        grid grid-cols-1 gap-2.5 max-[1100px]:grid-cols-1
        [&_[data-ui~='quote-answer']]:flex-nowrap [&_[data-ui~='quote-answer']]:px-4.5
        [&_[data-ui~='quote-answer']]:py-[17px]
        max-[1100px]:[&_[data-ui~='quote-answer']]:flex-nowrap
        max-[760px]:[&_[data-ui~='quote-answer']]:p-4
        max-[420px]:[&_[data-ui~='quote-answer']]:flex-wrap
        [&_[data-ui~='quote-answer-price']]:mx-0 [&_[data-ui~='quote-answer-price']]:mt-0.5
        [&_[data-ui~='quote-answer-price']]:mb-0 [&_[data-ui~='quote-answer-price']]:basis-auto
        [&_[data-ui~='quote-answer-price']]:p-0 [&_[data-ui~='quote-answer-price']]:text-[13px]
        max-[1100px]:[&_[data-ui~='quote-answer-price']]:mt-0.5
        max-[1100px]:[&_[data-ui~='quote-answer-price']]:basis-auto
        max-[1100px]:[&_[data-ui~='quote-answer-price']]:p-0
        max-[760px]:[&_[data-ui~='quote-answer-price']]:text-[12px]
        max-[420px]:[&_[data-ui~='quote-answer-price']]:mt-[1px]
        max-[420px]:[&_[data-ui~='quote-answer-price']]:basis-full
        max-[420px]:[&_[data-ui~='quote-answer-price']]:pl-7 [&.answer-grid]:mt-7.5
        [&.answer-grid]:mb-15 [&.answer-grid]:grid [&.answer-grid]:grid-cols-2
        [&.answer-grid]:gap-5 max-[760px]:[&.answer-grid]:grid-cols-1 [&.quote-answer]:relative
        [&.quote-answer]:flex [&.quote-answer]:min-w-0 [&.quote-answer]:cursor-pointer
        [&.quote-answer]:items-start [&.quote-answer]:gap-2.5 [&.quote-answer]:rounded-control
        [&.quote-answer]:border [&.quote-answer]:border-solid [&.quote-answer]:border-line
        [&.quote-answer]:bg-surface [&.quote-answer]:px-[13px] [&.quote-answer]:py-[15px]
        [&.quote-answer]:[transition:background_160ms_ease,_border-color_160ms_ease]
        motion-reduce:[&.quote-answer]:[transition-duration:0ms]
        max-[760px]:[&.quote-answer]:p-[17px] [&.quote-answer_input]:absolute
        [&.quote-answer_input]:m-0! [&.quote-answer_input]:h-[1px]
        [&.quote-answer_input]:w-[1px]! [&.quote-answer_input]:opacity-[0]
        [&.quote-answer-grid--many]:grid-cols-2
        max-[1100px]:[&.quote-answer-grid--many]:grid-cols-1
        [&.quote-answer.is-selected]:border-[#809db9]
        [&.quote-answer.is-selected]:bg-[var(--surface-accent)]
        [&.quote-answer:focus-within]:[outline:2px_solid_var(--blue)]
        [&.quote-answer:focus-within]:[outline-offset:3px]
        pointer-hover:[&.quote-answer:hover]:border-[#7994b0]
      "
      :class="{ 'quote-answer-grid--many': options.length > 3 }"
    >
      <label
        v-for="option in options"
        :key="option.value"
        data-ui="quote-answer"
        class="
          relative flex min-w-0 cursor-pointer items-start gap-2.5 rounded-control border
          border-solid border-line bg-surface px-[13px] py-[15px]
          [transition:background_160ms_ease,_border-color_160ms_ease]
          motion-reduce:[transition-duration:0ms] max-[760px]:p-[17px]
          pointer-hover:hover:border-[#7994b0] [&_input]:absolute [&_input]:m-0!
          [&_input]:h-[1px] [&_input]:w-[1px]! [&_input]:opacity-[0]
          [&.is-selected]:border-[#809db9] [&.is-selected]:bg-[var(--surface-accent)]
          [&.is-selected_[data-ui~='quote-answer-checkbox']]:bg-primary
          [&.is-selected_[data-ui~='quote-answer-radio']]:border-primary
          [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:h-[7px]
          [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:w-[7px]
          [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:rounded-[50%]
          [&.is-selected_[data-ui~='quote-answer-radio']_>_span]:bg-primary
          [&.selected_.option-checkbox]:border-primary [&.selected_.option-checkbox]:bg-primary
          [&.selected_.option-checkbox]:text-background
          [&.selected_[data-ui~='option-radio']]:border-primary
          [&.selected_[data-ui~='option-radio']]:bg-primary
          [&.selected_[data-ui~='option-radio']]:text-background
          [&:focus-within]:[outline:2px_solid_var(--blue)] [&:focus-within]:[outline-offset:3px]
        "
        :class="{ 'is-selected': model === option.value }"
      >
        <input
          v-model="model"
          type="radio"
          :name="name"
          :value="option.value"
          :aria-describedby="hint ? `${name}-hint` : undefined"
        />
        <span
          data-ui="quote-answer-radio"
          class="
            mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[50%] border border-solid
            border-[#687a8d]
          "
          aria-hidden="true"
        >
          <span />
        </span>
        <span
          data-ui="quote-answer-copy"
          class="
            min-w-0 flex-1 pr-[7px] [&_small]:mt-[5px] [&_small]:block [&_small]:text-[12px]
            [&_small]:leading-[1.6] [&_small]:text-muted max-[760px]:[&_small]:text-[11px]
            [&_strong]:block [&_strong]:text-[14px] [&_strong]:leading-[1.5]
            [&_strong]:font-medium max-[760px]:[&_strong]:text-[14px]
          "
        >
          <strong>{{ option.label }}</strong>
          <small v-if="option.detail">{{ option.detail }}</small>
        </span>
        <span
          v-if="option.price"
          data-ui="quote-answer-price"
          class="text-[10px] whitespace-nowrap text-primary max-[760px]:text-[11px]"
        >
          {{ option.price }}
        </span>
      </label>
    </div>
    <div
      v-if="selected?.explanation"
      :id="`${name}-selection`"
      data-ui="quote-selected-help"
      class="
        mt-[13px] flex gap-3 rounded-[0_var(--radius-control)_var(--radius-control)_0]
        border-l-[2px] [border-left-style:solid] border-l-primary bg-[#b5dcff08] px-5 py-4.5
        max-[760px]:gap-2.5 max-[760px]:p-4 [&_>_svg]:mt-[3px] [&_>_svg]:shrink-0
        [&_>_svg]:text-primary [&_p]:text-[14px] [&_p]:leading-[1.8] [&_p]:text-[#c1cbd7]
        max-[760px]:[&_p]:text-[13px] [&_strong]:[font-weight:550] [&_strong]:text-primary
      "
      aria-live="polite"
    >
      <AppIcon
        name="check"
        :size="18"
      />
      <p>
        <strong>{{ selected.label }}.</strong>
        {{ selected.explanation }}
      </p>
    </div>
    <slot />
  </fieldset>
</template>
