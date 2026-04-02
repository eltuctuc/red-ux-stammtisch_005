# BUG-FEAT1-UX-007: Sticky Input-Bereich streckt sich ueber volle Viewport-Breite, Content-Bereich ist auf 640px zentriert

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Low
- **Bereich:** UX / Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Der sticky Eingabebereich (`.todo-input-area`) nimmt die volle Viewport-Breite ein. Der Content-Bereich darunter (`main`) ist per `max-width: 640px; margin: 0 auto` auf 640px zentriert.

Auf breiten Viewports (z.B. 1280px oder groesser) erzeugt das eine sichtbare visuelle Inkonsistenz:
- Der Input-Balken streckt sich von Kante zu Kante
- Das Eingabefeld (`flex: 1`) wuchert entsprechend auf die volle Viewport-Breite minus Button
- Der Todo-Content darunter ist schmal zentriert

Das Ergebnis: Der Input-Bereich und der Content-Bereich sind nicht visuell ausgerichtet. Das Eingabefeld wirkt "zu gross" und passt optisch nicht zur Liste darunter.

## Steps to Reproduce

1. App in einem breiten Browserfenster oeffnen (z.B. 1280px oder groesser)
2. Einen oder mehrere Todos anlegen

Expected: Input-Balken und Todo-Liste sind visuell auf dieselbe Breite ausgerichtet.
Actual: Input-Balken erstreckt sich ueber die volle Fensterbreite, Todo-Liste ist schmal zentriert.

## Empfehlung

Den inneren Inhalt des `.todo-input-area` in einen `max-width`-Container einbetten, der dieselben Werte wie `main` verwendet (`max-width: 640px`, `margin: 0 auto`). Der sticky Hintergrund kann weiterhin die volle Breite belegen – nur der Inhalt (Label, Input, Button) wird begrenzt:

```css
.todo-input-area {
  position: sticky;
  top: 0;
  /* Hintergrund weiterhin full-width */
}

.todo-input-area__inner {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-8);
}
```

Alternativ: denselben `max-width`-Wert direkt auf `.todo-input-area` setzen und `margin: 0 auto` erganzen – dann entfaellt der separate sticky Hintergrund ueber die volle Breite.

## Priority

Nice-to-have
