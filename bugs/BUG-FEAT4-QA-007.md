# BUG-FEAT4-QA-007: `aria-disabled="true"` fehlt auf StatusToggle während Edit-Modus

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** Low
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die Spec (FEAT-4-todo-bearbeiten.md, Abschnitt "A11y-Architektur") fordert explizit:

> "StatusToggle während Edit: `disabled` + `aria-disabled=\"true\"` – SR liest: '[Label], nicht verfügbar'. Verhindert Fokus und Interaktion"

Die Implementierung in `StatusToggle.tsx` setzt nur das native `disabled`-Attribut auf der `<input>`-Checkbox. `aria-disabled` wird nicht gesetzt:

**Betroffene Datei:** `projekt/src/components/StatusToggle.tsx`, Zeilen 25–33

```tsx
<input
  type="checkbox"
  id={inputId}
  className="status-toggle__input"
  checked={checked}
  disabled={disabled}          // ← nur native disabled
  onChange={() => onToggle(todoId)}
  onKeyDown={handleKeyDown}
/>
```

**Technische Anmerkung:** Das native `disabled` auf einem `<input type="checkbox">` impliziert nach ARIA-Spezifikation (Section 6.6.1) automatisch `aria-disabled="true"` im Accessibility Tree – der Browser setzt dieses Mapping ohne explizites Attribut. In der Praxis verhält sich das korrekt.

Die explizite Anforderung in der Spec dient jedoch der Klarheit und der Absicherung für Fälle, in denen Custom-Styling oder CSS `pointer-events: none` anstelle von native `disabled` verwendet wird (was in manchen Design-System-Implementierungen vorkommt). Das explizite `aria-disabled` wäre dann die einzige AT-Kommunikation.

Da die Spec es explizit fordert und es kein Test absichert, ist das eine Spec-Abweichung.

## Steps to Reproduce

1. `projekt/src/components/StatusToggle.tsx` öffnen
2. Im JSX nach `aria-disabled` suchen
3. Expected: `aria-disabled={disabled}` auf dem `<input>` oder dem `<label>`
4. Actual: Nur `disabled={disabled}` – kein `aria-disabled`

## Kein Test vorhanden

Kein Test in `TodoListArea.test.tsx` prüft das Vorhandensein von `aria-disabled` auf der Toggle-Checkbox während des Edit-Modus.

## Priority

Nice-to-have
