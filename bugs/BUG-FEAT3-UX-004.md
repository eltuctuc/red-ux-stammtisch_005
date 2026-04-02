# BUG-FEAT3-UX-004: line-height im TodoItem-Titel hard-coded statt DS-Token

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Medium
- **Bereich:** Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

In `TodoItem.css` ist für `.todo-item__title` der `line-height`-Wert direkt als numerischer Wert eingetragen:

```css
.todo-item__title {
  line-height: 1.5;
}
```

Der Wert `1.5` entspricht `leading-normal` aus dem Typografie-Token-System, ist aber nicht als Token-Referenz (`var(--leading-normal)`) eingetragen. Das ist ein Verstoß gegen die DS-Compliance-Anforderung, die laut FEAT-3 UX (Abschnitt 2, DS-Status) vorschreibt: ausschließlich Tokens – kein Hardcoding.

Sollte der `leading-normal`-Token systemweit angepasst werden, bleibt dieser Wert stumm und erzeugt visuelle Inkonsistenz.

## Steps to Reproduce

1. `TodoItem.css` öffnen, Zeile `.todo-item__title { line-height: 1.5 }` inspizieren

Expected: `line-height: var(--leading-normal)`
Actual: `line-height: 1.5` (hardcoded)

## Empfehlung

```css
.todo-item__title {
  line-height: var(--leading-normal);
}
```

Sicherstellen dass `--leading-normal` im globalen CSS-Token-File definiert ist (Wert: 1.5).

## Priority

Fix before release
