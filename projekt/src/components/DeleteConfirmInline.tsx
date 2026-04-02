import { useRef, useEffect } from 'react'
import './DeleteConfirmInline.css'

interface DeleteConfirmInlineProps {
  todoTitle: string
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmInline({ todoTitle, onConfirm, onCancel }: DeleteConfirmInlineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<HTMLButtonElement>(null)

  // Fokus auf [Abbrechen] beim Öffnen – verhindert versehentliches Löschen durch sofortiges Enter
  useEffect(() => {
    abortRef.current?.focus()
  }, [])

  // Escape → Abbrechen
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Klick außerhalb → Abbrechen (capture:true: verhindert Interaktion mit dem initialen ×-Klick)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        onCancel()
      }
    }
    document.addEventListener('click', handleClickOutside, { capture: true })
    return () => document.removeEventListener('click', handleClickOutside, { capture: true })
  }, [onCancel])

  return (
    <div
      ref={containerRef}
      className="delete-confirm"
      role="group"
      aria-label="Löschen bestätigen"
    >
      <span className="sr-only" aria-live="polite">Löschen bestätigen?</span>
      <span className="delete-confirm__title">{todoTitle}</span>
      <span className="delete-confirm__question" aria-hidden="true">Löschen?</span>
      <button
        ref={abortRef}
        className="delete-confirm__btn delete-confirm__btn--ghost"
        onClick={onCancel}
        type="button"
      >
        Abbrechen
      </button>
      <button
        className="delete-confirm__btn delete-confirm__btn--danger"
        onClick={onConfirm}
        type="button"
      >
        Löschen
      </button>
    </div>
  )
}
