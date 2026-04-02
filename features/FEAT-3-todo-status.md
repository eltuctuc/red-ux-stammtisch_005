# FEAT-3: Todo-Status (erledigt / offen)

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: FEAT-1 (Todo anlegen) – es muss Todos geben die markiert werden können
- Benötigt: FEAT-2 (Todo-Liste & Persistenz) – Status-Änderung muss persistiert werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-02*

### Beschreibung
Der Nutzer kann ein Todo als erledigt markieren oder diesen Status zurücksetzen. Erledigte Todos bleiben an ihrer Position in der Liste und sind visuell klar von offenen unterschieden (durchgestrichener Text). Offene Todos müssen auf einen Blick erkennbar sein.

### Definitionen
- **Status:** Binärer Zustand eines Todos – entweder "offen" oder "erledigt".
- **Status-Toggle:** Einmalige Aktion die den Status eines Todos wechselt: offen → erledigt oder erledigt → offen.
- **Visuell erledigt:** Titel des Todos wird durchgestrichen dargestellt und/oder mit reduziertem Kontrast angezeigt.
- **Visuell offen:** Titel wird normal (nicht durchgestrichen) mit vollem Kontrast dargestellt.

### User Stories
- Als Pragmatiker möchte ich ein Todo mit einem einzigen Tastendruck oder Klick als erledigt markieren, ohne einen Dialog bestätigen zu müssen.
- Als Power User möchte ich den Status per Tastatur togglen können (z.B. Leertaste oder Enter wenn das Todo fokussiert ist).
- Als Nutzer möchte ich auf einen Blick sehen, welche Todos noch offen sind – erledigte sollen sich deutlich abheben.
- Als Pragmatiker möchte ich ein versehentlich erledigtes Todo wieder auf "offen" setzen können, ohne es löschen und neu anlegen zu müssen.
- Als Nutzer möchte ich, dass der Status nach einem Browser-Refresh erhalten bleibt.

### Acceptance Criteria
- [ ] Jedes Todo hat ein visuelles Element zum Status-Toggle (z.B. Checkbox oder Button).
- [ ] Ein Klick / Tastendruck auf das Toggle-Element wechselt den Status sofort (offen ↔ erledigt).
- [ ] Erledigte Todos werden mit durchgestrichenem Titel und reduziertem Kontrast dargestellt.
- [ ] Offene Todos sind klar vom erledigten Zustand visuell unterscheidbar – voller Kontrast, kein Durchstreichen.
- [ ] Der Status-Toggle ist per Tastatur erreichbar und auslösbar (Fokus + Leertaste oder Enter).
- [ ] Todos behalten nach dem Status-Toggle ihre Position in der Liste – keine Umsortierung.
- [ ] Der geänderte Status wird sofort in localStorage persistiert.
- [ ] Der Status bleibt nach einem Browser-Refresh erhalten.

### Edge Cases
- **Versehentlicher Toggle:** Kein Undo, kein Bestätigungsdialog – zweiter Toggle setzt den Status zurück.
- **Alle Todos erledigt:** Alle Einträge erscheinen durchgestrichen; die Liste bleibt sichtbar, kein Auto-Clear.
- **Sehr schneller Doppel-Toggle:** Status landet wieder im Ausgangszustand – kein inkonsistenter Zwischenzustand.
- **Todo während Bearbeitung (FEAT-4) als erledigt markieren:** Nicht erlaubt – während der aktiven Bearbeitung ist der Toggle deaktiviert.

### Nicht im Scope
- Automatisches Verschieben erledigter Todos ans Ende der Liste
- Archivieren oder Ausblenden erledigter Todos
- "Alle erledigen" oder "Alle zurücksetzen" als Bulk-Aktion
- Zeitstempel wann ein Todo erledigt wurde

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Feature ist kein eigener Screen – es erweitert jeden Todo-Listen-Eintrag auf S-01. Der Status-Toggle belegt den linken Bereich jedes List-Items (Platzhalter aus FEAT-2). Kein Modal, kein Overlay, kein separater Schritt.

