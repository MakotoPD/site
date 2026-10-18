# Makoto Studio

Nowa, niezależna wersja Makoto: Nuxt 4, Vue, Tailwind CSS 4, GSAP ScrollTrigger, autorska rzeźba 3D (Three.js), Tiptap oraz backend Nitro z PostgreSQL i Cloudflare R2. Projekt jest lokalny; obecna strona Makoto nie została zmieniona.

## Uruchomienie

Wymagany Node.js 26.11.1 lub nowszy, npm i działający Docker Desktop. Na Windows `npm run runtime:setup` instaluje oficjalny, zweryfikowany SHA256 Node wyłącznie w `.tools/` tego projektu; npm scripts wybierają go automatycznie. `.nvmrc` i Docker również wskazują 26.11.1. Lokalny `.env` jest już skonfigurowany. Przy świeżej instalacji skopiuj `.env.example` do `.env`, uzupełnij hasło PostgreSQL (takie samo w `MAKOTO_POSTGRES_PASSWORD` i `NUXT_DATABASE_URL`), klucze R2 oraz stały losowy `NUXT_APP_SECRET` (minimum 32 znaki), a następnie jednorazowo uruchom `npm run admin:setup`.

```powershell
cd C:\Users\Patryk\Documents\GitHub\site
npm run runtime:setup
npm install
npm run db:start
npm run storage:check
npm run dev
```

Strona: http://127.0.0.1:3010. Panel: http://127.0.0.1:3010/admin.

`admin:setup` pyta o e-mail, generuje mocne hasło i wyświetla je raz. Zapisz je w menedżerze haseł. W ignorowanym `.env` zapisuje tylko zasolony hash scrypt. Ponowne wykonanie zmienia dane logowania; zrestartuj wtedy serwer. Nigdy nie commituj `.env` ani `.data`.

## Co jest gotowe

Nuxt 4.6.1 i Nuxt SEO 6.0.1: sitemap z aktualnie opublikowanymi wpisami PostgreSQL, robots oraz osobne podpisane obrazy Open Graph 1200×630 z logo Makoto. SEO lokalne i GEO: pięć stron miast, hub województwa, osobne usługi, potwierdzone dane firmy, JSON-LD, publiczne reprezentacje Markdown, llms.txt/llms-full.txt oraz przekierowania starych adresów. Szczegóły i uruchomienie indeksowania: [SEO-GEO.md](SEO-GEO.md). Diffy migracji: [MIGRATION-NUXT-SEO-6.md](MIGRATION-NUXT-SEO-6.md).

