'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Users, X, Check, Edit3, Trash2, Calendar, CreditCard, Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, UserPlus, Info, LayoutDashboard, Receipt, TrendingUp, DollarSign, PieChart as PieChartIcon, Bell } from 'lucide-react'
import { useStore, GroupDetails, Member, GroupReminder } from '@/store/useStore'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CustomSelect } from '@/components/ui/CustomSelect'

export default function GroupsTab() {
  const { groups, groupDetailsList, members, setMembers, setModal, setSelectedGroup, deleteGroup, toggleMemberGroupStatus, addOrUpdateGroupReminder, deleteGroupReminder, toggleGroupReminder, triggerGroupReminderNow, notify } = useStore()
  const [search, setSearch] = useState('')

  // Which group is currently expanded in full detail view
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  
  // Inner tabs for the expanded group view: 'overview' | 'members' | 'transactions' | 'reminders'
  const [activeGroupTab, setActiveGroupTab] = useState<'overview' | 'members' | 'transactions' | 'reminders'>('overview')

  // Selected member for detail popover in Enrolled Members tab
  const [activeMemberDetailPopover, setActiveMemberDetailPopover] = useState<Member | null>(null)

  // Staged members for adding to group
  const [staged, setStaged] = useState<number[]>([])

  // Inner sub-tab filter for Transactions: 'Recent' | 'Paid' | 'Pending'
  const [txnFilter, setTxnFilter] = useState<'Recent' | 'Paid' | 'Pending'>('Recent')
  const [txnSearch, setTxnSearch] = useState('')

  // Group Reminder Modal state
  const [reminderModalOpen, setReminderModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<GroupReminder | null>(null)
  const [remTitle, setRemTitle] = useState('')
  const [remDay, setRemDay] = useState(1)
  const [remTime, setRemTime] = useState('09:00 AM')
  const [remChannel, setRemChannel] = useState<'WhatsApp' | 'SMS' | 'All'>('WhatsApp')

  // Warning Confirmation Modal for Send Now
  const [confirmSendReminder, setConfirmSendReminder] = useState<{
    groupId: string
    groupName: string
    stage: 1 | 2 | 3
    stageLabel: string
    title: string
    dayOfMonth: number
    time: string
    channel: string
    unpaidCount: number
    existingRemId?: string
  } | null>(null)

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

            <div className="group-detail-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {group.groupImage && (
                    <img
                      src={group.groupImage}
                      alt={group.name}
                      style={{
                        width: 42, height: 42, borderRadius: '12px',
                        objectFit: 'cover', flexShrink: 0,
                        border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                      }}
                    />
                  )}
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
              </div>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="group-metric-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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
            <div className="group-detail-tabs" style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 24px', background: '#f8fafc', gap: '28px' }}>
              <button
                onClick={() => setActiveGroupTab('overview')}
                className={activeGroupTab === 'overview' ? 'active' : ''}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'overview' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'overview' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <LayoutDashboard size={16} />
                <span className="tab-label-full">Overview & Analytics</span>
                <span className="tab-label-mobile">Analytics</span>
              </button>
              <button
                onClick={() => setActiveGroupTab('members')}
                className={activeGroupTab === 'members' ? 'active' : ''}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'members' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'members' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Users size={16} />
                <span className="tab-label-full">Enrolled Members ({groupMembers.length})</span>
                <span className="tab-label-mobile">Members</span>
              </button>
              <button
                onClick={() => setActiveGroupTab('transactions')}
                className={activeGroupTab === 'transactions' ? 'active' : ''}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'transactions' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'transactions' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Receipt size={16} />
                <span className="tab-label-full">Group Payment Status</span>
                <span className="tab-label-mobile">Payment</span>
              </button>
              <button
                onClick={() => setActiveGroupTab('reminders')}
                className={activeGroupTab === 'reminders' ? 'active' : ''}
                style={{
                  padding: '16px 0', border: 0, background: 'transparent', fontSize: '14px', fontWeight: 600,
                  color: activeGroupTab === 'reminders' ? '#be123c' : '#64748b',
                  borderBottom: activeGroupTab === 'reminders' ? '2.5px solid #be123c' : '2.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Bell size={16} />
                <span className="tab-label-full">Scheduled Reminders ({(group.reminders || []).length}/3)</span>
                <span className="tab-label-mobile">Reminders</span>
              </button>
            </div>

            <div className="group-detail-tab-content" style={{ padding: '28px 24px' }}>
              {/* TAB 1: OVERVIEW & ANALYTICS */}
              {activeGroupTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div className="group-overview-charts" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
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
                          <AreaChart accessibilityLayer={false} data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px', fontSize: '14px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <PieChartIcon size={15} color="#0284c7" /> Fee Collection Breakdown
                        </h4>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Collected vs Pending balance</span>
                      </div>

                      {/* Visual Progress Bar & Metrics */}
                      {(() => {
                        const total = (currentCollected + currentPending) || 1
                        const collectPct = Math.round((currentCollected / total) * 100)
                        return (
                          <div>
                            {/* Two-tone Progress Bar */}
                            <div style={{ height: 10, borderRadius: '6px', background: '#f1f5f9', overflow: 'hidden', display: 'flex', marginBottom: '14px' }}>
                              <div style={{ width: `${collectPct}%`, background: '#059669', transition: 'width 0.4s ease' }} title={`Collected: ₹${currentCollected}`} />
                              <div style={{ width: `${100 - collectPct}%`, background: '#f59e0b', transition: 'width 0.4s ease' }} title={`Pending: ₹${currentPending}`} />
                            </div>

                            {/* Summary Rows */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', background: '#f0fdf4' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '2px', background: '#059669' }} />
                                  <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Collected</span>
                                </div>
                                <strong style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>₹{currentCollected.toLocaleString('en-IN')}</strong>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderRadius: '8px', background: '#fffbeb' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: 8, height: 8, borderRadius: '2px', background: '#f59e0b' }} />
                                  <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>Pending</span>
                                </div>
                                <strong style={{ fontSize: '13px', color: '#d97706', fontWeight: 700 }}>₹{currentPending.toLocaleString('en-IN')}</strong>
                              </div>
                            </div>
                          </div>
                        )
                      })()}

                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Collection Rate:</span>
                        <strong style={{ color: currentCollected > 0 ? '#059669' : '#64748b' }}>
                          {Math.round((currentCollected / ((currentCollected + currentPending) || 1)) * 100)}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Specs List */}
                  <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>Group Details & Configuration</h4>
                    <div className="group-specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Billing Cycle</span>
                        <strong style={{ color: '#0f172a', fontSize: '13px' }}>{group.billingType} {group.recursEvery ? `(${group.recursEvery})` : ''}</strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Start Date</span>
                        <strong style={{ color: '#0f172a', fontSize: '13px' }}>{group.startDate || '01 Jan 2024'}</strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Due Date Schedule</span>
                        <strong style={{ color: '#0f172a', fontSize: '13px' }}>{group.dueDate || 'Default'}</strong>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Created On</span>
                        <strong style={{ color: '#0f172a', fontSize: '13px' }}>{group.createdOn}</strong>
                      </div>
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
                      <small style={{ color: '#64748b', fontSize: '12px' }}>Click any member to inspect details, manage Active/Gap status, or adjust settings.</small>
                    </div>
                    <button
                      className="secondary-button"
                      onClick={() => { setSelectedGroup(group); setModal('add-members-to-group') }}
                      style={{ fontSize: '13px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <UserPlus size={14} /> + Add Members
                    </button>
                  </div>

                  {groupMembers.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {groupMembers.map(m => {
                        const status = m.groupStatus?.[group.name] || 'Active'
                        const isGap = status === 'On Gap'
                        const payInfo = m.groupPayments?.[group.name] || { amount: group.feeAmount, status: m.status }
                        const isSelected = activeMemberDetailPopover?.id === m.id

                        return (
                          <div
                            key={m.id}
                            onClick={() => setActiveMemberDetailPopover(m)}
                            className="group-member-row-card"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '14px 18px', background: isSelected ? '#fff1f2' : '#ffffff',
                              borderRadius: '12px', border: isSelected ? '1.5px solid #be123c' : '1px solid #e2e8f0',
                              cursor: 'pointer', transition: 'all 0.15s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                            }}
                          >
                            <div className="group-member-row-info" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div className={`member-avatar ${m.color}`} style={{ width: 40, height: 40, fontSize: 13, flexShrink: 0 }}>
                                {m.initials}
                              </div>
                              <div>
                                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>
                                  {m.name}
                                </strong>
                                <small style={{ color: '#64748b', fontSize: '12px' }}>
                                  {m.phone} • Joined {m.joined}
                                </small>
                              </div>
                            </div>

                            <div className="group-member-row-badges" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {/* Active / On Gap Status Badge */}
                              <span style={{
                                fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
                                background: isGap ? '#fff7ed' : '#e6f8ef',
                                color: isGap ? '#c2410c' : '#059669',
                                display: 'flex', alignItems: 'center', gap: '5px'
                              }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isGap ? '#f97316' : '#10b981' }} />
                                {status}
                              </span>

                              {/* Fee payment badge */}
                              <span style={{
                                fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '6px',
                                background: '#f1f5f9', color: '#475569'
                              }}>
                                {payInfo.status || 'Pending'}
                              </span>

                              <span style={{ fontSize: '12px', color: '#be123c', fontWeight: 600 }}>
                                Details →
                              </span>
                            </div>
                          </div>
                        )
                      })}
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Search Bar matching reference image */}
                  <div style={{ position: 'relative', width: 'min(360px, 100%)' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Search"
                      value={txnSearch}
                      onChange={e => setTxnSearch(e.target.value)}
                      style={{
                        width: '100%', padding: '9px 14px 9px 38px', borderRadius: '10px',
                        border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', background: '#fff'
                      }}
                    />
                  </div>

                  {/* Segmented Filter Pills matching reference UI */}
                  <div style={{
                    display: 'inline-flex', background: '#f1f5f9', padding: '4px',
                    borderRadius: '12px', gap: '4px', alignSelf: 'flex-start'
                  }}>
                    {(['Recent', 'Paid', 'Pending'] as const).map(tab => {
                      const isActive = txnFilter === tab
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setTxnFilter(tab)}
                          style={{
                            padding: '8px 20px', borderRadius: '8px', border: 0, fontSize: '13px',
                            fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
                            background: isActive ? '#ffffff' : 'transparent',
                            color: isActive ? '#059669' : '#64748b',
                            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                          }}
                        >
                          {tab}
                        </button>
                      )
                    })}
                  </div>

                  {/* Filter Content Area */}
                  {(() => {
                    const query = txnSearch.toLowerCase().trim()

                    // Paid members
                    const paidMembers = groupMembers.filter(m => {
                      const s = m.groupPayments?.[group.name]?.status || m.status
                      const matches = m.name.toLowerCase().includes(query) || m.phone.includes(query)
                      return s === 'Paid' && matches
                    })

                    // Pending / Overdue members
                    const pendingMembers = groupMembers.filter(m => {
                      const s = m.groupPayments?.[group.name]?.status || m.status
                      const matches = m.name.toLowerCase().includes(query) || m.phone.includes(query)
                      return s !== 'Paid' && matches
                    })

                    // Recent transaction receipts list
                    const allPaid = groupMembers.filter(m => (m.groupPayments?.[group.name]?.status || m.status) === 'Paid')
                    const recentTxns = allPaid.map((m, idx) => ({
                      id: `rec-${m.id}`,
                      memberName: m.name,
                      initials: m.initials,
                      color: m.color,
                      amount: m.groupPayments?.[group.name]?.amount || group.feeAmount,
                      date: idx === 0 ? 'Today, 09:42 AM' : idx === 1 ? 'Yesterday, 04:15 PM' : '18 Sep 2026',
                      method: idx % 2 === 0 ? 'UPI / Online Link' : 'Cash Receipt',
                      txnId: `TXN-${88241 + idx * 17}`,
                      status: 'Completed'
                    })).filter(t => t.memberName.toLowerCase().includes(query) || t.txnId.toLowerCase().includes(query))

                    // Partially Paid members
                    const partiallyPaidMembers = groupMembers.filter(m => {
                      const pay = m.groupPayments?.[group.name]
                      const matches = m.name.toLowerCase().includes(query)
                      return (pay as any)?.isPartial || matches
                    })

                    return (
                      <div style={{ marginTop: '8px' }}>
                        {/* 1. RECENT FILTER */}
                        {txnFilter === 'Recent' && (
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <h5 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                                Recent Transactions ({recentTxns.length})
                              </h5>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>Latest collection history</span>
                            </div>

                            {recentTxns.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {recentTxns.map(rec => (
                                  <div key={rec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div className={`member-avatar ${rec.color}`} style={{ width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>{rec.initials}</div>
                                      <div>
                                        <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{rec.memberName}</strong>
                                        <small style={{ color: '#64748b', fontSize: '11px' }}>{rec.method} • Ref: {rec.txnId}</small>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <span style={{ fontWeight: 700, fontSize: '14px', color: '#059669', display: 'block' }}>+{rec.amount}</span>
                                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{rec.date}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>No recent transaction activity found.</p>
                            )}
                          </div>
                        )}

                        {/* 2. PAID FILTER */}
                        {txnFilter === 'Paid' && (
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <h5 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                                Paid Members ({paidMembers.length})
                              </h5>
                              <span style={{ fontSize: '11px', color: '#059669', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                Up to date
                              </span>
                            </div>

                            {paidMembers.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {paidMembers.map(m => {
                                  const payInfo = m.groupPayments?.[group.name] || { amount: group.feeAmount, status: 'Paid', due: m.due }
                                  return (
                                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>{m.initials}</div>
                                        <div>
                                          <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{m.name}</strong>
                                          <small style={{ color: '#64748b', fontSize: '11px' }}>{payInfo.due || 'Paid via Online Link'}</small>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{payInfo.amount}</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                          <CheckCircle2 size={12} /> Paid
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>No paid members matching search criteria.</p>
                            )}
                          </div>
                        )}

                        {/* 3. PENDING FILTER */}
                        {txnFilter === 'Pending' && (
                          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <h5 style={{ margin: 0, fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                                Pending Payments ({pendingMembers.length})
                              </h5>
                              <span style={{ fontSize: '11px', color: '#c2410c', background: '#fff7ed', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                Action Required
                              </span>
                            </div>

                            {pendingMembers.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {pendingMembers.map(m => {
                                  const payInfo = m.groupPayments?.[group.name] || { amount: group.feeAmount, status: m.status, due: m.due }
                                  const isOverdue = payInfo.status === 'Overdue'
                                  return (
                                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: isOverdue ? '#fff1f2' : '#fffbeb', border: isOverdue ? '1px solid #fecdd3' : '1px solid #fef3c7' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>{m.initials}</div>
                                        <div>
                                          <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>{m.name}</strong>
                                          <small style={{ color: isOverdue ? '#e11d48' : '#b45309', fontSize: '11px', fontWeight: 600 }}>{payInfo.due || 'Due soon'}</small>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{payInfo.amount}</span>
                                        <span style={{
                                          fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px',
                                          background: isOverdue ? '#fee2e2' : '#fff7ed',
                                          color: isOverdue ? '#dc2626' : '#c2410c',
                                          display: 'flex', alignItems: 'center', gap: '4px'
                                        }}>
                                          <AlertCircle size={12} /> {payInfo.status}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '12px 0' }}>All members have paid their fees!</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* TAB 4: SCHEDULED REMINDERS (3-STAGE SEQUENCE) */}
              {activeGroupTab === 'reminders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Clean Minimal Header */}
                  <div className="group-reminders-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="group-reminders-title-row" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>Fee Reminders (3 Stages)</h4>
                        {(() => {
                          const quotaUsed = (group.reminders || []).filter(r => r.quotaConsumed).length
                          return (
                            <span style={{
                              fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                              background: quotaUsed > 0 ? '#f1f5f9' : '#fff7ed',
                              color: quotaUsed > 0 ? '#475569' : '#c2410c',
                              border: `1px solid ${quotaUsed > 0 ? '#e2e8f0' : '#ffedd5'}`
                            }}>
                              {quotaUsed}/3 sent
                            </span>
                          )
                        })()}
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                        Auto-reminds unpaid members in {group.name}.
                      </p>
                    </div>

                    {(() => {
                      const unpaidCount = groupMembers.filter(m => (m.groupPayments?.[group.name]?.status || m.status) !== 'Paid').length
                      return (
                        <span className="group-reminders-unpaid-badge" style={{
                          fontSize: '12px', padding: '5px 12px', borderRadius: '20px',
                          background: unpaidCount > 0 ? '#fff7ed' : '#f0fdf4',
                          color: unpaidCount > 0 ? '#c2410c' : '#15803d',
                          fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          <AlertCircle size={13} /> {unpaidCount} Pending
                        </span>
                      )
                    })()}
                  </div>

                  {/* 3 FIXED STAGE CARDS */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { stage: 1 as const, stageLabel: '1st Stage', defaultTitle: '1st Notice', badgeBg: '#f8fafc', badgeCol: '#334155', defaultDay: 1, defaultTime: '09:00 AM', desc: 'Initial due notice sent on due date.' },
                      { stage: 2 as const, stageLabel: '2nd Stage', defaultTitle: '2nd Follow-up', badgeBg: '#f8fafc', badgeCol: '#334155', defaultDay: 5, defaultTime: '10:00 AM', desc: 'Mid-cycle follow-up for unpaid dues.' },
                      { stage: 3 as const, stageLabel: 'Final Stage', defaultTitle: 'Final Notice', badgeBg: '#f8fafc', badgeCol: '#334155', defaultDay: 10, defaultTime: '06:00 PM', desc: 'Final warning before fee escalation.' }
                    ].map(stg => {
                      const existingRem = (group.reminders || []).find(r => r.stage === stg.stage || (group.reminders || []).indexOf(r) === stg.stage - 1)
                      const isEnabled = existingRem ? existingRem.enabled : true
                      const dayStr = existingRem ? existingRem.dayOfMonth : stg.defaultDay
                      const timeStr = existingRem ? existingRem.time : stg.defaultTime
                      const channelStr = existingRem ? existingRem.channel : 'WhatsApp'
                      const titleStr = existingRem ? existingRem.title : stg.defaultTitle
                      const isQuotaUsed = existingRem?.quotaConsumed ?? false

                      const unpaidCount = groupMembers.filter(m => (m.groupPayments?.[group.name]?.status || m.status) !== 'Paid').length

                      return (
                        <div
                          key={stg.stage}
                          className="group-reminder-stage-card"
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px 20px', background: '#ffffff',
                            borderRadius: '12px', border: '1px solid #e2e8f0',
                            transition: 'all 0.15s ease', opacity: isEnabled ? 1 : 0.6
                          }}
                        >
                          {/* Card Left: Bell icon, Title & Details */}
                          <div className="group-reminder-stage-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: '10px',
                              background: isQuotaUsed ? '#f1f5f9' : '#f8fafc',
                              color: isQuotaUsed ? '#94a3b8' : '#475569',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, fontWeight: 700, fontSize: '11px', border: '1px solid #e2e8f0'
                            }}>
                              <Bell size={15} />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="group-reminder-stage-title-wrap" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 600 }}>{titleStr}</strong>
                                {isQuotaUsed ? (
                                  <span style={{
                                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
                                    background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0'
                                  }}>
                                    Sent ({existingRem.lastSentAt || 'Today'})
                                  </span>
                                ) : (
                                  <span style={{
                                    fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px',
                                    background: '#eff6ff', color: '#2563eb'
                                  }}>
                                    Scheduled
                                  </span>
                                )}
                              </div>

                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                                Day {dayStr} at {timeStr} • {channelStr}
                              </div>
                            </div>
                          </div>

                          {/* Card Right: Toggle Switch & Buttons */}
                          <div className="group-reminder-stage-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Toggle Switch */}
                            <button
                              type="button"
                              onClick={() => {
                                const remId = existingRem ? existingRem.id : `rem-stage-${stg.stage}`
                                if (!existingRem) {
                                  addOrUpdateGroupReminder(group.id, {
                                    id: remId, stage: stg.stage, title: stg.defaultTitle,
                                    dayOfMonth: stg.defaultDay, time: stg.defaultTime,
                                    channel: 'WhatsApp', enabled: false
                                  })
                                } else {
                                  toggleGroupReminder(group.id, remId)
                                }
                                notify(isEnabled ? `Disabled ${stg.stageLabel}` : `Enabled ${stg.stageLabel}`)
                              }}
                              className="group-reminder-toggle-btn"
                              style={{
                                width: '38px', height: '22px', borderRadius: '11px',
                                background: isEnabled ? '#be123c' : '#cbd5e1',
                                position: 'relative', border: 'none', cursor: 'pointer',
                                transition: 'background-color 0.2s ease', flexShrink: 0
                              }}
                              aria-label="Toggle Stage"
                            >
                              <span style={{
                                width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                                position: 'absolute', top: '3px', left: isEnabled ? '19px' : '3px',
                                transition: 'left 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                              }} />
                            </button>
                            <div className="group-reminder-stage-buttons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Send Now Button */}
                              {!isQuotaUsed && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (unpaidCount === 0) {
                                      notify('All members have paid! No unpaid members to remind.')
                                      return
                                    }
                                    setConfirmSendReminder({
                                      groupId: group.id,
                                      groupName: group.name,
                                      stage: stg.stage,
                                      stageLabel: stg.stageLabel,
                                      title: titleStr,
                                      dayOfMonth: dayStr,
                                      time: timeStr,
                                      channel: channelStr,
                                      unpaidCount,
                                      existingRemId: existingRem?.id
                                    })
                                  }}
                                  style={{
                                    background: '#0f172a', border: 'none', color: '#ffffff',
                                    padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                    cursor: unpaidCount > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '5px'
                                  }}
                                  title="Send immediate reminder to unpaid members"
                                >
                                  <Clock size={13} /> Send Now ({unpaidCount})
                                </button>
                              )}

                              {/* Edit Settings Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const remToEdit: GroupReminder = existingRem || {
                                    id: `rem-stage-${stg.stage}`,
                                    stage: stg.stage,
                                    title: stg.defaultTitle,
                                    dayOfMonth: stg.defaultDay,
                                    time: stg.defaultTime,
                                    channel: 'WhatsApp',
                                    enabled: true,
                                    quotaConsumed: isQuotaUsed,
                                    lastSentAt: existingRem?.lastSentAt
                                  }
                                  setEditingReminder(remToEdit)
                                  setRemTitle(remToEdit.title)
                                  setRemDay(remToEdit.dayOfMonth)
                                  setRemTime(remToEdit.time)
                                  setRemChannel(remToEdit.channel)
                                  setReminderModalOpen(true)
                                }}
                                style={{
                                  background: '#ffffff', border: '1px solid #cbd5e1', padding: '6px 12px',
                                  borderRadius: '8px', cursor: 'pointer', color: '#334155', fontSize: '12px',
                                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px'
                                }}
                              >
                                <Edit3 size={13} /> Edit Settings
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Member Details & Active/Gap Status — sleek, minimal design */}
          {activeMemberDetailPopover && group && (
            <div className="modal-backdrop" onClick={() => setActiveMemberDetailPopover(null)} style={{ zIndex: 200 }}>
              <section className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 100%)', padding: '24px' }}>
                {/* Header */}
                <div className="modal-head" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>Member Details & Status</h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Personal info, payment status, and status controls</p>
                  </div>
                  <button type="button" className="icon-button" onClick={() => setActiveMemberDetailPopover(null)} aria-label="Close">
                    <X size={18} />
                  </button>
                </div>

                {/* Member Profile Header */}
                <div className="group-member-popover-header" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div className={`member-avatar ${activeMemberDetailPopover.color}`} style={{ width: 44, height: 44, fontSize: 15, flexShrink: 0, fontWeight: 700 }}>
                    {activeMemberDetailPopover.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{activeMemberDetailPopover.name}</h3>
                      {activeMemberDetailPopover.admissionNo && (
                        <span style={{ fontSize: '11px', background: '#f1f5f9', color: '#475569', fontWeight: 600, padding: '2px 8px', borderRadius: '6px' }}>
                          #{activeMemberDetailPopover.admissionNo}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeMemberDetailPopover.phone} • {activeMemberDetailPopover.email || 'No email'}</span>
                  </div>
                  {/* Payment Status Pill */}
                  {(() => {
                    const pay = activeMemberDetailPopover.groupPayments?.[group.name]
                    const s = pay?.status || activeMemberDetailPopover.status
                    const bg = s === 'Paid' ? '#dcfce7' : s === 'Overdue' ? '#fee2e2' : '#fff7ed'
                    const col = s === 'Paid' ? '#15803d' : s === 'Overdue' ? '#dc2626' : '#c2410c'
                    return (
                      <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', background: bg, color: col, flexShrink: 0 }}>
                        {s}
                      </span>
                    )
                  })()}
                </div>

                {/* Personal Details & Payment Breakdown - Clean 2 Column Grid */}
                <div className="group-member-popover-grid" style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
                  background: '#f8fafc', padding: '14px 16px', borderRadius: '12px',
                  marginBottom: '18px', border: '1px solid #f1f5f9'
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Admission No.</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                      {activeMemberDetailPopover.admissionNo || 'Not specified'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Joined Date</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                      {activeMemberDetailPopover.joined}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Group Fee</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                      {activeMemberDetailPopover.groupPayments?.[group.name]?.amount || group.feeAmount}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Fee Schedule</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                      {activeMemberDetailPopover.groupPayments?.[group.name]?.collectSchedule || group.recursEvery || 'Monthly'}
                    </strong>
                  </div>
                  {activeMemberDetailPopover.dob && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Date of Birth</span>
                      <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                        {activeMemberDetailPopover.dob}
                      </strong>
                    </div>
                  )}
                  {activeMemberDetailPopover.guardianName && (
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Guardian</span>
                      <strong style={{ display: 'block', fontSize: '13px', color: '#1e293b', marginTop: '2px' }}>
                        {activeMemberDetailPopover.guardianName}
                      </strong>
                    </div>
                  )}
                  {activeMemberDetailPopover.address && (
                    <div style={{ gridColumn: 'span 2' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Address</span>
                      <strong style={{ display: 'block', fontSize: '12px', color: '#1e293b', marginTop: '2px', fontWeight: 500 }}>
                        {activeMemberDetailPopover.address}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Sleek & Minimal Status Toggle Switch */}
                {(() => {
                  const currentStatus = activeMemberDetailPopover.groupStatus?.[group.name] || 'Active'
                  const isActive = currentStatus === 'Active'

                  return (
                    <div style={{
                      padding: '14px 16px', borderRadius: '12px', border: isActive ? '1px solid #dcfce7' : '1px solid #e2e8f0',
                      background: isActive ? '#f0fdf4' : '#fafafa', transition: 'all 0.2s ease', marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>Group Status & Reminders</strong>
                            <span style={{
                              fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '12px',
                              background: isActive ? '#dcfce7' : '#f1f5f9',
                              color: isActive ? '#15803d' : '#64748b'
                            }}>
                              {isActive ? '● Active' : '○ On Gap'}
                            </span>
                          </div>
                          <span style={{ color: isActive ? '#166534' : '#64748b', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            {isActive
                              ? 'Notifications active • Automatic fee reminders will be sent.'
                              : 'Notifications paused • No reminders will be sent while on gap.'}
                          </span>
                        </div>

                        {/* Minimal Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => {
                            toggleMemberGroupStatus(activeMemberDetailPopover.id, group.name)
                            const nextStatus = isActive ? 'On Gap' : 'Active'
                            notify(isActive ? `Status set to On Gap (Reminders OFF) for ${activeMemberDetailPopover.name}` : `Status set to Active (Reminders ON) for ${activeMemberDetailPopover.name}`)
                            setActiveMemberDetailPopover(prev => prev ? {
                              ...prev,
                              groupStatus: { ...(prev.groupStatus || {}), [group.name]: nextStatus }
                            } : null)
                          }}
                          style={{
                            width: '44px', height: '24px', borderRadius: '12px',
                            background: isActive ? '#10b981' : '#cbd5e1',
                            position: 'relative', border: 'none', cursor: 'pointer',
                            transition: 'background-color 0.2s ease', flexShrink: 0
                          }}
                          aria-label="Toggle Status"
                        >
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                            position: 'absolute', top: '2px', left: isActive ? '22px' : '2px',
                            transition: 'left 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                          }} />
                        </button>
                      </div>
                    </div>
                  )
                })()}

                {/* Footer actions */}
                <div className="modal-footer group-member-popover-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '0', display: 'flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove ${activeMemberDetailPopover.name} from "${group.name}"? This will un-enroll them from the group.`)) {
                        handleRemoveFromGroup(group.name, activeMemberDetailPopover.id)
                        setActiveMemberDetailPopover(null)
                      }
                    }}
                    style={{
                      background: 'transparent', border: 'none', color: '#ef4444',
                      padding: '8px 12px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginRight: 'auto'
                    }}
                  >
                    <Trash2 size={14} /> Un-enroll from Group
                  </button>
                  <button type="button" className="primary-button" onClick={() => setActiveMemberDetailPopover(null)} style={{ padding: '8px 20px' }}>
                    Done
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* Add / Edit Scheduled Reminder Modal */}
          {reminderModalOpen && (
            <div className="modal-backdrop" onClick={() => setReminderModalOpen(false)} style={{ zIndex: 300 }}>
              <section className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 100%)', padding: '24px' }}>
                <div className="modal-head" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>
                      {editingReminder ? 'Edit Scheduled Reminder' : 'Schedule Group Reminder'}
                    </h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                      Set date & time for automated recurring monthly fee notification
                    </p>
                  </div>
                  <button type="button" className="icon-button" onClick={() => setReminderModalOpen(false)} aria-label="Close">
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={e => {
                  e.preventDefault()
                  if (!remTitle.trim()) {
                    alert('Please enter a reminder title.')
                    return
                  }
                  const targetGroupId = expandedGroupId || groupDetailsList[0]?.id
                  if (!targetGroupId) return

                  const reminderObj: GroupReminder = {
                    id: editingReminder ? editingReminder.id : `rem-${Date.now()}`,
                    stage: editingReminder?.stage || 1,
                    title: remTitle.trim(),
                    dayOfMonth: remDay,
                    time: remTime,
                    channel: remChannel,
                    enabled: editingReminder ? editingReminder.enabled : true,
                    quotaConsumed: editingReminder?.quotaConsumed ?? false,
                    lastSentAt: editingReminder?.lastSentAt
                  }
                  addOrUpdateGroupReminder(targetGroupId, reminderObj)
                  notify(editingReminder ? `Updated scheduled time for "${remTitle}" to Day ${remDay} at ${remTime}` : `Scheduled new reminder "${remTitle}"`)
                  setReminderModalOpen(false)
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Reminder Title / Description
                      </label>
                      <input
                        type="text"
                        value={remTitle}
                        onChange={e => setRemTitle(e.target.value)}
                        placeholder="e.g. 1st Due Date Reminder"
                        required
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                          Day of Month (1 - 28)
                        </label>
                        <CustomSelect
                          value={String(remDay)}
                          onChange={val => setRemDay(Number(val))}
                          width="100%"
                          options={Array.from({ length: 28 }, (_, i) => i + 1).map(d => ({
                            value: String(d),
                            label: `Day ${d} of month`
                          }))}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                          Send Time
                        </label>
                        <CustomSelect
                          value={remTime}
                          onChange={setRemTime}
                          width="100%"
                          options={['08:00 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM']}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                        Delivery Channel
                      </label>
                      <CustomSelect
                        value={remChannel}
                        onChange={val => setRemChannel(val as any)}
                        width="100%"
                        options={[
                          { value: 'WhatsApp', label: 'WhatsApp Message' },
                          { value: 'SMS', label: 'SMS Notification' },
                          { value: 'All', label: 'WhatsApp & SMS Both' }
                        ]}
                      />
                    </div>

                    <div style={{
                      padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                      border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b',
                      display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      <Bell size={13} color="#be123c" style={{ flexShrink: 0 }} />
                      <span><b>Next Cycle Schedule:</b> Day {remDay} of every month at {remTime}.</span>
                    </div>
                  </div>

                  <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '0' }}>
                    <button type="button" className="secondary-button" onClick={() => setReminderModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="primary-button">
                      {editingReminder ? 'Save Settings' : 'Save Reminder'}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}

          {/* Warning Confirmation Modal for Send Now */}
          {confirmSendReminder && (
            <div className="modal-backdrop" onClick={() => setConfirmSendReminder(null)} style={{ zIndex: 350 }}>
              <section className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 100%)', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '12px', background: '#fff7ed',
                    color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, border: '1px solid #ffedd5'
                  }}>
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '17px', color: '#0f172a', fontWeight: 700, margin: '0 0 4px' }}>
                      Confirm Immediate Dispatch
                    </h2>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                      Are you sure you want to send this fee reminder right now?
                    </p>
                  </div>
                </div>

                <div style={{
                  background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '10px',
                  padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#9a3412', lineHeight: '1.4',
                  display: 'flex', alignItems: 'flex-start', gap: '8px'
                }}>
                  <AlertCircle size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><b>Monthly Quota Warning:</b> Dispatching this reminder now will consume <b>1 monthly quota</b> for <b>{confirmSendReminder.groupName}</b>. This quota cannot be restored for this month.</span>
                </div>

                <div style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px',
                  padding: '12px 14px', marginBottom: '20px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Reminder Stage:</span>
                    <strong style={{ color: '#0f172a' }}>{confirmSendReminder.title}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Target Audience:</span>
                    <span style={{ color: '#c2410c', fontWeight: 700, background: '#fff7ed', padding: '2px 8px', borderRadius: '6px' }}>
                      {confirmSendReminder.unpaidCount} Unpaid Member(s)
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b' }}>Delivery Channel:</span>
                    <strong style={{ color: '#0f172a' }}>{confirmSendReminder.channel}</strong>
                  </div>
                </div>

                <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setConfirmSendReminder(null)}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const remId = confirmSendReminder.existingRemId || `rem-stage-${confirmSendReminder.stage}`
                      if (!confirmSendReminder.existingRemId) {
                        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        addOrUpdateGroupReminder(confirmSendReminder.groupId, {
                          id: remId,
                          stage: confirmSendReminder.stage,
                          title: confirmSendReminder.title,
                          dayOfMonth: confirmSendReminder.dayOfMonth,
                          time: confirmSendReminder.time,
                          channel: confirmSendReminder.channel as any,
                          enabled: true,
                          quotaConsumed: true,
                          lastSentAt: `Today, ${timeNow}`
                        })
                      } else {
                        triggerGroupReminderNow(confirmSendReminder.groupId, remId)
                      }
                      notify(`Dispatched "${confirmSendReminder.stageLabel}" to ${confirmSendReminder.unpaidCount} unpaid member(s)! Quota consumed.`)
                      setConfirmSendReminder(null)
                    }}
                    style={{
                      background: '#be123c', color: '#ffffff', border: 'none',
                      padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    Yes, Send Now & Use Quota
                  </button>
                </div>
              </section>
            </div>
          )}
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
      <div className="groups-tiles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
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
              className="group-tile-card"
              onClick={() => {
                setExpandedGroupId(group.id)
                setActiveGroupTab('overview')
              }}
            >
              {/* Tile Header: Clean Icon/Image Avatar, Name, Schedule Badge, Actions */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {group.groupImage ? (
                      <img
                        src={group.groupImage}
                        alt={group.name}
                        style={{
                          width: 44, height: 44, borderRadius: '10px',
                          objectFit: 'cover', flexShrink: 0,
                          border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      />
                    ) : (
                      <div
                        className="group-avatar-badge"
                        style={{ background: bgColor, color: textColor }}
                      >
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                        {group.name}
                      </h3>
                      <span className={`group-badge-pill ${isRecurring ? 'recurring' : 'one-time'}`} style={{ marginTop: '5px' }}>
                        {group.billingType} {group.recursEvery ? `· ${group.recursEvery}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedGroup(group); setModal('edit-group') }}
                      title="Edit group details"
                      style={{
                        border: '1px solid #e2e8f0', background: '#fff', color: '#475569',
                        width: 32, height: 32, borderRadius: '8px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.color = '#0f172a' }}
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
                  <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                    {group.description}
                  </p>
                )}

                {/* Structured Metrics Card */}
                <div className="group-tile-metrics-box">
                  <div>
                    <span className="metric-label">Fee Amount</span>
                    <strong className="metric-val">{group.feeAmount}</strong>
                    <span className="metric-sub">{group.dueDate || '1st of every month'}</span>
                  </div>

                  <div>
                    <span className="metric-label">Enrolled Members</span>
                    <strong className="metric-val" style={{ color: '#0f172a' }}>
                      {groupMembers.length}
                    </strong>
                    <span className="metric-sub">₹{monthlyEst.toLocaleString('en-IN')}/mo volume</span>
                  </div>
                </div>

                {/* Progress Bar & Breakdown */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Payment Status</span>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px', fontWeight: 600 }}>
                      <span style={{ color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                        {totalPaid} paid
                      </span>
                      <span style={{ color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '4px' }}>
                        {totalPending} pending
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#f1f5f9', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: groupMembers.length > 0 ? `${Math.round((totalPaid / groupMembers.length) * 100)}%` : '0%',
                      background: '#059669',
                      borderRadius: 3,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                {/* Footer: Member Roster Thumbnails & Action Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                  <span className="group-tile-link-arrow">
                    Manage group →
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {groupMembers.slice(0, 4).map((m, i) => (
                      <div
                        key={m.id}
                        className={`member-avatar ${m.color}`}
                        style={{ width: 28, height: 28, fontSize: 10, marginLeft: i > 0 ? -6 : 0, border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', zIndex: 4 - i }}
                        title={m.name}
                      >
                        {m.initials}
                      </div>
                    ))}
                    {groupMembers.length > 4 && (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: '#f1f5f9', color: '#475569', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -6, border: '2px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
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

      {/* Add / Edit Scheduled Reminder Modal */}
      {reminderModalOpen && (
        <div className="modal-backdrop" onClick={() => setReminderModalOpen(false)} style={{ zIndex: 220 }}>
          <section className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: 'min(440px, 100%)', padding: '24px' }}>
            <div className="modal-head" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>
                  {editingReminder ? 'Edit Scheduled Reminder' : 'Schedule Group Reminder'}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Set date & time for automated recurring monthly fee notification
                </p>
              </div>
              <button type="button" className="icon-button" onClick={() => setReminderModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault()
              if (!remTitle.trim()) {
                alert('Please enter a reminder title.')
                return
              }
              const targetGroupId = expandedGroupId || groupDetailsList[0]?.id
              if (!targetGroupId) return

              const reminderObj: GroupReminder = {
                id: editingReminder ? editingReminder.id : `rem-${Date.now()}`,
                stage: editingReminder?.stage || 1,
                title: remTitle.trim(),
                dayOfMonth: remDay,
                time: remTime,
                channel: remChannel,
                enabled: editingReminder ? editingReminder.enabled : true,
                quotaConsumed: editingReminder?.quotaConsumed ?? false,
                lastSentAt: editingReminder?.lastSentAt
              }
              addOrUpdateGroupReminder(targetGroupId, reminderObj)
              notify(editingReminder ? `Updated scheduled time for "${remTitle}" to Day ${remDay} at ${remTime}` : `Scheduled new reminder "${remTitle}"`)
              setReminderModalOpen(false)
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Reminder Title / Description
                  </label>
                  <input
                    type="text"
                    value={remTitle}
                    onChange={e => setRemTitle(e.target.value)}
                    placeholder="e.g. 1st Due Date Reminder"
                    required
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      Day of Month (1 - 28)
                    </label>
                    <CustomSelect
                      value={String(remDay)}
                      onChange={val => setRemDay(Number(val))}
                      width="100%"
                      options={Array.from({ length: 28 }, (_, i) => i + 1).map(d => ({
                        value: String(d),
                        label: `Day ${d} of month`
                      }))}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      Send Time
                    </label>
                    <CustomSelect
                      value={remTime}
                      onChange={setRemTime}
                      width="100%"
                      options={['08:00 AM', '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM']}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                    Delivery Channel
                  </label>
                  <CustomSelect
                    value={remChannel}
                    onChange={val => setRemChannel(val as any)}
                    width="100%"
                    options={[
                      { value: 'WhatsApp', label: 'WhatsApp Message' },
                      { value: 'SMS', label: 'SMS Notification' },
                      { value: 'All', label: 'WhatsApp & SMS Both' }
                    ]}
                  />
                </div>

                <div style={{
                  padding: '10px 12px', background: '#f8fafc', borderRadius: '8px',
                  border: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <Bell size={13} color="#be123c" style={{ flexShrink: 0 }} />
                  <span><b>Recurring Schedule:</b> This reminder will automatically send every month on Day {remDay} at {remTime} for members in this group.</span>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '0' }}>
                <button type="button" className="secondary-button" onClick={() => setReminderModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingReminder ? 'Update Reminder' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}
