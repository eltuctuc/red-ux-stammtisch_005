# FEAT-5: Todo löschen

## Status
Aktueller Schritt: Done

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo anlegen) – es muss Todos geben die gelöscht werden können
- Benötigt: FEAT-2 (Todo-Liste & Persistenz) – Löschung muss persistiert werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-02*

### Beschreibung
Der Nutzer kann ein Todo dauerhaft löschen. Das Löschen erfordert eine explizite Bestätigung bevor das Todo entfernt wird. Nach der Bestätigung verschwindet das Todo sofort aus der Liste und wird aus localStorage entfernt.

### Definitionen
- **Löschen:** Dauerhafte, nicht rückgängig machbare Entfernung eines Todos aus der Liste und aus localStorage.
- **Bestätigung:** Explizite Nutzeraktion die das Löschen final auslöst – z.B. ein zweiter Klick auf "Wirklich löschen?" oder ein Inline-Bestätigungsschritt direkt am Todo-Eintrag (kein Modal-Dialog).
- **Löschen-Trigger:** Initialer Auslöser der den Bestätigungsschritt sichtbar macht (z.B. ein "×"-Button am Todo).

### User Stories
- Als Nutzer möchte ich ein Todo löschen können wenn es nicht mehr relevant ist.
- Als Pragmatiker möchte ich nicht durch einen Modal-Dialog unterbrochen werden – die Bestätigung soll inline und tastaturfreundlich sein.
- Als Nutzer möchte ich vor dem endgültigen Löschen eine Bestätigung sehen, damit ich versehentliches Löschen verhindern kann.
- Als Power User möchte ich die Bestätigung per Tastatur auslösen können.
- Als Nutzer möchte ich den Löschvorgang mit Escape abbrechen können bevor ich bestätigt habe.

### Acceptance Criteria
- [ ] Jedes Todo hat einen Löschen-Trigger (z.B. "×"-Button oder "Löschen"-Icon).
- [ ] Ein Klick / Tastendruck auf den Löschen-Trigger zeigt einen Inline-Bestätigungsschritt direkt am Todo-Eintrag an – kein Modal.
- [ ] Erst nach expliziter Bestätigung wird das Todo gelöscht.
- [ ] Escape oder Klick außerhalb bricht den Bestätigungsschritt ab – das Todo bleibt erhalten.
- [ ] Nach dem Löschen verschwindet das Todo sofort aus der Liste.
- [ ] Das gelöschte Todo wird aus localStorage entfernt.
- [ ] Nach dem Löschen des letzten Todos wird der Leerzustand (FEAT-2) korrekt angezeigt.
- [ ] Der Bestätigungsschritt ist per Tastatur erreichbar und auslösbar.

### Edge Cases
- **Löschen während Bearbeitungsmodus (FEAT-4):** Nicht möglich – der Löschen-Trigger ist während aktivem Inline-Editing deaktiviert.
- **Versehentlicher Klick auf Löschen-Trigger:** Bestätigungsschritt erscheint, Escape oder Wegklicken bricht ab – kein Datenverlust.
- **Letztes Todo löschen:** Leerzustand wird korrekt angezeigt (erklärende Nachricht + Eingabefeld).
- **Schnelles Doppel-Klick auf Bestätigung:** Löschung wird nur einmal ausgeführt – kein doppelter State-Update.
- **Löschen eines erledigten Todos:** Funktioniert identisch zu einem offenen Todo – Status spielt keine Rolle.

### Nicht im Scope
- Undo nach dem Löschen
- Bulk-Löschen (mehrere Todos gleichzeitig)
- Automatisches Löschen erledigter Todos
- Papierkorb / Archiv

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Feature erweitert den bestehenden S-01 State mit einem optionalen S-01c (Inline-Lösch-Bestätigung). Kein Modal, kein separater Screen. Der Bestätigungsschritt erscheint inline am betreffenden Todo-Item.

Route (neu): – keine –