Oryginalne logo, favicon i model 3D Makoto są używane na stronie oraz w panelu. System zaokrągleń i tokenów opisuje [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

- Strona główna: sekwencja wejścia w CSS (od pierwszego wyrenderowania, bez czekania na JavaScript), animacje sekcji przy przewijaniu (GSAP, uruchamiane po załadowaniu strony), paralaksa zdjęć, interaktywny obiekt 3D renderowany w Web Workerze (`app/workers/sculpture.ts`), responsywna nawigacja, FAQ.
- Usługi: asymetryczna siatka dużych fotografii, osobne linki do usług i soczewka ASCII pod kursorem. Baner wyceny ma fotograficzną fakturę wody. Zdjęcia Unsplash są serwowane lokalnie jako responsywny WebP i wczytywane leniwie; źródła i licencja: `public/images/editorial/sources.json`. Na telefonie i przy ograniczonym ruchu efekt ASCII jest wyłączony.
- Oferta, portfolio z filtrami i podstronami projektów, o mnie i kontakt.
- Kalkulator: wybór celu rozwija dopasowane pytania w tym samym widoku. Pomoc w doborze projektu, czytelny zakres landing page i strony firmowej, odpowiedzi „Nie wiem jeszcze” oraz formularz bez konieczności wyboru typu strony. Wycena zmienia się na bieżąco i jest ponownie liczona na serwerze; opieka miesięczna jest osobno. Konfiguracja i sprawy do omówienia zapisują się w panelu oraz eksporcie CSV. Przy zmianie typu projektu dodatki są resetowane, aby ukryte opcje nie wpływały na kwotę.

- Panel: podsumowanie zgłoszeń, ich wartości i publikacji; wyszukiwanie, filtry, dane kontaktowe, pełna wycena, statusy, notatki, usuwanie i eksport CSV.
- Realizacje: lista projektów edytowana w panelu → Realizacje (dodawanie, usuwanie, kolejność, opisy, technologie, link, kolor i zdjęcie). Przy pierwszym starcie baza dostaje projekty z `shared/defaults.ts`; później źródłem jest PostgreSQL. Dwie pierwsze realizacje trafiają na stronę główną.
- Blog: wizualny Tiptap 3, siedem własnych bloków (NOTE, TIP, INFO, SUCCESS, IMPORTANT, WARNING, CAUTION), tabele, zadania, kod z kolorami składni, klawisze i zdjęcia z podpisami. Podgląd ma ten sam wygląd co publiczny artykuł. Okładki JPG/PNG/WebP, kategorie, szkice, publikacja i usuwanie pozostają dostępne; szkice są prywatne.
- Ustawienia: nazwa, e-mail kontaktowy, komunikat dostępności i edycja etykiet/opisów/cen kalkulatora.
- SEO: metadane, canonical, sitemap, robots i wykluczenie panelu z indeksowania. Lokalne fonty i lokalny zestaw 5 ikon Simple Icons (@nuxt/icon, mechanizm ikon Nuxt UI).
- Ograniczony ruch: brak animacji ScrollTrigger i automatycznego obrotu 3D przy `prefers-reduced-motion`. Animacje i renderowanie 3D są sprzątane po opuszczeniu strony.

Kalkulator pokazuje opis wybranej odpowiedzi bezpośrednio pod grupą i listę zakresu pod konfiguracją. Sklep pyta o wielkość katalogu oraz osobno o wprowadzenie produktów; nie nalicza podstron ani dopłaty za panel produktów. Aplikacja pyta o proces (CRM, automatyzacja, rezerwacje lub panel) i oznacza kwotę jako początkową. Ponad 1000 produktów oraz import o nieznanej wielkości wymagają indywidualnego potwierdzenia.

Ceny bazowe ustalone przez właściciela: landing 1400 zł, strona firmowa 2500 zł, sklep 5000 zł i aplikacja 8000 zł netto. Dopłaty startowe: szablon premium 800 zł (licencja osobno), projekt Figma 2500 zł; wprowadzenie 1–50 produktów 250 zł, 51–200: 750 zł, 201–500: 1500 zł, 501–1000: 2500 zł. Wariant podstawowego układu i samodzielne dodawanie produktów mają dopłatę 0 zł. Wszystkie te stawki i opisy można zmienić w panelu → Ustawienia.

Treści oraz dostępne zdjęcia projektów Spectra i Denalify pochodzą z lokalnej, dotychczasowej strony. Przeniesiono artykuł o Denalify; pominięto testowy wpis. Dwa dodatkowe artykuły to nowe teksty startowe. Pozostałe projekty mają typograficzne grafiki zamiast niedostępnych zrzutów ekranowych.

## Dane i produkcja

Baza PostgreSQL przechowuje wpisy i dokumenty Tiptap, zgłoszenia, wyceny, ustawienia, sesje, limity żądań oraz metadane plików. Lokalny kontener `makoto-studio-postgres` używa bazy `makoto_studio`, portu `127.0.0.1:5434` i trwałego wolumenu `makoto-studio-postgres-data`. Tabele należą do osobnego schematu `makoto_studio`.

Wgrywane zdjęcia i dokumenty PDF trafiają do istniejącego bucketu R2 `makoto-portfolio`, pod prefiks `makoto-studio/`. Nie są zapisywane na dysku aplikacji. Statyczne logo, fonty i materiały strony pozostają w repozytorium. API mediów sprawdza publikację artykułu: pliki szkiców i jeszcze nieprzypisane pliki wymagają sesji administratora, pliki opublikowanych wpisów i zdjęcia realizacji są dostępne publicznie. Nie zmienia to ustawień dostępu istniejącego bucketu ani jego pozostałych obiektów.

Jednorazowy `npm run db:migrate` przenosi dotychczasowe dane z `.data/makoto.sqlite` do PostgreSQL, a lokalne media — do R2. Migracja została już wykonana; ponowne uruchomienie zachowuje aktualne dane PostgreSQL. Stara baza i pliki pozostały jako kopia. Nowa aplikacja nie korzysta z SQLite. `npm run storage:check` sprawdza połączenie z bazą oraz zapis/odczyt R2, po czym usuwa własny plik kontrolny.

```powershell
npm run build
# Proces produkcyjny nie czyta automatycznie .env.
# Ustaw zmienne środowiskowe u dostawcy hostingu lub użyj Node:
node --env-file=.env .output/server/index.mjs
```

Ustaw `NUXT_PUBLIC_SITE_URL` na adres produkcyjny, dane administratora, `NUXT_DATABASE_URL`, `NUXT_DATABASE_SCHEMA`, `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT` i `NUXT_R2_PREFIX` jako zmienne serwera. Sekrety nie należą do publicznego runtimeConfig. Produkcja wymaga HTTPS (cookie sesji ma flagę Secure). Backend wymaga procesu Node oraz dostępu do PostgreSQL i R2; hosting statyczny nie wystarczy. Do zewnętrznej bazy użyj połączenia TLS z weryfikacją certyfikatu zgodnie z konfiguracją dostawcy.

Po publikacji ustaw `NUXT_PUBLIC_INDEXABLE=true`. Domyślne `false` zapobiega indeksacji podglądu i pustych wersji roboczych. W razie zmiany domeny sprawdź również canonical, sitemap i przekierowania na poziomie hostingu.

`docker compose up -d postgres` uruchamia samą lokalną bazę. `compose.yaml` służy wyłącznie lokalnej pracy. Produkcja (Dokploy) buduje obraz z `Dockerfile` i nie tworzy bazy: ustaw `NUXT_DATABASE_URL` na wewnętrzny adres istniejącej bazy PostgreSQL. Aplikacja zakłada w niej tylko własny schemat `makoto_studio` z tabelami. Kontener słucha na porcie 3000. Reverse proxy powinno terminować HTTPS i nie udostępniać `.env` ani kopii `.data`. Lokalna baza jest wystawiona wyłącznie na loopback. Limity wysyłek liczone są na adres klienta: za lokalnym reverse proxy (adres prywatny lub loopback) serwer bierze ostatni wpis `X-Forwarded-For`. Strona działa za proxy Cloudflare, dlatego domyślnie zaufanym nagłówkiem jest `cf-connecting-ip` (`NUXT_CLIENT_IP_HEADER`); zapora serwera powinna przyjmować ruch HTTP/HTTPS tylko z adresów Cloudflare, inaczej nagłówek da się podrobić. Serwer produkcyjny wysyła HSTS oraz Content-Security-Policy z listą hostów w `server/middleware/security.ts`; nowy zewnętrzny skrypt trzeba tam dopisać.

Backup PostgreSQL wykonuj przez `pg_dump` i sprawdzaj odtwarzanie kopii. Zachowaj również obiekty z prefiksu R2 nowej strony; backup samej bazy nie zawiera zdjęć ani PDF-ów. Nie usuwaj wolumenu PostgreSQL przez `docker compose down -v`, jeśli chcesz zachować dane. Dane klientów są prywatne.

Zgłoszenia trafiają do panelu, a po ustawieniu zmiennych `NUXT_SMTP_*` serwer wysyła też powiadomienie e-mail o każdym nowym zgłoszeniu (odpowiedź na nie trafia do klienta). Błąd poczty nie blokuje formularza: zgłoszenie jest już zapisane, a przyczyna trafia do logu serwera. Zgłoszenia są automatycznie usuwane po 3 latach od ostatniej aktualizacji (przy starcie serwera i raz na dobę). Zdjęcia wgrywane w panelu są zapisywane bez metadanych EXIF. Stawki kalkulatora są propozycją startową — dostosuj je w panelu. Przed publiczną publikacją dopasuj również informacje o prywatności do faktycznego hostingu i okresu przechowywania danych.

## Edycja bloga

Treść piszesz wizualnie w Tiptap. Menu „Wstaw blok” zawiera siedem dotychczasowych wyróżnień, cytat, kod, tabelę, separator i plik. Gdy kursor jest w wyróżnieniu, możesz zmienić jego rodzaj i dodać własny nagłówek. TIP/Wskazówka używa baby blue, pozostałe warianty mają spokojne akcenty, ciemne powierzchnie i ten sam promień kart. Tabele mają narzędzia wierszy, kolumn, łączenia i wyrównania. Zdjęcia JPG/PNG/WebP oraz załączniki PDF można wgrywać bezpośrednio do R2 (do 5 MB) albo dodać bezpiecznym adresem. Zdjęcie wymaga opisu alternatywnego; podpis jest opcjonalny.

„Więcej formatowania” udostępnia m.in. klawisze, indeksy, przenoszenie bloków oraz wstawienie Markdown. Markdown obsługuje także zapis > [!TIP], tabele i zadania. Przełączenie podglądu zachowuje historię cofania edytora. Tytuł artykułu pozostaje jedynym H1, treść używa H2–H6.

Dawne wpisy Markdown nie są nadpisywane przy otwieraniu. Edytor konwertuje je do dokumentu w pamięci; dopiero zapis przez autora utrwala JSON w polu document. Pole content pozostaje zgodne ze starymi wpisami i zawiera wersję Markdown wygenerowaną na serwerze z JSON. Jest używana w reprezentacjach AI /ai i llms-full.txt. Kod edytora jest ładowany tylko w panelu, publiczny artykuł ma HTML wyrenderowany na serwerze.

Serwer sprawdza strukturę, dozwolone bloki/formatowanie, adresy i limity treści. Ignoruje dodatkowe atrybuty, nie przyjmuje iframe ani surowego HTML, wymaga opisu zdjęcia i generuje bezpieczny HTML. Test integracyjny sprawdza wszystkie wyróżnienia, podpisy, tabele, zadania, kod, zapis i odczyt po restarcie, publikację SSR, AI Markdown oraz odrzucenie niebezpiecznej treści.

## Analityka, zgody i Turnstile

Przeniesione identyfikatory: GA4 G-7P472XF9TT, Umami 63fb127b-613f-4455-b6a4-82e4f7ae3581 na własnej instancji (`analytics.makoto.com.pl`, zmienna `NUXT_PUBLIC_ANALYTICS_UMAMI_SRC`; jej host trafia automatycznie do CSP). Meta Pixel i Google Tag Manager zostały usunięte; strona nie ma kategorii marketingowej. AdSense znaleziony w starym kodzie służy reklamom; nie został dodany do nowego projektu.

GA4 i Umami uruchamiają się po zgodzie na analitykę. Basic Consent Mode v2 domyślnie odmawia wszystkich sygnałów, a sygnały reklamowe pozostają odrzucone zawsze. Nie ma żądań do trackerów przed zgodą. Cookie cookie_consent zachowuje zgodność z dotychczasowym formatem i pamięta wybór na rok. Link w stopce i polityce prywatności otwiera dostępne z klawiatury okno ustawień. Cofnięcie zgody czyści znane cookies trackerów i przeładowuje stronę, usuwając ich kod z pamięci.

Analityka jest wyłączona w dev, na localhost, na innej domenie niż NUXT_PUBLIC_SITE_URL oraz w panelu /admin. Zdarzenia page_view obsługują przejścia Nuxta; generate_lead jest wysyłane dopiero po zapisie zgłoszenia, bez pól osobowych formularza. Umami wyłącza automatyczne pageview i dostaje ścieżkę bez query/hash. Konfiguracja samego GA4 może dodatkowo uruchamiać automatyczne zdarzenia.

Publiczne identyfikatory można zmienić zmiennymi NUXT_PUBLIC_ANALYTICS_* z .env.example. NUXT_PUBLIC_ANALYTICS_ENABLED=false wyłącza śledzenie. Statystyki produkcyjne wymagają publikacji na docelowej domenie i zgody odwiedzającego.

Kontakt, kalkulator (również formularz „Nie wiem jeszcze”) i logowanie są chronione Cloudflare Turnstile. Te same dwa klucze z dotychczasowej strony zapisano w lokalnym, ignorowanym .env: NUXT_PUBLIC_TURNSTILE_SITE_KEY oraz wyłącznie serwerowy NUXT_TURNSTILE_SECRET_KEY. W produkcji ustaw je u dostawcy hostingu. Brak konfiguracji zamyka możliwość wysłania formularza. Walidacja serwerowa sprawdza success, action i domenę, a po próbie formularz odświeża token. Sekret nigdy nie trafia do publicznego runtimeConfig ani odpowiedzi API.

Lokalny dev używa oficjalnych kluczy testowych Cloudflare. Test integracyjny korzysta z nich wyłącznie na loopback przy NODE_ENV=test i wykonuje prawdziwe wywołanie Siteverify. Produkcja nie przyjmuje klucza testowego. Przy zmianie domeny trzeba dodać ją do istniejącego widgetu Cloudflare.

## Kontrole

```powershell
npm run typecheck
npm run format:check
npm test
npm run build
npm run test:integration
```

Test integracyjny wymaga uruchomionego lokalnego PostgreSQL i konfiguracji R2 w `.env`. Uruchamia produkcyjny serwer na porcie 3012 z losowymi danymi logowania, osobnym schematem `makoto_test_<losowy identyfikator>` i prefiksem R2 `makoto-studio/tests/<losowy identyfikator>`. Sprawdza uwierzytelnienie, Turnstile (w tym brak i fałszowanie tokena), limit zgłoszeń, CSRF, walidację, przeliczanie cen na serwerze, zgłoszenia, CSV, publikowanie bloga, XSS, zapis ustawień, rzeczywiste wysyłanie plików do R2 i trwałość po restarcie. Po zakończeniu usuwa tylko wygenerowany schemat oraz własne pliki testowe. Nie dotyka danych z właściwego schematu strony.

Zależności bezpośrednie sprawdzono względem aktualnego stabilnego `latest` npm i przypięto w lockfile. Wyjątek: TypeScript 6.0.3, ponieważ najnowszy 7.0.2 nie jest jeszcze obsługiwany przez vue-tsc 3.3.13. `npm audit` nadal zgłasza alerty w zależnościach pośrednich narzędzi Nuxt; aktualizacja wszystkich bezpośrednich pakietów ich nie usuwa. Zależności `simple-git` oraz parsera argumentów mają overrides do wydań usuwających wcześniejsze alerty critical. Szczegóły drzewa należy sprawdzać poleceniem `npm audit` przy kolejnej aktualizacji.

## Inspiracje

Rytm animacji i przejrzysta wycena: [SKWEB](https://www.skweb.pl/) i [kalkulator SKWEB](https://www.skweb.pl/wycena). Układ i forma Makoto są autorskie, z ciemnym tłem oraz baby blue.
