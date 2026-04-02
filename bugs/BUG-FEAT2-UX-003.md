# BUG-FEAT2-UX-003: Token --font-weight-medium fehlt im DS – EmptyState-Titel nutzt Fallback 500

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Low
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

`EmptyState.css` nutzt `font-weight: var(--font-weight-medium, 500)` für den Empty-State-Titel. Der Token `--font-weight-medium` ist in den DS-Token-Definitionen (`TodoInputArea.css`, `:root`) nicht registriert. Vorhanden ist nur `--font-weight-semibold: 600`.

Der Fallback `500` ist funktional korrekt (entspricht Medium-Weight), aber der Token ist nicht im DS verankert. Das Feature-File selbst dokumentiert dies als bekannte DS-Lücke: "DS-Lücke: `--font-weight-medium` Token fehlt im DS – EmptyState nutzt Fallback `500`".

Konsequenz: Der Token-Name ist konsistent mit der Semantik, aber nicht registriert. Bei einer späteren DS-Änderung der Font-Weights müsste dieser Wert manuell nachgezogen werden.

## Steps to Reproduce

1. `TodoInputArea.css` `:root`-Block nach `--font-weight-medium` durchsuchen
2. Token nicht vorhanden – nur `--font-weight-semibold: 600` registriert
3. `EmptyState.css` Zeile 17: `font-weight: var(--font-weight-medium, 500)` – Fallback greift immer

Expected: `--font-weight-medium` ist im DS registriert  
Actual: Token fehlt, hardcodierter Fallback `500` wird immer verwendet

## Empfehlung

`--font-weight-medium: 500` in der `:root`-Block von `TodoInputArea.css` ergänzen. Ist eine triviale Ergänzung und schließt die dokumentierte DS-Lücke.

## Priority

Nice-to-have
