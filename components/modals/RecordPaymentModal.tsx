'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalHead } from '@/components/ui/Modal'
import { useStore } from '@/store/useStore'
import { CreditCard, Banknote, QrCode, CheckCircle, User, Layers, IndianRupee, AlertTriangle } from 'lucide-react'
import { CustomSelect } from '@/components/ui/CustomSelect'

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
  const arrearsList = selectedMemberObj?.unpaidMonthsList || []
  const arrearsTotal = arrearsList.reduce((s, u) => s + Number(u.amount.replace(/[^0-9]/g, '')), 0)

  return (
    <Modal close={closeModal}>
      <ModalHead
        title="Record Manual Payment"
        sub="Log in-hand cash, direct bank transfer, or offline payment"
        close={closeModal}
      />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '24px 0 0' }}>
        
        {/* Multi-Month Arrears Notice */}
        {arrearsList.length >= 2 && (
          <div style={{
            background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '10px',
            padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: '10px'
          }}>
            <AlertTriangle size={18} color="#be123c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '13px', color: '#9f1239', display: 'block' }}>
                Multi-Month Overdue Arrears Detected ({arrearsList.length} Months)
              </strong>
              <span style={{ fontSize: '11.5px', color: '#be123c' }}>
                Unpaid billing cycles: {arrearsList.map(u => u.month).join(', ')}. Total Outstanding: ₹{arrearsTotal.toLocaleString('en-IN')}.
              </span>
            </div>
          </div>
        )}

        {/* Select Member */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={15} color="#be123c" /> Select Member <span style={{ color: '#be123c' }}>*</span>
          </label>
          <CustomSelect
            value={selectedMemberId ? String(selectedMemberId) : ''}
            onChange={(val) => setSelectedMemberId(val ? Number(val) : '')}
            placeholder="-- Select Gym Member --"
            width="100%"
            options={members.map(m => {
              const pendingGroups = (m.memberGroups || (m.plan ? [m.plan] : [])).filter(g => m.groupPayments?.[g]?.status !== 'Paid')
              const isUnpaid = pendingGroups.length > 0 || m.status !== 'Paid'
              const pendingGroupText = pendingGroups.length > 0 ? ` (${pendingGroups.join(', ')})` : ''
              const mArrears = m.unpaidMonthsList || []
              const arrearsTag = mArrears.length >= 2 ? ` · ⚠️ ${mArrears.length} Mos Overdue` : ''
              return {
                value: String(m.id),
                label: `${m.name} · ${m.phone} · ${isUnpaid ? `Unpaid ${m.amount || ''}${pendingGroupText}` : 'Settled'}${arrearsTag}`
              }
            })}
          />
        </div>

        {/* Select Group & Amount */}
        <div className="record-pay-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={15} color="#be123c" /> Select Group <span style={{ color: '#be123c' }}>*</span>
            </label>
            <CustomSelect
              value={selectedGroup}
              onChange={setSelectedGroup}
              placeholder="Select Group"
              disabled={selectedMemberId === ''}
              width="100%"
              options={memberGroupsList.map(g => {
                const gStatus = selectedMemberObj?.groupPayments?.[g]?.status || 'Pending'
                return {
                  value: g,
                  label: `${g} · ${gStatus === 'Paid' ? 'Settled' : 'Payment Due'}`
                }
              })}
            />
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
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

        </div>

        {/* Payment Method Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Payment Mode *</label>
          <div className="record-pay-modes" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            
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
        <div className="record-pay-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
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
