<script setup lang="ts">
const { settings } = await useSite()
const { openSettings } = useCookieConsent()
usePageSeo(
  'Prywatność i cookies',
  'Jak Makoto przetwarza zgłoszenia, chroni formularze i korzysta z plików cookie oraz analityki po Twojej zgodzie.',
)
</script>
<template>
  <div
    data-ui="shell legal-page"
    class="
      mx-auto w-[min(1320px,_calc(100%_-_112px))] max-[1200px]:w-[calc(100%_-_80px)]
      max-[960px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_40px)]
      max-[400px]:w-[calc(100%_-_32px)] [&_h1]:text-[clamp(45px,_6vw,_80px)]
    "
  >
    <header
      data-ui="page-heading"
      class="
        pt-20.5 pb-15 max-[760px]:pt-12.5 max-[760px]:pb-10.5
        [&_>_p:not([data-ui~='section-label'])]:mt-[27px]
        [&_>_p:not([data-ui~='section-label'])]:text-[13px]
        [&_>_p:not([data-ui~='section-label'])]:text-[#95a2b3]
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:mt-5.5
        max-[760px]:[&_>_p:not([data-ui~='section-label'])]:text-[12px]
        [&_[data-ui~='section-label']]:mb-[25px] [&_[data-ui~='text-link']]:mb-[35px]
        [&_h1]:text-[clamp(50px,_6.7vw,_90px)] max-[760px]:[&_h1]:text-[clamp(45px,_8vw,_65px)]
      "
    >
      <SectionLabel text="Twoje dane / Przejrzyste zasady" />
      <h1>
        Polityka
        <span
          data-ui="serif blue"
          class="font-serif font-normal tracking-[-0.025em] text-primary italic"
        >
          prywatności.
        </span>
      </h1>
    </header>
    <div
      data-ui="prose legal-body"
      class="prose max-w-[780px] pb-20 [&_ul]:list-disc"
    >
      <p>Ostatnia aktualizacja: 13 października 2026 r.</p>
      <h2>Kto odpowiada za dane?</h2>
      <p>
        Administratorem danych osobowych jest {{ settings.name }}, prowadzący działalność
        nierejestrowaną pod nazwą Makoto, NIP {{ settings.nip }}
        <template v-if="settings.streetAddress && settings.addressLocality">
          — {{ settings.streetAddress }}, {{ settings.postalCode }} {{ settings.addressLocality }}
        </template>
        — dalej „ja”. W każdej sprawie dotyczącej danych napisz na
        <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        — nie wyznaczyłem inspektora ochrony danych, więc odpowiadam osobiście.
        <template v-if="settings.phone">Możesz też zadzwonić: {{ settings.phone }}.</template>
      </p>
      <h2>Jakie dane zapisuje strona?</h2>
      <p>
        Gdy wysyłasz formularz kontaktowy lub kalkulator, zapisuję Twoje imię, adres e-mail,
        wiadomość oraz — jeśli je podasz — telefon, nazwę firmy i miejscowość. Zapisuję też adres
        podstrony, z której wysłano formularz. Zgłoszenie z kalkulatora zawiera dodatkowo wybraną
        konfigurację, orientacyjną wycenę i kwestie, które chcesz omówić.
      </p>
      <p>
        Adres IP nie jest zapisywany razem ze zgłoszeniem. Aby ograniczać nadużycia, serwer
        tymczasowo zapisuje skrót (hash) adresu IP z licznikiem prób wysłania formularza; taki wpis
        wygasa po 15 minutach. Cały ruch do strony przechodzi przez sieć Cloudflare, która dostarcza
        stronę i chroni ją przed atakami — przetwarza przy tym adres IP i dane techniczne żądania.
        Serwer może też zapisywać w logach technicznych adres IP, datę i adres żądania.
      </p>
      <h2>W jakim celu i na jakiej podstawie?</h2>
      <ul>
        <li>
          <strong>Odpowiedź na zapytanie, wycena i oferta</strong>
          — art. 6 ust. 1 lit. b RODO (działania podejmowane na Twoje żądanie przed zawarciem
          umowy), a gdy piszesz w imieniu firmy lub w innej sprawie — art. 6 ust. 1 lit. f RODO (mój
          prawnie uzasadniony interes: obsługa korespondencji).
        </li>
        <li>
          <strong>Ochrona formularzy przed spamem i bezpieczeństwo strony</strong>
          — art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes: zapobieganie nadużyciom).
        </li>
        <li>
          <strong>Ustalenie, dochodzenie lub obrona roszczeń</strong>
          — art. 6 ust. 1 lit. f RODO.
        </li>
        <li>
          <strong>Statystyki odwiedzin i pomiar skuteczności strony</strong>
          — art. 6 ust. 1 lit. a RODO, czyli zgoda wyrażona w ustawieniach cookie.
        </li>
        <li>
          <strong>Umowa i rozliczenia, jeśli podejmiemy współpracę</strong>
          — art. 6 ust. 1 lit. b oraz lit. c RODO (przepisy podatkowe).
        </li>
      </ul>
      <p>
        Wysłanie zgłoszenia nie zapisuje Cię do newslettera ani na listę marketingową. Podanie
        danych jest dobrowolne, ale imię, adres e-mail i treść wiadomości są potrzebne, żebym mógł
        odpowiedzieć — bez nich formularz nie zostanie wysłany.
      </p>
      <h2>Jak długo przechowuję dane?</h2>
      <ul>
        <li>
          Zgłoszenia z formularzy — przez czas rozmowy o projekcie i ewentualnej współpracy. Serwer
          automatycznie usuwa zgłoszenie po 3 latach od jego ostatniej aktualizacji, czyli po
          upływie terminu przedawnienia ewentualnych roszczeń.
        </li>
        <li>
          Dane związane z umową — przez czas współpracy i okres przedawnienia roszczeń, a dokumenty
          rozliczeniowe przez 5 lat od końca roku podatkowego.
        </li>
        <li>
          Dane analityczne — do cofnięcia zgody, a w narzędziach analitycznych przez okres ustawiony
          w danej usłudze (w Google Analytics dane o użytkownikach i zdarzeniach najdłużej 14
          miesięcy).
        </li>
      </ul>
      <p>
        Wcześniej usunę dane, jeśli o to poprosisz albo skutecznie się sprzeciwisz, o ile przepisy
        nie wymagają ich dalszego przechowywania.
      </p>
      <h2>Kto ma dostęp do danych?</h2>
      <p>
        Zgłoszenia są przechowywane w bazie danych strony, a ich kopię dostaję e-mailem. Dostęp do
        nich mam tylko ja. Danych nie sprzedaję. Odbiorcami mogą być wyłącznie podmioty, z których
        usług korzystam:
      </p>
      <ul>
        <li>
          Hetzner Online GmbH (Niemcy) — serwery, na których działa strona, baza danych i poczta
          e-mail;
        </li>
        <li>
          Cloudflare, Inc. — sieć pośrednicząca w ruchu do strony (CDN i ochrona przed atakami),
          zabezpieczenie formularzy (Turnstile) i przechowywanie plików bloga (R2);
        </li>
        <li>
          Google Ireland Limited — skrzynka Gmail, na którą trafia kopia powiadomienia o zgłoszeniu;
        </li>
        <li>
          po Twojej zgodzie: Google Ireland Limited (Google Analytics 4). Statystyki Umami zbiera
          moja własna instancja na tych samych serwerach, bez zewnętrznego dostawcy;
        </li>
        <li>
          w razie współpracy — podmioty obsługujące rozliczenia, a także organy uprawnione na
          podstawie przepisów prawa.
        </li>
      </ul>
      <p>
        Zdjęcia i załączniki dodawane przez administratora do bloga są przechowywane w Cloudflare
        R2. Strona udostępnia pliki z opublikowanych artykułów; pliki szkiców wymagają zalogowania
        do panelu.
      </p>
      <h2>Przekazywanie danych poza EOG</h2>
      <p>
        Cloudflare i Google mogą przetwarzać dane także w Stanach Zjednoczonych. Podstawą
        przekazania jest decyzja Komisji Europejskiej z 10 lipca 2023 r. o odpowiednim stopniu
        ochrony (EU–US Data Privacy Framework) wobec podmiotów, które do tego programu przystąpiły,
        a w pozostałych przypadkach standardowe klauzule umowne. O kopię stosowanych zabezpieczeń
        możesz poprosić e-mailem.
      </p>
      <h2>Twoje prawa</h2>
      <ul>
        <li>dostęp do danych i otrzymanie ich kopii;</li>
        <li>sprostowanie, usunięcie lub ograniczenie przetwarzania;</li>
        <li>przeniesienie danych, które przetwarzam na podstawie zgody lub umowy;</li>
        <li>
          <strong>sprzeciw</strong>
          wobec przetwarzania opartego na prawnie uzasadnionym interesie;
        </li>
        <li>
          cofnięcie zgody w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania sprzed
          jej cofnięcia.
        </li>
      </ul>
      <p>
        Aby skorzystać z tych praw, napisz na
        <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        — odpowiem bez zbędnej zwłoki, najpóźniej w ciągu miesiąca. Możesz też wnieść skargę do
        Prezesa Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa —
        <a
          href="https://uodo.gov.pl"
          target="_blank"
          rel="noopener noreferrer"
        >
          uodo.gov.pl
        </a>
      </p>
      <p>
        Nie podejmuję decyzji w sposób wyłącznie zautomatyzowany i nie profiluję. Kalkulator wylicza
        orientacyjną kwotę tylko z opcji, które samodzielnie wybierzesz. Nie umieszczaj w wiadomości
        danych wrażliwych, które nie są potrzebne do rozmowy o projekcie.
      </p>
      <h2>Zabezpieczenie formularzy</h2>
      <p>
        Formularz kontaktowy, kalkulator i logowanie do panelu korzystają z Cloudflare Turnstile.
        Usługa sprawdza, czy żądanie jest autentyczne, i pomaga ograniczyć spam. W tym celu
        Cloudflare może przetwarzać adres IP i informacje techniczne o przeglądarce. Weryfikacja
        działa niezależnie od zgody na analitykę. Token jest sprawdzany na serwerze, zanim
        zaakceptuję zgłoszenie.
      </p>
      <p>
        Więcej o dostawcy:
        <a
          href="https://www.cloudflare.com/privacypolicy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          polityka prywatności Cloudflare
        </a>
      </p>
      <h2>Pliki cookie i Twoje zgody</h2>
      <p>
        Strona zapisuje w Twojej przeglądarce pliki cookie i podobne dane. Niezbędne zapisuję bez
        zgody, bo są konieczne do działania strony; pozostałe dopiero po Twojej zgodzie (art. 399
        ustawy Prawo komunikacji elektronicznej).
      </p>
      <ul>
        <li>
          <code>cookie_consent</code>
          — niezbędny, własny. Zapamiętuje Twój wybór przez 12 miesięcy.
        </li>
        <li>
          <code>makoto_session</code>
          — niezbędny, własny. Sesja administratora po zalogowaniu do panelu, wygasa po 12
          godzinach.
        </li>
        <li>
          <code>__cf_bm</code>
          i
          <code>cf_clearance</code>
          — niezbędne, Cloudflare. Sieć Cloudflare i weryfikacja Turnstile mogą je zapisać, aby
          odróżnić ludzi od automatów; są krótkotrwałe (domyślnie do 30 minut).
        </li>
        <li>
          <code>_ga</code>
          i
          <code>_ga_*</code>
          — analityczne, Google Analytics. Odróżniają odwiedzających i sesje, przechowywane do 2
          lat. Tylko po zgodzie na analitykę.
        </li>
        <li>
          <strong>Umami</strong>
          — analityczny, na moim własnym serwerze. Nie zapisuje plików cookie i jest uruchamiany
          tylko po zgodzie na analitykę.
        </li>
      </ul>
      <p>
        Fonty i ikony są serwowane z tej domeny — strona nie pobiera ich z zewnętrznych serwerów.
      </p>
      <p>
        Przy pierwszej wizycie możesz zaakceptować analitykę, wybrać tylko niezbędne pliki lub
        dostosować ustawienia. Odmowa nie blokuje korzystania ze strony i formularzy. Zgodę możesz
        zmienić przez link „Ustawienia cookie” w stopce lub przycisk poniżej. Pliki cookie możesz
        też zablokować lub usunąć w ustawieniach przeglądarki; zablokowanie niezbędnych może
        uniemożliwić wysłanie formularza.
      </p>
      <button
        type="button"
        data-ui="button button-outline"
        class="
          inline-flex min-h-13 items-center justify-center gap-6 rounded-control border
          border-solid border-[#475362] bg-transparent px-6 py-[15px] text-[12px] font-bold
          whitespace-nowrap text-ink
          [transition:background_0.2s_ease,_color_0.2s_ease,_border-color_0.2s_ease]
          pointer-hover:hover:border-[#83a5c7] pointer-hover:hover:bg-[#172537]
          pointer-hover:hover:text-primary [&_svg]:[transition:transform_0.25s_var(--ease-out)]
          pointer-hover:[&:hover_svg]:[transform:translate(2px,_-2px)]
        "
        @click="openSettings"
      >
        Zmień ustawienia cookie
      </button>
      <h2>Analityka</h2>
      <p>
        Google Analytics 4 i Umami po Twojej zgodzie mierzą odwiedziny i wysłania formularzy.
        Pomagają ocenić, które treści są przydatne i jak użytkownicy korzystają ze strony. Strona
        nie korzysta z narzędzi reklamowych ani remarketingu.
      </p>
      <p>
        Skrypty tych usług nie są ładowane przed zgodą. Zdarzenia wysłania formularza przekazują
        jego typ; kod strony nie dołącza do nich imienia, adresu e-mail, telefonu ani treści
        wiadomości. Dostawcy mogą przetwarzać identyfikatory urządzenia, adres IP i dane o
        odwiedzinach zgodnie ze swoimi zasadami. Cofnięcie zgody zatrzymuje dalszy pomiar; nie usuwa
        automatycznie danych już przekazanych dostawcy.
      </p>
      <p>
        Informacje dostawcy:
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          polityka prywatności Google
        </a>
      </p>
      <h2>Zasady korzystania ze strony</h2>
      <p>
        Ta część jest regulaminem świadczenia usług drogą elektroniczną. Usługodawcą jest
        administrator wskazany na początku strony.
      </p>
      <ul>
        <li>
          Strona bezpłatnie udostępnia treści i blog, formularz kontaktowy oraz kalkulator
          orientacyjnej wyceny.
        </li>
        <li>
          Potrzebujesz urządzenia z dostępem do internetu i aktualnej przeglądarki z włączoną
          obsługą JavaScript. Formularze wymagają też działającego adresu e-mail.
        </li>
        <li>
          Korzystanie zaczyna się z chwilą wejścia na stronę lub wysłania formularza. Możesz je
          zakończyć w każdej chwili, opuszczając stronę.
        </li>
        <li>Przez formularze nie wolno przesyłać treści o charakterze bezprawnym.</li>
        <li>
          Wynik kalkulatora jest orientacyjny i nie stanowi oferty w rozumieniu Kodeksu cywilnego.
          Wiążące warunki ustalamy indywidualnie.
        </li>
        <li>
          Reklamacje dotyczące działania strony zgłoś na
          <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
          — odpowiem w ciągu 14 dni.
        </li>
      </ul>
    </div>
  </div>
</template>
