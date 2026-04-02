# BUG-FEAT5-UX-002: "Löschen?"-Text ist aria-hidden und fuer Screenreader unsichtbar

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Fixed

## Problem

Der sichtbare Text "Löschen?" in `DeleteConfirmInline.tsx` (Zeile 51) hat das Attribut `aria-hidden="true"`. Damit ist der einzige sichtbare Kontext-Text der dem Nutzer erklaert was gerade passiert ("Du bist dabei ein Todo zu loeschen – bist du sicher?") fuer Screenreader komplett unsichtbar.

Die `aria-live`-Ankuendigung sagt "Löschen bestätigen?" – das deckt den initialen Moment ab, wenn die Bestaetigungszeile erscheint. Aber ein SR-Nutzer der danach mit Tab durch die Buttons navigiert, hoert nur "Abbrechen, Schaltfläche" und "Löschen, Schaltfläche" – ohne den Kontext der Frage. Der `role="group"` mit `aria-label="Löschen bestätigen"` auf dem Container hilft, wird aber von manchen SR nicht bei jeder Tab-Bewegung vorgelesen.

`aria-hidden` auf sichtbarem, bedeutungstragendem Text verletzt WCAG 1.3.1 (Info and Relationships) und 4.1.2 (Name, Role, Value).

## Steps to Reproduce

1. Todo anlegen
2. Screenreader aktivieren (VoiceOver / NVDA)
3. ×-Button per Tab fokussieren und Enter druecken
4. SR-Ausgabe nach dem Oeffnen der Bestaetigungszeile beobachten
5. Per Tab zum Löschen-Button navigieren

Expected: SR liest den Kontext "Löschen?" vor wenn durch den Bereich navigiert wird, oder der Group-Container kommuniziert den vollstaendigen Kontext zuverlaessig

Actual: "Löschen?"-Text ist `aria-hidden` – SR ueberspringt ihn. Nur Buttons "Abbrechen" und "Löschen" ohne umgebenden Fragetext sind hoerbar.

## Empfehlung

`aria-hidden="true"` vom `<span className="delete-confirm__question">` entfernen. Der Text ist bedeutungstragend und soll von SR vorgelesen werden. Die `aria-live`-Ankuendigung und dieser Text ergaenzen sich sinnvoll – es gibt keinen Grund ihn zu verstecken.

## Priority

Fix before release

## Fix
*2026-04-03* – Implementiert und getestet.
