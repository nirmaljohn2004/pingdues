import { useState, useMemo } from 'react'
import { Check, CircleDollarSign, Clock3, Copy, Plus, Search, Users } from 'lucide-react'
import { useStore, Member } from '@/store/useStore'
import { StatusBadge } from '@/components/ui/StatusBadge'

function Summary({ 
  icon: Icon, 
  label, 
  value, 
  accentColor, 
  bgLight 
}: { 
  icon: any
  label: string
  value: string
  accentColor: string
  bgLight: string
}) {
  return (
    <article 
      className="member-summary-card"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '16px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: 0,
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -6px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#cbd5e1'
        e.currentTarget.style.boxShadow = '0 10px 20px -6px rgba(15, 23, 42, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -6px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div 
        className="member-summary-card-icon"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgLight,
          color: accentColor,
          border: `1px solid ${accentColor}18`,
          flexShrink: 0
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
        <small 
          className="member-summary-card-label"
          style={{ 
            display: 'block', 
            fontSize: '10.5px', 
            fontWeight: 600, 
            color: '#64748b', 
            textTransform: 'uppercase', 
            letterSpacing: '0.02em',
            marginBottom: '2px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {label}
        </small>
        <strong 
          className="member-summary-card-value"
          style={{ 
            display: 'block', 
            fontSize: '18px', 
            fontWeight: 800, 
            color: '#0f172a', 
            letterSpacing: '-0.02em', 
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {value}
        </strong>
      </div>
    </article>
  )
}

export default function Members() {
  const { members, setModal, setSelectedMember } = useStore()
  const [search, setSearch] = useState('')

  const activeMembers = useMemo(() => members.filter(m => !m.archived), [members])

  const filteredMembers = useMemo(() => 
    activeMembers.filter((member) => member.name.toLowerCase().includes(search.toLowerCase())), 
  [activeMembers, search])

  const openMember = (member: Member, mode: any) => {
    setSelectedMember(member)
    setModal(mode)
  }

  const parseAmount = (amountStr: string) => Number((amountStr || '0').replace(/[^0-9]/g, ''))
  const monthlyValue = activeMembers.reduce((sum, member) => sum + parseAmount(member.amount || '0'), 0)

  return (
    <>
      <div className="members-heading">
        <div>
          <p className="eyebrow">Member directory</p>
          <h1>Members</h1>
          <p className="subheading">Manage your roster, monthly fees, and payment details.</p>
        </div>
        <button className="primary-button" onClick={() => setModal('add')}>
          <Plus size={16} /> Add member
        </button>
      </div>

      <div className="member-summary-grid">
        <Summary icon={Users} label="Total members" value={activeMembers.length.toString()} accentColor="#be123c" bgLight="#fff1f2" />
        <Summary icon={Check} label="Paid this month" value={activeMembers.filter((m) => m.status === 'Paid').length.toString()} accentColor="#059669" bgLight="#ecfdf5" />
        <Summary icon={Clock3} label="Fees pending" value={activeMembers.filter((m) => m.status !== 'Paid').length.toString()} accentColor="#d97706" bgLight="#fffbeb" />
        <Summary icon={CircleDollarSign} label="Monthly value" value={`₹${monthlyValue.toLocaleString('en-IN')}`} accentColor="#2563eb" bgLight="#eff6ff" />
      </div>

      <section className="panel member-directory">
        <div className="directory-toolbar">
          <div className="search-box">
            <Search size={16} />
            <input 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Search members" 
              aria-label="Search members" 
            />
          </div>
          <button className="secondary-button" onClick={() => window.alert('Member list export is ready')}>
            <Copy size={16} /> Export list
          </button>
        </div>

        {filteredMembers.map((member) => (
          <div className="member-table-row" key={member.id} onClick={() => openMember(member, 'details')} style={{ cursor: 'pointer' }}>
            <div className="member-main">
              <div className={`member-avatar ${member.color}`}>{member.initials}</div>
              <div className="member-cell">
                <strong>{member.name}</strong>
                <small>Joined {member.joined}</small>
              </div>
            </div>
            <div className="contact-cell member-cell">
              <strong>{member.phone}</strong>
              <small>{member.email}</small>
            </div>
            <div className="member-cell">
              <strong>{member.plan}</strong>
              <small>{member.amount} / month</small>
            </div>
            <div className="member-cell">
              <StatusBadge status={member.status} />
              <small>{member.due}</small>
            </div>
            <div className="member-actions" onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openMember(member, 'details')} style={{ padding: '6px 14px', borderRadius: '6px', fontWeight: 600 }}>
                View Details
              </button>
              <button
                onClick={() => openMember(member, 'edit-member')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  border: '1px solid #e5e7eb',
                  background: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="member-empty">
            No members found matching "{search}"
          </div>
        )}
      </section>
    </>
  )
}
