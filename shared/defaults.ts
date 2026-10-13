import type { SiteSettings, Project } from './types'
export const defaultSettings: SiteSettings = {
  email: 'contact@makoto.com.pl',
  name: 'Patryk Dąbrowski',
  nip: '5562824200',
  tagline: 'Design. Kod. Charakter.',
  availability: 'Otwarty na nowe projekty',
  phone: '+48 500 408 357',
  streetAddress: 'Młyńska 5/1',
  postalCode: '88-100',
  addressLocality: 'Inowrocław',
  googleMapsUrl:
    'https://www.google.com/maps/place//data=!4m2!3m1!1s0x45d6e9a9647b6191:0xa9ea64dede1ef4f1',
  projects: [
    {
      id: 'landing',
      label: 'Landing page',
      description:
        'Jedna strona z sekcjami pod jednym adresem. Promuje konkretną usługę, produkt lub wydarzenie i prowadzi do kontaktu, zakupu albo zapisu.',
      price: 1400,
    },
    {
      id: 'website',
      label: 'Strona firmowa',
      description:
        'Serwis z osobnymi podstronami i menu, prezentujący całą firmę. Na przykład: strona główna, o firmie, usługi, realizacje i kontakt. Do 5 podstron w cenie.',
      price: 2500,
    },
    {
      id: 'store',
      label: 'Sklep internetowy',
      description:
        'Sprzedaż produktów online: katalog, koszyk i składanie zamówień. Płatności, dostawę i potrzebne integracje dopasujemy do sposobu działania Twojego sklepu.',
      price: 5000,
    },
    {
      id: 'application',
      label: 'Aplikacja webowa',
      description:
        'Narzędzie do pracy w przeglądarce, np. panel klienta, rezerwacje lub system dla zespołu. Funkcje, role użytkowników i zakres ustalamy na podstawie Twojego procesu.',
      price: 8000,
    },
  ],
  extras: [
    {
      id: 'cms',
      label: 'Panel CMS i blog',
      description: 'Samodzielna edycja treści.',
      price: 1200,
    },
    {
      id: 'motion',
      label: 'Rozbudowane animacje',
      description: 'Autorskie interakcje i animacje GSAP.',
      price: 1500,
    },
    {
      id: 'identity',
      label: 'Identyfikacja wizualna',
      description: 'Logo, kolory i zasady komunikacji.',
      price: 1800,
    },
    {
      id: 'copy',
      label: 'Treści na stronę',
      description: 'Teksty, które mówią językiem Twojej marki.',
      price: 900,
    },
    {
      id: 'integrations',
      label: 'Integracje z narzędziami',
      description: 'CRM, newsletter lub zewnętrzne API.',
      price: 1600,
    },
  ],
  monthly: [
    {
      id: 'care',
      label: 'Opieka techniczna',
      description: 'Aktualizacje, kopie zapasowe i wsparcie.',
      price: 250,
    },
    {
      id: 'seo',
      label: 'Rozwój SEO',
      description: 'Stała praca nad widocznością strony.',
      price: 900,
    },
  ],
  designs: [
    {
      id: 'base',
      label: 'Gotowy układ dopasowany do marki',
      description:
        'Dopasowuję sprawdzony układ do Twojego logo, kolorów, zdjęć i treści. To wariant uwzględniony w cenie bazowej.',
      price: 0,
    },
    {
      id: 'premium',
      label: 'Wybrany szablon premium',
      description:
        'Dobieramy szablon zgodny z docelową technologią. Dopłata obejmuje jego dopasowanie; ewentualna licencja szablonu jest płatna osobno.',
      price: 800,
    },
    {
      id: 'custom',
      label: 'Indywidualny projekt w Figma',
      description:
        'Projektuję strukturę i wygląd od zera. Przed wdrożeniem otrzymujesz makiety do akceptacji, przygotowane dla Twojej marki.',
      price: 2500,
    },
  ],
  productImports: [
    {
      id: 'small',
      label: '1–50 produktów',
      description:
        'Wprowadzam do 50 produktów z kompletnych opisów, zdjęć i cen dostarczonych przez Ciebie.',
      price: 250,
    },
    {
      id: 'medium',
      label: '51–200 produktów',
      description: 'Wprowadzam od 51 do 200 produktów z przygotowanego katalogu danych i zdjęć.',
      price: 750,
    },
    {
      id: 'large',
      label: '201–500 produktów',
      description:
        'Wprowadzam od 201 do 500 produktów. Format danych i sposób importu uzgodnimy przed rozpoczęciem.',
      price: 1500,
    },
    {
      id: 'extensive',
      label: '501–1000 produktów',
      description:
        'Wprowadzam od 501 do 1000 produktów z uporządkowanych materiałów. Złożone warianty lub migracja wymagają potwierdzenia zakresu.',
      price: 2500,
    },
  ],
}
export const projects: Project[] = [
  {
    slug: 'spectra',
    title: 'Spectra',
    category: 'Aplikacja / Gaming',
    description: 'Cyfrowy świat, który zaczyna się od jednego kliknięcia.',
    image: '/images/spectra.webp',
    color: '#153537',
    technologies: ['Nuxt', 'TypeScript', 'UI/UX'],
    detail:
      'Strona Spectra i interfejs launchera Minecraft. Projekt łączy charakterystyczny klimat marki z uporządkowaną prezentacją produktu.',
  },
  {
    slug: 'denalify',
    title: 'Denalify',
    category: 'Produkt / SaaS',
    description: 'Mniej chaosu. Więcej przestrzeni na dobrą pracę.',
    image: '/images/denalify.webp',
    color: '#203044',
    technologies: ['Vue', 'Nuxt', 'Tailwind CSS'],
    detail:
      'Aplikacja Kanban bez limitów użytkowników, z natywnymi integracjami. Czytelna tablica i dopracowane interakcje pomagają skupić się na zadaniach.',
  },
  {
    slug: 'radec24',
    title: 'Radec24',
    category: 'Strona / Identyfikacja',
    description: 'Nowa tożsamość dla firmy od sufitów napinanych.',
    image: '',
    color: '#303d43',
    technologies: ['Nuxt', 'Strapi', 'Figma'],
    url: 'https://radec24.pl',
    detail:
      'Kompletny projekt strony i identyfikacji wizualnej: od logo i makiet w Figma po wdrożenie frontendu oraz CMS do zarządzania treściami.',
  },
  {
    slug: '8bitjelly',
    title: '8BitJelly',
    category: 'Strona / Game dev',
    description: 'Miejsce, w którym pomysły na gry nabierają życia.',
    image: '',
    color: '#363040',
    technologies: ['Nuxt', 'Strapi', 'UI/UX'],
    detail:
      'Strona niezależnej grupy twórców gier. Blog i devlogi zarządzane w CMS umożliwiają zespołowi samodzielną publikację postępów.',
  },
  {
    slug: 'voidlink',
    title: 'VoidLink',
    category: 'Aplikacja / Desktop',
    description: 'Tworzenie serwerów Minecraft w prostym interfejsie.',
    image: '',
    color: '#233443',
    technologies: ['Tauri', 'Nuxt', 'TypeScript'],
    detail:
      'Aplikacja desktopowa do tworzenia i zarządzania serwerami Minecraft, zbudowana z wykorzystaniem Tauri 2.0, Nuxt i TypeScript.',
  },
  {
    slug: 'samvolvo',
    title: 'SamVolvo',
    category: 'Strona / Portfolio',
    description: 'Portfolio twórcy, dla którego kod jest kreatywnym warsztatem.',
    image: '',
    color: '#263b45',
    technologies: ['Nuxt', 'Vue', 'Tailwind CSS'],
    url: 'https://samvolvo.com',
    detail:
      'Strona prezentująca pasję do tworzenia oprogramowania i rozwiązywania problemów. Wdrożenie wykorzystuje Nuxt, Vue oraz Tailwind CSS.',
  },
  {
    slug: 'yescandles',
    title: 'YesCandles',
    category: 'Sklep / E-commerce',
    description: 'Sklep z przedmiotami codziennego użytku i świecami zapachowymi.',
    image: '',
    color: '#39352f',
    technologies: ['WordPress', 'WooCommerce', 'Vue', 'GraphQL'],
    url: 'https://yescandles.pl',
    detail:
      'Sklep internetowy dla osób ceniących wysoką jakość przedmiotów i świec zapachowych. Projekt wykorzystuje WordPress i WooCommerce oraz elementy Vue i GraphQL.',
  },
  {
    slug: 'hog-copernicus-chapter',
    title: 'HOG Copernicus Chapter',
    category: 'Strona / Społeczność',
    description: 'Miejsce spotkań miłośników motocykli Harley-Davidson.',
    image: '',
    color: '#382d29',
    technologies: ['Nuxt', 'Vue', 'AdonisJS'],
    url: 'https://hogcopernicus.pl',
    detail:
      'Strona Copernicus Chapter Poland prezentująca członków i wartości społeczności. Serwis zawiera również forum dostępne po zalogowaniu, służące wymianie informacji w chapterze.',
  },
]
export const leadStatuses = {
  new: 'Nowe',
  contacted: 'W kontakcie',
  proposal: 'Oferta wysłana',
  won: 'Wygrane',
  closed: 'Zamknięte',
} as const
