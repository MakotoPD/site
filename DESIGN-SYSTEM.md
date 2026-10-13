# Makoto — system wizualny

Tokeny Tailwinda 4 definiuje `@theme` w `app/assets/css/main.css`; zmienne używane przez Canvas/GSAP i renderowaną treść są w `tokens.css`. Interfejs używa klas Tailwinda w komponentach Vue. Ten sam system obowiązuje na stronie, podstronach lokalnych, w kalkulatorze i panelu.

Kolory: `bg-background`, `bg-surface`, `text-ink`, `text-muted`, `text-primary`, `border-line`. Promienie: `rounded-control`, `rounded-card`, `rounded-feature`, `rounded-full`. Układ, odstępy, typografia, breakpointy i stany kontrolek są zapisane bezpośrednio w szablonach; nie ma osobnych arkuszy layoutu usług, kalkulatora, podstron lokalnych ani panelu.

`data-ui` oznacza elementy potrzebne animacjom, testom oraz wariantom odnoszącym się do dzieci komponentów; nie jest alternatywnym arkuszem stylów. Pozostały CSS obejmuje bazowe style dokumentu, stany przejść Vue i `content.css` dla HTML generowanego przez Tiptap/Markdown. Style edytora i podglądu korzystają ze wspólnej typografii treści.

`npm run format` uruchamia Prettier z sortowaniem Tailwinda i zawija długie listy klas. `npm run format:check` sprawdza ten sam format bez modyfikacji plików. Pliki źródłowe mają normalne wcięcia, jedną właściwość/atrybut na linię i czytelne bloki logiki.

| Element                                     | Reguła                             |
| ------------------------------------------- | ---------------------------------- |
| Tło                                         | `--bg` / #090c10, zawsze ciemne    |
| Powierzchnia                                | `--surface` / #11161d              |
| Akcent                                      | `--blue` / #b5dcff, baby blue      |
| Tekst                                       | #f2f4f7, drugorzędny #929ba8       |
| Przyciski, pola, wewnętrzne zdjęcia         | `--radius-control`, 8 px           |
| Karty, panel, formularz, opcje kalkulatora  | `--radius-card`, 16 px             |
| Duże wyróżnienia, okna dialogowe, logowanie | `--radius-feature`, 24 px          |
| Statusy, filtry, znaczniki technologii      | `--radius-pill`, 9999 px           |
| Awatary, dekoracyjne orbity                 | Koło; kształt wynika z ich funkcji |

Typografia: Manrope Variable do treści i interfejsu; Instrument Serif italic do wyróżnień. Wielkości nagłówków są responsywne. Odstępy opierają się na krokach 4, 8, 12, 16, 24, 32, 48, 64 i 96 px.

Oryginalny znak i logotyp pochodzą z `Makoto-website/public/logo.png` i są używane bez zmiany kształtu w nagłówku, stopce oraz panelu. Favicon i model 3D również pochodzą z dotychczasowej strony. Interaktywna animacja przedstawia rzeczywisty model znaku Makoto.

Ruch: wejście sekcji startowej w CSS (`data-hero`, nagłówek tylko się przesuwa, bez zanikania), sekcje przy przewijaniu przez GSAP, krótkie przejścia kontrolek oraz łagodny ruch logo 3D. Logo 3D renderuje się w Web Workerze i startuje dopiero po załadowaniu strony, więc nie blokuje interfejsu. `prefers-reduced-motion` usuwa ruch przestrzenny; renderowanie 3D jest wstrzymywane poza widokiem i w nieaktywnej karcie.

Blog i edytor Tiptap współdzielą `app/assets/css/rich-content.css`: typografię, wyróżnienia, tabele, kod, podpisy zdjęć i listy zadań. TIP i INFO używają baby blue; SUCCESS ma stonowaną zieleń, WARNING bursztyn, a CAUTION czerwień. Kolor sygnalizuje znaczenie bloku, jego nazwa i ikona pozostają czytelne niezależnie od koloru. Wszystkie wyróżnienia używają `--radius-card`, a narzędzia edytora `--radius-control`.

Sekcja usług na stronie głównej używa asymetrycznej siatki fotografii: strony internetowe zajmują większą kartę, aplikacje i design dwie mniejsze. Promień kart to `--radius-card`. Baner wyceny używa fotografii wody oraz `--radius-feature`. Zdjęcia są dekoracyjne, mają puste opisy alternatywne, a nazwy usług i linki pozostają tekstem HTML. Fotografie pochodzą z darmowej kolekcji Unsplash; autorzy, adresy źródeł i licencja są w `public/images/editorial/sources.json`.

`AsciiSurface.vue` nakłada na zdjęcie miękką soczewkę ASCII inspirowaną [Asciify](https://canvasui.dev/docs/components/asciify). Własny komponent Vue korzysta z Canvas 2D i istniejącego GSAP: obraz znaków jest przygotowywany raz na rozmiar/źródło, a ruch soczewki trwa 250 ms z `power3.out`; wejście 200 ms, wyjście 160 ms. Po zatrzymaniu kursora nie ma ciągłej pętli rysowania. Poniżej 761 px, bez precyzyjnego wskaźnika lub przy `prefers-reduced-motion` pozostaje zwykła fotografia. Zniknięcie sekcji z widoku lub ukrycie karty wstrzymuje efekt. Brak Canvas nie blokuje zdjęcia ani linków. Style sekcji: `app/assets/css/editorial.css`.

Podstrony sześciu usług współdzielą `ServiceOutcomes.vue`: kompozycję trzech paneli o różnych szerokościach i przesunięciach. Pierwszy łączy fotografię z ASCII i dużym nagłówkiem, drugi pokazuje grafikę związaną z usługą (kontakt, koszyk, role, typografia, dane lub kopie), a trzeci łączy opis korzyści z nakładającymi się panelami, które rozsuwają się po najechaniu. Obwódka wszystkich paneli ma tę samą grubość; trzeci nie ma dodatkowego akcentu na górnej krawędzi. Wszystkie panele korzystają z `--radius-card`. Grafiki są dekoracyjne; opisy korzyści pozostają w HTML. Wejście sekcji używa istniejącego GSAP, a detale reagują na najechanie przez przejście transformacji 250 ms z `--ease-out`. Ruch detali jest wyłączony przy ograniczonym ruchu i bez precyzyjnego wskaźnika. Na telefonie panele tworzą jedną kolumnę; na tablecie ostatni zajmuje cały wiersz.
