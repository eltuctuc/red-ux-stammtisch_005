# BUG-FEAT2-QA-002: sr-only Utility-Klasse in komponentenspezifischer CSS definiert, nicht global

- **Feature:** FEAT-2 – Todo-Liste & Persistenz
- **Severity:** Medium
- **Bereich:** A11y / Functional
- **Gefunden von:** QA Engineer
- **Status:** Open

## Beschreibung

Die `.sr-only`-Utility-Klasse ist in `TodoInputArea.css` (Zeile 42) definiert. `TodoItem.tsx` (FEAT-2) verwendet `className="sr-only"` für den Screen-Reader-Text erledigter Todos:

```tsx
// TodoItem.tsx, Zeile 18
{isDone && <span className="sr-only"> (erledigt)</span>}
```

`TodoItem.tsx` importiert nur `./TodoItem.css` – nicht `TodoInputArea.css`. Die Klasse ist nur verfügbar weil Vite alle in der Komponentenbaum importierten CSS-Dateien in ein gemeinsames Bundle zusammenführt und die Ladereihenfolge zufällig ist.

**Konkretes Risiko:**
1. **Code-Splitting:** Wenn in Zukunft Lazy-Loading oder Route-basiertes Code-Splitting eingeführt wird, könnte `TodoItem` in einem Chunk landen der `TodoInputArea.css` nicht enthält. `.sr-only` würde dann fehlen und der erledigte-Status wäre für Screen-Reader-Nutzer unsichtbar.
2. **Wartbarkeit:** Ein Entwickler der `TodoItem.tsx` isoliert betrachtet, sieht keine lokale Definition von `.sr-only` und findet sie auch nicht in `TodoItem.css`. Das ist eine versteckte, cross-component CSS-Abhängigkeit.
3. **Testbarkeit:** Die Spec-Anmerkung unter "Implementierung > Offene Punkte" (letzte Zeile) erkennt das Problem selbst: "`sr-only`-Utility-Klasse ist in TodoInputArea.css definiert – bei Bedarf in globale CSS-Datei auslagern." Das Problem ist dokumentiert aber nicht gefixt.

Das A11y-AC "erledigte Todos haben sr-only Text für Screen Reader" ist aktuell funktional erfüllt, aber die Implementierung ist strukturell fragil.

## Steps to Reproduce / Nachweis

```
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoInputArea.css Zeile 42–52: .sr-only Definition
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoItem.tsx Zeile 18: Verwendung
/Users/enricoreinsdorf/Projekte/test-projekt/projekt/src/components/TodoItem.css: Kein Import von TodoInputArea.css, keine sr-only Definition
```

Der Test in `TodoListArea.test.tsx` (Zeile 127–132) prüft die sr-only Funktionalität per `screen.getAllByText(/erledigt/i)` – dieser Test greift auf den DOM-Text zu, nicht auf das visuelle Rendering. Er würde auch dann grün bleiben wenn die CSS-Klasse fehlt (weil der Text im DOM vorhanden ist, nur visuell falsch gerendert).

## Empfehlung

`.sr-only` aus `TodoInputArea.css` entfernen und in `index.css` oder eine dedizierte `utilities.css` verschieben, die in `main.tsx` global importiert wird. Damit ist die Klasse garantiert überall verfügbar.

Alternativ: Definition direkt in `TodoItem.css` duplizieren (akzeptiert bei kleinen Projekten).

## Priority
Fix before release
