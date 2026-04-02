# FEAT-2: Todo-Liste & Persistenz

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo anlegen) – ohne Anlegen gibt es nichts anzuzeigen

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-02*

### Beschreibung
Die App zeigt alle vorhandenen Todos in einer Liste an. Die Liste lädt beim Start aus localStorage und bleibt nach einem Browser-Refresh erhalten. Im leeren Zustand wird eine erklärende Nachricht mit Eingabefeld gezeigt, damit der Nutzer sofort starten kann.

### Definitionen
- **Todo-Liste:** Geordnete Sammlung aller angelegten Todos, sortiert nach Erstellungszeitpunkt (neueste zuerst – oben).
- **Persistenz:** Automatisches Speichern des aktuellen Listen-Zustands in localStorage nach jeder Änderung. Kein manuelles Speichern nötig.
- **Leerer Zustand:** Zustand der App wenn keine Todos vorhanden sind – weder beim ersten Laden noch nach dem Löschen aller Todos.
- **localStorage-Key:** Ein fester Key (z.B. `todos`) unter dem alle Todos als JSON gespeichert werden.

### User Stories
- Als Pragmatiker möchte ich nach dem Öffnen der App sofort alle meine Todos sehen, ohne etwas tun zu müssen.
- Als Nutzer möchte ich, dass meine Todos nach einem Browser-Refresh noch vorhanden sind.
- Als Power User möchte ich die Liste ohne Scrollen oder Maus-Interaktion überblicken können.
- Als neuer Nutzer (leere Liste) möchte ich eine hilfreiche Nachricht und ein sofort nutzbares Eingabefeld sehen, damit ich ohne Orientierungsaufwand starten kann.
- Als Nutzer möchte ich, dass erledigte Todos visuell von offenen unterscheidbar sind (z.B. durchgestrichen / abgedunkelt).

### Acceptance Criteria
- [ ] Beim Start der App werden alle in localStorage gespeicherten Todos geladen und angezeigt.
- [ ] Nach einem Browser-Refresh sind alle Todos weiterhin vorhanden und in derselben Reihenfolge.
- [ ] Todos sind nach Erstellungszeitpunkt sortiert – neueste oben, älteste unten.
- [ ] Erledigte Todos sind visuell von offenen unterscheidbar (z.B. durchgestrichener Text, reduzierter Kontrast).
- [ ] Im leeren Zustand (keine Todos vorhanden) wird eine erklärende Nachricht angezeigt (z.B. "Noch keine Todos – leg eines an").
- [ ] Im leeren Zustand ist das Eingabefeld sichtbar und fokussiert – der Nutzer kann sofort tippen.
- [ ] Jede Änderung (Anlegen, Bearbeiten, Löschen, Status-Toggle) wird automatisch in localStorage persistiert.
- [ ] Die Liste zeigt Titel und Status jedes Todos an.

### Edge Cases
- **Korrupte localStorage-Daten** (z.B. manuell manipuliert): Die App ignoriert ungültige Daten, startet mit leerer Liste und überschreibt den fehlerhaften Eintrag beim nächsten Speichern.
- **localStorage deaktiviert oder voll**: Die App bleibt funktionsfähig (Todos existieren in-memory für die Session), zeigt aber keinen expliziten Fehler – kein Blocking.
- **Sehr viele Todos (50+)**: Liste scrollt, kein Paging, keine Performance-Optimierung nötig für diesen Scope.
- **Alle Todos gelöscht**: Leerer Zustand wird korrekt angezeigt (erklärende Nachricht + Eingabefeld).
- **Erster App-Start (noch kein localStorage-Eintrag)**: Leerer Zustand – kein Fehler, keine Ladeanimation.

