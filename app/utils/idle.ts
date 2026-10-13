// Resolves once the page has loaded and the browser has a quiet moment. Decoration (3D model,
// scroll effects) waits for this, so it never competes with the content for network or CPU.
export function afterLoadIdle() {
  return new Promise<void>((resolve) => {
    const wait = () =>
      typeof requestIdleCallback === 'function'
        ? requestIdleCallback(() => resolve(), { timeout: 2500 })
        : setTimeout(resolve, 600)
    if (document.readyState === 'complete') wait()
    else addEventListener('load', wait, { once: true })
  })
}
