# BUG-FEAT4-UX-004: SR-Status bleibt stumm bei wiederholtem Speichern desselben Titels

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Low
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Die aria-live-Statusregion in `TodoListArea` wird durch React-State gesteuert (`srStatus`). Wenn ein Nutzer denselben Todo-Titel zweimal hintereinander speichert – ohne Änderung – bleibt `srStatus` auf demselben Wert. React rendert die Region nicht neu, weil sich der State nicht geändert hat. Der Screenreader erkennt keine DOM-Mutation und gibt keine Rückmeldung aus.

Der Nutzer hat Enter gedrückt und erwartet die Bestätigung "gespeichert". Er bekommt Stille. Er weiß nicht, ob die Aktion durchgegangen ist.

Gleiches gilt für zweimaliges Drücken von Escape: "Bearbeitung abgebrochen" wird beim zweiten Mal nicht erneut angekündigt.

## Steps to Reproduce

1. Screenreader aktivieren (VoiceOver macOS oder NVDA Windows)
2. Todo fokussieren, Enter drücken → Edit-Modus öffnet
3. Titel unverändert lassen, Enter drücken → SR kündigt "gespeichert" an (korrekt)
4. Sofort wieder Enter auf demselben Todo drücken → Edit-Modus öffnet erneut
5. Wieder Enter ohne Änderung drücken

Expected: SR kündigt erneut "gespeichert" an.
Actual: SR bleibt stumm, weil der State-Wert identisch ist und kein DOM-Update stattfindet.

## Empfehlung

Den Status vor jedem Setzen kurz auf einen leeren String zurücksetzen, damit React immer eine DOM-Mutation auslöst:

```
setSrStatus('')
// kleines Timeout oder direkt danach:
setSrStatus(`${newTitle} gespeichert`)
```

Sauberer wäre ein Ansatz mit einem Objekt, das eine inkrementelle ID enthält, sodass React immer eine neue Referenz sieht:

```typescript
setSrStatus({ text: `${newTitle} gespeichert`, id: Date.now() })
```

Die Region rendert dann `srStatus.text`, was bei jedem Aufruf eine neue Objektreferenz erzeugt und die DOM-Mutation sicherstellt.

## Priority

Nice-to-have
