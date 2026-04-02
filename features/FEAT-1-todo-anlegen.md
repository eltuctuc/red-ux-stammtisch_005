# FEAT-1: Todo anlegen

## Status
Aktueller Schritt: Dev

## Abhängigkeiten
- Benötigt: FEAT-2 (Todo-Liste & Persistenz) – das angelegte Todo muss gespeichert und angezeigt werden

---

## 1. Feature Spec
*Ausgefüllt von: /red:proto-requirements — 2026-04-02*

### Beschreibung
Der Nutzer kann jederzeit ein neues Todo mit einem Titel anlegen. Die Eingabe erfolgt über ein Textfeld und wird ausschließlich per Tastatur bestätigt (Enter). Das Todo erscheint sofort in der Liste.

### Definitionen
- **Todo:** Ein Aufgabeneintrag mit einem Titel (Text), einem Erstellungszeitpunkt und einem Status (offen/erledigt).
- **Titel:** Pflichtfeld, nicht-leerer, getrimmter Text. Maximallänge: 200 Zeichen.
- **Anlegen:** Das Todo wird in localStorage persistiert und in der Liste sichtbar.

### User Stories
- Als Pragmatiker möchte ich ein Todo durch Tippen und Enter-Drücken anlegen, ohne Maus oder zusätzliche Klicks zu benötigen.
- Als Power User möchte ich nach dem Anlegen sofort wieder im Eingabefeld landen, um mehrere Todos hintereinander erfassen zu können.
- Als Pragmatiker möchte ich, dass leere Eingaben stillschweigend ignoriert werden, damit ich nicht aus dem Flow gerissen werde.
- Als Power User möchte ich keine Bestätigungsdialoge oder Ladeanimationen beim Anlegen sehen, da das den Rhythmus unterbricht.
- Als Nutzer möchte ich, dass das Eingabefeld beim ersten Laden der App automatisch fokussiert ist, damit ich sofort tippen kann.

### Acceptance Criteria
- [ ] Ein Textfeld ist beim Laden der App automatisch fokussiert.
- [ ] Drücken von Enter mit nicht-leerem Inhalt legt das Todo an und leert das Eingabefeld.
- [ ] Das angelegte Todo erscheint sofort (ohne Reload) in der Todo-Liste.
- [ ] Eingaben die nur aus Leerzeichen bestehen werden getrimmt und als leer behandelt – kein Todo wird angelegt.
- [ ] Leere Eingabe + Enter: kein Todo wird angelegt, kein Fehler, kein visuelles Feedback – stilles Ignorieren.
- [ ] Nach dem Anlegen ist der Fokus wieder im Eingabefeld.
- [ ] Der Titel wird mit führenden und nachfolgenden Leerzeichen getrimmt gespeichert.
- [ ] Titel mit mehr als 200 Zeichen können nicht eingegeben werden (Input-Limit).

### Edge Cases
- **Nur Leerzeichen eingegeben:** Todo wird nicht angelegt, Eingabefeld geleert, kein Fehler angezeigt.
- **200-Zeichen-Grenze:** Input akzeptiert keine weiteren Zeichen sobald das Limit erreicht ist.
- **Sehr schnelle Mehrfacheingabe (Enter spammen):** Jeder Enter mit nicht-leerem Inhalt legt genau ein Todo an – kein Doppel-Submit.
- **Duplizierter Titel:** Erlaubt – zwei Todos dürfen denselben Titel haben.
- **Tab-Taste im Eingabefeld:** Springt zum nächsten fokussierbaren Element (Standard-Browserverhalten, keine Custom-Logik).

### Nicht im Scope
- Fälligkeitsdaten, Prioritäten, Tags oder Kategorien beim Anlegen
- Anlegen per Maus (Button-Klick ist optional, Tastatur ist Pflicht)
- Bulk-Anlegen (mehrere Todos auf einmal)
- Undo nach dem Anlegen

---

## 2. UX Entscheidungen
*Ausgefüllt von: /red:proto-ux — 2026-04-02*

