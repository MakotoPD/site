import type { LocalSection } from './locations'
export interface ServicePage {
  slug: string
  name: string
  title: string
  description: string
  lead: string
  project?: string
  priceId?: string
  monthlyId?: string
  sections: LocalSection[]
  outcomes: [string, string][]
  faq: [string, string][]
}
export const servicePages: ServicePage[] = [
  {
    slug: 'strony-internetowe',
    name: 'Strony internetowe',
    title: 'Tworzenie stron internetowych',
    description:
      'Autorskie strony firmowe i landing page w Nuxt. Projekt UI/UX, responsywność, CMS i SEO techniczne dla firm z Kujawsko-Pomorskiego. Wyceń z Makoto.',
    project: 'website',
    priceId: 'website',
    lead: 'Makoto projektuje i wdraża strony internetowe dla firm z województwa kujawsko-pomorskiego. Zakres może obejmować landing page, serwis usługowy, blog oraz panel CMS. Projekt przygotowuje Patryk Dąbrowski, od struktury informacji po gotowe wdrożenie.',
    sections: [
      {
        title: 'Co powstaje w ramach projektu strony?',
        paragraphs: [
          'Zaczynam od celu i zawartości strony. Ustalamy, do kogo kierujesz ofertę, jakie informacje pomagają podjąć decyzję i co użytkownik ma zrobić po ich przeczytaniu. Na tej podstawie powstaje struktura podstron oraz plan potrzebnych treści. Liczba ekranów wynika z zakresu, a nie z gotowego szablonu.',
          'Następnie projektuję interfejs w Figma i wdrażam zaakceptowany kierunek w Nuxt oraz Tailwind CSS. Pilnuję czytelnej typografii, sposobu korzystania na telefonie i wybranych interakcji. Animacje GSAP mogą podkreślać charakter marki, ale nie powinny utrudniać znalezienia oferty lub wypełnienia formularza.',
        ],
        items: [
          'Struktura serwisu oraz autorski projekt najważniejszych widoków.',
          'Responsywne wdrożenie, nawigacja, kontakt i uzgodnione formularze.',
          'Metadane, indeksowalne treści HTML, mapa witryny i podstawy dostępności.',
        ],
      },
      {
        title: 'Jak wybieramy CMS i zakres edycji?',
        paragraphs: [
          'Panel jest przydatny wtedy, gdy planujesz samodzielnie zmieniać ofertę, realizacje lub wpisy. Ustalamy, które pola wymagają edycji i kto odpowiada za publikację. Mogę przygotować szkice, statusy wpisów i przesyłanie okładek, zamiast pozostawiać użytkownika z nieograniczonym edytorem całego układu.',
          'Po wdrożeniu otrzymujesz instrukcję obsługi uzgodnionego panelu. Domenę, hosting, kopie zapasowe i dalszą opiekę omawiamy przed publikacją. Jeżeli przebudowujemy istniejącą stronę, ważną częścią prac jest lista starych adresów oraz plan przeniesienia treści i przekierowań.',
        ],
      },
    ],
    outcomes: [
      [
        'Spójny wizerunek',
        'Logo, typografia i komponenty tworzą jeden system dopasowany do marki.',
      ],
      [
        'Wygodny kontakt',
        'Użytkownik szybko dociera do oferty i wysyła informacje potrzebne do odpowiedzi.',
      ],
      [
        'Możliwość rozwoju',
        'Strukturę można rozszerzyć o kolejne realizacje, treści i uzgodnione funkcje.',
      ],
    ],
    faq: [
      [
        'Landing page czy strona firmowa?',
        'Landing page koncentruje się na jednym celu. Strona firmowa rozdziela ofertę, informacje o firmie i inne treści na osobne podstrony. Wybór zależy od zakresu i odbiorców.',
      ],
      [
        'Czy dostarczam własne teksty?',
        'Możesz przekazać gotowe teksty lub uzgodnić pomoc przy ich przygotowaniu. Przed projektowaniem ustalamy, kto odpowiada za treść i materiały.',
      ],
      [
        'Czy strona będzie widoczna w odpowiedziach AI?',
        'Przygotowuję dostępne treści, dane firmy i poprawne linkowanie. Indeksowanie i wybór cytowanych źródeł należą do wyszukiwarek; nie można zagwarantować konkretnej ekspozycji.',
      ],
    ],
  },
  {
    slug: 'sklepy-internetowe',
    name: 'Sklepy internetowe',
    title: 'Tworzenie sklepów internetowych',
    description:
      'Sklepy internetowe dla firm z Kujawsko-Pomorskiego. Katalog, koszyk, płatności i dostawa dopasowane do procesu sprzedaży. Poznaj zakres Makoto.',
    project: 'store',
    priceId: 'store',
    lead: 'Projektuję sklepy internetowe dla marek z Inowrocławia, Torunia, Bydgoszczy, Grudziądza i Włocławka. Zakres ustalamy wokół procesu zakupowego: od katalogu i wariantów po koszyk, płatności, dostawę oraz obsługę zamówień.',
    sections: [
      {
        title: 'Najpierw sposób sprzedaży, potem narzędzie',
        paragraphs: [
          'W briefie ustalamy liczbę produktów, warianty, sposób ustalania cen i obsługi zamówienia. Innego rozwiązania potrzebuje marka z prostym katalogiem, a innego firma z wieloma parametrami lub ofertą B2B. Sprawdzamy też, czy klient powinien kupować bezpośrednio, czy wysyłać zapytanie o indywidualne warunki.',
          'Dobór platformy i integracji wynika z tych odpowiedzi. Przed wdrożeniem potwierdzamy dostępne metody płatności, dostawy i potrzebne połączenia z innymi systemami. Koszty operatorów, abonamentów oraz prowizji są oddzielne od pracy nad projektem i wymagają oceny konkretnej oferty usługodawcy.',
        ],
        items: [
          'Katalog z uzgodnionymi kategoriami, filtrami i wariantami.',
          'Czytelna karta produktu, koszyk i kolejne kroki zamówienia.',
          'Sposób obsługi płatności, dostawy i komunikacji z kupującym.',
        ],
      },
      {
        title: 'Treść produktu pomaga w decyzji',
        paragraphs: [
          'Dobre fotografie, parametry i informacje o zastosowaniu mają znaczenie zarówno dla kupującego, jak i dla wyszukiwarki. Planuję miejsce na te materiały oraz czytelną strukturę adresów. Dane o cenie, dostępności czy dostawie powinny pochodzić z rzeczywistego procesu sklepu.',
          'Przed publikacją sprawdzamy scenariusze zakupowe na telefonie i komputerze. Ważna jest też praca zespołu: wprowadzanie produktu, zmiana wariantu, odczyt zamówienia i obsługa powiadomień. Rozbudowę katalogu oraz opiekę techniczną możemy zaplanować jako dalszy etap.',
        ],
      },
    ],
    outcomes: [
      ['Czytelny katalog', 'Kategorie i parametry ułatwiają znalezienie właściwego produktu.'],
      ['Prostsze zakupy', 'Koszyk i kolejne kroki tworzą spójną ścieżkę także na telefonie.'],
      ['Uzgodnione integracje', 'Płatności i dostawy dobieramy do sposobu działania Twojej firmy.'],
    ],
    faq: [
      [
        'Czy sklep musi od razu mieć wszystkie integracje?',
        'Nie. Warto ustalić minimalny zakres potrzebny do obsługi zamówień, a kolejne połączenia planować w następnym etapie.',
      ],
      [
        'Czy cena obejmuje prowizje płatnicze?',
        'Nie. Opłaty zewnętrznych operatorów, abonamenty i prowizje są kosztami osobnymi. Omawiamy je podczas ustalania narzędzi.',
      ],
      [
        'Czy można sprzedawać z odbiorem osobistym?',
        'Tak, jeśli odpowiada to Twojemu modelowi sprzedaży i możliwościom wybranej platformy. Warunki odbioru powinny być jasno opisane klientowi.',
      ],
    ],
  },
  {
    slug: 'aplikacje-webowe',
    name: 'Aplikacje webowe',
    title: 'Tworzenie aplikacji webowych',
    description:
      'Dedykowane aplikacje webowe, panele i narzędzia dla firm z Kujawsko-Pomorskiego. Makoto: UI/UX, logika, API i wdrożenie dopasowane do potrzeb.',
    project: 'application',
    priceId: 'application',
    lead: 'Tworzę aplikacje webowe, które obsługują konkretny proces: panel klienta, rezerwacje, katalog danych lub pracę zespołu. Współpraca obejmuje projekt interfejsu i uzgodnioną logikę systemu, zdalnie dla firm z całego regionu.',
    sections: [
      {
        title: 'Opis procesu jest podstawą aplikacji',
        paragraphs: [
          'Zanim wybierzemy funkcje, opisujemy role użytkowników, dane i kolejne kroki pracy. Warto wskazać, gdzie dziś powstają opóźnienia, co jest przepisywane ręcznie i jakie informacje są potrzebne do podjęcia decyzji. Z tego opisu powstaje zakres pierwszej wersji.',
          'Makiety pomagają sprawdzić scenariusze jeszcze przed implementacją. Rozmawiamy o widokach, uprawnieniach, komunikatach i nietypowych sytuacjach. Aplikacja nie powinna tylko odtwarzać arkusza w przeglądarce; jej zadaniem jest pomóc użytkownikowi wykonać konkretną pracę.',
        ],
        items: [
          'Role, logowanie i zakres dostępu do danych.',
          'Interfejs dopasowany do najważniejszych scenariuszy.',
          'Logika systemu, baza danych i uzgodnione integracje API.',
        ],
      },
      {
        title: 'Pierwsza wersja, która daje się sprawdzić',
        paragraphs: [
          'Zakres MVP powinien obejmować kompletny, użyteczny fragment procesu. Rozdzielamy rzeczy niezbędne od funkcji, które mogą poczekać. Dzięki temu łatwiej ocenić koszt, czas i wynik pierwszego wdrożenia. Rozbudowa wynika później z doświadczeń osób korzystających z narzędzia.',
          'Przed uruchomieniem sprawdzam autoryzację, walidację danych i istotne scenariusze błędów. Ustalamy też środowisko, przechowywanie informacji oraz sposób wykonywania kopii zapasowych. Integracje wymagają dostępu do dokumentacji i odpowiednich uprawnień; ich możliwość potwierdzamy przed obietnicą automatyzacji.',
        ],
      },
    ],
    outcomes: [
      ['Jasny zakres MVP', 'Pierwsza wersja obsługuje ustalony proces od początku do końca.'],
      ['Przemyślane role', 'Użytkownik dostaje informacje i działania zgodne ze swoim zadaniem.'],
      [
        'Kontrola nad rozwojem',
        'Nowe funkcje można oceniać w kontekście istniejącej architektury.',
      ],
    ],
    faq: [
      [
        'Czym aplikacja różni się od strony?',
        'Strona głównie prezentuje informacje. Aplikacja obsługuje działania użytkowników, dane i reguły procesu, np. rezerwacje lub pracę w panelu.',
      ],
      [
        'Czy można wykorzystać istniejące API?',
        'Tak, po sprawdzeniu dokumentacji, limitów, uprawnień i sposobu obsługi błędów.',
      ],
      [
        'Czy dostanę harmonogram rozwoju?',
        'Harmonogram i etapy są częścią ustalonego zakresu. Kolejne wersje planujemy na podstawie potrzeb i informacji od użytkowników.',
      ],
    ],
  },
  {
    slug: 'projektowanie-ui-ux',
    name: 'Design i identyfikacja',
    title: 'Projektowanie UI/UX i identyfikacji',
    description:
      'Projektowanie interfejsów, logo i spójnej identyfikacji wizualnej. Makoto pomaga firmom z Kujawsko-Pomorskiego połączyć charakter marki z użytecznością.',
    project: 'landing',
    lead: 'Projektuję interfejsy i identyfikacje wizualne dla marek z województwa kujawsko-pomorskiego. Łączę strukturę informacji z typografią, kolorem i systemem komponentów, tak aby projekt można było konsekwentnie wdrożyć i rozwijać.',
    sections: [
      {
        title: 'Co sprawia, że projekt jest spójny?',
        paragraphs: [
          'Spójność zaczyna się od kilku uzgodnionych zasad: stylu komunikacji, typografii, palety i hierarchii informacji. Logo pozostaje czytelne i zgodne z Twoją marką. Kolejne elementy nie powinny przypadkowo zmieniać kształtu lub proporcji tylko dlatego, że powstały na innej podstronie.',
          'Przygotowuję komponenty oraz tokeny odpowiadające za kolory, odstępy, promienie i stany interakcji. Dzięki temu przycisk, formularz i karta są częścią jednego systemu. Różnice mają konkretny cel, np. odróżnienie funkcji głównego przycisku od znacznika statusu.',
        ],
        items: [
          'Kierunek wizualny i makiety najważniejszych ekranów.',
          'Zasady użycia logo, kolorów oraz typografii.',
          'Komponenty i stany potrzebne do wdrożenia interfejsu.',
        ],
      },
      {
        title: 'Interfejs oceniamy w rzeczywistym scenariuszu',
        paragraphs: [
          'Projekt sprawdzamy na konkretnych zadaniach: odnalezieniu usługi, przejściu do kontaktu lub edycji danych w panelu. Ważne są etykiety, informacja o błędzie i reakcja po wykonaniu działania. Dobre makiety powinny pokazywać również stany puste, ładowanie i potwierdzenie zapisu.',
          'Jeżeli masz istniejącą markę, pracuję na jej materiałach zamiast zastępować logo przypadkowym znakiem. Zakres odświeżenia ustalamy osobno od projektu strony. Wdrożenie może być kolejnym etapem albo częścią tej samej współpracy.',
        ],
      },
    ],
    outcomes: [
      [
        'Rozpoznawalna marka',
        'Projekt wykorzystuje uzgodnione materiały i charakter Twojej firmy.',
      ],
      ['Jeden system', 'Typografia, odstępy i komponenty mają konsekwentne reguły.'],
      ['Czytelne działania', 'Użytkownik rozumie kolejne kroki, potwierdzenia i komunikaty.'],
    ],
    faq: [
      [
        'Czy muszę zmieniać obecne logo?',
        'Nie. Jeśli logo odpowiada marce i masz potrzebne pliki, wykorzystuję je w projekcie. Ewentualne zmiany uzgadniamy osobno.',
      ],
      [
        'Czy otrzymam projekt w Figma?',
        'Zakres przekazywanych makiet i komponentów ustalamy na początku współpracy.',
      ],
      [
        'Czy można zamówić sam projekt interfejsu?',
        'Tak. Wyceniamy wtedy projekt oraz materiały potrzebne do późniejszego wdrożenia.',
      ],
    ],
  },
  {
    slug: 'seo-techniczne',
    name: 'SEO techniczne i GEO',
    title: 'SEO techniczne i GEO dla stron',
    description:
      'SEO techniczne i przygotowanie treści dla wyszukiwarek AI. Makoto: indeksowanie, dane firmy, schema i migracje stron w Kujawsko-Pomorskiem.',
    lead: 'Pomagam uporządkować techniczne SEO oraz treści potrzebne do zrozumienia strony przez wyszukiwarki i systemy AI. Sprawdzam dostępność HTML, adresy, indeksowanie, dane strukturalne i zgodność informacji o firmie.',
    sections: [
      {
        title: 'Co obejmuje optymalizacja techniczna?',
        paragraphs: [
          'Sprawdzamy, które strony powinny być indeksowane i czy roboty otrzymują ich właściwą treść. Porządkuję metadane, canonical, przekierowania i mapę witryny. Panel administratora, dane zgłoszeń oraz szkice pozostają poza publicznym indeksem.',
          'W lokalnym SEO ważna jest zgodność nazwy, adresu i telefonu z rzeczywistą działalnością. Dane strukturalne powinny odzwierciedlać widoczne informacje, a podstrony miast przedstawiać odrębne, przydatne materiały. Rozbudowa serwisu ma wspierać decyzję klienta, nie tylko zwiększać liczbę adresów.',
        ],
        items: [
          'Przegląd indeksowania, metadanych i przekierowań.',
          'Spójne dane firmy oraz znaczniki opisujące stronę i usługi.',
          'Ocena widoków mobilnych, dostępności treści i kosztu ładowania.',
        ],
      },
      {
        title: 'Jak przygotować stronę pod wyszukiwarki AI?',
        paragraphs: [
          'Ważne informacje powinny być dostępne w tekście i dawać się zrozumieć bez kontekstu całej strony. Przygotowuję krótkie odpowiedzi, precyzyjne opisy usług i linki do źródeł tam, gdzie są potrzebne. Autor, kontakt, cena i warunki współpracy pomagają ocenić wiarygodność materiału.',
          'Google wskazuje, że podstawy SEO pozostają właściwe również dla AI Overviews i AI Mode. Dostęp crawlerów oraz dodatkowe pliki z publicznym opisem serwisu mogą ułatwiać pobranie informacji, ale nie gwarantują cytowania. Widoczność oceniamy na rzeczywistych danych po publikacji, nie na deklarowanym wyniku gotowości.',
        ],
      },
    ],
    outcomes: [
      ['Dostępne treści', 'Wyszukiwarka otrzymuje informacje już w HTML z serwera.'],
      ['Spójne dane', 'Kontakt, usługi i obszar działania zgadzają się w treści oraz znacznikach.'],
      [
        'Uczciwa ocena',
        'Zmiany opisuję z ich zakresem i ograniczeniami, bez obietnicy pierwszej pozycji.',
      ],
    ],
    faq: [
      [
        'Czy llms.txt jest wymagany przez Google?',
        'Nie. Google nie wymaga specjalnych plików AI ani osobnego rodzaju schema, żeby treść mogła pojawić się w funkcjach generatywnych.',
      ],
      [
        'Czy zapewniasz pierwsze miejsce w Google?',
        'Nie. Wynik zależy od wielu czynników, m.in. konkurencji, treści i reputacji. Mogę wdrożyć uzgodnione usprawnienia i pomóc mierzyć ich efekty.',
      ],
      [
        'Jak mierzyć wyniki?',
        'Po wdrożeniu korzysta się m.in. z Search Console, Bing Webmaster Tools oraz rzeczywistych zgłoszeń. Dostęp do tych kont wymaga podłączenia przez właściciela.',
      ],
    ],
  },
  {
    slug: 'opieka-techniczna',
    name: 'Opieka techniczna',
    title: 'Opieka techniczna nad stroną',
    description:
      'Aktualizacje, kopie zapasowe i rozwój strony. Opieka Makoto dla firm z Kujawsko-Pomorskiego: uzgodniony zakres wsparcia i kontrola wdrożeń.',
    monthlyId: 'care',
    lead: 'Opieka techniczna pomaga utrzymać działającą stronę po wdrożeniu. Ustalam zakres aktualizacji, kopii zapasowych i wsparcia dla konkretnego serwisu oraz środowiska, z którego korzysta Twoja firma.',
    sections: [
      {
        title: 'Zakres wsparcia musi być konkretny',
        paragraphs: [
          'Przed rozpoczęciem opieki sprawdzam technologię, hosting, dostępne uprawnienia i sposób wykonywania kopii danych. Innego zakresu wymaga prosta witryna, a innego sklep lub aplikacja z kontami użytkowników. Ustalamy, jakie czynności są regularne, a jakie wymagają osobnej wyceny.',
          'Aktualizacja zależności powinna uwzględniać sposób działania serwisu. Ważne jest przygotowanie kopii i sprawdzenie istotnych scenariuszy po zmianie. Przy stronie z formularzem weryfikujemy zapis zgłoszenia; przy sklepie również uzgodnioną ścieżkę zamówienia.',
        ],
        items: [
          'Uzgodnione aktualizacje i sprawdzanie zmian po wdrożeniu.',
          'Zakres kopii zapasowych oraz plan odtworzenia danych.',
          'Kanał kontaktu i zasady obsługi zgłoszeń technicznych.',
        ],
      },
      {
        title: 'Rozwój strony to osobny plan',
        paragraphs: [
          'Nowy artykuł, integracja, przebudowa sekcji i usunięcie błędu nie mają takiego samego zakresu. Rozdzielamy obsługę techniczną od rozwoju produktu. Dzięki temu wiadomo, jakie działania obejmuje abonament i kiedy przygotować dodatkową wycenę.',
          'Jeżeli przejmuję istniejący serwis, potrzebuję jego dokumentacji i odpowiednich dostępów. Nie obiecuję całodobowej obsługi ani konkretnego czasu reakcji bez uzgodnionych warunków. Współpraca opiera się na zakresie dopasowanym do znaczenia strony dla Twojej działalności.',
        ],
      },
    ],
    outcomes: [
      ['Jasne ustalenia', 'Wiesz, jakie czynności obejmuje opieka i jak zgłaszać potrzeby.'],
      ['Kopie i odtwarzanie', 'Zakres zabezpieczenia danych odpowiada używanemu środowisku.'],
      [
        'Kontrolowane zmiany',
        'Aktualizacje i rozwój przechodzą przez uzgodnioną ścieżkę sprawdzenia.',
      ],
    ],
    faq: [
      [
        'Czy opieka obejmuje hosting?',
        'Zakres hostingu i opieki ustalamy indywidualnie. Koszty zewnętrznych usług powinny być wyraźnie oddzielone w ofercie.',
      ],
      [
        'Czy możesz przejąć istniejącą stronę?',
        'Po sprawdzeniu technologii, dokumentacji i dostępów oceniam możliwość oraz zakres wsparcia.',
      ],
      [
        'Czy pakiet oznacza pomoc przez całą dobę?',
        'Nie. Dostępność i czasy reakcji wymagają osobnych ustaleń. Samo wskazanie abonamentu nie jest deklaracją całodobowego wsparcia.',
      ],
    ],
  },
]
export const servicePath = (slug: string) => `/uslugi/${slug}`
