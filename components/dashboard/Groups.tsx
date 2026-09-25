'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Users, X, Check, Edit3, Trash2, Calendar, CreditCard, Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, UserPlus, Info, LayoutDashboard, Receipt, TrendingUp, DollarSign, PieChart as PieChartIcon, Bell, AlertTriangle, SlidersHorizontal } from 'lucide-react'
import { useStore, GroupDetails, Member, GroupReminder } from '@/store/useStore'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { MonthFilterDropdown } from '@/components/ui/MonthFilterDropdown'

/* ── 3D Isometric Group Stack Emblem matching mockup ────────────── */
function Group3DIsometricBadge({ size = 100 }: { size?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: `${size * 1.3}px`,
        height: `${size}px`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Radiant Pink Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.28) 0%, rgba(251, 113, 133, 0.12) 45%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(16px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 160 120"
        width={size * 1.3}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          overflow: 'visible',
          filter: 'drop-shadow(0 14px 24px rgba(190, 18, 60, 0.28))',
        }}
      >
        <defs>
          {/* Card Gradients */}
          <linearGradient id="groupCardGradFront" x1="20" y1="20" x2="110" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          <linearGradient id="groupCardDepthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#700926" />
          </linearGradient>

          <linearGradient id="groupCardBackGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffe4e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fda4af" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="groupCardMidGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
          </linearGradient>

          {/* Cube Gradients */}
          <linearGradient id="cubeTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fecdd3" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          {/* Specular Edge Highlight */}
          <linearGradient id="specularRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="softGroupShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#9f1239" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Floating Wavy Ribbon Sweep */}
        <path
          d="M 5 95 C 40 85, 70 115, 120 70 C 145 45, 155 35, 160 25"
          stroke="url(#groupCardBackGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.3"
          fill="none"
        />

        {/* Back Card (Layer 1) */}
        <g transform="translate(68, 12) rotate(-14) skewX(18) scale(0.9)">
          <rect
            x="0"
            y="0"
            width="64"
            height="64"
            rx="16"
            fill="url(#groupCardBackGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            filter="url(#softGroupShadow)"
          />
        </g>

        {/* Middle Card (Layer 2) */}
        <g transform="translate(56, 20) rotate(-14) skewX(18) scale(0.96)">
          <rect
            x="0"
            y="0"
            width="64"
            height="64"
            rx="16"
            fill="url(#groupCardMidGrad)"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            filter="url(#softGroupShadow)"
          />
        </g>

        {/* Front 3D Card Extrusion Depth (Layer 3 base) */}
        <g transform="translate(42, 33) rotate(-14) skewX(18)">
          <rect
            x="0"
            y="6"
            width="64"
            height="64"
            rx="16"
            fill="url(#groupCardDepthGrad)"
          />
        </g>

        {/* Front 3D Card Top Face (Layer 3) */}
        <g transform="translate(42, 28) rotate(-14) skewX(18)">
          <rect
            x="0"
            y="0"
            width="64"
            height="64"
            rx="16"
            fill="url(#groupCardGradFront)"
            stroke="url(#specularRim)"
            strokeWidth="1.5"
            filter="url(#softGroupShadow)"
          />

          {/* White Specular Rim Arc */}
          <path
            d="M 6 18 C 6 10, 10 6, 18 6 L 50 6"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeOpacity="0.8"
            fill="none"
          />

          {/* White Users Monogram on Front Face */}
          <g transform="translate(14, 16) scale(0.75)">
            {/* Center User Silhouette */}
            <circle cx="24" cy="14" r="6" fill="#ffffff" />
            <path
              d="M 12 36 C 12 28, 17 24, 24 24 C 31 24, 36 28, 36 36 Z"
              fill="#ffffff"
            />
            {/* Left User Silhouette */}
            <circle cx="11" cy="17" r="4.5" fill="#ffffff" fillOpacity="0.85" />
            <path
              d="M 2 34 C 2 29, 6 25, 11 25 C 13.5 25, 15.8 26.1, 17.5 28 C 16.5 30, 16 32.5, 16 34 Z"
              fill="#ffffff"
              fillOpacity="0.85"
            />
            {/* Right User Silhouette */}
            <circle cx="37" cy="17" r="4.5" fill="#ffffff" fillOpacity="0.85" />
            <path
              d="M 32 34 C 32 32.5, 31.5 30, 30.5 28 C 32.2 26.1, 34.5 25, 37 25 C 42 25, 46 29, 46 34 Z"
              fill="#ffffff"
              fillOpacity="0.85"
            />
          </g>
        </g>

        {/* Floating Mini 3D Isometric Gem 1 (Top Left) */}
        <g transform="translate(24, 20) scale(0.65)">
          <path d="M 12 2 L 22 7 L 12 12 L 2 7 Z" fill="url(#cubeTop)" />
          <path d="M 2 7 L 12 12 L 12 22 L 2 17 Z" fill="url(#cubeLeft)" />
          <path d="M 12 12 L 22 7 L 22 17 L 12 22 Z" fill="url(#cubeRight)" />
        </g>

        {/* Floating Mini 3D Isometric Gem 2 (Bottom Right) */}
        <g transform="translate(124, 68) scale(0.8)">
          <path d="M 12 2 L 22 7 L 12 12 L 2 7 Z" fill="url(#cubeTop)" />
          <path d="M 2 7 L 12 12 L 12 22 L 2 17 Z" fill="url(#cubeLeft)" />
          <path d="M 12 12 L 22 7 L 22 17 L 12 22 Z" fill="url(#cubeRight)" />
        </g>

        {/* Floating Small Diamond Particle (Mid Left) */}
        <g transform="translate(32, 76) scale(0.45)">
          <path d="M 12 2 L 22 7 L 12 12 L 2 7 Z" fill="#ffffff" />
          <path d="M 2 7 L 12 12 L 12 22 L 2 17 Z" fill="#fb7185" />
          <path d="M 12 12 L 22 7 L 22 17 L 12 22 Z" fill="#e11d48" />
        </g>

        {/* Floating Small Specular Particles */}
        <circle cx="138" cy="28" r="3" fill="#fb7185" opacity="0.6" />
        <circle cx="28" cy="52" r="2.5" fill="#fda4af" opacity="0.7" />
      </svg>
    </div>
  )
}