### Einbettung im Produkt
Feature lebt auf dem einzigen Screen der SPA: S-01 / S-01a (URL: `/`).  
Der Eingabebereich ist **fest am oberen Seitenrand fixiert** (`position: sticky; top: 0`) – bleibt sichtbar auch wenn die Todo-Liste lang wird. Kein eigener Modal, kein separater Screen.

Route (neu): –  keine – SPA ohne Routing

### Einstiegspunkte
- Browser öffnen → App lädt → Input ist auto-fokussiert (`autofocus`)
- Browser-Refresh → gleicher Zustand, Input wieder auto-fokussiert
- Kein expliziter CTA nötig: das Textfeld selbst kommuniziert die Aktion durch Placeholder und Fokus

### User Flow

```
App-Start (S-01 oder S-01a)
    ↓
Eingabebereich oben – Input automatisch fokussiert
    ↓
Nutzer tippt Todo-Titel
    ↓
    ├─ Enter oder Button-Klick mit leerem/nur-Leerzeichen-Inhalt
    │       → Stilles Ignorieren – kein Feedback, kein Todo
    │       → Fokus bleibt im Input (S-01a bleibt S-01a, S-01 bleibt S-01)
    │
    └─ Enter oder Button-Klick mit nicht-leerem Inhalt
            → Todo wird angelegt, Eingabefeld geleert
            → Todo erscheint sofort an erster Stelle der Liste
            → Fokus kehrt automatisch ins Eingabefeld zurück
            → S-01a → S-01 (wenn erstes Todo) oder S-01 → S-01 (Folge-Todo)
```

### Interaktionsmuster
- **Primärmuster:** Inline-Eingabe – kein klassisches Formular mit Submit-Button im Vordergrund; Enter ist der primäre Submit-Weg (Referenz: Tastatur-first per Persona)
- **Fehler-Handling:** Kein Fehler für leere Eingabe – stilles Ignorieren (per Spec). Kein Error-State am Input.
- **Leerer Zustand (S-01a):** Empty State unterhalb des Eingabebereichs – Icon + kurzer Text "Noch keine Todos. Einfach oben tippen und Enter drücken." Kein CTA-Button nötig (Eingabefeld ist bereits der CTA).
- **Ladeverhalten:** Kein Skeleton, kein Spinner – localStorage-Write ist synchron und sofort. Todo erscheint ohne Verzögerung.

### Eingesetzte Komponenten

| Komponente       | DS-Status         | Quelle                                    |
|------------------|-------------------|-------------------------------------------|
| Input (default, md) | ✓ Vorhanden    | design-system/components/input.md         |
| Button (primary, md) | ✓ Vorhanden   | design-system/components/button.md        |

**DS Rule Compliance:**

- **Input / Label-Regel:** DS schreibt vor "Labels sind immer vergeben – niemals nur Placeholder". Umsetzung: `<label class="sr-only" for="todo-input">Neues Todo</label>` – visuell versteckt, semantisch vorhanden. Placeholder `"Todo eingeben…"` nur zur visuellen Orientierung. ✅
- **Button primary / Max-1-Regel:** Nur ein Primary Button auf der gesamten Seite. ✅ Tastatur (Enter) ist die primäre Submission-Methode; der Button ist optionaler Klick-Weg für Maus-Nutzer.
- **Kein Loading-State am Button:** localStorage ist synchron – DS-Regel "Loading-Zustand bei async Aktionen" greift nicht. ✅

### Screen Transitions (verbindlich)

| Von    | Trigger                          | Wohin  | Bedingung                              |
|--------|----------------------------------|--------|----------------------------------------|
| S-01a  | Enter im Input / Button-Klick    | S-01   | Eingabe nicht leer (nach trim)         |
| S-01a  | Enter im Input / Button-Klick    | S-01a  | Eingabe leer / nur Leerzeichen         |
| S-01   | Enter im Input / Button-Klick    | S-01   | Eingabe nicht leer – Todo wird angelegt |
| S-01   | Enter im Input / Button-Klick    | S-01   | Eingabe leer – kein Todo, kein Feedback |

*(Vollständige Transitions auch in `flows/product-flows.md` eingetragen – FEAT-1-Abschnitt bereits vorhanden)*

### DS-Status dieser Implementierung
- **Konforme Komponenten:** Input (default, md), Button (primary, md)
- **Neue Komponenten (Tokens-Build, genehmigt):** –
- **Bewusste Abweichungen (Hypothesentest):** –

