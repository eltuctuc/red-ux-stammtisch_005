# FEAT-4: Todo bearbeiten

## Status
Aktueller Schritt: Tech

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo anlegen) – es muss Todos geben die bearbeitet werden können
- Benötigt: FEAT-2 (Todo-Liste & Persistenz) – geänderter Titel muss persistiert werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-02*

### Beschreibung
Der Nutzer kann den Titel eines bestehenden Todos durch Doppelklick direkt in der Liste bearbeiten (Inline-Editing). Enter bestätigt die Änderung, Escape bricht ab und stellt den ursprünglichen Titel wieder her.

### Definitionen
- **Inline-Editing:** Der Titel wird direkt an seiner Position in der Liste zu einem editierbaren Textfeld – kein Modal, kein separater Screen.
- **Bearbeitungsmodus:** Zustand eines Todos bei dem sein Titel als aktives Eingabefeld dargestellt wird.
- **Bestätigen:** Enter-Taste oder Fokus-Verlust (Blur) speichert den neuen Titel.
- **Abbrechen:** Escape-Taste verwirft die Änderung und zeigt den ursprünglichen Titel wieder an.

### User Stories
- Als Power User möchte ich einen Titel per Doppelklick bearbeiten können, ohne die Maus für weitere Schritte zu benötigen.
- Als Nutzer möchte ich mit Escape eine Bearbeitung abbrechen und den alten Titel wiederherstellen, ohne etwas gespeichert zu haben.
- Als Pragmatiker möchte ich, dass der bestehende Titel beim Öffnen des Bearbeitungsmodus bereits im Eingabefeld steht und vollständig selektiert ist, damit ich sofort überschreiben oder anpassen kann.
- Als Nutzer möchte ich, dass der neue Titel nach Bestätigung sofort in der Liste sichtbar ist.
- Als Power User möchte ich, dass immer nur ein Todo gleichzeitig im Bearbeitungsmodus ist.

### Acceptance Criteria
- [ ] Doppelklick auf einen Todo-Titel öffnet den Bearbeitungsmodus für genau dieses Todo.
- [ ] Im Bearbeitungsmodus ist der bestehende Titel im Eingabefeld vorausgefüllt und vollständig selektiert.
- [ ] Enter bestätigt die Änderung: neuer Titel wird gespeichert, Bearbeitungsmodus wird beendet.
- [ ] Escape bricht die Bearbeitung ab: ursprünglicher Titel wird wiederhergestellt, kein Speichern.
- [ ] Blur (Fokus verlässt das Eingabefeld) bestätigt die Änderung analog zu Enter.
- [ ] Ein leerer oder nur-Leerzeichen-Titel nach Bearbeitung wird nicht gespeichert – Escape-Verhalten greift (ursprünglicher Titel bleibt).
- [ ] Der geänderte Titel wird sofort in localStorage persistiert.
- [ ] Ist ein Todo im Bearbeitungsmodus und der Nutzer doppelklickt ein anderes, wird das erste via Blur bestätigt und das zweite geöffnet.
- [ ] Der Titel-Input respektiert das 200-Zeichen-Limit (analog FEAT-1).
- [ ] Status-Toggle (FEAT-3) ist während aktivem Bearbeitungsmodus deaktiviert.

### Edge Cases
- **Leerzeichen-only als neuer Titel:** Wird als leer behandelt – Abbruch, ursprünglicher Titel bleibt.
- **Identischer Titel bestätigt (keine Änderung):** Kein erneutes Speichern nötig, Bearbeitungsmodus wird normal beendet.
- **Sehr langer bestehender Titel (nahe 200 Zeichen):** Input-Limit greift, bestehender Inhalt wird vollständig angezeigt.
- **Doppelklick auf erledigtes Todo:** Bearbeitungsmodus öffnet sich – erledigt/offen spielt keine Rolle für die Editierbarkeit.
- **Schneller Doppelklick gefolgt von sofortigem Escape:** Ursprünglicher Titel bleibt, kein Zwischenzustand sichtbar.

