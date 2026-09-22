'use client'

import React from 'react'
import { Modal, ModalHead } from '@/components/ui/Modal'
import { useStore, TransactionItem } from '@/store/useStore'
import { FileText, Download, Share2, Printer, CheckCircle2, Clock, Hexagon, Calendar, CreditCard, User, ShieldCheck } from 'lucide-react'

export function InvoiceModal() {
  const { modal, setModal, selectedTransaction, setSelectedTransaction, notify } = useStore()

  if (modal !== 'invoice' || !selectedTransaction) return null

  const closeModal = () => {
    setModal(null)
    setSelectedTransaction(null)
  }

  const handlePrint = () => {
    window.print()
  }

  const txn = selectedTransaction

  return (
    <Modal close={closeModal}>
      <ModalHead
        title="Payment Receipt & Invoice"
        sub={`Invoice #${txn.txnNumber}`}
        close={closeModal}
      />
      
      <div style={{ padding: '24px 0 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Printable Invoice Container */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px 32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}>
          
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '2px dashed #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#be123c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Hexagon size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>Pingdues Fitness</h3>
                <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>GSTIN: 29ABCDE1234F1ZH • Gym & Fitness Center</p>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
                background: txn.status === 'Paid' ? '#e6f8ef' : '#fff7ed',
                color: txn.status === 'Paid' ? '#059669' : '#c2410c',
                display: 'inline-flex', alignItems: 'center', gap: '5px'
              }}>
                <CheckCircle2 size={13} /> {txn.status.toUpperCase()}
              </span>
              <p style={{ margin: '6px 0 0', fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>#{txn.txnNumber}</p>
            </div>
          </div>

          {/* Billed To / Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Billed Member</p>
              <h4 style={{ margin: '4px 0 2px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{txn.memberName}</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{txn.memberPhone}</p>
              {txn.memberEmail && <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{txn.memberEmail}</p>}
            </div>

            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Payment Details</p>
              <p style={{ margin: '4px 0 2px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Date: {txn.date} at {txn.time}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Method: {txn.paymentMethod}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div style={{ padding: '20px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                  <th style={{ paddingBottom: '10px', fontWeight: 600 }}>Description / Group</th>
                  <th style={{ paddingBottom: '10px', fontWeight: 600, textAlign: 'center' }}>Billing Cycle</th>
                  <th style={{ paddingBottom: '10px', fontWeight: 600, textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 0', fontWeight: 600, color: '#0f172a' }}>
                    {txn.groupName} Membership Fee
                  </td>
                  <td style={{ padding: '12px 0', textAlign: 'center', color: '#64748b' }}>Monthly</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>{txn.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Calculation */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '2px solid #0f172a' }}>
            <div style={{ width: '220px', textAlign: 'right' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>{txn.amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                <span>Tax (0% Exemption):</span>
                <span>₹0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#be123c', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                <span>Total Paid:</span>
                <span>{txn.amount}</span>
              </div>
            </div>
          </div>

          {/* Verification Stamp */}
          <div style={{ marginTop: '24px', padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={18} color="#059669" />
            <span style={{ fontSize: '11px', color: '#475569', fontWeight: 500 }}>
              Official computer-generated receipt from Pingdues. No signature required.
            </span>
          </div>

        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            className="secondary-button"
            onClick={() => notify('Receipt link copied to clipboard')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Share2 size={14} /> Share Link
          </button>

          <button
            className="secondary-button"
            onClick={handlePrint}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Printer size={14} /> Print / Save PDF
          </button>

          <button
            className="primary-button"
            onClick={closeModal}
            style={{ fontSize: '13px' }}
          >
            Done
          </button>
        </div>

      </div>
    </Modal>
  )
}