### Barrierefreiheit (A11y)

**Keyboard-Navigation:**
- `autofocus` auf Input beim App-Start → sofort tippbereit, kein Tab nötig
- Enter im Input → Todo anlegen (primärer Weg)
- Tab vom Input → Fokus wechselt zum Button (Standard-Browserverhalten)
- Enter / Space auf Button → Todo anlegen
- Nach Anlegen: Fokus per `input.focus()` programmatisch zurück ins Eingabefeld

**Screen Reader:**
- `<label for="todo-input" class="sr-only">Neues Todo</label>` – Pflicht, da visuell kein Label sichtbar
- Button benötigt sichtbares Label oder `aria-label="Todo hinzufügen"` wenn icon-only
- Wenn Button als Icon-only: `<button aria-label="Todo hinzufügen">＋</button>` ✅
- Kein `aria-live` nötig für den Eingabebereich selbst – neue Todos in der Liste werden per FEAT-2/FEAT-3 behandelt

**Touch Target Tabelle (WCAG 2.5.5 – 44px):**

| Element | Größen-Token | Token-Wert (px) | WCAG 2.5.5 (44px) | Anpassung nötig? |
|---------|-------------|-----------------|-------------------|-----------------|
| Input (md) | height: 40px | 40px | ❌ | Desktop-only App – PRD: Mobile out-of-scope. Für künftige Mobile-Erweiterung: `min-height: 44px` empfohlen. Bekannte DS-Lücke. |
| Button primary (md) | height: 40px | 40px | ❌ | Gleiche Begründung. Wrapper mit `min-height: 44px` empfohlen wenn Mobile ergänzt wird. |

**Farbkontrast (berechnet):**

| Element | Vordergrund-Token | Hintergrund-Token | Hex fg | Hex bg | Ratio | WCAG |
|---------|------------------|------------------|--------|--------|-------|------|
| Button-Text (primary, md) | `color-text-on-primary` | `color-primary-500` | #FFFFFF | #3B82F6 | 3.68:1 | ❌ 4.5:1 (Normaltext 14px) / ✅ 3:1 (UI-Komponenten) |
| Input-Text | `color-text-primary` | `color-neutral-0` | #111827 | #FFFFFF | ~18.8:1 | ✅ |
| Input-Placeholder | `color-text-disabled` | `color-neutral-0` | #9CA3AF | #FFFFFF | 2.54:1 | ⚠ (Placeholder-Text ist per WCAG 1.4.3 Note 1 explizit ausgenommen – kein Verstoß, aber schwach) |
| Page-Hintergrund / Eingabebereich | – | `color-bg-page` | – | #F9FAFB | – | – |

