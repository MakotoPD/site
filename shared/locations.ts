export interface LocalSection {
  title: string
  paragraphs: string[]
  items?: string[]
}
export interface LocationPage {
  slug: string
  name: string
  genitive: string
  title: string
  description: string
  kicker: string
  lead: string
  introduction: string[]
  sections: LocalSection[]
  brief: string[]
  faq: [string, string][]
  source: { title: string; url: string; context: string }
}
export const locations: LocationPage[] = [
  {
    slug: 'inowroclaw',
    name: 'Inowrocław',
    genitive: 'Inowrocławia',
    title: 'Strony internetowe Inowrocław – tworzenie stron WWW',
    description:
      'Strony internetowe Inowrocław: autorski projekt UI/UX, Nuxt, blog i wdrożenie. Sprawdź zakres, realizacje i orientacyjną wycenę w Makoto.',
    kicker: 'Blisko Twojej firmy. Od pierwszej rozmowy.',
    lead: 'Projektuję strony internetowe dla firm z Inowrocławia: od czytelnej oferty usług po serwis z blogiem i formularzami. Pod marką Makoto pracuję jako Patryk Dąbrowski, łącząc projektowanie interfejsu z wdrożeniem w Nuxt.',
    introduction: [
      'Dobra strona lokalnej firmy odpowiada na pytania, które klient zadaje przed kontaktem: czym się zajmujesz, dla kogo pracujesz, gdzie działasz i jak zamówić usługę. Dla przedsiębiorcy z Inowrocławia projektuję te informacje jako jedną, uporządkowaną ścieżkę. Oferta, przykłady realizacji i kontakt powinny być łatwe do znalezienia również na telefonie.',
      'Makoto ma adres w Inowrocławiu. Zakres projektu ustalamy bezpośrednio: rozmawiasz z osobą, która przygotowuje makiety i pisze kod. Możemy pracować zdalnie, przekazując materiały i uwagi do kolejnych etapów. Przed rozpoczęciem otrzymujesz opis funkcji, budżet oraz harmonogram dopasowany do Twoich treści.',
    ],
    sections: [
      {
        title: 'Strona, która ułatwia pierwszy kontakt',
        paragraphs: [
          'Przy usługach świadczonych w mieście szczególnie ważna jest konkretna informacja o obszarze działania. Jeśli obsługujesz też okolice Inowrocławia, pokazujemy rzeczywisty zakres dojazdu i warunki ustalenia terminu. Formularz może pytać o miejscowość i rodzaj zlecenia, dzięki czemu pierwsza odpowiedź jest bardziej rzeczowa.',
          'W przypadku noclegów, gastronomii lub usług dla odwiedzających Solanki warto rozdzielić informacje dla mieszkańca i osoby planującej przyjazd. Projektuję czytelne opisy, dojazd, fotografie oraz kontakt. Rezerwacje i wersje językowe wyceniamy jako konkretne funkcje, zależnie od wybranego sposobu obsługi.',
        ],
        items: [
          'Oferta podzielona według rzeczywistych usług i potrzeb klientów.',
          'Adres, telefon i link do Twojego prawdziwego profilu Google.',
          'Formularz z informacjami potrzebnymi do przygotowania odpowiedzi.',
        ],
      },
      {
        title: 'Widoczność oparta na faktach o firmie',
        paragraphs: [
          'Podstawy lokalnego SEO obejmują spójne dane kontaktowe, opis usług, poprawne adresy stron i treści dostępne bez uruchamiania JavaScript. Na stronie pokazujemy wyłącznie potwierdzone informacje o działalności. Realizacje, opinie i obszary obsługi dodajemy zgodnie z faktyczną pracą firmy.',
          'Dla marki rozwijającej się w Inowrocławiu pomocne może być uporządkowanie istniejącej wizytówki i odnośników z lokalnych serwisów. Projekt strony przygotowuję tak, żeby dało się go rozwijać o kolejne realizacje, poradniki i odpowiedzi na pytania. Pozycja w Google zależy również od konkurencji, reputacji oraz działań poza samą stroną.',
        ],
      },
    ],
    brief: [
      'Podaj usługi, które klienci z Inowrocławia zamawiają najczęściej.',
      'Opisz, czy klient przychodzi do Twojej firmy, czy Ty do niego dojeżdżasz.',
      'Przygotuj aktualny telefon, adres, godziny kontaktu i fotografie swojej pracy.',
      'Zdecyduj, czy potrzebujesz tylko zapytań, czy także rezerwacji lub płatności.',
    ],
    faq: [
      [
        'Czy Makoto działa w Inowrocławiu?',
        'Tak. Publiczny adres Makoto w Profilu Firmy w Google znajduje się w Inowrocławiu. Aktualne dane kontaktowe pokazuję na tej stronie. Sposób spotkania i pracy nad projektem ustalamy wcześniej.',
      ],
      [
        'Czy strona może obsługiwać klientów przyjeżdżających do Solanek?',
        'Tak. Możemy zaprojektować osobną prezentację pobytu lub usługi, wskazówki dojazdu i formularz zapytania. Treści oraz fotografie powinny odnosić się do Twojej konkretnej oferty.',
      ],
      [
        'Czy poprawisz dane firmy na mojej stronie?',
        'W ramach ustalonego zakresu porządkuję adres, telefon, ofertę i link do profilu Google. Edycja samego profilu wymaga dostępu właściciela i osobnego uzgodnienia.',
      ],
    ],
    source: {
      title: 'Urząd Miasta Inowrocławia: Kujawsko-Pomorskie Uzdrowiska',
      url: 'https://www.inowroclaw.pl/strona-3741-iit_kujawsko_pomorskie_uzdrowiska.html',
      context:
        'Inowrocław uczestniczy w inicjatywie Kujawsko-Pomorskie Uzdrowiska. To kontekst dla firm obsługujących gości miasta; przedstawione wyżej funkcje strony są propozycjami projektowymi.',
    },
  },
  {
    slug: 'torun',
    name: 'Toruń',
    genitive: 'Torunia',
    title: 'Strony internetowe Toruń – tworzenie stron WWW',
    description:
      'Strony internetowe Toruń: autorski projekt, responsywność, CMS i formularze. Poznaj proces, portfolio i możliwość wyceny w Makoto.',
    kicker: 'Twoja oferta, dla mieszkańców i odwiedzających.',
    lead: 'Tworzę strony internetowe dla firm i organizacji z Torunia. Projekt może obejmować prezentację usług, ofertę dla odwiedzających miasto, wydarzenia albo sklep. Zaczynam od odbiorców i treści, a następnie projektuję oraz wdrażam serwis.',
    introduction: [
      'Firma w Toruniu może kierować ofertę do różnych odbiorców: stałych klientów z regionu, gości przyjeżdżających do miasta albo partnerów biznesowych z całej Polski. Na etapie briefu ustalamy, która grupa jest najważniejsza. Dzięki temu układ strony nie próbuje mówić o wszystkim naraz, a najważniejsza oferta ma czytelne miejsce.',
      'Współpracę z Makoto możesz przeprowadzić zdalnie. Materiały zbieramy w uzgodniony sposób, makiety oglądasz przed wdrożeniem, a uwagi przekazujesz do konkretnego etapu. Potwierdzamy też osobę odpowiedzialną za treści i terminy ich dostarczenia. To szczególnie przydatne, kiedy uruchomienie strony ma być związane z sezonem albo wydarzeniem.',
    ],
    sections: [
      {
        title: 'Informacje, które pomagają zaplanować wizytę',
        paragraphs: [
          'Toruński zespół staromiejski znajduje się na liście UNESCO. Dla restauracji, noclegu lub organizatora doświadczeń turystycznych oznacza to sensowny kontekst do planowania informacji dla gościa. Strona może pokazywać autentyczne zdjęcia, sposób dotarcia, warunki skorzystania z oferty i odpowiedzi na pytania przed rezerwacją.',
          'Jeżeli odbiorcy korzystają z różnych języków, projektuję przejrzystą nawigację między wersjami i osobne adresy treści. Tłumaczenie oferty wymaga spójnych opisów, cen oraz zasad kontaktu. Sam automatyczny przycisk zmiany języka nie zastępuje przygotowania materiałów. Wersje językowe ustalamy jako element zakresu projektu.',
        ],
        items: [
          'Dojazd, kontakt i warunki rezerwacji dostępne na telefonie.',
          'Oddzielne informacje o wydarzeniu, jego terminie i zapisach.',
          'Spójne wersje językowe dla rzeczywistych grup odbiorców.',
        ],
      },
      {
        title: 'Treści, które zespół może aktualizować',
        paragraphs: [
          'Menu, oferta sezonowa, program wydarzenia i aktualności powinny być możliwe do zmiany po wdrożeniu. Mogę przygotować panel CMS z konkretnymi polami zamiast edytora, który pozwala przypadkiem rozbić układ strony. Ustalamy również, kto publikuje materiał i czy potrzebuje najpierw zapisać szkic.',
          'Dla firmy usługowej ważniejsze mogą być rozbudowane opisy specjalizacji i formularz kwalifikujący zapytanie. W obu przypadkach buduję strukturę pod wybrany cel. Wspólnie określamy, jakie treści pomagają klientowi podjąć decyzję, i które informacje faktycznie wyróżniają Twoją ofertę w Toruniu.',
        ],
      },
    ],
    brief: [
      'Określ, czy strona ma obsługiwać mieszkańców, turystów, uczestników wydarzeń czy partnerów B2B.',
      'Wskaż języki, w których możesz obsługiwać zapytania i utrzymywać aktualne treści.',
      'Przygotuj materiały do rezerwacji: warunki, terminy, cennik i docelowy kanał kontaktu.',
      'Ustal, kto będzie zmieniał ofertę sezonową oraz publikował aktualności.',
    ],
    faq: [
      [
        'Czy przygotujesz stronę toruńskiego wydarzenia?',
        'Mogę zaprojektować serwis z programem, prelegentami, dojazdem i formularzem zapisów. Sprzedaż biletów lub połączenie z zewnętrznym systemem ustalamy osobno w zakresie integracji.',
      ],
      [
        'Czy można dodać polską i angielską wersję oferty?',
        'Tak. Wycena uwzględni dodatkową wersję językową oraz sposób zarządzania tłumaczeniami. Teksty dostarczasz albo uzgadniamy ich przygotowanie.',
      ],
      [
        'Czy muszę przyjechać do Inowrocławia?',
        'Nie. Rozmowę, akceptację makiet i odbiór strony możemy przeprowadzić online. Na tej podstronie przedstawiam ofertę obsługi Torunia.',
      ],
    ],
    source: {
      title: 'Urząd Miasta Torunia: Toruń na liście UNESCO',
      url: 'https://www.torun.pl/pl/torun-na-liscie-unesco',
      context:
        'Oficjalny portal Torunia udostępnia informacje o mieście i jego dziedzictwie UNESCO. Potrzeby gości i mieszkańców warto uwzględnić w briefie; nie oznacza to, że każda toruńska firma potrzebuje strony turystycznej.',
    },
  },
  {
    slug: 'bydgoszcz',
    name: 'Bydgoszcz',
    genitive: 'Bydgoszczy',
    title: 'Strony internetowe Bydgoszcz – tworzenie stron WWW',
    description:
      'Strony internetowe Bydgoszcz: tworzenie serwisów firmowych, CMS, katalogów B2B i formularzy. Poznaj zakres, proces i wycenę w Makoto.',
    kicker: 'Czytelna oferta. Sprawniejsza obsługa zapytań.',
    lead: 'Projektuję strony internetowe dla firm z Bydgoszczy, które chcą jasno przedstawić ofertę i usprawnić kontakt z klientem. Serwis może łączyć usługi, realizacje, materiały do pobrania oraz formularz dopasowany do procesu sprzedaży.',
    introduction: [
      'Bydgoszcz jest przedstawiana przez oficjalny serwis miasta jako ośrodek usług biznesowych. Dla firmy B2B strona często jest miejscem pierwszej oceny kompetencji: klient sprawdza zakres usług, realizacje, sposób pracy i dostępne materiały. Projektuję te elementy tak, żeby wspierały rozmowę o konkretnej potrzebie, a nie wymagały szukania podstawowych informacji.',
      'Przed wdrożeniem ustalamy, jak wygląda obsługa zapytania w Twoim zespole. Inny formularz sprawdzi się przy zamówieniu pojedynczej usługi, a inny przy projekcie wymagającym parametrów technicznych. Dzięki pracy nad strukturą można ograniczyć liczbę wiadomości potrzebnych do zebrania podstawowych danych.',
    ],
    sections: [
      {
        title: 'Serwis B2B, który porządkuje ofertę',
        paragraphs: [
          'Jeśli działasz w kilku specjalizacjach, rozdzielamy je według potrzeb odbiorcy. Każda podstrona powinna wyjaśniać, kiedy dana usługa ma zastosowanie, jakie materiały są potrzebne i co klient otrzymuje. Dołączamy potwierdzone przykłady pracy, bez przypisywania fikcyjnych wyników biznesowych.',
          'Katalog produktów lub rozwiązań może wymagać filtrów, specyfikacji, dokumentów do pobrania i formularza zapytania o konkretną pozycję. Taką stronę projektuję inaczej niż sklep z płatnością online. Na etapie wyceny rozstrzygamy, czy użytkownik ma kupić, wysłać parametry, zamówić konsultację czy poprosić o indywidualną ofertę.',
        ],
        items: [
          'Osobne ścieżki dla różnych grup klientów i specjalizacji.',
          'Materiały oraz specyfikacje połączone z właściwą ofertą.',
          'Formularz zbierający parametry potrzebne do kolejnego kroku.',
        ],
      },
      {
        title: 'Integracje dopasowane do codziennej pracy',
        paragraphs: [
          'Kiedy zapytania trafiają już do CRM lub innego narzędzia, możemy rozważyć połączenie strony z tym procesem. Najpierw sprawdzamy dostępne API, wymagane pola i zasady dostępu. Integracja ma ograniczyć ręczne przepisywanie danych oraz zachować kontrolę nad tym, gdzie trafiają informacje klienta.',
          'Makoto prowadzi projekty dla Bydgoszczy zdalnie: omawiamy brief, przygotowuję makiety, wdrażam zaakceptowaną wersję i pokazuję panel. Przed publikacją testujemy nie tylko wygląd, ale również najważniejsze scenariusze: wysłanie zapytania, wybór pozycji w katalogu i odnalezienie dokumentu na telefonie.',
        ],
      },
    ],
    brief: [
      'Narysuj prostą ścieżkę od zapytania do oferty w Twojej bydgoskiej firmie.',
      'Przygotuj podział usług, specyfikacje oraz rzeczywiste przykłady realizacji.',
      'Podaj narzędzia, do których obecnie trafiają dane: CRM, poczta lub system zamówień.',
      'Wskaż, jakie parametry musi podać klient, żeby zespół mógł przygotować odpowiedź.',
    ],
    faq: [
      [
        'Czy katalog B2B musi być sklepem?',
        'Nie. Katalog może prezentować rozwiązania i zbierać zapytania zamiast przyjmować płatność. Wybór zależy od sposobu wyceny i sprzedaży w Twojej firmie.',
      ],
      [
        'Czy połączysz formularz z CRM?',
        'Po sprawdzeniu dokumentacji i uprawnień API ustalam zakres integracji. Nie każda usługa umożliwia identyczną automatyzację, dlatego potwierdzamy to przed wdrożeniem.',
      ],
      [
        'Czy mogę mieć różne formularze dla działów firmy?',
        'Tak. Możemy dopasować pola do danej usługi i ustalić sposób przekazywania zgłoszeń. Liczba ścieżek i integracji będzie częścią wyceny.',
      ],
    ],
    source: {
      title: 'Oficjalny Serwis Bydgoszczy: biznesowe centrum miasta',
      url: 'https://www.bydgoszcz.pl/aktualnosci/tresc/bydgoszcz-waznym-biznesowym-centrum/',
      context:
        'Miasto opisuje sektor usług biznesowych i rolę Bydgoskiej Agencji Rozwoju Regionalnego. Proponowane tutaj katalogi, formularze i integracje to przykłady zakresu strony B2B, dobieranego do konkretnej firmy.',
    },
  },
  {
    slug: 'grudziadz',
    name: 'Grudziądz',
    genitive: 'Grudziądza',
    title: 'Strony internetowe Grudziądz – tworzenie stron WWW',
    description:
      'Strony internetowe Grudziądz: tworzenie stron dla firm, od zapytań o usługę po ofertę wydarzeń i sklep. Poznaj zakres, proces i wycenę Makoto.',
    kicker: 'Od lokalnej usługi do własnego kanału sprzedaży.',
    lead: 'Tworzę strony dla firm i organizacji z Grudziądza, które chcą uporządkować ofertę, zbierać lepsze zapytania albo rozwijać własny kanał sprzedaży. Projekt obejmuje autorski interfejs, wdrożenie i sprawdzenie działania na urządzeniach mobilnych.',
    introduction: [
      'Dla lokalnego usługodawcy ważne jest, żeby klient szybko rozpoznał zakres pracy, zobaczył przykłady i wiedział, o co zapytać. Na stronie firmy obsługującej Grudziądz oraz okoliczne miejscowości możemy opisać dojazd i przygotować formularz z miejscem realizacji zlecenia. To ułatwia ocenę zapytania przed rozmową.',
      'Jeśli Twoja oferta opiera się na produkcie, wydarzeniu lub aktywności dla odwiedzających miasto, projekt zaczyna się od innych pytań: jak klient wybiera wariant, sprawdza termin i finalizuje zamówienie. Nie mieszamy tych ścieżek w jednym uniwersalnym formularzu. Najpierw ustalamy cel, a dopiero potem dobieramy funkcje.',
    ],
    sections: [
      {
        title: 'Wydarzenia, terminy i oferta na telefonie',
        paragraphs: [
          'Informacja Turystyczna Grudziądz publikuje wydarzenia i prowadzi internetowy sklep z pamiątkami. Pokazuje to dwa różne sposoby korzystania z lokalnej oferty online: zaplanowanie udziału oraz zakup produktu. Przy własnej stronie warto jasno ustalić, który z tych scenariuszy ma być najważniejszy dla odwiedzającego.',
          'Serwis wydarzenia może zawierać program, zapisy, zasady udziału i wskazówki dotarcia. Sklep potrzebuje natomiast kart produktów, koszyka, dostawy i obsługi zamówień. W obu przypadkach pilnuję, żeby podstawowe informacje były czytelne na małym ekranie. Zdjęcia i opisy powinny odnosić się do Twoich faktycznych produktów lub organizowanej aktywności.',
        ],
        items: [
          'Program i informacje organizacyjne bez konieczności szukania w mediach społecznościowych.',
          'Opis wariantów produktu oraz warunków dostawy i odbioru.',
          'Aktualizacja terminów lub oferty z uzgodnionego panelu.',
        ],
      },
      {
        title: 'Lokalne zapytanie z potrzebnym kontekstem',
        paragraphs: [
          'Dla firmy usługowej mogę zaprojektować formularz, który zbiera rodzaj pracy, miejscowość i oczekiwany termin. Przy bardziej złożonych usługach ustalamy dodatkowe parametry. Dzięki temu strona staje się częścią procesu kontaktu, a nie tylko miejscem wyświetlania numeru telefonu.',
          'Współpraca z Makoto nie wymaga dojazdu na każdy etap projektu. Makiety omawiamy online, treści przekazujesz w ustalonej formie, a po wdrożeniu sprawdzamy wspólnie działanie. Budżet obejmuje uzgodniony zakres; opiekę, rozwój oferty i dodatkowe integracje określamy osobno.',
        ],
      },
    ],
    brief: [
      'Wybierz główny cel: zapytania o usługę, zapisy na wydarzenie lub zakup produktu.',
      'Opisz, czy klient potrzebuje dojazdu w Grudziądzu, odbioru osobistego czy dostawy.',
      'Zbierz fotografie realizacji lub produktów i sprawdź prawa do ich publikacji.',
      'Przygotuj parametry, które wpływają na termin i wycenę usługi.',
    ],
    faq: [
      [
        'Czy przygotujesz formularz dla usługi z dojazdem?',
        'Tak. Możemy zbierać miejscowość, zakres zlecenia i preferowany termin. Informacje o obsługiwanym terenie powinny odpowiadać rzeczywistym możliwościom firmy.',
      ],
      [
        'Czy stronę wydarzenia da się później wykorzystać ponownie?',
        'Możemy zaprojektować CMS z edycją programu, dat i materiałów. Kolejną edycję wydarzenia uwzględniamy już podczas ustalania struktury.',
      ],
      [
        'Czy sprzedaż online jest potrzebna od pierwszego dnia?',
        'Nie zawsze. Można rozpocząć od uporządkowanej oferty i formularza, a wdrożenie sklepu zaplanować jako kolejny etap, jeśli odpowiada to Twojemu procesowi sprzedaży.',
      ],
    ],
    source: {
      title: 'Informacja Turystyczna Grudziądz: wydarzenia i sklep',
      url: 'https://itgrudziadz.pl/',
      context:
        'Oficjalna Informacja Turystyczna pokazuje wydarzenia i sklep z pamiątkami. Powyższe scenariusze służą przygotowaniu briefu; nie są opisem realizacji Makoto ani współpracy z tą instytucją.',
    },
  },
  {
    slug: 'wloclawek',
    name: 'Włocławek',
    genitive: 'Włocławka',
    title: 'Strony internetowe Włocławek – tworzenie stron WWW',
    description:
      'Strony internetowe Włocławek: nowe strony i przebudowa serwisów firm. Oferta, katalog, CMS i bezpieczne przeniesienie treści. Sprawdź budżet.',
    kicker: 'Nowy wizerunek. Uporządkowane treści.',
    lead: 'Projektuję nowe strony i przebudowuję serwisy firm z Włocławka. Pomagam ułożyć ofertę, przygotować czytelny interfejs oraz przenieść potrzebne treści do nowego wdrożenia. Najważniejszy jest cel strony i sposób korzystania z niej przez klienta.',
    introduction: [
      'Przebudowa istniejącej strony zaczyna się od tego, co warto zachować: opisów usług, adresów popularnych podstron, zdjęć i materiałów. Samo odświeżenie pierwszego ekranu nie rozwiąże problemu nieaktualnej oferty. Sprawdzamy, jakie pytania wracają w rozmowach z klientami i których odpowiedzi brakuje w serwisie.',
      'Dla firmy z Włocławka nowa witryna może porządkować kilka elementów naraz: prezentację marki, katalog usług oraz kontakt z odbiorcami spoza miasta. Rozdzielam ten zakres na etapy. Najpierw przygotowujemy strukturę i treści, potem projekt wizualny, a na końcu wdrożenie i przekierowania potrzebnych adresów.',
    ],
    sections: [
      {
        title: 'Przebudowa bez gubienia potrzebnych materiałów',
        paragraphs: [
          'Jeżeli Twoja strona działa już od kilku lat, lista jej adresów jest ważnym materiałem do briefu. Ustalamy, które podstrony mają odpowiedniki w nowym serwisie, gdzie potrzebne jest przekierowanie i co rzeczywiście jest nieaktualne. Dzięki temu plan przeniesienia nie sprowadza się do zastąpienia całego serwisu pojedynczą stroną główną.',
          'Katalog usług lub produktów może korzystać z nowej struktury kategorii, ale powinien zachować czytelne nazwy i informacje przydatne odbiorcy. Projektuję układ, który pozwala klientowi zrozumieć różnice między wariantami. Materiały techniczne i zdjęcia łączymy z właściwymi pozycjami, zamiast tworzyć jeden nieuporządkowany katalog plików.',
        ],
        items: [
          'Lista dotychczasowych adresów oraz plan ich zachowania lub przekierowania.',
          'Spójne opisy usług, produktów i materiałów do pobrania.',
          'CMS z edycją tych informacji, które firma zmienia najczęściej.',
        ],
      },
      {
        title: 'Spójna marka w różnych miejscach internetu',
        paragraphs: [
          'Włocławek prowadzi komunikację wokół własnej identyfikacji wizualnej oraz rozwoju miasta. Dla przedsiębiorcy praktyczny wniosek jest prosty: logo, nazwa, oferta i dane kontaktowe powinny być rozpoznawalne również poza firmową stroną. W projekcie dopracowuję typografię, kolory, sposób prezentacji realizacji i powtarzalne elementy interfejsu.',
          'Tożsamość marki łączę z techniczną stroną wdrożenia. Serwis ma poprawne metadane, czytelne linki, układ na telefon i treści dostępne w HTML. Możemy też uporządkować podgląd strony przy udostępnianiu linku. Nie przypisuję jednak stronie gwarantowanych pozycji ani wyników, których nie da się potwierdzić.',
        ],
      },
    ],
    brief: [
      'Przekaż adres obecnej strony i listę treści, które trzeba zachować.',
      'Wskaż usługi lub produkty, których klient nie potrafi dziś znaleźć.',
      'Przygotuj aktualne logo i materiały, które mają pozostać częścią wizerunku.',
      'Ustal, kto po wdrożeniu aktualizuje katalog, realizacje i dane kontaktowe.',
    ],
    faq: [
      [
        'Czy przeniesiesz treści z mojej starej strony?',
        'Po ustaleniu zakresu przygotowuję plan przeniesienia treści i adresów. Dostęp do obecnego CMS lub eksport materiałów ułatwia ocenę prac.',
      ],
      [
        'Czy nowa strona zachowa dotychczasowe adresy?',
        'Tam, gdzie mają sens, możemy je zachować. Dla zmienionych adresów przygotowuję mapę przekierowań do odpowiednich nowych podstron. Nie gwarantuje to niezmiennych pozycji w wyszukiwarce.',
      ],
      [
        'Czy można zacząć od uporządkowania identyfikacji?',
        'Tak. Jeśli logo, typografia i materiały są niespójne, kierunek wizualny warto ustalić przed makietami. Zakres prac nad marką wyceniamy osobno.',
      ],
    ],
    source: {
      title: 'Urząd Miasta Włocławek: system identyfikacji wizualnej',
      url: 'https://wof.wloclawek.eu/strona-4676-system_identyfikacji_wizualnej.html',
      context:
        'Oficjalny materiał opisuje spójną identyfikację Włocławka. Zasady przygotowania firmowej strony oraz migracji treści są propozycjami Makoto, nie opisem współpracy z urzędem.',
    },
  },
]
export const localPath = (slug: string) => `/strony-internetowe/${slug}`
