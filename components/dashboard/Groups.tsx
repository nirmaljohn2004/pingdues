'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Users, X, Check, Edit3, Trash2, Calendar, CreditCard, Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, UserPlus, Info, LayoutDashboard, Receipt, TrendingUp, DollarSign, PieChart as PieChartIcon } from 'lucide-react'
import { useStore, GroupDetails, Member } from '@/store/useStore'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function GroupsTab() {
  const { groups, groupDetailsList, members, setMembers, setModal, setSelectedGroup, deleteGroup, notify } = useStore()
  const [search, setSearch] = useState('')

  // Which group is currently expanded in full detail view
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  
  // Inner tabs for the expanded group view: 'overview' | 'members' | 'transactions'
  const [activeGroupTab, setActiveGroupTab] = useState<'overview' | 'members' | 'transactions'>('overview')

  // Staged members for adding to group
  const [staged, setStaged] = useState<number[]>([])

  // Filter groups
  const filteredGroups = useMemo(() => {
    return groupDetailsList.filter(g => 
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(search.toLowerCase()))
    )
  }, [groupDetailsList, search])

  const getGroupMembers = (groupName: string) =>
    members.filter(m => (m.memberGroups || []).includes(groupName))

  const getUnassignedMembers = (groupName: string) =>
    members.filter(m => !(m.memberGroups || []).includes(groupName))

  const toggleStage = (id: number) =>
    setStaged(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleAddToGroup = (groupName: string) => {
    if (staged.length === 0) return
    setMembers(prev =>
      prev.map(m =>
        staged.includes(m.id)
          ? {
              ...m,
              memberGroups: [...(m.memberGroups || []), groupName],
              groupPayments: {
                ...(m.groupPayments || {}),
                [groupName]: {
                  amount: groupDetailsList.find(g => g.name === groupName)?.feeAmount || '₹1,500',
                  status: 'Pending',
                  due: 'Due in 3 days'
                }
              }
            }
          : m
      )
    )
    notify(`${staged.length} member(s) added to ${groupName}`)
    setStaged([])
  }

  const handleRemoveFromGroup = (groupName: string, memberId: number) => {
    setMembers(prev =>
      prev.map(m =>
        m.id === memberId
          ? {
              ...m,
              memberGroups: (m.memberGroups || []).filter(g => g !== groupName),
              groupPayments: (() => {
                const copy = { ...(m.groupPayments || {}) }
                delete copy[groupName]
                return copy
              })()
            }
          : m
      )
    )
    notify('Member removed from group')
  }

  const handleDeleteGroupClick = (group: GroupDetails) => {
    if (window.confirm(`Are you sure you want to delete "${group.name}"? Members assigned to this group will no longer be linked to it.`)) {
      deleteGroup(group.id)
      if (expandedGroupId === group.id) setExpandedGroupId(null)
      notify(`Group "${group.name}" deleted`)
    }
  }

  const groupColors = ['#fff1f2', '#eff6ff', '#f0fdf4', '#fdf4ff', '#fff7ed', '#f0fdfa']
  const groupTextColors = ['#be123c', '#1d4ed8', '#15803d', '#7e22ce', '#c2410c', '#0f766e']

  // ── VIEW 2: DEDICATED GROUP DETAIL PAGE ─────────────────────────────────────
  if (expandedGroupId) {
    const group = groupDetailsList.find(g => g.id === expandedGroupId)
    
    if (group) {
      const groupMembers = getGroupMembers(group.name)
      const totalPaid = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Paid').length
      const totalPending = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Pending' || m.groupPayments?.[group.name]?.status === 'Overdue').length
      const unitFee = Number(group.feeAmount.replace(/[^0-9]/g, '')) || 0
      const currentCollected = totalPaid * unitFee
      const currentPending = totalPending * unitFee

      const trendData = [
        { month: 'May', revenue: Math.round(unitFee * Math.max(1, groupMembers.length - 1) * 0.8) },
        { month: 'Jun', revenue: Math.round(unitFee * Math.max(1, groupMembers.length) * 0.7) },
        { month: 'Jul', revenue: Math.round(unitFee * Math.max(1, groupMembers.length) * 0.85) },
        { month: 'Aug', revenue: Math.round(unitFee * Math.max(1, groupMembers.length) * 0.9) },
        { month: 'Sep', revenue: currentCollected },
      ]

      const breakdownData = [
        { category: 'Collected', amount: currentCollected, fill: '#059669' },
        { category: 'Pending', amount: currentPending, fill: '#f59e0b' }
      ]

      return (
        <>
          {/* Detail Page Header */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => setExpandedGroupId(null)}
              style={{
                background: 'none', border: 'none', color: '#be123c', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                padding: 0, marginBottom: '12px'
              }}
            >
              ← Back to All Groups
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f172a' }}>{group.name}</h1>
                  <span style={{
                    fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '12px',
                    background: group.billingType === 'Recurring' ? '#eff6ff' : '#fef3c7',
                    color: group.billingType === 'Recurring' ? '#1d4ed8' : '#b45309',
                  }}>
                    {group.billingType} {group.recursEvery ? `(${group.recursEvery})` : ''}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  {group.description || 'Group membership details & fee collection track.'}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="secondary-button"
                  onClick={() => { setSelectedGroup(group); setModal('edit-group') }}
                  style={{ fontSize: '13px', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={14} /> Edit Group
                </button>
                <button
                  className="primary-button"
                  onClick={() => { setSelectedGroup(group); setModal('add-members-to-group') }}
                  style={{ fontSize: '13px', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={15} /> Add Members
                </button>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="panel" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Fee Amount</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '22px', color: '#0f172a', fontWeight: 700 }}>{group.feeAmount}</h3>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>{group.billingType} schedule</small>
            </div>
            <div className="panel" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Active Enrolled</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '22px', color: '#059669', fontWeight: 700 }}>{groupMembers.length}</h3>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>Members paying this fee</small>
            </div>
            <div className="panel" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Collection Track</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '22px', color: '#0284c7', fontWeight: 700 }}>{totalPaid} / {groupMembers.length}</h3>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>{totalPending} pending collection</small>
            </div>
            <div className="panel" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Due Date Rule</span>
              <h3 style={{ margin: '4px 0 0', fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>{group.dueDate || 'Default'}</h3>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>Created {group.createdOn}</small>
            </div>
          </div>

          {/* Main Detail Content Panel */}
          <section className="panel" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Tabs Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 24px', background: '#f8fafc', gap: '28px' }}>
              <button
                onClick={() => setActiveGroupTab('overview')}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'overview' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'overview' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <LayoutDashboard size={16} /> Overview & Analytics
              </button>
              <button
                onClick={() => setActiveGroupTab('members')}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'members' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'members' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Users size={16} /> Enrolled Members ({groupMembers.length})
              </button>
              <button
                onClick={() => setActiveGroupTab('transactions')}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'transactions' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'transactions' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Receipt size={16} /> Group Payment Status
              </button>
            </div>

            <div style={{ padding: '28px 24px' }}>
              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {activeGroupTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                    {/* Trend Chart */}
                    <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <TrendingUp size={15} color="#be123c" /> Group Revenue Trend
                          </h4>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Monthly collection history for {group.name}</span>
                        </div>
                      </div>
                      <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id={`grad-${group.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#be123c" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#be123c" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={v => `₹${v/1000}k`} />
                            <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#be123c" strokeWidth={2.5} fillOpacity={1} fill={`url(#grad-${group.id})`} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Collection Breakdown */}
                    <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PieChartIcon size={15} color="#0284c7" /> Fee Collection Breakdown
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Collected vs Pending balance</span>
                      </div>
                      <div style={{ height: 140, marginTop: '10px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={breakdownData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="category" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                            <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']} contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={20} fill="#059669" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Collected Revenue:</span>
                        <strong style={{ color: '#059669' }}>₹{currentCollected.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Specs List */}
                  <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>Group Details & Configuration</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                      <div><span style={{ color: '#64748b' }}>Billing Cycle: </span><strong style={{ color: '#0f172a' }}>{group.billingType} {group.recursEvery ? `(${group.recursEvery})` : ''}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Start Date: </span><strong style={{ color: '#0f172a' }}>{group.startDate || '01 Jan 2024'}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Due Date Schedule: </span><strong style={{ color: '#0f172a' }}>{group.dueDate || 'Default'}</strong></div>
                      <div><span style={{ color: '#64748b' }}>Created On: </span><strong style={{ color: '#0f172a' }}>{group.createdOn}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ENROLLED MEMBERS */}
              {activeGroupTab === 'members' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>Enrolled Members ({groupMembers.length})</h4>
                      <small style={{ color: '#64748b', fontSize: '12px' }}>Members enrolled in {group.name} ({group.feeAmount}/mo)</small>
                    </div>
                    <button
                      className="primary-button"
                      onClick={() => { setSelectedGroup(group); setModal('add-members-to-group') }}
                      style={{ fontSize: '13px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <UserPlus size={15} /> Add Members
                    </button>
                  </div>

                  {groupMembers.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                      {groupMembers.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div className={`member-avatar ${m.color}`} style={{ width: 38, height: 38, fontSize: 13, flexShrink: 0 }}>{m.initials}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</strong>
                            <small style={{ color: '#64748b', fontSize: '12px', display: 'block' }}>{m.phone}</small>
                          </div>
                          <button
                            onClick={() => handleRemoveFromGroup(group.name, m.id)}
                            title="Remove from group"
                            style={{ border: '1px solid #fee2e2', background: '#fff', color: '#dc2626', cursor: 'pointer', padding: '7px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '48px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                      <p style={{ margin: '0 0 14px', fontSize: '14px', color: '#475569', fontWeight: 600 }}>No members currently enrolled in this group.</p>
                      <button
                        className="primary-button"
                        onClick={() => { setSelectedGroup(group); setModal('add-members-to-group') }}
                        style={{ fontSize: '13px', margin: '0 auto' }}
                      >
                        <UserPlus size={15} /> Select Members from Roster
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TRANSACTIONS & GROUP PAYMENT STATUS */}
              {activeGroupTab === 'transactions' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>Group Payment Track</h4>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Current fee collection status for members in {group.name}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                        {totalPaid} Paid
                      </span>
                      <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '20px', background: '#ffedd5', color: '#c2410c', fontWeight: 700 }}>
                        {totalPending} Pending
                      </span>
                    </div>
                  </div>

                  {groupMembers.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {groupMembers.map(m => {
                        const payInfo = m.groupPayments?.[group.name] || { amount: group.feeAmount, status: m.status, due: m.due }
                        const isPaid = payInfo.status === 'Paid'
                        return (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 12 }}>{m.initials}</div>
                              <div>
                                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{m.name}</strong>
                                <small style={{ color: '#64748b', fontSize: '12px' }}>{payInfo.due || 'Standard cycle'}</small>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{payInfo.amount}</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: isPaid ? '#e6f8ef' : '#fff7ed', color: isPaid ? '#059669' : '#c2410c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {isPaid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                                {payInfo.status}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>No members enrolled to show payment history.</p>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )
    }
  }

  // ── VIEW 1: ALL GROUPS OVERVIEW (LARGE TILES GRID) ──────────────────────────
  return (
    <>
      <div className="page-heading simple">
        <div>
          <p className="eyebrow">Group management</p>
          <h1>Groups & Memberships</h1>
          <p className="subheading">Configure membership groups, manage billing settings, and monitor member status per group.</p>
        </div>
        <button 
          className="primary-button" 
          onClick={() => {
            setSelectedGroup(null)
            setModal('add-group')
          }}
        >
          <Plus size={16} /> New Group
        </button>
      </div>

      <div className="directory-toolbar" style={{ marginBottom: '24px' }}>
        <div className="search-box">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by group name or description..."
            aria-label="Search groups"
          />
        </div>
      </div>

      {/* Large Group Tiles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredGroups.map((group, idx) => {
          const groupMembers = getGroupMembers(group.name)
          const bgColor = groupColors[idx % groupColors.length]
          const textColor = groupTextColors[idx % groupTextColors.length]

          const totalPaid = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Paid').length
          const totalPending = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Pending' || m.groupPayments?.[group.name]?.status === 'Overdue').length
          const isRecurring = group.billingType === 'Recurring'

          const unitFee = Number(group.feeAmount.replace(/[^0-9]/g, '')) || 0
          const monthlyEst = unitFee * groupMembers.length

          return (
            <div
              key={group.id}
              onClick={() => {
                setExpandedGroupId(group.id)
                setActiveGroupTab('overview')
              }}
              style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                gap: '16px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)'
                e.currentTarget.style.borderColor = '#be123c'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.03)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              {/* Tile Header: Avatar Badge, Name, Type, Actions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '14px',
                      background: bgColor, color: textColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '20px', flexShrink: 0,
                    }}>
                      {group.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>{group.name}</h3>
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px',
                        background: isRecurring ? '#eff6ff' : '#fef3c7',
                        color: isRecurring ? '#1d4ed8' : '#b45309',
                        display: 'inline-block', marginTop: '4px'
                      }}>
                        {group.billingType} {group.recursEvery ? `(${group.recursEvery})` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Edit / Delete actions */}
                  <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedGroup(group); setModal('edit-group') }}
                      title="Edit group details"
                      style={{
                        border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569',
                        width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#be123c'; e.currentTarget.style.color = '#be123c' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569' }}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroupClick(group)}
                      title="Delete group"
                      style={{
                        border: '1px solid #fee2e2', background: '#fff', color: '#dc2626',
                        width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {group.description && (
                  <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                    {group.description}
                  </p>
                )}

                {/* Summary Metrics Box inside Tile */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
                  background: '#f8fafc', padding: '14px', borderRadius: '12px',
                  border: '1px solid #f1f5f9', marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fee Amount</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#0f172a', fontWeight: 700, marginTop: '2px' }}>{group.feeAmount}</strong>
                    <small style={{ color: '#94a3b8', fontSize: '10px' }}>{group.dueDate || '1st of month'}</small>
                  </div>

                  <div>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enrolled Roster</span>
                    <strong style={{ display: 'block', fontSize: '18px', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      {groupMembers.length} member{groupMembers.length !== 1 ? 's' : ''}
                    </strong>
                    <small style={{ color: '#94a3b8', fontSize: '10px' }}>₹{monthlyEst.toLocaleString('en-IN')}/mo value</small>
                  </div>
                </div>

                {/* Payment Status Summary Bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Payment Status</span>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '11px', fontWeight: 700 }}>
                      <span style={{ color: '#059669' }}>{totalPaid} Paid</span>
                      <span style={{ color: '#d97706' }}>{totalPending} Pending</span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: groupMembers.length > 0 ? `${Math.round((totalPaid / groupMembers.length) * 100)}%` : '0%',
                      background: '#059669',
                      borderRadius: 3,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Member Avatars Preview */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '12px', color: '#be123c', fontWeight: 600 }}>
                    Click tile to view details →
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {groupMembers.slice(0, 4).map((m, i) => (
                      <div
                        key={m.id}
                        className={`member-avatar ${m.color}`}
                        style={{ width: 26, height: 26, fontSize: 10, marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff', zIndex: 4 - i }}
                        title={m.name}
                      >
                        {m.initials}
                      </div>
                    ))}
                    {groupMembers.length > 4 && (
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -6, border: '2px solid #fff' }}>
                        +{groupMembers.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div style={{ padding: '48px', textAlign: 'center', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '14px' }}>
          No groups found matching "{search}"
        </div>
      )}
    </>
  )
}
