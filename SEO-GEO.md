# SEO lokalne i wyszukiwarki AI — wdrożenie Makoto

## Zakres wykonany w kodzie

- Nuxt 4.6.1 + Nuxt SEO 6.0.1. Robots 7.0.2, Sitemap 9.0.2 i OG Image 7.0.3 obsługują publiczne pliki oraz obrazy. Pełne diffy i kontrola przewodnika: [MIGRATION-NUXT-SEO-6.md](MIGRATION-NUXT-SEO-6.md).
- Każda publiczna strona ma własny obraz Open Graph PNG 1200×630 z aktualnym tytułem, opisem, logo, lokalnymi fotografiami i fontami. Wpisy mają metadane artykułu oraz daty; Twitter używa dużej karty. Renderer Takumi 2.15.2 nie wymaga przeglądarki ani zewnętrznego generatora.

- 5 odrębnych stron: `/strony-internetowe/inowroclaw`, `/torun`, `/bydgoszcz`, `/grudziadz`, `/wloclawek` (wszystkie pod `/strony-internetowe/`). Każda ma własny tytuł, opis, H1, brief, pytania, kontekst lokalny i formularz. Nie są kopiami z podmienioną nazwą miasta.
- Regionalny hub `/obszar-dzialania`, obejmujący również mniejsze miejscowości województwa kujawsko-pomorskiego.
- 6 stron usługowych: strony, sklepy, aplikacje, UI/UX, SEO techniczne/GEO oraz opieka techniczna. Są linkowane z oferty i prowadzą do właściwego formularza lub kalkulatora.
- Jedna tożsamość Makoto: `LocalBusiness`, `Person`, `WebSite`; osobne `Service`, `WebPage` i `BreadcrumbList` dla odpowiednich stron. Blog ma `BlogPosting` z autorem i datami. Nie ma fikcyjnych oddziałów, opinii, ocen ani godzin obsługi.
- Canonical i Open Graph kierują do domeny skonfigurowanej w `NUXT_PUBLIC_SITE_URL`, domyślnie https://makoto.com.pl. Tytuły i opisy stron są unikalne. Ważne treści oraz dane strukturalne znajdują się w HTML renderowanym na serwerze.
- Sitemap zawiera wyłącznie strony publiczne, opublikowane wpisy i aktualne adresy. `lastmod` bloga pochodzi z rzeczywistego zapisu wpisu; nie jest ustawiany automatycznie na dzisiejszą datę.
- Przekierowania 301 dla starych usług, kontaktu, lokalnych adresów `/pl/strony-internetowe/...`, istniejących realizacji `/work/...` oraz przeniesionych artykułów. Dwa publiczne poradniki zostały przeniesione z obecnego serwisu z zachowaniem dat publikacji. Inne dawne strony pomocnicze, np. `/uses` i `/links`, wymagają decyzji przy pełnej migracji; nie są automatycznie przekierowywane na stronę główną.
- `/pytania` przedstawia czytelne informacje o firmie, cenach, współpracy i obszarze obsługi. Nie dodano FAQPage z obietnicą rozszerzonych wyników Google dla strony komercyjnej.
- `/llms.txt`, `/llms-full.txt` i publiczne reprezentacje Markdown `/ai/...md` ułatwiają pobranie informacji. Nie udostępniają zgłoszeń, panelu, szkiców ani sekretów. Są dodatkiem informacyjnym, nie mechanizmem gwarantującym ranking lub cytowanie.
- Robots umożliwia publiczne pobieranie przez `OAI-SearchBot` i `PerplexityBot` po uruchomieniu indeksowania. Reguły prywatnych ścieżek są takie same również w tych grupach. Nie zmieniano polityki dostępu botów treningowych względem dotychczasowego ogólnego zezwolenia.
- Formularze zapisują miasto i adres strony, z której klient wysłał zgłoszenie. Informacje widać w panelu i CSV; pozwala to oceniać faktyczne zapytania z poszczególnych stron.

## Potwierdzone dane firmy

Odczyt z Profilu Firmy w Google przekazanego przez właściciela, 12 października 2026:

