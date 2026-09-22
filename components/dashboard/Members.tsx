import { useState, useMemo } from 'react'
import { Check, CircleDollarSign, Clock3, Copy, Plus, Search, Users } from 'lucide-react'
import { useStore, Member } from '@/store/useStore'
import { StatusBadge } from '@/components/ui/StatusBadge'

function Summary({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  return (
    <article className="member-summary">
      <span className={`summary-icon ${tone}`}><Icon /></span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
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
        <Summary icon={Users} label="Total members" value={activeMembers.length.toString()} tone="red" />
        <Summary icon={Check} label="Paid this month" value={activeMembers.filter((m) => m.status === 'Paid').length.toString()} tone="green" />
        <Summary icon={Clock3} label="Fees pending" value={activeMembers.filter((m) => m.status !== 'Paid').length.toString()} tone="orange" />
        <Summary icon={CircleDollarSign} label="Monthly value" value={`₹${monthlyValue.toLocaleString('en-IN')}`} tone="blue" />
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
