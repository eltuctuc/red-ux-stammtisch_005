# BUG-FEAT4-QA-002: Fehlende Reducer-Unit-Tests (Spec-Anforderung nicht erfüllt)

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Spec (FEAT-4-todo-bearbeiten.md, Abschnitt "Test-Setup") definiert explizit Reducer-Unit-Tests als Pflicht:

> "Unit Tests (useReducer-Reducer direkt):
> - idle + EDIT_START → editing mit korrekten Werten
> - editing + EDIT_SAVE (nicht leer) → idle
> - editing + EDIT_CANCEL → idle
> - idle + EDIT_SAVE → idle (no-op – Race-Condition-Test)
> - idle + EDIT_CANCEL → idle (no-op)"

Der `editReducer` in `projekt/src/components/TodoListArea.tsx` wird nirgendwo direkt als Unit getestet. Alle FEAT-4-Tests in `TodoListArea.test.tsx` sind Integrationstests, die den Reducer über die UI testen. Die 5 geforderten Reducer-Unit-Tests fehlen vollständig.

**Warum das relevant ist:** Integrationstests testen den Reducer indirekt über React-Rendering und Event-Simulation. Direkter Reducer-Test ist schneller, präziser und fängt Logik-Fehler deterministisch ab – besonders wichtig für den no-op bei `idle + EDIT_SAVE` (Race-Condition-Schutz).

**Betroffene Dateien:**
- `projekt/src/components/TodoListArea.tsx` – `editReducer` nicht exportiert (müsste für direkten Test exportiert werden)
- Fehlende Test-Datei: kein dedizierter Reducer-Test

## Steps to Reproduce

1. `projekt/src/components/TodoListArea.test.tsx` öffnen
2. Nach Tests suchen, die `editReducer` direkt importieren und aufrufen
3. Expected: 5 Unit-Tests vorhanden die jeden Transitionspfad direkt testen
4. Actual: Keine Reducer-Unit-Tests vorhanden – nur Integrationstests

## Zusätzlich: `editReducer` nicht exportiert

Der `editReducer` ist nicht als Named Export verfügbar, was direkte Unit-Tests ohne React-Kontext aktuell verhindert. Entweder muss er exportiert werden, oder der Test muss via Modul-Import auf die interne Funktion zugreifen.

## Priority

Fix before release
