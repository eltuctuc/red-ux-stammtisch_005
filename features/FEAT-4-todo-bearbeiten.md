# FEAT-4: Todo bearbeiten

## Status
Aktueller Schritt: Spec

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
