# BUG-FEAT4-UX-005: Titel-Span als Schaltfläche ohne erkennbare Aktionsbeschreibung für Screenreader

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed

## Problem

Der Titel-Span hat `role="button"` und `tabIndex={0}`. Der zugängliche Name der Schaltfläche ergibt sich aus dem Textinhalt des Spans – also dem Todo-Titel (z.B. "Einkaufen gehen"). Ein Screenreader kündigt an: "Einkaufen gehen, Schaltfläche".

Diese Ankündigung beschreibt den Inhalt, aber nicht die Funktion. Ein SR-Nutzer weiß nicht, dass ein Klick oder Enter den Edit-Modus öffnet. "Einkaufen gehen, Schaltfläche" gibt keinerlei Hinweis auf die Aktion "Bearbeiten".

Sehende Nutzer haben visuellen Kontext (Hover-Cursor, Produktkenntnis durch Onboarding). SR-Nutzer navigieren semantisch und sind auf Funktionsbeschreibungen angewiesen.

Das verletzt WCAG 2.1 SC 4.1.2 (Name, Role, Value): Der zugängliche Name eines interaktiven Elements soll seine Funktion beschreiben, nicht nur seinen Inhalt.

## Steps to Reproduce

1. VoiceOver (macOS) oder NVDA (Windows) aktivieren
2. Tab-Navigation bis zum Todo-Titel
3. Ankündigung des Screenreaders anhören

Expected: SR kündigt an: "Einkaufen gehen bearbeiten, Schaltfläche"
Actual: SR kündigt an: "Einkaufen gehen, Schaltfläche" – keine Aktion erkennbar

## Empfehlung

`aria-label` auf dem Span ergänzen, das den Titel und die Aktion kombiniert:

```tsx
<span
  className="todo-item__title"
  role="button"
  tabIndex={0}
  aria-label={`${todo.title} bearbeiten`}
  onDoubleClick={onDoubleClick}
  onKeyDown={...}
>
  {todo.title}
</span>
```

Der visuelle Text bleibt unverändert (`{todo.title}`), der SR-Nutzer hört aber "Einkaufen gehen bearbeiten, Schaltfläche".

## Priority

Fix before release
