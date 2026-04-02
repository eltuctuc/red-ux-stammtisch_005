# BUG-FEAT3-QA-002: Fehlender Test für disabled-Prop (FEAT-4-Vorbereitung ohne Test-Absicherung)

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Medium
- **Bereich:** Test-Coverage
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Spec definiert in `FEAT-3-todo-status.md`, Abschnitt Test-Setup (Integration Tests), explizit:

> `disabled` Toggle → kein State-Wechsel bei Klick / Tastendruck

Dieser Test ist in `projekt/src/components/TodoListArea.test.tsx` nicht implementiert. Das `disabled`-Prop ist in `StatusToggle.tsx` zwar vorhanden und im CSS korrekt gestylt (`.status-toggle__input:disabled`), aber das Verhalten ist nicht durch einen Test abgesichert.

Das ist relevant, weil FEAT-4 (Edit-Modus) dieses `disabled`-Prop aktivieren wird. Wenn der Test jetzt fehlt, gibt es beim FEAT-4-Rollout keine Regression-Absicherung dafür, dass ein disabled Toggle tatsächlich keinen Status-Wechsel auslöst.

**Betroffene Dateien:**
- `projekt/src/components/TodoListArea.test.tsx` – fehlender Test
- `projekt/src/components/StatusToggle.tsx` – Zeile 29-30: `disabled`-Prop vorhanden, aber ungetestet

**Fehlender Test (aus Spec):**
```tsx
it('disabled Toggle löst keinen State-Wechsel aus bei Klick', async () => {
  // StatusToggle direkt rendern mit disabled=true
  // userEvent.click() → Status darf sich nicht ändern
})
```

## Steps to Reproduce

1. `projekt/src/components/TodoListArea.test.tsx` öffnen
2. In der Describe-Gruppe "Status-Toggle" suchen
3. Expected: Test für disabled-Verhalten vorhanden
4. Actual: Kein Test für disabled-Prop in der gesamten Test-Suite

## Priority
Fix before release

---
**Status:** Fixed – 2026-04-03
