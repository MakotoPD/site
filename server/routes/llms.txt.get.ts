import { siteOrigin } from '#shared/seo'
export default defineEventHandler(async (event) => {
  const site = siteOrigin(useRuntimeConfig(event).public.siteUrl)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  return `# Makoto\n\n> Publiczny przewodnik po usługach, autorze, cenach i obszarze obsługi Makoto.\n\n## Oferta i informacje\n\n${(await seoDocuments()).map((d) => `- [${d.title}](${site + (d.path === '/' ? '/ai/index.md' : '/ai' + d.path + '.md')}): ${d.description}`).join('\n')}\n\n## Pełne materiały\n\n- [Pełny tekst publicznych materiałów](${site}/llms-full.txt)\n- [Obszar działania](${site}/obszar-dzialania)\n\n## Zakres\n\nMateriały odpowiadają publicznej ofercie. Ceny są orientacyjne. Miasta są obszarem obsługi, nie osobnymi oddziałami. Panel, szkice oraz zgłoszenia klientów nie są częścią tych materiałów.\n`
})
