# BUG-FEAT3-QA-004: Fehlende Tests für Edge Cases "alle Todos erledigt" und leere ID

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Low
- **Bereich:** Test-Coverage
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Zwei Edge Cases aus der Spec sind nicht durch Tests abgedeckt:

### 1. Edge Case "Alle Todos erledigt"

Die Spec definiert in `FEAT-3-todo-status.md`, Abschnitt Edge Cases:

> "Alle Todos erledigt: Alle Einträge erscheinen durchgestrichen; die Liste bleibt sichtbar, kein Auto-Clear."

Es gibt keinen Integrationstest der verifiziert, dass nach dem Markieren aller Todos als erledigt:
- Die Liste weiterhin sichtbar ist (kein Wechsel in den Empty State)
- Alle `<li>`-Elemente die Klasse `todo-item--done` tragen

**Betroffene Datei:** `projekt/src/components/TodoListArea.test.tsx` – fehlender Test in Describe-Gruppe "Status-Toggle"

### 2. Edge Case leere String-ID in toggleTodo

`useTodos.ts` Zeile 49-53: `toggleTodo` verarbeitet eine ID als string. Es gibt keinen Test für den Aufruf mit einer leeren String-ID (`""`). Das `Array.map` würde in diesem Fall alle Todos unverändert lassen (kein Todo hat eine leere ID, da `crypto.randomUUID()` immer eine nicht-leere UUID liefert) – aber dieser Grenzfall ist nicht explizit dokumentiert und getestet.

**Betroffene Datei:** `projekt/src/hooks/useTodos.test.ts` – fehlender Test in Describe-Gruppe "useTodos – toggleTodo"

## Steps to Reproduce

### Edge Case 1:
1. `TodoListArea.test.tsx` öffnen
2. Nach einem Test suchen der alle Todos als erledigt markiert und prüft ob die Liste noch sichtbar ist
3. Expected: Test vorhanden
4. Actual: Kein Test für diesen Zustand

### Edge Case 2:
1. `useTodos.test.ts` öffnen
2. In der Describe-Gruppe "useTodos – toggleTodo" nach einem Test für leere ID suchen
3. Expected: Test vorhanden (analog zum bestehenden "unbekannte ID"-Test)
4. Actual: Kein Test für leere String-ID

## Priority
Nice-to-have
