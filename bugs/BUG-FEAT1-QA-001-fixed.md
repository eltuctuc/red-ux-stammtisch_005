# BUG-FEAT1-QA-001: Fokus kehrt nach Button-Klick mit leerem/Leerzeichen-Inhalt nicht ins Input zurück

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** High
- **Bereich:** Functional / A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed – 2026-04-02 – `inputRef.current?.focus()` in Early-Return-Zweig von `submit()` ergänzt (TodoInputArea.tsx:17)

## Beschreibung

In `TodoInputArea.tsx` ruft die `submit()`-Funktion `inputRef.current?.focus()` nur dann auf, wenn ein Todo erfolgreich angelegt wurde. Im Fehlerfall (leere Eingabe oder nur Leerzeichen) wird `setValue('')` aufgerufen, aber kein `focus()`.

**Betroffener Code (`projekt/src/components/TodoInputArea.tsx`, Zeilen 14–23):**
```ts
function submit() {
  const todo = createTodo(value)
  if (!todo) {
    setValue('')
    return   // <-- focus() fehlt hier
  }
  onAdd(todo)
  setValue('')
  inputRef.current?.focus()
}
```

Bei **Enter** auf dem Input bleibt der Fokus ohnehin im Input (kein Fokus-Verlust). Das Problem tritt auf beim **Button-Klick** mit leerem oder Leerzeichen-Inhalt: Der Fokus springt nach dem Klick auf den Button, und da `focus()` im Early-Return-Pfad nicht aufgerufen wird, verbleibt der Fokus auf dem Button statt im Input.

## Steps to Reproduce

1. App laden, Input ist fokussiert (autoFocus)
2. Nichts eingeben (oder nur Leerzeichen eingeben)
3. Den "+" Button mit der Maus klicken
4. Expected: Fokus ist nach dem Klick wieder im Input-Feld
5. Actual: Fokus verbleibt auf dem "+" Button

## Betroffene ACs

- AC: "Nach dem Anlegen ist der Fokus wieder im Eingabefeld." – trifft für den leeren Submit-Pfad nicht zu
- AC: "Leere Eingabe + Enter: kein Todo wird angelegt, kein Fehler, kein visuelles Feedback – stilles Ignorieren." – der Fokus-Verlust ist implizites visuelles Feedback

## Fix-Hinweis

`inputRef.current?.focus()` auch im Early-Return-Pfad aufrufen:
```ts
if (!todo) {
  setValue('')
  inputRef.current?.focus()
  return
}
```

## Priority
Fix before release