### Nicht im Scope
- Sortierung oder Filterung nach Status, Datum oder Priorität
- Mehrere Listen oder Kategorien
- Sync zwischen Browser-Tabs oder Geräten
- Exportieren oder Importieren der Todo-Liste
- Pagination oder virtuelles Scrolling

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Feature lebt auf S-01 / S-01a (URL: `/`) – direkt unterhalb des fixierten Eingabebereichs (FEAT-1).  
Die Todo-Liste füllt den restlichen Viewport-Bereich und scrollt vertikal wenn mehr Todos vorhanden sind als in den sichtbaren Bereich passen. Kein separater Screen, kein Routing.

Route (neu): – keine –

### Einstiegspunkte
- App-Start: localStorage wird beim Initialisieren synchron ausgelesen
- Wenn Daten vorhanden: direkt S-01 (Liste sichtbar)
- Wenn leer/korrupt/nicht vorhanden: S-01a (Leerzustand)
- Nach jedem Todo-Anlegen / -Löschen wird die Liste automatisch neu gerendert

### User Flow

```
App-Start
    ↓
localStorage-Read
    ├─ Leer / korrupt / nicht vorhanden
    │       → S-01a: Empty State zeigen
    │         (Eingabefeld fokussiert, erklärende Nachricht darunter)
    │
    └─ Todos vorhanden
            → S-01: Todo-Liste rendern
              Todos: neueste oben, älteste unten
              Offene Todos: normaler Text
              Erledigte Todos: durchgestrichen + abgedunkelter Text
              Jedes Todo: Platzhalter für Status-Toggle (FEAT-3) +
                          Titel + Trailing-Bereich für Aktionen (FEAT-4/5)
```

### Interaktionsmuster
- **Primärmuster:** Einfache Liste – `<ul>/<li>` Struktur nach data-display.md → "Einfache Liste"
- **Fehler-Handling:** Korrupte localStorage-Daten → silent fallback auf leere Liste, kein Fehler-Banner (per Spec: kein Blocking)
- **Leerer Zustand (S-01a):** Empty State nach feedback.md → Icon + Titel + Beschreibung. Kein CTA-Button da Eingabefeld (FEAT-1) bereits fixiert oben sichtbar ist.
- **Ladeverhalten:** Kein Skeleton, kein Spinner – localStorage-Read ist synchron. Liste erscheint sofort beim Rendern. Keine wahrnehmbare Ladedauer.
- **Hover-Aktionen:** Trailing-Bereich für FEAT-4/5-Icons – erscheint beim Item-Hover (spart visuellen Noise im Ruhezustand). Platzhalter im DOM vorhanden, Sichtbarkeit über CSS gesteuert.

### Eingesetzte Komponenten

| Komponente             | DS-Status          | Quelle                                              |
|------------------------|--------------------|-----------------------------------------------------|
| List (ul/li)           | ⚠ Tokens-Build     | Kein List-Item im DS – nach data-display.md Pattern  |
| Empty State            | ⚠ Tokens-Build     | Kein Empty-State-Komponent – nach feedback.md Pattern |

**Begründung Tokens-Build:**
- DS hat `Card (compact)` für Listen, aber Card-Spec schreibt vor "Nicht verwenden wenn: Für Listen-Einträge mit vielen Zeilen → List-Item". Todos sind einzeilig, aber Card per Item ist für ein minimales Todo-App visuell zu schwer (unnötige Borders, Shadows, Paddings).
- Entscheidung: semantisches `<ul>/<li>` mit DS-Tokens (spacing, colors, typography). Gleicher Look & Feel wie ein `Card (compact)` ohne formale Spec. Genehmigt 2026-04-02.

**Todo List Item Anatomie (Tokens-Build):**
```
<li>
  [Status-Toggle-Bereich]   ← FEAT-3 – Platzhalter 24px breit
  [Titel]                   ← style-body (text-base), flex-grow: 1
  [Trailing-Aktionen]       ← FEAT-4/5 – hover-reveal, opacity: 0 → 1
</li>
```

