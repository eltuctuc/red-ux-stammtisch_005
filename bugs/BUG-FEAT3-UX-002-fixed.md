# BUG-FEAT3-UX-002: Doppelte und widersprüchliche Statuskommunikation für Screen Reader

- **Feature:** FEAT-3 – Todo-Status (erledigt / offen)
- **Severity:** High
- **Bereich:** A11y
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Bei einem erledigten Todo kommunizieren zwei DOM-Elemente den Status gleichzeitig – und sie widersprechen sich:

1. **Toggle-Label (sr-only):** "[Titel] als erledigt markieren" – beschreibt die Aktion, nicht den Ist-Zustand
2. **Titel-Span (sr-only):** "[Titel] (erledigt)" – beschreibt den Ist-Zustand

Ein Screen Reader liest bei einem erledigten, fokussierten Todo-Item die Kombination aus beiden vor. Je nach SR und Lesereihenfolge entsteht: "Einkaufen (erledigt) … Einkaufen als erledigt markieren, Checkbox, markiert". Das ist redundant, verwirrend und widerspricht sich inhaltlich (Zustand "erledigt" plus Aktion "als erledigt markieren").

Die A11y-Architektur in FEAT-3 (Abschnitt 3) gibt vor: Der Label enthält den Titel, damit SR kontextuell vorlesen kann. Der sr-only "(erledigt)" im TodoItem war als Ergänzung gedacht – kollidiert aber mit dem Label-Text des Toggles.

## Steps to Reproduce

1. Todo anlegen und als erledigt markieren
2. Mit Screen Reader (VoiceOver/NVDA) das Todo-Item navigieren
3. Toggle fokussieren und Ankündigungen abhören

Expected: SR liest genau eine, vollständige und korrekte Beschreibung des Elements
Actual: SR liest Status-Info doppelt und mit widersprüchlicher Handlungsaufforderung

## Empfehlung

Entweder das sr-only "(erledigt)" im TodoItem-Span entfernen (weil der Toggle-State es bereits kommuniziert), oder das Label des Toggles so gestalten, dass es den Status eindeutig kommuniziert – ohne Redundanz zum Titel-Span. Empfehlung: sr-only "(erledigt)" im Titel-Span entfernen, da der native Checkbox-State ("markiert / nicht markiert") plus das korrekte Label (BUG-FEAT3-UX-001) diese Information bereits vollständig abdeckt.

## Priority

Fix before release

---
**Status:** Fixed – 2026-04-03
