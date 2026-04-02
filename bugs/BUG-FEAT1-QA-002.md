# BUG-FEAT1-QA-002: Unit-Test "erlaubt doppelte Titel" prüft nicht die ID-Eindeutigkeit

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Low
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Der Unit-Test `createTodo.test.ts`, Zeile 39–43, prüft das Edge-Case-Verhalten "Duplizierter Titel: Erlaubt – zwei Todos dürfen denselben Titel haben". Der Test beweist korrekt, dass gleiche Titel erlaubt sind. Er prüft aber **nicht**, dass die beiden Todos unterschiedliche IDs erhalten.

**Problematisch:** In `beforeEach` wird `crypto.randomUUID` mit `() => 'test-uuid-123'` gemockt – einem fixen Rückgabewert. Das bedeutet: Beide Todos in diesem Test hätten dieselbe ID. Da der Test die ID nicht prüft, fällt das nicht auf. Wenn jemand später die ID-Eindeutigkeit bricht (z.B. durch einen statischen Counter statt UUID), würde dieser Test weiterhin grün bleiben.

**Betroffener Code (`projekt/src/utils/createTodo.test.ts`, Zeilen 39–43):**
```ts
it('erlaubt doppelte Titel', () => {
  const a = createTodo('Gleicher Titel')
  const b = createTodo('Gleicher Titel')
  expect(a?.title).toBe(b?.title)
  // Fehlt: expect(a?.id).not.toBe(b?.id)
})
```

Damit der Test sinnvoll ist, müsste der `crypto`-Mock für diesen Test einen inkrementellen Wert zurückgeben (z.B. `vi.fn().mockReturnValueOnce('id-1').mockReturnValueOnce('id-2')`), und dann `expect(a?.id).not.toBe(b?.id)` assertiert werden.

## Steps to Reproduce

1. `createTodo.test.ts` ausführen
2. Beide Todos haben `id: 'test-uuid-123'` – der Test erkennt dies nicht
3. Expected: Test deckt ID-Eindeutigkeit bei doppelten Titeln ab
4. Actual: Test prüft nur Titel-Gleichheit, ignoriert ID-Kollision

## Priority
Nice-to-have
