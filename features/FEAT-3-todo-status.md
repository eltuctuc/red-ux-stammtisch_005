# FEAT-3: Todo-Status (erledigt / offen)

## Status
Aktueller Schritt: Spec

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
