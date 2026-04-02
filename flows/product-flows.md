# Product Flows
*Erstellt von: /red:proto-flows — 2026-04-02*
*Letzte Aktualisierung: 2026-04-02*

> Dieses Dokument ist die verbindliche Navigations-Referenz.
> Kein State-Wechsel darf ohne Eintrag hier implementiert werden.
> Änderungen erfordern eine explizite Entscheidung des UX Designers.

---

## Architektur-Hinweis

Diese App ist eine Single-Page Application ohne Routing. Es gibt genau **einen Screen (S-01)** mit vier Zustandsvarianten. Alle "Transitions" sind State-Wechsel innerhalb derselben URL – keine Page-Navigationen.

---

## Screens & States

| State-ID | Name                          | URL    | Feature           | Typ           |
|----------|-------------------------------|--------|-------------------|---------------|
| S-01     | Todo-Liste (Normalzustand)    | /      | FEAT-1–5          | Page          |
| S-01a    | Todo-Liste (Leerzustand)      | /      | FEAT-2            | View-Variant  |
| S-01b    | Todo-Item (Inline-Edit-Modus) | /      | FEAT-4            | Inline-State  |
| S-01c    | Todo-Item (Inline-Lösch-Best.)| /      | FEAT-5            | Inline-State  |

> S-01b und S-01c sind immer an genau ein Todo-Item gebunden. Es kann jeweils nur ein Item gleichzeitig in diesem State sein.

---

## Einstiegspunkte

| Kontext                     | Einstiegs-State | Bedingung                          |
|-----------------------------|------------------|------------------------------------|
| App-Start (Browser öffnen)  | S-01             | Todos in localStorage vorhanden    |
| App-Start (Browser öffnen)  | S-01a            | Kein localStorage-Eintrag / leer   |
| Browser-Refresh (F5)        | S-01             | Todos in localStorage vorhanden    |
| Browser-Refresh (F5)        | S-01a            | Kein localStorage-Eintrag / leer   |

---

## State Transitions

### Von S-01a → Anderer State

| Von    | Trigger                              | Nach  | Bedingung                          | Feature  |
|--------|--------------------------------------|-------|------------------------------------|----------|
| S-01a  | Enter im Eingabefeld                 | S-01  | Eingabe nicht leer (nach trim)     | FEAT-1   |
| S-01a  | Enter im Eingabefeld                 | S-01a | Eingabe leer / nur Leerzeichen     | FEAT-1   |

### Von S-01 → Anderer State

| Von   | Trigger                              | Nach   | Bedingung                                      | Feature  |
|-------|--------------------------------------|--------|------------------------------------------------|----------|
| S-01  | Enter im Eingabefeld                 | S-01   | Eingabe nicht leer – Todo wird angelegt        | FEAT-1   |
| S-01  | Enter im Eingabefeld                 | S-01   | Eingabe leer – kein Todo, kein Feedback        | FEAT-1   |
| S-01  | Klick/Leertaste auf Status-Toggle    | S-01   | Status wechselt (offen ↔ erledigt)             | FEAT-3   |
| S-01  | Doppelklick auf Todo-Titel           | S-01b  | Todo wechselt in Inline-Edit-Modus             | FEAT-4   |
| S-01  | Klick/Tastendruck auf Löschen-Trigger| S-01c  | Inline-Bestätigungsschritt wird sichtbar       | FEAT-5   |

### Von S-01b (Inline-Edit) → Anderer State

| Von    | Trigger                              | Nach   | Bedingung                                            | Feature  |
|--------|--------------------------------------|--------|------------------------------------------------------|----------|
| S-01b  | Enter                                | S-01   | Neuer Titel nicht leer – wird gespeichert            | FEAT-4   |
| S-01b  | Enter                                | S-01   | Neuer Titel leer – Abbruch, original Titel bleibt    | FEAT-4   |
| S-01b  | Blur (Fokus verlässt Input)          | S-01   | Neuer Titel nicht leer – wird gespeichert            | FEAT-4   |
| S-01b  | Blur (Fokus verlässt Input)          | S-01   | Neuer Titel leer – Abbruch, original Titel bleibt    | FEAT-4   |
| S-01b  | Escape                               | S-01   | Immer – original Titel wiederhergestellt             | FEAT-4   |
| S-01b  | Doppelklick auf anderes Todo         | S-01b  | Erstes via Blur bestätigt, zweites öffnet Edit       | FEAT-4   |

### Von S-01c (Inline-Lösch-Bestätigung) → Anderer State

| Von    | Trigger                              | Nach   | Bedingung                                      | Feature  |
|--------|--------------------------------------|--------|------------------------------------------------|----------|
| S-01c  | Klick auf "Bestätigen" / Enter       | S-01   | Todo gelöscht; mind. 1 Todo verbleibt in Liste | FEAT-5   |
| S-01c  | Klick auf "Bestätigen" / Enter       | S-01a  | Todo gelöscht; Liste ist jetzt leer            | FEAT-5   |
| S-01c  | Escape                               | S-01   | Abbruch – Todo bleibt erhalten                 | FEAT-5   |
| S-01c  | Klick außerhalb des Bestätigungsschritts | S-01 | Abbruch – Todo bleibt erhalten               | FEAT-5   |

---

## Gesperrte Kombinationen (Constraints)

| State  | Gesperrte Aktion                     | Grund                                          |
|--------|--------------------------------------|------------------------------------------------|
| S-01b  | Status-Toggle des bearbeiteten Items | Während Inline-Edit deaktiviert (FEAT-3, FEAT-4) |
| S-01b  | Löschen-Trigger des bearbeiteten Items | Während Inline-Edit deaktiviert (FEAT-5, FEAT-4) |

---

## Offene Transitions

Transitions die während der Implementierung als fehlend gemeldet wurden und noch nicht definiert sind:

| Gemeldet von       | Von State | Situation                 | Status    |
|--------------------|-----------|---------------------------|-----------|
| –                  | –         | –                         | –         |

*(Wird vom `frontend-developer` befüllt wenn eine Transition fehlt. UX Designer muss entscheiden und Tabelle oben ergänzen.)*