- Nazwa: Makoto.
- Autor: Patryk Dąbrowski.
- Adres publiczny: Młyńska 5/1, 88-100 Inowrocław.
- Telefon: +48 500 408 357.
- E-mail z istniejącego serwisu: contact@makoto.com.pl.
- [Profil Google / mapa](https://www.google.com/maps/place//data=!4m2!3m1!1s0x45d6e9a9647b6191:0xa9ea64dede1ef4f1).

Te dane są wspólne dla stopki, kontaktu, stron lokalnych, JSON-LD oraz materiałów dla AI. Można je edytować w ustawieniach panelu.

Właściciel potwierdził, że [ProvenExpert](https://www.provenexpert.com/pl-pl/makoto-strony-internetowe-e-commerce-optymalizacja-seo/) zawiera stare dane. Profil wymaga aktualizacji do adresu Młyńska 5/1 widocznego w Google; jego stare dane nie są wykorzystywane na stronie ani w danych strukturalnych. Profil Google wskazuje też całodobowe godziny; warto potwierdzić, czy odnoszą się do rzeczywistej dostępności kontaktu. Nie zmieniano zewnętrznych profili ani nie kopiowano godzin do schema strony.

## Uruchomienie indeksowania po publikacji

Lokalny podgląd i nowe wdrożenia mają domyślnie `NUXT_PUBLIC_INDEXABLE=false`: nagłówek i meta `noindex`, robots blokujący pobieranie oraz pusta sitemap. To chroni przed indeksacją wersji roboczej.

Na docelowym wdrożeniu ustaw:

```dotenv
NUXT_PUBLIC_SITE_URL=https://makoto.com.pl
NUXT_PUBLIC_INDEXABLE=true
NUXT_APP_SECRET=staly-losowy-sekret-minimum-32-znaki
NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION=wartosc-z-Search-Console
NUXT_PUBLIC_BING_SITE_VERIFICATION=wartosc-z-Bing-Webmaster-Tools
```

Wartości weryfikacji Google/Bing są opcjonalne i pochodzą z kont właściciela. `NUXT_APP_SECRET` jest wyłącznie serwerowy: użyj stałej, losowej wartości na każdej instancji, bez zapisywania w Git. Nowe podpisy OG Image 7 wymagają odświeżenia cache HTML po migracji; zmiana sekretu unieważnia podpisane URL-e. Następnie zrestartuj proces, sprawdź metadane i `/robots.txt`, a sitemap prześlij w Search Console i Bing Webmaster Tools. Nie dodano pustych tokenów ani automatycznych zgłoszeń do cudzych kont.

Przed zastąpieniem obecnego serwisu:

1. Porównaj pełną listę starych adresów z Search Console i obecną sitemapą; sprawdź strony pomocnicze poza przeniesionym zakresem.
2. Sprawdź, że proxy kieruje wersję www i HTTP na docelowy HTTPS, bez pętli i wielokrotnych przekierowań.
3. Zweryfikuj schemat w Rich Results Test i Schema.org Validator na publicznym wdrożeniu.
4. Sprawdź CDN/WAF. Zezwolenie w robots nie pomoże, jeśli serwer blokuje crawlera. Zakresy IP i instrukcje weryfikacji sprawdzaj w dokumentacji operatora, nie ufaj samemu nagłówkowi User-Agent.
5. Dodawaj rzeczywiste lokalne realizacje, opinie ze źródłem i treści z własnego doświadczenia. To kolejny krok ponad obecne materiały usługowe i briefy.
6. Po publikacji sprawdź mobilne PageSpeed/CrUX, zapytania w Search Console i zgłoszenia w panelu. Nie mierz wyników produkcyjnego SEO przez lokalny localhost.

## Źródła i ograniczenia

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — SEO pozostaje podstawą, brak dodatkowego wymogu plików AI i specjalnej schema.
- [Google: optymalizacja funkcji generatywnych](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — wartościowe, własne materiały i unikanie masowego tworzenia wariantów zapytań.
- [Google: polityka spamu i doorway abuse](https://developers.google.com/search/docs/essentials/spam-policies) — podobne strony regionalne bez dodatkowej wartości są ryzykowne.
- [Google: LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business) i [Schema.org](https://schema.org/LocalBusiness).
- [OpenAI: boty](https://developers.openai.com/api/docs/bots) — OAI-SearchBot służy wyszukiwaniu; GPTBot jest odrębnym crawlerem treningowym.
- [Perplexity: crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers).
- [llms.txt](https://llmstxt.org/) — propozycja publicznego przewodnika po treści, a nie gwarancja widoczności.

Nie zmierzono obecnych pozycji, udziału w mapach, ruchu GSC/GA4 ani cytowań AI. Nie podłączano kont zewnętrznych i nie publikowano strony. Wyniki lokalnego SEO zależą również od konkurencji, odległości, reputacji, aktualności profili i sygnałów spoza witryny.
