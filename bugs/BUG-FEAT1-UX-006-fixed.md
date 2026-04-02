# BUG-FEAT1-UX-006: aria-label auf div ohne role hat keine Wirkung

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02 – `aria-label` vom rollenlosen `div` entfernt (Option A); Empty State als eigene Komponente mit sauberem Markup in FEAT-2 umgesetzt

## Problem

In `App.tsx` Zeile 21 hat das Empty-State-Container-Element `aria-label="Leere Todo-Liste"` gesetzt:

```tsx
<div className="empty-state" aria-label="Leere Todo-Liste">
```

Ein `<div>` hat keine implizite ARIA-Rolle. Das `aria-label`-Attribut ist nur wirksam auf Elementen die eine Rolle haben – entweder nativ (wie `<button>`, `<input>`, `<nav>`) oder explizit per `role`-Attribut. Auf einem rollenlosen `<div>` wird `aria-label` von Screenreadern ignoriert. Die Beschriftung "Leere Todo-Liste" wird damit nie vorgelesen.

Dies ist kein schlimmer Fehler, da der Empty State keinen interaktiven Inhalt enthält und der eigentliche Textinhalt des Divs (Titel, Hinweis) direkt von Screenreadern gelesen wird. Aber das Label taeuscht eine Screenreader-Auszeichnung vor, die real nicht funktioniert – das ist irrefuehrendes Markup.

## Steps to Reproduce

1. App ohne Todos oeffnen (S-01a)
2. Screenreader aktivieren (z.B. VoiceOver auf macOS)
3. Durch den Empty-State-Bereich navigieren

Expected: Die Beschriftung "Leere Todo-Liste" wird als Container-Label ausgegeben, oder das Element ist semantisch klar strukturiert.
Actual: Das `aria-label` auf dem `<div>` wird ignoriert. Screenreader liest lediglich den Textinhalt der Kind-Elemente.

## Empfehlung

Zwei Optionen:

**Option A (minimal):** `aria-label` entfernen, da es keine Wirkung hat und irrefuehrendes Markup erzeugt. Der Textinhalt des Empty State kommuniziert den Zustand ausreichend.

```tsx
<div className="empty-state">
```

**Option B (semantisch korrekt):** Eine `role` erganzen, damit das `aria-label` Wirkung entfalten kann. Zum Beispiel `role="status"` mit `aria-live="polite"` – damit wuerde der Empty State als Status-Meldung kommuniziert, wenn er erscheint oder verschwindet:

```tsx
<div className="empty-state" role="status" aria-label="Leere Todo-Liste">
```

Option B ist die sauberere Loesung aber erfordert Abstimmung mit dem A11y-Konzept fuer FEAT-2 (wo Todos hinzukommen und der Empty State verschwindet). Option A ist die sichere sofortige Massnahme.

## Priority

Fix before release
