'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, UserPlus, X, Check, AlertTriangle, Upload, FileSpreadsheet, ImageIcon, Pencil, ArrowRight, ArrowLeft, Plus, CheckCircle2, Calendar, DollarSign, Clock, RefreshCw, Tag } from 'lucide-react'
import { Modal, ModalHead } from '@/components/ui/Modal'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { DatePicker } from '@/components/ui/DatePicker'
import { useStore, GroupDetails, Member } from '@/store/useStore'

function GroupFormModal() {
  const { modal, setModal, selectedGroup, setSelectedGroup, addGroup, updateGroup, members, setMembers, notify } = useStore()

  // Wizard Step: 1 = Basic Details, 2 = Add Members
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)

  // Step 1: Details & Branding
  const [name, setName] = useState('')
  const [groupImage, setGroupImage] = useState<string>('')
  const [billingType, setBillingType] = useState<'One-time' | 'Recurring'>('Recurring')
  const [feeAmount, setFeeAmount] = useState('')
  const [recursEvery, setRecursEvery] = useState('Monthly')
  const [collectionDay, setCollectionDay] = useState('1st of every month')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [acceptInstallments, setAcceptInstallments] = useState(false)

  // Step 2: Member Selection
  const [memberSearch, setMemberSearch] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([])
  const [memberCustomAmounts, setMemberCustomAmounts] = useState<Record<number, string>>({})

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (modal === 'edit-group' && selectedGroup) {
      setCurrentStep(1)
      setName(selectedGroup.name || '')
      setGroupImage(selectedGroup.groupImage || '')
      setBillingType(selectedGroup.billingType || 'Recurring')
      setFeeAmount(selectedGroup.feeAmount ? selectedGroup.feeAmount.replace(/[^0-9]/g, '') : '')
      setRecursEvery(selectedGroup.recursEvery || 'Monthly')
      setCollectionDay(selectedGroup.dueDate || '1st of every month')
      setStartDate(selectedGroup.startDate || new Date().toISOString().split('T')[0])
      setEndDate(selectedGroup.endDate || '')
      setDescription(selectedGroup.description || '')
      setAcceptInstallments(selectedGroup.acceptInstallments || false)

      // Pre-select existing members in this group
      const existingInGroup = members
        .filter(m => (m.memberGroups || []).includes(selectedGroup.name) || m.plan === selectedGroup.name)
        .map(m => m.id)
      setSelectedMemberIds(existingInGroup)
    } else if (modal === 'add-group') {
      setCurrentStep(1)
      setName('')
      setGroupImage('')
      setBillingType('Recurring')
      setFeeAmount('')
      setRecursEvery('Monthly')
      setCollectionDay('1st of every month')
      setStartDate(new Date().toISOString().split('T')[0])
      setEndDate('')
      setDescription('')
      setAcceptInstallments(false)
      setSelectedMemberIds([])
      setMemberCustomAmounts({})
    }
  }, [modal, selectedGroup, members])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify('Image size should be under 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setGroupImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!name.trim()) {
      notify('Please enter a group name')
      return
    }
    if (!feeAmount.trim() || Number(feeAmount) <= 0) {
      notify('Please enter a valid fee amount')
      return
    }
    setCurrentStep(2)
  }

  const handleSaveAll = () => {
    if (!name.trim()) {
      notify('Group name is required')
      setCurrentStep(1)
      return
    }

    const formattedFee = feeAmount ? (feeAmount.startsWith('₹') ? feeAmount : `₹${Number(feeAmount).toLocaleString('en-IN')}`) : '₹0'
    const targetGroupName = name.trim()

    if (modal === 'add-group') {
      const newGroup: GroupDetails = {
        id: Date.now().toString(),
        name: targetGroupName,
        groupImage: groupImage || undefined,
        billingType,
        feeAmount: formattedFee,
        recursEvery: billingType === 'Recurring' ? recursEvery : undefined,
        dueDate: collectionDay || (billingType === 'Recurring' ? '1st of every month' : 'On admission'),
        startDate: startDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        endDate: endDate || undefined,
        createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        description: description.trim(),
        acceptInstallments,
      }
      addGroup(newGroup)

      // Add selected members to this newly created group
      if (selectedMemberIds.length > 0) {
        setMembers(prev => prev.map(m => {
          if (selectedMemberIds.includes(m.id)) {
            const currentGroups = m.memberGroups || (m.plan ? [m.plan] : [])
            const newGroups = currentGroups.includes(targetGroupName) ? currentGroups : [...currentGroups, targetGroupName]
            const customAmt = memberCustomAmounts[m.id]
            const memberFee = customAmt ? (customAmt.startsWith('₹') ? customAmt : `₹${Number(customAmt).toLocaleString('en-IN')}`) : formattedFee

            return {
              ...m,
              memberGroups: newGroups,
              plan: m.plan || targetGroupName,
              groupPayments: {
                ...(m.groupPayments || {}),
                [targetGroupName]: {
                  amount: memberFee,
                  status: 'Pending' as const,
                  due: collectionDay || '1st of every month',
                  collectSchedule: collectionDay || '1st of every month',
                  startDate: startDate || new Date().toISOString().split('T')[0]
                }
              },
              groupStatus: {
                ...(m.groupStatus || {}),
                [targetGroupName]: 'Active' as const
              }
            }
          }
          return m
        }))
      }

      notify(`Group "${targetGroupName}" created with ${selectedMemberIds.length} member(s)`)
    } else if (modal === 'edit-group' && selectedGroup) {
      updateGroup(selectedGroup.id, {
        name: targetGroupName,
        groupImage: groupImage || undefined,
        billingType,
        feeAmount: formattedFee,
        recursEvery: billingType === 'Recurring' ? recursEvery : undefined,
        dueDate: collectionDay || (billingType === 'Recurring' ? '1st of every month' : 'On admission'),
        startDate: startDate || selectedGroup.startDate,
        endDate: endDate || undefined,
        description: description.trim(),
        acceptInstallments
      })

      // Sync member associations
      setMembers(prev => prev.map(m => {
        const isSelected = selectedMemberIds.includes(m.id)
        const inOldGroup = (m.memberGroups || []).includes(selectedGroup.name) || m.plan === selectedGroup.name

        if (isSelected && !inOldGroup) {
          // Newly added to group
          const currentGroups = m.memberGroups || (m.plan ? [m.plan] : [])
          return {
            ...m,
            memberGroups: [...currentGroups, targetGroupName],
            groupPayments: {
              ...(m.groupPayments || {}),
              [targetGroupName]: {
                amount: formattedFee,
                status: 'Pending' as const,
                due: collectionDay,
                collectSchedule: collectionDay,
                startDate: startDate
              }
            },
            groupStatus: {
              ...(m.groupStatus || {}),
              [targetGroupName]: 'Active' as const
            }
          }
        } else if (!isSelected && inOldGroup) {
          // Unassigned from group
          const newGroups = (m.memberGroups || []).filter(g => g !== selectedGroup.name && g !== targetGroupName)
          const newPayments = { ...(m.groupPayments || {}) }
          delete newPayments[selectedGroup.name]
          delete newPayments[targetGroupName]

          return {
            ...m,
            memberGroups: newGroups,
            groupPayments: newPayments,
            plan: m.plan === selectedGroup.name ? (newGroups[0] || '') : m.plan
          }
        }
        return m
      }))

      notify(`Group "${targetGroupName}" updated successfully`)
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

  const activeMembers = members.filter(m => !m.archived)
  const filteredMembers = activeMembers.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.phone.includes(memberSearch) ||
    (m.email && m.email.toLowerCase().includes(memberSearch.toLowerCase()))
  )

  const toggleSelectMember = (id: number) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedMemberIds.length === filteredMembers.length) {
      setSelectedMemberIds([])
    } else {
      setSelectedMemberIds(filteredMembers.map(m => m.id))
    }
  }

  return (
    <Modal
      close={closeModal}
      className="group-modal-container"
    >
      {/* Top Header & Breadcrumbs / Title */}
      <div className="group-modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <button
            type="button"
            onClick={closeModal}
            style={{
              background: 'none', border: 'none', color: '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '6px'
            }}
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {modal === 'add-group' ? 'New group' : 'Edit group'}
            </h2>
          </div>
        </div>

        {/* Top Action buttons */}
        <div className="group-modal-header-actions">
          <button
            type="button"
            onClick={closeModal}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px'
            }}
          >
            Cancel
          </button>

          {currentStep === 1 ? (
            <button
              type="button"
              onClick={() => handleNextStep()}
              className="primary-button"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                borderRadius: '8px',
                whiteSpace: 'nowrap'
              }}
            >
              Save & next <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAll}
              className="primary-button"
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                borderRadius: '8px',
                background: '#be123c',
                whiteSpace: 'nowrap'
              }}
            >
              {modal === 'add-group' ? 'Create Group' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      {/* Stepper Progress Bar (Matching Image 2 Reference) */}
      <div className="group-modal-stepper-wrap">
        <div style={{ display: 'flex', alignItems: 'center', width: 'min(440px, 100%)', position: 'relative' }}>
          {/* Connector Line */}
          <div style={{
            position: 'absolute',
            left: '25%',
            right: '25%',
            top: '12px',
            height: '2px',
            background: currentStep === 2 ? '#059669' : '#e2e8f0',
            zIndex: 1,
            transition: 'background 0.3s ease'
          }} />

          {/* Step 1 Pill */}
          <div
            onClick={() => setCurrentStep(1)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: currentStep >= 1 ? '#059669' : '#e2e8f0',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
              boxShadow: currentStep === 1 ? '0 0 0 4px #ecfdf5' : 'none',
              transition: 'all 0.2s ease'
            }}>
              {currentStep === 2 ? <Check size={13} strokeWidth={3} /> : '1'}
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: currentStep === 1 ? 700 : 500,
              color: currentStep === 1 ? '#0f172a' : '#64748b',
              marginTop: '6px'
            }}>
              Basic details
            </span>
          </div>

          {/* Step 2 Pill */}
          <div
            onClick={() => {
              if (name.trim() && feeAmount.trim()) setCurrentStep(2)
              else notify('Please complete group details first')
            }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 2
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: currentStep === 2 ? '#be123c' : '#f1f5f9',
              color: currentStep === 2 ? '#fff' : '#94a3b8',
              border: currentStep === 2 ? 'none' : '1px solid #cbd5e1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
              boxShadow: currentStep === 2 ? '0 0 0 4px #ffe4e6' : 'none',
              transition: 'all 0.2s ease'
            }}>
              2
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: currentStep === 2 ? 700 : 500,
              color: currentStep === 2 ? '#0f172a' : '#64748b',
              marginTop: '6px'
            }}>
              Add members
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="group-modal-body">
        {currentStep === 1 ? (
          /* ── STEP 1: BASIC DETAILS & FEE DETAILS ─────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '720px', margin: '0 auto' }}>
            
            {/* Top Card: Group Image & Name Title (Matching Image 2) */}
            <div className="group-modal-top-card">
              {/* Group Image Upload Placeholder */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '16px',
                  border: '2px dashed #cbd5e1',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
                title="Click to upload group image"
              >
                {groupImage ? (
                  <>
                    <img
                      src={groupImage}
                      alt="Group"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.4)',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                    >
                      <Pencil size={18} />
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ color: '#94a3b8', marginBottom: '2px' }}>
                      <ImageIcon size={26} strokeWidth={1.5} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#059669',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Plus size={12} strokeWidth={3} />
                    </div>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              {/* Title & Editable Name input */}
              <div style={{ flex: 1, width: '100%' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Group Name *
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                  <input
                    type="text"
                    placeholder="Enter group name (e.g. Bharatanatyam Arangetram)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="group-name-input"
                    style={{
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#0f172a',
                      border: 'none',
                      borderBottom: '2px solid #e2e8f0',
                      padding: '4px 0',
                      width: '100%',
                      outline: 'none',
                      background: 'transparent',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => (e.target.style.borderBottomColor = '#be123c')}
                    onBlur={e => (e.target.style.borderBottomColor = '#e2e8f0')}
                    autoFocus
                  />
                  <Pencil size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                  Click icon to upload a logo or banner picture for this group.
                </div>
              </div>
            </div>

            {/* Fee Details Card */}
            <div className="group-modal-card">
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Fee details</h3>
              </div>

              {/* Billing Type Selector (Recurring vs One-Time) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                  Billing Type *
                </label>
                <div className="group-modal-billing-grid">
                  <button
                    type="button"
                    onClick={() => setBillingType('Recurring')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: billingType === 'Recurring' ? '2px solid #be123c' : '1px solid #e2e8f0',
                      background: billingType === 'Recurring' ? '#fff1f2' : '#ffffff',
                      color: billingType === 'Recurring' ? '#be123c' : '#475569',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <RefreshCw size={15} style={{ flexShrink: 0 }} /> Recurring (Monthly/Annual)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingType('One-time')}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: billingType === 'One-time' ? '2px solid #be123c' : '1px solid #e2e8f0',
                      background: billingType === 'One-time' ? '#fff1f2' : '#ffffff',
                      color: billingType === 'One-time' ? '#be123c' : '#475569',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Tag size={15} style={{ flexShrink: 0 }} /> One-Time (Course/Admission)
                  </button>
                </div>
              </div>

              {/* Collection Day / Due Date Schedule */}
              <div className="group-modal-two-col">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    When do you want to collect fees? *
                  </label>
                  <DatePicker
                    value={collectionDay}
                    onChange={setCollectionDay}
                    mode="day-of-month"
                    placeholder="e.g. 1st of every month"
                  />
                </div>

                {billingType === 'Recurring' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Recurs Every
                    </label>
                    <CustomSelect
                      value={recursEvery}
                      onChange={setRecursEvery}
                      options={[
                        { value: 'Monthly', label: 'Monthly' },
                        { value: 'Quarterly', label: 'Quarterly (3 Months)' },
                        { value: 'Half-Yearly', label: 'Half-Yearly (6 Months)' },
                        { value: 'Yearly', label: 'Yearly (12 Months)' }
                      ]}
                      width="100%"
                    />
                  </div>
                )}
              </div>

              {/* Start Date & Deactivation Date */}
              <div className="group-modal-two-col">
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Group Activation Date *
                  </label>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder="Select start date..."
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    Fee collection will begin from start date.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Group Deactivation Date (Optional)
                  </label>
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder="Ongoing (no end date)"
                  />
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    Leave empty for ongoing active groups.
                  </span>
                </div>
              </div>

              {/* Amount Input (Matching Image 2) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Amount *
                </label>
                <div className="group-modal-input-box" style={{ maxWidth: '360px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#64748b' }}>₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 1800"
                    value={feeAmount}
                    onChange={(e) => setFeeAmount(e.target.value)}
                    style={{ fontSize: '15px', fontWeight: 600 }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                  You can enter any amount between ₹10 and ₹1,00,000
                </span>
              </div>

              {/* Accept Payments as Installments Switch */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
                    Accept payments as installments
                  </strong>
                  <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
                    When enabled, members with a fee amount above ₹2,000 can split their payment into monthly parts.
                  </span>
                </div>
                <button
                  type="button"
                  className={`toggle ${acceptInstallments ? 'on' : ''}`}
                  onClick={() => setAcceptInstallments(!acceptInstallments)}
                  aria-label="Toggle installments"
                >
                  <span />
                </button>
              </div>

              {/* Description / Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Description & Benefits (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Details about who this group is for or what facilities are included..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: '#0f172a',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Bottom Proceed Button */}
            <div className="group-modal-bottom-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="secondary-button"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => handleNextStep()}
                style={{ padding: '10px 24px', fontSize: '13px', borderRadius: '8px' }}
              >
                Proceed to Add Members <ArrowRight size={15} />
              </button>
            </div>
          </div>
        ) : (
          /* ── STEP 2: ADD MEMBERS TO GROUP ────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '760px', margin: '0 auto' }}>
            
            {/* Header info banner */}
            <div className="group-modal-step2-header" style={{
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#1e40af', display: 'block' }}>
                  Enroll members into "{name || 'Untitled Group'}"
                </strong>
                <span style={{ fontSize: '11.5px', color: '#3b82f6', marginTop: '2px', display: 'block' }}>
                  Standard Fee: ₹{feeAmount || '0'} · {billingType} ({collectionDay})
                </span>
              </div>
              <div style={{
                background: '#ffffff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                alignSelf: 'flex-start'
              }}>
                {selectedMemberIds.length} Selected
              </div>
            </div>

            {/* Search and Selection Toolbar */}
            <div className="group-modal-step2-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 12px',
                flex: 1,
                width: '100%'
              }}>
                <Search size={15} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search members by name, phone or email..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', color: '#0f172a' }}
                />
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                style={{
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {selectedMemberIds.length === filteredMembers.length && filteredMembers.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Members Selection List */}
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              {filteredMembers.length === 0 ? (
                <div style={{ padding: '36px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No members found matching your search.
                </div>
              ) : (
                <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                  {filteredMembers.map((member) => {
                    const isSelected = selectedMemberIds.includes(member.id)
                    const isAlreadyEnrolled = (member.memberGroups || []).includes(name) || member.plan === name
                    const customAmt = memberCustomAmounts[member.id] ?? feeAmount

                    return (
                      <div
                        key={member.id}
                        onClick={() => toggleSelectMember(member.id)}
                        className="group-modal-member-row"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 18px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          background: isSelected ? '#f8fafc' : '#ffffff',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        {/* Member Identity */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Controlled by row click
                            style={{
                              width: 16,
                              height: 16,
                              accentColor: '#be123c',
                              cursor: 'pointer'
                            }}
                          />
                          <div className={`member-avatar ${member.color}`} style={{ width: 34, height: 34, fontSize: '11px', flexShrink: 0 }}>
                            {member.initials}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ fontSize: '13px', color: '#0f172a', display: 'block', wordBreak: 'break-word' }}>
                              {member.name}
                            </strong>
                            <span style={{ fontSize: '11px', color: '#64748b', wordBreak: 'break-word' }}>
                              {member.phone} {member.email ? `· ${member.email}` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Status / Custom Fee */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }} onClick={e => e.stopPropagation()}>
                          {isSelected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>Fee: ₹</span>
                              <input
                                type="number"
                                value={customAmt}
                                onChange={(e) => setMemberCustomAmounts(prev => ({ ...prev, [member.id]: e.target.value }))}
                                style={{
                                  width: '80px',
                                  border: '1px solid #cbd5e1',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#0f172a',
                                  outline: 'none'
                                }}
                              />
                            </div>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                              {isAlreadyEnrolled ? 'Currently Enrolled' : 'Not Enrolled'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="group-modal-bottom-actions" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '12px'
            }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setCurrentStep(1)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Back to Details
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleSaveAll}
                  style={{
                    padding: '10px 24px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    background: '#be123c'
                  }}
                >
                  {modal === 'add-group' ? `Create Group (${selectedMemberIds.length} members)` : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}


function AddMembersToGroupModal() {
  const { modal, setModal, selectedGroup, setSelectedGroup, members, setMembers, notify } = useStore()
  const [activeTab, setActiveTab] = useState<'list' | 'import' | 'manual'>('list')
  const [search, setSearch] = useState('')

  // State for member row configurations in list view
  interface MemberRowConfig {
    selected: boolean
    dueAmount: string
    collectSchedule: string
    startDate: string
  }

  const [rowConfigs, setRowConfigs] = useState<Record<number, MemberRowConfig>>({})

  // File import state
  const [importRows, setImportRows] = useState<Array<{ name: string; phone: string; email: string; dueAmount: string; collectSchedule: string; startDate: string }>>([])
  const [isImported, setIsImported] = useState(false)

  // Manual member creation form state (matching Image 2)
  const [manualName, setManualName] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [manualAltPhone, setManualAltPhone] = useState('')
  const [manualAdmissionNo, setManualAdmissionNo] = useState('')
  const [manualEmail, setManualEmail] = useState('')
  const [manualDob, setManualDob] = useState('')
  const [manualGuardianName, setManualGuardianName] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [manualRemarks, setManualRemarks] = useState('')

  const [manualDueAmount, setManualDueAmount] = useState('')
  const [manualCollectSchedule, setManualCollectSchedule] = useState('Monthly: 1st day of month')
  const [manualStartDate, setManualStartDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (modal === 'add-members-to-group' && selectedGroup) {
      const defaultAmount = selectedGroup.feeAmount ? selectedGroup.feeAmount.replace(/[^0-9]/g, '') : '1800'
      const defaultSchedule = selectedGroup.dueDate || 'Monthly: 1st day of month'
      const defaultStart = new Date().toISOString().split('T')[0]

      const initialConfigs: Record<number, MemberRowConfig> = {}
      members.forEach(m => {
        const existingPay = m.groupPayments?.[selectedGroup.name]
        initialConfigs[m.id] = {
          selected: false,
          dueAmount: existingPay?.amount ? existingPay.amount.replace(/[^0-9]/g, '') : defaultAmount,
          collectSchedule: existingPay?.due || existingPay?.collectSchedule || defaultSchedule,
          startDate: existingPay?.startDate || defaultStart
        }
      })

      setRowConfigs(initialConfigs)
      setSearch('')
      setActiveTab('list')

      setManualName('')
      setManualPhone('')
      setManualAltPhone('')
      setManualAdmissionNo('')
      setManualEmail('')
      setManualDob('')
      setManualGuardianName('')
      setManualAddress('')
      setManualRemarks('')

      setManualDueAmount(defaultAmount)
      setManualCollectSchedule(defaultSchedule)
      setManualStartDate(defaultStart)

      setImportRows([])
      setIsImported(false)
    }
  }, [modal, selectedGroup, members])

  if (modal !== 'add-members-to-group' || !selectedGroup) return null

  const closeModal = () => {
    setModal(null)
    setSelectedGroup(null)
  }

  const activeMembers = members.filter(m => !m.archived)
  const filteredMembers = activeMembers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const eligibleMembers = filteredMembers.filter(m => !((m.memberGroups || []).includes(selectedGroup.name) || m.plan === selectedGroup.name))
  const selectedCount = eligibleMembers.filter(m => rowConfigs[m.id]?.selected).length
  const isAllSelected = eligibleMembers.length > 0 && eligibleMembers.every(m => rowConfigs[m.id]?.selected)

  const toggleSelect = (id: number) => {
    setRowConfigs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id]?.selected
      }
    }))
  }

  const toggleSelectAll = () => {
    const target = !isAllSelected
    setRowConfigs(prev => {
      const updated = { ...prev }
      eligibleMembers.forEach(m => {
        if (updated[m.id]) {
          updated[m.id] = { ...updated[m.id], selected: target }
        }
      })
      return updated
    })
  }

  const updateRowConfig = (id: number, key: keyof MemberRowConfig, value: any) => {
    setRowConfigs(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value
      }
    }))
  }

  // Save List Tab
  const handleSaveList = () => {
    const groupName = selectedGroup.name
    let addedCount = 0

    const updatedMembers = members.map(m => {
      const config = rowConfigs[m.id]
      const isAlreadyInGroup = (m.memberGroups || []).includes(groupName) || m.plan === groupName

      if (config?.selected && !isAlreadyInGroup) {
        addedCount++
        const currentGroups = m.memberGroups || (m.plan ? [m.plan] : [])
        const newGroups = [...currentGroups, groupName]
        const formattedAmount = config.dueAmount
          ? (config.dueAmount.startsWith('₹') ? config.dueAmount : `₹${Number(config.dueAmount).toLocaleString('en-IN')}`)
          : selectedGroup.feeAmount

        const groupPayments = {
          ...(m.groupPayments || {}),
          [groupName]: {
            amount: formattedAmount,
            status: 'Pending' as const,
            due: config.collectSchedule,
            collectSchedule: config.collectSchedule,
            startDate: config.startDate
          }
        }

        return {
          ...m,
          memberGroups: newGroups,
          plan: m.plan || groupName,
          groupPayments,
          groupStatus: {
            ...(m.groupStatus || {}),
            [groupName]: 'Active' as const
          }
        }
      }
      return m
    })

    if (addedCount === 0) {
      notify('Please select at least one member to add to the group')
      return
    }

    setMembers(updatedMembers)
    notify(`Added ${addedCount} member(s) to group "${groupName}"`)
    closeModal()
  }

  // Handle Manual Add (Matching Image 2 Reference)
  const handleManualAddSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!manualName.trim() || !manualPhone.trim()) {
      notify('Member name and phone number are required')
      return
    }

    const groupName = selectedGroup.name
    const initials = manualName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    const formattedAmount = manualDueAmount
      ? (manualDueAmount.startsWith('₹') ? manualDueAmount : `₹${Number(manualDueAmount).toLocaleString('en-IN')}`)
      : selectedGroup.feeAmount

    const newMember: Member = {
      id: Date.now(),
      name: manualName.trim(),
      initials: initials || 'MB',
      phone: manualPhone.trim(),
      alternatePhone: manualAltPhone || '--',
      admissionNo: manualAdmissionNo || '--',
      email: manualEmail.trim() || `${manualName.trim().toLowerCase().replace(/\s+/g, '.')}@example.com`,
      dob: manualDob || '--',
      guardianName: manualGuardianName || '--',
      address: manualAddress || '--',
      remarks: manualRemarks.trim() || undefined,
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      color: ['peach', 'lavender', 'mint', 'sky'][Math.floor(Math.random() * 4)],
      memberGroups: [groupName],
      plan: groupName,
      groupPayments: {
        [groupName]: {
          amount: formattedAmount,
          status: 'Pending',
          due: manualCollectSchedule,
          collectSchedule: manualCollectSchedule,
          startDate: manualStartDate
        }
      },
      groupStatus: {
        [groupName]: 'Active'
      }
    }

    setMembers(prev => [...prev, newMember])
    notify(`Created member "${manualName}" and added to group "${groupName}"`)
    closeModal()
  }

  // Handle CSV Import Sample Load / Save
  const handleLoadSampleCSV = () => {
    const defaultAmount = selectedGroup.feeAmount ? selectedGroup.feeAmount.replace(/[^0-9]/g, '') : '1800'
    const defaultSchedule = selectedGroup.dueDate || 'Monthly: 1st day of month'
    const defaultStart = new Date().toISOString().split('T')[0]

    setImportRows([
      { name: 'Kavita Verma', phone: '+91 98321 65498', email: 'kavita.v@example.com', dueAmount: defaultAmount, collectSchedule: defaultSchedule, startDate: defaultStart },
      { name: 'Sameer Sen', phone: '+91 97123 45890', email: 'sameer.sen@example.com', dueAmount: defaultAmount, collectSchedule: 'Monthly: 5th day of month', startDate: defaultStart },
      { name: 'Pooja Hegde', phone: '+91 99001 12233', email: 'pooja.h@example.com', dueAmount: '2000', collectSchedule: 'Quarterly', startDate: defaultStart },
    ])
    setIsImported(true)
    notify('Loaded 3 sample members from CSV file')
  }

  const handleSaveImport = () => {
    if (importRows.length === 0) {
      notify('No rows to import')
      return
    }

    const groupName = selectedGroup.name
    const newMembersToCreate: Member[] = importRows.map((r, idx) => {
      const initials = r.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      const formattedAmount = r.dueAmount.startsWith('₹') ? r.dueAmount : `₹${Number(r.dueAmount).toLocaleString('en-IN')}`

      return {
        id: Date.now() + idx,
        name: r.name,
        initials,
        phone: r.phone,
        email: r.email,
        joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pending',
        color: ['peach', 'lavender', 'mint', 'sky'][idx % 4],
        memberGroups: [groupName],
        plan: groupName,
        groupPayments: {
          [groupName]: {
            amount: formattedAmount,
            status: 'Pending',
            due: r.collectSchedule,
            collectSchedule: r.collectSchedule,
            startDate: r.startDate
          }
        },
        groupStatus: {
          [groupName]: 'Active'
        }
      }
    })

    setMembers(prev => [...prev, ...newMembersToCreate])
    notify(`Successfully imported ${newMembersToCreate.length} member(s) into "${groupName}"`)
    closeModal()
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

  return (
    <Modal close={closeModal} style={{ width: 'min(980px, 96vw)', maxWidth: '980px', maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
      {/* Fixed Header bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span>Groups</span> › <span style={{ color: '#be123c' }}>{selectedGroup.name}</span> › <span>Add Members</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Add Members</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" className="secondary-button" onClick={closeModal}>
            Cancel
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={activeTab === 'list' ? handleSaveList : activeTab === 'manual' ? () => handleManualAddSubmit() : handleSaveImport}
            style={{ background: '#059669', borderColor: '#059669', boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)' }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close modal"
            style={{
              border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b',
              width: 34, height: 34, borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px'
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div style={{ padding: '24px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {/* Tab Buttons */}
        <div style={{ display: 'inline-flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 0, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
              background: activeTab === 'list' ? '#fff' : 'transparent',
              color: activeTab === 'list' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Add from members list
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 0, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
              background: activeTab === 'import' ? '#fff' : 'transparent',
              color: activeTab === 'import' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'import' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Import file
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 0, fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s ease',
              background: activeTab === 'manual' ? '#fff' : 'transparent',
              color: activeTab === 'manual' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'manual' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Add manually
          </button>
        </div>

        {/* TAB 1: ADD FROM MEMBERS LIST */}
        {activeTab === 'list' && (
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  Members <span style={{ color: '#64748b', fontWeight: 500 }}>{filteredMembers.length}</span>
                </span>

                <div className="search-box" style={{ margin: 0, width: 'min(320px, 100%)' }}>
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1',
                    background: '#fff', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer'
                  }}
                >
                  {isAllSelected ? 'Deselect All' : 'Select All'}
                </button>

                <span style={{
                  fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '12px',
                  background: selectedCount > 0 ? '#dcfce7' : '#f1f5f9',
                  color: selectedCount > 0 ? '#15803d' : '#64748b'
                }}>
                  Selected {selectedCount}
                </span>
              </div>
            </div>

            {/* Table Container */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              <div style={{ overflowX: 'auto', maxHeight: '380px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      <th style={{ padding: '12px 16px', width: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                            disabled={eligibleMembers.length === 0}
                            style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#059669' }}
                          />
                          <span>Name</span>
                        </div>
                      </th>
                      <th style={{ padding: '12px 16px', width: '150px' }}>Mobile No</th>
                      <th style={{ padding: '12px 16px', width: '140px' }}>Due Amount</th>
                      <th style={{ padding: '12px 16px', width: '230px' }}>When do you want to collect fees?</th>
                      <th style={{ padding: '12px 16px', width: '150px' }}>Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(m => {
                        const isEnrolled = (m.memberGroups || []).includes(selectedGroup.name) || m.plan === selectedGroup.name
                        const config = rowConfigs[m.id] || { selected: false, dueAmount: '1800', collectSchedule: 'Monthly: 1st day of month', startDate: '' }
                        const isSelected = config.selected

                        if (isEnrolled) {
                          return (
                            <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fafafa', color: '#94a3b8' }}>
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <input type="checkbox" disabled checked={false} style={{ width: '16px', height: '16px', opacity: 0.4 }} />
                                  <span style={{ fontWeight: 600, color: '#94a3b8' }}>{m.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#94a3b8' }}>{m.phone}</td>
                              <td colSpan={3} style={{ padding: '12px 16px', fontStyle: 'italic', color: '#94a3b8', fontSize: '12px' }}>
                                Already in group
                              </td>
                            </tr>
                          )
                        }

                        return (
                          <tr
                            key={m.id}
                            style={{
                              borderBottom: '1px solid #f1f5f9',
                              background: isSelected ? '#f0fdf4' : '#fff',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '10px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelect(m.id)}
                                  style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#059669' }}
                                />
                                <strong style={{ color: isSelected ? '#0f172a' : '#334155', fontWeight: 600 }}>
                                  {m.name}
                                </strong>
                              </div>
                            </td>

                            <td style={{ padding: '10px 16px', color: '#475569', fontWeight: 500 }}>
                              {m.phone}
                            </td>

                            <td style={{ padding: '10px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 8px', width: '110px' }}>
                                <span style={{ color: '#64748b', fontSize: '13px', marginRight: '4px', fontWeight: 600 }}>₹</span>
                                <input
                                  type="number"
                                  value={config.dueAmount}
                                  onChange={e => updateRowConfig(m.id, 'dueAmount', e.target.value)}
                                  placeholder="1800"
                                  style={{ border: 0, outline: 0, width: '100%', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}
                                />
                              </div>
                            </td>

                            <td style={{ padding: '10px 16px', minWidth: '190px' }}>
                              <CustomSelect
                                value={config.collectSchedule}
                                onChange={val => updateRowConfig(m.id, 'collectSchedule', val)}
                                width="100%"
                                options={[
                                  'Monthly: 1st day of month',
                                  'Monthly: 2nd day of month',
                                  'Monthly: 5th day of month',
                                  'Monthly: 10th day of month',
                                  'Monthly: 15th day of month',
                                  'Quarterly: 1st day of quarter',
                                  'Half-Yearly',
                                  'Yearly',
                                  'On Admission'
                                ]}
                              />
                            </td>

                            <td style={{ padding: '10px 16px', minWidth: '150px' }}>
                              <DatePicker
                                value={config.startDate}
                                onChange={val => updateRowConfig(m.id, 'startDate', val)}
                                width="100%"
                              />
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                          No members found matching "{search}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IMPORT FILE */}
        {activeTab === 'import' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '36px 20px',
              textAlign: 'center', background: '#f8fafc', cursor: 'pointer'
            }} onClick={handleLoadSampleCSV}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                <Upload size={22} />
              </div>
              <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>Upload CSV or Excel file</strong>
              <p style={{ margin: '4px 0 16px', fontSize: '12px', color: '#64748b' }}>
                Drag and drop your member roster CSV here, or click to browse files
              </p>
              <button type="button" className="secondary-button" style={{ fontSize: '12px', margin: '0 auto' }}>
                <FileSpreadsheet size={14} /> Simulate / Load Sample CSV
              </button>
            </div>

            {isImported && importRows.length > 0 && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Parsed CSV Rows Preview ({importRows.length} members ready to import)
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#fafafa', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Name</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Mobile</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Email</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Due Amount</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Fee Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '10px 16px' }}>{r.phone}</td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}>{r.email}</td>
                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>₹{r.dueAmount}</td>
                        <td style={{ padding: '10px 16px' }}>{r.collectSchedule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD MANUALLY (Matching Image 2 Reference) */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Section 1: Personal Details */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em',
                textTransform: 'uppercase', margin: '0 0 16px', paddingBottom: '10px',
                borderBottom: '1px solid #f1f5f9',
              }}>
                PERSONAL DETAILS
              </p>

              <div className="manual-member-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    Full Name <span style={{ color: '#be123c' }}>*</span>
                  </label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. John Doe"
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    Phone Number <span style={{ color: '#be123c' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    style={inputStyle}
                    placeholder="+91 98765 43210"
                    value={manualPhone}
                    onChange={e => setManualPhone(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Alternate Phone</label>
                  <input
                    type="tel"
                    style={inputStyle}
                    placeholder="+91 98765 43210"
                    value={manualAltPhone}
                    onChange={e => setManualAltPhone(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Admission No.</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. ADM-001"
                    value={manualAdmissionNo}
                    onChange={e => setManualAdmissionNo(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Email Address</label>
                  <input
                    type="email"
                    style={inputStyle}
                    placeholder="john@example.com"
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Date of Birth</label>
                  <DatePicker
                    value={manualDob}
                    onChange={setManualDob}
                    placeholder="YYYY-MM-DD"
                    width="100%"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Guardian Name</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="e.g. Robert Doe"
                    value={manualGuardianName}
                    onChange={e => setManualGuardianName(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Address</label>
                  <input
                    type="text"
                    style={inputStyle}
                    placeholder="City, State"
                    value={manualAddress}
                    onChange={e => setManualAddress(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Remarks / Notes</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.5' }}
                    placeholder="Any additional notes about this member..."
                    rows={3}
                    value={manualRemarks}
                    onChange={e => setManualRemarks(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Group Fee & Collection Settings */}
            <div>
              <p style={{
                fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em',
                textTransform: 'uppercase', margin: '0 0 16px', paddingBottom: '10px',
                borderBottom: '1px solid #f1f5f9',
              }}>
                GROUP FEE & COLLECTION SCHEDULE
              </p>

              <div className="manual-member-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    Due Amount (₹) <span style={{ color: '#be123c' }}>*</span>
                  </label>
                  <input
                    type="number"
                    style={inputStyle}
                    placeholder="1800"
                    value={manualDueAmount}
                    onChange={e => setManualDueAmount(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>When do you want to collect fees?</label>
                  <CustomSelect
                    value={manualCollectSchedule}
                    onChange={setManualCollectSchedule}
                    width="100%"
                    options={[
                      'Monthly: 1st day of month',
                      'Monthly: 2nd day of month',
                      'Monthly: 5th day of month',
                      'Monthly: 10th day of month',
                      'Quarterly: 1st day of quarter',
                      'Half-Yearly',
                      'Yearly',
                      'On Admission'
                    ]}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>Start Date</label>
                  <DatePicker
                    value={manualStartDate}
                    onChange={setManualStartDate}
                    width="100%"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
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

export function GroupModals() {
  return (
    <>
      <GroupFormModal />
      <AddMembersToGroupModal />
      <GroupDetailsModal />
    </>
  )
}