export default function GroupsTab() {
  const { groups, groupDetailsList, members, setMembers, setModal, setSelectedGroup, setSelectedMember, deleteGroup, toggleMemberGroupStatus, addOrUpdateGroupReminder, deleteGroupReminder, toggleGroupReminder, triggerGroupReminderNow, selectedMonthFilter, customDateLabel, setSelectedMonthFilter, notify } = useStore()
  const [search, setSearch] = useState('')

  // Which group is currently expanded in full detail view
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null)
  
  // Inner tabs for the expanded group view: 'overview' | 'members' | 'transactions' | 'reminders'
  const [activeGroupTab, setActiveGroupTab] = useState<'overview' | 'members' | 'transactions' | 'reminders'>('overview')

  // Selected member for detail popover in Enrolled Members tab
  const [activeMemberDetailPopover, setActiveMemberDetailPopover] = useState<Member | null>(null)

  // Staged members for adding to group
  const [staged, setStaged] = useState<number[]>([])

  // Inner sub-tab filter for Transactions: 'Recent' | 'Paid' | 'Pending' | 'Arrears'
  const [txnFilter, setTxnFilter] = useState<'Recent' | 'Paid' | 'Pending' | 'Arrears'>('Recent')
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

  // Sort and Filter state for Groups directory
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'members' | 'fee'>('recent')
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'recurring' | 'one-time'>('all')
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter and sort groups
  const displayedGroups = useMemo(() => {
    let list = groupDetailsList.filter(g => {
      const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
        (g.description && g.description.toLowerCase().includes(search.toLowerCase()))
      if (!matchesSearch) return false
      if (filterType === 'recurring') return g.billingType === 'Recurring'
      if (filterType === 'one-time') return g.billingType === 'One-time'
      return true
    })

    if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'members') {
      list = [...list].sort((a, b) => {
        const aCount = members.filter(m => (m.memberGroups || []).includes(a.name)).length || a.memberCount || 0
        const bCount = members.filter(m => (m.memberGroups || []).includes(b.name)).length || b.memberCount || 0
        return bCount - aCount
      })
    } else if (sortBy === 'fee') {
      list = [...list].sort((a, b) => {
        const aFee = Number(a.feeAmount.replace(/[^0-9]/g, '')) || 0
        const bFee = Number(b.feeAmount.replace(/[^0-9]/g, '')) || 0
        return bFee - aFee
      })
    }
    return list
  }, [groupDetailsList, search, filterType, sortBy, members])

  const filteredGroups = displayedGroups

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
          <section className="panel" style={{ padding: 0, overflow: 'visible' }}>
            {/* Tabs Header */}
            <div className="group-detail-tabs" style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 24px', background: '#f8fafc', gap: '28px', borderTopLeftRadius: 'inherit', borderTopRightRadius: 'inherit' }}>
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
                              {/* Multi-Month Arrears Alert Badge */}
                              {(m.unpaidMonthsList || []).length >= 2 && (
                                <span style={{
                                  fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                                  background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3',
                                  display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                  <AlertTriangle size={11} /> {(m.unpaidMonthsList || []).length} Mos Arrears
                                </span>
                              )}

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
                  {/* Search and Month Filter Toolbar */}
                  <div className="group-txn-toolbar" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="group-txn-search-wrap" style={{ position: 'relative', width: 'min(320px, 100%)' }}>
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

                    <div className="group-txn-month-wrap" style={{ minWidth: '190px' }}>
                      <MonthFilterDropdown
                        value={selectedMonthFilter}
                        onChange={(val, label) => setSelectedMonthFilter(val, label)}
                        customLabel={customDateLabel}
                        width="100%"
                      />
                    </div>
                  </div>

                  {/* Segmented Filter Pills */}
                  {(() => {
                    const groupArrearsCount = groupMembers.filter(m => (m.unpaidMonthsList || []).length >= 2).length
                    return (
                      <div className="group-txn-pills-bar" style={{
                        display: 'inline-flex', background: '#f1f5f9', padding: '4px',
                        borderRadius: '12px', gap: '4px', alignSelf: 'flex-start', flexWrap: 'wrap'
                      }}>
                        {(['Recent', 'Paid', 'Pending', 'Arrears'] as const).map(tab => {
                          const isActive = txnFilter === tab
                          const label = tab === 'Arrears' ? `🚨 Prior Dues (${groupArrearsCount})` : tab
                          return (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setTxnFilter(tab)}
                              style={{
                                padding: '8px 16px', borderRadius: '8px', border: 0, fontSize: '13px',
                                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s ease',
                                background: isActive ? (tab === 'Arrears' ? '#fff1f2' : '#ffffff') : 'transparent',
                                color: isActive ? (tab === 'Arrears' ? '#be123c' : '#059669') : '#64748b',
                                boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                              }}
                            >
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    )
                  })()}

                  {/* Filter Content Area */}
                  {(() => {
                    const query = txnSearch.toLowerCase().trim()

                    // Map member statuses according to selected month
                    const effectiveGroupMembers: Member[] = groupMembers.map(m => {
                      if (selectedMonthFilter === 'this-month') return m
                      const groupAmount = m.groupPayments?.[group.name]?.amount || group.feeAmount || m.amount || '₹0'
                      
                      if (selectedMonthFilter === 'prev-month') {
                        const augUnpaid = (m.unpaidMonthsList || []).find(u => u.month.includes('August'))
                        if (augUnpaid) {
                          return {
                            ...m,
                            status: 'Overdue' as const,
                            due: 'Missed Aug 2026 fee',
                            amount: augUnpaid.amount,
                            groupPayments: {
                              ...(m.groupPayments || {}),
                              [group.name]: {
                                amount: augUnpaid.amount,
                                status: 'Overdue' as const,
                                due: 'Missed Aug 2026 fee'
                              }
                            }
                          }
                        }
                        return {
                          ...m,
                          status: 'Paid' as const,
                          due: 'Settled for Aug 2026',
                          groupPayments: {
                            ...(m.groupPayments || {}),
                            [group.name]: {
                              amount: groupAmount,
                              status: 'Paid' as const,
                              due: 'Settled for Aug 2026'
                            }
                          }
                        }
                      }
                      
                      if (selectedMonthFilter === 'jul-2026' || selectedMonthFilter.includes('2026-07')) {
                        const julUnpaid = (m.unpaidMonthsList || []).find(u => u.month.includes('July'))
                        if (julUnpaid) {
                          return {
                            ...m,
                            status: 'Overdue' as const,
                            due: 'Missed Jul 2026 fee',
                            amount: julUnpaid.amount,
                            groupPayments: {
                              ...(m.groupPayments || {}),
                              [group.name]: {
                                amount: julUnpaid.amount,
                                status: 'Overdue' as const,
                                due: 'Missed Jul 2026 fee'
                              }
                            }
                          }
                        }
                        return {
                          ...m,
                          status: 'Paid' as const,
                          due: 'Settled for Jul 2026',
                          groupPayments: {
                            ...(m.groupPayments || {}),
                            [group.name]: {
                              amount: groupAmount,
                              status: 'Paid' as const,
                              due: 'Settled for Jul 2026'
                            }
                          }
                        }
                      }
                      return m
                    })

                    // Paid members
                    const paidMembers = effectiveGroupMembers.filter(m => {
                      const s = m.groupPayments?.[group.name]?.status || m.status
                      const matches = m.name.toLowerCase().includes(query) || m.phone.includes(query)
                      return s === 'Paid' && matches
                    })

                    // Pending / Overdue members
                    const pendingMembers = effectiveGroupMembers.filter(m => {
                      const s = m.groupPayments?.[group.name]?.status || m.status
                      const matches = m.name.toLowerCase().includes(query) || m.phone.includes(query)
                      return s !== 'Paid' && matches
                    })

                    // Members with 2+ unpaid months (prior arrears)
                    const arrearsMembers = groupMembers.filter(m => {
                      const unpaidList = m.unpaidMonthsList || []
                      const matches = m.name.toLowerCase().includes(query) || m.phone.includes(query)
                      return unpaidList.length >= 2 && matches
                    })

                    // Recent transaction receipts list
                    const allPaid = effectiveGroupMembers.filter(m => (m.groupPayments?.[group.name]?.status || m.status) === 'Paid')
                    const isPrevMonth = selectedMonthFilter === 'prev-month'
                    const isJulMonth = selectedMonthFilter === 'jul-2026' || selectedMonthFilter.includes('2026-07')
                    const recentTxns = allPaid.map((m, idx) => ({
                      id: `rec-${m.id}-${isPrevMonth ? 'aug' : isJulMonth ? 'jul' : 'sep'}`,
                      memberName: m.name,
                      initials: m.initials,
                      color: m.color,
                      amount: m.groupPayments?.[group.name]?.amount || group.feeAmount,
                      date: isPrevMonth
                        ? (idx === 0 ? '10 Aug 2026, 11:15 AM' : '05 Aug 2026, 04:20 PM')
                        : isJulMonth
                        ? (idx === 0 ? '08 Jul 2026, 10:30 AM' : '03 Jul 2026, 02:45 PM')
                        : (idx === 0 ? 'Today, 09:42 AM' : idx === 1 ? 'Yesterday, 04:15 PM' : '18 Sep 2026'),
                      method: idx % 2 === 0 ? 'UPI / Online Link' : 'Cash Receipt',
                      txnId: `TXN-${isPrevMonth ? 78241 : isJulMonth ? 68241 : 88241 + idx * 17}`,
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
                                  <div key={rec.id} className="group-recent-txn-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
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
                                    <div key={m.id} className="group-paid-member-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
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
                                  const unpaidList = m.unpaidMonthsList || []
                                  const hasMultiMonth = unpaidList.length >= 2
                                  const totalOwed = hasMultiMonth
                                    ? unpaidList.reduce((s, u) => s + Number((u.amount || '0').replace(/[^0-9]/g, '')), 0)
                                    : Number((payInfo.amount || '0').replace(/[^0-9]/g, ''))

                                  return (
                                    <div key={m.id} className="group-pending-member-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '10px', background: isOverdue || hasMultiMonth ? '#fff1f2' : '#fffbeb', border: isOverdue || hasMultiMonth ? '1px solid #fecdd3' : '1px solid #fef3c7' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className={`member-avatar ${m.color}`} style={{ width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>{m.initials}</div>
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{m.name}</strong>
                                            {hasMultiMonth && (
                                              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px', background: '#be123c', color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                <AlertTriangle size={10} /> {unpaidList.length} Mos Arrears
                                              </span>
                                            )}
                                          </div>
                                          <small style={{ color: isOverdue || hasMultiMonth ? '#e11d48' : '#b45309', fontSize: '11px', fontWeight: 600 }}>
                                            {hasMultiMonth
                                              ? `Unpaid: ${unpaidList.map(u => u.month).join(', ')}`
                                              : (payInfo.due || 'Due soon')}
                                          </small>
                                        </div>
                                      </div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                          <span style={{ fontWeight: 700, fontSize: '14px', color: hasMultiMonth ? '#be123c' : '#0f172a', display: 'block' }}>
                                            ₹{totalOwed.toLocaleString('en-IN')}
                                          </span>
                                          <span style={{
                                            fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px',
                                            background: isOverdue || hasMultiMonth ? '#fee2e2' : '#fff7ed',
                                            color: isOverdue || hasMultiMonth ? '#dc2626' : '#c2410c',
                                            display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px'
                                          }}>
                                            <AlertCircle size={11} /> {hasMultiMonth ? 'Arrears' : payInfo.status}
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedMember(m)
                                            setModal('details')
                                          }}
                                          style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #cbd5e1',
                                            background: '#ffffff',
                                            color: '#334155',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer'
                                          }}
                                        >
                                          Details
                                        </button>
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

                        {/* 4. ARREARS (PRIOR MONTHS DUES) FILTER */}
                        {txnFilter === 'Arrears' && (
                          <div style={{ border: '1.5px solid #fecdd3', borderRadius: '12px', padding: '20px', background: '#fff1f2' }}>
                            <div className="group-arrears-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                              <div>
                                <h5 style={{ margin: 0, fontSize: '14px', color: '#9f1239', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <AlertTriangle size={15} color="#be123c" /> Prior Months Overdue & Arrears ({arrearsMembers.length})
                                </h5>
                                <span style={{ fontSize: '11px', color: '#be123c' }}>
                                  Clients who missed previous billing periods (2+ months unpaid)
                                </span>
                              </div>
                              <span style={{ fontSize: '11px', color: '#9f1239', background: '#ffe4e6', padding: '3px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #fecdd3' }}>
                                Priority Collection
                              </span>
                            </div>

                            {arrearsMembers.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {arrearsMembers.map(m => {
                                  const list = m.unpaidMonthsList || []
                                  const totalOwed = list.reduce((s, u) => s + Number(u.amount.replace(/[^0-9]/g, '')), 0)
                                  return (
                                    <div key={m.id} className="group-arrears-member-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '10px', background: '#ffffff', border: '1px solid #fecdd3', boxShadow: '0 1px 3px rgba(190, 18, 60, 0.05)' }}>
                                      <div className="group-arrears-info-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className={`member-avatar ${m.color}`} style={{ width: 40, height: 40, fontSize: 14, fontWeight: 700 }}>{m.initials}</div>
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{m.name}</strong>
                                            <span style={{ fontSize: '11px', color: '#64748b' }}>{m.phone}</span>
                                          </div>
                                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                                            {list.map(u => (
                                              <span key={u.id} style={{
                                                fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                                                background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3'
                                              }}>
                                                {u.month}: {u.amount} ({u.overdueDays}d overdue)
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="group-arrears-actions-wrap" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                          <span style={{ fontWeight: 800, fontSize: '16px', color: '#be123c', display: 'block' }}>
                                            ₹{totalOwed.toLocaleString('en-IN')}
                                          </span>
                                          <span style={{ fontSize: '10.5px', color: '#94a3b8', fontWeight: 600 }}>Total Balance</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedMember(m)
                                            setModal('details')
                                          }}
                                          style={{
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#be123c',
                                            color: '#ffffff',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 4px rgba(190, 18, 60, 0.2)'
                                          }}
                                        >
                                          View & Settle
                                        </button>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            ) : (
                              <p style={{ margin: 0, fontSize: '13px', color: '#9f1239', fontStyle: 'italic', padding: '12px 0' }}>
                                No members with 2+ months arrears in this group! All members are up to date.
                              </p>
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
                                    Sent ({existingRem?.lastSentAt || 'Today'})
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

                {/* Multi-Month Arrears in Member Popover */}
                {activeMemberDetailPopover.unpaidMonthsList && activeMemberDetailPopover.unpaidMonthsList.length > 0 && (
                  <div style={{
                    background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px',
                    padding: '12px 14px', marginBottom: '18px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#9f1239', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <AlertTriangle size={12} color="#be123c" /> Prior Unpaid Months ({activeMemberDetailPopover.unpaidMonthsList.length})
                      </span>
                      <strong style={{ fontSize: '12px', color: '#be123c' }}>
                        Total: ₹{activeMemberDetailPopover.unpaidMonthsList.reduce((s, u) => s + Number(u.amount.replace(/[^0-9]/g, '')), 0).toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {activeMemberDetailPopover.unpaidMonthsList.map(u => (
                        <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '12px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{u.month}</span>
                          <span style={{ color: '#be123c', fontWeight: 700 }}>{u.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

  // Theme color palettes for group cards matching mockup aesthetics
  const cardThemeTints = [
    {
      avatarBg: '#ffe4e6',
      avatarColor: '#e11d48',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(244, 63, 94, 0.12) 0%, rgba(254, 205, 211, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#fef2f2',
      metricIconColor: '#475569',
    },
    {
      avatarBg: '#e0f2fe',
      avatarColor: '#0284c7',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.14) 0%, rgba(186, 230, 253, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#f0f9ff',
      metricIconColor: '#0284c7',
    },
    {
      avatarBg: '#dcfce7',
      avatarColor: '#16a34a',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.12) 0%, rgba(187, 247, 208, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#f0fdf4',
      metricIconColor: '#16a34a',
    },
    {
      avatarBg: '#f3e8ff',
      avatarColor: '#9333ea',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.12) 0%, rgba(233, 213, 255, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#faf5ff',
      metricIconColor: '#9333ea',
    },
    {
      avatarBg: '#fef3c7',
      avatarColor: '#d97706',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(245, 158, 11, 0.14) 0%, rgba(254, 243, 199, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#fffbeb',
      metricIconColor: '#d97706',
    },
    {
      avatarBg: '#ffe4e6',
      avatarColor: '#be123c',
      cornerWash: 'radial-gradient(circle at 100% 0%, rgba(244, 63, 94, 0.12) 0%, rgba(254, 205, 211, 0.04) 50%, transparent 75%)',
      metricSquircleBg: '#fef2f2',
      metricIconColor: '#be123c',
    },
  ]

  // ── VIEW 1: ALL GROUPS OVERVIEW (DECORATED TILES GRID) ──────────────────────────
  return (
    <>
      {/* ── Decorated Hero Banner matching mockup ── */}
      <div
        className="groups-hero-banner"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '580px', zIndex: 1 }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Group Management
          </p>
          <h1
            style={{
              margin: '0 0 6px',
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Groups & <span style={{ color: '#be123c' }}>Memberships</span>
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.45 }}>
            Configure membership groups, manage billing settings, and monitor member status per group.
          </p>
        </div>

        {/* Right Art & Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
          {/* 3D Isometric Cards Stack Art */}
          <div className="groups-hero-badge-wrap">
            <Group3DIsometricBadge size={92} />
          </div>

          {/* + New Group Button */}
          <button
            onClick={() => {
              setSelectedGroup(null)
              setModal('add-group')
            }}
            style={{
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 22px',
              fontSize: '14px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(190, 18, 60, 0.28)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(190, 18, 60, 0.38)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(190, 18, 60, 0.28)'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Group</span>
          </button>
        </div>
      </div>

      {/* ── Toolbar: Search + Sort Dropdown + Filter Icon ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '22px',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '440px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by group name or description..."
            aria-label="Search groups"
            style={{
              width: '100%',
              height: '42px',
              paddingLeft: '40px',
              paddingRight: '14px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '13px',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#be123c')}
            onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>

        {/* Sort & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setSortDropdownOpen(!sortDropdownOpen)
                setFilterOpen(false)
              }}
              style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <span>
                {sortBy === 'recent'
                  ? 'Recently Created'
                  : sortBy === 'name'
                  ? 'Group Name (A-Z)'
                  : sortBy === 'members'
                  ? 'Most Members'
                  : 'Highest Fee'}
              </span>
              <ChevronDown size={14} style={{ color: '#64748b' }} />
            </button>

            {sortDropdownOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setSortDropdownOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '180px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '6px',
                    zIndex: 50,
                  }}
                >
                  {[
                    { key: 'recent', label: 'Recently Created' },
                    { key: 'name', label: 'Group Name (A-Z)' },
                    { key: 'members', label: 'Most Members' },
                    { key: 'fee', label: 'Highest Fee' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setSortBy(item.key as any)
                        setSortDropdownOpen(false)
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: sortBy === item.key ? '#fff1f2' : 'transparent',
                        color: sortBy === item.key ? '#be123c' : '#334155',
                        fontSize: '12.5px',
                        fontWeight: sortBy === item.key ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {item.label}
                      {sortBy === item.key && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Filter Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setFilterOpen(!filterOpen)
                setSortDropdownOpen(false)
              }}
              title="Filter by billing type"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                border: `1px solid ${filterType !== 'all' ? '#be123c' : '#e2e8f0'}`,
                background: filterType !== 'all' ? '#fff1f2' : '#ffffff',
                color: filterType !== 'all' ? '#be123c' : '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            >
              <SlidersHorizontal size={16} />
            </button>

            {filterOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                  onClick={() => setFilterOpen(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '48px',
                    width: '160px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '6px',
                    zIndex: 50,
                  }}
                >
                  {[
                    { key: 'all', label: 'All Groups' },
                    { key: 'recurring', label: 'Recurring Only' },
                    { key: 'one-time', label: 'One-time Only' },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        setFilterType(item.key as any)
                        setFilterOpen(false)
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: filterType === item.key ? '#fff1f2' : 'transparent',
                        color: filterType === item.key ? '#be123c' : '#334155',
                        fontSize: '12.5px',
                        fontWeight: filterType === item.key ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {item.label}
                      {filterType === item.key && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Large Decorated Group Tiles Grid (3 Columns) ── */}
      <div className="groups-tiles-grid">
        {displayedGroups.map((group, idx) => {
          const theme = cardThemeTints[idx % cardThemeTints.length]
          const groupMembers = getGroupMembers(group.name)

          const unitFee = Number(group.feeAmount.replace(/[^0-9]/g, '')) || 0
          const enrolledCount = groupMembers.length > 0 ? groupMembers.length : (group.memberCount || 0)
          const monthlyEst = unitFee * enrolledCount

          // Calculate payment status counts:
          let totalPaid = 0
          let totalPending = 0
          let priorDues = 0

          if (groupMembers.length > 0) {
            totalPaid = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Paid').length
            totalPending = groupMembers.filter(m => m.groupPayments?.[group.name]?.status === 'Pending').length
            priorDues = groupMembers.filter(m => (m.unpaidMonthsList || []).length > 0 || m.groupPayments?.[group.name]?.status === 'Overdue').length
          } else {
            totalPaid = group.paidCount ?? 0
            totalPending = group.pendingCount ?? 0
            priorDues = group.priorDuesCount ?? 0
          }

          // Progress bar percentage segments:
          const totalStatus = totalPaid + totalPending + priorDues
          const paidPct = totalStatus > 0 ? (totalPaid / totalStatus) * 100 : 0
          const pendingPct = totalStatus > 0 ? (totalPending / totalStatus) * 100 : 0
          const priorPct = totalStatus > 0 ? (priorDues / totalStatus) * 100 : 0

          // Member initials avatar roster
          const realAvatars = groupMembers.slice(0, 3).map(m => ({
            initials: m.initials,
            name: m.name,
            bg: m.color === 'peach' ? '#ffe4e6' : m.color === 'lavender' ? '#ede9fe' : m.color === 'mint' ? '#dcfce7' : '#dbeafe',
            color: m.color === 'peach' ? '#be123c' : m.color === 'lavender' ? '#6d28d9' : m.color === 'mint' ? '#15803d' : '#1d4ed8',
          }))

          const fallbackAvatarsMap: Record<string, { initials: string; name: string; bg: string; color: string }[]> = {
            'Bollywood Dance': [
              { initials: 'AS', name: 'Ananya Sharma', bg: '#fef3c7', color: '#b45309' },
              { initials: 'DN', name: 'Devendra Nair', bg: '#dbeafe', color: '#1d4ed8' },
            ],
            'Kids Dance Batch': [
              { initials: 'TK', name: 'Tanvi Kapoor', bg: '#fef3c7', color: '#d97706' },
            ],
            'Vocal Music': [
              { initials: 'KK', name: 'Kavita Krishnan', bg: '#ffe4e6', color: '#be123c' },
            ],
          }

          const displayAvatars = realAvatars.length > 0 ? realAvatars : (fallbackAvatarsMap[group.name] || [])
          const extraAvatarCount = enrolledCount > displayAvatars.length ? enrolledCount - displayAvatars.length : 0

          return (
            <div
              key={group.id}
              className="group-decorated-card"
              onClick={() => {
                setExpandedGroupId(group.id)
                setActiveGroupTab('overview')
              }}
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                border: '1px solid #f1f5f9',
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              {/* Top-Right Corner Pastel Wash */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '180px',
                  height: '140px',
                  background: theme.cornerWash,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header: Squircle Avatar, Name, Recurrence Badge, Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                    {group.groupImage ? (
                      <img
                        src={group.groupImage}
                        alt={group.name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '12px',
                          background: theme.avatarBg,
                          color: theme.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 800,
                          flexShrink: 0,
                          border: `1px solid ${theme.avatarColor}20`,
                        }}
                      >
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '15.5px',
                          fontWeight: 700,
                          color: '#0f172a',
                          letterSpacing: '-0.015em',
                          lineHeight: 1.25,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={group.name}
                      >
                        {group.name}
                      </h3>
                      <div style={{ marginTop: '4px' }}>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: '#f1f5f9',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {group.billingType} {group.recursEvery ? `· ${group.recursEvery}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit & Trash */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setSelectedGroup(group)
                        setModal('edit-group')
                      }}
                      title="Edit group details"
                      className="group-action-btn edit"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteGroupClick(group)}
                      title="Delete group"
                      className="group-action-btn delete"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        background: '#ffffff',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* 2-line Description */}
                <p
                  style={{
                    margin: '0 0 14px',
                    fontSize: '12.5px',
                    color: '#64748b',
                    lineHeight: 1.45,
                    minHeight: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {group.description || 'Comprehensive training schedule and syllabus repertoire for active batch members.'}
                </p>

                {/* Structured 2-Col Metrics Container */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    background: '#f8fafc',
                    padding: '11px 13px',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    marginBottom: '14px',
                  }}
                >
                  {/* Fee Amount */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: theme.metricIconColor || '#475569',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        }}
                      >
                        ₹
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#64748b' }}>
                        Fee Amount
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {group.feeAmount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>
                      {group.dueDate || '1st of every month'}
                    </div>
                  </div>

                  {/* Enrolled Members */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: theme.metricIconColor || '#475569',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                        }}
                      >
                        <Users size={10} />
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#64748b' }}>
                        Enrolled Members
                      </span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                      {enrolledCount}
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500, marginTop: '2px' }}>
                      ₹{monthlyEst.toLocaleString('en-IN')}/mo volume
                    </div>
                  </div>
                </div>

                {/* Payment Status Segmented Bar & Pills */}
                <div style={{ marginBottom: '4px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                    Payment Status
                  </div>

                  {/* Segmented Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      borderRadius: '3px',
                      background: '#f1f5f9',
                      display: 'flex',
                      overflow: 'hidden',
                      gap: '2px',
                      marginBottom: '8px',
                    }}
                  >
                    {totalStatus === 0 ? (
                      <div style={{ width: '100%', height: '100%', background: '#e2e8f0', borderRadius: '2px' }} />
                    ) : (
                      <>
                        {paidPct > 0 && (
                          <div
                            style={{
                              width: `${paidPct}%`,
                              height: '100%',
                              background: '#10b981',
                              borderRadius: '2px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        )}
                        {pendingPct > 0 && (
                          <div
                            style={{
                              width: `${pendingPct}%`,
                              height: '100%',
                              background: '#f59e0b',
                              borderRadius: '2px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        )}
                        {priorPct > 0 && (
                          <div
                            style={{
                              width: `${priorPct}%`,
                              height: '100%',
                              background: '#f43f5e',
                              borderRadius: '2px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        )}
                      </>
                    )}
                  </div>

                  {/* Status Pills */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 600 }}>
                    <span style={{ color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '9px' }}>●</span> {totalPaid} paid
                    </span>
                    <span style={{ color: '#d97706', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '9px' }}>●</span> {totalPending} pending
                    </span>
                    <span style={{ color: '#e11d48', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '8px' }}>▲</span> {priorDues} prior dues
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer: Manage Group Link & Overlapping Member Avatars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: '12px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <span
                  className="group-manage-link"
                  style={{
                    fontSize: '12.5px',
                    color: '#be123c',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'gap 0.15s ease',
                  }}
                >
                  Manage group →
                </span>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {displayAvatars.map((av, i) => (
                    <div
                      key={i}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: av.bg,
                        color: av.color,
                        fontSize: 10,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: i > 0 ? -6 : 0,
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                        zIndex: displayAvatars.length - i,
                      }}
                      title={av.name}
                    >
                      {av.initials}
                    </div>
                  ))}
                  {extraAvatarCount > 0 && (
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: 9.5,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: -6,
                        border: '2px solid #ffffff',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                      }}
                    >
                      +{extraAvatarCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {displayedGroups.length === 0 && (
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
