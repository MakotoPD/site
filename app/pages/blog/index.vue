<script setup lang="ts">
const { data: posts, error, refresh } = await useFetch('/api/posts', { default: () => [] })
const filter = ref('Wszystkie'),
  categories = computed(() => ['Wszystkie', ...new Set(posts.value.map((p) => p.category))])
const filtered = computed(() =>
  posts.value.filter((p) => filter.value === 'Wszystkie' || p.category === filter.value),
)
usePageSeo(
  'Blog',
  'Design, Nuxt i cyfrowe produkty. Zajrzyj do warsztatu Makoto i poznaj sposób tworzenia autorskich stron i aplikacji.',
)
const root = ref<HTMLElement | null>(null)
useMotion(root)
</script>
<template>
  <div
    ref="root"
    data-ui="shell"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)]
    "
  >
    <header
      data-ui="page-heading"
      class="
        pt-20.5 pb-15 max-[760px]:pt-12.5 max-[760px]:pb-10.5
        [&_>_p:not([data-ui~='section-label'])]:mt-[27px]
        [&_>_p:not([data-ui~='section-label'])]:text-[13px]
        [&_>_p:not([data-ui~='section-label'])]:text-[#95a2b3]
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:mt-5.5
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:text-[12px]
        [&_[data-ui~='section-label']]:mb-[25px] [&_[data-ui~='text-link']]:mb-[35px]
        [&_h1]:text-[clamp(50px,_6.7vw,_90px)] max-[760px]:[&_h1]:text-[clamp(45px,_8vw,_65px)]
      "
    >
      <SectionLabel
        text="Blog / Z mojego warsztatu"
        data-hero
      />
      <h1 data-hero>
        Myśli, które
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          warto rozwinąć.
        </span>
      </h1>
      <p data-hero>
        O designie, technologii i tym, co dzieje się pomiędzy.
        <br />
        Praktyka, pomysły i rzeczy, których uczę się po drodze.
      </p>
    </header>
    <div
      data-ui="filter-tabs"
      class="
        mb-10 flex gap-2.5 border-b [border-bottom-style:solid] border-b-line pb-7.5
        max-[760px]:mb-7.5 [&_button]:flex [&_button]:items-center [&_button]:gap-2
        [&_button]:rounded-full [&_button]:border [&_button]:border-solid [&_button]:border-line
        [&_button]:bg-transparent [&_button]:px-5 [&_button]:py-2.5 [&_button]:text-[11px]
        [&_button]:text-muted max-[760px]:[&_button]:px-[17px] max-[760px]:[&_button]:py-[9px]
        [&_button_span]:text-[9px] [&_button_span]:opacity-[0.6] [&_button.active]:border-primary
        [&_button.active]:bg-primary [&_button.active]:text-background
      "
      role="group"
      aria-label="Kategorie bloga"
    >
      <button
        v-for="category in categories"
        :key="category"
        :aria-pressed="filter === category"
        :class="{ active: filter === category }"
        @click="filter = category"
      >
        {{ category }}
      </button>
    </div>
    <div
      v-if="error"
      data-ui="form-error"
      class="
        rounded-control border border-solid border-[#b1555540] bg-[#e06c6c12] p-[13px]
        text-[11px] text-[#ffc0c0]
      "
      role="alert"
    >
      Nie udało się pobrać wpisów.
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
    <div
      v-if="!filtered.length && !error"
      data-ui="public-empty"
      class="px-0 py-[45px] [&_h2]:mt-5 [&_h2]:text-[30px] [&_p]:mt-[15px] [&_p]:text-muted"
    >
      <AppIcon
        name="file"
        :size="32"
      />
      <h2>Nowa historia już niedługo.</h2>
      <p>W tej kategorii nie ma jeszcze wpisów.</p>
    </div>
    <div
      data-ui="blog-grid public-blog-grid"
      class="
        grid grid-cols-[repeat(3,_1fr)] gap-x-7 gap-y-12.5 pb-25 max-[960px]:gap-4.5
        max-[760px]:grid-cols-1 max-[760px]:gap-[35px] max-[760px]:pb-[65px]
      "
    >
      <NuxtLink
        v-for="post in filtered"
        :key="post.id"
        :to="`/blog/${post.slug}`"
        data-ui="blog-card"
        class="
          [&_h3]:mt-3 [&_h3]:text-[19px] [&_h3]:leading-[1.5] max-[760px]:[&_h3]:text-[23px]
          [&_p]:mt-[13px] [&_p]:text-[11px] [&_p]:text-[#8591a1]
          pointer-hover:[&:hover_[data-ui~='blog-art']_img]:[transform:scale(1.035)]
        "
      >
        <div
          data-ui="blog-art"
          class="
            relative grid [aspect-ratio:1.55] place-items-center overflow-hidden rounded-card
            border border-solid border-[#ffffff0b] bg-[#162332] max-[760px]:[aspect-ratio:1.7]
            [&_>_span]:font-serif [&_>_span]:text-[68px] [&_>_span]:tracking-[-0.12em]
            [&_>_span]:text-primary max-[760px]:[&_>_span]:text-[80px] [&_>_svg]:absolute
            [&_>_svg]:right-4 [&_>_svg]:bottom-[15px] [&_>_svg]:w-4 [&_img]:h-full [&_img]:w-full
            [&_img]:object-cover [&_img]:[transition:transform_0.5s_var(--ease-out)]
            [&.blog-art-design]:bg-[#223131] [&.blog-art-proces]:bg-[#2c2d3a]
          "
          :class="`blog-art-${post.category.toLowerCase()}`"
        >
          <img
            v-if="post.cover"
            :src="post.cover"
            :alt="post.title"
            loading="lazy"
          />
          <span
            v-else
            aria-hidden="true"
          >
            {{ post.category === 'Design' ? 'Aa' : '{ / }' }}
          </span>
          <AppIcon name="arrow" />
        </div>
        <div
          data-ui="blog-meta"
          class="
            mt-[21px] flex justify-between gap-2 text-[8px] tracking-[0.03em] text-[#8b9aac]
            uppercase max-[760px]:text-[9px] [&_>_span]:text-primary
          "
        >
          <span>{{ post.category }}</span>
          <time :datetime="post.publishedAt || post.createdAt">
            {{ formatDate(post.publishedAt || post.createdAt) }}
          </time>
        </div>
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
      </NuxtLink>
    </div>
  </div>
</template>
