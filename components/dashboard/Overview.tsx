import { useState, useMemo } from 'react'
import { 
  ArrowUpRight, 
  ArrowRight,
  ChevronRight,
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
import { MonthFilterDropdown } from '@/components/ui/MonthFilterDropdown'

/* ── 3D Isometric Pingdues Hexagonal Gem ────────────────────────── */
function Hexagon3DBadge({ size = 100 }: { size?: number }) {
  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size * 1.05}px`,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Soft Ambient Rose Glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-20%',
          background: 'radial-gradient(circle, rgba(244, 63, 94, 0.28) 0%, rgba(251, 113, 133, 0.1) 45%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(14px)',
          pointerEvents: 'none',
        }}
      />

      <svg
        viewBox="0 0 120 126"
        width={size}
        height={size * 1.05}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display: 'block',
          overflow: 'visible',
          filter: 'drop-shadow(0 12px 22px rgba(190, 18, 60, 0.32))',
        }}
      >
        <defs>
          {/* Main Top Face Gradient */}
          <linearGradient id="hexFrontGrad" x1="20" y1="12" x2="105" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </linearGradient>

          {/* 3D Depth / Bevel Gradient */}
          <linearGradient id="hexDepthGrad" x1="60" y1="90" x2="60" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#700926" />
          </linearGradient>

          {/* Specular Edge Highlight */}
          <linearGradient id="hexSpecular" x1="20" y1="20" x2="100" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.75" />
          </linearGradient>

          {/* Soft inner shadow filter */}
          <filter id="softInner" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#881337" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* 3D Bottom Extrusion / Facets */}
        <g transform="translate(0, 6)">
          <path
            d="M 60 114 
               L 101 90 Q 104 88 104 84 
               L 104 90 Q 104 94 101 96 
               L 60 120 Q 56 122 52 120 
               L 15 96 Q 12 94 12 90 
               L 12 84 Q 12 88 15 90 
               L 52 114 Q 56 116 60 114 Z"
            fill="url(#hexDepthGrad)"
          />
        </g>

        {/* Hexagon Main Face with rounded vertices */}
        <path
          d="M 54 12
             Q 60 8.5 66 12
             L 101 32
             Q 106 35 106 41
             L 106 79
             Q 106 85 101 88
             L 66 108
             Q 60 111.5 54 108
             L 19 88
             Q 14 85 14 79
             L 14 41
             Q 14 35 19 32
             Z"
          fill="url(#hexFrontGrad)"
        />

        {/* Top-edge specular highlight rim */}
        <path
          d="M 19 34 L 54 14 Q 60 11 66 14 L 101 34"
          fill="none"
          stroke="url(#hexSpecular)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Pingdues 'P' Monogram */}
        <g filter="url(#softInner)">
          {/* Main White 'P' loop */}
          <path
            d="M 45 36
               C 45 34, 47 32, 53 32
               L 69 32
               C 80 32, 88 39, 88 50
               C 88 61, 80 68, 69 68
               L 56 68
               L 48 85
               C 46 89, 41 87, 41 83
               L 41 40
               C 41 37, 42 36, 45 36 Z"
            fill="#ffffff"
          />
          {/* Inner cutout hole showing red face */}
          <circle cx="67" cy="50" r="9" fill="#e11d48" />
        </g>
      </svg>
    </div>
  )
}

/* ── Sparkline Wave Background Decoration ───────────────────────── */
function CardSparkWave({ color }: { color: string }) {
  const gradId = `spark-wave-${color.replace('#', '')}`
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '90px',
        height: '28px',
        pointerEvents: 'none',
        overflow: 'hidden',
        borderBottomRightRadius: '14px',
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
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
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
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
      </svg>
    </div>
  )
}

/* ── Soft Bubble Decoration for Total Members ───────────────────── */
function CircleDecorations() {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-8px',
        bottom: '-10px',
        width: '65px',
        height: '50px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.28,
      }}
    >
      <svg viewBox="0 0 65 50" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="16" cy="35" r="18" fill="#fda4af" />
        <circle cx="38" cy="38" r="12" fill="#fecdd3" />
        <circle cx="25" cy="18" r="8" fill="#ffe4e6" />
      </svg>
    </div>
  )
}

/* ── Facet Wave Decoration for Active Batches ───────────────────── */
function FacetDecoration() {
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '65px',
        height: '40px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.28,
        overflow: 'hidden',
        borderBottomRightRadius: '14px',
      }}
    >
      <svg viewBox="0 0 65 40" fill="none" style={{ width: '100%', height: '100%' }}>
        <path d="M 15 40 L 65 8 L 65 40 Z" fill="#c4b5fd" />
        <path d="M 32 40 L 65 20 L 65 40 Z" fill="#a78bfa" />
      </svg>
    </div>
  )
}

/* ── Reusable Executive Stat Card ───────────────────────────────── */
interface StatCardProps {
  title: string
  value: string
  subtitle: string
  pill: string
  pillType: 'positive' | 'warning' | 'alert' | 'neutral' | 'brand' | 'sky' | 'purple'
  icon: any
  accentColor?: string
  bgLight?: string
  topRightElement?: React.ReactNode
  sparklineColor?: string
  circleDecorations?: boolean
  facetDecoration?: boolean
  onClick?: () => void
  className?: string
}

function StatCard({
  title,
  value,
  subtitle,
  pill,
  pillType,
  icon: Icon,
  accentColor = '#475569',
  bgLight = '#f8fafc',
  topRightElement,
  sparklineColor,
  circleDecorations,
  facetDecoration,
  onClick,
  className = '',
}: StatCardProps) {
  const pillStyles = {
    positive: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
    warning: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    alert: { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
    neutral: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
    brand: { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
    sky: { bg: '#f0f9ff', color: '#0284c7', border: '#bae6fd' },
    purple: { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' },
  }[pillType]

  return (
    <div
      className={`overview-stat-tile ${className}`}
      onClick={onClick}
      style={{
        background: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: '14px',
        padding: '12px 12px 10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '112px',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#cbd5e1'
        e.currentTarget.style.boxShadow = '0 8px 18px -4px rgba(15, 23, 42, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = '#f1f5f9'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
    >
      {/* Decorative background vectors */}
      {sparklineColor && <CardSparkWave color={sparklineColor} />}
      {circleDecorations && <CircleDecorations />}
      {facetDecoration && <FacetDecoration />}

      {/* Top Row: Squircle Icon + Title + TopRight Element */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '6px', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: bgLight,
              color: accentColor,
              flexShrink: 0,
            }}
          >
            <Icon size={14} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#64748b',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {title}
          </span>
        </div>

        {topRightElement && (
          <div style={{ flexShrink: 0 }}>
            {topRightElement}
          </div>
        )}
      </div>

      {/* Middle: Prominent Authoritative Dark Value */}
      <div
        style={{
          fontSize: '20px',
          fontWeight: 800,
          color: '#0f172a',
          letterSpacing: '-0.025em',
          lineHeight: 1.15,
          marginBottom: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          zIndex: 1,
        }}
      >
        {value}
      </div>

      {/* Bottom Row: Subtitle + Status Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', minWidth: 0, zIndex: 1 }}>
        <span
          style={{
            fontSize: '10px',
            color: '#64748b',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
            flex: 1,
          }}
        >
          {subtitle}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1.5px 6px',
            borderRadius: '5px',
            fontSize: '9.5px',
            fontWeight: 700,
            background: pillStyles.bg,
            color: pillStyles.color,
            border: `1px solid ${pillStyles.border}`,
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
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
    userProfile,
    selectedMonthFilter,
    customDateLabel,
    setSelectedMonthFilter
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

  // Filter member statuses according to selected month
  const monthFilteredMembers = useMemo(() => {
    return members.map(m => {
      if (selectedMonthFilter === 'this-month') {
        return m
      }
      if (selectedMonthFilter === 'prev-month') {
        const augUnpaid = (m.unpaidMonthsList || []).find(u => u.month.includes('August'))
        if (augUnpaid) {
          return {
            ...m,
            status: 'Overdue' as const,
            due: 'Missed Aug 2026 fee',
            amount: augUnpaid.amount
          }
        }
        return {
          ...m,
          status: 'Paid' as const,
          due: 'Settled for Aug 2026'
        }
      }
      if (selectedMonthFilter === 'jul-2026') {
        const julUnpaid = (m.unpaidMonthsList || []).find(u => u.month.includes('July'))
        if (julUnpaid) {
          return {
            ...m,
            status: 'Overdue' as const,
            due: 'Missed Jul 2026 fee',
            amount: julUnpaid.amount
          }
        }
        return {
          ...m,
          status: 'Paid' as const,
          due: 'Settled for Jul 2026'
        }
      }
      return m
    })
  }, [members, selectedMonthFilter])

  const paidMembers = useMemo(() => monthFilteredMembers.filter(m => m.status === 'Paid'), [monthFilteredMembers])
  const pendingMembers = useMemo(() => monthFilteredMembers.filter(m => m.status === 'Pending'), [monthFilteredMembers])
  const overdueMembers = useMemo(() => monthFilteredMembers.filter(m => m.status === 'Overdue'), [monthFilteredMembers])
  const allUnpaidMembers = useMemo(() => monthFilteredMembers.filter(m => m.status !== 'Paid'), [monthFilteredMembers])

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
      const colors = ['#be123c', '#0f172a', '#059669', '#d97706', '#9f1239']
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

  // Format due text cleanly to avoid horizontal overflow or badge collision on mobile
  const getCleanDueBadge = (member: Member) => {
    const isOverdue = member.status === 'Overdue'
    if (isOverdue) {
      const overdueMonthsCount = member.unpaidMonthsList?.filter(u => u.status === 'Overdue' || (u.overdueDays && u.overdueDays > 0)).length || 0
      if (overdueMonthsCount > 1) {
        return `${overdueMonthsCount} Mos Overdue`
      }
      if (member.due) {
        const multiMatch = member.due.match(/(\d+)\s*Months?\s*Overdue/i)
        if (multiMatch) {
          return `${multiMatch[1]} Mos Overdue`
        }
        const cleaned = member.due.replace(/\s*\([^)]*\)/g, '').trim()
        if (cleaned.toLowerCase().includes('missed')) {
          return 'Overdue'
        }
        return cleaned
      }
      return 'Overdue'
    }

    if (member.due) {
      return member.due.replace(/\s*\([^)]*\)/g, '').trim()
    }
    return 'Pending'
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* ── Page Hero Card matching mockup ───────────────────────── */}
      <div className="overview-hero-card">
        {/* Background clipped layer so rings do not spill outside card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            borderRadius: '22px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {/* Ambient radiating concentric rings behind 3D badge */}
          <div
            style={{
              position: 'absolute',
              right: '-30px',
              top: '-30px',
              width: '280px',
              height: '280px',
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 280 280" fill="none" style={{ width: '100%', height: '100%', opacity: 0.35 }}>
              <circle cx="190" cy="90" r="70" stroke="#fda4af" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx="190" cy="90" r="105" stroke="#fecdd3" strokeWidth="1.2" />
              <circle cx="190" cy="90" r="145" stroke="#ffe4e6" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Top Row: Workspace Status Pill, Greeting, and 3D Isometric Pingdues Emblem */}
        <div className="overview-hero-top-row">
          <div style={{ minWidth: 0, flex: 1, zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 9px',
                borderRadius: '9999px',
                fontSize: '10.5px',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#475569',
                border: '1px solid rgba(226, 232, 240, 0.9)',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                Live Workspace · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 1px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {greetingTime},
            </div>

            <h1 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>{userProfile?.name?.split(' ')[0] || 'Riya'}</span>
              <span role="img" aria-label="waving hand" style={{ fontSize: '26px' }}>👋</span>
            </h1>

            <p style={{ margin: 0, fontSize: '12.5px', fontWeight: 600, color: '#64748b', lineHeight: 1.4 }}>
              {unpaidCount === 0 
                ? 'All member accounts are fully settled for this month.' 
                : `₹${totalPendingAmount.toLocaleString('en-IN')} pending across ${unpaidCount} member${unpaidCount === 1 ? '' : 's'}.`}
            </p>
          </div>

          {/* 3D Isometric Pingdues Hexagonal Gem */}
          <div style={{ zIndex: 1 }}>
            <Hexagon3DBadge size={96} />
          </div>
        </div>

        {/* Hero Controls: Filters and High-Impact CTA Button */}
        <div className="overview-hero-bottom" style={{ position: 'relative', zIndex: 40 }}>
          <div className="overview-hero-filters-grid">
            <MonthFilterDropdown
              value={selectedMonthFilter}
              onChange={(val, label) => setSelectedMonthFilter(val, label)}
              customLabel={customDateLabel}
              width="100%"
            />

            <CustomSelect
              value={overviewGroup}
              onChange={setOverviewGroup}
              options={['All Groups', ...groups]}
              icon={<Layers size={14} color="#e11d48" strokeWidth={2.2} />}
              width="100%"
            />
          </div>

          <button 
            type="button"
            className="overview-hero-cta-btn" 
            onClick={() => setModal('new-payment')}
          >
            {/* Background subtle curved waves */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '140px',
                pointerEvents: 'none',
                opacity: 0.16,
              }}
            >
              <svg viewBox="0 0 140 54" fill="none" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                <path d="M 50 0 C 80 15, 90 40, 140 54 L 140 0 Z" fill="#ffffff" />
                <path d="M 15 0 C 50 25, 75 42, 140 42 L 140 0 Z" fill="#ffffff" />
              </svg>
            </div>

            {/* Left: White round circle badge with plus */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#be123c',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <Plus size={20} strokeWidth={3} />
            </div>

            {/* Center: Record Payment Label */}
            <span
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.01em',
                zIndex: 1,
              }}
            >
              Record Payment
            </span>

            {/* Right: Round Translucent Circle with Arrow */}
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                zIndex: 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <ArrowRight size={18} strokeWidth={2.4} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Section 1: Financial Health (4 Cards) ─────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        marginTop: '6px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 800,
          color: '#475569',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          <BarChart3 size={15} color="#e11d48" strokeWidth={2.4} />
          Financial Health
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('Collections')}
          style={{
            background: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#be123c',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff1f2'}
        >
          View Details <ArrowRight size={12} strokeWidth={2.4} />
        </button>
      </div>

      <div className="overview-stats-grid">
        <StatCard
          title="Expected"
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          subtitle={`${members.length} members`}
          pill="Target"
          pillType="sky"
          icon={CreditCard}
          accentColor="#0284c7"
          bgLight="#e0f2fe"
          topRightElement={<CreditCard size={14} color="#94a3b8" strokeWidth={1.8} />}
          sparklineColor="#0284c7"
        />

        <StatCard
          title="Collected"
          value={`₹${collectedAmount.toLocaleString('en-IN')}`}
          subtitle={`${paidCount} settled`}
          pill={`${collectionRate}% Paid`}
          pillType="positive"
          icon={Wallet}
          accentColor="#059669"
          bgLight="#d1fae5"
          sparklineColor="#059669"
        />

        <StatCard
          title="Pending"
          value={`₹${normalPendingAmount.toLocaleString('en-IN')}`}
          subtitle={`${pendingCount} awaiting`}
          pill={`${pendingRate}% Due`}
          pillType="warning"
          icon={Hourglass}
          accentColor="#d97706"
          bgLight="#fef3c7"
          sparklineColor="#d97706"
        />

        <StatCard
          title="Overdue"
          value={`₹${overdueAmount.toLocaleString('en-IN')}`}
          subtitle={`${overdueCount} member${overdueCount === 1 ? '' : 's'}`}
          pill={overdueCount > 0 ? 'Urgent' : 'Clear'}
          pillType={overdueCount > 0 ? 'alert' : 'positive'}
          icon={AlertCircle}
          accentColor="#e11d48"
          bgLight="#ffe4e6"
          sparklineColor="#e11d48"
        />
      </div>

      {/* ── Section 2: Club & Operations Activity (2 Cards on mobile, 4 on desktop) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        marginTop: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          fontWeight: 800,
          color: '#475569',
          letterSpacing: '0.06em',
          textTransform: 'uppercase'
        }}>
          <Users size={15} color="#e11d48" strokeWidth={2.4} />
          Club Operations & Batches
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('Groups')}
          style={{
            background: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#be123c',
            borderRadius: '9999px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#ffe4e6'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#fff1f2'}
        >
          Manage <ArrowRight size={12} strokeWidth={2.4} />
        </button>
      </div>

      <div className="overview-stats-grid">
        <StatCard
          title="Members"
          value={`${members.length} Members`}
          subtitle="Active roster"
          pill={`${members.length} Active`}
          pillType="alert"
          icon={Users}
          accentColor="#e11d48"
          bgLight="#ffe4e6"
          topRightElement={
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <ChevronRight size={13} strokeWidth={2.4} />
            </div>
          }
          circleDecorations={true}
          onClick={() => setActiveTab('Members')}
        />

        <StatCard
          title="Batches"
          value={`${groups.length} Batches`}
          subtitle="Programs"
          pill={`${groups.length} Running`}
          pillType="purple"
          icon={Layers}
          accentColor="#7c3aed"
          bgLight="#ede9fe"
          topRightElement={
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <ChevronRight size={13} strokeWidth={2.4} />
            </div>
          }
          facetDecoration={true}
          onClick={() => setActiveTab('Groups')}
        />

        <StatCard
          className="overview-ops-secondary-card"
          title="Avg Fee"
          value={`₹${avgFeePerMember.toLocaleString('en-IN')}`}
          subtitle="Per member"
          pill="Healthy"
          pillType="neutral"
          icon={TrendingUp}
          accentColor="#4338ca"
          bgLight="#e0e7ff"
          topRightElement={
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <ChevronRight size={13} strokeWidth={2.4} />
            </div>
          }
          sparklineColor="#6366f1"
        />

        <StatCard
          className="overview-ops-secondary-card"
          title="Settled"
          value={`${collectionRate}%`}
          subtitle={`${paidCount} of ${members.length} cleared`}
          pill={collectionRate >= 70 ? 'On Track' : 'In Progress'}
          pillType={collectionRate >= 70 ? 'positive' : 'warning'}
          icon={CheckCircle2}
          accentColor="#059669"
          bgLight="#d1fae5"
          topRightElement={
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}>
              <ChevronRight size={13} strokeWidth={2.4} />
            </div>
          }
          sparklineColor="#059669"
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <div className={`member-avatar ${member.color}`} style={{ width: '32px', height: '32px', fontSize: '11px', flexShrink: 0 }}>
                            {member.initials}
                          </div>
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <strong style={{ 
                              display: 'block', 
                              fontSize: '12px', 
                              fontWeight: 700,
                              color: '#0f172a', 
                              lineHeight: 1.25, 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}>
                              {member.name}
                            </strong>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '5px', 
                              marginTop: '2px', 
                              minWidth: 0, 
                              overflow: 'hidden' 
                            }}>
                              <span 
                                title={member.due || (isOverdue ? 'Overdue' : 'Pending')}
                                style={{ 
                                  fontSize: '9px', 
                                  fontWeight: 700, 
                                  padding: '1px 5px', 
                                  borderRadius: '3px',
                                  background: isOverdue ? '#fee2e2' : '#fef3c7',
                                  color: isOverdue ? '#dc2626' : '#b45309',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0
                                }}
                              >
                                {getCleanDueBadge(member)}
                              </span>
                              <span 
                                title={member.plan}
                                style={{ 
                                  fontSize: '10px', 
                                  color: '#64748b', 
                                  whiteSpace: 'nowrap', 
                                  overflow: 'hidden', 
                                  textOverflow: 'ellipsis',
                                  minWidth: 0,
                                  flex: 1
                                }}
                              >
                                {member.plan}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto' }}>
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: 800, 
                            color: isOverdue ? '#be123c' : '#0f172a',
                            whiteSpace: 'nowrap',
                            letterSpacing: '-0.02em'
                          }}>
                            {member.amount}
                          </span>
                          <button
                            onClick={() => handleRecordPayment(member)}
                            className="primary-button"
                            style={{ 
                              padding: '5px 10px', 
                              fontSize: '11px', 
                              gap: '4px', 
                              whiteSpace: 'nowrap',
                              borderRadius: '6px',
                              flexShrink: 0
                            }}
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
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <div className={`member-avatar ${member.color}`} style={{ width: '32px', height: '32px', fontSize: '11px', flexShrink: 0 }}>
                          {member.initials}
                        </div>
                        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                          <strong style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {member.name}
                          </strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px', minWidth: 0, overflow: 'hidden' }}>
                            <span style={{ 
                              fontSize: '9px', 
                              fontWeight: 700, 
                              padding: '1px 5px', 
                              borderRadius: '3px',
                              background: '#ecfdf5',
                              color: '#059669',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              <CheckCircle2 size={9} /> Paid
                            </span>
                            <span 
                              title={member.plan}
                              style={{ 
                                fontSize: '10px', 
                                color: '#64748b', 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                minWidth: 0,
                                flex: 1
                              }}
                            >
                              {member.plan}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 'auto' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#059669', display: 'block', whiteSpace: 'nowrap', letterSpacing: '-0.02em' }}>
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
                            marginTop: '1px',
                            whiteSpace: 'nowrap'
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
