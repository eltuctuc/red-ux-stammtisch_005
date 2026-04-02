# BUG-FEAT4-UX-002: Schriftgröße wechselt beim Übergang Span → Input (14px vs. 16px)

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** Visual
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Der Titel-Span im Anzeige-Modus nutzt `font-size: var(--text-base)` (16px, definiert in `TodoItem.css` Zeile 16). Das Inline-Input nutzt `font-size: var(--text-sm)` (14px, definiert in `TodoEditInput.css` Zeile 6).

Beim Doppelklick auf einen Todo-Titel wechselt der angezeigte Text sichtbar von 16px auf 14px. Der eingetippte Inhalt ist 2px kleiner als der angezeigte Titel. Nach Bestätigung springt der Text wieder auf 16px zurück.

Die Spec begründet die Wahl von Input sm (32px) explizit mit Layout-Shift-Vermeidung: "Input-Feld ersetzt den Titel-Text an genau derselben Position." Diese Begründung ist durch die unterschiedlichen Schriftgrößen nicht erfüllt.

Das ist keine genehmigte Abweichung im DS-Status-Abschnitt des Feature-Files.

## Steps to Reproduce

1. Todo mit mittellangem Titel anlegen (z.B. "Einkaufen gehen")
2. Doppelklick auf den Titel
3. Beobachten wie groß der Text im Input ist im Vergleich zum umgebenden Text in anderen Todos

Expected: Text im Input hat gleiche Schriftgröße wie der Titel-Span (16px / `text-base`), damit der Übergang visuell nahtlos wirkt.

Actual: Text im Input ist 14px (`text-sm`), sichtbar kleiner als der 16px-Titel-Span. Beim Bestätigen springt der Text zurück auf 16px.

## Empfehlung

In `TodoEditInput.css` `font-size` von `var(--text-sm)` auf `var(--text-base)` ändern. Die DS Input sm Spec schreibt `text-sm` vor, aber für diesen spezifischen Inline-Edit-Anwendungsfall – wo der Input ein 16px-Textelement ersetzt – ist `text-base` die richtige Entscheidung. Die Abweichung sollte als Hypothesentest im Feature-File dokumentiert werden.

Alternativ: Den Titel-Span auf `text-sm` umstellen (aber das würde FEAT-2/3-Entscheidungen berühren und ist aufwändiger).

## Priority

Fix before release
