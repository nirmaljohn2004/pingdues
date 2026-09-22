'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalHead } from '@/components/ui/Modal'
import { useStore } from '@/store/useStore'
import { CreditCard, Banknote, QrCode, CheckCircle, User, Layers, IndianRupee } from 'lucide-react'

export function RecordPaymentModal() {
  const { modal, setModal, selectedMember, setSelectedMember, members, groups, groupDetailsList, recordPayment, notify } = useStore()

  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'Cash in Hand' | 'Direct Bank Transfer' | 'UPI / GPay' | 'POS Card Swiped'>('Cash in Hand')
  const [remarks, setRemarks] = useState('')

  // Pre-select selectedMember if set in store when modal opens
  useEffect(() => {
    if (modal === 'new-payment' || modal === 'payment') {
      if (selectedMember) {
        setSelectedMemberId(selectedMember.id)
      }
    }
  }, [modal, selectedMember])

  // When selected member changes, set default group and fee amount
  useEffect(() => {
    if (selectedMemberId !== '') {
      const m = members.find(x => x.id === Number(selectedMemberId))
      if (m) {
        const availableGroups = m.memberGroups || (m.plan ? [m.plan] : groups)
        const defaultG = availableGroups[0] || groups[0]
        setSelectedGroup(defaultG)

        // Find fee amount for group
        const groupObj = groupDetailsList.find(g => g.name === defaultG)
        const defaultAmt = m.groupPayments?.[defaultG]?.amount || groupObj?.feeAmount || m.amount || '1800'
        setAmount(defaultAmt.replace(/[^0-9]/g, ''))
      }
    }
  }, [selectedMemberId, members, groups, groupDetailsList])

  // When selected group changes, update fee amount
  useEffect(() => {
    if (selectedMemberId !== '' && selectedGroup) {
      const m = members.find(x => x.id === Number(selectedMemberId))
      const groupObj = groupDetailsList.find(g => g.name === selectedGroup)
      const defaultAmt = m?.groupPayments?.[selectedGroup]?.amount || groupObj?.feeAmount || m?.amount || '1800'
      setAmount(defaultAmt.replace(/[^0-9]/g, ''))
    }
  }, [selectedGroup, selectedMemberId, members, groupDetailsList])

  if (modal !== 'new-payment' && modal !== 'payment') return null

  const closeModal = () => {
    setModal(null)
    setSelectedMember(null)
    setSelectedMemberId('')
    setSelectedGroup('')
    setAmount('')
    setPaymentMethod('Cash in Hand')
    setRemarks('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMemberId === '') {
      notify('Please select a member')
      return
    }
    if (!selectedGroup) {
      notify('Please select a group')
      return
    }
    if (!amount || Number(amount) <= 0) {
      notify('Please enter a valid payment amount')
      return
    }

    const member = members.find(m => m.id === Number(selectedMemberId))

    recordPayment(Number(selectedMemberId), selectedGroup, amount, paymentMethod, remarks)
    notify(`Recorded manual payment of ₹${Number(amount).toLocaleString('en-IN')} for ${member?.name}`)
    closeModal()
  }

  const selectedMemberObj = members.find(m => m.id === Number(selectedMemberId))
  const memberGroupsList = selectedMemberObj?.memberGroups || (selectedMemberObj?.plan ? [selectedMemberObj.plan] : groups)

  return (
    <Modal close={closeModal}>
      <ModalHead
        title="Record Manual Payment"
        sub="Log in-hand cash, direct bank transfer, or offline payment"
        close={closeModal}
      />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '24px 0 0' }}>
        
        {/* Select Member */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={15} color="#be123c" /> Select Member <span style={{ color: '#be123c' }}>*</span>
          </label>
          <select
            className="form-input"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value ? Number(e.target.value) : '')}
            required
            style={{
              padding: '11px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0f172a',
              background: '#fff',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Select Gym Member --</option>
            {members.map(m => {
              const pendingGroups = (m.memberGroups || (m.plan ? [m.plan] : [])).filter(g => m.groupPayments?.[g]?.status !== 'Paid')
              const isUnpaid = pendingGroups.length > 0 || m.status !== 'Paid'
              const pendingGroupText = pendingGroups.length > 0 ? ` (${pendingGroups.join(', ')})` : ''
              
              return (
                <option key={m.id} value={m.id}>
                  {m.name} • {m.phone} {isUnpaid ? `⚡ UNPAID ${m.amount || ''}${pendingGroupText}` : '✓ Fully Paid'}
                </option>
              )
            })}
          </select>
        </div>

        {/* Select Group & Amount */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} color="#be123c" /> Select Group <span style={{ color: '#be123c' }}>*</span>
            </label>
            <select
              className="form-input"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
              disabled={selectedMemberId === ''}
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0f172a',
                background: selectedMemberId === '' ? '#f8fafc' : '#fff',
                outline: 'none'
              }}
            >
              {memberGroupsList.map(g => {
                const gStatus = selectedMemberObj?.groupPayments?.[g]?.status || 'Pending'
                return (
                  <option key={g} value={g}>
                    {g} ({gStatus === 'Paid' ? '✓ Paid' : '⚡ Due'})
                  </option>
                )
              })}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IndianRupee size={15} color="#be123c" /> Amount Paid (₹) <span style={{ color: '#be123c' }}>*</span>
            </label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 1800"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0f172a',
                outline: 'none'
              }}
            />
          </div>

        </div>

        {/* Payment Method Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Payment Mode *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('Cash in Hand')}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: paymentMethod === 'Cash in Hand' ? '2px solid #059669' : '1px solid #e2e8f0',
                background: paymentMethod === 'Cash in Hand' ? '#e6f8ef' : '#f8fafc',
                color: paymentMethod === 'Cash in Hand' ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Banknote size={17} /> Cash in Hand
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Direct Bank Transfer')}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: paymentMethod === 'Direct Bank Transfer' ? '2px solid #059669' : '1px solid #e2e8f0',
                background: paymentMethod === 'Direct Bank Transfer' ? '#e6f8ef' : '#f8fafc',
                color: paymentMethod === 'Direct Bank Transfer' ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <CreditCard size={17} /> Bank Transfer
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('UPI / GPay')}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: paymentMethod === 'UPI / GPay' ? '2px solid #059669' : '1px solid #e2e8f0',
                background: paymentMethod === 'UPI / GPay' ? '#e6f8ef' : '#f8fafc',
                color: paymentMethod === 'UPI / GPay' ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <QrCode size={17} /> Direct UPI / GPay
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('POS Card Swiped')}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: paymentMethod === 'POS Card Swiped' ? '2px solid #059669' : '1px solid #e2e8f0',
                background: paymentMethod === 'POS Card Swiped' ? '#e6f8ef' : '#f8fafc',
                color: paymentMethod === 'POS Card Swiped' ? '#059669' : '#475569',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <CreditCard size={17} /> Card Swiped
            </button>

          </div>
        </div>

        {/* Remarks / Reference Note */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Remarks & Transaction Note</label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="e.g. Received cash at front desk from member"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              color: '#0f172a',
              outline: 'none',
              resize: 'none'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            className="secondary-button"
            onClick={closeModal}
            style={{ padding: '10px 18px', fontSize: '13px' }}
          >
            Cancel
          </button>
          <button type="submit" className="primary-button" style={{ padding: '10px 20px', fontSize: '13px' }}>
            <CheckCircle size={15} /> Confirm & Generate Invoice
          </button>
        </div>

      </form>
    </Modal>
  )
}