### Einstiegspunkte
- "×"-Button im Trailing-Bereich eines Todo-Items (hover-sichtbar, wie in FEAT-2/3 definiert)
- Tastatur: Tab bis zum "×"-Button + Enter/Space

### User Flow

```
S-01 (Todo-Liste)
    ↓
Klick/Enter auf "×"-Button am Todo-Item
    ↓
S-01c: Todo-Item zeigt Inline-Bestätigungszeile
       → Titel-Text: gedimmt (color-text-secondary)
       → Confirmation-Zeile: "Löschen?" + [Abbrechen] [Löschen]
       → Fokus: automatisch auf [Abbrechen] (sicherer Default)
       → Löschen-Trigger selbst: ausgeblendet
    ↓
    ├─ Klick/Enter auf [Löschen] (Danger Button)
    │       → Todo wird aus Liste und localStorage entfernt
    │       → S-01c → S-01 (wenn weitere Todos vorhanden)
    │       → S-01c → S-01a (wenn letztes Todo)
    │
    ├─ Klick/Enter auf [Abbrechen] oder Escape
    │       → Kein Löschen, S-01c → S-01
    │       → Fokus zurück auf Löschen-Trigger des Items
    │
    └─ Klick außerhalb des Bestätigungsschritts
            → Kein Löschen, S-01c → S-01
```

### Interaktionsmuster
- **Primärmuster:** Inline-Confirm ohne Modal (Referenz: feedback.md → kein Modal für nicht-kritische Destruktiv-Aktionen in Listenkontext)
- **Fehler-Handling:** Kein Fehler-State – synchrone localStorage-Operation
- **Leerer Zustand:** Wenn letztes Todo gelöscht: S-01a (FEAT-2 Leerzustand)
- **Ladeverhalten:** Kein Spinner – synchrone Operation

### Eingesetzte Komponenten

| Komponente              | DS-Status         | Quelle                                    |
|-------------------------|-------------------|-------------------------------------------|
| Button (ghost, sm)      | ✓ Vorhanden       | design-system/components/button.md – Löschen-Trigger (×) |
| Button (ghost, sm)      | ✓ Vorhanden       | design-system/components/button.md – Abbrechen im S-01c |
| Button (danger, sm)     | ✓ Vorhanden       | design-system/components/button.md – finaler Löschen-Button |

**DS Rule Compliance:**

- **Danger Button**: DS-Regel "Danger-Buttons erst nach expliziter Bestätigung" ✅  
  Der initiale `×`-Trigger ist ein `ghost`-Button – kein Danger. Erst im S-01c-Bestätigungsschritt erscheint der `danger`-Button. Die Reihenfolge ist regelkonform.
- **Max. 1 Primary Button pro sichtbarem Kontext**: Der `danger`-Button ist kein `primary`-Button ✅  
- **Ghost-Button für "Abbrechen"**: DS-Variante `ghost` = "Tertiäraktion, wenig visuelles Gewicht" ✅  
- **Aktive Beschriftung**: Buttons: "Abbrechen" und "Löschen" (nicht "Ja" / "Nein") ✅

**S-01c Layout (Inline-Bestätigungszeile):**
```
<li class="confirming-delete">
  [Status-Toggle]      ← ausgeblendet (visibility: hidden)
  [Titel (gedimmt)]    ← color-text-secondary, keine Interaktion
  [Spacer]
  ["Löschen?" Text]    ← style-body-sm, color-text-secondary, margin-right: spacing-3
  [Abbrechen Button]   ← ghost, sm
  [Löschen Button]     ← danger, sm
</li>
```

