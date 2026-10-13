import type { Ref } from 'vue'
export function useMotion(root: Ref<HTMLElement | null>) {
  let cleanup: (() => void) | undefined
  let disposed = false
  onMounted(async () => {
    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ])
    if (disposed || !root.value) return
    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()
    const context = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-hero]', {
          y: 48,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
        })
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            y: 38,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'all',
            scrollTrigger: { trigger: element, start: 'top 92%', once: true },
          })
        })
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((element) => {
          gsap.fromTo(
            element,
            { yPercent: -3 },
            {
              yPercent: 3,
              ease: 'none',
              scrollTrigger: {
                trigger: element.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            },
          )
        })
        const heroObject = root.value?.querySelector('[data-ui~="hero-art"]')
        if (heroObject)
          gsap.to(heroObject, {
            y: -50,
            rotation: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: root.value?.querySelector('[data-ui~="hero"]'),
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          })
      })
    }, root.value)
    cleanup = () => {
      mm.revert()
      context.revert()
    }
  })
  onBeforeUnmount(() => {
    disposed = true
    cleanup?.()
  })
}
