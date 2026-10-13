<script setup lang="ts">
import type { QuoteInput, QuoteBrief } from '#shared/types'
import { cityNames } from '#shared/seo'
const props = defineProps<{
  source?: 'contact' | 'calculator'
  configuration?: QuoteInput
  brief?: QuoteBrief
  city?: string
}>()
const emit = defineEmits<{ sent: [] }>()
const route = useRoute()
const state = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
  city: props.city || '',
  consent: false,
  website: '',
})
const pending = ref(false),
  success = ref(false),
  error = ref('')
const token = ref('')
const protection = useTemplateRef<{ reset: () => void }>('protection')
const { $trackLead } = useNuxtApp()
const toast = useToast()
async function submit() {
  if (pending.value || !token.value) return
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        ...state,
        token: token.value,
        originPage: route.path,
        source: props.source || 'contact',
        configuration: props.configuration,
        brief: props.brief,
      },
    })
    $trackLead?.(props.source || 'contact')
    success.value = true
    toast.show('Dziękuję! Twoje zgłoszenie zostało zapisane.')
    emit('sent')
  } catch (e) {
    error.value = errorMessage(e)
  } finally {
    pending.value = false
    protection.value?.reset()
  }
}
</script>
<template>
  <div
    v-if="success"
    data-ui="form-success"
    class="
      py-7.5 max-[760px]:[&_>_[data-ui~='button']]:text-[10px]
      max-[760px]:[&_>_[data-ui~='button']]:whitespace-normal [&_h3]:mt-[25px] [&_h3]:text-[30px]
      [&_p]:mt-5 [&_p]:mb-7.5 [&_p]:text-[13px] [&_p]:text-muted
    "
    role="status"
  >
    <span
      data-ui="success-icon"
      class="
        inline-grid h-15 w-15 place-items-center rounded-[50%] border border-solid
        border-[#42617e] bg-[#172535] text-primary
      "
    >
      <AppIcon
        name="check"
        :size="32"
      />
    </span>
    <h3>Mamy dobry początek.</h3>
    <p>
      Twoja wiadomość dotarła do Makoto. Wrócę do Ciebie na podany adres e-mail, żeby porozmawiać o
      szczegółach.
    </p>
    <NuxtLink
      to="/realizacje"
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
    >
      W międzyczasie zobacz projekty
      <AppIcon name="arrow" />
    </NuxtLink>
  </div>
  <form
    v-else
    data-ui="contact-form"
    class="grid gap-5.5 [&_>_[data-ui~='button']]:justify-self-start"
    @submit.prevent="submit"
  >
    <div
      data-ui="form-row"
      class="grid grid-cols-2 gap-5 max-[960px]:gap-[15px] max-[400px]:grid-cols-1"
    >
      <label>
        Jak masz na imię?
        <span>*</span>
        <input
          v-model="state.name"
          name="name"
          autocomplete="name"
          placeholder="Imię i nazwisko"
          required
          minlength="2"
          maxlength="100"
        />
      </label>
      <label>
        Twój e-mail
        <span>*</span>
        <input
          v-model="state.email"
          name="email"
          type="email"
          autocomplete="email"
          placeholder="hej@twojafirma.pl"
          required
          maxlength="200"
        />
      </label>
    </div>
    <div
      data-ui="form-row"
      class="grid grid-cols-2 gap-5 max-[960px]:gap-[15px] max-[400px]:grid-cols-1"
    >
      <label>
        Firma
        <span
          data-ui="optional"
          class="ml-1.5 text-[9px] font-normal text-[#65788e]"
        >
          opcjonalnie
        </span>
        <input
          v-model="state.company"
          name="company"
          autocomplete="organization"
          placeholder="Nazwa Twojej firmy"
          maxlength="120"
        />
      </label>
      <label>
        Telefon
        <span
          data-ui="optional"
          class="ml-1.5 text-[9px] font-normal text-[#65788e]"
        >
          opcjonalnie
        </span>
        <input
          v-model="state.phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          placeholder="+48"
          maxlength="40"
        />
      </label>
    </div>
    <label>
      Skąd jest Twoja firma?
      <span
        data-ui="optional"
        class="ml-1.5 text-[9px] font-normal text-[#65788e]"
      >
        opcjonalnie
      </span>
      <select
        v-model="state.city"
        name="city"
        aria-label="Miejscowość firmy"
      >
        <option value="">Wybierz miejscowość</option>
        <option
          v-for="city in cityNames"
          :key="city"
          :value="city"
        >
          {{ city }}
        </option>
        <option>Inna miejscowość w Kujawsko-Pomorskiem</option>
        <option>Poza województwem kujawsko-pomorskim</option>
      </select>
    </label>
    <label>
      Opowiedz mi o swoim pomyśle
      <span>*</span>
      <textarea
        v-model="state.message"
        name="message"
        rows="5"
        required
        minlength="10"
        maxlength="5000"
        placeholder="Co chcesz stworzyć? Jaki masz cel? Masz już termin lub inspiracje?"
      />
    </label>
    <div
      data-ui="honeypot"
      class="absolute left-[-9999px] h-[1px] w-[1px] overflow-hidden"
      aria-hidden="true"
    >
      <label>
        Twoja strona
        <input
          v-model="state.website"
          tabindex="-1"
          autocomplete="off"
          name="website"
        />
      </label>
    </div>
    <label
      data-ui="checkbox-label"
      class="
        flex items-start gap-[11px] text-[10px] leading-[1.8] font-normal
        [&_>_span]:text-[#8190a2]! [&_a]:text-primary [&_a]:underline
        [&_a]:[text-underline-offset:3px]
      "
    >
      <input
        v-model="state.consent"
        type="checkbox"
        required
      />
      <span>
        Zapoznałem/am się z
        <NuxtLink
          to="/prywatnosc"
          target="_blank"
        >
          polityką prywatności
        </NuxtLink>
        — dane z formularza posłużą wyłącznie do odpowiedzi na zgłoszenie i przygotowania oferty.
        <span>*</span>
      </span>
    </label>
    <FormProtection
      ref="protection"
      v-model="token"
      :action="source === 'calculator' ? 'quote-form' : 'contact-form'"
    />
    <p
      v-if="error"
      data-ui="form-error"
      class="
        rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
        text-[11px] text-[#ffc0c0]
      "
      role="alert"
    >
      {{ error }}
    </p>
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
      type="submit"
      :disabled="pending || !token"
    >
      <AppIcon
        v-if="pending"
        name="loading"
        data-ui="spin"
        class="animate-spin"
      />
      {{
        pending
          ? 'Wysyłam…'
          : source === 'calculator'
            ? 'Wyślij projekt do wyceny'
            : 'Wyślij wiadomość'
      }}
      <AppIcon
        v-if="!pending"
        name="arrow"
      />
    </button>
    <p
      data-ui="form-note"
      class="mt-[-8px] text-[9px] text-[#748297]"
    >
      Bez zobowiązań. Wszystko zaczyna się od rozmowy.
    </p>
  </form>
</template>
