# BUG-FEAT5-QA-002: Fehlender Test – Fokus zurück auf ×-Button nach Cancel

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Problem

Die Spec (UX-Abschnitt User Flow, Zeile 87) fordert explizit: "Fokus zurück auf Löschen-Trigger des Items" nach Abbrechen des Bestätigungsschritts. Das Test-Setup (Abschnitt "Integration Tests") listet diesen Test ebenfalls als Pflicht:

- "[Abbrechen] klicken → Bestätigungszeile weg, Fokus zurück auf '×'"
- "Escape → Bestätigungszeile weg, Fokus zurück auf '×'"

In `TodoListArea.test.tsx` existieren zwar Tests für "[Abbrechen] schließt Bestätigungszeile" und "Escape schließt Bestätigungszeile", aber keiner dieser Tests prüft ob `document.activeElement` anschließend der ×-Button ist.

Der Fokus-Rücksprung ist in `TodoItem.tsx` via `useEffect` auf `isConfirming` implementiert (`deleteButtonRef.current?.focus()`). Ohne Test ist nicht abgesichert, ob dieser Mechanismus korrekt funktioniert – insbesondere ob `deleteButtonRef.current` zum Zeitpunkt des Effects bereits auf den neu gemounteten Button zeigt.

## Steps to Reproduce

1. `TodoListArea.test.tsx` öffnen
2. Test "[Abbrechen] schließt Bestätigungszeile ohne Löschen" (Zeile 649) prüfen
3. Expected: Test prüft `expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Todo löschen' }))`
4. Actual: Test prüft nur das Verschwinden der Bestätigungszeile und die Anwesenheit des Todo-Texts – kein activeElement-Assert

Gleiches gilt für den Escape-Test (Zeile 660).

## Empfehlung

Bestehende Tests um Fokus-Assert erweitern:

```tsx
it('[Abbrechen] schließt Bestätigungszeile und setzt Fokus zurück auf ×-Button', async () => {
  const user = userEvent.setup()
  const todo = makeTodo({ title: 'Nicht löschen' })
  localStorageMock.setItem('todos', JSON.stringify([todo]))
  render(<App />)
  await user.click(screen.getByRole('button', { name: 'Todo löschen' }))
  await user.click(screen.getByRole('button', { name: 'Abbrechen' }))
  await waitFor(() => {
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Todo löschen' }))
  })
})
```

## Priority

Fix before release
