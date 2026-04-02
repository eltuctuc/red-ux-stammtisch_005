# BUG-FEAT2-UX-001: EmptyState.css nutzt hardcodierte rem-Werte statt DS-Tokens

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Fixed – 2026-04-02

## Problem

`EmptyState.css` enthält zwei hardcodierte Spacing-Werte ohne DS-Token-Entsprechung:

- `.empty-state { gap: 0.5rem; }` – kein Token für diesen Wert
- `.empty-state__icon { margin-bottom: 0.25rem; }` – kein Token für diesen Wert

Beide Werte weichen von der Tokens-Build-Anforderung ab: "Werden alle verfügbaren Tokens genutzt (Farben, Spacing, Typografie)?" – Nein. Das Spacing-System des DS kennt `--spacing-3` (0.75rem) und `--spacing-4` (1rem), aber keine Sub-Spacing-Werte. Das ist eine ungeplante Abweichung, kein genehmigter Hypothesentest.

Konsequenz: Wenn das Spacing-System im DS angepasst wird, werden diese Werte nicht mitgezogen.

## Steps to Reproduce

1. `EmptyState.css` öffnen
2. Zeile 6: `gap: 0.5rem` – kein `var(--spacing-...)` referenziert
3. Zeile 13: `margin-bottom: 0.25rem` – kein `var(--spacing-...)` referenziert

Expected: Alle Abstände nutzen DS-Tokens oder explizit dokumentierte Ausnahmen  
Actual: Zwei hardcodierte Werte ohne Token-Referenz

## Empfehlung

Entweder:
- Einen `--spacing-2` Token (0.5rem) im DS ergänzen und beide Werte darauf mappen
- Oder `gap: var(--spacing-3)` (0.75rem) als nächstgelegenen existierenden Token nutzen, wenn der visuelle Unterschied vertretbar ist
- `margin-bottom` auf den Toggle-Placeholder-Placeholder kann entfernt werden, wenn `gap` den Abstand bereits korrekt steuert (prüfen ob der Wert redundant ist)

## Priority

Fix before release
