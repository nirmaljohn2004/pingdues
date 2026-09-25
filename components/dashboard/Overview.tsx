import { useState, useMemo } from 'react'
import { 
  ArrowUpRight, 
  CreditCard, 
  Layers, 
  Wallet, 
  Hourglass, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Plus, 
  Check, 
  BarChart3, 
  Users, 
  TrendingUp 
} from 'lucide-react'
import { useStore, Member } from '@/store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CustomSelect } from '@/components/ui/CustomSelect'

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  pill: string
  pillType: 'positive' | 'warning' | 'alert' | 'neutral' | 'blue' | 'purple' | 'cyan'
  icon: any
  accentColor: string
  bgLight: string
}

function StatCard({
  title,
  value,
  subtitle,
  pill,
  pillType,
  icon: Icon,
  accentColor,
  bgLight
}: StatCardProps) {
  const pillStyles = {
    positive: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    warning: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    alert: { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
    neutral: { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
    blue: { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
    purple: { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
    cyan: { bg: '#ecfeff', color: '#0891b2', border: '#a5f3fc' },
  }[pillType]

  return (
    <div
      className="overview-stat-tile"
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '116px',
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#cbd5e1'
        e.currentTarget.style.boxShadow = '0 8px 18px -6px rgba(15, 23, 42, 0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
    >
      {/* Top Row: Title + Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', marginBottom: '6px' }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0
        }}>
          {title}
        </span>
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgLight,
          color: accentColor,
          border: `1px solid ${accentColor}18`,
          flexShrink: 0
        }}>
          <Icon size={14} strokeWidth={2.2} />
        </div>
      </div>

      {/* Middle: Prominent Value */}
      <div style={{
        fontSize: '19px',
        fontWeight: 800,
        color: accentColor === '#475569' ? '#0f172a' : accentColor,
        letterSpacing: '-0.02em',
        lineHeight: 1.15,
        marginBottom: '6px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {value}
      </div>

      {/* Bottom Row: Subtitle + Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', minWidth: 0 }}>
        <span style={{ 
          fontSize: '10px', 
          color: '#64748b', 
          fontWeight: 500, 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          minWidth: 0 
        }}>
          {subtitle}
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '1px 5px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 700,
          background: pillStyles.bg,
          color: pillStyles.color,
          border: `1px solid ${pillStyles.border}`,
          flexShrink: 0,
          whiteSpace: 'nowrap'
        }}>
          {pill}
        </span>
      </div>
    </div>
  )
}

export default function Overview() {
  const { 
    members: allMembers, 
    groups, 
    setActiveTab, 
    setModal, 
    setSelectedMember, 
    notify, 
    userProfile 
  } = useStore()
  
  const [overviewGroup, setOverviewGroup] = useState('All Groups')
  const [performanceView, setPerformanceView] = useState<'trend' | 'batches'>('trend')
  const [actionTab, setActionTab] = useState<'pending' | 'recent'>('pending')

  // Dynamic greeting based on current local hour
  const greetingTime = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])
  
  // Filter members by selected group
  const members = useMemo(() => {
    if (overviewGroup === 'All Groups') return allMembers
    return allMembers.filter(m => (m.memberGroups || (m.plan ? [m.plan] : [])).includes(overviewGroup))
  }, [allMembers, overviewGroup])
  
  const parseAmount = (amountStr?: string) => Number((amountStr || '0').replace(/[^0-9]/g, ''))

  const paidMembers = useMemo(() => members.filter(m => m.status === 'Paid'), [members])
  const pendingMembers = useMemo(() => members.filter(m => m.status === 'Pending'), [members])
  const overdueMembers = useMemo(() => members.filter(m => m.status === 'Overdue'), [members])
  const allUnpaidMembers = useMemo(() => members.filter(m => m.status !== 'Paid'), [members])

  const paidCount = paidMembers.length
  const pendingCount = pendingMembers.length
  const overdueCount = overdueMembers.length
  const unpaidCount = allUnpaidMembers.length

  const collectedAmount = paidMembers.reduce((sum, m) => sum + parseAmount(m.amount), 0)
  const normalPendingAmount = pendingMembers.reduce((sum, m) => sum + parseAmount(m.amount), 0)
  const overdueAmount = overdueMembers.reduce((sum, m) => sum + parseAmount(m.amount), 0)
  const totalPendingAmount = normalPendingAmount + overdueAmount
  const totalAmount = collectedAmount + totalPendingAmount

  const collectionRate = totalAmount === 0 ? 0 : Math.round((collectedAmount / totalAmount) * 100)
  const pendingRate = totalAmount === 0 ? 0 : Math.round((normalPendingAmount / totalAmount) * 100)
  const overdueRate = totalAmount === 0 ? 0 : Math.max(0, 100 - collectionRate - pendingRate)

  const avgFeePerMember = members.length > 0 ? Math.round(totalAmount / members.length) : 0

  // Monthly historical trend (scaled with current live data)
  const monthlyData = [
    { name: 'Apr', collections: 145000, pending: 35000 },
    { name: 'May', collections: 180000, pending: 42000 },
    { name: 'Jun', collections: 160000, pending: 65000 },
    { name: 'Jul', collections: 210000, pending: 48000 },
    { name: 'Aug', collections: 195000, pending: 52000 },
    { name: 'Sep', collections: collectedAmount, pending: totalPendingAmount },
  ]

  // Group performance summaries
  const groupSummaries = useMemo(() => {
    return groups.map((g, idx) => {
      let gCollected = 0
      let gTotal = 0
      let gCount = 0

      allMembers.forEach(m => {
        const inGroup = (m.memberGroups || (m.plan ? [m.plan] : [])).includes(g)
        if (!inGroup) return
        gCount++
        const gp = m.groupPayments?.[g]
        const amt = parseAmount(gp?.amount ?? m.amount)
        const st = gp?.status ?? m.status
        gTotal += amt
        if (st === 'Paid') gCollected += amt
      })

      const gPending = gTotal - gCollected
      const gRate = gTotal > 0 ? Math.round((gCollected / gTotal) * 100) : 0
      const colors = ['#be123c', '#7c3aed', '#059669', '#d97706', '#0284c7']
      const color = colors[idx % colors.length]

      return {
        name: g,
        total: gTotal,
        collected: gCollected,
        pending: gPending,
        rate: gRate,
        count: gCount,
        color
      }
    }).filter(d => d.count > 0 || d.total > 0)
  }, [groups, allMembers])

  const handleRecordPayment = (member: Member) => {
    setSelectedMember(member)
    setModal('payment')
  }

  const handleViewInvoice = (member: Member) => {
    setSelectedMember(member)
    setModal('invoice')
  }

  const formatYAxisRupee = (val: number) => {
    if (val === 0) return '₹0'
    return `₹${Math.round(val / 1000)}k`
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="overview-hero-header">
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 7px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 600,
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
              Live Workspace · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
            {greetingTime}, {userProfile?.name?.split(' ')[0] || 'Admin'}
          </h1>

          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
            {unpaidCount === 0 
              ? 'All member accounts are fully settled for this month.' 
              : `₹${totalPendingAmount.toLocaleString('en-IN')} pending across ${unpaidCount} member${unpaidCount === 1 ? '' : 's'}.`}
          </p>
        </div>

        {/* Responsive Action Toolbar */}
        <div className="overview-actions-row">
          <div style={{ minWidth: 0 }}>
            <CustomSelect
              value={overviewGroup}
              onChange={setOverviewGroup}
              options={['All Groups', ...groups]}
              icon={<Layers size={13} />}
              width="100%"
            />
          </div>

          <button 
            className="primary-button" 
            onClick={() => setModal('new-payment')}
            style={{ 
              padding: '8px 12px', 
              fontSize: '12px', 
              whiteSpace: 'nowrap', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Plus size={14} strokeWidth={2.5} /> Record Payment
          </button>
        </div>
      </div>

      {/* ── Section 1: Financial Health (4 Cards) ─────────────────── */}
      <div className="overview-section-label">
        <CreditCard size={12} /> Financial Health
      </div>
      <div className="overview-stats-grid">
        <StatCard
          title="Total Expected"
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          subtitle={`${members.length} active members`}
          pill="100% Target"
          pillType="neutral"
          icon={CreditCard}
          accentColor="#475569"
          bgLight="#f1f5f9"
        />

        <StatCard
          title="Collected"
          value={`₹${collectedAmount.toLocaleString('en-IN')}`}
          subtitle={`${paidCount} settled`}
          pill={`${collectionRate}% Paid`}
          pillType="positive"
          icon={Wallet}
          accentColor="#059669"
          bgLight="#ecfdf5"
        />

        <StatCard
          title="Pending Fees"
          value={`₹${normalPendingAmount.toLocaleString('en-IN')}`}
          subtitle={`${pendingCount} awaiting`}
          pill={`${pendingRate}% Due`}
          pillType="warning"
          icon={Hourglass}
          accentColor="#d97706"
          bgLight="#fffbeb"
        />

        <StatCard
          title="Overdue Accounts"
          value={`₹${overdueAmount.toLocaleString('en-IN')}`}
          subtitle={`${overdueCount} member${overdueCount === 1 ? '' : 's'}`}
          pill={overdueCount > 0 ? 'Urgent' : 'Clear'}
          pillType={overdueCount > 0 ? 'alert' : 'positive'}
          icon={AlertCircle}
          accentColor="#be123c"
          bgLight="#fff1f2"
        />
      </div>

      {/* ── Section 2: Club & Operations Activity (4 Cards) ────────── */}
      <div className="overview-section-label" style={{ marginTop: '4px' }}>
        <Users size={12} /> Club Operations & Batches
      </div>
      <div className="overview-stats-grid">
        <StatCard
          title="Total Members"
          value={`${members.length} Members`}
          subtitle="Enrolled in academy"
          pill={`${members.length} Active`}
          pillType="blue"
          icon={Users}
          accentColor="#2563eb"
          bgLight="#eff6ff"
        />

        <StatCard
          title="Active Batches"
          value={`${groups.length} Batches`}
          subtitle="Across all programs"
          pill={`${groups.length} Running`}
          pillType="purple"
          icon={Layers}
          accentColor="#7c3aed"
          bgLight="#f5f3ff"
        />

        <StatCard
          title="Avg. Member Fee"
          value={`₹${avgFeePerMember.toLocaleString('en-IN')}`}
          subtitle="Per membership / cycle"
          pill="Healthy"
          pillType="cyan"
          icon={TrendingUp}
          accentColor="#0891b2"
          bgLight="#ecfeff"
        />

        <StatCard
          title="Settlement Rate"
          value={`${collectionRate}%`}
          subtitle={`${paidCount} of ${members.length} cleared`}
          pill={collectionRate >= 70 ? 'On Track' : 'In Progress'}
          pillType={collectionRate >= 70 ? 'positive' : 'warning'}
          icon={CheckCircle2}
          accentColor="#059669"
          bgLight="#ecfdf5"
        />
      </div>

      {/* ── Main Dashboard Panels (Desktop 2-Col, Mobile Single Col) ── */}
      <div className="overview-main-grid" style={{ marginTop: '6px' }}>
        {/* Panel 1: Performance & Batch Health */}
        <section className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0, overflow: 'hidden' }}>
          {/* Header with View Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 2px', color: '#0f172a' }}>
                Collection Performance
              </h2>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                {performanceView === 'trend' ? '6-month revenue & fee collection pace' : 'Collection progress per batch'}
              </p>
            </div>

            {/* View Switcher Tabs */}
            <div style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '7px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              gap: '2px',
              flexShrink: 0
            }}>
              <button
                onClick={() => setPerformanceView('trend')}
                style={{
                  border: 0,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: performanceView === 'trend' ? '#ffffff' : 'transparent',
                  color: performanceView === 'trend' ? '#be123c' : '#64748b',
                  boxShadow: performanceView === 'trend' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <BarChart3 size={12} /> Trend
              </button>

              <button
                onClick={() => setPerformanceView('batches')}
                style={{
                  border: 0,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: performanceView === 'batches' ? '#ffffff' : 'transparent',
                  color: performanceView === 'batches' ? '#be123c' : '#64748b',
                  boxShadow: performanceView === 'batches' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Users size={12} /> Batches
              </button>
            </div>
          </div>

          {/* Integrated Collection Progress Bar */}
          <div style={{
            padding: '10px 12px',
            borderRadius: '9px',
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Month Progress (₹{collectedAmount.toLocaleString('en-IN')} of ₹{totalAmount.toLocaleString('en-IN')})
              </span>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                color: collectionRate >= 70 ? '#059669' : collectionRate >= 40 ? '#d97706' : '#be123c',
                flexShrink: 0
              }}>
                {collectionRate}%
              </span>
            </div>

            {/* Segmented Bar */}
            <div style={{
              height: '7px',
              borderRadius: '999px',
              background: '#e2e8f0',
              display: 'flex',
              overflow: 'hidden',
              gap: '2px'
            }}>
              {collectionRate > 0 && (
                <div style={{ width: `${collectionRate}%`, background: '#059669', borderRadius: '999px', transition: 'width 0.3s ease' }} />
              )}
              {pendingRate > 0 && (
                <div style={{ width: `${pendingRate}%`, background: '#f59e0b', borderRadius: '999px', transition: 'width 0.3s ease' }} />
              )}
              {overdueRate > 0 && (
                <div style={{ width: `${overdueRate}%`, background: '#be123c', borderRadius: '999px', transition: 'width 0.3s ease' }} />
              )}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '10px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: 500 }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#059669' }} />
                Paid: ₹{collectedAmount.toLocaleString('en-IN')}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#475569', fontWeight: 500 }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#f59e0b' }} />
                Pending: ₹{normalPendingAmount.toLocaleString('en-IN')}
              </span>
              {overdueCount > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#be123c', fontWeight: 600 }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#be123c' }} />
                  Overdue: ₹{overdueAmount.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* View Mode 1: Clean Monthly Chart */}
          {performanceView === 'trend' && (
            <div style={{ height: '210px', width: '100%', minWidth: 0, overflow: 'hidden' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} accessibilityLayer={false} margin={{ top: 12, right: 10, left: -15, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    dy={4}
                    height={20}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#64748b' }} 
                    width={40}
                    tickFormatter={formatYAxisRupee}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    formatter={(val: any, name: any) => [
                      `₹${Number(val).toLocaleString('en-IN')}`, 
                      name === 'collections' ? 'Collected' : 'Pending'
                    ]}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      fontSize: '11px', 
                      border: '1px solid #e2e8f0', 
                      boxShadow: '0 6px 16px rgba(0,0,0,0.05)' 
                    }}
                  />
                  <Bar dataKey="collections" fill="#be123c" radius={[3, 3, 0, 0]} barSize={16} name="Collected" />
                  <Bar dataKey="pending" fill="#e2e8f0" radius={[3, 3, 0, 0]} barSize={16} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* View Mode 2: Clean Batch / Group Breakdown List */}
          {performanceView === 'batches' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '210px' }}>
              {groupSummaries.map((g) => (
                <div 
                  key={g.name} 
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    minWidth: 0
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                      <strong style={{ fontSize: '11px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</strong>
                      <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>({g.count})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a' }}>
                        ₹{g.collected.toLocaleString('en-IN')}
                      </span>
                      <span style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        background: g.rate === 100 ? '#ecfdf5' : g.rate > 0 ? '#fffbeb' : '#fef2f2',
                        color: g.rate === 100 ? '#059669' : g.rate > 0 ? '#d97706' : '#dc2626'
                      }}>
                        {g.rate}%
                      </span>
                    </div>
                  </div>

                  {/* Micro Progress Bar */}
                  <div style={{ height: '3px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        background: g.rate === 100 ? '#059669' : g.color, 
                        width: `${g.rate}%`,
                        borderRadius: '3px'
                      }} 
                    />
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: 'auto', paddingTop: '6px', textAlign: 'right' }}>
                <button
                  onClick={() => setActiveTab('Groups')}
                  style={{ background: 'transparent', border: 0, color: '#be123c', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Manage groups in Groups tab →
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Panel 2: Action Center (Bulletproof Responsive Layout) */}
        <section className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          {/* Header with Sub-tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{
              display: 'inline-flex',
              padding: '2px',
              borderRadius: '7px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              gap: '2px'
            }}>
              <button
                onClick={() => setActionTab('pending')}
                style={{
                  border: 0,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: actionTab === 'pending' ? '#ffffff' : 'transparent',
                  color: actionTab === 'pending' ? '#be123c' : '#64748b',
                  boxShadow: actionTab === 'pending' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Pending Dues ({unpaidCount})
              </button>

              <button
                onClick={() => setActionTab('recent')}
                style={{
                  border: 0,
                  padding: '3px 8px',
                  borderRadius: '5px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: actionTab === 'recent' ? '#ffffff' : 'transparent',
                  color: actionTab === 'recent' ? '#be123c' : '#64748b',
                  boxShadow: actionTab === 'recent' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Recent Paid ({paidCount})
              </button>
            </div>

            <button 
              className="settings-link" 
              onClick={() => setActiveTab('Members')}
              style={{ fontSize: '11px', padding: '2px 4px' }}
            >
              All members <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Pending Dues List */}
          {actionTab === 'pending' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
              {allUnpaidMembers.length === 0 ? (
                <div style={{
                  padding: '32px 14px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e1',
                  margin: 'auto 0'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#ecfdf5',
                    color: '#059669',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 6px'
                  }}>
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', marginBottom: '2px' }}>
                    All accounts settled!
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    No pending dues for this selection.
                  </span>
                </div>
              ) : (
                allUnpaidMembers.map((member) => {
                  const isOverdue = member.status === 'Overdue'
                  return (
                    <div 
                      key={member.id} 
                      className="overview-member-card"
                      style={{
                        borderColor: isOverdue ? '#fecdd3' : '#f1f5f9',
                        background: isOverdue ? '#fff8f8' : '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                          <div className={`member-avatar ${member.color}`} style={{ width: '32px', height: '32px', fontSize: '11px', flexShrink: 0 }}>
                            {member.initials}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {member.name}
                            </strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                              <span style={{ 
                                fontSize: '9px', 
                                fontWeight: 700, 
                                padding: '1px 5px', 
                                borderRadius: '3px',
                                background: isOverdue ? '#fee2e2' : '#fef3c7',
                                color: isOverdue ? '#dc2626' : '#b45309',
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}>
                                {member.due || (isOverdue ? 'Overdue' : 'Pending')}
                              </span>
                              <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {member.plan}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                            {member.amount}
                          </span>
                          <button
                            onClick={() => handleRecordPayment(member)}
                            className="primary-button"
                            style={{ padding: '6px 12px', fontSize: '11px', gap: '4px', whiteSpace: 'nowrap' }}
                          >
                            <CreditCard size={12} /> Pay
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Recent Paid List */}
          {actionTab === 'recent' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
              {paidMembers.length === 0 ? (
                <div style={{
                  padding: '32px 14px',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e1',
                  margin: 'auto 0'
                }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>
                    No payments recorded for this period yet.
                  </span>
                </div>
              ) : (
                paidMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="overview-member-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <div className={`member-avatar ${member.color}`} style={{ width: '30px', height: '30px', fontSize: '10px', flexShrink: 0 }}>
                          {member.initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {member.name}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                            <span style={{ 
                              fontSize: '9px', 
                              fontWeight: 700, 
                              padding: '1px 4px', 
                              borderRadius: '3px',
                              background: '#ecfdf5',
                              color: '#059669',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              whiteSpace: 'nowrap'
                            }}>
                              <CheckCircle2 size={9} /> Paid
                            </span>
                            <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {member.plan}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', display: 'block' }}>
                          {member.amount}
                        </span>
                        <button
                          onClick={() => handleViewInvoice(member)}
                          style={{
                            background: 'transparent',
                            border: 0,
                            color: '#64748b',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '1px 0',
                            marginTop: '1px'
                          }}
                        >
                          <FileText size={10} /> Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
