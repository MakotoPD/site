export const quoteProjectCopy: Record<
  string,
  { intent: string; scope: string; icon: 'monitor' | 'layers' | 'shop' | 'code' }
> = {
  landing: { intent: 'Promować jedną ofertę', scope: '1 strona / wiele sekcji', icon: 'monitor' },
  website: {
    intent: 'Pokazać firmę i zdobywać klientów',
    scope: 'Do 5 podstron w cenie',
    icon: 'layers',
  },
  store: {
    intent: 'Sprzedawać produkty online',
    scope: 'Katalog / koszyk / zamówienia',
    icon: 'shop',
  },
  application: {
    intent: 'Usprawnić pracę lub obsługę klientów',
    scope: 'Indywidualny zakres funkcji',
    icon: 'code',
  },
}

export const quoteExtraQuestions: Record<
  string,
  { question: string; hint: string; no: string; yes: string }
> = {
  cms: {
    question: 'Chcesz samodzielnie zmieniać treści?',
    hint: 'Panel edycji pozwala aktualizować teksty, zdjęcia i publikować wpisy na blogu bez kontaktu z programistą.',
    no: 'Zmiany zlecę Tobie',
    yes: 'Tak, chcę panel edycji i blog',
  },
  copy: {
    question: 'Kto przygotuje teksty na stronę?',
    hint: 'Chodzi o opisy firmy, usług i oferty. Jeśli masz materiały, możemy wykorzystać je w projekcie.',
    no: 'Dostarczę gotowe teksty',
    yes: 'Potrzebuję pomocy z tekstami',
  },
  identity: {
    question: 'Masz już logo i kolory swojej marki?',
    hint: 'Identyfikacja wizualna to logo, paleta kolorów i zasady ich używania. Możemy przygotować je razem ze stroną.',
    no: 'Tak, mam gotowe materiały',
    yes: 'Potrzebuję identyfikacji marki',
  },
  motion: {
    question: 'Zależy Ci na rozbudowanych animacjach?',
    hint: 'To dodatkowe sceny przy przewijaniu i autorskie interakcje. Podstawowe przejścia są częścią standardowego interfejsu.',
    no: 'Wystarczą podstawowe przejścia',
    yes: 'Chcę rozbudowane animacje',
  },
  integrations: {
    question: 'Projekt ma łączyć się z innymi narzędziami?',
    hint: 'Na przykład z newsletterem, systemem kontaktów z klientami lub zewnętrznym kalendarzem. Zakres połączeń potwierdzimy po rozmowie.',
    no: 'Nie potrzebuję dodatkowych połączeń',
    yes: 'Tak, potrzebuję integracji',
  },
}

export const quoteUndecidedLabels: Record<string, string> = {
  project: 'Rodzaj projektu',
  pages: 'Liczba podstron',
  languages: 'Wersje językowe',
  cms: 'Samodzielna edycja treści',
  copy: 'Przygotowanie tekstów',
  identity: 'Logo i identyfikacja',
  motion: 'Zakres animacji',
  integrations: 'Integracje',
  monthly: 'Opieka po wdrożeniu',
  urgent: 'Termin realizacji',
  design: 'Wariant wyglądu',
  products: 'Liczba produktów',
  productEntry: 'Wprowadzenie katalogu',
  appPurpose: 'Cel aplikacji',
}

export const quoteShortDescriptions: Record<string, string> = {
  landing: 'Jedna oferta, kampania lub wydarzenie. Wszystkie sekcje pod jednym adresem.',
  website: 'Pełna prezentacja firmy: usługi, realizacje, informacje o firmie i kontakt.',
  store: 'Katalog produktów, zakup online oraz panel do obsługi zamówień.',
  application: 'Własne narzędzie do pracy: CRM, rezerwacje, panel lub automatyzacja.',
}

export const quoteBaseIncluded: Record<string, string[]> = {
  landing: [
    'Jedna strona z uzgodnionymi sekcjami oferty i kontaktu',
    'Dopasowanie układu do logo, kolorów i dostarczonych materiałów',
    'Wersja na telefon, tablet i komputer',
    'Podstawowe SEO: tytuły, opisy i czytelna struktura',
    'Formularz kontaktowy oraz wdrożenie w uzgodnionym środowisku',
  ],
  website: [
    'Do 5 podstron z menu i uzgodnioną strukturą',
    'Dopasowanie układu do marki i dostarczonych materiałów',
    'Wersja na telefon, tablet i komputer',
    'Podstawowe SEO, metadane i uporządkowane adresy',
    'Formularz kontaktowy, testy działania i wdrożenie',
  ],
  store: [
    'Katalog produktów, koszyk i proces zamówienia',
    'Panel dodawania produktów i obsługi zamówień',
    'Konfiguracja uzgodnionej bramki płatności i sposobów dostawy',
    'Podstawowe informacje o sklepie i edycja jego treści',
    'Wersja mobilna, podstawowe SEO i test procesu zakupowego',
    'Wdrożenie oraz wprowadzenie do obsługi panelu',
  ],
  application: [
    'Rozmowa o procesie i ustalenie zakresu pierwszej wersji',
    'Projekt interfejsu dla uzgodnionego procesu',
    'Programowanie uzgodnionych funkcji i uprawnień',
    'Testy działania, wdrożenie i przekazanie obsługi',
  ],
}

