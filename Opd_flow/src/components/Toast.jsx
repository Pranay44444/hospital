import { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import './Toast.css'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="wrap">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ toast, onRemove }) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }
  const Icon = icons[toast.type] || Info

  return (
    <div className={`toast ${toast.type}`}>
      <div className="icon">
        <Icon size={20} />
      </div>
      <p className="msg">{toast.message}</p>
      <button className="close" onClick={() => onRemove(toast.id)} aria-label="Close notification">
        <X size={18} />
      </button>
    </div>
  )
}
