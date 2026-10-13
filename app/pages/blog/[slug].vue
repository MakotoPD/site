<script setup lang="ts">
import { pageGraph } from '#shared/schema'
import { siteOrigin } from '#shared/seo'
const route = useRoute()
const { data: post, error } = await useFetch(`/api/posts/${route.params.slug}`)
if (error.value || !post.value)
  throw createError({ statusCode: 404, statusMessage: 'Nie znaleziono wpisu.' })
const { socialImage } = usePageSeo(
  () => post.value?.title || 'Blog',
  () => post.value?.excerpt || '',
)
const { settings } = await useSite(),
  site = siteOrigin(useRuntimeConfig().public.siteUrl)
useSeoMeta({
  ogType: 'article',
  articlePublishedTime: () => post.value?.publishedAt || post.value?.createdAt,
  articleModifiedTime: () => post.value?.updatedAt,
  articleAuthor: () => [site + '/o-mnie'],
})
useStructuredData('makoto-page', () => {
  const p = post.value!
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...pageGraph(site, `/blog/${p.slug}`, p.title, p.excerpt, [
        { name: 'Makoto', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: p.title, path: `/blog/${p.slug}` },
      ]),
      {
        '@type': 'BlogPosting',
        '@id': site + `/blog/${p.slug}#article`,
        headline: p.title,
        description: p.excerpt,
        articleSection: p.category,
        datePublished: p.publishedAt || p.createdAt,
        dateModified: p.updatedAt,
        author: {
          '@type': 'Person',
          '@id': site + '/#person',
          name: settings.value.name,
          url: site + '/o-mnie',
        },
        publisher: { '@id': site + '/#business' },
        mainEntityOfPage: { '@id': site + `/blog/${p.slug}#webpage` },
        image: p.cover ? new URL(p.cover, site).href : socialImage,
        inLanguage: 'pl-PL',
      },
    ],
  }
})
const reading = computed(() => post.value?.readingMinutes || 1)
</script>
<template>
  <article
    v-if="post"
    data-ui="shell"
    class="
      article-page mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)]
    "
  >
    <header
      data-ui="article-header"
      class="
        mx-auto max-w-[850px] pt-[65px] pb-[45px] max-[760px]:pt-10.5 max-[760px]:pb-7.5
        [&_>_p]:mt-7 [&_>_p]:text-[16px] [&_>_p]:text-[#9cabbf] max-[760px]:[&_>_p]:text-[13px]
        [&_[data-ui~='text-link']]:mb-[35px] [&_h1]:text-[clamp(43px,_5.5vw,_75px)]
        [&_h1]:leading-[1.12]
      "
    >
      <NuxtLink
        to="/blog"
        data-ui="text-link"
        class="
          inline-flex items-center justify-start gap-3.5 border-0 border-solid bg-transparent
          px-0 py-3 text-[12px] font-medium text-ink
          [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
      >
        <AppIcon
          name="left"
          :size="16"
        />
        Wszystkie wpisy
      </NuxtLink>
      <div
        data-ui="article-meta"
        class="mb-[25px] flex gap-5.5 text-[10px] text-[#89a0b8] max-[760px]:gap-4 max-[760px]:text-[9px]"
      >
        <span
          data-ui="blue"
          class="text-primary"
        >
          {{ post.category }}
        </span>
        <time :datetime="post.publishedAt || post.createdAt">
          {{ formatDate(post.publishedAt || post.createdAt) }}
        </time>
        <span>{{ reading }} min czytania</span>
      </div>
      <h1>{{ post.title }}</h1>
      <p>{{ post.excerpt }}</p>
      <div
        data-ui="article-author"
        class="
          mt-7 flex items-center gap-[11px] text-[11px] [&_img]:rounded-[50%] [&_small]:mt-1
          [&_small]:block [&_small]:text-[9px] [&_small]:text-[#7e92ab]
        "
      >
        <img
          src="/images/avatar.webp"
          alt=""
          width="36"
          height="36"
        />
        <span>
          {{ settings.name }}
          <small>Makoto / Designer & Developer</small>
        </span>
      </div>
      <p
        data-ui="article-updated"
        class="mt-[15px] text-[10px] text-[#839ebf]"
      >
        Aktualizacja:
        <time :datetime="post.updatedAt">{{ formatDate(post.updatedAt) }}</time>
      </p>
    </header>
    <img
      v-if="post.cover"
      :src="post.cover"
      :alt="post.title"
      data-ui="article-cover"
      class="max-h-[560px] w-full rounded-[7px] object-cover"
    />
    <div
      data-ui="prose rich-content article-body"
      class="prose rich-content mx-auto max-w-[760px] pt-12.5 pb-20 max-[760px]:pt-5 max-[760px]:pb-[45px]"
      v-html="post.html"
    />
    <div
      data-ui="article-end"
      class="
        mx-auto max-w-[760px] border-t [border-top-style:solid] border-t-line pt-[45px] pb-17.5
        [&_h2]:mt-5.5 [&_h2]:mb-7.5 [&_h2]:text-[43px] max-[760px]:[&_h2]:text-[38px]
      "
    >
      <span
        data-ui="eyebrow"
        class="flex items-center gap-[9px] text-[10px] font-medium tracking-[0.1em] text-muted uppercase"
      >
        Dobrze, że tu jesteś.
      </span>
      <h2>
        Porozmawiajmy
        <br />
        o
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Twoim projekcie.
        </span>
      </h2>
      <NuxtLink
        to="/kontakt"
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
      >
        Napisz do mnie
        <AppIcon name="arrow" />
      </NuxtLink>
    </div>
  </article>
</template>
