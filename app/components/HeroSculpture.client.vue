<script setup lang="ts">
const host = ref<HTMLDivElement | null>(null)
let dispose: (() => void) | undefined,
  disposed = false
onMounted(async () => {
  // The model must not compete with the content for network or CPU. The wait also matters
  // for correctness: a .client component runs this hook before its template is rendered.
  await afterLoadIdle()
  const container = host.value
  // The scene runs in a worker (app/workers/sculpture.ts). Without OffscreenCanvas the
  // static fallback below simply stays.
  if (disposed || !container || !('transferControlToOffscreen' in HTMLCanvasElement.prototype))
    return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)')
  const canvas = document.createElement('canvas')
  container.appendChild(canvas)
  const offscreen = canvas.transferControlToOffscreen(),
    { width, height } = container.getBoundingClientRect()
  let visible = true,
    worker: Worker | undefined = new Worker(new URL('../workers/sculpture.ts', import.meta.url), {
      type: 'module',
    })
  const run = () =>
    worker?.postMessage({
      type: 'run',
      active: visible && !document.hidden,
      reduce: reduce.matches,
    })
  const observer = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect()
    worker?.postMessage({ type: 'size', width, height })
  })
  const intersection = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting)
    run()
  })
  const move = (event: PointerEvent) => {
    if (reduce.matches || event.pointerType !== 'mouse') return
    const rect = container.getBoundingClientRect()
    worker?.postMessage({
      type: 'point',
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    })
  }
  dispose = () => {
    observer.disconnect()
    intersection.disconnect()
    container.removeEventListener('pointermove', move)
    document.removeEventListener('visibilitychange', run)
    reduce.removeEventListener('change', run)
    worker?.terminate()
    worker = undefined
    canvas.remove()
  }
  // Any failure (no usable GPU, model not loaded) leaves the fallback image in place.
  worker.onmessage = ({ data }) => {
    if (data.type === 'ready') container.classList.add('sculpture-ready')
    else dispose?.()
  }
  worker.onerror = () => dispose?.()
  worker.postMessage(
    { type: 'init', canvas: offscreen, width, height, ratio: Math.min(devicePixelRatio, 1.75) },
    [offscreen],
  )
  run()
  observer.observe(container)
  intersection.observe(container)
  container.addEventListener('pointermove', move)
  document.addEventListener('visibilitychange', run)
  reduce.addEventListener('change', run)
})
onBeforeUnmount(() => {
  disposed = true
  dispose?.()
})
</script>
<template>
  <div
    ref="host"
    data-ui="sculpture"
    class="
      absolute top-5 right-[-15px] bottom-[-25px] left-[-15px] max-[760px]:top-0
      max-[760px]:right-0 max-[760px]:bottom-0 max-[760px]:left-0 [&_canvas]:relative
      [&_canvas]:z-[1] [&_canvas]:h-full [&_canvas]:w-full
      [&.sculpture-ready_[data-ui~=sculpture-fallback]]:hidden
    "
    aria-hidden="true"
  >
    <div
      data-ui="sculpture-fallback"
      class="
        absolute top-0 right-0 bottom-0 left-0 grid h-full w-full place-items-center
        [&_img]:h-auto [&_img]:w-[68%]
      "
    >
      <img
        src="/brand/makoto.webp"
        alt=""
        width="188"
        height="40"
      />
    </div>
  </div>
</template>
