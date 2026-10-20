<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
useMotion(root)
const { data: projects } = await useFetch('/api/projects', { default: () => [] })
const filter = ref('Wszystkie')
const filtered = computed(() =>
  projects.value.filter(
    (p) =>
      filter.value === 'Wszystkie' ||
      (filter.value === 'Strony'
        ? p.category.startsWith('Strona')
        : !p.category.startsWith('Strona')),
  ),
)
usePageSeo(
  'Realizacje: strony internetowe i aplikacje',
  'Zobacz wybrane strony internetowe i aplikacje Makoto. Każdy projekt to autorski design i przemyślany kod.',
)
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
        text="Portfolio / Selected work"
        data-hero="0"
      />
      <h1 data-hero="1">
        Każdy projekt.
        <br />
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          Inna historia.
        </span>
      </h1>
      <p data-hero="2">
        Od stron dla małych marek po własne produkty.
        <br />
        Różne wyzwania. Ta sama dbałość o szczegóły.
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
      aria-label="Filtruj realizacje"
    >
      <button
        v-for="item in ['Wszystkie', 'Strony', 'Aplikacje']"
        :key="item"
        :class="{ active: filter === item }"
        :aria-pressed="filter === item"
        @click="filter = item"
      >
        {{ item }}
        <span v-if="item === 'Wszystkie'">{{ projects.length }}</span>
      </button>
    </div>
    <div
      data-ui="projects-grid portfolio-grid"
      class="
        grid grid-cols-2 gap-x-8.5 gap-y-[55px] pb-27.5 max-[760px]:grid-cols-1
        max-[760px]:gap-[35px] max-[760px]:pb-[65px]
      "
    >
      <ProjectCard
        v-for="(project, i) in filtered"
        :key="project.slug"
        :project="project"
        :index="i"
      />
    </div>
  </div>
</template>
