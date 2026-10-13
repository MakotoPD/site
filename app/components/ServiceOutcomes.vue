<script setup lang="ts">
import type { ServicePage } from '#shared/services'

const props = defineProps<{ service: ServicePage }>()
type Preview = 'contact' | 'checkout' | 'roles' | 'identity' | 'data' | 'backups'
type Photo = 'architecture' | 'systems' | 'form' | 'water'
interface Direction {
  photo: Photo
  preview: Preview
  label: string
  detail: string
  steps: string[]
}
const directions: Record<string, Direction> = {
  'strony-internetowe': {
    photo: 'architecture',
    preview: 'contact',
    label: 'Wizerunek',
    detail: 'Kontakt bez przeszkód',
    steps: ['Treści', 'Realizacje', 'Nowe funkcje'],
  },
  'sklepy-internetowe': {
    photo: 'form',
    preview: 'checkout',
    label: 'Oferta',
    detail: 'Od wyboru do zakupu',
    steps: ['Płatności', 'Dostawa', 'Zamówienia'],
  },
  'aplikacje-webowe': {
    photo: 'systems',
    preview: 'roles',
    label: 'Cel',
    detail: 'Właściwe uprawnienia',
    steps: ['Pierwsza wersja', 'Informacja zwrotna', 'Rozbudowa'],
  },
  'projektowanie-ui-ux': {
    photo: 'form',
    preview: 'identity',
    label: 'Tożsamość',
    detail: 'Forma ma swoje zasady',
    steps: ['Wybór', 'Działanie', 'Potwierdzenie'],
  },
  'seo-techniczne': {
    photo: 'architecture',
    preview: 'data',
    label: 'Treść',
    detail: 'Jedno źródło informacji',
    steps: ['Sprawdzenie', 'Zmiany', 'Pomiar efektów'],
  },
  'opieka-techniczna': {
    photo: 'water',
    preview: 'backups',
    label: 'Współpraca',
    detail: 'Plan odtwarzania danych',
    steps: ['Kopia danych', 'Sprawdzenie', 'Wdrożenie'],
  },
}
const photographs = {
  architecture: {
    src: '/images/editorial/architecture-1280.webp',
    srcset:
      '/images/editorial/architecture-640.webp 640w, /images/editorial/architecture-1280.webp 1280w',
    width: 1280,
    height: 853,
    position: '50% 35%',
  },
  systems: {
    src: '/images/editorial/systems-1280.webp',
    srcset: '/images/editorial/systems-640.webp 640w, /images/editorial/systems-1280.webp 1280w',
    width: 1280,
    height: 1037,
    position: '50% 55%',
  },
  form: {
    src: '/images/editorial/form-1280.webp',
    srcset: '/images/editorial/form-640.webp 640w, /images/editorial/form-1280.webp 1280w',
    width: 1280,
    height: 853,
    position: '50% 50%',
  },
  water: {
    src: '/images/editorial/water-1920.webp',
    srcset: '/images/editorial/water-960.webp 960w, /images/editorial/water-1920.webp 1920w',
    width: 1920,
    height: 960,
    position: '50% 50%',
  },
}
const direction = computed(
  () => directions[props.service.slug] ?? directions['strony-internetowe']!,
)
const photograph = computed(() => photographs[direction.value.photo])
const outcomes = computed(() => props.service.outcomes)
function splitTitle(title: string) {
  const words = title.split(' ')
  return { main: words.slice(0, -1).join(' '), accent: words.at(-1) }
}
</script>

