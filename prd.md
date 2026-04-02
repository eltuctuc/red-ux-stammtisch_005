# Product Requirements Document
*Erstellt: 2026-04-02*

## Vision
Eine minimalistische Todo-App als Framework-Testprojekt – lokal im Browser, ohne Backend, für einen einzelnen Nutzer.

## Zielgruppe
Einzelperson – kein Multi-User, kein Sharing.

## Kernproblem
Testumgebung für das red:proto-Framework: ein klar abgegrenztes, funktionierendes Feature-Set ohne externe Abhängigkeiten.

## Scope (In)
- Todo anlegen (Titel)
- Todo bearbeiten (Titel ändern)
- Todo als erledigt markieren / zurücksetzen
- Todo löschen
- Persistenz via localStorage (überlebt Browser-Refresh)

## Out-of-Scope
- Fälligkeitsdaten, Prioritäten, Tags, Kategorien
- Suche / Filter
- Mehrere Listen
- Backend, Sync, Auth
- Mobile-spezifische Optimierungen

## Erfolgskriterien
- Alle 4 CRUD-Operationen funktionieren
- Daten bleiben nach Page-Reload erhalten
- Keine Fehler in der Browser-Konsole

## Offene Fragen
- keine

## Scope-Typ
Funktionierender Prototyp
