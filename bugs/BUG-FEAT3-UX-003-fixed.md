# BUG-FEAT3-UX-003: Kein Hover-State für erledigten (checked) Toggle

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Medium
- **Bereich:** UX
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Der Hover-State in `StatusToggle.css` ist auf `unchecked + not(:disabled)` beschränkt:

```css
.status-toggle:hover .status-toggle__input:not(:checked):not(:disabled) {
  border-color: var(--color-neutral-600);
}
```

Fährt der Nutzer mit der Maus über einen bereits erledigten (checked, blau ausgefüllten) Toggle, passiert visuell nichts. Es gibt keinen Hinweis, dass ein erneuter Klick den Status zurücksetzen würde. Der Reverse-Toggle (erledigt → offen) ist damit schwerer auffindbar als der Forward-Toggle (offen → erledigt).

Laut UX-Spec (FEAT-3, Abschnitt 1, User Story): "Als Pragmatiker möchte ich ein versehentlich erledigtes Todo wieder auf 'offen' setzen können." Diese Aktion braucht eine erkennbare Affordanz.

## Steps to Reproduce

1. Todo anlegen und als erledigt markieren (Toggle ist blau/checked)
2. Maus über den blauen Toggle hovern

Expected: Visuelles Feedback das andeutet "dieser Zustand ist klickbar / reversibel" (z.B. leichte Aufhellung, opacity-Änderung oder border-Anpassung)
Actual: Kein visueller Hover-Effekt – Toggle wirkt statisch und nicht interaktiv

## Empfehlung

Hover-State für checked Toggle ergänzen, z.B. Aufhellung des Primary-Hintergrunds:

```css
.status-toggle:hover .status-toggle__input:checked:not(:disabled) {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}
```

Alternativ: Leichte Opacity-Reduktion (0.85) als dezente "reversible" Andeutung.

## Priority

Fix before release

---
**Status:** Fixed – 2026-04-03
