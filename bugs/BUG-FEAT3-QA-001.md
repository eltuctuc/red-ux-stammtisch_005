# BUG-FEAT3-QA-001: SR-Label der Checkbox zeigt immer "als erledigt markieren" – unabhängig vom aktuellen Status

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** High
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `projekt/src/components/StatusToggle.tsx`, Zeile 24, lautet das sr-only Label der Checkbox immer:

```
"{todoTitle} als erledigt markieren"
```

Dieser Text ist statisch und berücksichtigt den aktuellen Status nicht. Wenn ein Todo bereits `status: 'done'` hat (Checkbox ist angehakt), liest der Screen Reader den Label-Text "Einkaufen als erledigt markieren" – obwohl die eigentliche Aktion wäre, das Todo wieder auf offen zu setzen.

Laut Spec (`FEAT-3-todo-status.md`, Abschnitt A11y-Architektur) soll das Label den Kontext vermitteln: "Einkaufen, als erledigt markieren, Checkbox, nicht markiert". Für ein erledigtes Todo müsste der Label lauten: "[Titel] als offen markieren" (oder zumindest neutral: "[Titel], Status wechseln").

**Betroffene Datei:** `projekt/src/components/StatusToggle.tsx`, Zeile 24

```tsx
// Aktuell (immer gleich):
<span className="sr-only">{todoTitle} als erledigt markieren</span>

// Korrekt wäre kontextabhängig:
<span className="sr-only">
  {todoTitle} als {checked ? 'offen' : 'erledigt'} markieren
</span>
```

## Steps to Reproduce

1. App starten, mindestens ein Todo anlegen
2. Todo als erledigt markieren (Checkbox klicken)
3. Mit Screen Reader (z.B. VoiceOver, NVDA) zur Checkbox navigieren (Tab)
4. Expected: SR liest "[Titel] als offen markieren, Checkbox, angehakt"
5. Actual: SR liest "[Titel] als erledigt markieren, Checkbox, angehakt"

## Priority
Fix before release
