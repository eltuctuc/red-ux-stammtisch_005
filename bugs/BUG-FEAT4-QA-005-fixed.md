# BUG-FEAT4-QA-005: Fehlende Tests für Spec-definierte Edge Cases (nur-Leerzeichen + Blur, erledigtes Todo, 200-Zeichen-Limit)

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Fixed

## Beschreibung

Die Spec (FEAT-4-todo-bearbeiten.md, Abschnitt "Test-Setup") listet mehrere Integrations-Tests die implementiert werden sollen. Folgende sind nicht vorhanden:

### 1. Nur-Leerzeichen + Blur → Original-Titel bleibt

Die Spec fordert explizit:
> "Blur mit leerem Wert → Original-Titel wiederhergestellt"

Der vorhandene Test "Blur speichert neuen Titel" testet den Happy-Path. Kein Test prüft `Blur mit nur-Leerzeichen-Inhalt → onCancel`. Die Komponenten-Unit-Tests in `TodoEditInput.test.tsx` testen dies für Blur korrekt (`ruft onCancel auf wenn Blur mit leerem Inhalt`). Aber der Integrationstest auf `App`-Ebene fehlt – er würde sicherstellen dass der Reducer-Pfad korrekt greift.

### 2. Doppelklick auf erledigtes Todo öffnet Edit-Modus

Die Spec definiert den Edge Case:
> "Doppelklick auf erledigtes Todo: Bearbeitungsmodus öffnet sich – erledigt/offen spielt keine Rolle für die Editierbarkeit."

Kein Test in `TodoListArea.test.tsx` prüft diesen Fall. Es könnte ein Regressionsrisiko geben wenn jemand zukünftig Bedingungen auf `isDone` im Doppelklick-Handler einführt.

### 3. 200-Zeichen-Limit-Integrationstest

Es gibt einen Unit-Test für `maxLength={200}` in `TodoEditInput.test.tsx`. Ein Integrationstest der verifiziert, dass ein existierender Titel nahe dem Limit (z.B. 199 Zeichen) korrekt geladen und bearbeitet werden kann, fehlt.

### 4. Schneller Doppelklick + sofortiger Escape

Die Spec definiert:
> "Schneller Doppelklick gefolgt von sofortigem Escape: Ursprünglicher Titel bleibt, kein Zwischenzustand sichtbar."

Kein Test für diese Sequenz.

## Steps to Reproduce

1. `projekt/src/components/TodoListArea.test.tsx` auf Tests für erledigtes Todo + Doppelklick prüfen → keiner vorhanden
2. `projekt/src/components/TodoListArea.test.tsx` auf Test für Blur+Leerzeichen auf App-Ebene prüfen → keiner vorhanden
3. Expected: 4 fehlende Edge-Case-Tests vorhanden
4. Actual: Tests fehlen

## Priority

Fix before release
