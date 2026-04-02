# FEAT-5: Todo löschen

## Status
Aktueller Schritt: Spec

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