### Nicht im Scope
- Bearbeitung anderer Felder als dem Titel (Datum, Priorität, etc.)
- Keyboard-Shortcut zum Öffnen des Bearbeitungsmodus ohne Doppelklick
- Undo-History für Titeländerungen
- Gleichzeitiges Bearbeiten mehrerer Todos

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Feature erweitert den bestehenden S-01 State zu S-01b (Inline-Edit-Modus). Kein Modal, kein separater Screen – der Titel eines Todo-Items wird direkt an seiner Position zu einem Eingabefeld.

Route (neu): – keine –

### Einstiegspunkte
- Doppelklick auf den Titel-Bereich eines Todo-Items (S-01)
- (Optional für spätere Erweiterung: dedizierter Edit-Icon-Button im Trailing-Bereich – nicht in diesem Scope)

### User Flow

```
S-01 (Todo-Liste)
    ↓
Doppelklick auf Todo-Titel
    ↓
S-01b: Titel-Text verschwindet, Input erscheint an gleicher Position
       → Input: bestehender Titel vorausgefüllt, vollständig selektiert (select-all)
       → autofocus auf Input
       → Status-Toggle: disabled (opacity 0.5)
       → Trailing-Aktionen: ausgeblendet
    ↓
    ├─ Enter oder Blur (nicht leer)
    │       → Speichern, localStorage update
    │       → S-01b → S-01
    │       → Input verschwindet, Titel-Text erscheint (neuer Titel)
    │
    ├─ Escape
    │       → Kein Speichern, ursprünglicher Titel bleibt
    │       → S-01b → S-01
    │
    └─ Blur mit leerem Inhalt
            → Behandelt wie Escape – ursprünglicher Titel bleibt
            → S-01b → S-01
```

### Interaktionsmuster
- **Primärmuster:** Inline-Editing – kein Modal, keine Navigation (Referenz: flows/product-flows.md S-01b)
- **Fehler-Handling:** Kein Error-State – leere Eingabe = Abbruch (stilles Fallback auf Original), kein sichtbares Feedback
- **Leerer Zustand:** Nicht relevant für FEAT-4
- **Ladeverhalten:** Kein Spinner – synchrone Operation

### Eingesetzte Komponenten

| Komponente       | DS-Status         | Quelle                                    |
|------------------|-------------------|-------------------------------------------|
| Input (default, sm) | ✓ Vorhanden    | design-system/components/input.md         |

**Größen-Entscheidung Input sm (32px):**  
Inline Editing soll keinen visuellen Layout-Shift erzeugen – das Input-Feld ersetzt den Titel-Text an genau derselben Position. `sm` (32px) passt sich dem Rhythmus der Listenzeilen besser an als `md` (40px). Desktop-Kontext, Tastatur-first: die reduzierte Touch-Target-Größe ist akzeptabel (dokumentiert in A11y-Tabelle).

**DS Label-Regel für Inline Input:**  
DS schreibt vor: "Labels sind immer vergeben – niemals nur Placeholder". Für Inline-Editing im Listenkontext gilt: sichtbares Label ist weder funktional sinnvoll noch visuell möglich (würde das Layout sprengen). Lösung: `aria-label="Todo-Titel bearbeiten"` auf dem Input-Element – semantisch vollständig, ohne sichtbares Label. Kein Placeholder nötig da der Titel vorausgefüllt ist. ✅

**Item-Zustand während S-01b:**
```
<li class="editing">
  [Status-Toggle]       ← disabled: opacity 0.5, pointer-events: none
  [Input sm]            ← autofocus, select-all, maxlength="200"
  [Trailing-Aktionen]   ← ausgeblendet (visibility: hidden oder display: none)
</li>
```

### Screen Transitions (verbindlich)

| Von    | Trigger                              | Nach   | Bedingung                                            |
|--------|--------------------------------------|--------|------------------------------------------------------|
| S-01   | Doppelklick auf Todo-Titel           | S-01b  | Todo wechselt in Inline-Edit-Modus                   |
| S-01b  | Enter                                | S-01   | Neuer Titel nicht leer – wird gespeichert            |
| S-01b  | Enter                                | S-01   | Neuer Titel leer – Abbruch, original Titel bleibt    |
| S-01b  | Blur (Fokus verlässt Input)          | S-01   | Neuer Titel nicht leer – wird gespeichert            |
| S-01b  | Blur (Fokus verlässt Input)          | S-01   | Neuer Titel leer – Abbruch, original Titel bleibt    |
| S-01b  | Escape                               | S-01   | Immer – original Titel wiederhergestellt             |
| S-01b  | Doppelklick auf anderes Todo         | S-01b  | Erstes via Blur bestätigt, zweites öffnet Edit       |

