import { Hexagon, ChevronDown, LayoutDashboard, Users, Layers, CircleDollarSign, Bell } from 'lucide-react'
import { useStore } from '@/store/useStore'

const navItems = ['Overview', 'Members', 'Groups', 'Collections']

export default function Sidebar() {
  const { menuOpen, setMenuOpen, activeTab, setActiveTab } = useStore()

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
               <CircleDollarSign />}
              {item}
            </button>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          <div className="help-card">
            <Bell />
            <div><strong>Need a hand?</strong><small>We are here to help.</small></div>
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
