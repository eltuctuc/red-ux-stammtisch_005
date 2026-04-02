# BUG-FEAT4-UX-003: Kein SR-Feedback nach Abschluss des Edit-Vorgangs

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed

## Problem

Die `<ul class="todo-list">` hat `aria-live="polite"` und `aria-relevant="additions"`. Das `aria-relevant="additions"` beschränkt die Live-Region-Ankündigungen auf Hinzufügungen – Änderungen und Entfernungen werden nicht angekündigt.

Wenn der Edit-Modus beendet wird (Input verschwindet, Span mit neuem Titel erscheint), ist das aus DOM-Perspektive eine Entfernung (Input) und eine Hinzufügung (Span). Da `aria-relevant="additions"` nur Hinzufügungen berücksichtigt, wird der neue Span-Inhalt unter Umständen angekündigt, aber das Feedback ist unvollständig und browserabhängig.

In der Praxis bedeutet das: Ein Screenreader-Nutzer drückt Enter, der Fokus kehrt auf das `<li>` zurück – aber der SR kündigt nicht explizit an, ob der Titel gespeichert oder verworfen wurde. Der Nutzer hat keine Bestätigung erhalten.

Die Spec notiert: "SR erkennt den State-Wechsel (Input → Text) im Dokument automatisch wenn Fokus zurückgeht." Diese Annahme ist nicht zuverlässig – das Verhalten ist browserabhängig und nicht garantiert.

## Steps to Reproduce

1. Screenreader aktivieren (z.B. VoiceOver macOS)
2. Todo per Keyboard fokussieren (muss nach BUG-FEAT4-UX-001 erst gefixt werden, oder Maus für Doppelklick nutzen)
3. Edit-Modus öffnen, Titel ändern, Enter drücken

Expected: SR kündigt an, dass der Titel gespeichert wurde, z.B. "Einkaufen gehen – gespeichert" oder der neue Titel wird vorgelesen wenn der Fokus auf das `<li>` zurückkehrt.

Actual: SR-Feedback beim Abschluss ist unklar und browserabhängig. Bei Escape (Abbruch) gibt es keinerlei Rückmeldung dass eine Aktion stattgefunden hat und verworfen wurde.

## Empfehlung

`aria-relevant` von `"additions"` auf `"additions text"` ändern, damit auch Textänderungen angekündigt werden. Oder die Live-Region-Strategie überdenken: Eine dedizierte, visuell versteckte `aria-live="polite"`-Region außerhalb der Liste mit einer kurzen Statusmeldung ("Titel gespeichert" / "Bearbeitung abgebrochen") ist die zuverlässigste Lösung für klares SR-Feedback nach jeder Aktion.

## Priority

Fix before release
