# FEAT-1: Todo anlegen

## Status
Aktueller Schritt: Spec

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