> **Kontrast-Hinweis Button:** `color-primary-500` (#3B82F6) mit weißem Text ergibt 3.68:1 – unterhalb der WCAG-AA-Anforderung für Normaltext (4.5:1). Dies ist eine **pre-existierende DS-Lücke** in den Farb-Tokens. Für strenge WCAG-AA-Konformität: Button-Text auf `text-sm` (14px) sollte 4.5:1 erfüllen → Token-Empfehlung: `color-primary-600` (#2563EB) als Button-Hintergrund ergibt ca. 4.6:1 mit weißem Text. Entscheidung liegt beim DS-Owner, nicht bei FEAT-1.

### Mobile-Verhalten
- Per PRD explizit out-of-scope: "Mobile-spezifische Optimierungen" nicht im Scope
- Grundverhalten: Input und Button in einer Flex-Zeile, volle Breite – funktioniert auf Mobile ohne spezifische Anpassungen
- Touch-Targets unter 44px (siehe Tabelle oben) – dokumentierte bekannte Lücke

---

## 3. Technisches Design
*Ausgefüllt von: /red:proto-architect — 2026-04-02*

### Component-Struktur

```
App (Root – projekt/src/App.tsx)
├── TodoInputArea  (projekt/src/components/TodoInputArea.tsx)
│   ├── <label class="sr-only" for="todo-input">  (Pflicht A11y)
│   ├── <input id="todo-input" autofocus maxLength=200>
│   └── <button aria-label="Todo hinzufügen">  (optionaler Maus-Weg)
└── TodoList  (→ wird in FEAT-2 gebaut, Platzhalter in App.tsx)
    └── EmptyState  (S-01a: "Noch keine Todos…")
```

Wiederverwendbar aus bestehenden Komponenten:
- Keine – Vite-Scaffold enthält keine eigenen Komponenten. Alles neu.

### Daten-Model

Ein Todo-Objekt wird mit folgenden Feldern gespeichert:
- **id:** Eindeutiger Identifier – generiert per `crypto.randomUUID()` (nativ im Browser, kein Package)
- **title:** Getrimmter Text, 1–200 Zeichen
- **createdAt:** ISO-8601-Timestamp der Erstellung (`new Date().toISOString()`)
- **status:** Fester Wert `"open"` beim Anlegen (Status-Wechsel kommt in FEAT-3)

Gespeichert in: localStorage, Key `"todos"`, Format: JSON-Array von Todo-Objekten.

Für FEAT-1 wird nur **geschrieben** (neues Todo wird vorne in das Array eingefügt). Das **Lesen** mit Validation kommt in FEAT-2.

### API / Daten-Fluss

Kein Backend, kein API-Endpoint. Gesamter Datenfluss:

```
Nutzer tippt → controlled Input (React State) → Enter/Button
    → trim() → leer? → stilles Ignorieren, Fokus bleibt
    → nicht leer? → Todo-Objekt erstellen → localStorage.setItem("todos", ...)
    → React State aktualisieren → TodoList re-rendert → Input leeren → input.focus()
```

### Tech-Entscheidungen

- **Controlled Input (React):** `value` + `onChange` statt uncontrolled – ermöglicht programmatisches Leeren nach Submit ohne DOM-Manipulation.
- **onKeyDown für Enter:** `e.key === "Enter"` im Input-Handler – kein `<form>` nötig, passt zur "kein klassisches Formular"-UX-Entscheidung. Verhindert auch unbeabsichtigtes Form-Submit-Bubbling.
- **autoFocus als HTML-Attribut:** Natives `autoFocus` auf dem Input – kein `useEffect` + `ref.focus()` beim initialen Mount nötig. Einfacher, robuster, SSR-safe für spätere Erweiterungen.
- **Fokus nach Submit via ref:** `useRef` auf Input + `ref.current?.focus()` nach dem Anlegen – notwendig weil React nach State-Update den Fokus nicht automatisch zurückgibt.
- **crypto.randomUUID():** Nativ verfügbar in modernen Browsern, kein externes Package. Kollisionsfreie IDs ohne Dependency.
- **maxLength={200}:** Natives HTML-Attribut – verhindert Überlänge bereits im Input, kein zusätzlicher Validierungs-Code nötig.
- **localStorage direkt (kein Wrapper):** FEAT-1 schreibt nur. Abstraktionsschicht (Custom Hook `useTodos`) wird in FEAT-2 eingeführt wenn Lese-Logik + Validation hinzukommt.

### Security-Anforderungen

- **Authentifizierung:** Keine – rein lokale App ohne User-Accounts.
- **Autorisierung:** Keine – ein Nutzer, ein Gerät.
- **Input-Validierung:** 
  - Client-seitig: `maxLength={200}` am Input + `trim()` vor Speicherung.
  - Kein Server → keine serverseitige Validation nötig.
- **OWASP-relevante Punkte:**
  - **XSS:** React escaped alle Text-Werte beim Rendern standardmäßig – kein `dangerouslySetInnerHTML` verwenden. Titel wird als Text gespeichert und gerendert, nie als HTML interpretiert.
  - **localStorage:** Kein Sicherheitsproblem für lokale Daten ohne Authentifizierung. Daten sind nicht sitzungsübergreifend zwischen Nutzern geteilt.

### Dependencies

Keine neuen Packages erforderlich. Alle benötigten APIs (`crypto.randomUUID`, `localStorage`, `autoFocus`, `useRef`) sind nativ verfügbar.

### A11y-Architektur

| Element | ARIA-Pattern | Entscheidung |
|---------|-------------|--------------|
| TodoInputArea | `<header>` oder `<div>` mit `role="banner"`? | `<div>` mit `position: sticky` – kein semantischer Landmark nötig, da der Hauptinhalt weiter unten als `<main>` ausgewiesen wird (FEAT-2) |
| Label für Input | `<label class="sr-only" for="todo-input">` | Pflicht per DS-Regel. Visuell versteckt, für Screen Reader sichtbar. Inhalt: "Neues Todo" |
| Input | `id="todo-input"`, `maxLength=200`, `autoFocus` | Kein aria-required nötig – leere Eingabe wird stillschweigend ignoriert, kein Error-State |
| Add-Button | `aria-label="Todo hinzufügen"` | Pflicht wenn icon-only ("+"). Kein `aria-disabled` – Button bleibt immer aktiv, Leer-Validierung passiert im Handler |
| Live-Regions | Kein `aria-live` im Eingabebereich | Neue Todos in der Liste werden per FEAT-2 behandelt. FEAT-1 gibt kein SR-Feedback beim Anlegen – per UX-Entscheidung bewusst so |
| Fokus-Management | Nach Submit → `ref.current.focus()` | Fokus programmatisch zurück ins Input nach jedem erfolgreichen Anlegen. Verhindert Fokus-Verlust ins Nirgendwo |

### Test-Setup

- **Unit Tests:** Reine Logik – `createTodo(title)`-Funktion: trim, leer-Check, ID-Generierung, createdAt-Format, Status-Default.
- **Integration Tests (React Testing Library):**
  - Input + Enter → Todo erscheint in Liste, Input geleert, Fokus zurück im Input
  - Nur-Leerzeichen + Enter → kein Todo angelegt, kein Fehler
  - Leere Eingabe + Enter → stilles Ignorieren
  - Button-Klick mit Inhalt → Todo angelegt (optionaler Klick-Weg)
  - autoFocus → Input ist beim Render fokussiert
- **E2E:** Nicht für FEAT-1 allein sinnvoll – braucht FEAT-2 (Liste sichtbar) für einen vollständigen User Flow. E2E-Test wird in FEAT-2 ergänzt.

### Test-Infrastruktur

- **Test-Environment:** `happy-dom` (Vite/Vitest Standard – schneller als jsdom). Bekannte Limitierung: `crypto.randomUUID()` muss ggf. gemockt werden – `happy-dom` unterstützt es ab Version 12+ nativ, bei älteren Versionen: `vi.stubGlobal('crypto', { randomUUID: () => 'test-id' })`.
- **Mocks erforderlich:**
  - `localStorage` → `vi.stubGlobal` oder lokales Mock-Objekt in `beforeEach` – happy-dom implementiert `localStorage` nicht vollständig zuverlässig.
  - `Date` → `vi.setSystemTime(new Date('2026-04-02'))` in Tests die `createdAt` prüfen, damit deterministische Werte entstehen.
- **Setup/Teardown:**
  - `beforeEach`: `localStorage.clear()` (oder Mock zurücksetzen)
  - `afterEach`: `vi.restoreAllMocks()` wenn Mocks eingesetzt wurden
- **Bekannte Fallstricke:**
  - `autoFocus` in happy-dom: `document.activeElement` prüfen erfordert `await waitFor(...)` – Fokus-Events sind asynchron in der JSDOM-Welt.
  - Fokus nach programmatischem `ref.current.focus()`: in Tests mit `act()` wrappen wenn der State-Update gleichzeitig passiert.

### State-Komplexität

Geprüft – kein State Machine erforderlich. FEAT-1 hat nur einen relevanten State: den kontrollierten Input-Wert. Fokus-Management erfolgt imperativ via ref, kein zusätzlicher State nötig.

---

## 4. Implementierung
*Ausgefüllt von: /red:proto-dev — 2026-04-02*

### Implementierte Dateien
- `projekt/src/types.ts` – Todo-Interface (id, title, createdAt, status)
- `projekt/src/utils/createTodo.ts` – Pure Funktion: trim, leer-Check, UUID, ISO-Timestamp
- `projekt/src/utils/createTodo.test.ts` – Unit Tests (5 Tests)
- `projekt/src/components/TodoInputArea.tsx` – Sticky Eingabebereich mit Input + Button
- `projekt/src/components/TodoInputArea.css` – DS-Tokens als CSS-Variablen, alle Zustände
- `projekt/src/components/TodoInputArea.test.tsx` – Integration Tests (8 Tests)
- `projekt/src/App.tsx` – Root-Komponente mit State, localStorage-Write, minimaler Liste + Empty State
- `projekt/src/App.css` – App-Layout und minimales Todo-Listen-Styling
- `projekt/src/test/setup.ts` – Vitest Setup mit @testing-library/jest-dom

### Installierte Dependencies
- `vitest@^4.1.2`
- `@testing-library/react@^16.3.2`
- `@testing-library/user-event@^14.6.1`
- `@testing-library/jest-dom@^6.9.1`
- `happy-dom@^20.8.9`

### Offene Punkte / Tech-Debt
- Minimale Todo-Liste in App.tsx ist ein Platzhalter – wird in FEAT-2 durch vollständige TodoList-Komponente mit Persistenz-Lese-Logik ersetzt
- DS-Token `color-primary-500` (#3B82F6) auf Button ergibt 3.68:1 Kontrast – pre-existierende DS-Lücke, dokumentiert in UX-Spec. Bei Bedarf: `color-primary-600` als Button-Hintergrund verwenden.

---

## 5. QA Ergebnisse
*Ausgefüllt von: /red:proto-qa — 2026-04-02 (Runde 2)*

### Acceptance Criteria Status
- [x] AC-1: Textfeld ist beim Laden automatisch fokussiert ✅
- [x] AC-2: Enter + nicht-leerer Inhalt → Todo angelegt, Feld geleert ✅
- [x] AC-3: Todo erscheint sofort in der Liste ✅
- [x] AC-4: Nur-Leerzeichen → kein Todo, kein Fehler ✅
- [x] AC-5: Leere Eingabe + Enter → stilles Ignorieren ✅
- [x] AC-6: Nach dem Anlegen ist Fokus im Eingabefeld ✅ (inkl. leerem Button-Klick)
- [x] AC-7: Titel wird getrimmt gespeichert ✅
- [x] AC-8: maxLength={200} verhindert Übertypen ✅

### Security-Check
- Kein dangerouslySetInnerHTML – React escaped alles korrekt
- XSS: kein Risiko
- localStorage-Handling: korrekt (synchron, JSON.stringify)

### A11y-Check
- sr-only Label vorhanden ✅
- aria-label am Button ✅
- autoFocus korrekt ✅
- focus-visible Ring am Button ✅
- Fokus-Rückgabe nach leerem Button-Klick ✅ (gefixt)
- aria-label auf rollenlosem div (Empty State) ⚠️ → BUG-FEAT1-UX-006

### Gefixte Bugs (Runde 1→2)
- BUG-FEAT1-QA-001-fixed – Fokus nach leerem Button-Klick ✅
- BUG-FEAT1-QA-003-fixed – Tests für Fokus-Rückkehr ergänzt ✅

### Offene Bugs
- BUG-FEAT1-UX-002 – Button-Font-Size hardcodiert und DS-abweichend (Medium)
- BUG-FEAT1-UX-003 – Input-Focus hat nicht-autorisierten Box-Shadow (Medium)
- BUG-FEAT1-UX-004 – App.css verwendet hardcodierte Hex-Werte statt DS-Tokens (Medium)
- BUG-FEAT1-UX-006 – aria-label auf rollenlosem div hat keine Wirkung (Medium) ← neu
- BUG-FEAT1-QA-002 – Unit-Test prüft ID-Eindeutigkeit bei doppelten Titeln nicht (Low)
- BUG-FEAT1-UX-005 – Empty-State-Titel als h1 (Low)
- BUG-FEAT1-UX-007 – Sticky Bar volle Breite vs. 640px Content (Low) ← neu

### Summary
- ✅ 8/8 Acceptance Criteria passed
- 15/15 Tests grün
- 0 Critical, 0 High offen
- 4 Medium, 3 Low offen (DS-Compliance + A11y-Markup)

### Production-Ready
✅ Ready – keine Critical oder High Bugs offen (per Definition)
