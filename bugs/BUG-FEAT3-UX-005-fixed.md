# BUG-FEAT3-UX-005: Erledigter Status für SR-Nutzer beim Content-Scanning nicht erkennbar

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** High
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Mit dem Fix von BUG-FEAT3-UX-002 wurde das `sr-only "(erledigt)"` aus dem Titel-Span in `TodoItem.tsx` entfernt. Das hat die ursprüngliche Redundanz korrekt behoben – erzeugt aber eine neue Lücke:

Der erledigte Zustand eines Todos ist für SR-Nutzer nur erkennbar, wenn sie den Toggle fokussieren (Tab-Navigation). Beim zeilenweisen Durchlesen der Liste mit dem virtuellen Cursor (Pfeiltasten / Browse Mode in NVDA, VoiceOver Rotornavigation) landet der SR auf dem `<span class="todo-item__title">` – und liest nur den Titel ohne jede Statusinfo.

Das visuelle `text-decoration: line-through` und der reduzierte Kontrast des erledigten Titels sind für SR-Nutzer vollständig unsichtbar. Nach dem Fix gibt es keine SR-zugängliche Statusinfo mehr am Titel-Element selbst.

Betroffen: alle SR-Nutzer die Todo-Listen scannen ohne jeden Toggle einzeln zu fokussieren – das ist der typische Nutzungsweg beim Überblicken einer Liste.

Laut FEAT-3 Abschnitt 3, A11y-Architektur (letzter Tabelleneintrag):
> "Todo-Titel erledigt: `<span aria-hidden="true">` für line-through NICHT ausreichend – Status muss auch im SR erkennbar sein: sr-only Text `(erledigt)` nach dem Titel-Span oder `aria-label` am `<li>`"

Diese Spec-Vorgabe ist durch den Fix von UX-002 nicht mehr erfüllt.

## Steps to Reproduce

1. Todo anlegen und als erledigt markieren
2. Screen Reader starten (VoiceOver oder NVDA)
3. Virtual Cursor / Browse Mode verwenden (nicht Tab, sondern Pfeil-Navigation durch den Content)
4. Über den Todo-Titel hinwegnavigieren ohne den Toggle zu fokussieren

Expected: SR liest "[Titel] (erledigt)" oder ähnliches – der Status ist beim Überfliegen der Liste erkennbar
Actual: SR liest nur "[Titel]" – kein Hinweis auf den erledigten Zustand

## Empfehlung

Den Status direkt am `<li>`-Element via `aria-label` kommunizieren, statt als sr-only am Titel-Span. Das vermeidet die ursprüngliche Redundanz mit dem Toggle-Label (UX-002) und stellt gleichzeitig sicher, dass der Status bei jeder Navigationsform erkennbar ist:

```tsx
<li
  className={`todo-item${isDone ? ' todo-item--done' : ''}`}
  aria-label={isDone ? `${todo.title} (erledigt)` : todo.title}
>
```

Alternativ: `aria-label` auf dem `<li>` weglassen und stattdessen den Titel-Span mit konditionellem sr-only-Suffix versehen – aber diesmal so gestaltet dass es nicht mit dem Toggle-Label kollidiert (z.B. indem der Toggle-Label nur die Aktion beschreibt, nicht den Titel wiederholt):

```tsx
<span className="todo-item__title">
  {todo.title}
  {isDone && <span className="sr-only"> (erledigt)</span>}
</span>
```

Der `aria-label` am `<li>` ist die sauberere Lösung, da sie den Toggle-Label vollständig entkoppelt.

## Priority

Fix before release

---
**Status:** Fixed – 2026-04-03