**Farbtoken-Empfehlung für Danger Button:**  
DS spezifiziert keine Hex-Werte für die `danger`-Variante. Empfehlung: `color-error-700` (#B91C1C) als Hintergrund (nicht `color-error-500` #EF4444) – einziger Weg um WCAG AA für weißen Button-Text zu erfüllen (s. Kontrast-Tabelle).

### Screen Transitions (verbindlich)

| Von    | Trigger                                  | Nach   | Bedingung                                      |
|--------|------------------------------------------|--------|------------------------------------------------|
| S-01   | Klick/Tastendruck auf Löschen-Trigger    | S-01c  | Inline-Bestätigungsschritt wird sichtbar       |
| S-01c  | Klick/Enter auf [Löschen]               | S-01   | Todo gelöscht; mind. 1 Todo verbleibt          |
| S-01c  | Klick/Enter auf [Löschen]               | S-01a  | Todo gelöscht; Liste ist jetzt leer            |
| S-01c  | Escape                                   | S-01   | Abbruch – Todo bleibt erhalten                 |
| S-01c  | Klick außerhalb des Bestätigungsschritts | S-01   | Abbruch – Todo bleibt erhalten                 |
| S-01c  | Klick/Enter auf [Abbrechen]             | S-01   | Abbruch – Todo bleibt erhalten                 |

*(Bereits vollständig in `flows/product-flows.md` eingetragen)*

**Constraint (aus flows):**  
S-01b: Löschen-Trigger ist deaktiviert während Inline-Editing ist aktiv. Kein gleichzeitiges S-01b + S-01c möglich.

### DS-Status dieser Implementierung
- **Konforme Komponenten:** Button (ghost, sm), Button (danger, sm)
- **Neue Komponenten (Tokens-Build, genehmigt):** –
- **Bewusste Abweichungen (Hypothesentest):** –
- **DS-Lücke Danger Button Farbwerte:** Keine definierten Hex-Werte im DS → Empfehlung `color-error-700` (#B91C1C) für WCAG-Compliance. DS-Owner-Entscheidung ausstehend.

### Barrierefreiheit (A11y)

**Keyboard-Navigation:**
- Tab im Todo-Item: `[Status-Toggle] → [×-Button]`
- Enter/Space auf "×"-Button → öffnet S-01c
- Im S-01c: Fokus liegt automatisch auf [Abbrechen] (sicherer Default, kein versehentliches Löschen durch sofortiges Enter)
- Tab in S-01c: `[Abbrechen] → [Löschen] → zurück`
- Enter/Space auf [Löschen] → Todo gelöscht
- Escape → S-01, Fokus zurück auf "×"-Button des Items

**Screen Reader:**
- "×"-Button: `aria-label="Todo löschen"` (kein sichtbarer Textlabel)
- [Abbrechen]-Button: sichtbares Label "Abbrechen" ✅
- [Löschen]-Button: sichtbares Label "Löschen" ✅
- S-01c-Zustand: `aria-live="polite"` auf dem Item oder Bestätigungs-Region → SR kündigt "Löschen bestätigen?" an wenn Schritt erscheint
- Nach Löschung: Fokus springt auf nächstes Todo-Item (oder auf Input wenn Liste leer)

**Touch Target:**

| Element | Visuell | Klickbereich | WCAG 2.5.5 (44px) | Anpassung |
|---------|---------|--------------|-------------------|-----------|
| "×"-Button (ghost, sm) | 32px Höhe | Wrapper 44px | ❌ / ✅ via Wrapper | Desktop-only, Wrapper empfohlen |
| [Abbrechen] Button (ghost, sm) | 32px Höhe | 32px | ❌ | Desktop-only app, PRD out-of-scope |
| [Löschen] Button (danger, sm) | 32px Höhe | 32px | ❌ | Desktop-only app, PRD out-of-scope |

**Farbkontrast (berechnet):**

| Element | Vordergrund-Token | Hintergrund-Token | Hex fg | Hex bg | Ratio | WCAG |
|---------|------------------|------------------|--------|--------|-------|------|
| Danger Button Text (Empfehlung: error-700 bg) | `color-neutral-0` | `color-error-700` | #FFFFFF | #B91C1C | 6.47:1 | ✅ 4.5:1 |
| Danger Button Text (falls error-500 bg) | `color-neutral-0` | `color-error-500` | #FFFFFF | #EF4444 | 3.76:1 | ❌ 4.5:1 (normaltext) / ✅ 3:1 (UI) |
| Ghost Button Text ("Abbrechen") | `color-neutral-800` | `color-neutral-0` | #1F2937 | #FFFFFF | ~16:1 | ✅ |
| S-01c "Löschen?" Text | `color-text-secondary` | `color-neutral-0` | #4B5563 | #FFFFFF | 7.56:1 | ✅ |
| Todo-Titel gedimmt (S-01c) | `color-text-secondary` | `color-neutral-0` | #4B5563 | #FFFFFF | 7.56:1 | ✅ |

> **Empfehlung Danger Button:** `color-error-700` (#B91C1C) als Hintergrundfarbe verwenden statt `color-error-500` (#EF4444). Einzige Möglichkeit WCAG AA (4.5:1) für weißen Button-Text bei 14px zu erfüllen. Bitte DS-Tokens für Danger Button ergänzen: `color-button-danger-bg: color-error-700`.

### Mobile-Verhalten
- Per PRD out-of-scope
- Inline-Confirm funktioniert auf Mobile – kein Modal nötig

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
TodoListArea  (projekt/src/components/TodoListArea.tsx – aus FEAT-2/4, erweitert)
└── TodoItem  (projekt/src/components/TodoItem.tsx – aus FEAT-2/3/4, erweitert)
    ├── [Wenn NICHT confirming]:
    │   ├── StatusToggle  (disabled während confirming)
    │   ├── TodoTitle  (FEAT-4 Doppelklick – gesperrt während confirming)
    │   └── Trailing-Aktionen
    │       └── DeleteButton  (<button aria-label="Todo löschen">×</button>)  ← NEU
    └── [Wenn confirming]: DeleteConfirmInline  (projekt/src/components/DeleteConfirmInline.tsx)  ← NEU
        ├── <span> Titel gedimmt </span>
        ├── <span class="sr-only" aria-live="polite">Löschen bestätigen?</span>
        ├── <button ref=abortRef>Abbrechen</button>  (ghost, sm)
        └── <button ref=confirmRef>Löschen</button>  (danger, sm)
```

`useTodos` Hook bekommt:
- **Neue Funktion:** `deleteTodo(id: string)` → entfernt Todo aus State + localStorage

Delete-Confirm-State (UI-State – **nicht** in `useTodos`, sondern via `useReducer` in `TodoListArea`):

### State Machine

**Pflicht – 2 von 6 State-Komplexitäts-Mustern zutreffend (Multi-Step, Fokus-Management)**

```
States: idle | confirming

Events:
  DELETE_TRIGGER(id)  – "×"-Button geklickt / Enter auf "×"-Button
  DELETE_CONFIRM      – [Löschen]-Button geklickt / Enter auf [Löschen]
  DELETE_CANCEL       – [Abbrechen]-Button, Escape oder Klick außerhalb

Transitionen:
  idle       + DELETE_TRIGGER(id) → confirming  { confirmingId: id }
  confirming + DELETE_CONFIRM     → idle         { confirmingId: null } + Side Effect: deleteTodo(id)
  confirming + DELETE_CANCEL      → idle         { confirmingId: null } → kein Löschen
  idle       + DELETE_CONFIRM     → idle         (no-op – Doppel-Klick-Schutz)
  idle       + DELETE_CANCEL      → idle         (no-op)

Implementierung: useReducer in TodoListArea.
Fokus-Effekte via useEffect auf confirmingId (nicht im Reducer):
  - confirmingId → id gesetzt: abortButtonRef.current.focus()
  - confirmingId → null (nach Cancel): deleteButtonRef.current.focus()
  - confirmingId → null (nach Confirm): Fokus auf nächstes Todo-Item oder Input wenn Liste leer
```

**Doppel-Klick-Schutz:** `idle + DELETE_CONFIRM` → no-op. Nach dem ersten `DELETE_CONFIRM` ist State bereits `idle` – ein weiterer Klick löst keine zweite Löschung aus.

**Klick-außen und Escape:**
- Escape: `document.addEventListener('keydown', handler)` via `useEffect` (nur aktiv wenn `confirmingId !== null`). Handler dispatcht `DELETE_CANCEL`.
- Klick außen: `document.addEventListener('click', handler)` via `useEffect` (nur aktiv wenn `confirmingId !== null`). Handler prüft `!containerRef.current?.contains(event.target)` → dispatcht `DELETE_CANCEL`. Listener wird mit `{ capture: true }` registriert um den initialen "×"-Klick nicht zu fangen.

### Daten-Model

Keine Änderung. `deleteTodo(id)` filtert das Todo aus dem Array heraus.

### API / Daten-Fluss

```
Klick/Enter auf "×"-Button
    ↓
dispatch(DELETE_TRIGGER(todo.id))
useEffect: confirmingId gesetzt → abortButtonRef.current.focus()
    ↓
[Abbrechen] oder Escape oder Klick außen:
dispatch(DELETE_CANCEL)
useEffect: confirmingId null → deleteButtonRef.current.focus()  ← Fokus zurück auf "×"

[Löschen] bestätigt:
dispatch(DELETE_CONFIRM)
deleteTodo(id) → useTodos filtert Todo aus State → useEffect schreibt localStorage
    → TodoListArea re-rendert
    → Wenn Todos verbleiben: Fokus auf nächstes TodoItem (via nextTodoRef.current.focus())
    → Wenn Liste leer: Fokus auf Input (FEAT-1 inputRef, via Callback-Prop oder Context)
```

### Tech-Entscheidungen

- **`useReducer` für Confirm-State:** Verhindert Doppel-Confirm-Race ohne Flag. Klarer Zustand: entweder `idle` oder genau ein `confirmingId`.
- **`DeleteConfirmInline` als eigene Komponente:** Kapselt Refs (`abortButtonRef`, `confirmRef`) und Event-Listener (Escape, Klick-außen) sauber. TodoItem bleibt schlank.
- **Fokus auf [Abbrechen] als Default:** Nicht auf [Löschen] – verhindert versehentliches Löschen durch sofortiges Enter nach dem Trigger.
- **Klick-außen via `capture: true`:** Verhindert dass der "×"-Klick selbst sofort wieder DELETE_CANCEL auslöst. `capture: true` registriert den Listener nach dem aktuellen Event-Cycle.
- **Fokus nach Löschen via Ref-Array in `TodoListArea`:** `TodoListArea` hält ein Array von Refs auf alle Todo-Items. Nach Löschen: `itemRefs[deletedIndex]` entfernt, Fokus auf `itemRefs[deletedIndex]` (nächstes Item) oder `itemRefs[deletedIndex - 1]` (wenn letztes) oder auf Input wenn leer.
- **`disabled` während FEAT-4 Edit-Modus:** `DeleteButton` bekommt `disabled={editingId !== null}` Prop. Verhindert gleichzeitiges S-01b + S-01c.

### Security-Anforderungen

- **OWASP:** Kein Risiko – `deleteTodo` verarbeitet eine ID aus In-Memory-State, keine externe Eingabe.
- **Bestätigungs-Pattern:** Zweistufige Bestätigung schützt vor versehentlichem Datenverlust.

### Dependencies

Keine neuen Packages.

### A11y-Architektur

| Element | ARIA-Pattern | Entscheidung |
|---------|-------------|--------------|
| "×"-Delete-Button | `aria-label="Todo löschen"` | Icon-only – SR liest "Todo löschen, Schaltfläche" |
| DeleteConfirmInline Container | `role="group"` + `aria-label="Löschen bestätigen"` | Gruppiert die Bestätigungs-Buttons semantisch |
| SR-Ankündigung bei S-01c | `<span class="sr-only" aria-live="polite">Löschen bestätigen?</span>` | Trigger: rendert wenn `confirming`. Nicht im initialen Render. SR kündigt an wenn Bestätigungsschritt erscheint |
| [Abbrechen] Button | Sichtbares Label "Abbrechen" | kein extra aria nötig |
| [Löschen] Button | Sichtbares Label "Löschen" | kein extra aria nötig |
| Fokus-Management | Komplex (3 Fälle) | 1) Öffnen → [Abbrechen]-Fokus; 2) Cancel → "×"-Button-Fokus; 3) Confirm → nächstes Item oder Input |
| Disabled während FEAT-4 Edit-Modus | `disabled` + `aria-disabled="true"` auf "×"-Button | SR liest "nicht verfügbar" |
| Escape-Handler | `document.keydown` Listener | Erwartet SR-Nutzer – Escape ist Standard-Schließ-Pattern für temporäre UI |

### Test-Setup

- **Unit Tests (Reducer):**
  - `idle + DELETE_TRIGGER` → `confirming`
  - `confirming + DELETE_CONFIRM` → `idle`
  - `confirming + DELETE_CANCEL` → `idle`
  - `idle + DELETE_CONFIRM` → `idle` (no-op)
  - `idle + DELETE_CANCEL` → `idle` (no-op)
- **Integration Tests (React Testing Library):**
  - Klick auf "×" → Bestätigungszeile erscheint, Fokus auf [Abbrechen]
  - Enter auf "×" → gleich wie Klick
  - [Abbrechen] klicken → Bestätigungszeile weg, Fokus zurück auf "×"
  - Escape → Bestätigungszeile weg, Fokus zurück auf "×"
  - [Löschen] klicken → Todo aus DOM verschwunden, localStorage aktualisiert
  - Letztes Todo löschen → EmptyState sichtbar, Fokus auf Input
  - Schneller Doppel-Klick auf [Löschen] → nur einmal gelöscht (no-op Schutz)
  - Löschen während Edit-Modus (editingId gesetzt) → "×"-Button disabled, nicht klickbar
  - Klick außerhalb S-01c → Bestätigungszeile weg
- **E2E:** Vollständiger Flow: Todo anlegen → "×" klicken → [Löschen] bestätigen → Todo weg → Refresh → Todo bleibt weg

### Test-Infrastruktur

- **Test-Environment:** `happy-dom` + Vitest + React Testing Library.
- **Mocks:** `localStorage`-Mock aus FEAT-2.
- **Fokus-Tests:** `expect(document.activeElement).toBe(abortButtonEl)` nach Trigger. `await waitFor(...)` da Fokus via `useEffect` asynchron gesetzt wird.
- **Escape-Test:** `userEvent.keyboard('[Escape]')` – feuert `keydown` auf Document.
- **Klick-außen-Test:** `userEvent.click(document.body)` nach Öffnen der Bestätigungszeile → prüfen dass Bestätigungszeile verschwunden.
- **Bekannte Fallstricke:**
  - `document.addEventListener` in `useEffect` muss im Test aktiv sein – happy-dom unterstützt `document`-Events. `cleanup()` von React Testing Library entfernt Komponenten aber nicht Document-Listener – `afterEach: vi.restoreAllMocks()` und manuelle Cleanup-Funktion aus dem `useEffect` sicherstellen.
  - `capture: true` Listener für Klick-außen: in Tests mit `fireEvent.click(document.body)` triggern (nicht `userEvent` – `userEvent` bubbles anders).

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-03*

### Implementierte Dateien
- `projekt/src/hooks/useTodos.ts` – `deleteTodo(id)` hinzugefügt (filtert aus State + localStorage)
- `projekt/src/App.tsx` – `deleteTodo` an `TodoListArea` als `onDelete` weitergereicht
- `projekt/src/components/DeleteConfirmInline.tsx` – Neue Komponente: Inline-Bestätigung mit Escape/Klick-außen/Fokus-Management
- `projekt/src/components/DeleteConfirmInline.css` – DS Button ghost sm + danger sm Styles
- `projekt/src/components/TodoItem.tsx` – ×-Button (ghost sm), isConfirming-Rendering, Fokus-zurück-nach-Cancel via useEffect
- `projekt/src/components/TodoItem.css` – Delete-Button-Styles: hover-sichtbar, disabled-Zustand
- `projekt/src/components/TodoListArea.tsx` – deleteReducer (State Machine), Fokus-nach-Löschen via todoItemLiRefs Map
- `projekt/src/components/TodoListArea.test.tsx` – 5 deleteReducer-Unit-Tests + 14 Integration-Tests (111 gesamt)
- `projekt/src/index.css` – DS-Tokens ergänzt: color-neutral-800, color-error-700, color-error-100

### Installierte Dependencies
- Keine neuen Packages.

### Offene Punkte / Tech-Debt
- Danger Button Hover-Farbe (#991B1B) ist kein DS-Token – DS-Lücke aus UX-Spec, DS-Owner-Entscheidung ausstehend
- `overflow: hidden` auf `.todo-list` könnte theoretisch Fokus-Ring des ×-Buttons clippen – in Tests nicht reproduziert, Prototype-Scope

---

## 5. QA Ergebnisse
*Ausgefüllt von: /red:proto-qa — 2026-04-03*

### Acceptance Criteria Status
- [x] AC-1: Jedes Todo hat einen Löschen-Trigger (×-Button) ✅
- [x] AC-2: Klick auf Trigger → Inline-Bestätigungsschritt (kein Modal) ✅
- [x] AC-3: Erst nach expliziter Bestätigung wird gelöscht ✅
- [x] AC-4: Escape / Klick außen → Abbruch, Todo bleibt ✅
- [x] AC-5: Nach Löschen sofort aus Liste ✅
- [x] AC-6: Nach Löschen aus localStorage entfernt ✅
- [x] AC-7: Letztes Todo löschen → Leerzustand korrekt ✅
- [x] AC-8: Bestätigungsschritt per Tastatur erreichbar ✅

### Security-Check
- Kein XSS-Risiko: `deleteTodo` verarbeitet nur In-Memory-IDs, kein `dangerouslySetInnerHTML`
- Kein Race Condition: Reducer-Architektur verhindert Doppel-Löschen

### A11y-Check
- `aria-label="Todo löschen"` auf ×-Button ✅
- `role="group"` + `aria-label="Löschen bestätigen"` auf Confirm-Container ✅
- `aria-live="polite"` SR-Ankündigung vorhanden ✅
- `disabled` + `aria-disabled` auf ×-Button während Edit-Modus ✅
- `aria-hidden` auf "Löschen?"-Text – SR sieht Text nicht ❌ → BUG-FEAT5-UX-002
- Fokus-Tests fehlen ❌ → BUG-FEAT5-QA-002, BUG-FEAT5-QA-003

### Offene Bugs
- BUG-FEAT5-QA-001 – Fehlender Test: Enter/Space auf ×-Button (Medium)
- BUG-FEAT5-QA-002 – Fehlender Test: Fokus zurück nach Cancel (Medium)
- BUG-FEAT5-QA-003 – Fehlende Tests: Fokus nach Löschen (Medium)
- BUG-FEAT5-QA-004 – Kein Guard Edit+Confirming gleichzeitig (Low)
- BUG-FEAT5-UX-001 – Status-Toggle fehlt in S-01c (Medium)
- BUG-FEAT5-UX-002 – "Löschen?"-Text aria-hidden (Medium)
- BUG-FEAT5-UX-003 – Titel S-01c: text-base statt text-sm (Low)

### Summary
- ✅ 8/8 Acceptance Criteria passed
- 0 Critical, 0 High, 5 Medium, 2 Low
- 111 Tests grün

### Production-Ready
❌ NOT Ready – 5 Medium offen (3× fehlende Tests, 1× UX-Abweichung S-01c, 1× A11y aria-hidden)
