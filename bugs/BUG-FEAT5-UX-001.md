# BUG-FEAT5-UX-001: Status-Toggle fehlt im S-01c statt visibility:hidden

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Medium
- **Bereich:** UX
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die UX-Spec definiert fuer den S-01c-Zustand (Inline-Bestätigungszeile) dass der Status-Toggle `visibility: hidden` gesetzt wird – also im Layout verbleibt und Platz haelt, aber nicht sichtbar ist. In der Implementierung wird der gesamte `<li>`-Inhalt durch `<DeleteConfirmInline>` ersetzt. Der Status-Toggle ist nicht im DOM enthalten.

Das fuehrt zu einer abweichenden Geometrie: Der Titeltext bekommt den Platz des Toggles, das Layout der Bestaetigungszeile ist schmaler als das des normalen Todo-Items. Beim Umschalten von idle zu confirming wirkt die Zeile optisch anders dimensioniert – ein visueller Sprung entsteht.

## Steps to Reproduce

1. Mindestens ein Todo anlegen
2. Mit der Maus ueber das Todo-Item hovern – der ×-Button erscheint
3. ×-Button klicken
4. S-01c beobachten

Expected: Die Bestaetigungszeile haelt denselben linken Offset wie das normale Todo-Item – ein unsichtbarer Status-Toggle-Platzhalter ist vorhanden (`visibility: hidden`)

Actual: Die Bestaetigungszeile beginnt ohne Toggle-Platzhalter. Der Titeltext faengt am linken Rand des Innenabstands an, nicht auf Hoehe des Titels im normalen Zustand. Das Layout springt beim Uebergang.

## Empfehlung

Im `isConfirming`-Zweig von `TodoItem` (Zeile 66-80 in `TodoItem.tsx`) einen `<StatusToggle>`-Platzhalter mit `style={{ visibility: 'hidden' }}` vor `<DeleteConfirmInline>` einfuegen. Damit bleibt die Zeilengeometrie konsistent.

## Priority

Fix before release