*(Bereits vollständig in `flows/product-flows.md` eingetragen)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** Input (default, sm)
- **Neue Komponenten (Tokens-Build, genehmigt):** –
- **Bewusste Abweichungen (Hypothesentest):** Input ohne sichtbares Label – ersetzt durch `aria-label` (Inline-Kontext-Begründung)

### Barrierefreiheit (A11y)

**Keyboard-Navigation:**
- Doppelklick triggert Edit-Modus (Maus)
- Keyboard-Einstieg: Tab + Enter auf Edit-Icon (wenn vorhanden in FEAT-4-Erweiterung) oder nativ via Doppelklick-Simulation über custom keydown
- Im Edit-Modus: Tab verlässt das Input via Blur → speichert (per Spec)
- Escape: immer Abbruch
- Space und Enter innerhalb des Inputs: Standardverhalten (Space = Leerzeichen, Enter = Bestätigen)

**Screen Reader:**
- SR kündigt Statuswechsel an wenn `aria-label` korrekt gesetzt: "Todo-Titel bearbeiten, Bearbeitungsfeld"
- Bei Beenden des Edit-Modus: Fokus kehrt auf das Todo-Item zurück (nicht auf ein anderes Element)
- `aria-disabled="true"` auf Status-Toggle während S-01b

**Touch Target:**

| Element | Visuell | Klickbereich | WCAG 2.5.5 (44px) | Anpassung |
|---------|---------|--------------|-------------------|-----------|
| Input (sm, Inline) | 32px Höhe | Volle Zeilenbreite klickbar | ✅ (Item-Klickfläche ≥ 44px hoch) | Item-Padding erweitern wenn nötig |

**Farbkontrast (berechnet):**

| Element | Vordergrund-Token | Hintergrund-Token | Hex fg | Hex bg | Ratio | WCAG |
|---------|------------------|------------------|--------|--------|-------|------|
| Input-Text (Inline Edit) | `color-text-primary` | `color-neutral-0` | #111827 | #FFFFFF | ~18.8:1 | ✅ |
| Input-Border (Focus) | `color-border-focus` | `color-neutral-0` | #3B82F6 | #FFFFFF | 3.68:1 | ✅ 3:1 (WCAG 1.4.11) |
| Disabled Toggle (S-01b) | – | – | – | – | – | Deaktiviertes UI – kein Kontrast-Requirement (WCAG 1.4.3 Exception) |

### Mobile-Verhalten
- Per PRD out-of-scope
- Doppelklick auf Mobile = Doppeltap → natürlich verfügbar, aber Mobile-Optimierung nicht im Scope

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
TodoListArea  (projekt/src/components/TodoListArea.tsx – aus FEAT-2)
└── TodoItem  (projekt/src/components/TodoItem.tsx – aus FEAT-2/3, erweitert)
    ├── StatusToggle  (FEAT-3 – bekommt disabled={isEditing} Prop)
    ├── [Wenn NICHT editing]: TodoTitle (<span onDoubleClick={...}>)
    └── [Wenn editing]:       TodoEditInput  (projekt/src/components/TodoEditInput.tsx)  ← NEU
        └── <input aria-label="Todo-Titel bearbeiten" maxLength=200>
```

`useTodos` Hook bekommt:
- **Neue Funktion:** `updateTodo(id: string, newTitle: string)` → aktualisiert Titel in State + localStorage

Editing-State (UI-State – **nicht** in `useTodos`, sondern als `useReducer` in `TodoListArea`):
- Verantwortung: wer ist gerade im Edit-Modus, welcher Wert steht im Input, welcher Wert ist der Original-Wert für Abbruch

### State Machine

**Pflicht – 3 von 6 State-Komplexitäts-Mustern zutreffend (Edit-Modus, Race Condition blur+Enter, Fokus-Management)**

```
States: idle | editing

Events:
  EDIT_START(id, title) – Doppelklick auf Titel
  EDIT_SAVE(newTitle)   – Enter oder onBlur mit nicht-leerem Wert
  EDIT_CANCEL           – Escape oder onBlur mit leerem Wert

