# BUG-FEAT2-QA-001: index.css ist unveränderter Vite-Template-Default und interferiert mit DS-Token-System

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** High
- **Bereich:** Functional / Performance
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

`projekt/src/index.css` ist der unveränderte Vite-Template-Default. Diese Datei wird als erstes in `main.tsx` (Zeile 3) importiert und enthält:

1. Einen eigenen `:root`-Block mit CSS-Variablen (`--text`, `--bg`, `--accent`, `--sans`, `--heading`, `--mono` etc.) die nicht zum DS-Token-System des Projekts gehören und nicht verwendet werden.
2. `font: 18px/145% var(--sans)` als globalen Body-Font – das setzt Font-Size und Line-Height für das gesamte Dokument auf Werte die vom DS-Token-System (`--font-family-base`, `--text-base: 1rem`) abweichen. `var(--sans)` ist nicht `var(--font-family-base)`.
3. `#root { width: 1126px; max-width: 100%; margin: 0 auto; text-align: center; border-inline: 1px solid var(--border); }` – der `#root`-Selektor greift direkt in das Root-Element ein. `text-align: center` zentriert den gesamten Text in der App, was durch komponentenseitige Styles aktuell überdeckt wird, aber neue Komponenten ohne explizites `text-align: left` werden zentrierten Text erben.
4. `color-scheme: light dark` aktiviert automatischen Dark-Mode. Das DS-Token-System ist ausschließlich für Light-Mode spezifiziert. Im Dark-Mode rendert die App mit System-Dark-Colors für native Browser-Elemente (Scrollbars, Inputs) gemischt mit den hellen DS-Tokens – das führt zu inkonsistenten visuellen Ergebnissen.
5. Einen vollständigen `@media (prefers-color-scheme: dark)` Block mit eigenen Farbvariablen, die mit den DS-Tokens des Projekts nicht abgestimmt sind.

## Steps to Reproduce / Nachweis

Nachweis durch direkte Code-Inspektion:

- `/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/main.tsx`, Zeile 3: `import './index.css'`
- `/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/index.css`, Zeilen 1–112: Vite-Template-Inhalt unverändert

Konkret prüfbar:
1. App in einem Browser öffnen mit System-Dark-Mode aktiviert → Native Input-Elemente und Scrollbars rendern mit Dark-Mode-Styles, während der Hintergrund (`color-bg-page: #f9fafb` aus `App.css`) hell bleibt.
2. Browser-DevTools: `document.querySelector('#root')` → `computedStyle.textAlign` ergibt `"center"` (aus `index.css` Zeile 55).
3. Browser-DevTools: `computedStyle(document.body).fontSize` ergibt `"18px"` statt dem erwarteten `"16px"` des Standard-Browsers (durch `font: 18px/145%` in `index.css`).

## Empfehlung

`index.css` auf das Nötigste reduzieren. Alles Projektfremde entfernen:

```css
/* index.css – nur globale Reset-Regeln */
body {
  margin: 0;
}
```

Der DS-Token `:root`-Block in `TodoInputArea.css` (Zeilen 1–38) sollte in eine dedizierte `tokens.css` oder direkt in `index.css` verschoben werden, damit alle Tokens vor allen Komponenten geladen sind.

## Priority
Fix before release
