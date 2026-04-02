# BUG-FEAT5-UX-003: Titel im S-01c nutzt text-base statt body-sm (text-sm)

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Low
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die UX-Spec definiert fuer den gedimmten Titeltext im S-01c: `style-body-sm`. In `DeleteConfirmInline.css` (Zeile 13) nutzt `.delete-confirm__title` jedoch `font-size: var(--text-base)` – also die normale Body-Groesse, nicht die kleinere `sm`-Variante.

Das fuehrt dazu dass der Titel im Bestaetigungszustand dieselbe Schriftgroesse hat wie im Normalzustand. Die UX-Spec sieht `body-sm` vor, um visuell zu signalisieren dass dieser Text im Bestaetigungskontext eine untergeordnete Rolle spielt und der Fokus auf den Buttons liegt. Der "Löschen?"-Text daneben nutzt korrekt `var(--text-sm)` – dadurch wirkt der Titel aktuell groesser als der Fragetext, was die visuelle Hierarchie invertiert.

## Steps to Reproduce

1. Todo mit laengerem Titel anlegen (z.B. "Einkaufen gehen")
2. ×-Button klicken um S-01c zu oeffnen
3. Schriftgroesse des Titeltexts mit dem "Löschen?"-Text vergleichen

Expected: Titeltext ist in `body-sm` (kleiner, gedimmt) – gleiches Schriftbild wie der "Löschen?"-Text, der auch `text-sm` nutzt

Actual: Titeltext ist in `text-base` – groesser als der "Löschen?"-Text, visuelle Hierarchie wirkt invertiert

## Empfehlung

In `DeleteConfirmInline.css` `.delete-confirm__title` auf `font-size: var(--text-sm)` aendern, damit Titel und Fragetext dieselbe Groesse haben und die Spec eingehalten wird.

## Priority

Nice-to-have
