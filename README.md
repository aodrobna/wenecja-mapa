# Wenecja – interaktywna mapa / GitHub Pages

Gotowy projekt statycznej strony z **47 miejscami** (atrakcje, jedzenie, noclegi, transport). Nie wymaga hostingu płatnego, klucza Google Maps ani instalowania Node.js. Plik otwiera się lokalnie jako `index.html`, a na GitHub Pages działa pod zwykłym linkiem www.

## Jak uruchomić przez Claude Code

1. Rozpakuj ZIP na komputerze do katalogu np. `wenecja-mapa`.
2. Otwórz **Claude Code** w tym katalogu i wklej tekst z `PROMPT_DLA_CLAUDE_CODE.md`.
3. Claude Code przejrzy pliki, poprawi i opublikuje repozytorium z Twoją zgodą i z dostępem do GitHub.
4. W repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
5. Przy pierwszym wypchnięciu do gałęzi `main` uruchomi się workflow `.github/workflows/deploy.yml`. Po sukcesie adres znajdziesz w ustawieniach Pages lub zakładce Actions.

Na GitHub Pages projekt jest stroną publiczną, o ile nie masz specjalnego prywatnego hostingu. **Z tego powodu nie umieszczono w niej prywatnych numerów telefonów**. Są w prywatnym PDF. Dopisz je na stronie wyłącznie za zgodą właścicieli, wiedząc, że mogą być widoczne dla całego internetu.

## Gdy nie masz Claude Code

1. Utwórz nowe repozytorium na GitHub i dodaj zawartość katalogu (nie sam plik ZIP).
2. Upewnij się, że `index.html` leży w głównym katalogu repozytorium.
3. Włącz **GitHub Actions** jako źródło w Settings → Pages.
4. Sprawdź zakładkę Actions; po pomyślnym wdrożeniu link ma zazwyczaj postać `https://TWOJ-LOGIN.github.io/NAZWA-REPOZYTORIUM/`.

## Jak edytować

- Miejsca: `assets/places.js` (jedyny plik z danymi miejsc).
- Wygląd: `assets/styles.css`.
- Zachowanie, wyszukiwarka, filtry i pinezki: `assets/app.js`.
- Układ i treści nagłówka: `index.html`.

Link przy miejscu jest budowany z pola `query` i otwiera wyszukiwanie miejsca w Google Maps. Współrzędne `lat`/`lon` na mapie są **orientacyjne**, nie stanowią potwierdzenia dokładnego wejścia. Claude Code może później zweryfikować je pojedynczo. Gdy podkład Leaflet/OpenStreetMap nie ładuje się (np. blokada CDN w podglądzie załącznika), strona pokazuje **poglądowy, klikalny schemat** i listę z Google Maps.

## Jak sprawdzić lokalnie

Otwórz `index.html` podwójnym kliknięciem. Filtry, wyszukiwarka i lista powinny działać nawet bez bibliotek pobieranych z internetu. Pełny podkład mapowy wymaga dostępu do Leaflet i OpenStreetMap.

## Licencje i atrybucja

Interfejs opiera się na bibliotece Leaflet (BSD 2-Clause), którą ładuje z CDN. Podkład mapy: © OpenStreetMap contributors. Ikona i rysunek wykonane jako proste wektorowe elementy własne; nie ma zdjęć ani zależności od licencjonowanych grafik.