<template>
  <section
    data-ui="service-outcomes"
    class="mt-[35px] mb-19.5 max-[760px]:mt-3 max-[760px]:mb-11.5"
    aria-label="Efekty współpracy"
    :data-service="service.slug"
  >
    <div
      data-ui="outcomes-caption"
      class="
        mb-6 flex justify-between gap-5 text-[10px] text-[#a9c2db] max-[760px]:mb-5
        max-[760px]:gap-[15px] max-[760px]:text-[8px] [&_>_span:first-child]:tracking-[0.13em]
        [&_>_span:first-child]:uppercase [&_>_span:last-child]:flex
        [&_>_span:last-child]:items-center [&_>_span:last-child]:gap-4.5
        [&_>_span:last-child]:text-[#7f93aa] max-[760px]:[&_>_span:last-child]:max-w-[175px]
        max-[760px]:[&_>_span:last-child]:gap-2 max-[760px]:[&_>_span:last-child]:text-right
        max-[760px]:[&_>_span:last-child]:text-[8px] [&_svg]:text-primary
      "
    >
      <span>W praktyce</span>
      <span>
        Trzy rzeczy, które robią różnicę
        <AppIcon
          name="arrow"
          :size="15"
        />
      </span>
    </div>
    <div
      data-ui="outcomes-composition"
      class="
        grid grid-cols-[5fr_4fr_3.25fr] [align-items:start] gap-4.5
        max-[1050px]:grid-cols-[1.1fr_1fr] max-[1050px]:gap-4 max-[760px]:grid-cols-1
        max-[760px]:gap-4
      "
    >
      <article
        v-if="outcomes[0]"
        data-ui="outcome-panel outcome-photo"
        class="
          relative mt-6 h-[420px] min-w-0 overflow-hidden rounded-card border border-solid
          border-[#344559] bg-[#172335] max-[1050px]:mt-6 max-[1050px]:h-[420px] max-[760px]:m-0
          max-[760px]:h-[390px] [&_[data-ui~='ascii-content']]:flex
          [&_[data-ui~='ascii-content']]:flex-col [&_[data-ui~='ascii-content']]:justify-between
          [&_[data-ui~='ascii-content']]:px-8 [&_[data-ui~='ascii-content']]:py-7
          max-[760px]:[&_[data-ui~='ascii-content']]:p-[25px]
          [&_[data-ui~='ascii-photo']]:[filter:grayscale(0.8)_saturate(0.3)_brightness(0.8)]
          [&_[data-ui~='ascii-surface']::after]:[background:linear-gradient(180deg,_#06101d61,_#07142208_20%,_#0714229c_47%,_#050f1bf5_100%)]
          [&_p]:max-w-[345px] [&_p]:text-[#c4d6e7]
        "
        data-reveal
      >
        <AsciiSurface
          v-bind="photograph"
          sizes="(max-width: 760px) 100vw, (max-width: 1050px) 55vw, 42vw"
        >
          <div
            data-ui="outcome-meta"
            class="flex items-center justify-between gap-4 text-[9px] tracking-[0.08em] text-[#c3daed] uppercase"
          >
            <span>01 / {{ direction.label }}</span>
            <span
              data-ui="outcome-cross"
              class="text-[23px] leading-none font-light"
              aria-hidden="true"
            >
              +
            </span>
          </div>
          <div
            data-ui="outcome-copy"
            class="
              [&_h3]:leading-[1.05] [&_h3]:tracking-[-0.035em]
              [&_h3_[data-ui~='serif']]:text-[1.18em] [&_h3_[data-ui~='serif']]:text-primary
              [&_p]:mt-4.5 [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-[#b1c5d9]
              max-[760px]:[&_p]:text-[12px]
            "
          >
            <h3 class="text-[clamp(36px,3vw,46px)] max-[760px]:text-[clamp(31px,10vw,43px)]">
              {{ splitTitle(outcomes[0][0]).main }}
              <br />
              <span
                data-ui="serif"
                class="font-serif font-normal tracking-[-0.025em] italic"
              >
                {{ splitTitle(outcomes[0][0]).accent }}.
              </span>
            </h3>
            <p>{{ outcomes[0][1] }}</p>
          </div>
        </AsciiSurface>
      </article>

      <article
        v-if="outcomes[1]"
        data-ui="outcome-panel outcome-detail"
        class="
          relative min-h-[400px] min-w-0 overflow-hidden rounded-card border border-solid
          border-[#344559] p-[27px] [background:linear-gradient(145deg,_#1c334b,_#101d2b_75%)]
          max-[1050px]:min-h-[420px] max-[760px]:min-h-0 max-[760px]:p-[25px]
          pointer-motion:[&:hover_[data-ui~='backup-sheet-back']]:[transform:translate(-15px,_-29px)_rotate(-12deg)]
          pointer-motion:[&:hover_[data-ui~='backup-sheet-front']]:[transform:translate(15px,_18px)_rotate(1deg)]
          pointer-motion:[&:hover_[data-ui~='data-root']]:[transform:translateY(-4px)_rotate(0deg)]
          pointer-motion:[&:hover_[data-ui~='identity-glyph']]:[transform:rotate(0deg)]
          pointer-motion:[&:hover_[data-ui~='preview-floating']]:[transform:translateY(3px)_rotate(2deg)]
          pointer-motion:[&:hover_[data-ui~='preview-sheet']]:[transform:translateY(-5px)_rotate(-1deg)]
        "
        data-reveal
      >
        <div
          data-ui="outcome-meta"
          class="flex items-center justify-between gap-4 text-[9px] tracking-[0.08em] text-[#c3daed] uppercase"
        >
          <span>02 / Detal</span>
          <span
            data-ui="outcome-detail-caption"
            class="max-w-37.5 text-right text-[8px] tracking-[0] text-[#99b8d6] normal-case"
          >
            {{ direction.detail }}
          </span>
        </div>
        <div
          data-ui="outcome-preview"
          class="
            relative mt-[13px] mb-[21px] flex h-[206px] items-center justify-center
            max-[760px]:mt-3 max-[760px]:mb-[23px] max-[760px]:h-[200px] [&.preview-action]:mt-3
            [&.preview-action]:flex [&.preview-action]:items-center
            [&.preview-action]:justify-between [&.preview-action]:gap-3.5
            [&.preview-action]:rounded-[5px] [&.preview-action]:bg-primary
            [&.preview-action]:px-[11px] [&.preview-action]:py-[9px]
            [&.preview-action]:text-[8px] [&.preview-action]:text-[#12273b]
            [&.preview-annotation]:absolute [&.preview-annotation]:right-0
            [&.preview-annotation]:bottom-[-12px] [&.preview-annotation]:left-0
            [&.preview-annotation]:text-center [&.preview-annotation]:text-[7px]
            [&.preview-annotation]:tracking-[0.1em] [&.preview-annotation]:text-[#89a8c6]
            [&.preview-annotation]:uppercase [&.preview-avatar]:grid [&.preview-avatar]:h-6.5
            [&.preview-avatar]:w-6.5 [&.preview-avatar]:place-items-center
            [&.preview-avatar]:rounded-full [&.preview-avatar]:border
            [&.preview-avatar]:border-solid [&.preview-avatar]:border-[#42617c]
            [&.preview-avatar]:bg-[#203a51] [&.preview-avatar]:text-[8px]
            [&.preview-data]:flex-col [&.preview-field]:my-[9px]
            [&.preview-field_>_span]:mb-[5px] [&.preview-field_>_span]:block
            [&.preview-field_>_span]:text-[7px] [&.preview-field_>_span]:text-[#8eabc8]
            [&.preview-field_i]:block [&.preview-field_i]:h-[15px]
            [&.preview-field_i]:rounded-[4px] [&.preview-field_i]:border
            [&.preview-field_i]:border-solid [&.preview-field_i]:border-[#314e68]
            [&.preview-field_i]:bg-[#142435] [&.preview-floating]:absolute
            [&.preview-floating]:top-[37px] [&.preview-floating]:right-[-3px]
            [&.preview-floating]:flex [&.preview-floating]:[transform:rotate(6deg)]
            [&.preview-floating]:items-center [&.preview-floating]:gap-[7px]
            [&.preview-floating]:rounded-full [&.preview-floating]:border
            [&.preview-floating]:border-solid [&.preview-floating]:border-[#80a4c4]
            [&.preview-floating]:bg-[#28435d] [&.preview-floating]:px-[11px]
            [&.preview-floating]:py-[9px] [&.preview-floating]:text-[8px]
            [&.preview-floating]:text-[#d6eaff]
            [&.preview-floating]:[transition:transform_250ms_var(--ease-out)]
            motion-reduce:[&.preview-floating]:[transition:none] [&.preview-identity]:flex-col
            [&.preview-permission]:ml-auto [&.preview-permission]:flex
            [&.preview-permission]:gap-[3px] [&.preview-permission_i]:h-3.5
            [&.preview-permission_i]:w-[7px] [&.preview-permission_i]:rounded-[3px]
            [&.preview-permission_i]:bg-[#27435b] [&.preview-permission_i.active]:bg-primary
            [&.preview-product]:flex [&.preview-product]:items-center [&.preview-product]:gap-2.5
            [&.preview-product]:border-t [&.preview-product]:[border-top-style:solid]
            [&.preview-product]:border-t-[#2c4258] [&.preview-product]:py-2
            [&.preview-product_>_i]:h-[29px] [&.preview-product_>_i]:w-[29px]
            [&.preview-product_>_i]:rounded-[5px]
            [&.preview-product_>_i]:[background:linear-gradient(145deg,_#99b8d2,_#324961)]
            [&.preview-product_>_span]:flex-1 [&.preview-product_b]:my-1.5
            [&.preview-product_b]:block [&.preview-product_b]:h-1 [&.preview-product_b]:w-[85%]
            [&.preview-product_b]:rounded-[3px] [&.preview-product_b]:bg-[#547592]
            [&.preview-product_b:last-child]:w-[45%]
            [&.preview-product_b:last-child]:bg-[#314c64] [&.preview-product_em]:text-[9px]
            [&.preview-product_em]:text-[#8eabc8] [&.preview-product_em]:not-italic
            [&.preview-role]:flex [&.preview-role]:items-center [&.preview-role]:gap-[9px]
            [&.preview-role]:border-t [&.preview-role]:[border-top-style:solid]
            [&.preview-role]:border-t-[#294459] [&.preview-role]:py-[9px]
            [&.preview-role]:text-[9px] [&.preview-role]:text-[#a9c7e1] [&.preview-sheet]:w-[88%]
            [&.preview-sheet]:max-w-[300px] [&.preview-sheet]:[transform:rotate(-5deg)]
            [&.preview-sheet]:rounded-control [&.preview-sheet]:border
            [&.preview-sheet]:border-solid [&.preview-sheet]:border-[#5a7c9f]
            [&.preview-sheet]:bg-[#091724] [&.preview-sheet]:p-4.5
            [&.preview-sheet]:shadow-[0_18px_30px_#02091245]
            [&.preview-sheet]:[transition:transform_250ms_var(--ease-out)]
            motion-reduce:[&.preview-sheet]:[transition:none] [&.preview-sheet-title]:mb-[15px]
            [&.preview-sheet-title]:block [&.preview-sheet-title]:text-[13px]
            [&.preview-sheet-title]:tracking-[-0.02em] [&.preview-sheet-title]:text-[#d9edff]
          "
          :class="`preview-${direction.preview}`"
          aria-hidden="true"
        >
          <template v-if="direction.preview === 'identity'">
            <div
              data-ui="identity-glyph"
              class="
                relative [transform:rotate(-6deg)] px-5 text-[129px] leading-none
                tracking-[-0.09em] text-[#d9edff] [transition:transform_250ms_var(--ease-out)]
                before:absolute before:bottom-[5px] before:left-0 before:h-[7px] before:w-[7px]
                before:border before:border-solid before:border-primary before:bg-[#172b40]
                before:content-[''] after:absolute after:right-0 after:bottom-[5px] after:h-[7px]
                after:w-[7px] after:border after:border-solid after:border-primary
                after:bg-[#172b40] after:content-[''] motion-reduce:[transition:none]
                [&_>_span]:pr-2.5 [&_>_span]:font-serif [&_>_span]:text-[1.28em]
                [&_>_span]:text-primary [&_>_span]:italic [&_i]:absolute [&_i]:right-0
                [&_i]:bottom-2 [&_i]:left-0 [&_i]:h-[1px] [&_i]:bg-[#7596b1]
              "
            >
              A
              <span>a</span>
              <i />
            </div>
            <div
              data-ui="identity-palette"
              class="
                mt-[15px] flex gap-[5px] [&_>_span]:h-5 [&_>_span]:w-[31px]
                [&_>_span]:rounded-[4px] [&_>_span]:border [&_>_span]:border-solid
                [&_>_span]:border-[#688399] [&_>_span]:bg-background
                [&_>_span:nth-child(2)]:bg-[#172231] [&_>_span:nth-child(3)]:bg-primary
                [&_>_span:nth-child(4)]:bg-ink
              "
            >
              <span />
              <span />
              <span />
              <span />
            </div>
            <span
              data-ui="preview-annotation"
              class="
                absolute right-0 bottom-[-12px] left-0 text-center text-[7px] tracking-[0.1em]
                text-[#89a8c6] uppercase
              "
            >
              Typografia / Kolor / Rytm
            </span>
          </template>
          <template v-else-if="direction.preview === 'contact'">
            <div
              data-ui="preview-sheet"
              class="
                contact-sheet w-[88%] max-w-[300px] [transform:rotate(-5deg)] rounded-control
                border border-solid border-[#5a7c9f] bg-[#091724] p-4.5
                shadow-[0_18px_30px_#02091245] [transition:transform_250ms_var(--ease-out)]
                motion-reduce:[transition:none]
              "
            >
              <span
                data-ui="preview-sheet-title"
                class="mb-[15px] block text-[13px] tracking-[-0.02em] text-[#d9edff]"
              >
                Porozmawiajmy.
              </span>
              <div
                data-ui="preview-field"
                class="
                  my-[9px] [&_>_span]:mb-[5px] [&_>_span]:block [&_>_span]:text-[7px]
                  [&_>_span]:text-[#8eabc8] [&_i]:block [&_i]:h-[15px] [&_i]:rounded-[4px]
                  [&_i]:border [&_i]:border-solid [&_i]:border-[#314e68] [&_i]:bg-[#142435]
                "
              >
                <span>Twój pomysł</span>
                <i />
              </div>
              <div
                data-ui="preview-field"
                class="
                  my-[9px] [&_>_span]:mb-[5px] [&_>_span]:block [&_>_span]:text-[7px]
                  [&_>_span]:text-[#8eabc8] [&_i]:block [&_i]:h-[15px] [&_i]:rounded-[4px]
                  [&_i]:border [&_i]:border-solid [&_i]:border-[#314e68] [&_i]:bg-[#142435]
                "
              >
                <span>Kontakt do Ciebie</span>
                <i />
              </div>
              <span
                data-ui="preview-action"
                class="
                  mt-3 flex items-center justify-between gap-3.5 rounded-[5px] bg-primary
                  px-[11px] py-[9px] text-[8px] text-[#12273b]
                "
              >
                Wyślij wiadomość
                <AppIcon
                  name="arrow"
                  :size="14"
                />
              </span>
            </div>
            <span
              data-ui="preview-floating"
              class="
                absolute top-[37px] right-[-3px] flex [transform:rotate(6deg)] items-center
                gap-[7px] rounded-full border border-solid border-[#80a4c4] bg-[#28435d]
                px-[11px] py-[9px] text-[8px] text-[#d6eaff]
                [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
              "
            >
              <AppIcon
                name="check"
                :size="14"
              />
              Pierwszy krok
            </span>
          </template>
          <template v-else-if="direction.preview === 'checkout'">
            <div
              data-ui="preview-sheet"
              class="
                checkout-sheet w-[88%] max-w-[300px] [transform:rotate(-5deg)] rounded-control
                border border-solid border-[#5a7c9f] bg-[#091724] p-4.5
                shadow-[0_18px_30px_#02091245] [transition:transform_250ms_var(--ease-out)]
                motion-reduce:[transition:none]
              "
            >
              <span
                data-ui="preview-sheet-title"
                class="mb-[15px] block text-[13px] tracking-[-0.02em] text-[#d9edff]"
              >
                Twój koszyk
              </span>
              <div
                data-ui="preview-product"
                class="
                  flex items-center gap-2.5 border-t [border-top-style:solid] border-t-[#2c4258]
                  py-2 [&_>_i]:h-[29px] [&_>_i]:w-[29px] [&_>_i]:rounded-[5px]
                  [&_>_i]:[background:linear-gradient(145deg,_#99b8d2,_#324961)]
                  [&_>_span]:flex-1 [&_b]:my-1.5 [&_b]:block [&_b]:h-1 [&_b]:w-[85%]
                  [&_b]:rounded-[3px] [&_b]:bg-[#547592] [&_b:last-child]:w-[45%]
                  [&_b:last-child]:bg-[#314c64] [&_em]:text-[9px] [&_em]:text-[#8eabc8]
                  [&_em]:not-italic
                "
              >
                <i />
                <span>
                  <b />
                  <b />
                </span>
                <em>01</em>
              </div>
              <div
                data-ui="preview-product"
                class="
                  flex items-center gap-2.5 border-t [border-top-style:solid] border-t-[#2c4258]
                  py-2 [&_>_i]:h-[29px] [&_>_i]:w-[29px] [&_>_i]:rounded-[5px]
                  [&_>_i]:[background:linear-gradient(145deg,_#99b8d2,_#324961)]
                  [&_>_span]:flex-1 [&_b]:my-1.5 [&_b]:block [&_b]:h-1 [&_b]:w-[85%]
                  [&_b]:rounded-[3px] [&_b]:bg-[#547592] [&_b:last-child]:w-[45%]
                  [&_b:last-child]:bg-[#314c64] [&_em]:text-[9px] [&_em]:text-[#8eabc8]
                  [&_em]:not-italic
                "
              >
                <i />
                <span>
                  <b />
                  <b />
                </span>
                <em>02</em>
              </div>
              <span
                data-ui="preview-action"
                class="
                  mt-3 flex items-center justify-between gap-3.5 rounded-[5px] bg-primary
                  px-[11px] py-[9px] text-[8px] text-[#12273b]
                "
              >
                Dalej do zamówienia
                <AppIcon
                  name="arrow"
                  :size="14"
                />
              </span>
            </div>
            <span
              data-ui="preview-floating"
              class="
                absolute top-[37px] right-[-3px] flex [transform:rotate(6deg)] items-center
                gap-[7px] rounded-full border border-solid border-[#80a4c4] bg-[#28435d]
                px-[11px] py-[9px] text-[8px] text-[#d6eaff]
                [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
              "
            >
              <AppIcon
                name="check"
                :size="14"
              />
              Czytelny wybór
            </span>
          </template>
          <template v-else-if="direction.preview === 'roles'">
            <div
              data-ui="preview-sheet"
              class="
                roles-sheet w-[88%] max-w-[300px] [transform:rotate(-5deg)] rounded-control
                border border-solid border-[#5a7c9f] bg-[#091724] p-4.5
                shadow-[0_18px_30px_#02091245] [transition:transform_250ms_var(--ease-out)]
                motion-reduce:[transition:none]
              "
            >
              <span
                data-ui="preview-sheet-title"
                class="mb-[15px] block text-[13px] tracking-[-0.02em] text-[#d9edff]"
              >
                Każdy ma swoją rolę.
              </span>
              <div
                v-for="(role, i) in ['Administrator', 'Zespół', 'Klient']"
                :key="role"
                data-ui="preview-role"
                class="
                  flex items-center gap-[9px] border-t [border-top-style:solid]
                  border-t-[#294459] py-[9px] text-[9px] text-[#a9c7e1]
                "
              >
                <span
                  data-ui="preview-avatar"
                  class="
                    grid h-6.5 w-6.5 place-items-center rounded-full border border-solid
                    border-[#42617c] bg-[#203a51] text-[8px]
                  "
                >
                  0{{ i + 1 }}
                </span>
                <span>{{ role }}</span>
                <span
                  data-ui="preview-permission"
                  class="
                    ml-auto flex gap-[3px] [&_i]:h-3.5 [&_i]:w-[7px] [&_i]:rounded-[3px]
                    [&_i]:bg-[#27435b] [&_i.active]:bg-primary
                  "
                >
                  <i
                    v-for="n in 3"
                    :key="n"
                    :class="{ active: n <= 3 - i }"
                  />
                </span>
              </div>
            </div>
          </template>
          <template v-else-if="direction.preview === 'data'">
            <div
              data-ui="data-root"
              class="
                [transform:rotate(-4deg)] rounded-control border border-solid border-[#88b6d8]
                bg-[#0c1f30] px-6.5 py-4 text-center text-[18px] text-[#d7ecff]
                [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
                [&_>_span]:mt-1 [&_>_span]:block [&_>_span]:text-[8px] [&_>_span]:text-[#87a7c4]
              "
            >
              Twoja firma
              <span>Jedno źródło</span>
            </div>
            <div
              data-ui="data-branches"
              class="
                relative mt-[31px] flex w-full justify-between gap-1.5 before:absolute
                before:top-[-15px] before:right-[16%] before:left-[16%] before:h-[15px]
                before:border-t before:border-r before:border-b-0 before:border-l
                before:border-solid before:border-[#577a9a] before:content-[''] after:absolute
                after:top-[-32px] after:left-[50%] after:h-[17px] after:w-[1px]
                after:bg-[#577a9a] after:content-[''] [&_>_span]:z-[1] [&_>_span]:rounded-control
                [&_>_span]:border [&_>_span]:border-solid [&_>_span]:border-[#50708e]
                [&_>_span]:bg-[#162f45] [&_>_span]:px-3 [&_>_span]:py-[9px] [&_>_span]:text-[9px]
                [&_>_span]:text-[#c1ddf4]
              "
            >
              <span>Kontakt</span>
              <span>Oferta</span>
              <span>Region</span>
            </div>
            <div
              data-ui="data-footnote"
              class="mt-[17px] text-[8px] text-[#8aa9c5] [&_>_span]:px-[9px] [&_>_span]:text-primary"
            >
              Treść
              <span>↔</span>
              Dane strukturalne
            </div>
          </template>
          <template v-else>
            <div
              data-ui="backup-sheet backup-sheet-back"
              class="
                absolute flex h-28 w-[80%] max-w-[255px]
                [transform:translate(-12px,_-25px)_rotate(-9deg)] flex-wrap content-start
                items-center gap-3 rounded-control border border-solid border-[#42647f]
                bg-[#0b1b2a] px-[21px] pt-4 pb-[21px] text-[13px] text-[#8ba9c4]
                [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
              "
            >
              <AppIcon
                name="layers"
                :size="23"
              />
              <span>Kopia danych</span>
            </div>
            <div
              data-ui="backup-sheet backup-sheet-front"
              class="
                absolute flex h-28 w-[80%] max-w-[255px]
                [transform:translate(12px,_22px)_rotate(4deg)] flex-wrap content-center
                items-center gap-3 rounded-control border border-solid border-[#648caf]
                bg-[#1c3852] p-[21px] text-[13px] text-[#beddf6]
                [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
                [&_i]:h-[3px] [&_i]:w-full [&_i]:rounded-full
                [&_i]:[background:linear-gradient(90deg,_#b5dcff_75%,_#365876_75%)]
              "
            >
              <AppIcon
                name="check"
                :size="23"
              />
              <span>Plan odtworzenia</span>
              <i />
            </div>
          </template>
        </div>
        <div
          data-ui="outcome-copy"
          class="
            [&_h3]:leading-[1.05] [&_h3]:tracking-[-0.035em]
            [&_h3_[data-ui~='serif']]:text-[1.18em] [&_h3_[data-ui~='serif']]:text-primary
            [&_p]:mt-4.5 [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-[#b1c5d9]
            max-[760px]:[&_p]:text-[12px]
          "
        >
          <h3 class="text-[31px] max-[760px]:text-[32px]">
            {{ outcomes[1][0] }}
            <span
              data-ui="blue"
              class="text-primary"
            >
              .
            </span>
          </h3>
          <p>{{ outcomes[1][1] }}</p>
        </div>
      </article>

      <article
        v-if="outcomes[2]"
        data-ui="outcome-panel outcome-direction"
        class="
          relative mt-10 min-h-[400px] min-w-0 overflow-hidden rounded-card border border-solid
          border-[#344559] bg-[#111e2b] p-[27px] max-[1050px]:[grid-column:1_/_-1]
          max-[1050px]:mt-0 max-[1050px]:grid max-[1050px]:min-h-0
          max-[1050px]:grid-cols-[1.3fr_1fr] max-[1050px]:gap-x-12.5 max-[1050px]:gap-y-5
          max-[760px]:[grid-column:auto] max-[760px]:block max-[760px]:p-[25px]
          max-[1050px]:[&_[data-ui~='direction-stack']]:[grid-column:2]
          max-[1050px]:[&_[data-ui~='direction-stack']]:[grid-row:2]
          max-[1050px]:[&_[data-ui~='direction-stack']]:my-0
          max-[760px]:[&_[data-ui~='direction-stack']]:mt-4
          max-[760px]:[&_[data-ui~='direction-stack']]:mb-[25px]
          max-[1050px]:[&_[data-ui~='outcome-copy']]:[grid-column:1]
          max-[1050px]:[&_[data-ui~='outcome-copy']]:[grid-row:2]
          max-[1050px]:[&_[data-ui~='outcome-copy']]:self-center
          [&_[data-ui~='outcome-meta']]:text-[8px] [&_[data-ui~='outcome-meta']]:text-[#91aeca]
          max-[1050px]:[&_[data-ui~='outcome-meta']]:[grid-column:1_/_-1] [&_p]:text-[12px]
          pointer-motion:[&:hover_.direction-layer-1]:[transform:translate(-10px,_-40px)_rotate(-5deg)]
          pointer-motion:[&:hover_.direction-layer-2]:[transform:translate(10px,_6px)_rotate(2deg)]
          pointer-motion:[&:hover_.direction-layer-3]:[transform:translate(0,_45px)_rotate(0deg)]
        "
        data-reveal
      >
        <div
          data-ui="outcome-meta"
          class="flex items-center justify-between gap-4 text-[9px] tracking-[0.08em] text-[#c3daed] uppercase"
        >
          <span>03 / Perspektywa</span>
        </div>
        <div
          data-ui="direction-stack"
          class="relative mx-auto mt-4 mb-[25px] h-39.5 w-full max-w-[310px]"
          aria-hidden="true"
        >
          <div
            v-for="(step, i) in direction.steps"
            :key="step"
            data-ui="direction-layer"
            class="
              absolute top-10 left-[6%] flex h-16.5 w-[88%] items-start justify-between gap-3
              rounded-control border border-solid border-[#496b89] px-[17px] py-2 text-[10px]
              text-[#d0e7fb] shadow-[0_12px_22px_#020a1338]
              [transition:transform_250ms_var(--ease-out)] motion-reduce:[transition:none]
              [&.direction-layer-1]:[transform:translate(-6px,_-37px)_rotate(-4deg)]
              [&.direction-layer-1]:bg-[#13283b]
              [&.direction-layer-2]:[transform:translate(7px,_4px)_rotate(2deg)]
              [&.direction-layer-2]:bg-[#1c3850]
              [&.direction-layer-3]:[transform:translate(0,_45px)_rotate(-2deg)]
              [&.direction-layer-3]:items-center [&.direction-layer-3]:border-[#86afcf]
              [&.direction-layer-3]:bg-[#2d506d]
              [&.direction-layer-3_[data-ui~='direction-modules']_i]:bg-primary
            "
            :class="`direction-layer-${i + 1}`"
          >
            <span>{{ step }}</span>
            <span
              data-ui="direction-modules"
              class="flex shrink-0 gap-[3px] [&_i]:h-3 [&_i]:w-[5px] [&_i]:rounded-[2px] [&_i]:bg-[#6e91ae]"
            >
              <i />
              <i />
              <i />
            </span>
          </div>
        </div>
        <div
          data-ui="outcome-copy"
          class="
            [&_h3]:leading-[1.05] [&_h3]:tracking-[-0.035em]
            [&_h3_[data-ui~='serif']]:text-[1.18em] [&_h3_[data-ui~='serif']]:text-primary
            [&_p]:mt-4.5 [&_p]:text-[12px] [&_p]:leading-[1.8] [&_p]:text-[#b1c5d9]
            max-[760px]:[&_p]:text-[12px]
          "
        >
          <h3 class="text-[30px] max-[760px]:text-[32px]">
            {{ splitTitle(outcomes[2][0]).main }}
            <span
              data-ui="serif"
              class="font-serif font-normal tracking-[-0.025em] italic"
            >
              {{ splitTitle(outcomes[2][0]).accent }}.
            </span>
          </h3>
          <p>{{ outcomes[2][1] }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
