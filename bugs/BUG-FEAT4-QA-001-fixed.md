# BUG-FEAT4-QA-001: Kein Keyboard-Einstieg in den Edit-Modus (WCAG 2.1.1 verletzt)

- **Feature:** FEAT-4 – Todo bearbeiten
- **Severity:** High
- **Bereich:** A11y
- **Gefunden von:** QA Engineer
- **Status:** Fixed

## Beschreibung

Der einzige Einstiegspunkt in den Inline-Edit-Modus ist `onDoubleClick` auf einem `<span>` ohne `tabIndex`, ohne `role="button"` und ohne `onKeyDown`-Handler. Der Span ist nicht im Tab-Flow und nicht per Tastatur erreichbar.

Ein Keyboard-Only-User kann FEAT-4 (Todo bearbeiten) vollständig nicht nutzen. Das verletzt WCAG 2.1 SC 2.1.1 "Keyboard" (Level A – Pflicht, keine Ausnahme).

Die Spec dokumentiert dieses Problem bewusst als "akzeptiert für diesen Scope" mit dem Hinweis auf eine spätere Erweiterung via Tab+F2 oder Edit-Icon-Button. Die Akzeptanz in der Spec befreit nicht von der WCAG-Pflicht – SC 2.1.1 Level A ist kein optionales Ziel.

**Betroffene Datei:** `projekt/src/components/TodoItem.tsx`, Zeilen 52–56

```tsx
<span
  className="todo-item__title"
  onDoubleClick={onDoubleClick}
>
  {todo.title}
</span>
```

Der Span hat keinen `tabIndex`, kein `role`, kein `onKeyDown`.

## Steps to Reproduce

1. App im Browser öffnen
2. Tastatur-Navigation aktivieren (kein Maus-Einsatz)
3. Mit Tab zu einem Todo-Item navigieren
4. Versuchen, den Edit-Modus über Tastatur zu öffnen (Enter, F2, Space)
5. Expected: Edit-Modus öffnet sich per Tastatur
6. Actual: Edit-Modus öffnet sich nicht – Doppelklick ist der einzige Weg

## Auswirkung

Keyboard-Only-User und Nutzer mit motorischen Einschränkungen sind von der Funktion vollständig ausgeschlossen. Screen-Reader-User können die Editier-Funktion nicht über AT erreichen.

## Priority

Fix before release
