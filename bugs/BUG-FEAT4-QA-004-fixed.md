# BUG-FEAT4-QA-004: `aria-label` auf `<li>` zeigt veralteten Titel während des Edit-Modus

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed

## Beschreibung

Das `<li>`-Element in `TodoItem.tsx` hat ein statisches `aria-label`, das immer `todo.title` (den aktuell gespeicherten Titel) zeigt:

**Betroffene Datei:** `projekt/src/components/TodoItem.tsx`, Zeile 33

```tsx
<li
  ref={liRef}
  className={...}
  aria-label={isDone ? `${todo.title} (erledigt)` : todo.title}
  tabIndex={-1}
>
```

Während des Edit-Modus (`isEditing === true`) ist das `<li>` mit `aria-label="Alter Titel"` annotiert, aber das enthaltene Kind-Element ist ein `<input aria-label="Todo-Titel bearbeiten">`. Ein Screen Reader, der die Listitem-Ebene navigiert, liest den alten Titel. Wenn der User den Titel im Input ändert, bleibt das `aria-label` auf `<li>` stale.

**Zusätzliches Problem:** Wenn Fokus nach Edit-Ende auf das `<li>` zurückgeht, liest der SR das `aria-label` des `<li>` – mit dem neuen Titel. Das ist korrekt. Aber während des Editierens ist der Zustand widersprüchlich: `aria-label="Alter Titel"` auf dem `<li>` + Kind-Input mit eigenem Label.

**Empfehlung:** Während des Edit-Modus kein `aria-label` auf dem `<li>` setzen (oder es auf etwas Neutrales setzen wie "Todo wird bearbeitet"), damit SR-User nicht durch widersprüchliche Beschriftungen verwirrt werden.

## Steps to Reproduce

1. Screen Reader aktivieren (VoiceOver / NVDA)
2. Todo-Liste mit einem Todo laden
3. Edit-Modus via Doppelklick öffnen
4. Mit Pfeiltasten in der SR-Virtuellen-Liste navigieren
5. Expected: SR liest "Todo-Titel bearbeiten, Bearbeitungsfeld" oder ähnliches
6. Actual: SR kann je nach Navigationsebene "Alter Titel" lesen (das `aria-label` des `<li>`), was zu verwirrenden Ansagen führt

## Priority

Fix before release
