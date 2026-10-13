<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Blog — Makoto Studio' })
const { data, error, refresh } = await useFetch('/api/admin/posts', { default: () => [] })
const filter = ref('all'),
  search = ref('')
const filtered = computed(() =>
  data.value.filter(
    (p) =>
      (filter.value === 'all' || p.status === filter.value) &&
      p.title.toLowerCase().includes(search.value.toLowerCase()),
  ),
)
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
          Z Twojego warsztatu
        </p>
        <h1>
          Blog
          <span
            data-ui="blue"
            class="text-primary"
          >
            .
          </span>
        </h1>
        <p>Pomysły, szkice i opublikowane historie.</p>
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
        Dodaj wpis
      </NuxtLink>
    </div>
    <div
      data-ui="admin-filter"
      class="
        mb-[25px] flex items-center gap-[15px] max-[960px]:flex-wrap
        max-[960px]:[&_[data-ui~='search-field']]:basis-full [&_select]:mt-0 [&_select]:w-[175px]
        [&_select]:border-[#2d405a] [&_select]:text-[10px] max-[960px]:[&_select]:flex-1
      "
    >
      <div
        data-ui="search-field"
        class="
          relative flex-1 [&_>_svg]:absolute [&_>_svg]:top-3.5 [&_>_svg]:left-[13px]
          [&_>_svg]:text-[#6783a3] [&_input]:mt-0! [&_input]:border-[#2d405a]! [&_input]:pl-10!
          [&_input]:text-[11px]!
        "
      >
        <AppIcon
          name="search"
          :size="17"
        />
        <input
          v-model="search"
          aria-label="Szukaj wpisów"
          placeholder="Szukaj wpisu…"
        />
      </div>
      <select
        v-model="filter"
        aria-label="Status wpisu"
      >
        <option value="all">Wszystkie wpisy</option>
        <option value="published">Opublikowane</option>
        <option value="draft">Szkice</option>
      </select>
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
      Nie udało się pobrać wpisów.
      <button @click="refresh()">Ponów</button>
    </div>
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
          [&_[data-ui~='text-link']]:p-0 [&_[data-ui~='text-link']]:text-[9px] [&_h2]:text-[15px]
          [&_h2]:tracking-[-0.02em]
        "
      >
        <h2>{{ filtered.length }} {{ filtered.length === 1 ? 'wpis' : 'wpisów' }}</h2>
        <NuxtLink
          to="/blog"
          target="_blank"
          data-ui="text-link"
          class="
            inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
            px-0 py-3 text-[12px] font-medium text-ink
            [&_svg]:[transition:transform_0.25s_var(--ease-out)]
            pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
          "
        >
          Zobacz blog
          <AppIcon
            name="external"
            :size="14"
          />
        </NuxtLink>
      </div>
      <div
        v-if="!filtered.length"
        data-ui="admin-empty"
        class="
          flex min-h-[280px] flex-col items-center justify-center px-7 py-[55px] text-center
          max-[760px]:px-5.5 max-[760px]:py-10 [&_>_svg]:text-[#87a9d0]
          [&_[data-ui~='text-link']]:mt-[17px] [&_[data-ui~='text-link']]:text-[10px]
          [&_h3]:mt-[23px] [&_h3]:text-[18px] max-[760px]:[&_h3]:text-[16px] [&_p]:mt-[13px]
          [&_p]:max-w-[300px] [&_p]:text-[10px] [&_p]:text-[#7089a8]
        "
      >
        <AppIcon
          name="file"
          :size="32"
        />
        <h3>Przestrzeń na dobrą historię.</h3>
        <p>Dodaj pierwszy wpis albo zmień filtry.</p>
      </div>
      <NuxtLink
        v-for="post in filtered"
        :key="post.id"
        :to="`/admin/blog/${post.id}`"
        data-ui="admin-post-row"
        class="
          flex items-center gap-5 border-b [border-bottom-style:solid] border-b-[#24354c]
          px-[25px] py-5.5 last:border-b-0 last:[border-bottom-style:none] max-[760px]:flex-wrap
          max-[760px]:gap-3 max-[760px]:p-4.5 max-[760px]:[&_>_[data-ui~='badge']]:ml-20.5
          [&_>_div:nth-child(2)]:flex-1
          max-[760px]:[&_>_div:nth-child(2)]:min-w-[calc(100%_-_85px)]
          max-[760px]:[&_>_div:nth-child(2)]:flex-1 [&_>_svg]:text-[#789abf]
          max-[760px]:[&_>_svg]:ml-auto [&_h3]:text-[13px] max-[760px]:[&_h3]:text-[12px]
          [&_p]:mt-[7px] [&_p]:text-[8px] [&_p]:text-[#6c89ac]
        "
      >
        <div
          data-ui="admin-post-thumb"
          class="
            grid h-12.5 w-17.5 shrink-0 place-items-center overflow-hidden rounded-control
            bg-[#1c304a] text-[#9bc0ee] [&_img]:h-full [&_img]:w-full [&_img]:object-cover
          "
        >
          <img
            v-if="post.cover"
            :src="post.cover"
            alt=""
            width="70"
            height="50"
          />
          <AppIcon
            v-else
            name="file"
            :size="22"
          />
        </div>
        <div>
          <h3>{{ post.title }}</h3>
          <p>{{ post.category }} · Zmieniono {{ formatDate(post.updatedAt) }}</p>
        </div>
        <span
          data-ui="badge"
          class="
            rounded-full border border-solid border-[#3c4d63] bg-[#233045] px-[9px] py-[5px]
            text-[8px] whitespace-nowrap text-[#a1b9d4] [&.badge-draft]:border-[#3a4a5d]
            [&.badge-draft]:bg-[#1b2839] [&.badge-draft]:text-[#95aac2]
            [&.badge-won]:border-[#3c725c] [&.badge-won]:bg-[#193629]
            [&.badge-won]:text-[#b1e8d2]
          "
          :class="post.status === 'published' ? 'badge-won' : 'badge-draft'"
        >
          {{ post.status === 'published' ? 'Opublikowany' : 'Szkic' }}
        </span>
        <AppIcon
          name="edit"
          :size="16"
        />
      </NuxtLink>
    </section>
  </div>
</template>
