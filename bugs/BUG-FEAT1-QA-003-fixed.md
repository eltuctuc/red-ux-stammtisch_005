# BUG-FEAT1-QA-003: Integration-Test prüft Fokus-Rückkehr nicht im Button-Klick-Fehlerfall

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Low
- **Bereich:** Functional (Test-Coverage)
- **Gefunden von:** QA Engineer
- **Status:** Fixed – 2026-04-02 – 2 Tests ergänzt: "Fokus kehrt nach Button-Klick mit leerem Inhalt ins Input zurück" und "…mit Leerzeichen-Inhalt" (TodoInputArea.test.tsx)

## Beschreibung

Die Integration-Tests in `TodoInputArea.test.tsx` decken den Fokus-Return nach erfolgreichem Submit ab (Test: "Fokus bleibt im Input nach Anlegen"). Es fehlt jedoch ein Test für den Fall: **Button-Klick mit leerem oder Leerzeichen-Inhalt → Fokus muss wieder im Input sein**.

Dieser Testfall wäre exakt der Pfad, der den in BUG-FEAT1-QA-001 beschriebenen Fehler (fehlendes `focus()` im Early-Return) aufgedeckt hätte.

Vorhandene Tests:
- "ignoriert leere Eingabe bei Enter" – prüft nur, dass `onAdd` nicht aufgerufen wird; kein Fokus-Check
- "ignoriert Eingabe aus nur Leerzeichen" – gleiches Problem

Fehlende Tests:
- Button-Klick mit leerem Inhalt → Fokus ist danach im Input
- Button-Klick mit Leerzeichen-Inhalt → Fokus ist danach im Input

## Steps to Reproduce

1. `TodoInputArea.test.tsx` lesen
2. Kein Test prüft `document.activeElement` nach Button-Klick mit leerem Inhalt
3. Expected: Test existiert und schlägt fehl (wegen BUG-FEAT1-QA-001)
4. Actual: Kein Test, Fehler bleibt unentdeckt

## Priority
Fix before release
