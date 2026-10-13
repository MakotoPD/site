import { siteOrigin } from '#shared/seo'
export default defineEventHandler(async (event) => {
  const site = siteOrigin(useRuntimeConfig(event).public.siteUrl)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  return `# Makoto — publiczne materiały\n\n${(await seoDocuments()).map((d) => `Źródło: ${site + d.path}\n\n${d.markdown}`).join('\n\n---\n\n')}`
})
