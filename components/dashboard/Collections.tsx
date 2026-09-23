'use client'

import { useState, useMemo } from 'react'
import { Copy, Plus, Search, Filter, FileText, Download, CheckCircle2, Clock, AlertCircle, Receipt, Calendar, RefreshCw } from 'lucide-react'
import { useStore, Member, TransactionItem } from '@/store/useStore'
import { StatusBadge } from '@/components/ui/StatusBadge'

export default function Collections() {
  const { members, groups, setModal, setSelectedMember, setSelectedTransaction, notify } = useStore()
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All')
  const [groupFilter, setGroupFilter] = useState<string>('All Groups')
  const [searchQuery, setSearchQuery] = useState('')

  // Build transaction dataset for completed (Paid) payments only
  const paidTransactions: TransactionItem[] = useMemo(() => {
    const list: TransactionItem[] = []
    let txnIdCounter = 1001

    members.forEach(m => {
      const activeGroups = m.memberGroups || (m.plan ? [m.plan] : ['Standard monthly'])
      
      activeGroups.forEach((gName, idx) => {
        const payInfo = m.groupPayments?.[gName]
        const amount = payInfo?.amount || m.amount || '₹1,800'
        const status = (payInfo?.status || m.status) as 'Paid' | 'Pending' | 'Overdue'
        
        // Only completed (Paid) transactions generate collections & invoices
        if (status === 'Paid') {
          list.push({
            id: `${m.id}-${idx}`,
            txnNumber: `TXN-2024-${txnIdCounter++}`,
            memberName: m.name,
            memberPhone: m.phone,
            memberEmail: m.email,
            groupName: gName,
            amount,
            paymentMethod: 'Online UPI Link',
            status: 'Paid',
            date: '12 Sep 2024',
            time: '09:42 AM',
            remarks: m.remarks
          })
        }
      })
    })

    return list
  }, [members])

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    return paidTransactions.filter(t => {
      const matchesGroup = groupFilter === 'All Groups' || t.groupName === groupFilter
      const matchesSearch = t.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.txnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.groupName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesGroup && matchesSearch
    })
  }, [paidTransactions, groupFilter, searchQuery])

  // Summary Metrics
  const totalCollectedAmt = paidTransactions.reduce((sum, t) => sum + Number(t.amount.replace(/[^0-9]/g, '')), 0)
  const pendingMembersCount = members.filter(m => m.status !== 'Paid').length

  const openInvoice = (txn: TransactionItem) => {
    setSelectedTransaction(txn)
    setModal('invoice')
  }

  return (
    <>
      <div className="page-heading simple">
        <div>
          <p className="eyebrow">Payments and reconciliation</p>
          <h1>Collections & Invoices</h1>
          <p className="subheading">Track all system payment records, filter transactions, and generate official invoices.</p>
        </div>
        <button className="primary-button" onClick={() => setModal('new-payment')}>
          <Plus size={16} /> Record payment
        </button>
      </div>

      {/* Summary KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Collected</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800, color: '#059669' }}>₹{totalCollectedAmt.toLocaleString('en-IN')}</h3>
          <small style={{ color: '#64748b', fontSize: '11px' }}>{paidTransactions.length} completed receipts</small>
        </div>

        <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Completed Transactions</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>{paidTransactions.length}</h3>
          <small style={{ color: '#64748b', fontSize: '11px' }}>All verified paid entries</small>
        </div>

        <div style={{ padding: '18px 20px', borderRadius: '14px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Members Unpaid</p>
          <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: 800, color: '#d97706' }}>{pendingMembersCount}</h3>
          <small style={{ color: '#64748b', fontSize: '11px' }}>Pending payment settlement</small>
        </div>
      </div>
      
      <section className="panel collection-table" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Toolbar & Filter Controls */}
        <div className="collection-toolbar" style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>Completed Payments & Invoices</h3>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#e6f8ef', color: '#059669' }}>
              {filteredTransactions.length} Paid
            </span>
          </div>

          {/* Group & Search Inputs */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            
            {/* Group Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 12px' }}>
              <Filter size={14} color="#64748b" />
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}
              >
                <option value="All Groups">All Groups</option>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search member or txn #"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  outline: 'none',
                  width: '200px',
                  background: '#fff'
                }}
              />
            </div>

            <button className="secondary-button" style={{ padding: '7px 12px', fontSize: '12px' }} onClick={() => notify('CSV report exported successfully')}>
              <Copy size={14} /> Export CSV
            </button>
          </div>

        </div>
        
        {/* Transaction Table List */}
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No payment transactions match your selected filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTransactions.map((txn) => {
              const isPaid = txn.status === 'Paid'
              const isOverdue = txn.status === 'Overdue'

              return (
                <div
                  key={txn.id}
                  className="collection-txn-row"
                  onClick={() => openInvoice(txn)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    background: '#fff'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <div className="collection-txn-col collection-txn-member" style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '260px' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '10px',
                      background: isPaid ? '#e6f8ef' : isOverdue ? '#fef2f2' : '#fff7ed',
                      color: isPaid ? '#059669' : isOverdue ? '#dc2626' : '#d97706',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '12px', flexShrink: 0
                    }}>
                      <Receipt size={18} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: '#0f172a', fontWeight: 700 }}>{txn.memberName}</strong>
                      <small style={{ color: '#64748b', fontSize: '11px' }}>{txn.groupName}</small>
                    </div>
                  </div>

                  <div className="collection-txn-col" style={{ width: '150px' }}>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155' }}>{txn.txnNumber}</span>
                    <small style={{ color: '#94a3b8', fontSize: '11px' }}>{txn.date}</small>
                  </div>

                  <div className="collection-txn-col" style={{ width: '130px' }}>
                    <strong style={{ display: 'block', fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>{txn.amount}</strong>
                    <small style={{ color: '#64748b', fontSize: '11px' }}>{txn.paymentMethod}</small>
                  </div>

                  <div>
                    <StatusBadge status={txn.status} />
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="collection-txn-actions" style={{ display: 'flex', gap: '8px' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => openInvoice(txn)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #be123c',
                        background: '#fff',
                        color: '#be123c',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={13} /> View Invoice
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
