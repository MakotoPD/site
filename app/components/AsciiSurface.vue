<script setup lang="ts">
// SSR keeps the real image. A cached ASCII image is revealed only around the pointer.
const props = withDefaults(
  defineProps<{
    src: string
    srcset?: string
    sizes?: string
    position?: string
    interactive?: boolean
    width?: number
    height?: number
  }>(),
  {
    sizes: '100vw',
    position: '50% 50%',
    interactive: true,
    width: 1280,
    height: 853,
  },
)
const surface = useTemplateRef<HTMLDivElement>('surface'),
  photo = useTemplateRef<HTMLImageElement>('photo'),
  canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const ready = ref(false),
  enabled = ref(false)
let gsap: typeof import('gsap').gsap | undefined
let xTo: ReturnType<typeof import('gsap').gsap.quickTo> | undefined,
  yTo: ReturnType<typeof import('gsap').gsap.quickTo> | undefined
let cached: HTMLCanvasElement | undefined,
  source = '',
  frame = 0,
  disposed = false,
  hovering = false,
  inView = true
let decoded: HTMLImageElement | undefined,
  decodedSource = ''
let resize: ResizeObserver | undefined, intersection: IntersectionObserver | undefined
let finePointer: MediaQueryList | undefined, reduced: MediaQueryList | undefined
const lens = { x: 0, y: 0, opacity: 0 },
  cursor = { x: 0, y: 0 }
let box = { width: 0, height: 0 },
  ratio = 1
