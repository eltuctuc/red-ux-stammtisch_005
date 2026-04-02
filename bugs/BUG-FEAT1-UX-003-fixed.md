# BUG-FEAT1-UX-003: Input-Focus-Zustand hat Box-Shadow – DS schreibt "kein Box-Shadow" vor

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02 – `box-shadow: var(--shadow-input-focus)` aus `.todo-input:focus` in TodoInputArea.css entfernt

## Problem

Das Design System spezifiziert fuer den Input im Focus-Zustand: "Border: `color-border-focus` (2px), kein Box-Shadow".

In `TodoInputArea.css` Zeilen 85-88 hat `.todo-input:focus` jedoch zusaetzlich `box-shadow: var(--shadow-input-focus)`. Das ist eine nicht-autorisierte Abweichung vom DS – weder als Hypothesentest noch als genehmigter Tokens-Build markiert.

Konkret: Der Shadow-Token `--shadow-input-focus` ist in der CSS-Datei selbst definiert als `0 1px 2px 0 rgb(0 0 0 / 0.05)`. Er ist nicht Teil des DS-Token-Inventars (input.md, spacing.md, typography.md, colors.md enthalten keinen solchen Token).

## Steps to Reproduce

1. App starten
2. In das Eingabefeld klicken oder per Tab fokussieren
3. Input mit Browser DevTools inspizieren

Expected: Nur 2px Border mit `color-border-focus` (#3B82F6), kein Box-Shadow.
Actual: 2px Border plus `box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)`.

## Empfehlung

`box-shadow: var(--shadow-input-focus)` aus `.todo-input:focus` entfernen. Die 2px-Border allein ist der DS-konforme Focus-Indikator. Der Shadow ist auch aus A11y-Sicht nicht schaedlich, aber die unabgestimmte Abweichung schafft Inkonsistenz sobald andere Input-Felder in der App (FEAT-2+) den DS korrekt umsetzen.

## Priority

Fix before release
