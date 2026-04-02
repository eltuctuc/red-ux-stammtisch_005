# BUG-FEAT5-QA-001: Fehlender Test – Enter/Space auf ×-Button öffnet Bestätigungszeile

- **Feature:** FEAT-5 – Todo löschen
- **Severity:** Medium
- **Bereich:** Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Problem

Die Spec und das Test-Setup fordern ausdrücklich einen Integrationstest für den Keyboard-Einstieg in den Bestätigungsschritt via Enter oder Space auf dem fokussierten ×-Button:

- Spec (Abschnitt "Einstiegspunkte"): "Tastatur: Tab bis zum '×'-Button + Enter/Space"
- Test-Setup (Abschnitt "Integration Tests"): "Enter auf '×' → gleich wie Klick"

In `TodoListArea.test.tsx` existiert in der `FEAT-5`-Describe-Gruppe kein einziger Test, der `userEvent.keyboard('[Enter]')` oder `userEvent.keyboard(' ')` auf dem fokussierten `Todo löschen`-Button ausführt. Alle Delete-Tests nutzen ausschließlich `user.click()`.

Das ist besonders relevant, weil `<button type="button">` nativ Enter und Space unterstützt – es könnte aber durch einen `onKeyDown`-Handler oder andere Interferenz gebrochen werden. Ohne Test gibt es keine Absicherung.

## Steps to Reproduce

1. `TodoListArea.test.tsx` öffnen
2. In der Describe-Gruppe "FEAT-5 – Todo löschen (Inline-Confirm)" nach einem Test suchen, der `keyboard('[Enter]')` oder `keyboard(' ')` auf dem ×-Button ausführt
3. Expected: Test vorhanden, der prüft ob Enter/Space auf dem ×-Button die Inline-Bestätigungszeile öffnet
4. Actual: Kein solcher Test existiert – nur Mouse-Click-Tests

## Empfehlung

Test hinzufügen:

```tsx
it('Enter auf fokussiertem ×-Button öffnet Inline-Bestätigungszeile', async () => {
  const user = userEvent.setup()
  const todo = makeTodo({ title: 'Keyboard Delete Trigger' })
  localStorageMock.setItem('todos', JSON.stringify([todo]))
  render(<App />)
  const deleteBtn = screen.getByRole('button', { name: 'Todo löschen' })
  deleteBtn.focus()
  await user.keyboard('[Enter]')
  expect(screen.getByRole('group', { name: /löschen bestätigen/i })).toBeInTheDocument()
})
```

Analog für Space.

## Priority

Fix before release
