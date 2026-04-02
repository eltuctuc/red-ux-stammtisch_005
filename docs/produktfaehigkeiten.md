# Produktfähigkeiten

## Todo-Status (erledigt / offen) *(FEAT-3, seit 2026-04-03)*
Nutzer können Todos als erledigt markieren oder den Status zurücksetzen – mit einem einzigen Klick oder Tastendruck (Leertaste oder Enter). Erledigte Todos werden durchgestrichen und mit reduziertem Kontrast dargestellt, bleiben aber an ihrer Position in der Liste. Der Status wird sofort im Browser gespeichert und bleibt nach einem Refresh erhalten. Sowohl Maus- als auch Tastatur-Nutzer können den Status jederzeit umkehren.

## Todo-Liste & Persistenz *(FEAT-2, seit 2026-04-02)*
Die App zeigt alle Todos in einer geordneten Liste an – neueste zuerst. Todos werden automatisch im Browser gespeichert und bleiben nach einem Refresh erhalten, ohne dass der Nutzer etwas tun muss. Erledigte Todos sind visuell durch durchgestrichenen Text erkennbar. Wenn noch keine Todos vorhanden sind, erscheint ein leerer Zustand mit einem sofort nutzbaren Eingabefeld.

## Todo anlegen *(FEAT-1, seit 2026-04-02)*
Nutzer können neue Todos über ein Eingabefeld oben in der App erstellen. Ein Todo wird durch Drücken von Enter oder Klicken des "+"-Buttons hinzugefügt. Leere oder nur aus Leerzeichen bestehende Eingaben werden ignoriert. Das Eingabefeld ist beim App-Start automatisch fokussiert.

## Todo bearbeiten *(FEAT-4, seit 2026-04-03)*
Nutzer können den Titel eines bestehenden Todos direkt in der Liste bearbeiten – per Doppelklick oder Tastatur (Enter/F2 auf dem Titel). Das Eingabefeld erscheint sofort an der gleichen Position, der bestehende Titel ist vorausgefüllt und vollständig markiert. Enter oder Fokus-Verlust speichert die Änderung, Escape stellt den Original-Titel wieder her. Leere Eingaben werden als Abbruch behandelt.

## Todo löschen *(FEAT-5, seit 2026-04-03)*
Nutzer können Todos dauerhaft aus der Liste entfernen. Jedes Todo zeigt bei Hover einen ×-Button, der eine Inline-Bestätigung direkt am Todo-Item öffnet – kein Modal-Dialog. Erst nach explizitem Klick auf "Löschen" wird das Todo entfernt; Escape oder Klick außerhalb bricht ab. Der Fokus kehrt nach dem Abbrechen automatisch zum ×-Button zurück. Nach dem Löschen des letzten Todos erscheint der Leerzustand.
