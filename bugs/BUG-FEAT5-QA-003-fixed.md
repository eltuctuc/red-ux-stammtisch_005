# BUG-FEAT5-QA-003: Fehlende Tests – Fokus nach Löschen (nächstes Todo / Input)

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed

## Problem

Die A11y-Architektur (Spec Abschnitt "Fokus-Management") und das Test-Setup (Abschnitt "Integration Tests") fordern Fokus-Tests für beide Post-Delete-Szenarien:

1. "Letztes Todo löschen → EmptyState sichtbar, Fokus auf Input"
2. (implizit aus Architektur-Beschreibung): Fokus auf nächstes Todo-Item nach Löschen wenn weitere Todos verbleiben

In `TodoListArea.test.tsx` gibt es den Test "Letztes Todo löschen → EmptyState erscheint" (Zeile 711), aber dieser prüft ausschließlich ob der Empty-State-Text sichtbar ist – nicht ob `document.activeElement` das Input-Feld ist.

Ein Test für "Fokus auf nächstes Todo nach Löschen bei mehreren Todos" fehlt vollständig.

Die Implementierung in `TodoListArea.tsx` (Zeilen 107–122) setzt Fokus via `document.getElementById('todo-input')` und via `todoItemLiRefs`. Ohne Tests ist nicht abgesichert ob:
- Die ID `todo-input` korrekt aufgelöst wird
- Die Ref-Map nach dem Löschen das richtige nächste Item enthält
- Der `useEffect` mit der richtigen `todos`-Längenänderung triggert

## Steps to Reproduce

**Szenario 1:**
1. Test "Letztes Todo löschen → EmptyState erscheint" (Zeile 711) prüfen
2. Expected: `expect(document.activeElement).toBe(screen.getByRole('textbox', { name: /neues todo/i }))` vorhanden
3. Actual: Kein activeElement-Assert – nur Prüfung auf EmptyState-Text

**Szenario 2:**
1. In "FEAT-5 – Todo löschen (Inline-Confirm)" nach Test suchen der prüft ob nach Löschen von Todo-A das verbleibende Todo-B den Fokus bekommt
2. Expected: Test vorhanden
3. Actual: Test fehlt komplett

## Empfehlung

Neue Tests hinzufügen:

```tsx
it('Letztes Todo löschen → Fokus springt auf Input', async () => {
  const user = userEvent.setup()
  const todo = makeTodo({ title: 'Letztes Todo' })
  localStorageMock.setItem('todos', JSON.stringify([todo]))
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
  await user.click(screen.getByRole('button', { name: 'Löschen' }))
  await waitFor(() => {
    expect(document.activeElement).toBe(screen.getByRole('textbox', { name: /neues todo/i }))
  })
})

it('Todo löschen bei mehreren Todos → Fokus auf nächstes Todo-Item', async () => {
  const user = userEvent.setup()
  const todoA = makeTodo({ title: 'Todo A', createdAt: '2026-04-01T10:00:00.000Z' })
  const todoB = makeTodo({ title: 'Todo B', createdAt: '2026-04-01T08:00:00.000Z' })
  localStorageMock.setItem('todos', JSON.stringify([todoA, todoB]))
  render(<App />)
  const deleteButtons = screen.getAllByRole('button', { name: 'Todo löschen' })
  await user.click(deleteButtons[0])
  await user.click(screen.getByRole('button', { name: 'Löschen' }))
  await waitFor(() => {
    const remainingItem = screen.getByRole('listitem')
    expect(document.activeElement).toBe(remainingItem)
  })
})
```

## Priority

Fix before release

## Fix
*2026-04-03* – Implementiert und getestet.
