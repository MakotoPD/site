<script setup lang="ts">
import { defaultSettings } from '#shared/defaults'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Ustawienia — Makoto Studio' })
const { settings, refresh } = await useSite(),
  state = reactive(structuredClone(toRaw(settings.value)))
const pending = ref(false),
  toast = useToast()
const groups = [
  { key: 'projects' as const, title: 'Typy projektów', note: 'Kwota bazowa projektu, netto.' },
  {
    key: 'designs' as const,
    title: 'Warianty wyglądu',
    note: 'Jednorazowa dopłata za wybrany sposób projektowania. Stawki startowe do dostosowania.',
  },
  {
    key: 'productImports' as const,
    title: 'Wprowadzanie produktów',
    note: 'Dopłaty dotyczą wprowadzenia katalogu przez Makoto, nie liczby produktów dodawanych samodzielnie. Stawki startowe.',
  },
  {
    key: 'extras' as const,
    title: 'Funkcje i dodatki',
    note: 'Jednorazowe dodatki do projektu, netto.',
  },
  {
    key: 'monthly' as const,
    title: 'Usługi miesięczne',
    note: 'Koszt miesięcznego abonamentu, netto.',
  },
]
async function save() {
  pending.value = true
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: state })
    await refresh()
    toast.show('Ustawienia i cennik zapisane.')
  } catch (e) {
    toast.show(errorMessage(e), true)
  } finally {
    pending.value = false
  }
}
</script>
<template>
  <form @submit.prevent="save">
    <div
      data-ui="admin-page-heading"
      class="
        mb-[35px] flex items-center justify-between gap-5 max-[760px]:mb-[27px]
        max-[760px]:flex-wrap max-[760px]:items-start max-[760px]:gap-5.5
        max-[760px]:[&_>_[data-ui~='button']]:min-h-10 [&_[data-ui~='eyebrow']]:mb-4
        [&_[data-ui~='eyebrow']]:text-[8px] max-[760px]:[&_[data-ui~='eyebrow']]:mb-3.5
        [&_h1]:text-[40px] [&_h1]:font-medium [&_h1]:tracking-[-0.04em]
        max-[960px]:[&_h1]:text-[33px] max-[760px]:[&_h1]:text-[33px]
        [&_p:not([data-ui~='eyebrow'])]:mt-3 [&_p:not([data-ui~='eyebrow'])]:text-[10px]
        [&_p:not([data-ui~='eyebrow'])]:text-[#7e94b0]
        max-[760px]:[&_p:not([data-ui~='eyebrow'])]:text-[10px]
      "
    >
      <div>
        <p
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          Twoja marka, Twoje zasady
        </p>
        <h1>
          Ustawienia
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>Kontakt, dostępność i ceny w kalkulatorze.</p>
      </div>
      <button
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
        type="submit"
        :disabled="pending"
      >
        <AppIcon
          class="[&.spin]:animate-spin"
          :name="pending ? 'loading' : 'save'"
          :size="16"
          :class="{ spin: pending }"
        />
        Zapisz ustawienia
      </button>
    </div>
    <section
      data-ui="admin-panel settings-panel"
      class="
        mb-6 overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823] p-7
        max-[760px]:p-[23px] [&_h2]:text-[18px] [&_h2]:tracking-[-0.02em]
      "
    >
      <h2>Informacje o studio</h2>
      <div
        data-ui="settings-fields"
        class="mt-[25px] grid grid-cols-2 gap-6 max-[960px]:gap-5 max-[760px]:grid-cols-1 [&_label]:text-[10px]"
      >
        <label>
          Imię i nazwisko
          <input
            v-model="state.name"
            required
            minlength="2"
            maxlength="100"
          />
        </label>
        <label>
          E-mail do kontaktu
          <input
            v-model="state.email"
            type="email"
            required
            maxlength="200"
          />
        </label>
        <label>
          Telefon publiczny
          <input
            v-model="state.phone"
            type="tel"
            maxlength="30"
          />
        </label>
        <label>
          Profil Firmy w Google
          <input
            v-model="state.googleMapsUrl"
            type="url"
            maxlength="700"
            placeholder="https://www.google.com/maps/…"
          />
        </label>
        <label>
          Ulica i numer
          <input
            v-model="state.streetAddress"
            maxlength="150"
          />
        </label>
        <label>
          Kod pocztowy
          <input
            v-model="state.postalCode"
            pattern="[0-9]{2}-[0-9]{3}"
            placeholder="88-100"
          />
        </label>
        <label>
          Miejscowość adresu
          <input
            v-model="state.addressLocality"
            maxlength="100"
          />
        </label>
        <label>
          Hasło marki
          <input
            v-model="state.tagline"
            required
            minlength="2"
            maxlength="120"
          />
        </label>
        <label>
          Komunikat dostępności
          <input
            v-model="state.availability"
            required
            minlength="2"
            maxlength="100"
          />
        </label>
      </div>
      <p
        data-ui="admin-hint"
        class="mt-5.5 text-[9px] text-[#6684a9] [&_code]:text-[9px] [&_code]:text-[#a5c8f1]"
      >
        Zmiana e-maila kontaktowego nie zmienia konta administratora.
      </p>
    </section>
    <section
      v-for="group in groups"
      :key="group.key"
      data-ui="admin-panel settings-panel"
      class="
        mb-6 overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823] p-7
        max-[760px]:p-[23px] [&_h2]:text-[18px] [&_h2]:tracking-[-0.02em]
      "
    >
      <div
        data-ui="settings-section-heading"
        class="
          mb-3 flex items-center justify-between gap-5 max-[760px]:gap-[15px]
          [&_[data-ui~='eyebrow']]:text-[7px] max-[760px]:[&_[data-ui~='eyebrow']]:text-[6px]
          max-[760px]:[&_h2]:text-[16px] [&_p]:mt-[9px] [&_p]:text-[9px] [&_p]:text-[#738eaf]
        "
      >
        <div>
          <h2>{{ group.title }}</h2>
          <p>{{ group.note }}</p>
        </div>
        <span
          data-ui="eyebrow"
          class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
        >
          KALKULATOR
        </span>
      </div>
      <div
        v-for="option in state[group.key]"
        :key="option.id"
        data-ui="pricing-setting"
        class="
          grid grid-cols-[1fr_1.5fr_110px] gap-5 border-b [border-bottom-style:solid]
          border-b-[#243b56] py-4.5 last:border-b-0 last:[border-bottom-style:none] last:pb-0
          max-[960px]:grid-cols-[1fr_100px] max-[960px]:gap-[15px]
          max-[760px]:grid-cols-[1fr_95px] max-[760px]:gap-[15px]
          max-[960px]:[&_>_label:nth-child(2)]:[grid-column:1/-1]
          max-[960px]:[&_>_label:nth-child(2)]:[grid-row:2] [&_input]:text-[11px]!
          [&_label]:text-[9px]
        "
      >
        <label>
          Nazwa
          <input
            v-model="option.label"
            required
            minlength="2"
            maxlength="100"
          />
        </label>
        <label>
          Opis
          <input
            v-model="option.description"
            maxlength="200"
          />
        </label>
        <label>
          Cena w PLN
          <input
            v-model.number="option.price"
            type="number"
            min="0"
            max="1000000"
            step="1"
            required
          />
        </label>
      </div>
    </section>
    <div
      data-ui="admin-panel settings-panel"
      class="
        mb-6 overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823] p-7
        max-[760px]:p-[23px] [&_h2]:text-[18px] [&_h2]:tracking-[-0.02em]
      "
    >
      <h2>Zasady wyceny</h2>
      <p
        data-ui="admin-hint"
        class="mt-5.5 text-[9px] text-[#6684a9] [&_code]:text-[9px] [&_code]:text-[#a5c8f1]"
      >
        5 podstron w cenie. Każda kolejna: 250 zł. Dodatkowy język: 800 zł. Tryb priorytetowy: +25%.
        Kwoty netto. Kalkulator pokazuje orientacyjną cenę, która wymaga potwierdzenia po rozmowie.
      </p>
      <p
        data-ui="admin-hint"
        class="mt-5.5 text-[9px] text-[#6684a9] [&_code]:text-[9px] [&_code]:text-[#a5c8f1]"
      >
        Dane logowania zmienisz poleceniem
        <code>npm run admin:setup</code>
        . Wpisy, zgłoszenia i ustawienia są zapisywane w PostgreSQL, a przesłane pliki w Cloudflare
        R2.
      </p>
    </div>
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
      :disabled="pending"
    >
      Zapisz wszystkie zmiany
      <AppIcon
        name="save"
        :size="17"
      />
    </button>
  </form>
</template>
