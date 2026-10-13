<template>
  <section
    data-ui="estimate-banner shell"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] overflow-hidden rounded-feature border
      border-solid border-[#42617e] bg-[#112133] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)] [&_[data-ui~='ascii-photo']]:[filter:saturate(0.55)]
      [&_[data-ui~='ascii-surface']::after]:[background:linear-gradient(90deg,_#061322ed_0%,_#071727d9_35%,_#091d3290_65%,_#10243b50_100%),_linear-gradient(0deg,_#06142195,_transparent_65%)]
      max-[760px]:[&_[data-ui~='ascii-surface']::after]:[background:linear-gradient(90deg,_#061322ec,_#071727a0),_linear-gradient(0deg,_#061421b0,_transparent_70%)]
    "
    aria-labelledby="estimate-heading"
    data-reveal
  >
    <AsciiSurface
      src="/images/editorial/water-1920.webp"
      srcset="/images/editorial/water-960.webp 960w, /images/editorial/water-1920.webp 1920w"
      sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1432px) calc(100vw - 112px), 1320px"
      :width="1920"
      :height="960"
      position="50% 50%"
    >
      <div
        data-ui="estimate-layout"
        class="
          grid min-h-[430px] grid-cols-[1.5fr_1fr] items-center gap-12.5 px-15.5 py-[57px]
          max-[1050px]:gap-7 max-[1050px]:p-11 max-[760px]:block max-[760px]:min-h-[480px]
          max-[760px]:px-[27px] max-[760px]:py-9
        "
      >
        <div
          data-ui="estimate-copy"
          class="
            [&_[data-ui~='button']]:mt-[27px] max-[400px]:[&_[data-ui~='button']]:px-[19px]
            max-[400px]:[&_[data-ui~='button']]:text-[11px] [&_[data-ui~='section-label']]:mb-6
            [&_[data-ui~='section-label']]:text-[9px]
            [&_[data-ui~='section-label']]:text-[#b9cfe5]
            max-[760px]:[&_[data-ui~='section-label']]:mb-[25px]
            max-[760px]:[&_[data-ui~='section-label']]:text-[8px]
            [&_h2]:text-[clamp(41px,_4.2vw,_59px)] max-[760px]:[&_h2]:text-[43px]
            max-[400px]:[&_h2]:text-[39px] [&_p]:mt-5.5 [&_p]:text-[13px] [&_p]:leading-[1.85]
            [&_p]:text-[#b6c8db] max-[760px]:[&_p]:text-[12px]
          "
        >
          <SectionLabel text="Od pomysłu do konkretów" />
          <h2 id="estimate-heading">
            Twój pomysł.
            <br />
            <span
              data-ui="serif blue"
              class="font-serif font-normal tracking-[-0.025em] text-primary italic"
            >
              Ile może kosztować?
            </span>
          </h2>
          <p>
            Sprawdź, jaki zakres ma sens dla Twojego projektu
            <br class="desktop-break" />
            i od jakiego budżetu możemy zacząć.
          </p>
          <NuxtLink
            to="/wycena"
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
            Sprawdź w kalkulatorze
            <AppIcon
              name="arrow"
              :size="19"
            />
          </NuxtLink>
          <span
            data-ui="estimate-reassurance"
            class="mt-3.5 block text-[10px] text-[#a7bbd0]"
          >
            Bez zobowiązań. W swoim tempie.
          </span>
        </div>
        <div
          data-ui="estimate-note"
          class="
            flex flex-col items-end justify-between self-stretch py-1 text-right
            max-[760px]:hidden [&_>_span:first-child]:text-[8px]
            [&_>_span:first-child]:tracking-[0.12em] [&_>_span:first-child]:text-[#c4d5e7]
            [&_>_span:last-child]:text-[8px] [&_>_span:last-child]:tracking-[0.12em]
            [&_>_span:last-child]:text-[#c4d5e7] [&_>_span:nth-child(2)]:text-[22px]
            [&_>_span:nth-child(2)]:leading-[1.35] [&_>_span:nth-child(2)]:tracking-[-0.02em]
            [&_>_span:nth-child(2)]:text-[#e0eaf3]
            max-[1050px]:[&_>_span:nth-child(2)]:text-[18px] [&_em]:font-serif
            [&_em]:text-[1.7em] [&_em]:font-normal [&_em]:text-primary
          "
          aria-hidden="true"
        >
          <span>01 / PIERWSZY KROK</span>
          <span>
            Wszystko zaczyna się
            <br />
            od
            <em>dobrego pytania.</em>
          </span>
          <span>MAKOTO / DESIGN & DEVELOPMENT</span>
        </div>
      </div>
    </AsciiSurface>
  </section>
</template>
