import { useEffect } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div className="box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="head">
          <h2 id="modal-title" className="title">{title}</h2>
          <button className="close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>
        <div className="body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
