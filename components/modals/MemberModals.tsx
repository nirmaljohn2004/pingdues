'use client'

import { useState, useEffect } from 'react'
import { X, User, Phone, Mail, Calendar, Hash, MapPin, Filter, Check, Users, Edit3 } from 'lucide-react'
import { useStore, Member } from '@/store/useStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const parseAmount = (s?: string) => Number((s || '0').replace(/[^0-9]/g, ''))

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em',
      textTransform: 'uppercase', margin: '0 0 14px', paddingBottom: '10px',
      borderBottom: '1px solid #f1f5f9',
    }}>{children}</p>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
        {label}{required && <span style={{ color: '#be123c', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '9px 12px',
  fontSize: '13px',
  color: '#0f172a',
  outline: 'none',
  background: '#fff',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid #f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '170px', flexShrink: 0, color: '#94a3b8' }}>
        {icon}
        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: value === '--' ? '#cbd5e1' : '#0f172a' }}>{value || '--'}</span>
    </div>
  )
}

function TxTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none',
      borderBottom: active ? '2px solid #059669' : '2px solid transparent',
      color: active ? '#059669' : '#64748b',
      padding: '0 0 12px', fontSize: '13px', fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.18s ease', marginBottom: '-2px',
    }}>{label}</button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function MemberModals() {
  const { modal, setModal, members, setMembers, groups, selectedMember, updateMember, archiveMember, notify } = useStore()

  // add / edit form state
  const [name, setName]                   = useState('')
  const [phone, setPhone]                 = useState('')
  const [altPhone, setAltPhone]           = useState('')
  const [admissionNo, setAdmissionNo]     = useState('')
  const [email, setEmail]                 = useState('')
  const [dob, setDob]                     = useState('')
  const [guardianName, setGuardianName]   = useState('')
  const [address, setAddress]             = useState('')
  const [remarks, setRemarks]             = useState('')
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  // populate form when opening edit-member mode
  useEffect(() => {
    if (modal === 'edit-member' && selectedMember) {
      setName(selectedMember.name || '')
      setPhone(selectedMember.phone || '')
      setAltPhone(selectedMember.alternatePhone === '--' ? '' : selectedMember.alternatePhone || '')
      setAdmissionNo(selectedMember.admissionNo === '--' ? '' : selectedMember.admissionNo || '')
      setEmail(selectedMember.email || '')
      setDob(selectedMember.dob === '--' ? '' : selectedMember.dob || '')
      setGuardianName(selectedMember.guardianName === '--' ? '' : selectedMember.guardianName || '')
      setAddress(selectedMember.address === '--' ? '' : selectedMember.address || '')
      setRemarks(selectedMember.remarks || '')
      setSelectedGroups(selectedMember.memberGroups || (selectedMember.plan ? [selectedMember.plan] : []))
    }
  }, [modal, selectedMember])

  // details modal state
  const [detailsTab, setDetailsTab]       = useState<'member' | 'transaction'>('member')
  const [txTab, setTxTab]                 = useState<'recent' | 'paid' | 'pending'>('recent')
  const [groupsOpen, setGroupsOpen]       = useState(false)

  if (!modal || !['add', 'edit-member', 'details'].includes(modal)) return null

  const toggleGroup = (g: string) =>
    setSelectedGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const resetForm = () => {
    setName(''); setPhone(''); setAltPhone(''); setAdmissionNo('')
    setEmail(''); setDob(''); setGuardianName(''); setAddress('')
    setRemarks(''); setSelectedGroups([])
  }

  const closeModal = () => {
    setModal(null); resetForm()
    setDetailsTab('member'); setTxTab('recent'); setGroupsOpen(false)
  }

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) { notify('Name and phone are required'); return }

    if (modal === 'edit-member' && selectedMember) {
      updateMember(selectedMember.id, {
        name: name.trim(),
        phone: phone.trim(),
        alternatePhone: altPhone || '--',
        admissionNo: admissionNo || '--',
        email: email.trim(),
        dob: dob || '--',
        guardianName: guardianName || '--',
        address: address || '--',
        remarks: remarks.trim() || undefined,
        memberGroups: selectedGroups,
        plan: selectedGroups[0] || selectedMember.plan
      })
      notify(`Updated details for ${name.trim()}`)
      closeModal()
      return
    }

    const initials = name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    const colors   = ['peach', 'lavender', 'mint', 'sky']
    const color    = colors[Math.floor(Math.random() * colors.length)]

    const newMember: Member = {
      id: Date.now(), name: name.trim(), initials, status: 'Pending', color,
      phone: phone.trim(), email: email.trim(),
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      plan: selectedGroups[0] || undefined,
      memberGroups: selectedGroups,
      alternatePhone: altPhone || '--',
      admissionNo:   admissionNo || '--',
      dob:           dob || '--',
      guardianName:  guardianName || '--',
      address:       address || '--',
      remarks:       remarks.trim() || undefined,
    }

    setMembers([...members, newMember])
    notify('Member added successfully')
    closeModal()
  }

  // ── Build per-group transaction rows ───────────────────────────────────────
  const allGroupRows = (() => {
    if (!selectedMember) return []
    const gp = selectedMember.groupPayments
    const groups = selectedMember.memberGroups || (selectedMember.plan ? [selectedMember.plan] : [])

    return groups.map(g => ({
      group: g,
      amount: gp?.[g]?.amount ?? selectedMember.amount ?? '₹0',
      status: (gp?.[g]?.status ?? selectedMember.status) as 'Paid' | 'Pending' | 'Overdue',
      due:    gp?.[g]?.due ?? selectedMember.due ?? '--',
    }))
  })()

  const txRows = (() => {
    if (txTab === 'paid')    return allGroupRows.filter(r => r.status === 'Paid')
    if (txTab === 'pending') return allGroupRows.filter(r => r.status !== 'Paid')
    return allGroupRows   // 'recent' = all
  })()

  // ── Summary totals across all groups ───────────────────────────────────────
  const totalDue       = allGroupRows.filter(r => r.status !== 'Paid').reduce((s, r) => s + parseAmount(r.amount), 0)
  const totalCollected = allGroupRows.filter(r => r.status === 'Paid') .reduce((s, r) => s + parseAmount(r.amount), 0)

  return (
    <div
      className="modal-backdrop"
      onClick={closeModal}
      style={{ padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.2)',
          width: modal === 'details' ? 'min(880px, 100%)' : 'min(580px, 100%)',
          maxHeight: 'calc(100vh - 40px)',
          overflowY: 'auto',
          boxSizing: 'border-box',
        }}
      >

        {/* ═══════════════════════════════════════════════════════════════════
            ADD / EDIT MEMBER
        ════════════════════════════════════════════════════════════════════ */}
        {(modal === 'add' || modal === 'edit-member') && (
          <>
            {/* ── Header ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '28px 32px 24px',
              borderBottom: '1px solid #f1f5f9',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                background: 'linear-gradient(135deg,#fff1f2,#fce7f3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#be123c',
                boxShadow: '0 2px 8px rgba(190,18,60,0.15)',
              }}>
                {modal === 'edit-member' ? <Edit3 size={20} /> : <User size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                  {modal === 'edit-member' ? 'Edit member details' : 'Add new member'}
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#94a3b8' }}>
                  {modal === 'edit-member' ? 'Update details below. Group assignment can be modified.' : 'Fill in the details. Group assignment is optional.'}
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px',
                  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b', transition: 'all 0.15s ease', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fc'; e.currentTarget.style.color = '#0f172a' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSaveMember}>
              <div style={{ padding: '28px 32px' }}>

                {/* Personal Details */}
                <SectionLabel>Personal Details</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                  <FormField label="Full Name" required>
                    <input
                      style={inputStyle} type="text" value={name}
                      onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" required
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Phone Number" required>
                    <input
                      style={inputStyle} type="tel" value={phone}
                      onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" required
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Alternate Phone">
                    <input
                      style={inputStyle} type="tel" value={altPhone}
                      onChange={e => setAltPhone(e.target.value)} placeholder="+91 98765 43210"
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Admission No.">
                    <input
                      style={inputStyle} type="text" value={admissionNo}
                      onChange={e => setAdmissionNo(e.target.value)} placeholder="e.g. ADM-001"
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Email Address">
                    <input
                      style={inputStyle} type="email" value={email}
                      onChange={e => setEmail(e.target.value)} placeholder="john@example.com"
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Date of Birth">
                    <input
                      style={inputStyle} type="date" value={dob}
                      onChange={e => setDob(e.target.value)}
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <FormField label="Guardian Name">
                    <input
                      style={inputStyle} type="text" value={guardianName}
                      onChange={e => setGuardianName(e.target.value)} placeholder="e.g. Robert Doe"
                      onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                      onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                    />
                  </FormField>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField label="Address">
                      <input
                        style={inputStyle} type="text" value={address}
                        onChange={e => setAddress(e.target.value)} placeholder="City, State"
                        onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                      />
                    </FormField>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <FormField label="Remarks / Notes">
                      <textarea
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="Any additional notes about this member…"
                        rows={3}
                        style={{
                          ...inputStyle,
                          resize: 'vertical',
                          lineHeight: '1.6',
                          minHeight: '80px',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Assign to Groups (optional) */}
                <SectionLabel>Assign to Groups <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px', color: '#94a3b8' }}>— optional</span></SectionLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {groups.map(g => {
                    const active = selectedGroups.includes(g)
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => toggleGroup(g)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '7px 14px', borderRadius: '20px', cursor: 'pointer',
                          fontSize: '12px', fontWeight: 600,
                          border: active ? '1.5px solid #be123c' : '1.5px solid #e5e7eb',
                          background: active ? '#fff1f2' : '#f8f9fc',
                          color: active ? '#be123c' : '#475569',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {active && <Check size={12} strokeWidth={3} />}
                        {g}
                      </button>
                    )
                  })}
                </div>
                {selectedGroups.length > 0 && (
                  <p style={{ margin: '10px 0 0', fontSize: '12px', color: '#059669', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={13} /> {selectedGroups.length} group{selectedGroups.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* ── Footer ── */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', gap: '10px',
                padding: '20px 32px 28px',
                borderTop: '1px solid #f1f5f9',
              }}>
                <button type="button" className="secondary-button" onClick={closeModal}>Cancel</button>
                <button type="submit" className="primary-button">
                  {modal === 'edit-member' ? <Edit3 size={15} /> : <User size={15} />}
                  {modal === 'edit-member' ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            MEMBER DETAILS
        ════════════════════════════════════════════════════════════════════ */}
        {modal === 'details' && selectedMember && (
          <>
            {/* ── Header ── */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              padding: '28px 32px 24px', borderBottom: '1px solid #f1f5f9',
            }}>
              <div
                className={`member-avatar ${selectedMember.color}`}
                style={{ width: 52, height: 52, fontSize: 18, borderRadius: 14, flexShrink: 0 }}
              >
                {selectedMember.initials}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{selectedMember.name}</h2>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{selectedMember.phone}</span>
              </div>
              <button
                onClick={() => setModal('edit-member')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', background: '#f8fafc',
                  fontSize: '12px', fontWeight: 600, color: '#334155',
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  marginRight: '6px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155' }}
              >
                <Edit3 size={14} /> Edit Details
              </button>
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{
                  border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px',
                  width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#64748b', transition: 'all 0.15s ease', flexShrink: 0,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8f9fc'; e.currentTarget.style.color = '#0f172a' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: '28px', padding: '0 32px', borderBottom: '1px solid #f1f5f9' }}>
              {(['member', 'transaction'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setDetailsTab(t)}
                  style={{
                    background: 'none', border: 'none',
                    borderBottom: detailsTab === t ? '2px solid #059669' : '2px solid transparent',
                    color: detailsTab === t ? '#059669' : '#64748b',
                    padding: '16px 0 14px', fontSize: '14px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.18s ease', marginBottom: '-1px',
                  }}
                >
                  {t === 'member' ? 'Member Details' : 'Transaction Details'}
                </button>
              ))}
            </div>

            <div style={{ padding: '28px 32px 32px' }}>

              {/* ── MEMBER DETAILS TAB ── */}
              {detailsTab === 'member' && (
                <>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Personal Information</p>
                  <div style={{ marginBottom: '32px' }}>
                    <DetailRow icon={<User size={14} />}     label="Name"             value={selectedMember.name} />
                    <DetailRow icon={<Phone size={14} />}    label="Mobile Number"    value={selectedMember.phone} />
                    <DetailRow icon={<Phone size={14} />}    label="Alternate No"     value={selectedMember.alternatePhone || '--'} />
                    <DetailRow icon={<Hash size={14} />}     label="Admission No"     value={selectedMember.admissionNo || '--'} />
                    <DetailRow icon={<Mail size={14} />}     label="Email Address"    value={selectedMember.email || '--'} />
                    <DetailRow icon={<Calendar size={14} />} label="Date of Birth"    value={selectedMember.dob || '--'} />
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>More Information</p>
                  <div style={{ marginBottom: selectedMember.remarks ? '24px' : 0 }}>
                    <DetailRow icon={<Calendar size={14} />} label="Date of Admission" value={selectedMember.joined} />
                    <DetailRow icon={<MapPin size={14} />}   label="Address"           value={selectedMember.address || '--'} />
                    <DetailRow icon={<User size={14} />}     label="Guardian Name"     value={selectedMember.guardianName || '--'} />
                  </div>

                  {/* Remarks */}
                  {selectedMember.remarks ? (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Remarks</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#78350f', lineHeight: '1.6', fontWeight: 500 }}>{selectedMember.remarks}</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', borderRadius: '8px', border: '1px dashed #e5e7eb', color: '#94a3b8', marginBottom: '24px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      <span style={{ fontSize: '12px', fontWeight: 500 }}>No remarks added</span>
                    </div>
                  )}

                  {/* Danger Zone / Soft Member Archival */}
                  <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Remove Member Profile</strong>
                      <small style={{ color: '#94a3b8', fontSize: '11px' }}>Archives profile from active roster while keeping paid revenue intact.</small>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Archive ${selectedMember.name}'s profile? Their active membership will end, but all paid invoices and revenue stats will be safely preserved.`)) {
                          archiveMember(selectedMember.id)
                          notify(`${selectedMember.name} archived from roster`)
                          closeModal()
                        }
                      }}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      Archive Member
                    </button>
                  </div>
                </>
              )}

              {/* ── TRANSACTION DETAILS TAB ── */}
              {detailsTab === 'transaction' && (
                <>
                  {/* Summary cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '32px' }}>
                    <div style={{ border: '1px solid #fee2e2', borderBottom: '3px solid #ef4444', borderRadius: '12px', padding: '18px 16px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Due</span>
                      <strong style={{ fontSize: '24px', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.03em' }}>
                        ₹{totalDue.toLocaleString('en-IN')}
                      </strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{allGroupRows.filter(r => r.status !== 'Paid').length} group{allGroupRows.filter(r => r.status !== 'Paid').length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ border: '1px solid #d1fae5', borderBottom: '3px solid #10b981', borderRadius: '12px', padding: '18px 16px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Collected</span>
                      <strong style={{ fontSize: '24px', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.03em' }}>
                        ₹{totalCollected.toLocaleString('en-IN')}
                      </strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{allGroupRows.filter(r => r.status === 'Paid').length} group{allGroupRows.filter(r => r.status === 'Paid').length !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={{ border: '1px solid #fef9c3', borderBottom: '3px solid #eab308', borderRadius: '12px', padding: '18px 16px' }}>
                      <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>To be settled</span>
                      <strong style={{ fontSize: '24px', color: '#0f172a', fontWeight: 700, letterSpacing: '-0.03em' }}>₹0</strong>
                    </div>

                    {/* Groups — clickable expand */}
                    <div
                      onClick={() => setGroupsOpen(o => !o)}
                      style={{
                        border: groupsOpen ? '1px solid #be123c' : '1px solid #e5e7eb',
                        borderRadius: '12px', padding: '18px 16px',
                        cursor: 'pointer', transition: 'all 0.18s ease',
                        background: groupsOpen ? '#fff9fb' : '#fff',
                        boxShadow: groupsOpen ? '0 0 0 3px rgba(190,18,60,0.08)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          Groups
                        </span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" style={{ transform: groupsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease' }}><polyline points="6 9 12 15 18 9"/></svg>
                      </div>

                      {!groupsOpen && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' }}>
                            {selectedMember.plan || (selectedMember.memberGroups?.[0]) || 'No group'}
                          </span>
                          {(selectedMember.memberGroups || []).length > 1 && (
                            <span style={{ background: '#fff1f2', color: '#be123c', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                              +{(selectedMember.memberGroups || []).length - 1}
                            </span>
                          )}
                        </div>
                      )}

                      {groupsOpen && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {(selectedMember.memberGroups?.length ? selectedMember.memberGroups : selectedMember.plan ? [selectedMember.plan] : ['No group assigned']).map((g, i) => (
                            <div key={g} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fc', borderRadius: '8px', padding: '7px 10px', border: '1px solid #e8eaf0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: 24, height: 24, borderRadius: '6px', background: i === 0 ? '#fff1f2' : '#f0fdf4', color: i === 0 ? '#be123c' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '10px' }}>
                                  {g.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>{g}</span>
                              </div>
                              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#e6f8ef', color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669', display: 'inline-block' }} /> Active
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Transactions</h3>
                    <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>{txRows.length}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', borderBottom: '2px solid #f1f5f9', marginBottom: '20px' }}>
                    <TxTab label="Recent"  active={txTab === 'recent'}  onClick={() => setTxTab('recent')} />
                    <TxTab label="Paid"    active={txTab === 'paid'}    onClick={() => setTxTab('paid')} />
                    <TxTab label="Pending" active={txTab === 'pending'} onClick={() => setTxTab('pending')} />
                  </div>

                  {/* Search + filter */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                      <input
                        type="text"
                        placeholder="Search transactions…"
                        style={{ ...inputStyle, paddingLeft: '36px', width: '260px' }}
                        onFocus={e => { e.target.style.borderColor = '#be123c'; e.target.style.boxShadow = '0 0 0 3px rgba(190,18,60,0.1)' }}
                        onBlur={e => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none' }}
                      />
                    </div>
                    <button className="secondary-button" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', fontSize: '13px' }}>
                      <Filter size={14} /> Filter
                    </button>
                  </div>

                  {/* Rows */}
                  {txRows.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {txRows.map((tx, i) => {
                        const isRowPaid = tx.status === 'Paid'
                        const isOverdue = tx.status === 'Overdue'

                        const borderColor = isRowPaid ? '#d1fae5' : isOverdue ? '#fecaca' : '#fed7aa'
                        const bgColor     = isRowPaid ? '#f0fdf4' : isOverdue ? '#fef2f2' : '#fff7ed'
                        const iconBg      = isRowPaid ? '#dcfce7' : isOverdue ? '#fee2e2' : '#ffedd5'
                        const amtColor    = isRowPaid ? '#059669' : isOverdue ? '#dc2626' : '#ea580c'
                        const badgeBg     = isRowPaid ? '#dcfce7' : isOverdue ? '#fee2e2' : '#ffedd5'
                        const badgeColor  = isRowPaid ? '#16a34a' : isOverdue ? '#dc2626' : '#ea580c'
                        const statusText  = isRowPaid ? '✓ Paid' : isOverdue ? '⚠ Overdue' : '⚡ Pending'

                        return (
                          <div
                            key={i}
                            style={{ borderRadius: '12px', background: bgColor, border: `1px solid ${borderColor}`, overflow: 'hidden' }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: 36, height: 36, borderRadius: '10px', flexShrink: 0, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {isRowPaid
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    : isOverdue
                                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  }
                                </div>
                                <div>
                                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                                    {tx.group} — Monthly Fee
                                  </strong>
                                  <small style={{ color: '#94a3b8', fontSize: '11px' }}>{tx.due}</small>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ textAlign: 'right' }}>
                                  <strong style={{ display: 'block', fontSize: '16px', fontWeight: 700, color: amtColor, letterSpacing: '-0.02em' }}>{tx.amount}</strong>
                                  <span style={{ display: 'inline-block', marginTop: '3px', fontSize: '9px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', background: badgeBg, color: badgeColor }}>
                                    {statusText}
                                  </span>
                                </div>

                                {!isRowPaid && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setModal('new-payment')
                                    }}
                                    style={{
                                      padding: '7px 14px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      background: '#be123c',
                                      color: '#fff',
                                      fontSize: '12px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      boxShadow: '0 2px 6px rgba(190,18,60,0.2)',
                                      transition: 'all 0.15s ease'
                                    }}
                                  >
                                    Mark as Paid
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: '#cbd5e1', fontSize: '14px', fontWeight: 500 }}>
                      No transactions found.
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
