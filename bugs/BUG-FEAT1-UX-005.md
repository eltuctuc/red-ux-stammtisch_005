# BUG-FEAT1-UX-005: Empty-State-Titel als h1 erzeugt inkonsistente Heading-Hierarchie

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Low
- **Bereich:** A11y / Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

In `App.tsx` Zeile 23 wird der Empty-State-Titel "Noch keine Todos" als `<h1>` ausgezeichnet. Sobald Todos vorhanden sind (S-01), verschwindet dieses `<h1>` und es gibt kein Heading mehr auf der Seite. Die Heading-Hierarchie ist damit zustandsabhaengig und inkonsistent.

Ausserdem entspricht `<h1>` laut DS-Typografie-Spec (`style-h1`: text-4xl, bold) einem Hero-Level-Titel. Der Empty-State-Titel hat in `App.css` aber die Stilisierung eines `text-xl`-Elements (1.25rem, font-weight 600). Die semantische Ebene (h1) und der visuelle Stil (xl, nicht 4xl) passen nicht zusammen.

Screenreader-Nutzer erhalten beim Navigieren per Headings ein `<h1>` "Noch keine Todos" – aber wenn Todos vorhanden sind, keine Ueberschrift mehr. Das macht die Seitenstruktur schwerer einschaetzbar.

## Steps to Reproduce

1. App ohne Todos oeffnen: Screenreader liest h1 "Noch keine Todos"
2. Todo hinzufuegen: h1 verschwindet, keine Heading-Struktur mehr auf der Seite

Expected: Konsistente Heading-Hierarchie unabhaengig vom Todo-Zustand; semantisches Level passt zum visuellen Gewicht.
Actual: h1 nur im Empty State, kein Heading bei gefuellter Liste; h1-Semantik mit xl-Styling vermischt.

## Empfehlung

Den Empty-State-Titel als `<p>` oder `<h2>` auszeichnen – passend zum visuellen Gewicht (text-xl entspricht eher h4/h5 im DS). Eine dauerhafte `<h1>`-Ueberschrift fuer die Seite (z.B. "Meine Todos") entweder sichtbar erganzen oder als `sr-only` setzen, damit Screenreader-Nutzer immer einen stabilen Seitentitel haben.

## Priority

Nice-to-have
