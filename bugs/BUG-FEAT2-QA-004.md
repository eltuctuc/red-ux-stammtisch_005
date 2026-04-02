# BUG-FEAT2-QA-004: DS-Token-Block in komponentenspezifischer CSS definiert statt global

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Medium
- **Bereich:** Functional / Performance
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Der gesamte `:root`-Block mit allen DS-CSS-Variablen (Colors, Spacing, Radius, Typography, Shadows) ist in `TodoInputArea.css` (Zeilen 1–38) definiert – einer komponentenspezifischen CSS-Datei.

```css
/* TodoInputArea.css, Zeilen 1–38 */
:root {
  --color-primary-300: #93c5fd;
  --color-primary-500: #3b82f6;
  /* ... 20+ weitere DS-Tokens */
}
```

**Problem:** DS-Tokens sind globale Designentscheidungen, keine Komponentendetails. Die aktuelle Platzierung erzeugt folgende Risiken:

1. **Ladereihenfolge-Abhängigkeit:** Alle FEAT-2-Komponenten (`TodoListArea.css`, `TodoItem.css`, `EmptyState.css`) verwenden diese Tokens. Sie funktionieren nur, weil `TodoInputArea` im Component-Tree vor ihnen gerendert wird und Vite die CSS-Dateien in Render-Reihenfolge bundelt. Eine Umstrukturierung des Component-Trees könnte die Token-Verfügbarkeit brechen.

2. **FEAT-3/4/5-Komponenten:** Neue Komponenten (Status-Toggle, Edit, Delete) werden eigene CSS-Dateien haben. Wenn diese Komponenten in einem Kontext gerendert werden wo `TodoInputArea` nicht vorhanden ist (z.B. Storybook, isolierte Tests), sind die Tokens nicht verfügbar.

3. **Semantische Falschzuordnung:** Ein Entwickler der `TodoInputArea.css` modifiziert oder umbenennt, ist nicht offensichtlich dass er damit das gesamte Design-System des Projekts ändert.

4. **Doppelter `:root`-Block:** `index.css` hat ebenfalls einen `:root`-Block mit eigenen Variablen (Zeilen 1–31). Zwei `:root`-Blöcke in derselben Seite – die letztgeladene überschreibt gleichnamige Variablen. Da die Token-Namen sich nicht überschneiden, gibt es aktuell keinen Konflikt. Das ist aber ein strukturelles Risiko.

## Steps to Reproduce / Nachweis

```
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoInputArea.css Zeilen 1–38: DS-Token :root Block
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/index.css Zeilen 1–31: Vite-Default :root Block
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoListArea.css: verwendet --color-border-default, --radius-default, --color-neutral-0 – alle aus TodoInputArea.css
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoItem.css: verwendet --spacing-3, --spacing-4, --color-neutral-0, --color-border-default, --text-base, --color-text-primary, --color-text-secondary – alle aus TodoInputArea.css
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/EmptyState.css: verwendet --text-base, --text-sm, --color-text-primary, --color-text-secondary, --color-text-disabled – alle aus TodoInputArea.css
```

## Empfehlung

Den `:root`-Token-Block aus `TodoInputArea.css` herauslösen und in eine dedizierte `tokens.css` (oder direkt bereinigt in `index.css`) verschieben, die in `main.tsx` als erstes importiert wird. Damit sind alle DS-Tokens global verfügbar, unabhängig von Komponenten-Ladereihenfolge.

Gleichzeitig `index.css` auf den projekteigenen Inhalt reduzieren (siehe BUG-FEAT2-QA-001).

## Priority
Fix before release
