# BUG-FEAT5-UX-004: Abstand zwischen "Löschen?"-Label und Buttons zu gering

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Low
- **Bereich:** Konsistenz
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die Spec fordert `margin-right: spacing-3` für das `.delete-confirm__question`-Element, um einen deutlich sichtbaren visuellen Abstand zwischen dem "Löschen?"-Label und den Buttons "Abbrechen" / "Löschen" zu erzeugen.

Implementiert ist stattdessen `gap: var(--spacing-2)` am Container-Level, das gleichmässig zwischen allen Flex-Kindern gilt (Title → Question → Abbrechen → Löschen). Das "Löschen?"-Label hat dadurch nur `spacing-2` Abstand zu "Abbrechen" statt dem spezifizierten `spacing-3`.

Visuell klebt das Label zu eng an den Buttons. Die semantische Trennung zwischen "beschreibendem Text" und "handlungsauslösenden Buttons" wird optisch zu wenig betont.

## Steps to Reproduce

1. Ein Todo öffnen
2. Den Löschen-Button (×) klicken
3. Den Abstand zwischen dem Text "Löschen?" und dem Button "Abbrechen" beobachten
4. Expected: Abstand entspricht `spacing-3` (12px bei Standard-Basis)
5. Actual: Abstand entspricht `spacing-2` (8px), identisch zu allen anderen Gap-Abständen in der Zeile

## Empfehlung

Das `gap: spacing-2` am Container kann bleiben. Zusätzlich `margin-right: var(--spacing-3)` direkt auf `.delete-confirm__question` setzen. Damit bekommt das Label nach rechts hin den spezifizierten grösseren Abstand zu den Buttons, während die übrigen Abstände unverändert bleiben.

## Priority

Nice-to-have