- Padding: `spacing-3` oben/unten, `spacing-4` links/rechts (`spacing-component-sm`)
- Trennlinie: `1px color-border-default` zwischen Items (nicht nach letztem Item)
- Hintergrund Item: `color-neutral-0` (kein Hover-Tint nötig – Hover zeigt nur Trailing-Aktionen)

**Visuelle Differenzierung offen vs. erledigt:**
- Offen: `color-text-primary` (#111827), keine `text-decoration`
- Erledigt: `color-text-secondary` (#4B5563) + `text-decoration: line-through`
- Begründung Farbwahl: `color-text-disabled` (#9CA3AF) wäre semantisch naheliegend, aber Kontrast nur 2.54:1 – schlechter als WCAG 1.4.11 (3:1 für UI-Komponenten). `color-text-secondary` (#4B5563) ergibt 7.56:1 und kommuniziert "erledigt" dennoch klar durch die Kombination mit line-through. DS-Lücke: kein dedizierter "done"-Token vorhanden.

**Empty State Layout (S-01a):**
```
[Icon: Checkmark oder Liste – 40px, color-text-disabled]
[Titel: "Noch keine Todos."] ← style-body, font-weight-medium, color-text-primary
[Text: "Einfach oben tippen und Enter drücken."] ← style-body-sm, color-text-secondary
```
- Kein CTA-Button (Eingabefeld oben ist bereits der Call-to-Action)
- Vertikal zentriert im verfügbaren Bereich unterhalb des Eingabebereichs
- Padding: `spacing-section-md` oben

### Screen Transitions (verbindlich)

FEAT-2 löst selbst keine State Transitions aus – das Feature ist rein display-seitig. Die relevanten Transitions (S-01a ↔ S-01) werden durch Aktionen aus anderen Features getriggert und sind bereits in `flows/product-flows.md` eingetragen:

| Von    | Trigger                       | Wohin  | Bedingung                          | Feature |
|--------|-------------------------------|--------|------------------------------------|---------|
| S-01a  | Enter im Input (nicht leer)   | S-01   | Erstes Todo angelegt               | FEAT-1  |
| S-01c  | "Bestätigen" Löschen          | S-01a  | Letztes Todo gelöscht              | FEAT-5  |

*(Keine neuen Transitions durch FEAT-2)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** –
- **Neue Komponenten (Tokens-Build, genehmigt):** List-Item (ul/li nach data-display.md), Empty State (nach feedback.md)
- **Bewusste Abweichungen (Hypothesentest):** –

### Barrierefreiheit (A11y)

**Keyboard-Navigation:**
- Todo-Liste selbst nicht direkt tastatur-navigierbar (keine Links/Buttons in FEAT-2)
- Status-Toggle, Edit und Delete (FEAT-3/4/5) fügen fokussierbare Elemente hinzu
- Tab-Reihenfolge in Todo-Items: `[Status-Toggle] → [Trailing-Aktionen]` (FEAT-3/4/5 definieren das)

**Screen Reader:**
- `<ul aria-label="Todo-Liste">` – semantische Liste mit Label
- Im Leerzustand: `<p>` Elemente, kein `aria-live` nötig (Zustand ändert sich nicht dynamisch ohne Nutzeraktion)
- Wenn Liste aktualisiert wird (Todo angelegt): `aria-live="polite"` auf dem Listen-Container empfohlen (sodass SR ankündigt "Todo hinzugefügt"), alternativ Fokusmanagement nach FEAT-1

**Farbkontrast (berechnet):**

| Element | Vordergrund-Token | Hintergrund-Token | Hex fg | Hex bg | Ratio | WCAG |
|---------|------------------|------------------|--------|--------|-------|------|
| Todo-Titel (offen) | `color-text-primary` | `color-neutral-0` | #111827 | #FFFFFF | ~18.8:1 | ✅ 4.5:1 |
| Todo-Titel (erledigt) | `color-text-secondary` | `color-neutral-0` | #4B5563 | #FFFFFF | 7.56:1 | ✅ 4.5:1 |
| Empty-State-Titel | `color-text-primary` | `color-neutral-0` | #111827 | #FFFFFF | ~18.8:1 | ✅ |
| Empty-State-Text | `color-text-secondary` | `color-neutral-0` | #4B5563 | #FFFFFF | 7.56:1 | ✅ |
| Empty-State-Icon | `color-text-disabled` | `color-neutral-0` | #9CA3AF | #FFFFFF | 2.54:1 | ⚠ Icon dekorativ – kein Text, WCAG 1.4.11 für dekorative Icons nicht anwendbar. Icon hat kein `aria-label` (rein visuell). |
| Trennlinie | `color-border-default` | `color-neutral-0` | #E5E7EB | #FFFFFF | – | Non-text UI – kein Kontrast-Requirement für reine Linien |

> **Hinweis für erledigte Todos:** `color-text-secondary` (#4B5563) statt `color-text-disabled` (#9CA3AF) gewählt – bewusste Abweichung von der "naheliegenden" Disabled-Token-Nutzung zugunsten WCAG-Compliance. Die visuelle "Erledigt"-Kommunikation übernimmt `text-decoration: line-through` als zweiten Kanal.

### Mobile-Verhalten
- Per PRD out-of-scope
- Grundverhalten: Liste nimmt volle Breite, scrollt vertikal – funktioniert ohne spezifische Anpassungen

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
App (Root – projekt/src/App.tsx)
├── TodoInputArea  (FEAT-1 – bereits gebaut)
└── TodoListArea  (projekt/src/components/TodoListArea.tsx)
    ├── TodoList  (<ul aria-label="Todo-Liste">)  [wenn todos.length > 0]
    │   └── TodoItem  (wiederholend, projekt/src/components/TodoItem.tsx)
    │       ├── [Status-Toggle-Platzhalter 24px]  (FEAT-3 – leeres div, kein Interaktion)
    │       ├── TodoTitle  (<span> mit conditional styling offen/erledigt)
    │       └── [Trailing-Aktionen-Platzhalter]  (FEAT-4/5 – opacity:0, hover-reveal via CSS)
    └── EmptyState  (projekt/src/components/EmptyState.tsx)  [wenn todos.length === 0]
```

Wiederverwendbar aus bestehenden Komponenten:
- `TodoInputArea` aus FEAT-1 – keine Änderungen nötig

### Daten-Model

Bereits in FEAT-1 definiert, hier verbindlich festgelegt für das Lesen:

Ein Todo-Objekt im localStorage:
- **id:** string (UUID)
- **title:** string (getrimmt, 1–200 Zeichen)
- **createdAt:** string (ISO-8601)
- **status:** `"open"` oder `"done"`

localStorage Key: `"todos"`, Format: JSON-Array dieser Objekte.

Sortierung in der Liste: nach `createdAt` absteigend (neueste oben). Sortierung passiert beim Lesen/Rendern, nicht beim Speichern.

### API / Daten-Fluss

```
App mountet
    ↓
useTodos-Hook initialisiert → localStorage.getItem("todos")
    ├─ null / nicht vorhanden → State: [] → EmptyState rendern
    ├─ ungültiges JSON (SyntaxError) → State: [] → localStorage.removeItem("todos") → EmptyState
    ├─ kein Array → State: [] → localStorage.removeItem("todos") → EmptyState
    └─ valides Array → Struktur-Validation jedes Items → State: validierte Todos[]
           → Sortierung: neueste zuerst → TodoList rendern

State-Mutation (Anlegen/Löschen/Bearbeiten aus anderen Features):
    → useTodos gibt Mutationsfunktionen zurück (addTodo, deleteTodo etc.)
    → State-Update → useEffect schreibt neuen State nach localStorage
```

### Daten-Validation

Quelle: `localStorage` (Key: `"todos"`)

**Risiko:** TypeScript-Types bieten KEINEN Runtime-Schutz. `JSON.parse(raw) as Todo[]` erzeugt keinen Fehler wenn die Struktur falsch ist – crashes entstehen erst beim Rendern.

**Validation-Strategie (in dieser Reihenfolge):**
1. **Existenz-Check:** `localStorage.getItem("todos") === null` → leeres Array zurückgeben
2. **JSON-Parse:** in `try/catch` – bei `SyntaxError`: localStorage-Eintrag löschen, leeres Array zurückgeben
3. **Typ-Check:** `Array.isArray(parsed)` – falls `false`: localStorage löschen, leeres Array
4. **Struktur-Check pro Item:** `item.id` (string), `item.title` (string), `item.createdAt` (string, ISO-parsebar), `item.status` (`"open"` oder `"done"`) – Items die diesen Check nicht bestehen werden herausgefiltert (kein Hard-Fail für die gesamte Liste)
5. **Fallback:** Leeres Array. Beim nächsten Schreiben (z.B. neues Todo) wird localStorage mit validen Daten überschrieben.
6. **Nutzer-Feedback:** Kein Fehler-Banner – per Spec "silent fallback". App startet im Leerzustand.

### Tech-Entscheidungen

- **Custom Hook `useTodos`:** Zentralisiert die gesamte Todo-State-Logik (laden, speichern, CRUD). Alle Komponenten konsumieren nur den Hook – kein direktes localStorage-Zugriff außerhalb des Hooks. Macht Tests isolierbar und FEAT-3/4/5 einfach erweiterbar.
- **useEffect für localStorage-Sync:** `useEffect(() => { localStorage.setItem("todos", JSON.stringify(todos)) }, [todos])` – reagiert auf State-Änderungen, schreibt synchron. Kein separater "save"-Aufruf nötig.
- **Sortierung beim Rendern, nicht beim Speichern:** `[...todos].sort(...)` direkt im Render – einfacher, keine gespeicherte Reihenfolge die inkonistent werden kann.
- **Komponenten-Splitting:** `TodoListArea`, `TodoList`, `TodoItem`, `EmptyState` als separate Dateien – bessere Testbarkeit und klare Verantwortlichkeiten.
- **Platzhalter-Strategie für FEAT-3/4/5:** DOM-Struktur für Status-Toggle und Trailing-Aktionen jetzt anlegen (leere divs mit CSS-Klassen), aber ohne Funktionalität. Verhindert spätere Layout-Umbrüche wenn FEAT-3/4/5 die Slots befüllen.

### Security-Anforderungen

- **Authentifizierung:** Keine – lokale App.
- **Autorisierung:** Keine.
- **Input-Validierung:** Validation beim Lesen aus localStorage (siehe Daten-Validation). Beim Schreiben ist der State bereits durch FEAT-1-Logik bereinigt.
- **OWASP-relevante Punkte:**
  - **XSS:** Todo-Titel aus localStorage werden als React-Text-Content gerendert – kein `dangerouslySetInnerHTML`. Kein Risiko auch bei manipulierten localStorage-Daten.
  - **localStorage-Manipulation:** Nutzers eigene Daten – kein Security-Risiko. Validation schützt vor App-Crashes, nicht vor Security-Angriffen.

### Dependencies

Keine neuen Packages. React (bereits vorhanden) mit `useState` + `useEffect` + `useCallback` reicht.

### A11y-Architektur

| Element | ARIA-Pattern | Entscheidung |
|---------|-------------|--------------|
| Listen-Container | `<ul aria-label="Todo-Liste">` | Pflicht – Screen Reader liest "Todo-Liste, X Einträge". Kein `role="list"` nötig (ul ist bereits semantisch) |
| Todo-Items | `<li>` | Kein zusätzliches ARIA. Inhalt wird durch Screen Reader vorgelesen |
| Leerer Zustand | `<div>` + `<p>` Elemente | Statischer Text – kein `aria-live` nötig (ändert sich nicht ohne Nutzeraktion) |
| Live-Region für neue Todos | `aria-live="polite"` auf `<ul>` | SR gibt Feedback wenn neues Todo erscheint (FEAT-1 triggert das). Trigger: nur wenn Item hinzugefügt wird – **nicht** beim initialen Render. Implementierungshinweis: `aria-live` erst NACH initialem Render setzen (z.B. via `useEffect`) oder Liste initial ohne `aria-live` rendern und nach erstem User-Action hinzufügen |
| Erledigte Todos | `aria-label` oder `aria-describedby` | Nur line-through reicht nicht für SR. Erledigt-Status entweder via `aria-label="[Titel], erledigt"` am li, oder `<span class="sr-only"> (erledigt)</span>` nach dem Titel |
| Fokus-Management | Kein aktives Fokus-Management in FEAT-2 | FEAT-2 rendert nur – Fokus bleibt nach FEAT-1-Logik im Input |

### Test-Setup

- **Unit Tests (pure Logik):**
  - `loadTodosFromStorage()`: null → [], SyntaxError → [], kein Array → [], korruptes Item → gefiltert, valide Daten → korrekt
  - Sortierung: neueste createdAt erscheint zuerst
- **Integration Tests (React Testing Library):**
  - App-Render ohne localStorage → EmptyState sichtbar
  - App-Render mit validen localStorage-Daten → Todos erscheinen in korrekter Reihenfolge
  - App-Render mit korrupten localStorage-Daten → EmptyState (silent fallback)
  - Neues Todo anlegen (FEAT-1-Integration) → erscheint in Liste, localStorage aktualisiert
  - Erledigtes Todo → visuell unterscheidbar (line-through, color-text-secondary)
- **E2E:**
  - Vollständiger Flow: App öffnen → Todo eingeben → Enter → Todo in Liste sichtbar → Refresh → Todo noch vorhanden

### Test-Infrastruktur

- **Test-Environment:** `happy-dom` (Vitest Standard). Bekannte Limitierung: `localStorage` in happy-dom ist nicht vollständig zuverlässig – Mock verwenden.
- **Mocks erforderlich:**
  - `localStorage` → eigenes In-Memory-Mock in `beforeEach`:
    ```
    const localStorageMock = (() => {
      let store: Record<string, string> = {}
      return {
        getItem: (key: string) => store[key] ?? null,
        setItem: (key: string, value: string) => { store[key] = value },
        removeItem: (key: string) => { delete store[key] },
        clear: () => { store = {} }
      }
    })()
    vi.stubGlobal('localStorage', localStorageMock)
    ```
  - `Date` → `vi.setSystemTime(...)` für deterministische Sortierungstests
- **Setup/Teardown:**
  - `beforeEach`: `localStorage.clear()` (via Mock)
  - `afterEach`: `vi.restoreAllMocks()`, `vi.useRealTimers()` wenn System-Time gemockt
- **Bekannte Fallstricke:**
  - `useEffect` für localStorage-Sync feuert async – `await waitFor(...)` in Tests nötig wenn localStorage-Inhalt nach State-Mutation geprüft wird
  - `aria-live`-Region: muss nach initialem Render gesetzt werden – Tests die sofort nach `render()` prüfen ob aria-live gesetzt ist werden fehlschlagen

### State-Komplexität

Geprüft – kein State Machine erforderlich. `useTodos`-Hook verwaltet ein flaches Array. Keine verschachtelten State-Transitionen, keine async-Operationen, keine Race Conditions.

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-02*

### Implementierte Dateien
- `projekt/src/hooks/useTodos.ts` – Zentraler State-Hook: localStorage laden/speichern, Validation, addTodo, sortierte Ausgabe
- `projekt/src/components/TodoListArea.tsx` – Container: zeigt TodoList oder EmptyState, verwaltet aria-live-Initialisierung
- `projekt/src/components/TodoListArea.css` – Styles für ul.todo-list (Border, Radius, Overflow)
- `projekt/src/components/TodoItem.tsx` – Einzelnes Todo-Item mit Status-Toggle-Platzhalter und Trailing-Aktionen-Platzhalter
- `projekt/src/components/TodoItem.css` – Item-Styles: Trenner, open/done-Unterscheidung (line-through + color-text-secondary), Hover-Reveal
- `projekt/src/components/EmptyState.tsx` – Leerzustand-Komponente mit SVG-Icon
- `projekt/src/components/EmptyState.css` – Styles für Empty State
- `projekt/src/hooks/useTodos.test.ts` – Unit-Tests für loadTodosFromStorage (8 Tests)
- `projekt/src/components/TodoListArea.test.tsx` – Integrationstests für TodoListArea + App (11 Tests)

### Mitgefixte Bugs (Medium)
- BUG-FEAT1-UX-002: Button-Font auf `var(--text-sm)` korrigiert
- BUG-FEAT1-UX-003: Box-Shadow auf Input-Focus entfernt
- BUG-FEAT1-UX-004: Hardcodierte Farben auf DS-Tokens umgestellt, `--color-text-secondary` ergänzt
- BUG-FEAT1-UX-006: Wirkungsloses `aria-label` auf `div` entfernt

### Offene Punkte / Tech-Debt
- `sr-only`-Utility-Klasse ist in TodoInputArea.css definiert – bei Bedarf in globale CSS-Datei auslagern
- `--font-weight-medium` Token fehlt im DS – EmptyState nutzt Fallback `500`

---

## 5. QA Ergebnisse
*Ausgefüllt von: /red:proto-qa — 2026-04-02*

### Acceptance Criteria Status
- [x] Beim Start werden alle localStorage-Todos geladen ✅
- [x] Nach Browser-Refresh: Todos vorhanden, selbe Reihenfolge ✅
- [x] Sortierung: neueste Todos oben (createdAt desc) ✅
- [x] Erledigte Todos visuell unterscheidbar (line-through + color-text-secondary) ✅
- [x] Leerzustand: erklärende Nachricht sichtbar ✅
- [x] Leerzustand: Eingabefeld fokussiert ✅
- [x] Jede Änderung automatisch in localStorage persistiert ✅
- [x] Liste zeigt Titel und Status jedes Todos ✅

### Security-Check
✅ Kein dangerouslySetInnerHTML – Titel als React TextContent gerendert. Kein XSS-Risiko.

### A11y-Check
✅ `<ul aria-label="Todo-Liste">`, `aria-live="polite"` nach initialem Render, `sr-only "(erledigt)"` bei done-Todos, SVG-Icon `aria-hidden="true"`.

### Offene Bugs (Medium+)
- BUG-FEAT2-QA-001 – index.css Vite-Template interferiert mit DS (High)
- BUG-FEAT2-QA-002 – sr-only-Klasse nicht global (Medium)
- BUG-FEAT2-QA-004 – DS-Token-Block nicht global (Medium)
- BUG-FEAT2-UX-001 – EmptyState.css hardcodierte rem-Werte (Medium)
- BUG-FEAT2-UX-002 – Token --spacing-section-md nicht definiert (Medium)

### Offene Bugs (Low – zurückgestellt)
- BUG-FEAT2-QA-003 – Kein Test für identische Timestamps
- BUG-FEAT2-UX-003 – Token --font-weight-medium fehlt

### Summary
- ✅ 8/8 Acceptance Criteria passed
- ✅ 34/34 Tests grün
- ❌ 5 Bugs Medium+ (alle CSS-Struktur-Issues, keine funktionalen Fehler)
- ⏸ 2 Bugs Low (zurückgestellt)

### Production-Ready
❌ NOT Ready – CSS-Fundament-Issues müssen vor Release behoben werden.
