'use client'

import { useState, useMemo } from 'react'
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  UserPlus, 
  ChevronDown, 
  FileSpreadsheet, 
  SlidersHorizontal, 
  MoreVertical, 
  CreditCard, 
  MessageSquare, 
  Trash2, 
  AlertTriangle, 
  Check 
} from 'lucide-react'
import { useStore, Member } from '@/store/useStore'
import { MonthFilterDropdown } from '@/components/ui/MonthFilterDropdown'

/* ── Sparkline Wave Background for Summary Cards ────────────────── */
function CardSparkWave({ color }: { color: string }) {
  const gradId = `spark-wave-${color.replace('#', '')}`
  return (
    <div
      className="member-card-spark-wave"
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '90px',
        height: '28px',
        pointerEvents: 'none',
        overflow: 'hidden',
        borderBottomRightRadius: '16px',
        zIndex: 0,
      }}
    >
      <svg
        viewBox="0 0 90 28"
        fill="none"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <path
          d="M 0 22 Q 20 20 38 13 T 68 8 T 90 14 L 90 28 L 0 28 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M 0 22 Q 20 20 38 13 T 68 8 T 90 14"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  )
}

/* ── Decorated Member Stat Card matching mockup ─────────────────── */
function MemberStatCard({
  icon: Icon,
  label,
  value,
  accentColor,
  bgLight,
  isCurrency = false,
}: {
  icon?: any
  label: string
  value: string
  accentColor: string
  bgLight: string
  isCurrency?: boolean
}) {
  return (
    <article
      className="member-summary-card"
      style={{
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.03)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#cbd5e1'
        e.currentTarget.style.boxShadow = '0 10px 24px -6px rgba(15, 23, 42, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = '#f1f5f9'
        e.currentTarget.style.boxShadow = '0 2px 8px -2px rgba(15, 23, 42, 0.03)'
      }}
    >
      <div
        className="member-stat-icon"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgLight,
          color: accentColor,
          border: `1px solid ${accentColor}18`,
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        {isCurrency ? (
          <span style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>₹</span>
        ) : (
          Icon && <Icon size={20} strokeWidth={2.2} />
        )}
      </div>

      <div style={{ minWidth: 0, flex: 1, zIndex: 1, overflow: 'hidden' }}>
        <small
          className="member-stat-label"
          title={label}
          style={{
            display: 'block',
            fontSize: '10px',
            fontWeight: 700,
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.25,
            marginBottom: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </small>
        <strong
          className={`member-stat-value ${isCurrency ? 'is-currency' : 'is-count'}`}
          title={value}
          style={{
            display: 'block',
            fontSize: isCurrency ? '19px' : '22px',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </strong>
      </div>

      {/* Sparkline wave background */}
      <CardSparkWave color={accentColor} />
    </article>
  )
}

/* ── Avatar Color Mapping matching mockup ───────────────────────── */
function getMemberAvatarStyle(member: Member) {
  if (member.name === 'Ananya Sharma' || member.initials === 'AS') {
    return { bg: '#fef3c7', color: '#b45309' }
  }
  if (member.name === 'Rohan Varma' || member.initials === 'RV') {
    return { bg: '#ffe4e6', color: '#be123c' }
  }
  if (member.name === 'Pooja Iyer' || member.initials === 'PI') {
    return { bg: '#dcfce7', color: '#15803d' }
  }
  if (member.name === 'Devendra Nair' || member.initials === 'DN') {
    return { bg: '#dbeafe', color: '#1d4ed8' }
  }
  if (member.color === 'peach') return { bg: '#fef3c7', color: '#b45309' }
  if (member.color === 'mint') return { bg: '#dcfce7', color: '#15803d' }
  if (member.color === 'sky') return { bg: '#dbeafe', color: '#1d4ed8' }
  if (member.color === 'lavender') return { bg: '#ede9fe', color: '#6d28d9' }
  return { bg: '#f1f5f9', color: '#475569' }
}

export default function Members() {
  const { 
    members, 
    groups, 
    setModal, 
    setSelectedMember, 
    selectedMonthFilter, 
    customDateLabel, 
    setSelectedMonthFilter, 
    notify 
  } = useStore()

  const [search, setSearch] = useState('')
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('all')
  const [groupFilterOpen, setGroupFilterOpen] = useState(false)
  const [actionMenuMemberId, setActionMenuMemberId] = useState<number | null>(null)

  const rawActiveMembers = useMemo(() => members.filter((m) => !m.archived), [members])

  // Map member statuses according to selected month
  const activeMembers = useMemo(() => {
    return rawActiveMembers.map((m) => {
      if (selectedMonthFilter === 'this-month') return m
      if (selectedMonthFilter === 'prev-month') {
        const augUnpaid = (m.unpaidMonthsList || []).find((u) => u.month.includes('August'))
        if (augUnpaid) {
          return {
            ...m,
            status: 'Overdue' as const,
            due: 'Missed Aug 2026 fee',
            amount: augUnpaid.amount,
          }
        }
        return {
          ...m,
          status: 'Paid' as const,
          due: 'Settled for Aug 2026',
        }
      }
      if (selectedMonthFilter === 'jul-2026') {
        const julUnpaid = (m.unpaidMonthsList || []).find((u) => u.month.includes('July'))
        if (julUnpaid) {
          return {
            ...m,
            status: 'Overdue' as const,
            due: 'Missed Jul 2026 fee',
            amount: julUnpaid.amount,
          }
        }
        return {
          ...m,
          status: 'Paid' as const,
          due: 'Settled for Jul 2026',
        }
      }
      return m
    })
  }, [rawActiveMembers, selectedMonthFilter])

  const paidCount = useMemo(() => activeMembers.filter((m) => m.status === 'Paid').length, [activeMembers])
  const pendingCount = useMemo(() => activeMembers.filter((m) => m.status !== 'Paid').length, [activeMembers])

  const parseAmount = (amountStr?: string) => Number((amountStr || '0').replace(/[^0-9]/g, ''))
  const monthlyValue = useMemo(() => {
    return activeMembers.reduce((sum, member) => sum + parseAmount(member.amount || '0'), 0)
  }, [activeMembers])

  // Filtered member roster by search and group
  const filteredMembers = useMemo(() => {
    return activeMembers.filter((member) => {
      const q = search.toLowerCase()
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.phone.includes(q) ||
        (member.email && member.email.toLowerCase().includes(q)) ||
        (member.plan && member.plan.toLowerCase().includes(q))

      if (!matchesSearch) return false

      if (selectedGroupFilter !== 'all') {
        const isInGroup =
          (member.memberGroups || []).includes(selectedGroupFilter) ||
          member.plan === selectedGroupFilter
        if (!isInGroup) return false
      }

      return true
    })
  }, [activeMembers, search, selectedGroupFilter])

  const openMember = (member: Member, mode: any) => {
    setSelectedMember(member)
    setModal(mode)
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Program', 'Monthly Amount', 'Payment Status', 'Joined Date']
    const rows = filteredMembers.map((m) => [
      `"${m.name}"`,
      `"${m.phone}"`,
      `"${m.email || ''}"`,
      `"${m.plan || ''}"`,
      `"${m.amount || ''}"`,
      `"${m.status}"`,
      `"${m.joined}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `pingdues_member_directory_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Members list exported successfully!')
  }

  return (
    <>
      {/* ── Page Hero Header ─────────────────────────────────────── */}
      <div
        className="members-hero-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '20px',
          position: 'relative',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ maxWidth: '580px', zIndex: 1 }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#e11d48',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Member Directory
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
            Members
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.45 }}>
            Manage your roster, monthly fees, and payment details.
          </p>
        </div>

        {/* Add member button */}
        <div className="members-hero-action" style={{ zIndex: 1 }}>
          <button
            onClick={() => setModal('add')}
            className="members-add-btn"
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
            <UserPlus size={16} strokeWidth={2.4} />
            <span>Add member</span>
          </button>
        </div>
      </div>

      {/* ── 4 Metric Summary Cards Row ───────────────────────────── */}
      <div
        className="member-summary-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <MemberStatCard
          icon={Users}
          label="Total Members"
          value={activeMembers.length.toString()}
          accentColor="#e11d48"
          bgLight="#fff1f2"
        />
        <MemberStatCard
          icon={CheckCircle2}
          label="Paid This Month"
          value={paidCount.toString()}
          accentColor="#059669"
          bgLight="#ecfdf5"
        />
        <MemberStatCard
          icon={Clock}
          label="Fees Pending"
          value={pendingCount.toString()}
          accentColor="#d97706"
          bgLight="#fffbeb"
        />
        <MemberStatCard
          isCurrency={true}
          label="Monthly Value"
          value={`₹${monthlyValue.toLocaleString('en-IN')}`}
          accentColor="#2563eb"
          bgLight="#eff6ff"
        />
      </div>

      {/* ── Directory Toolbar: Search + Groups Dropdown + Month Filter + Export ── */}
      <div className="member-directory-toolbar">
        {/* Search */}
        <div className="member-search-box">
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name, phone or program..."
            aria-label="Search members"
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

        {/* Filter Controls */}
        <div className="member-filters-group">
          {/* Group Filter Dropdown */}
          <div className="member-group-dropdown-wrap" style={{ position: 'relative' }}>
            <button
              onClick={() => setGroupFilterOpen(!groupFilterOpen)}
              className="member-group-btn"
              style={{
                height: '42px',
                padding: '0 14px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
                <Users size={15} style={{ color: '#64748b', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedGroupFilter === 'all'
                    ? `All Members (${activeMembers.length})`
                    : `${selectedGroupFilter} (${activeMembers.filter((m) => (m.memberGroups || []).includes(selectedGroupFilter) || m.plan === selectedGroupFilter).length})`}
                </span>
              </div>
              <ChevronDown size={14} style={{ color: '#64748b', flexShrink: 0 }} />
            </button>

            {groupFilterOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setGroupFilterOpen(false)} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '48px',
                    width: '240px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    padding: '6px',
                    zIndex: 50,
                  }}
                >
                  <button
                    onClick={() => {
                      setSelectedGroupFilter('all')
                      setGroupFilterOpen(false)
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: selectedGroupFilter === 'all' ? '#fff1f2' : 'transparent',
                      color: selectedGroupFilter === 'all' ? '#be123c' : '#334155',
                      fontSize: '12.5px',
                      fontWeight: selectedGroupFilter === 'all' ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>All Members ({activeMembers.length})</span>
                    {selectedGroupFilter === 'all' && <Check size={14} />}
                  </button>

                  <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

                  {groups.map((grp) => {
                    const count = activeMembers.filter((m) => (m.memberGroups || []).includes(grp) || m.plan === grp).length
                    return (
                      <button
                        key={grp}
                        onClick={() => {
                          setSelectedGroupFilter(grp)
                          setGroupFilterOpen(false)
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: selectedGroupFilter === grp ? '#fff1f2' : 'transparent',
                          color: selectedGroupFilter === grp ? '#be123c' : '#334155',
                          fontSize: '12.5px',
                          fontWeight: selectedGroupFilter === grp ? 700 : 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '6px' }}>
                          {grp}
                        </span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>({count})</span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Month Filter Dropdown */}
          <div className="member-month-dropdown-wrap">
            <MonthFilterDropdown
              value={selectedMonthFilter}
              onChange={(val, label) => setSelectedMonthFilter(val, label)}
              customLabel={customDateLabel}
              width="100%"
            />
          </div>

          {/* Export list button */}
          <button
            onClick={handleExportCSV}
            className="member-export-btn"
            style={{
              height: '42px',
              padding: '0 16px',
              borderRadius: '12px',
              border: '1px solid #fecdd3',
              background: '#ffffff',
              color: '#be123c',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
          >
            <FileSpreadsheet size={16} />
            <span>Export list</span>
          </button>
        </div>
      </div>

      {/* ── Members Table Card ───────────────────────────────────── */}
      <section
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #f1f5f9',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          {/* Table Header */}
          <div
            className="member-directory-table-head"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.6fr 1.6fr 1.6fr 1.6fr 1.4fr',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 20px',
              borderBottom: '1px solid #f1f5f9',
              background: '#ffffff',
              color: '#64748b',
              fontSize: '10.5px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              minWidth: '860px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={12} style={{ color: '#94a3b8' }} />
              <span>Member</span>
            </div>
            <div>Contact Details</div>
            <div>Program</div>
            <div>Payment Status</div>
            <div style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredMembers.map((member) => {
            const avatar = getMemberAvatarStyle(member)
            const unpaidList = member.unpaidMonthsList || []
            const hasMultiMonth = unpaidList.length >= 2
            const totalArrears = unpaidList.reduce(
              (sum, item) => sum + Number((item.amount || '0').replace(/[^0-9]/g, '')),
              0
            )

            return (
              <div
                key={member.id}
                className="member-directory-row"
                onClick={() => openMember(member, 'details')}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr 1.6fr 1.6fr 1.6fr 1.4fr',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #f1f5f9',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  minWidth: '860px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafbfd')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {/* 1. Member: Squircle initial + Name & Joined */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      flexShrink: 0,
                      background: avatar.bg,
                      color: avatar.color,
                      border: `1px solid ${avatar.color}20`,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {member.name}
                    </strong>
                    <small style={{ display: 'block', fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                      Joined {member.joined}
                    </small>
                  </div>
                </div>

                {/* 2. Contact Details: Phone & Email */}
                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.phone}
                  </strong>
                  <small
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      color: '#64748b',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.email}
                  </small>
                </div>

                {/* 3. Program: Plan & Fee */}
                <div style={{ minWidth: 0 }}>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#0f172a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.plan || member.memberGroups?.[0] || 'General'}
                  </strong>
                  <small style={{ display: 'block', fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    {member.amount} / month
                  </small>
                </div>

                {/* 4. Payment Status */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {member.status === 'Paid' ? (
                      <span
                        style={{
                          background: '#ecfdf5',
                          color: '#059669',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ fontSize: '9px' }}>●</span> PAID
                      </span>
                    ) : (
                      <span
                        style={{
                          background: member.status === 'Overdue' ? '#fff1f2' : '#fffbeb',
                          color: member.status === 'Overdue' ? '#e11d48' : '#d97706',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span style={{ fontSize: '9px' }}>●</span> {member.status === 'Overdue' ? 'OVERDUE' : 'PENDING'}
                      </span>
                    )}

                    {hasMultiMonth && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '5px',
                          background: '#fff1f2',
                          color: '#be123c',
                          border: '1px solid #fecdd3',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <AlertTriangle size={10} /> {unpaidList.length} Mos Due
                      </span>
                    )}
                  </div>

                  <small
                    style={{
                      display: 'block',
                      fontSize: '11.5px',
                      color: hasMultiMonth ? '#be123c' : '#64748b',
                      fontWeight: hasMultiMonth ? 600 : 450,
                      marginTop: '3px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {hasMultiMonth
                      ? `Unpaid: ${unpaidList.map((u) => u.month.split(' ')[0]).join(', ')} (₹${totalArrears.toLocaleString('en-IN')})`
                      : member.due}
                  </small>
                </div>

                {/* 5. Actions: View Details + Edit + ⋮ */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    justifyContent: 'flex-end',
                    position: 'relative',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => openMember(member, 'details')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#be123c',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 6px',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => openMember(member, 'edit-member')}
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '5px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#0f172a'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0'
                    }}
                  >
                    Edit
                  </button>

                  {/* Three dots dropdown */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={() => setActionMenuMemberId(actionMenuMemberId === member.id ? null : member.id)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '6px',
                        border: 'none',
                        background: actionMenuMemberId === member.id ? '#f1f5f9' : 'transparent',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={(e) => {
                        if (actionMenuMemberId !== member.id) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>

                    {actionMenuMemberId === member.id && (
                      <>
                        <div
                          style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                          onClick={() => setActionMenuMemberId(null)}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: '34px',
                            width: '180px',
                            background: '#ffffff',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                            padding: '6px',
                            zIndex: 50,
                          }}
                        >
                          <button
                            onClick={() => {
                              setActionMenuMemberId(null)
                              openMember(member, 'payment')
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#0f172a',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <CreditCard size={14} style={{ color: '#059669' }} />
                            <span>Record Payment</span>
                          </button>
                          <button
                            onClick={() => {
                              setActionMenuMemberId(null)
                              openMember(member, 'reminder')
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#0f172a',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <MessageSquare size={14} style={{ color: '#0284c7' }} />
                            <span>Send Reminder</span>
                          </button>
                          <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                          <button
                            onClick={() => {
                              setActionMenuMemberId(null)
                              openMember(member, 'remove')
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'transparent',
                              color: '#dc2626',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Trash2 size={14} />
                            <span>Remove Member</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13.5px' }}>
            No members found matching "{search}"
          </div>
        )}
      </section>
    </>
  )
}