export const quoteAppPurposes: {
  value: string
  label: string
  explanation: string
  features: string[]
}[] = [
  {
    value: 'crm',
    label: 'CRM — klienci i sprzedaż',
    explanation:
      'W jednym miejscu zbierasz kontakty, historię rozmów i statusy ofert. Ustalimy, jak pracuje Twój zespół i które etapy trzeba obsłużyć.',
    features: [
      'Kartoteka klientów i historia kontaktu',
      'Etapy ofert oraz zadania do wykonania',
      'Role użytkowników i potrzebne raporty',
    ],
  },
  {
    value: 'automation',
    label: 'Automatyzacja powtarzalnej pracy',
    explanation:
      'System wykonuje uzgodnione zadania, np. przekazuje dane z formularza, wysyła przypomnienie lub przygotowuje raport. Najpierw wybieramy jeden proces i źródła danych.',
    features: [
      'Mapa obecnego procesu i miejsc wymagających pracy ręcznej',
      'Połączenie uzgodnionych narzędzi i źródeł danych',
      'Obsługa błędów oraz kontrola wyników automatyzacji',
    ],
  },
  {
    value: 'booking',
    label: 'Rezerwacje i zapisy',
    explanation:
      'Klient wybiera dostępny termin lub zapisuje się na wydarzenie. Uzgodnimy reguły dostępności, potwierdzenia i sposób obsługi zmian.',
    features: [
      'Kalendarz dostępności i formularz rezerwacji',
      'Potwierdzenia oraz obsługa zmian terminów',
      'Panel zarządzania zapisami',
    ],
  },
  {
    value: 'portal',
    label: 'Panel klienta lub zespołu',
    explanation:
      'Użytkownik loguje się, żeby zobaczyć swoje dane, dokumenty albo zadania. Zakres informacji i uprawnienia dopasowujemy do jego roli.',
    features: [
      'Logowanie i role użytkowników',
      'Dostęp do uzgodnionych danych i dokumentów',
      'Widoki dopasowane do pracy klienta lub zespołu',
    ],
  },
  {
    value: 'other',
    label: 'Inny proces',
    explanation:
      'Opisz w formularzu, co robisz dzisiaj, gdzie pojawia się problem i jaki efekt ma przynieść aplikacja. Na tej podstawie zaproponuję zakres.',
    features: [
      'Opis problemu i potrzeb odbiorców',
      'Zakres pierwszej użytecznej wersji',
      'Uzgodnione kryteria odbioru',
    ],
  },
  {
    value: 'unsure',
    label: 'Nie wiem jeszcze',
    explanation:
      'Nie potrzebujesz gotowej listy funkcji. Wystarczy opisać firmę i czynność, którą chcesz usprawnić. Dobierzemy rozwiązanie po rozmowie.',
    features: [],
  },
]

export const quoteExtraIncluded: Record<string, { title: string; items: string[] }> = {
  cms: {
    title: 'Panel edycji treści i blog',
    items: [
      'Edycja uzgodnionych tekstów i zdjęć',
      'Tworzenie, zapis szkiców i publikacja wpisów',
      'Przekazanie instrukcji obsługi panelu',
    ],
  },
  copy: {
    title: 'Przygotowanie treści',
    items: [
      'Zebranie informacji o firmie i ofercie',
      'Teksty do uzgodnionych sekcji lub podstron',
      'Dopasowanie tekstów do struktury projektu',
    ],
  },
  identity: {
    title: 'Identyfikacja wizualna',
    items: [
      'Logo i uzgodniony kierunek wizualny',
      'Paleta kolorów i typografia',
      'Podstawowe zasady stosowania marki',
    ],
  },
  motion: {
    title: 'Rozbudowane animacje',
    items: [
      'Uzgodnione sceny i interakcje',
      'Dostosowanie ruchu do telefonu i komputera',
      'Wariant ograniczonego ruchu i test płynności',
    ],
  },
  integrations: {
    title: 'Integracje z narzędziami',
    items: [
      'Ustalenie połączeń i przepływu danych',
      'Wdrożenie uzgodnionych integracji',
      'Test poprawnego przesyłania danych',
    ],
  },
}
