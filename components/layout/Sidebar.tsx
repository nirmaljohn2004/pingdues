import { Hexagon, ChevronDown, LayoutDashboard, Users, Layers, CircleDollarSign, Bell, Settings2, LogOut } from 'lucide-react'
import { useStore } from '@/store/useStore'

const navItems = ['Overview', 'Members', 'Groups', 'Collections', 'Reminders', 'Settings']

export default function Sidebar() {
  const { menuOpen, setMenuOpen, activeTab, setActiveTab, setIsAuthenticated } = useStore()

  return (
    <>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Hexagon /></div>
          <span>pingdues<span className="brand-dot">.</span></span>
        </div>
        
        <div className="club-switcher">
          <div className="club-avatar">PD</div>
          <div><strong>Pingdues</strong><small>Admin account</small></div>
          <ChevronDown />
        </div>
        
        <nav>
          {navItems.map((item) => (
            <button 
              key={item} 
              className={activeTab === item ? 'nav-item active' : 'nav-item'} 
              onClick={() => { setActiveTab(item); setMenuOpen(false) }}
            >
              {item === 'Overview' ? <LayoutDashboard /> : 
               item === 'Members' ? <Users /> : 
               item === 'Groups' ? <Layers /> : 
               item === 'Collections' ? <CircleDollarSign /> : 
               item === 'Reminders' ? <Bell /> : <Settings2 />}
              {item}
              {item === 'Reminders' && <b>2</b>}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          <div className="help-card">
            <Bell />
            <div><strong>Need a hand?</strong><small>We are here to help.</small></div>
          </div>
          
          <div 
            className="profile" 
            onClick={() => setIsAuthenticated(false)} 
            style={{ cursor: 'pointer', transition: 'background 0.2s ease' }}
          >
            <div className="profile-avatar">RK</div>
            <div><strong>Riya Kapoor</strong><small style={{ color: '#be123c', fontWeight: 600 }}>Log out</small></div>
            <LogOut size={18} color="#be123c" />
          </div>
        </div>
      </aside>
      
      {menuOpen && (
        <button 
          className="mobile-scrim" 
          aria-label="Close navigation" 
          onClick={() => setMenuOpen(false)} 
        />
      )}
    </>
  )
}
