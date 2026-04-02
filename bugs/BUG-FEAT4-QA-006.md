# BUG-FEAT4-QA-006: Race-Condition-Test in `TodoEditInput.test.tsx` testet nicht den Doppel-Save-Schutz korrekt

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Der Race-Condition-Test in `TodoEditInput.test.tsx` (Zeilen 133–148) ist unvollständig und irreführend:

```ts
it('ruft onSave nur einmal auf wenn Enter gedrückt und dann Blur feuert', async () => {
  // ...
  await user.keyboard('[Enter]')
  // onSave wird von TodoEditInput aufgerufen; TodoListArea verhindert Doppel-Save via Reducer
  // Hier testen wir nur dass TodoEditInput onSave korrekt einmal aufruft
  expect(onSave).toHaveBeenCalledTimes(1)
})
```

**Problem 1: Der Test simuliert keinen Blur nach Enter.** Der Test-Kommentar beschreibt, dass Blur nach Enter feuern soll – aber tatsächlich wird kein Blur ausgelöst. `userEvent.keyboard('[Enter]')` allein triggert in der Test-Umgebung (happy-dom) keinen automatischen Blur. Der Test prüft damit nur, dass Enter `onSave` einmal aufruft – was trivial korrekt ist und kein Race-Condition-Szenario darstellt.

**Problem 2: Der eigentliche Doppel-Save-Schutz liegt in `TodoListArea.handleSave()` via `editStateRef`.** Der Test auf `TodoEditInput`-Ebene kann diesen Schutzmechanismus gar nicht testen – er testet eine isolierte Komponente, nicht den Reducer-State. Der Kommentar räumt das ein, aber der Test existiert dann trotzdem und gibt fälschlicherweise Sicherheit.

**Problem 3: Der Integrationstest in `TodoListArea.test.tsx` ("Enter dann Blur speichert nur einmal") prüft nur, dass der localStorage-Wert am Ende korrekt ist – nicht ob `updateTodo` wirklich nur einmal aufgerufen wurde.**

**Korrekter Test wäre:** In `TodoListArea.test.tsx` via `vi.spyOn` auf `updateTodo` prüfen, dass es nach Enter+Blur exakt einmal aufgerufen wird.

## Steps to Reproduce

1. `TodoEditInput.test.tsx` Zeilen 133–148 lesen
2. Keinen Blur nach Enter in der Simulation finden
3. Expected: Test simuliert `Enter` + anschließenden `Blur` und prüft `onSave` wurde genau einmal aufgerufen
4. Actual: Nur Enter wird simuliert, kein Blur – der Test ist kein echter Race-Condition-Test

## Priority

Fix before release
