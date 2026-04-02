# BUG-FEAT1-UX-004: Empty State und Todo-Item-Styles in App.css verwenden hardcodierte Farbwerte statt DS-Tokens

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

`App.css` enthaelt im Empty-State-Bereich (S-01a) sowie im minimalen Todo-Listen-Styling mehrere hardcodierte Hex-Werte, obwohl aequivalente DS-Tokens definiert und in `TodoInputArea.css` bereits korrekt genutzt werden. Betroffen ist Feature-Code (nicht nur Platzhalter):

| Stelle (App.css) | Hardcodierter Wert | Korrekter Token |
|---|---|---|
| `.empty-state__title` (Zeile 32) | `color: #111827` | `var(--color-text-primary)` |
| `.empty-state__hint` (Zeile 38) | `color: #4b5563` | `var(--color-text-secondary)` oder `var(--color-neutral-600)` |
| `.todo-item` (Zeile 43) | `background-color: #ffffff` | `var(--color-neutral-0)` |
| `.todo-item` (Zeile 44) | `border: 1px solid #e5e7eb` | `var(--color-border-default)` |
| `.todo-item` (Zeile 45) | `border-radius: 0.25rem` | `var(--radius-default)` |
| `.todo-item` (Zeile 47) | `color: #111827` | `var(--color-text-primary)` |

Der Empty State (S-01a) ist kein Platzhalter – er ist Feature-Code fuer den definierten Screen-Zustand.

Zusaetzlich: `main`-Padding (Zeile 12) ist als `2rem 2rem` hardcodiert statt `var(--spacing-8) var(--spacing-8)`.

## Steps to Reproduce

1. App ohne Todos oeffnen (S-01a)
2. CSS der Empty-State-Elemente in DevTools inspizieren

Expected: Alle Farbwerte und Radii referenzieren DS-Tokens per `var()`.
Actual: Hardcodierte Hex-Werte und rem-Werte ohne Token-Referenz.

## Empfehlung

Alle betroffenen Stellen in `App.css` auf CSS-Custom-Properties umstellen. Die Token-Werte sind in `TodoInputArea.css` `:root`-Block bereits definiert – ein einfaches Ersetzen genuegt.

Hinweis: Der Todo-Item-Bereich (`todo-list`, `todo-item`) ist als FEAT-2-Platzhalter markiert. Die Empfehlung, diesen sauber umzustellen, hat etwas niedrigere Prioritaet als der Empty-State-Bereich, der FEAT-1-eigener Code ist.

## Priority

Fix before release
