import { Hexagon, ChevronDown, LayoutDashboard, Users, Layers, CircleDollarSign, Bell } from 'lucide-react'
import { useStore } from '@/store/useStore'

const navItems = ['Overview', 'Members', 'Groups', 'Collections']

export default function Sidebar() {
  const { menuOpen, setMenuOpen, activeTab, setActiveTab } = useStore()

  return (
    <>
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand" style={{ padding: '0 4px 20px' }}>
          <img 
            src="/logo.png" 
            alt="pingdues" 
            style={{ 
              height: '46px', 
              width: 'auto', 
              maxWidth: '100%', 
              objectFit: 'contain', 
              display: 'block' 
            }} 
          />
        </div>
        
        <div className="club-switcher">
          <div className="club-avatar">NV</div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <strong style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block' }}>
              Nritya Veda Academy
            </strong>
            <small>Dance & Arts Academy</small>
          </div>
          <ChevronDown size={14} style={{ flexShrink: 0 }} />
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
