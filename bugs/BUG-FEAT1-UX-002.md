# BUG-FEAT1-UX-002: Button-Font-Size weicht vom DS ab und ist hardcodiert (nicht per Token)

- **Feature:** FEAT-1 – Todo anlegen
- **Severity:** Medium
- **Bereich:** Konsistenz / Design System Compliance
- **Gefunden von:** UX Reviewer
- **Status:** Open

## Problem

Der "+"-Button (`todo-add-btn`) hat in `TodoInputArea.css` Zeile 97 den Wert `font-size: 1.25rem` (20px) hardcodiert. Das Design System schreibt für Button primary, Groesse md vor: `font-size: text-sm` (0.875rem / 14px). Der Wert ist weder ein DS-Token noch entspricht er der Groessendefinition.

Da es sich um einen Icon-only-Button handelt (nur "+"), ist der visuelle Effekt begrenzt – aber die Abweichung ist nicht als Hypothesentest oder Tokens-Build genehmigt. Sie ist damit ein nicht-autorisierter Wert.

## Steps to Reproduce

1. App starten
2. "+"-Button inspizieren (Browser DevTools)

Expected: `font-size` entspricht `var(--text-sm)` (0.875rem).
Actual: `font-size: 1.25rem` – hardcodierter Wert, kein Token, doppelt so gross wie DS-Vorgabe.

## Empfehlung

`font-size: 1.25rem` ersetzen durch `var(--text-sm)`. Falls das "+" visuell zu klein wirkt, ist die korrekte Lösung ein SVG-Icon mit expliziter `width`/`height` per Token (z.B. `16px` fuer Button md gemaess DS-Icon-Size-Tabelle) anstelle eines vergroesserten Unicode-Zeichens.

## Priority

Fix before release