Route (neu): – keine –

### Einstiegspunkte
- Sichtbar sobald Todos in der Liste vorhanden sind (S-01)
- Jedes Todo-Item trägt seinen eigenen Toggle – kein zentraler Einstiegspunkt

### User Flow

```
S-01 (Todo-Liste sichtbar)
    ↓
Nutzer fokussiert Toggle (Tab) oder klickt ihn direkt
    ↓
    ├─ Todo war offen
    │       → Toggle wechselt zu "erledigt"-Optik (filled circle mit Checkmark)
    │       → Titel wird durchgestrichen + color-text-secondary
    │       → localStorage update synchron
    │
    └─ Todo war erledigt
            → Toggle wechselt zu "offen"-Optik (leerer Kreis)
            → Titel: normal, color-text-primary, kein Durchstreichen
            → localStorage update synchron

Todos behalten ihre Position – keine Umsortierung durch Status-Wechsel.
```

### Interaktionsmuster
- **Primärmuster:** Inline-Toggle – kein Formular, kein Modal, kein Bestätigungsschritt
- **Fehler-Handling:** Kein Fehler-Zustand – Status-Toggle ist eine synchrone localStorage-Operation. Kein Rollback nötig.
- **Leerer Zustand:** Nicht relevant – Feature nur im befüllten Listenstate (S-01) aktiv
- **Ladeverhalten:** Kein Spinner – synchrone Operation, sofortiger visueller Feedback

### Eingesetzte Komponenten

| Komponente             | DS-Status          | Quelle                                              |
|------------------------|--------------------|-----------------------------------------------------|
| Checkbox (kreisförmig) | ⚠ Tokens-Build     | Kein Checkbox-Komponent im DS – native `<input type="checkbox">` + custom CSS via DS-Tokens |

**Technische Entscheidung – Tokens-Build Checkbox:**
- Native `<input type="checkbox">` mit `appearance: none` + benutzerdefiniertem Styling via CSS
- Begründung: Semantisch korrekt (`role="checkbox"`, `aria-checked` automatisch, Space-Toggle nativ), vollständig accessible ohne zusätzliches JavaScript für A11y
- Visuelle Form: **Kreis** (`border-radius: radius-full`) – typisches Todo-App-Pattern (Todoist, Things), fügt sich minimalistischer ein als eckige Checkbox
- Größe: **20×20px visuell**, Klickbereich via `::before`-Pseudo-Element oder Wrapper auf **44×44px** expandiert

**Toggle-Zustände:**