function scheduleDraw() {
  if (!frame && !disposed) frame = requestAnimationFrame(draw)
}
function draw() {
  frame = 0
  const ctx = canvas.value?.getContext('2d')
  if (!ctx || !cached || !box.width || !box.height) return
  ctx.setTransform(canvas.value!.width / box.width, 0, 0, canvas.value!.height / box.height, 0, 0)
  ctx.clearRect(0, 0, box.width, box.height)
  if (lens.opacity < 0.005) return
  ctx.globalAlpha = lens.opacity
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(cached, 0, 0, box.width, box.height)
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'destination-in'
  const radius = Math.min(190, box.width * 0.4)
  const mask = ctx.createRadialGradient(lens.x, lens.y, radius * 0.3, lens.x, lens.y, radius)
  mask.addColorStop(0, '#000')
  mask.addColorStop(0.65, '#000b')
  mask.addColorStop(1, '#0000')
  ctx.fillStyle = mask
  ctx.fillRect(0, 0, box.width, box.height)
  ctx.globalCompositeOperation = 'source-over'
}
function prepare() {
  const image = photo.value,
    output = canvas.value,
    root = surface.value
  if (!image?.complete || !image.naturalWidth || !root || !output || !enabled.value || !inView)
    return false
  const style = getComputedStyle(root)
  const width = Number.parseFloat(style.width),
    height = Number.parseFloat(style.height)
  if (!width || !height) return false
  if (cached && box.width === width && box.height === height && source === image.currentSrc)
    return true
  invalidate()
  if (!decoded || decodedSource !== image.currentSrc) {
    // srcset changes naturalWidth to density-corrected CSS pixels. Decode the
    // selected file without srcset so Canvas and CSS use the same complete image.
    const raw = new Image()
    decoded = raw
    decodedSource = image.currentSrc
    raw.decoding = 'async'
    raw.onload = () => {
      if (disposed || decoded !== raw || image.currentSrc !== decodedSource) return
      if (hovering && prepare())
        gsap?.to(lens, {
          opacity: 1,
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
          onUpdate: scheduleDraw,
        })
    }
    raw.src = decodedSource
  }
  if (!decoded.complete || !decoded.naturalWidth) return false
  try {
    const cellWidth = 8,
      cellHeight = 11,
      columns = Math.ceil(width / cellWidth),
      rows = Math.ceil(height / cellHeight)
    const stepX = width / columns,
      stepY = height / rows
    const samples = document.createElement('canvas')
    samples.width = columns
    samples.height = rows
    const sample = samples.getContext('2d', { willReadFrequently: true })
    if (!sample) return false
    const scale = Math.max(width / decoded.naturalWidth, height / decoded.naturalHeight)
    const scaledWidth = decoded.naturalWidth * scale,
      scaledHeight = decoded.naturalHeight * scale
    const position = getComputedStyle(image)
      .objectPosition.split(' ')
      .map((value) => Math.min(1, Math.max(0, (Number.parseFloat(value) || 0) / 100)))
    // Use the full source and reproduce object-fit: cover in destination space.
    // Cell spacing must fill the exact fractional CSS box, with no accumulated drift.
    sample.drawImage(
      decoded,
      ((width - scaledWidth) * (position[0] ?? 0.5)) / stepX,
      ((height - scaledHeight) * (position[1] ?? 0.5)) / stepY,
      scaledWidth / stepX,
      scaledHeight / stepY,
    )
    const pixels = sample.getImageData(0, 0, columns, rows).data
    ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    const ascii = document.createElement('canvas')
    ascii.width = Math.ceil(width * ratio)
    ascii.height = Math.ceil(height * ratio)
    const ctx = ascii.getContext('2d')
    if (!ctx || !output.getContext('2d')) return false
    ctx.scale(ascii.width / width, ascii.height / height)
    ctx.fillStyle = '#07121e'
    ctx.fillRect(0, 0, width, height)
    ctx.font = '10px ui-monospace, SFMono-Regular, Consolas, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const glyphs = ' .:-=+*#%@'
    for (let row = 0; row < rows; row++)
      for (let col = 0; col < columns; col++) {
        const i = (row * columns + col) * 4
        const luminance = 0.2126 * pixels[i]! + 0.7152 * pixels[i + 1]! + 0.0722 * pixels[i + 2]!
        const density = Math.min(1, Math.max(0, (luminance / 255 - 0.08) * 1.25))
        ctx.fillStyle = `rgba(181,220,255,${0.25 + density * 0.75})`
        ctx.fillText(
          glyphs[Math.min(glyphs.length - 1, Math.floor(density * glyphs.length))]!,
          (col + 0.5) * stepX,
          (row + 0.5) * stepY,
        )
      }
    output.width = ascii.width
    output.height = ascii.height
    cached = ascii
    box = { width, height }
    source = image.currentSrc
    ready.value = true
    return true
  } catch {
    ready.value = false
    cached = undefined
    return false
  }
}
function point(event: PointerEvent) {
  const rect = surface.value?.getBoundingClientRect()
  if (rect) {
    cursor.x = (event.clientX - rect.left) * ((box.width || rect.width) / rect.width)
    cursor.y = (event.clientY - rect.top) * ((box.height || rect.height) / rect.height)
  }
}
function enter(event: PointerEvent) {
  if (!enabled.value || !gsap || !inView || document.hidden || event.pointerType === 'touch') return
  hovering = true
  point(event)
  lens.x = cursor.x
  lens.y = cursor.y
  xTo?.(cursor.x, cursor.x)
  yTo?.(cursor.y, cursor.y)
  if (prepare())
    gsap.to(lens, {
      opacity: 1,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: scheduleDraw,
    })
}
function move(event: PointerEvent) {
  if (!enabled.value || !gsap || !inView || document.hidden || event.pointerType === 'touch') return
  // Scrolling or switching tabs can stop the effect without a new pointerenter.
  if (!hovering) {
    enter(event)
    return
  }
  if (!cached) return
  point(event)
  xTo?.(cursor.x)
  yTo?.(cursor.y)
}
function leave() {
  hovering = false
  xTo?.tween.pause()
  yTo?.tween.pause()
  gsap?.to(lens, {
    opacity: 0,
    duration: 0.16,
    ease: 'power3.out',
    overwrite: 'auto',
    onUpdate: scheduleDraw,
  })
}
function stop() {
  hovering = false
  // quickTo owns reusable x/y tweens. Killing them removes their property tracks,
  // so a later resetTo cannot move the lens. Pause them until the next hover.
  xTo?.tween.pause()
  yTo?.tween.pause()
  gsap?.killTweensOf(lens, 'opacity')
  lens.opacity = 0
  cancelAnimationFrame(frame)
  frame = 0
  if (cached) clear()
}
function imageLoaded() {
  invalidate()
  if (hovering && prepare())
    gsap?.to(lens, {
      opacity: 1,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto',
      onUpdate: scheduleDraw,
    })
}
// Nothing has been drawn until an ASCII image is cached. Creating a 2D context just to clear
// an empty canvas is slow, and on touch devices the effect never runs at all.
function clear() {
  const output = canvas.value
  output?.getContext('2d')?.clearRect(0, 0, output.width, output.height)
}
function invalidate() {
  if (cached) clear()
  cached = undefined
  ready.value = false
}
// The lens needs GSAP only where the effect can run at all (mouse, wide screen).
async function loadMotion() {
  if (gsap || !enabled.value) return
  await afterLoadIdle()
  const module = await import('gsap')
  if (disposed || gsap) return
  gsap = module.gsap
  xTo = gsap.quickTo(lens, 'x', { duration: 0.25, ease: 'power3.out', onUpdate: scheduleDraw })
  yTo = gsap.quickTo(lens, 'y', { duration: 0.25, ease: 'power3.out', onUpdate: scheduleDraw })
}
function updatePreference() {
  enabled.value = !!props.interactive && !!finePointer?.matches && !reduced?.matches
  loadMotion()
  if (!enabled.value) {
    stop()
    cached = undefined
    ready.value = false
  }
}
function visibility() {
  if (document.hidden) stop()
}
onMounted(() => {
  finePointer = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)')
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
  finePointer.addEventListener('change', updatePreference)
  reduced.addEventListener('change', updatePreference)
  document.addEventListener('visibilitychange', visibility)
  updatePreference()
  resize = new ResizeObserver(() => {
    invalidate()
    if (hovering && prepare()) scheduleDraw()
  })
  intersection = new IntersectionObserver((entries) => {
    inView = !!entries[0]?.isIntersecting
    if (!inView) stop()
  })
  if (surface.value) {
    resize.observe(surface.value)
    intersection.observe(surface.value)
  }
})
onBeforeUnmount(() => {
  disposed = true
  stop()
  cached = undefined
  resize?.disconnect()
  intersection?.disconnect()
  xTo?.tween.kill()
  yTo?.tween.kill()
  if (decoded) decoded.onload = null
  decoded = undefined
  finePointer?.removeEventListener('change', updatePreference)
  reduced?.removeEventListener('change', updatePreference)
  document.removeEventListener('visibilitychange', visibility)
})
</script>
<template>
  <div
    ref="surface"
    data-ui="ascii-surface"
    class="
      relative isolate h-full min-h-[inherit] w-full overflow-hidden bg-[#101b28]
      after:pointer-events-none after:absolute after:top-0 after:right-0 after:bottom-0
      after:left-0 after:z-[2] after:content-['']
      after:[background:linear-gradient(180deg,_#030a1370_0%,_#07111b08_32%,_#06101c91_62%,_#050d17f2_100%)]
    "
    :data-ascii="!enabled ? 'disabled' : ready ? 'ready' : 'idle'"
    @pointerenter="enter"
    @pointermove="move"
    @pointerleave="leave"
  >
    <img
      ref="photo"
      data-ui="ascii-photo"
      class="
        absolute top-0 right-0 bottom-0 left-0 h-full w-full max-w-[none] object-cover
        [filter:saturate(0.35)]
      "
      :src="src"
      :srcset="srcset"
      :sizes="sizes"
      :width="width"
      :height="height"
      :style="{ objectPosition: position }"
      alt=""
      loading="lazy"
      decoding="async"
      @load="imageLoaded"
    />
    <canvas
      ref="canvas"
      data-ui="ascii-canvas"
      class="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-[1] h-full w-full motion-reduce:hidden"
      aria-hidden="true"
    />
    <div
      data-ui="ascii-content"
      class="relative z-[3] h-full min-h-[inherit] w-full"
    >
      <slot />
    </div>
  </div>
</template>
