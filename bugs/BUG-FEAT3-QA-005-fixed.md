# BUG-FEAT3-QA-005: pointer-events: none auf Label-Wrapper blockiert Checkbox-Fokus per Tastatur im disabled-Zustand

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** Medium
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

In `projekt/src/components/StatusToggle.css`, Zeile 63-66:

```css
.status-toggle:has(.status-toggle__input:disabled) {
  cursor: not-allowed;
  pointer-events: none;
}
```

`pointer-events: none` wird auf den `<label>`-Wrapper gesetzt, wenn die Checkbox `disabled` ist. Das verhindert korrekt Maus-Klicks auf den Wrapper.

Das Problem: `pointer-events: none` betrifft nur Maus- und Touch-Events, nicht die Tastatur-Navigation. Die native `disabled`-Eigenschaft der Checkbox (`<input disabled>`) verhindert bereits:
1. Fokus via Tastatur (Tab überspringt disabled Inputs)
2. Interaktion per Space/Enter
3. Click-Events auf dem Input selbst

Durch `pointer-events: none` auf dem Label-Wrapper entsteht aber ein Konflikt: Das Label ist per Maus-Klick nicht erreichbar (korrekt), aber ein Screen Reader oder Keyboard-Nutzer, der explizit auf das Label klickt (z.B. via assistive technology), wird durch `pointer-events: none` blockiert, obwohl der SR-Nutzer das `disabled`-Feedback durch das native Attribut bereits erhält.

Gravierender: Die Spec definiert (`FEAT-3-todo-status.md`, A11y-Architektur):
> "Native `disabled` verhindert Focus und Interaktion. SR liest 'nicht verfügbar'"

Das native `disabled`-Attribut ist ausreichend. Das zusätzliche `pointer-events: none` auf dem Label ist redundant und kann in bestimmten AT-Kombinationen (Assistive Technology) dazu führen, dass der Label-Text vom SR nicht mehr korrekt aufgelöst wird, weil der Label-Wrapper für Pointer-Events nicht erreichbar ist.

**Betroffene Datei:** `projekt/src/components/StatusToggle.css`, Zeilen 63-66

**Empfehlung:** `pointer-events: none` vom Label-Wrapper entfernen. Das native `disabled`-Attribut auf dem `<input>` ist hinreichend. Der `cursor: not-allowed` auf dem Wrapper ist optional und kann bleiben – der `pointer-events: none` nicht.

## Steps to Reproduce

1. `StatusToggle`-Komponente mit `disabled={true}` rendern (FEAT-4-Szenario simulieren)
2. Mit assistiver Technologie (z.B. VoiceOver + Maus) auf das Label navigieren
3. Expected: SR liest Label-Text vor und zeigt "nicht verfügbar" für die Checkbox an
4. Actual: `pointer-events: none` blockiert die Pointer-Interaction des Labels, was in bestimmten AT-Konfigurationen das Label-Resolving beeinträchtigen kann

## Priority
Fix before release

---
**Status:** Fixed – 2026-04-03