| Zustand | Hintergrund | Border | Inhalt | Token-Referenz |
|---------|-------------|--------|--------|----------------|
| Offen (unchecked) | `color-neutral-0` | 2px `color-neutral-400` | – | Bewusst stärker als `color-border-default` (s. A11y) |
| Erledigt (checked) | `color-primary-500` | keine | Checkmark-Icon weiß | `color-primary-500` (#3B82F6) |
| Focus | wie Zustand | + `color-border-focus` 2px Außen-Ring 2px offset | wie Zustand | `color-border-focus` |
| Disabled (FEAT-4 Edit-Modus) | `color-bg-muted` | 2px `color-neutral-200` | – | `opacity: 0.5`, `pointer-events: none` |

### Screen Transitions (verbindlich)

| Von   | Trigger                              | Nach   | Bedingung                              |
|-------|--------------------------------------|--------|----------------------------------------|
| S-01  | Klick / Leertaste auf Status-Toggle  | S-01   | Status wechselt (offen ↔ erledigt)     |

*(Bereits in `flows/product-flows.md` eingetragen – kein neuer State, nur UI-Update)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** –
- **Neue Komponenten (Tokens-Build, genehmigt):** Checkbox kreisförmig (native input + custom CSS, 2026-04-02)
- **Bewusste Abweichungen (Hypothesentest):** Checkbox-Border `color-neutral-400` statt `color-border-default` – WCAG-begründet (s. A11y)

### Barrierefreiheit (A11y)

**Keyboard-Navigation:**
- Tab → fokussiert den Checkbox-Bereich eines Todo-Items
- Space → togglet den Status (natives Checkbox-Verhalten)
- Enter → ebenfalls akzeptiert (per Spec, Abweichung vom nativen Space-only Verhalten → via `keydown`-Handler)
- Focus-Ring: sichtbarer 2px Außen-Ring in `color-border-focus` (#3B82F6), 2px Offset

**Screen Reader:**
- Native `<input type="checkbox">` → SR liest automatisch: "Erledigt, Checkbox, nicht markiert" o.ä.
- Label via `<label>`: visually hidden oder mit Todo-Titel verknüpft: `<label for="todo-[id]-toggle" class="sr-only">[Titel] als erledigt markieren</label>`
- Bei Status-Änderung kein explizites `aria-live` nötig – SR erkennt nativen Checkbox-State-Wechsel

**Touch Target:**

| Element | Visuell | Klickbereich | WCAG 2.5.5 (44px) | Anpassung |
|---------|---------|--------------|-------------------|-----------|
| Status-Toggle | 20×20px | 44×44px via Wrapper/Pseudo | ✅ (Klickbereich) | Wrapper-Padding oder `::before` 44px |

**Farbkontrast (berechnet):**

| Element | Vordergrund-Token | Hintergrund-Token | Hex fg | Hex bg | Ratio | WCAG |
|---------|------------------|------------------|--------|--------|-------|------|
| Checkbox unchecked border | `color-neutral-400` | `color-neutral-0` | #9CA3AF | #FFFFFF | 2.54:1 | ❌ 3:1 (WCAG 1.4.11 UI-Component) |
| Checkbox checked bg vs page | `color-primary-500` | `color-neutral-0` | #3B82F6 | #FFFFFF | 3.68:1 | ✅ 3:1 (Non-text, WCAG 1.4.11) |
| Checkmark icon (checked) | `color-neutral-0` | `color-primary-500` | #FFFFFF | #3B82F6 | 3.68:1 | ✅ 3:1 (Grafisches Icon) |
| Focus-Ring | `color-border-focus` | `color-neutral-0` | #3B82F6 | #FFFFFF | 3.68:1 | ✅ 3:1 |

> **Checkbox unchecked Border – WCAG 1.4.11 Gap:** `color-neutral-400` (#9CA3AF) auf weiß ergibt 2.54:1 – unterhalb 3:1. Kein DS-Token zwischen 400 und 600 verfügbar der exakt 3:1 erreicht. `color-neutral-600` (#4B5563) ergibt 7.56:1 wäre konform aber visuell zu schwer für eine dezente Checkbox. Pragmatische Entscheidung: `color-neutral-400` mit erhöhter Border-Stärke (2px statt 1px) verbessert Wahrnehmbarkeit. Bekannte DS-Lücke – kein Token im 3:1-Bereich vorhanden. Genehmigt 2026-04-02.

### Mobile-Verhalten
- Per PRD out-of-scope
- Touch-Target via Wrapper bereits auf 44px ausgelegt (zukunftssicher)

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
TodoItem  (projekt/src/components/TodoItem.tsx – aus FEAT-2, erweitert)
├── StatusToggle  (projekt/src/components/StatusToggle.tsx)  ← NEU
│   ├── <label class="sr-only" for="todo-[id]-toggle">  (Pflicht A11y)
│   └── <input type="checkbox" id="todo-[id]-toggle">  (native Semantik)
├── TodoTitle  (<span> – bestehend aus FEAT-2, bekommt conditional styling)
└── [Trailing-Aktionen-Platzhalter]  (FEAT-4/5 – unverändert)
```

`useTodos` Hook (projekt/src/hooks/useTodos.ts – aus FEAT-2) bekommt:
- **Neue Funktion:** `toggleTodo(id: string)` → wechselt `status` von `"open"` → `"done"` oder `"done"` → `"open"`

### Daten-Model

Keine Änderung am Daten-Model (wurde in FEAT-1/FEAT-2 definiert). `status` war bereits `"open" | "done"` – FEAT-3 schreibt nur in dieses bestehende Feld.

### API / Daten-Fluss

```
Nutzer klickt Toggle / drückt Space oder Enter auf fokussiertem Toggle
    ↓
onChange / onKeyDown-Handler → toggleTodo(todo.id)
    ↓
useTodos-Hook: todos.map(t => t.id === id ? { ...t, status: t.status === "open" ? "done" : "open" } : t)
    ↓
State-Update → useEffect schreibt nach localStorage (per FEAT-2-Mechanismus)
    ↓
TodoItem re-rendert → StatusToggle checked/unchecked + TodoTitle styling aktualisiert
```

### Tech-Entscheidungen

- **Native `<input type="checkbox">`:** Semantisch korrekt – SR liest `aria-checked` automatisch, Space-Toggle ist nativ. Kein `role="checkbox"` auf einem `<div>` nötig.
- **`appearance: none` + custom CSS:** Kreisförmige Optik via `border-radius: 9999px` – kein JavaScript für Styling nötig.
- **Enter-Key via `onKeyDown`:** Native Checkbox reagiert nur auf Space. Per Spec muss Enter auch funktionieren → `onKeyDown: e.key === "Enter" && toggleTodo(id)`. Kein `preventDefault` nötig (Checkbox hat kein Default-Enter-Verhalten).
- **`disabled` Prop vorbereiten:** `StatusToggle` bekommt ein `disabled`-Prop das FEAT-4 setzen kann wenn ein Todo im Edit-Modus ist. Für FEAT-3 immer `false`.
- **44px Touch Target via Wrapper:** `<label>` als Wrapper mit `min-height: 44px; min-width: 44px; display: flex; align-items: center; justify-content: center` – kein Pseudo-Element nötig, semantisch sauberer.

### Security-Anforderungen

- **Authentifizierung/Autorisierung:** Keine.
- **OWASP:** Kein neues Risiko – `toggleTodo` verarbeitet nur eine ID (string) aus dem In-Memory-State, keine externe Eingabe.

### Dependencies

Keine neuen Packages.

### A11y-Architektur

| Element | ARIA-Pattern | Entscheidung |
|---------|-------------|--------------|
| Toggle-Input | Native `<input type="checkbox">` | SR liest automatisch checked/unchecked-State. Kein zusätzliches `aria-checked` nötig |
| Toggle-Label | `<label for="todo-[id]-toggle" class="sr-only">[Titel] als erledigt markieren</label>` | Pflicht. ID muss eindeutig sein pro Todo (`todo-${todo.id}-toggle`). Enthält den Titel damit SR vorliest "Einkaufen, als erledigt markieren, Checkbox, nicht markiert" |
| Focus-Ring | CSS `:focus-visible` + `outline: 2px solid color-border-focus; outline-offset: 2px` | Sichtbar nur bei Keyboard-Navigation, nicht bei Mouse-Click |
| Enter-Key | `onKeyDown` Handler | Nativ reagiert Checkbox nur auf Space – Enter zusätzlich per Handler |
| Disabled-State (FEAT-4) | `disabled` Attribut + `opacity: 0.5; pointer-events: none` via CSS | Native `disabled` verhindert Focus und Interaktion. SR liest "nicht verfügbar" |
| Todo-Titel erledigt | `<span aria-hidden="true">` für line-through NICHT ausreichend | Status muss auch im SR erkennbar sein: sr-only Text `(erledigt)` nach dem Titel-Span oder `aria-label` am `<li>` |

### Test-Setup

- **Unit Tests (`useTodos` – `toggleTodo`):**
  - `"open"` → Toggle → `"done"`
  - `"done"` → Toggle → `"open"`
  - Schneller Doppel-Toggle → Status zurück zum Ausgangszustand (rein logisch)
  - Unbekannte ID → kein Fehler, State unverändert
- **Integration Tests (React Testing Library):**
  - Klick auf Toggle → `checked`-State wechselt + Titel bekommt `line-through`
  - Enter auf fokussiertem Toggle → gleiche Wirkung wie Klick
  - Space auf fokussiertem Toggle → gleiche Wirkung (nativ)
  - Toggle eines erledigten Todos → zurück zu offen (kein Durchstreichen mehr)
  - localStorage nach Toggle: `status` korrekt aktualisiert
  - `disabled` Toggle → kein State-Wechsel bei Klick / Tastendruck
- **E2E:** Ergänzung des FEAT-2-E2E-Tests: Todo anlegen → Toggle klicken → Refresh → Status bleibt erledigt

### Test-Infrastruktur

- **Test-Environment:** `happy-dom` + Vitest + React Testing Library (wie FEAT-2).
- **Mocks:** `localStorage`-Mock aus FEAT-2 wiederverwenden (gleiche `beforeEach`-Utility).
- **Keyboard-Tests:** `userEvent.keyboard('[Space]')` und `userEvent.keyboard('[Enter]')` für Toggle-Interaktion. `userEvent.tab()` um Focus auf Toggle zu setzen.
- **Bekannte Fallstricke:**
  - Native Checkbox `checked`-State in React ist controlled – `onChange` muss gesetzt sein sonst React-Warning "uncontrolled → controlled". Sicherstellen dass `checked` + `onChange` immer zusammen gesetzt sind.
  - `userEvent.click()` auf `<label>` triggert Checkbox-Toggle indirekt – ggf. direktes Click auf `<input>` in Tests zuverlässiger.

### State-Komplexität

Geprüft – kein State Machine erforderlich. Toggle ist ein einfacher Wechsel eines boolean-äquivalenten Feldes. Kein async, keine Race Conditions (localStorage synchron), kein komplexes Fokus-Management.

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-03*

### Implementierte Dateien
- `projekt/src/components/StatusToggle.tsx` – Neue kreisförmige Checkbox-Komponente (native input, DS-Tokens-Build)
- `projekt/src/components/StatusToggle.css` – Custom Styling via DS-Tokens, 44px Touch-Target via Label-Wrapper
- `projekt/src/components/TodoItem.tsx` – Toggle-Platzhalter durch StatusToggle ersetzt, onToggle-Prop ergänzt
- `projekt/src/components/TodoItem.css` – toggle-placeholder Klasse entfernt
- `projekt/src/components/TodoListArea.tsx` – onToggle-Prop ergänzt und an TodoItem durchgereicht
- `projekt/src/App.tsx` – toggleTodo aus useTodos destrukturiert und an TodoListArea übergeben
- `projekt/src/hooks/useTodos.ts` – toggleTodo-Funktion ergänzt, im Hook-Return exportiert
- `projekt/src/hooks/useTodos.test.ts` – 5 Unit-Tests für toggleTodo (open↔done, Doppel-Toggle, unknown ID, Persistenz)
- `projekt/src/components/TodoListArea.test.tsx` – 8 Integrationstests für Status-Toggle (Klick, Keyboard Enter/Space, Persistenz, Position)

### Installierte Dependencies
Keine neuen Packages.

### Offene Punkte / Tech-Debt
- `disabled`-Prop in StatusToggle vorbereitet für FEAT-4 (Edit-Modus) – für FEAT-3 immer `false`
- DS-Gap: Checkbox-Border `color-neutral-400` (#9CA3AF) liegt bei 2.54:1 Kontrast (< WCAG 3:1) – bekannt, genehmigt 2026-04-02, kein passender Token im 3:1-Bereich verfügbar
