# BUG-FEAT2-UX-002: Token --spacing-section-md nicht im DS definiert – Fallback 3rem greift

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

`EmptyState.css` referenziert `var(--spacing-section-md, 3rem)` als `padding-top` des Empty-State-Containers. Der Token `--spacing-section-md` ist in `TodoInputArea.css` (der einzigen Token-Quelle des Projekts) nicht definiert. Der Fallback-Wert `3rem` greift immer.

Das Feature-File (Abschnitt 2) spezifiziert explizit: "Padding: `spacing-section-md` oben". Die Absicht war, einen echten Token zu nutzen – nicht einen hartcodierten Fallback.

Konsequenz: Der Token-Name suggeriert Zugehörigkeit zum DS, ist aber nicht registriert. Der Abstand kann nicht zentral über das DS gesteuert werden.

## Steps to Reproduce

1. `TodoInputArea.css` (Token-Definitionen in `:root`) durchsuchen nach `--spacing-section-md`
2. Token ist nicht vorhanden
3. `EmptyState.css` Zeile 6: `padding-top: var(--spacing-section-md, 3rem)` – Fallback greift

Expected: `--spacing-section-md` ist in den DS-Token-Definitionen registriert  
Actual: Token fehlt, Fallback `3rem` wird immer verwendet – Token-Referenz ist wirkungslos

## Empfehlung

`--spacing-section-md: 3rem` (oder einen semantisch passenden Wert) in der `:root`-Block von `TodoInputArea.css` ergänzen. Langfristig Token-Definitionen in eine dedizierte globale Datei auslagern (bereits als Tech-Debt dokumentiert).

## Priority

Fix before release
