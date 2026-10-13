<script setup lang="ts">
import { leadStatuses } from '#shared/defaults'
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Przegląd — Makoto Studio' })
const { data, error, refresh } = await useFetch('/api/admin/dashboard')
</script>
<template>
  <div>
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
          Wszystko w jednym miejscu
        </p>
        <h1>
          Hej, Makoto
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>Sprawdź, co dzieje się w Twoim studio.</p>
      </div>
      <NuxtLink
        to="/admin/blog/nowy"
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
      >
        <AppIcon
          name="plus"
          :size="16"
        />
        Nowy wpis
      </NuxtLink>
    </div>
    <div
      v-if="error"
      data-ui="admin-error"
      class="
        rounded-[5px] border border-solid border-[#6c424e] bg-[#362128] p-5.5 text-[12px]
        text-[#f7c6d1] [&_button]:ml-[15px] [&_button]:border-0 [&_button]:border-none
        [&_button]:bg-transparent [&_button]:text-[inherit] [&_button]:underline
      "
      role="alert"
    >
      Nie udało się pobrać danych.
      <button
        data-ui="text-link"
        class="
          inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
          px-0 py-3 text-[12px] font-medium text-ink
          [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @click="refresh()"
      >
        Spróbuj ponownie
      </button>
    </div>
    <template v-if="data">
      <div
        data-ui="admin-stats"
        class="
          mb-7.5 grid grid-cols-[repeat(4,_1fr)] gap-4.5 max-[1200px]:gap-3
          max-[960px]:grid-cols-2 [&_article]:rounded-card [&_article]:border
          [&_article]:border-solid [&_article]:border-[#28384c] [&_article]:bg-[#111c2a]
          [&_article]:p-[23px] max-[1200px]:[&_article]:p-4.5 max-[760px]:[&_article]:p-[19px]
          [&_article_>_span]:flex [&_article_>_span]:items-center
          [&_article_>_span]:justify-between [&_article_>_span]:gap-2
          [&_article_>_span]:text-[9px] [&_article_>_span]:text-[#8aa4c4]
          max-[760px]:[&_article_>_span]:text-[8px] [&_article_>_span_>_svg]:w-4
          [&_article_>_span_>_svg]:text-[#789dc6] [&_small]:text-[8px] [&_small]:text-[#597597]
          max-[760px]:[&_small]:text-[7px] [&_strong]:mt-4.5 [&_strong]:mb-2.5 [&_strong]:block
          [&_strong]:text-[43px] [&_strong]:leading-none [&_strong]:[font-weight:450]
          [&_strong]:tracking-[-0.06em] [&_strong]:text-[#d0e6ff]
          max-[760px]:[&_strong]:text-[39px] [&_strong[data-ui~='stat-money']]:mt-[25px]
          [&_strong[data-ui~='stat-money']]:mb-[13px]
          [&_strong[data-ui~='stat-money']]:text-[33px]
          [&_strong[data-ui~='stat-money']]:whitespace-nowrap
          max-[1200px]:[&_strong[data-ui~='stat-money']]:mt-7.5
          max-[1200px]:[&_strong[data-ui~='stat-money']]:mb-[15px]
          max-[1200px]:[&_strong[data-ui~='stat-money']]:text-[26px]
          max-[960px]:[&_strong[data-ui~='stat-money']]:mt-5
          max-[960px]:[&_strong[data-ui~='stat-money']]:mb-3
          max-[960px]:[&_strong[data-ui~='stat-money']]:text-[36px]
          max-[760px]:[&_strong[data-ui~='stat-money']]:mt-[25px]
          max-[760px]:[&_strong[data-ui~='stat-money']]:mb-[15px]
          max-[760px]:[&_strong[data-ui~='stat-money']]:text-[29px]
        "
      >
        <article>
          <span>
            Zgłoszenia
            <AppIcon
              name="inbox"
              :size="18"
            />
          </span>
          <strong>{{ data.total }}</strong>
          <small>{{ data.fresh }} oczekuje na odpowiedź</small>
        </article>
        <article>
          <span>
            Z kalkulatora
            <AppIcon
              name="options"
              :size="18"
            />
          </span>
          <strong>{{ data.quotes }}</strong>
          <small>Projekty z gotową konfiguracją</small>
        </article>
        <article>
          <span>
            Wartość otwartych wycen
            <AppIcon
              name="layers"
              :size="18"
            />
          </span>
          <strong data-ui="stat-money">{{ formatMoney(data.pipeline) }}</strong>
          <small>Orientacyjnie, netto</small>
        </article>
        <article>
          <span>
            Opublikowane wpisy
            <AppIcon
              name="file"
              :size="18"
            />
          </span>
          <strong>{{ data.published }}</strong>
          <small>Historie z Twojego warsztatu</small>
        </article>
      </div>
      <div
        data-ui="admin-grid"
        class="
          grid grid-cols-[1.6fr_1fr] gap-6.5 max-[1200px]:grid-cols-[1.35fr_1fr]
          max-[1200px]:gap-5 max-[960px]:grid-cols-1
        "
      >
        <section
          data-ui="admin-panel"
          class="overflow-hidden rounded-card border border-solid border-[#263447] bg-[#101823]"
        >
          <div
            data-ui="admin-panel-heading"
            class="
              flex items-center justify-between gap-5 border-b [border-bottom-style:solid]
              border-b-[#253448] px-[25px] py-[21px] max-[760px]:p-5
              [&_[data-ui~='muted']]:text-[8px] [&_[data-ui~='muted']]:text-[#6d84a2]
              [&_[data-ui~='text-link']]:p-0 [&_[data-ui~='text-link']]:text-[9px]
              [&_h2]:text-[15px] [&_h2]:tracking-[-0.02em]
            "
          >
            <h2>Ostatnie zgłoszenia</h2>
            <NuxtLink
              to="/admin/zgloszenia"
              data-ui="text-link"
              class="
                inline-flex items-center justify-start gap-3.5 border-0 border-solid
                bg-transparent px-0 py-3 text-[12px] font-medium text-ink
                [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
              "
            >
              Wszystkie
              <AppIcon
                name="arrow"
                :size="16"
              />
            </NuxtLink>
          </div>
          <div
            v-if="!data.recent.length"
            data-ui="admin-empty"
            class="
              flex min-h-[280px] flex-col items-center justify-center px-7 py-[55px] text-center
              max-[760px]:px-5.5 max-[760px]:py-10 [&_>_svg]:text-[#87a9d0]
              [&_[data-ui~='text-link']]:mt-[17px] [&_[data-ui~='text-link']]:text-[10px]
              [&_h3]:mt-[23px] [&_h3]:text-[18px] max-[760px]:[&_h3]:text-[16px] [&_p]:mt-[13px]
              [&_p]:max-w-[300px] [&_p]:text-[10px] [&_p]:text-[#7089a8]
            "
          >
            <span
              data-ui="empty-icon"
              class="
                grid h-[65px] w-[65px] place-items-center rounded-[50%] border border-solid
                border-[#354f6e] bg-[#1b2c41] text-[#89b2df]
              "
            >
              <AppIcon
                name="inbox"
                :size="27"
              />
            </span>
            <h3>Tu zaczynają się nowe projekty.</h3>
            <p>Zgłoszenia z formularza i kalkulatora pojawią się tutaj automatycznie.</p>
            <NuxtLink
              to="/kontakt"
              target="_blank"
              data-ui="text-link"
              class="
                inline-flex items-center justify-start gap-3.5 border-0 border-solid
                bg-transparent px-0 py-3 text-[12px] font-medium text-ink
                [&_svg]:[transition:transform_0.25s_var(--ease-out)]
                pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
              "
            >
              Zobacz formularz
              <AppIcon
                name="arrow"
                :size="16"
              />
            </NuxtLink>
          </div>
          <NuxtLink
            v-for="lead in data.recent"
            :key="lead.id"
            :to="`/admin/zgloszenia?lead=${lead.id}`"
            data-ui="recent-lead"
            class="
              flex items-center gap-3 border-b [border-bottom-style:solid] border-b-[#253448]
              px-[23px] py-5 last:border-b-0 last:[border-bottom-style:none] max-[1200px]:gap-2.5
              max-[1200px]:p-4.5 max-[760px]:p-[17px] [&_>_div]:min-w-0
              max-[760px]:[&_>_div]:flex-1 [&_>_svg]:text-[#65809f] [&_small]:mt-1
              [&_small]:block [&_small]:overflow-hidden [&_small]:text-[8px]
              [&_small]:text-ellipsis [&_small]:text-[#748eac] [&_strong]:block
              [&_strong]:text-[10px] [&_strong]:font-medium
            "
          >
            <span
              data-ui="lead-avatar"
              class="
                grid h-9 w-9 shrink-0 place-items-center rounded-[50%] border border-solid
                border-[#314b6a] bg-[#1d3048] text-[15px] font-medium text-primary
              "
            >
              {{ lead.name.charAt(0).toUpperCase() }}
            </span>
            <div>
              <strong>{{ lead.name }}</strong>
              <small>{{ lead.company || lead.email }}</small>
            </div>
            <span
              data-ui="lead-source"
              class="ml-auto text-[8px] text-[#738faf] max-[1200px]:hidden"
            >
              {{ lead.source === 'calculator' ? 'Kalkulator' : 'Formularz' }}
            </span>
            <span
              data-ui="badge"
              class="
                rounded-full border border-solid border-[#3c4d63] bg-[#233045] px-[9px] py-[5px]
                text-[8px] whitespace-nowrap text-[#a1b9d4] [&.badge-closed]:border-[#3a4a5d]
                [&.badge-closed]:bg-[#1b2839] [&.badge-closed]:text-[#95aac2]
                [&.badge-contacted]:border-[#5e527e] [&.badge-contacted]:bg-[#2a2440]
                [&.badge-contacted]:text-[#d2c6f2] [&.badge-draft]:border-[#3a4a5d]
                [&.badge-draft]:bg-[#1b2839] [&.badge-draft]:text-[#95aac2]
                [&.badge-new]:border-[#436991] [&.badge-new]:bg-[#203c59]
                [&.badge-new]:text-primary [&.badge-proposal]:border-[#766440]
                [&.badge-proposal]:bg-[#302b1e] [&.badge-proposal]:text-[#f3d4a0]
                [&.badge-won]:border-[#3c725c] [&.badge-won]:bg-[#193629]
                [&.badge-won]:text-[#b1e8d2]
              "
              :class="`badge-${lead.status}`"
            >
              {{ leadStatuses[lead.status] }}
            </span>
            <AppIcon
              name="chevron"
              :size="16"
            />
          </NuxtLink>
        </section>
        <section
          data-ui="admin-panel quick-panel"
          class="
            overflow-hidden rounded-card border border-solid border-[#263447] bg-[#152335] p-7.5
            max-[960px]:hidden [&_>_a]:flex [&_>_a]:items-center [&_>_a]:gap-[13px]
            [&_>_a]:border-t [&_>_a]:[border-top-style:solid] [&_>_a]:border-t-[#2d4059]
            [&_>_a]:py-4.5 [&_>_a]:text-[10px] [&_>_a]:text-[#b0cbea]
            [&_>_a_>_svg:last-child]:ml-auto [&_>_p:not([data-ui~='eyebrow'])]:my-5
            [&_>_p:not([data-ui~='eyebrow'])]:text-[10px]
            [&_>_p:not([data-ui~='eyebrow'])]:text-[#7793b4] [&_[data-ui~='eyebrow']]:mb-[21px]
            [&_[data-ui~='eyebrow']]:text-[7px] [&_[data-ui~='eyebrow']]:text-[#88a7cc]
            [&_h2]:text-[32px] [&_h2]:leading-[1.1]
          "
        >
          <p
            data-ui="eyebrow"
            class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
          >
            Małe kroki, dobre efekty
          </p>
          <h2>
            Twoje studio.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              W dobrym rytmie.
            </span>
          </h2>
          <p>Opublikuj nowy wpis, dopracuj ofertę lub sprawdź najnowsze zapytania.</p>
          <NuxtLink to="/admin/blog/nowy">
            <AppIcon
              name="edit"
              :size="19"
            />
            Napisz coś dobrego
            <AppIcon
              name="arrow"
              :size="17"
            />
          </NuxtLink>
          <NuxtLink to="/admin/ustawienia">
            <AppIcon
              name="options"
              :size="19"
            />
            Dostosuj kalkulator
            <AppIcon
              name="arrow"
              :size="17"
            />
          </NuxtLink>
          <NuxtLink
            to="/"
            target="_blank"
          >
            <AppIcon
              name="globe"
              :size="19"
            />
            Zobacz swoją stronę
            <AppIcon
              name="arrow"
              :size="17"
            />
          </NuxtLink>
        </section>
      </div>
    </template>
  </div>
</template>
