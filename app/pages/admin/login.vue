<script setup lang="ts">
definePageMeta({ layout: false })
const state = reactive({ email: '', password: '' })
const pending = ref(false),
  error = ref(''),
  showPassword = ref(false)
const challenge = ref(''),
  protection = useTemplateRef<{ reset: () => void }>('protection')
useHead({
  title: 'Logowanie — Makoto Studio',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
async function login() {
  if (pending.value || !challenge.value) return
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { ...state, challenge: challenge.value },
    })
    await navigateTo('/admin')
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
    data-ui="login-page"
    class="
      flex min-h-[100vh] flex-col items-center justify-center p-[35px]
      [background:radial-gradient(ellipse_at_50%_35%,_#172c452e,_transparent_60%),_#090e15]
      max-[760px]:p-[25px] [&_>_[data-ui~='text-link']]:mt-5.5
      [&_>_[data-ui~='text-link']]:text-[10px] [&_>_[data-ui~='text-link']]:text-[#7394ba]
    "
  >
    <NuxtLink
      to="/"
      data-ui="login-brand"
      class="mb-[35px] max-[760px]:[&_[data-ui~='brand-image']]:w-[165px]"
    >
      <BrandLogo />
    </NuxtLink>
    <div
      data-ui="login-panel"
      class="
        w-[min(430px,_100%)] rounded-feature border border-solid border-[#2e4665] bg-[#111c2b]
        p-10 max-[760px]:p-7.5 [&_>_[data-ui~='eyebrow']]:mb-3.5
        [&_>_[data-ui~='eyebrow']]:text-[8px] [&_>_p]:mt-3.5 [&_>_p]:text-[11px]
        [&_>_p]:text-[#7793b6] [&_[data-ui~='button']]:mt-[5px]
        [&_[data-ui~='button']]:justify-between [&_[data-ui~='button']]:text-[11px]
        [&_form]:mt-7.5 [&_form]:grid [&_form]:gap-5.5 [&_h1]:text-[31px]
        [&_h1]:tracking-[-0.035em] max-[760px]:[&_h1]:text-[29px] [&_label]:text-[10px]
      "
    >
      <span
        data-ui="login-icon"
        class="
          mb-6 inline-grid h-[55px] w-[55px] place-items-center rounded-card border border-solid
          border-[#426383] bg-[#20334d] text-primary
        "
      >
        <AppIcon
          name="lock"
          :size="25"
        />
      </span>
      <span
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
      >
        MAKOTO STUDIO / ADMIN
      </span>
      <h1>Dobrze Cię widzieć.</h1>
      <p>Zaloguj się do swojej przestrzeni.</p>
      <form @submit.prevent="login">
        <label>
          E-mail administratora
          <input
            v-model="state.email"
            type="email"
            name="email"
            autocomplete="username"
            placeholder="contact@makoto.com.pl"
            required
          />
        </label>
        <label>
          Hasło
          <div
            data-ui="password-input"
            class="
              relative [&_button]:absolute [&_button]:top-0 [&_button]:right-0 [&_button]:grid
              [&_button]:h-full [&_button]:w-10 [&_button]:place-items-center [&_button]:border-0
              [&_button]:border-none [&_button]:text-[#6b8cb2] [&_button]:[background:none]
              [&_input]:pr-10!
            "
          >
            <input
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              name="password"
              placeholder="Twoje hasło"
              required
              maxlength="256"
            />
            <button
              type="button"
              :aria-label="showPassword ? 'Ukryj hasło' : 'Pokaż hasło'"
              @click="showPassword = !showPassword"
            >
              <AppIcon
                name="eye"
                :size="17"
              />
            </button>
          </div>
        </label>
        <FormProtection
          ref="protection"
          v-model="challenge"
          action="admin-login"
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
          :disabled="pending || !challenge"
          type="submit"
        >
          {{ pending ? 'Logowanie…' : 'Wejdź do panelu' }}
          <AppIcon
            class="[&.spin]:animate-spin"
            :name="pending ? 'loading' : 'arrow'"
            :class="{ spin: pending }"
          />
        </button>
      </form>
      <div
        data-ui="login-help"
        class="mt-[27px] flex items-center justify-center gap-[7px] text-[8px] text-[#5e7fa7]"
      >
        <AppIcon
          name="lock"
          :size="13"
        />
        Dostęp tylko dla administratora.
      </div>
    </div>
    <NuxtLink
      to="/"
      data-ui="text-link"
      class="
        inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent px-0
        py-3 text-[12px] font-medium text-ink
        [&_svg]:[transition:transform_0.25s_var(--ease-out)]
        pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
      "
    >
      <AppIcon
        name="left"
        :size="16"
      />
      Wróć na stronę Makoto
    </NuxtLink>
  </div>
</template>
