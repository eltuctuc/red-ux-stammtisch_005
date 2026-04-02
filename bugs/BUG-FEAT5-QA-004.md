# BUG-FEAT5-QA-004: Kein Guard im deleteReducer gegen gleichzeitigen Edit+Confirming-State

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Low
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Problem

Die Spec definiert als harte Constraint (Abschnitt "Constraint aus flows"): "S-01b: Löschen-Trigger ist deaktiviert während Inline-Editing ist aktiv. Kein gleichzeitiges S-01b + S-01c möglich."

Die Implementierung setzt diesen Constraint ausschließlich auf UI-Ebene durch (`disabled={isEditingAny}` auf dem ×-Button in `TodoItem.tsx`, Zeile 126). Der `deleteReducer` und `handleDeleteTrigger` enthalten keinen Guard:

```tsx
// TodoListArea.tsx Zeile 124-126
const handleDeleteTrigger = useCallback((id: string) => {
  deleteDispatch({ type: 'DELETE_TRIGGER', id })
}, [])
```

```tsx
// deleteReducer Zeile 42-43
case 'DELETE_TRIGGER':
  return { confirmingId: action.id }  // kein Guard auf editingId
```

Wenn `DELETE_TRIGGER` durch einen programmatischen Aufruf oder einen Test-Seam ausgelöst wird, obwohl `editingId !== null` gesetzt ist, landet die State Machine in einem undokumentierten Zustand: `editingId !== null` UND `confirmingId !== null` gleichzeitig. In diesem Zustand würde das betreffende Todo weder die Bestätigungszeile zeigen (weil `isConfirming` nur für das Todo gilt, nicht für das gerade editierte) noch konsistent verhalten.

In der Praxis ist das Risiko niedrig, weil `disabled` im normalen UI-Flow greift. Als Defense-in-Depth fehlt aber der Guard auf Reducer-Ebene, was die State Machine weniger robust macht.

## Steps to Reproduce

1. In einem Test `handleDeleteTrigger` mit einer ID aufrufen während `editState.editingId !== null` gesetzt ist (z.B. via direkten Reducer-Test)
2. Expected: `deleteReducer` oder `handleDeleteTrigger` ignoriert den Trigger (no-op) wenn `editingId !== null`
3. Actual: `confirmingId` wird gesetzt – State Machine ist in widersprüchlichem Zustand

## Empfehlung

Guard in `handleDeleteTrigger` hinzufügen:

```tsx
const handleDeleteTrigger = useCallback((id: string) => {
  if (editStateRef.current.editingId !== null) return // Guard: kein Löschen während Edit
  deleteDispatch({ type: 'DELETE_TRIGGER', id })
}, [])
```

Alternativ: Guard direkt im Reducer, indem der Reducer beide States kennt (erfordert Refactoring zu einem kombinierten Reducer).

## Priority

Nice-to-have
