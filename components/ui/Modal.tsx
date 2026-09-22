import { X } from 'lucide-react'

export function Modal({ children, close }: { children: React.ReactNode; close: () => void }) {
  return (
    <div className="modal-backdrop" onClick={close}>
      <section 
        className="modal" 
        role="dialog" 
        aria-modal="true" 
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </section>
    </div>
  )
}

export function ModalHead({ kicker, title, sub, close }: { kicker?: string; title: string; sub?: string; close: () => void }) {
  return (
    <div className="modal-head">
      <div>
        {kicker && <span className={`modal-kicker ${kicker.includes('danger') ? 'danger-kicker' : ''}`}>{kicker}</span>}
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <button type="button" className="icon-button" onClick={close} aria-label="Close">
        <X />
      </button>
    </div>
  )
}