Transitionen:
  idle    + EDIT_START(id, title) → editing  { editingId: id, editValue: title, originalValue: title }
  editing + EDIT_SAVE(newTitle)   → idle     { editingId: null } → Side Effect: updateTodo(id, newTitle)
  editing + EDIT_CANCEL           → idle     { editingId: null } → kein Speichern, originalValue ignoriert
  idle    + EDIT_SAVE             → idle     (no-op – verhindert blur nach Enter: State ist bereits idle)
  idle    + EDIT_CANCEL           → idle     (no-op)

Implementierung: useReducer in TodoListArea (nicht useState+useEffect-Kaskade)
```

**Race Condition blur+Enter – gelöst durch State Machine:**
Wenn der Nutzer Enter drückt:
1. `onKeyDown` → `dispatch(EDIT_SAVE)` → State wechselt zu `idle` → `updateTodo()` wird aufgerufen
2. `onBlur` feuert direkt danach → `dispatch(EDIT_SAVE)` im `idle`-State → **no-op** → kein doppeltes Speichern

Kein Flag, kein Timeout, keine `useRef`-Hack-Lösung nötig.

### Daten-Model

Keine Änderung am Daten-Model. `updateTodo(id, newTitle)` schreibt nur in das bestehende `title`-Feld.

### API / Daten-Fluss

```
Doppelklick auf Todo-Titel
    ↓
dispatch(EDIT_START(todo.id, todo.title))
    ↓
TodoItem re-rendert: Titel-Span → TodoEditInput
useEffect auf editingId: inputRef.current.focus() + inputRef.current.select()

Enter oder Blur (nicht leer):
    ↓
dispatch(EDIT_SAVE(newTitle.trim()))
    → idle-State: updateTodo(id, newTitle) → useTodos schreibt in localStorage
    → TodoItem re-rendert: TodoEditInput → Titel-Span (mit neuem Titel)

Escape oder Blur (leer):
    ↓
dispatch(EDIT_CANCEL)
    → idle-State: kein Speichern
    → TodoItem re-rendert: TodoEditInput → Titel-Span (originalValue)

Fokus nach Ende des Edit-Modus:
    → useEffect auf editingId (null): Fokus auf das Todo-Item oder den nächsten Tab-Stop
    → verhindert Fokus-Verlust ins Nirgendwo
