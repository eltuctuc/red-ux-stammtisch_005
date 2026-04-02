# BUG-FEAT4-QA-003: `updateTodo` wird bei identischem Titel unnötig aufgerufen (kein Dirty-Check)

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Low
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Spec definiert den Edge Case:

> "Identischer Titel bestätigt (keine Änderung): Kein erneutes Speichern nötig, Bearbeitungsmodus wird normal beendet."

Der Code in `TodoListArea.handleSave()` ruft `onUpdate(editingId, newTitle)` immer auf, unabhängig davon ob sich der Titel geändert hat:

**Betroffene Datei:** `projekt/src/components/TodoListArea.tsx`, Zeilen 57–62

```ts
const handleSave = useCallback((newTitle: string) => {
  const { editingId } = editStateRef.current
  if (editingId === null) return
  onUpdate(editingId, newTitle)   // ← wird auch bei identischem Titel aufgerufen
  dispatch({ type: 'EDIT_SAVE' })
}, [onUpdate])
```

Das führt zu einem unnötigen `setTodos`-Aufruf im Hook, einem unnötigen Re-Render und einem unnötigen `localStorage.setItem`-Schreibzugriff – auch wenn sich inhaltlich nichts geändert hat.

**Auswirkung:** Kein Datenverlust, keine funktionale Fehlfunktion. Der Wert ist ja identisch. Aber der Edge Case ist in der Spec explizit dokumentiert und die Implementierung ignoriert ihn.

**Fehlender Test:** Es gibt auch keinen Test der prüft, dass `updateTodo` bei identischem Titel NICHT aufgerufen wird (die Spec nennt diese Optimierung "optional" – aber die Spec-Formulierung "Kein erneutes Speichern nötig" ist eindeutig).

## Steps to Reproduce

1. Todo mit Titel "Mein Todo" anlegen
2. Doppelklick auf den Titel
3. Nichts am Titel ändern
4. Enter drücken
5. Expected: `updateTodo` wird nicht aufgerufen, kein localStorage-Schreibzugriff
6. Actual: `updateTodo` wird aufgerufen, `localStorage.setItem` feuert

## Priority

Nice-to-have
