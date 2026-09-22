'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalHead } from '@/components/ui/Modal'
import { useStore, GroupDetails } from '@/store/useStore'

export function GroupModals() {
  const { modal, setModal, selectedGroup, setSelectedGroup, addGroup, updateGroup, notify } = useStore()

  const [name, setName] = useState('')
  const [billingType, setBillingType] = useState<'One-time' | 'Recurring'>('Recurring')
  const [feeAmount, setFeeAmount] = useState('')
  const [recursEvery, setRecursEvery] = useState('Monthly')
  const [dueDate, setDueDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (modal === 'edit-group' && selectedGroup) {
      setName(selectedGroup.name || '')
      setBillingType(selectedGroup.billingType || 'Recurring')
      setFeeAmount(selectedGroup.feeAmount ? selectedGroup.feeAmount.replace(/[^0-9]/g, '') : '')
      setRecursEvery(selectedGroup.recursEvery || 'Monthly')
      setDueDate(selectedGroup.dueDate || '')
      setStartDate(selectedGroup.startDate || '')
      setEndDate(selectedGroup.endDate || '')
      setDescription(selectedGroup.description || '')
    } else if (modal === 'add-group') {
      setName('')
      setBillingType('Recurring')
      setFeeAmount('')
      setRecursEvery('Monthly')
      setDueDate('1st of every month')
      setStartDate(new Date().toISOString().split('T')[0])
      setEndDate('')
      setDescription('')
    }
  }, [modal, selectedGroup])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      notify('Group name is required')
      return
    }

    const formattedFee = feeAmount ? (feeAmount.startsWith('₹') ? feeAmount : `₹${Number(feeAmount).toLocaleString('en-IN')}`) : '₹0'

    if (modal === 'add-group') {
      const newGroup: GroupDetails = {
        id: Date.now().toString(),
        name: name.trim(),
        billingType,
        feeAmount: formattedFee,
        recursEvery: billingType === 'Recurring' ? recursEvery : undefined,
        dueDate: dueDate || (billingType === 'Recurring' ? '1st of every month' : 'On admission'),
        startDate: startDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: endDate || undefined,
        createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: description.trim()
      }
      addGroup(newGroup)
      notify(`Group "${newGroup.name}" created successfully`)
    } else if (modal === 'edit-group' && selectedGroup) {
      updateGroup(selectedGroup.id, {
        name: name.trim(),
        billingType,
        feeAmount: formattedFee,
        recursEvery: billingType === 'Recurring' ? recursEvery : undefined,
        dueDate: dueDate || (billingType === 'Recurring' ? '1st of every month' : 'On admission'),
        startDate: startDate || selectedGroup.startDate,
        endDate: endDate || undefined,
        description: description.trim()
      })
      notify(`Group updated successfully`)
    }

    setModal(null)
    setSelectedGroup(null)
    useStore.getState().setActiveTab('Groups')
  }

  const isModalOpen = modal === 'add-group' || modal === 'edit-group'
  if (!isModalOpen) return null

  const closeModal = () => {
    setModal(null)
    setSelectedGroup(null)
  }

  return (
    <Modal close={closeModal}>
      <ModalHead
        title={modal === 'add-group' ? 'Create New Group' : 'Edit Group Details'}
        close={closeModal}
      />
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 0 0' }}>
        
        {/* Basic Info */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Group Name *</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Premium Monthly, Weight Loss Batch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Billing Type Selector */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Billing Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={() => setBillingType('Recurring')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: billingType === 'Recurring' ? '2px solid #be123c' : '1px solid #e2e8f0',
                background: billingType === 'Recurring' ? '#fff1f2' : '#fff',
                color: billingType === 'Recurring' ? '#be123c' : '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              🔄 Recurring Fee
            </button>
            <button
              type="button"
              onClick={() => setBillingType('One-time')}
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: billingType === 'One-time' ? '2px solid #be123c' : '1px solid #e2e8f0',
                background: billingType === 'One-time' ? '#fff1f2' : '#fff',
                color: billingType === 'One-time' ? '#be123c' : '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              🏷️ One-Time Fee
            </button>
          </div>
        </div>

        {/* Fee Amount & Recurrence */}
        <div style={{ display: 'grid', gridTemplateColumns: billingType === 'Recurring' ? '1fr 1fr' : '1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Fee Amount (₹) *</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1800"
              value={feeAmount}
              onChange={(e) => setFeeAmount(e.target.value)}
              required
            />
          </div>

          {billingType === 'Recurring' && (
            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 600 }}>Recurs Every</label>
              <select
                className="form-input"
                value={recursEvery}
                onChange={(e) => setRecursEvery(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        {/* Due Date & Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Due Date Rule / Schedule</label>
            <input
              type="text"
              className="form-input"
              placeholder={billingType === 'Recurring' ? 'e.g. 5th of every month' : 'e.g. On admission'}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600 }}>Start Date</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 01 Jan 2024"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>

        {/* Description / Remarks */}
        <div className="form-group">
          <label className="form-label" style={{ fontWeight: 600 }}>Description & Notes</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Brief description of who this group is for or what benefits it includes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button">
            {modal === 'add-group' ? 'Create Group' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AddMembersToGroupModal() {
  const { modal, setModal, selectedGroup, setSelectedGroup, members, setMembers, notify } = useStore()
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    if (modal === 'add-members-to-group' && selectedGroup) {
      const currentEnrolled = members
        .filter(m => !m.archived && (m.memberGroups?.includes(selectedGroup.name) || m.plan === selectedGroup.name))
        .map(m => m.id)
      setSelectedIds(currentEnrolled)
      setSearch('')
    }
  }, [modal, selectedGroup, members])

  if (modal !== 'add-members-to-group' || !selectedGroup) return null

  const closeModal = () => {
    setModal(null)
    setSelectedGroup(null)
  }

  const activeMembers = members.filter(m => !m.archived)
  const filtered = activeMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filtered.map(m => m.id))
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const groupName = selectedGroup.name
    const groupFee = selectedGroup.feeAmount

    const updatedMembers = members.map(m => {
      const isSelected = selectedIds.includes(m.id)
      const currentGroups = m.memberGroups || (m.plan ? [m.plan] : [])
      const hasGroup = currentGroups.includes(groupName)

      if (isSelected && !hasGroup) {
        const newGroups = [...currentGroups, groupName]
        const groupPayments = {
          ...(m.groupPayments || {}),
          [groupName]: {
            amount: groupFee,
            status: 'Pending' as const,
            due: 'Due today'
          }
        }
        return {
          ...m,
          memberGroups: newGroups,
          plan: m.plan || groupName,
          groupPayments
        }
      } else if (!isSelected && hasGroup) {
        const newGroups = currentGroups.filter(g => g !== groupName)
        const groupPayments = { ...(m.groupPayments || {}) }
        delete groupPayments[groupName]
        return {
          ...m,
          memberGroups: newGroups,
          plan: newGroups[0] || undefined,
          groupPayments
        }
      }
      return m
    })

    setMembers(updatedMembers)
    notify(`Updated member enrollment for "${groupName}"`)
    closeModal()
  }

  return (
    <Modal close={closeModal}>
      <ModalHead
        title={`Enroll Members: ${selectedGroup.name}`}
        close={closeModal}
      />
      <p style={{ margin: '-10px 0 16px', fontSize: '13px', color: '#64748b' }}>
        Select members from your system roster to enroll them in this group ({selectedGroup.feeAmount}/member).
      </p>

      {/* Search & Select All Toolbar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <div className="search-box" style={{ flex: 1 }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, phone, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
        <button
          type="button"
          onClick={toggleSelectAll}
          style={{
            padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
            background: '#f8fafc', fontSize: '12px', fontWeight: 600, color: '#334155',
            cursor: 'pointer', flexShrink: 0
          }}
        >
          {selectedIds.length === filtered.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Member List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
        {filtered.length > 0 ? (
          filtered.map(m => {
            const isChecked = selectedIds.includes(m.id)
            const isCurrentlyInGroup = m.memberGroups?.includes(selectedGroup.name) || m.plan === selectedGroup.name

            return (
              <div
                key={m.id}
                onClick={() => toggleSelect(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                  border: isChecked ? '1.5px solid #be123c' : '1px solid #e8eaf0',
                  background: isChecked ? '#fff9fb' : '#fff',
                  transition: 'all 0.15s ease'
                }}
              >
                <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 12, flexShrink: 0 }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>{m.name}</strong>
                    {isCurrentlyInGroup && (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#dcfce7', color: '#16a34a' }}>
                        Currently Enrolled
                      </span>
                    )}
                  </div>
                  <small style={{ color: '#64748b', fontSize: '12px', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {m.phone} • {m.email}
                  </small>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '6px', flexShrink: 0,
                  border: isChecked ? 'none' : '2px solid #cbd5e1',
                  background: isChecked ? '#be123c' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isChecked && <Check size={14} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ padding: '32px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No members found matching "{search}"
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
          {selectedIds.length} member{selectedIds.length !== 1 ? 's' : ''} selected
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button" className="secondary-button" onClick={closeModal}>
            Cancel
          </button>
          <button type="button" className="primary-button" onClick={handleSave}>
            <UserPlus size={15} /> Save Enrollment
          </button>
        </div>
      </div>
    </Modal>
  )
}

function GroupDetailsModal() {
  const { modal, setModal, selectedGroup, setSelectedGroup, members, setMembers, notify } = useStore()

  if (modal !== 'group-details' || !selectedGroup) return null

  const closeModal = () => {
    setModal(null)
    setSelectedGroup(null)
  }

  const groupName = selectedGroup.name
  const groupMembers = members.filter(m => !m.archived && (m.memberGroups?.includes(groupName) || m.plan === groupName))

  const handleRemoveMember = (memberId: number, memberName: string) => {
    if (!window.confirm(`Remove ${memberName} from "${groupName}"?`)) return
    const updated = members.map(m => {
      if (m.id === memberId) {
        const newGroups = (m.memberGroups || []).filter(g => g !== groupName)
        const groupPayments = { ...(m.groupPayments || {}) }
        delete groupPayments[groupName]
        return {
          ...m,
          memberGroups: newGroups,
          plan: newGroups[0] || undefined,
          groupPayments
        }
      }
      return m
    })
    setMembers(updated)
    notify(`Removed ${memberName} from ${groupName}`)
  }

  return (
    <Modal close={closeModal}>
      <ModalHead
        title={`Group Roster: ${selectedGroup.name}`}
        close={closeModal}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '-10px 0 18px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
          Fee: <strong>{selectedGroup.feeAmount}</strong> ({selectedGroup.billingType}) • <strong>{groupMembers.length} members</strong> enrolled
        </p>
        <button
          className="primary-button"
          onClick={() => {
            setModal('add-members-to-group')
          }}
          style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <UserPlus size={14} /> Add Members
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
        {groupMembers.length > 0 ? (
          groupMembers.map(m => {
            const payInfo = m.groupPayments?.[groupName]
            const status = payInfo?.status || m.status || 'Pending'
            const statusBg = status === 'Paid' ? '#dcfce7' : status === 'Overdue' ? '#fee2e2' : '#ffedd5'
            const statusColor = status === 'Paid' ? '#16a34a' : status === 'Overdue' ? '#dc2626' : '#ea580c'

            return (
              <div
                key={m.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', borderRadius: '10px',
                  background: '#f8fafc', border: '1px solid #e2e8f0'
                }}
              >
                <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 12, flexShrink: 0 }}>
                  {m.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600, display: 'block' }}>{m.name}</strong>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>{m.phone} • {m.email}</small>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: statusBg, color: statusColor, textTransform: 'uppercase' }}>
                    {status}
                  </span>
                  <button
                    onClick={() => handleRemoveMember(m.id, m.name)}
                    title="Remove from group"
                    style={{ border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ padding: '36px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#64748b' }}>No members currently enrolled in this group.</p>
            <button
              className="primary-button"
              onClick={() => setModal('add-members-to-group')}
              style={{ fontSize: '12px', margin: '0 auto' }}
            >
              <UserPlus size={14} /> Add Members Now
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
        <button type="button" className="secondary-button" onClick={closeModal}>
          Close
        </button>
      </div>
    </Modal>
  )
}

export function RenderGroupModals() {
  return (
    <>
      <GroupModals />
      <AddMembersToGroupModal />
      <GroupDetailsModal />
    </>
  )
}
