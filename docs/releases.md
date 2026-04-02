# Release History

## 2026-04-03 – v0.4.0
### Neue Features
- **FEAT-4 – Todo bearbeiten:** Inline-Editing per Doppelklick/Tastatur; Enter speichert, Escape stellt Original wieder her.
- **FEAT-5 – Todo löschen:** Inline-Confirm ohne Modal; ×-Button mit zweistufiger Bestätigung, vollständiges Fokus-Management.

### Bug Fixes
- **BUG-FEAT4-QA-001:** Keyboard-Einstieg in Edit-Modus (Enter/F2) *(Severity: High)*
- **BUG-FEAT4-UX-002:** Schriftgröße Span→Input konsistent (text-sm) *(Severity: Medium)*
- **BUG-FEAT4-UX-003:** SR-Feedback nach Edit-Abschluss via aria-live *(Severity: Medium)*
- **BUG-FEAT5-QA-001:** Tests für Enter/Space auf ×-Button *(Severity: Medium)*
- **BUG-FEAT5-QA-002:** Fokus-Tests nach Cancel *(Severity: Medium)*
- **BUG-FEAT5-QA-003:** Fokus-Tests nach Löschen *(Severity: Medium)*
- **BUG-FEAT5-UX-001:** StatusToggle-Platzhalter in S-01c *(Severity: Medium)*
- **BUG-FEAT5-UX-002:** aria-hidden von "Löschen?"-Text entfernt *(Severity: Medium)*

## 2026-04-03 – v0.3.0
### Neue Features
- **FEAT-3 – Todo-Status (erledigt / offen):** Todos können per Klick oder Tastatur als erledigt markiert und zurückgesetzt werden; Status wird persistent gespeichert.

### Bug Fixes
- **BUG-FEAT3-QA-001:** SR-Label des Status-Toggle dynamisch – zeigt jetzt korrekt "als offen/erledigt markieren" je nach aktuellem Zustand *(Severity: High)*
- **BUG-FEAT3-UX-002:** Redundante `sr-only "(erledigt)"` Ausgabe am Titel entfernt *(Severity: High)*
- **BUG-FEAT3-UX-005:** `aria-label` am `<li>` ergänzt – erledigter Status beim SR-Scanning erkennbar *(Severity: High)*
- **BUG-FEAT3-QA-003:** `aria-relevant="additions"` auf Todo-Liste – Toggle-Aktionen lösen keine redundante Live-Region-Ankündigung mehr aus *(Severity: Medium)*
- **BUG-FEAT3-QA-005:** `pointer-events: none` vom Label-Wrapper entfernt – AT-Kompatibilität verbessert *(Severity: Medium)*
- **BUG-FEAT3-QA-002:** Test für `disabled`-Prop des Status-Toggle ergänzt *(Severity: Medium)*
- **BUG-FEAT3-UX-003:** Hover-State für erledigten Toggle ergänzt (`color-primary-600`) *(Severity: Medium)*

---

## 2026-04-02 – v0.2.0
### Neue Features
- **FEAT-2 – Todo-Liste & Persistenz:** Todos werden in einer sortierten Liste angezeigt und automatisch im localStorage persistiert.

### Bug Fixes
- **BUG-FEAT2-QA-001:** index.css Vite-Template durch sauberes globales DS-Fundament ersetzt *(Severity: High)*
- **BUG-FEAT2-QA-002:** .sr-only Utility-Klasse nach index.css ausgelagert *(Severity: Medium)*
- **BUG-FEAT2-QA-004:** DS-Token-Block nach index.css ausgelagert *(Severity: Medium)*
- **BUG-FEAT2-UX-001:** Hardcodierte rem-Werte in EmptyState.css durch Tokens ersetzt *(Severity: Medium)*
- **BUG-FEAT2-UX-002:** Token --spacing-section-md registriert *(Severity: Medium)*
- **BUG-FEAT1-UX-002:** Button font-size auf DS-Token korrigiert *(Severity: Medium)*
- **BUG-FEAT1-UX-003:** Box-shadow auf Input-Focus entfernt *(Severity: Medium)*
- **BUG-FEAT1-UX-004:** Hardcodierte Farben in App.css auf DS-Tokens umgestellt *(Severity: Medium)*
- **BUG-FEAT1-UX-006:** Wirkungsloses aria-label auf div entfernt *(Severity: Medium)*

---

## 2026-04-02 – v0.1.0
### Neue Features
- **FEAT-1 – Todo anlegen:** Nutzer können Todos über ein Eingabefeld mit Enter oder Button-Klick erstellen.

### Bug Fixes
- **BUG-FEAT1-QA-001:** Fokus-Management nach leerem Versuch korrigiert *(Severity: Medium)*
- **BUG-FEAT1-QA-003:** Test-Coverage für leere Eingabe ergänzt *(Severity: Low)*
