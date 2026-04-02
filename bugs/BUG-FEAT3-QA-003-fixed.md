# BUG-FEAT3-QA-003: aria-live auf <ul> führt zu redundanter und verwirrlicher SR-Ausgabe nach Toggle

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `projekt/src/components/TodoListArea.tsx`, Zeile 28, wird `aria-live="polite"` auf das `<ul>`-Element gesetzt. Wenn ein Todo als erledigt markiert wird, ändert sich innerhalb dieser Live-Region der Inhalt des `<li>`-Elements: die CSS-Klasse ändert sich, der sr-only Text "(erledigt)" erscheint, und das Label der Checkbox ändert sich.

Screen Reader vorlesen bei einer Statusänderung potenziell:
1. Den Todo-Titel aus dem `<span class="todo-item__title">`
2. Den sr-only Text "(erledigt)"
3. Den Label-Text der Checkbox: "[Titel] als erledigt markieren"

Das ist dreifach redundant und für SR-Nutzer schwer verständlich. Besonders das Zusammenspiel von `aria-live` auf der Liste und dem nativen Checkbox-State-Feedback kann zu doppeltem Vorlesen führen (einmal durch das native Checkbox-Feedback, einmal durch die Live-Region).

Laut Spec (`FEAT-3-todo-status.md`, A11y-Architektur):
> "Bei Status-Änderung kein explizites `aria-live` nötig – SR erkennt nativen Checkbox-State-Wechsel"

Das `aria-live` auf der `<ul>` wurde aus FEAT-2 mitgebracht (für das Hinzufügen neuer Todos sinnvoll). Es ist aber nicht so granular, dass es für Toggle-Aktionen passt. Ein `aria-live` auf der gesamten Liste führt dazu, dass jeder Inhaltswechsel innerhalb der Liste angekündigt wird – also auch Toggle-Status-Änderungen, was die Spec explizit für unnötig erklärt.

**Betroffene Datei:** `projekt/src/components/TodoListArea.tsx`, Zeile 25-31

**Auswirkung:** Jeder Toggle einer Checkbox löst eine Live-Region-Ankündigung des gesamten `<li>`-Inhalts aus, zusätzlich zum nativen Checkbox-Feedback. Bei langen Todo-Listen mit häufigem Toggle ist das störend für SR-Nutzer.

**Hinweis:** Das `aria-live` für den Anwendungsfall "neues Todo hinzufügen" (FEAT-1/FEAT-2) ist korrekt und gewollt. Die Live-Region sollte aber nicht den Toggle-Feedback doppeln. Eine mögliche Lösung wäre `aria-live` nur auf neu eingefügte `<li>`-Elemente zu begrenzen (via `aria-relevant="additions"`) statt auf alle DOM-Änderungen innerhalb der Liste.

## Steps to Reproduce

1. App mit Screen Reader (VoiceOver / NVDA) öffnen
2. Mindestens ein Todo anlegen
3. Checkbox eines Todos per Tastatur (Tab + Space) togglen
4. Expected: SR liest nur den neuen Checkbox-State vor ("angehakt" oder "nicht angehakt")
5. Actual: SR liest zusätzlich den Listeninhalt des geänderten Todo-Items vor (via aria-live)

## Priority
Fix before release

---
**Status:** Fixed – 2026-04-03
