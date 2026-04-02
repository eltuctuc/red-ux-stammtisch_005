# BUG-FEAT2-QA-003: Kein Test für nicht-deterministisches Sortierverhalten bei identischen createdAt-Timestamps

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Low
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Sortierlogik in `useTodos.ts` (Zeilen 49–51) sortiert Todos nach `createdAt` absteigend:

```ts
const sortedTodos = [...todos].sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
)
```

Wenn zwei Todos denselben `createdAt`-Timestamp haben, gibt `sort()` `0` zurück. Die Reihenfolge dieser zwei Todos ist dann implementierungsabhängig – JavaScript's `Array.prototype.sort` ist seit ES2019 stabil (behält Einfügereihenfolge bei gleichem Sortierschlüssel), aber:

1. Es gibt keinen Test der dieses Verhalten explizit absichert.
2. In der Praxis können identische Timestamps entstehen wenn `crypto.randomUUID` und `new Date().toISOString()` schnell hintereinander aufgerufen werden (insbesondere in Tests mit gemockter System-Time).
3. `addTodo` fügt neue Todos per `[todo, ...prev]` oben ein – bei gleichem Timestamp würde `sort()` diese Reihenfolge (neueste zuerst durch Array-Einfügereihenfolge) korrekt bewahren. Aber das ist Zufall, kein explizit getestetes Verhalten.

**Warum relevant:** Wenn FEAT-3/4/5 Status-Toggle oder Delete implementieren und dabei `setTodos([...])` mit manipulierten Arrays aufrufen, könnte die Reihenfolge bei gleichem Timestamp unerwartet ändern. Kein Test würde das fangen.

## Steps to Reproduce / Nachweis

```
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/hooks/useTodos.ts, Zeilen 49–51
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/hooks/useTodos.test.ts: Kein Test für gleiche Timestamps
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoListArea.test.tsx, Zeilen 75–83: Sortierungstest nutzt explizit unterschiedliche Timestamps
```

Fehlender Test:
```ts
it('behält Einfügereihenfolge bei identischen createdAt-Timestamps', () => {
  const sameTime = '2026-04-01T10:00:00.000Z'
  const first = makeTodo({ title: 'Zuerst eingegeben', createdAt: sameTime })
  const second = makeTodo({ title: 'Danach eingegeben', createdAt: sameTime })
  // Erwartung: Reihenfolge ist deterministisch definiert (z.B. Einfügereihenfolge erhalten)
})
```

## Empfehlung

Einen Unit-Test für `loadTodosFromStorage` und einen Integrationstest hinzufügen, der explizit das Verhalten bei identischen Timestamps dokumentiert. Alternativ die Sortierlogik um eine Sekundär-Sortierung ergänzen (z.B. nach `id` als Tiebreaker), um deterministisches Verhalten zu garantieren.

## Priority
Nice-to-have
