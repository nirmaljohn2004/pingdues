import { useState } from 'react'
import { Menu, Hexagon, Bell, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Topbar() {
  const { setMenuOpen, members } = useStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <header className="topbar">
      <button 
        className="icon-button mobile-menu" 
        aria-label="Open menu" 
        onClick={() => setMenuOpen(true)}
      >
        <Menu />
      </button>
      
      <div className="mobile-brand">
        <div className="brand-mark"><Hexagon /></div>
        <strong>pingdues<span className="brand-dot">.</span></strong>
      </div>
      
      <div className="topbar-actions">
        <div style={{ position: 'relative' }}>
          <button 
            className="icon-button" 
            aria-label="Notifications" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell />
            <i />
          </button>
          
          {notificationsOpen && (
            <div className="notifications-dropdown">
              <div className="notifications-header">Recent Activity</div>
              {members.filter(m => m.status === 'Paid').slice(0, 5).map(m => (
                <div key={m.id} className="notification-item">
                  <div className={`member-avatar ${m.color}`} style={{ width: 32, height: 32, fontSize: 12 }}>
                    {m.initials}
                  </div>
                  <div className="notification-content">
                    <strong>{m.name}</strong> paid <span>{m.amount}</span>
                    <small>{m.due}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="top-profile">
          <div className="profile-avatar">RK</div>
          <ChevronDown />
        </div>
      </div>
    </header>
  )
}
