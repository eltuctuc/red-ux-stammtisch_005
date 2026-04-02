# FEAT-2: Todo-Liste & Persistenz

## Status
Aktueller Schritt: Spec

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
