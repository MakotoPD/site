import { locations, localPath } from '#shared/locations'
import { servicePages, servicePath } from '#shared/services'
import { projects } from '#shared/defaults'
import { siteOrigin } from '#shared/seo'
export interface SeoDocument {
  path: string
  title: string
  description: string
  markdown: string
  modified?: string
}
export async function seoDocuments(): Promise<SeoDocument[]> {
  const [settings, records] = await Promise.all([getSettings(), allPosts()])
  const posts = records.filter((post) => post.status === 'published')
  const site = siteOrigin(useRuntimeConfig().public.siteUrl)
  const contact = `Makoto — ${settings.name}\n\nKontakt: ${settings.email}${settings.phone ? `, ${settings.phone}` : ''}.\n\n${settings.streetAddress ? `Adres publiczny: ${settings.streetAddress}, ${settings.postalCode} ${settings.addressLocality}.\n\n` : ''}Obszar obsługi: Inowrocław, Toruń, Bydgoszcz, Grudziądz, Włocławek i całe województwo kujawsko-pomorskie.\n\nProjekty można prowadzić zdalnie. Sposób spotkania ustalamy wcześniej.\n\n${settings.googleMapsUrl ? `Profil Google: ${settings.googleMapsUrl}\n\n` : ''}`
  const pricing = settings.projects
    .map((p) => `- ${p.label}: orientacyjnie od ${p.price} PLN netto. ${p.description}`)
    .join('\n')
  const baseline = `Ceny są orientacyjne, nie stanowią wiążącej oferty. Strona firmowa obejmuje do 5 podstron; kolejne +250 PLN. Dodatkowy język +800 PLN, priorytetowy termin +25%. Domena i zewnętrzne abonamenty są osobnymi kosztami. Aplikacja wymaga indywidualnego ustalenia funkcji.\n\n${pricing}\n\n### Wygląd strony lub sklepu\n\n${settings.designs.map((p) => `- ${p.label}: dopłata ${p.price} PLN netto. ${p.description}`).join('\n')}\n\n### Wprowadzanie produktów przez Makoto\n\n${settings.productImports.map((p) => `- ${p.label}: dopłata ${p.price} PLN netto. ${p.description}`).join('\n')}\n\nDopłata za wprowadzanie produktów dotyczy sklepu i jest doliczana tylko wtedy, gdy klient wybiera dodawanie produktów przez Makoto. Samodzielne wprowadzanie nie ma tej dopłaty; ponad 1000 produktów lub nieustalony zakres wymaga rozmowy.\n\n### Dodatki\n\n${settings.extras.map((p) => `- ${p.label}: ${p.price} PLN netto jednorazowo. ${p.description}`).join('\n')}\n\n### Usługi miesięczne\n\n${settings.monthly.map((p) => `- ${p.label}: od ${p.price} PLN netto miesięcznie. ${p.description}`).join('\n')}`
  const documents: SeoDocument[] = [
    {
      path: '/',
      title: 'Makoto — strony internetowe Inowrocław i Kujawsko-Pomorskie',
      description: 'Autorskie strony, sklepy, aplikacje i projektowanie UI/UX.',
      markdown: `# Makoto\n\n${contact}## Usługi\n\n${servicePages.map((s) => `- [${s.name}](${site + servicePath(s.slug)}): ${s.lead}`).join('\n')}\n\n## Wycena\n\n${baseline}\n\n## Doświadczenie\n\nRealizacje i ich opis są dostępne w [portfolio](${site}/realizacje). Informacje o autorze: [${settings.name}](${site}/o-mnie).`,
    },
    {
      path: '/kontakt',
      title: 'Kontakt z Makoto',
      description: 'Publiczne dane kontaktowe i obszar współpracy.',
      markdown: `# Kontakt\n\n${contact}`,
    },
    {
      path: '/obszar-dzialania',
      title: 'Strony internetowe — Kujawsko-Pomorskie',
      description: 'Obszar obsługi Makoto.',
      markdown: `# Obszar działania\n\n${contact}## Miasta\n\n${locations.map((c) => `- [${c.title}](${site + localPath(c.slug)}): ${c.lead}`).join('\n')}\n\nPodstrony miast opisują obszar obsługi. Publiczny adres firmy jest jeden; nie oznaczają oddziałów w każdym mieście.`,
    },
    {
      path: '/wycena',
      title: 'Kalkulator wyceny Makoto',
      description: 'Koszt projektu oraz usług miesięcznych.',
      markdown: `# Kalkulator wyceny\n\n${baseline}\n\nKonfigurację z danymi kontaktowymi można wysłać przez [kalkulator](${site}/wycena). Dane zgłoszeń nie są publiczne.`,
    },
    {
      path: '/o-mnie',
      title: 'Patryk Dąbrowski — Makoto',
      description: 'Autor projektów stron, aplikacji i interfejsów.',
      markdown: `# ${settings.name} — Makoto\n\n${contact}Projektuję interfejsy i wdrażam strony oraz aplikacje. Korzystam z Nuxt, Vue, Tailwind CSS i GSAP. Realizacje dokumentuję w [portfolio](${site}/realizacje).\n\nProfile: [GitHub](https://github.com/makotopd), [LinkedIn](https://www.linkedin.com/in/makotopd/).`,
    },
  ]
  documents.push(
    {
      path: '/uslugi',
      title: 'Usługi Makoto',
      description: 'Strony, sklepy, aplikacje, design, SEO i opieka.',
      markdown: `# Usługi Makoto\n\n${servicePages.map((s) => `## ${s.name}\n\n${s.lead}\n\n[Pełny zakres](${site + servicePath(s.slug)}).`).join('\n\n')}`,
    },
    {
      path: '/realizacje',
      title: 'Realizacje Makoto',
      description: 'Udokumentowane projekty i ich zakres.',
      markdown: `# Realizacje Makoto\n\n${projects.map((p) => `## [${p.title}](${site}/realizacje/${p.slug})\n\n${p.category}. ${p.detail}`).join('\n\n')}`,
    },
    {
      path: '/blog',
      title: 'Blog Makoto',
      description: 'Opublikowane materiały z warsztatu projektanta i programisty.',
      markdown: `# Blog Makoto\n\n${posts.map((p) => `- [${p.title}](${site}/blog/${p.slug}): ${p.excerpt}`).join('\n')}`,
    },
    {
      path: '/pytania',
      title: 'Pytania o Makoto',
      description: 'Autor, zakres, ceny i współpraca.',
      markdown: `# Pytania i odpowiedzi\n\n## Kto stoi za Makoto?\n\n${settings.name} projektuje i wdraża strony, sklepy oraz aplikacje. Klient kontaktuje się bezpośrednio z osobą realizującą projekt.\n\n## Gdzie działa Makoto?\n\n${contact}\n\nPodstrony miast opisują obszar obsługi, a nie oddziały.\n\n## Ile kosztuje strona firmowa?\n\nOrientacyjnie od ${settings.projects.find((p) => p.id === 'website')?.price || 0} PLN netto, do 5 podstron w bazowym zakresie. Ostateczna cena, termin i zakres wymagają potwierdzenia po rozmowie.\n\n## Czy mogę edytować treść?\n\nTak, jeśli panel CMS jest częścią uzgodnionego projektu. Zakres edycji i publikacji ustalamy przed wdrożeniem.\n\n## Jak sprawdzić doświadczenie?\n\n[Portfolio](${site}/realizacje) zawiera rzeczywiste projekty, ich zakres i narzędzia.\n\n## Co oznacza SEO i GEO?\n\nDostępne treści HTML, poprawne metadane, adresy oraz zgodne dane firmy są podstawą. Jasne odpowiedzi i źródła ułatwiają zrozumienie treści przez systemy AI, ale nie gwarantują pozycji ani cytowania.\n\n## Jak długo trwa projekt?\n\nTermin zależy od zakresu, materiałów i integracji. Kalkulator pokazuje orientacyjny czas; wiążący harmonogram ustalamy po briefie.`,
    },
    {
      path: '/prywatnosc',
      title: 'Prywatność w Makoto',
      description: 'Publiczny opis przechowywania danych, ochrony formularzy i zgód.',
      markdown: `# Prywatność\n\nAdministratorem danych jest ${settings.name} (Makoto, NIP ${settings.nip}). Kontakt: ${settings.email}.\n\nFormularze zapisują dane potrzebne do odpowiedzi i przygotowania oferty w PostgreSQL. Zgłoszenia oraz panel wymagają uwierzytelnienia i nie są publicznym materiałem. Pliki bloga są przechowywane w Cloudflare R2; pliki szkiców nie są publicznie dostępne. Formularze chroni Cloudflare Turnstile. Analityka jest uruchamiana po zgodzie, którą można zmienić w ustawieniach cookie. Zgłoszenia są usuwane automatycznie po 3 latach od ostatniej aktualizacji.\n\n[Pełna polityka prywatności](${site}/prywatnosc).`,
    },
  )
  for (const project of projects)
    documents.push({
      path: `/realizacje/${project.slug}`,
      title: project.title,
      description: project.description,
      markdown: `# ${project.title}\n\nKategoria: ${project.category}.\n\n${project.description}\n\n${project.detail}\n\n## Narzędzia\n\n${project.technologies.map((t) => '- ' + t).join('\n')}${project.url ? `\n\nStrona projektu: ${project.url}` : ''}\n\nAutor: ${settings.name} — Makoto.`,
    })
  for (const city of locations)
    documents.push({
      path: localPath(city.slug),
      title: city.title,
      description: city.description,
      markdown: `# ${city.title}\n\n${city.lead}\n\n${city.introduction.join('\n\n')}\n\n${city.sections.map((s) => `## ${s.title}\n\n${s.paragraphs.join('\n\n')}\n\n${s.items?.map((i) => '- ' + i).join('\n') || ''}`).join('\n\n')}\n\n## Co przygotować do rozmowy?\n\n${city.brief.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n## Pytania i odpowiedzi\n\n${city.faq.map((f) => `### ${f[0]}\n\n${f[1]}`).join('\n\n')}\n\n## Kontekst lokalny\n\n${city.source.context}\n\nŹródło: [${city.source.title}](${city.source.url}).\n\n## Kontakt\n\n${contact}`,
    })
  for (const service of servicePages)
    documents.push({
      path: servicePath(service.slug),
      title: service.title,
      description: service.description,
      markdown: `# ${service.title}\n\n${service.lead}\n\n${service.sections.map((s) => `## ${s.title}\n\n${s.paragraphs.join('\n\n')}\n\n${s.items?.map((i) => '- ' + i).join('\n') || ''}`).join('\n\n')}\n\n## Pytania i odpowiedzi\n\n${service.faq.map((f) => `### ${f[0]}\n\n${f[1]}`).join('\n\n')}\n\n## Kontakt\n\n${contact}`,
    })
  for (const post of posts)
    documents.push({
      path: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      modified: post.updatedAt,
      markdown: `# ${post.title}\n\n${post.excerpt}\n\nAutor: ${settings.name}.\nOpublikowano: ${post.publishedAt || post.createdAt}.\nAktualizacja: ${post.updatedAt}.\n\n${post.content}`,
    })
  return documents
}