```

### Tech-Entscheidungen

- **`useReducer` für Editing-State:** Die State Machine verhindert blur+Enter-Race-Condition ohne Hacks. Klarer als 3 separate `useState`-Hooks + komplexe useEffect-Abhängigkeiten.
- **Editing-State in `TodoListArea`, nicht in `useTodos`:** `useTodos` ist ein Daten-Hook – er soll nicht von UI-Zuständen wissen. `TodoListArea` koordiniert UI + Daten: ruft `dispatch` für UI-State und `updateTodo` für Daten auf.
- **`useEffect` für `focus()` + `select()`:** `inputRef.current.focus()` + `inputRef.current.select()` direkt nach `EDIT_START` in einem `useEffect` – wartet auf Re-Render nach State-Change bevor DOM-Zugriff.
- **`onBlur` + `onKeyDown` beide dispatchen:** Einheitlicher Dispatch-Pfad – kein bedingter Code außerhalb des Reducers.
- **Input sm (32px):** Gleiche Höhe wie Titel-Text-Zeile – verhindert Layout-Shift beim Wechsel Span ↔ Input.
- **`select()` beim EDIT_START:** Kompletter Titel ist selektiert – Power-User kann sofort überschreiben ohne manuell alles zu markieren.

### Security-Anforderungen

- **OWASP XSS:** Neuer Titel wird via `updateTodo` in State geschrieben und von React als Text-Content gerendert – kein `dangerouslySetInnerHTML`. Kein Risiko.
- **Input-Validierung:** `maxLength={200}` am Inline-Input + `trim()` vor Speicherung. Leerer/nur-Leerzeichen-Titel → EDIT_CANCEL-Verhalten (kein Speichern).

### Dependencies

Keine neuen Packages.

### A11y-Architektur

| Element | ARIA-Pattern | Entscheidung |
|---------|-------------|--------------|
| Titel-Span (editierbar) | Kein `role="button"` nötig | Doppelklick-Trigger ist ein Span – nicht als Button kommuniziert. Keyboard-Einstieg in Edit-Modus via Tab+F2 oder nur Doppelklick (Desktop-First, Keyboard-Shortcut für FEAT-4-Erweiterung). Akzeptiert für diesen Scope. |
| Inline-Input | `aria-label="Todo-Titel bearbeiten"` | Kein sichtbares Label im Listenkontext. SR liest: "Todo-Titel bearbeiten, Bearbeitungsfeld" |
| StatusToggle während Edit | `disabled` + `aria-disabled="true"` | SR liest: "[Label], nicht verfügbar". Verhindert Fokus und Interaktion |
| Fokus nach EDIT_START | `inputRef.focus() + select()` via useEffect | Input erhält sofort Fokus, gesamter Titel selektiert |
| Fokus nach EDIT_END (Save/Cancel) | Fokus zurück auf `<li>` des bearbeiteten Todos via `todoItemRef.current.focus()` | Verhindert Fokus-Verlust. `<li>` bekommt `tabIndex={-1}` damit programmatischer Fokus möglich ist, ohne den Tab-Flow zu stören |
| Live-Region | Kein separates `aria-live` nötig | SR erkennt den State-Wechsel (Input → Text) im Dokument automatisch wenn Fokus zurückgeht |

### Test-Setup

- **Unit Tests (`useReducer`-Reducer direkt):**
  - `idle + EDIT_START` → `editing` mit korrekten Werten
  - `editing + EDIT_SAVE (nicht leer)` → `idle`
  - `editing + EDIT_CANCEL` → `idle`
  - `idle + EDIT_SAVE` → `idle` (no-op – Race-Condition-Test)
  - `idle + EDIT_CANCEL` → `idle` (no-op)
- **Integration Tests (React Testing Library):**
  - Doppelklick auf Titel → Input erscheint, Titel selektiert (prüfbar via `input.selectionStart === 0`)
  - Enter im Input → Titel aktualisiert, Input verschwunden
  - Escape → Original-Titel, Input verschwunden
  - Blur mit nicht-leerem Wert → Titel gespeichert
  - Blur mit leerem Wert → Original-Titel wiederhergestellt
  - Enter dann automatisch Blur → kein Doppel-Speichern (Race-Condition-Test)
  - Leerer/nur-Leerzeichen-Titel + Enter → Original-Titel bleibt
  - Identischer Titel + Enter → kein erneutes `updateTodo` (Optimierung optional)
  - Doppelklick auf Todo-A, dann Doppelklick auf Todo-B → Todo-A Blur speichert, Todo-B Edit öffnet
- **E2E:** Ergänzung des bestehenden E2E-Tests: Todo anlegen → Doppelklick → Titel ändern → Enter → neuer Titel in Liste + Refresh → persistiert

### Test-Infrastruktur

- **Test-Environment:** `happy-dom` + Vitest + React Testing Library (wie FEAT-2/3).
- **Mocks:** `localStorage`-Mock aus FEAT-2 wiederverwenden.
- **Doppelklick:** `userEvent.dblClick(titleElement)` – React Testing Library unterstützt doppelte Klick-Events nativ.
- **Select-All prüfen:** `expect(inputElement.selectionStart).toBe(0); expect(inputElement.selectionEnd).toBe(inputElement.value.length)` – nach `userEvent.dblClick`.
- **Race-Condition-Test (blur+Enter):** `userEvent.keyboard('[Enter]')` → sofort `fireEvent.blur(input)` – prüfen dass `updateTodo` nur einmal aufgerufen wird (via `vi.spyOn`).
- **Fokus-nach-Edit-Ende:** `expect(document.activeElement).toBe(todoListItemElement)` – nach Enter/Escape.
- **Bekannte Fallstricke:**
  - `userEvent.dblClick` funktioniert nur wenn das Element im DOM fokussierbar/klickbar ist – `pointer-events: none` durch happy-dom nicht erkannt, eher über DOM-Events testen.
  - `useEffect` für `focus/select` ist async – `await waitFor(() => expect(document.activeElement).toBe(inputEl))` verwenden.
  - Reducer-Unit-Tests können direkt gegen die Reducer-Funktion laufen ohne React-Kontext – schnell und deterministisch.
