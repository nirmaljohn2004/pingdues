import { useState, useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check, CircleDollarSign, Clock3, Copy, CreditCard, Layers, X, Wallet, Percent, Hourglass, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { DatePicker } from '@/components/ui/DatePicker'

function Stat({ 
  title, 
  value, 
  trend, 
  icon: Icon, 
  accentColor,
  bgLight,
  trendLabel
}: { 
  title: string
  value: string
  trend: string
  icon: any
  accentColor: string
  bgLight: string
  trendLabel?: string
}) {
  const isPositive = trend.startsWith('+')
  return (
    <article 
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '22px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -6px rgba(15, 23, 42, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        cursor: 'default',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = '#cbd5e1'
        e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(15, 23, 42, 0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.borderColor = '#e2e8f0'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04), 0 6px 16px -6px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ 
          fontSize: '12px', 
          fontWeight: 600, 
          color: '#64748b', 
          letterSpacing: '0.01em',
          textTransform: 'uppercase'
        }}>
          {title}
        </span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: bgLight,
          color: accentColor,
          border: `1px solid ${accentColor}18`
        }}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
      </div>

      <div>
        <div style={{ 
          fontSize: '26px', 
          fontWeight: 800, 
          color: '#0f172a', 
          letterSpacing: '-0.03em', 
          lineHeight: 1.15,
          marginBottom: '10px'
        }}>
          {value}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 8px',
            borderRadius: '6px',
            background: isPositive ? '#ecfdf5' : '#fef2f2',
            color: isPositive ? '#059669' : '#dc2626',
            border: isPositive ? '1px solid #a7f3d0' : '1px solid #fecaca'
          }}>
            {isPositive ? <TrendingUp size={12} strokeWidth={2.5} /> : <TrendingDown size={12} strokeWidth={2.5} />}
            {trend}
          </span>
          {trendLabel && (
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>
              {trendLabel}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

function PanelHead({ title, sub, action }: { title: string; sub: string; action: React.ReactNode }) {
  return (
    <div className="panel-head">
      <div><h2>{title}</h2><p>{sub}</p></div>
      {action}
    </div>
  )
}

export default function Overview() {
  const { members: allMembers, groups, setActiveTab, setModal, notify, userProfile } = useStore()
  
  const [overviewGroup, setOverviewGroup] = useState('All Groups')
  const [timeFilter, setTimeFilter] = useState('Current month')
  const [customMonth, setCustomMonth] = useState('')

  // Dynamic time of day for personalized professional greeting
  const greetingTime = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])
  
  const members = overviewGroup === 'All Groups' ? allMembers : allMembers.filter(m => m.plan === overviewGroup)
  
  const paidCount = members.filter(m => m.status === 'Paid').length
  const pendingMembers = members.filter(m => m.status !== 'Paid')
  const pendingCount = pendingMembers.length
  const overdueCount = members.filter(m => m.status === 'Overdue').length
  
  const parseAmount = (amountStr?: string) => Number((amountStr || '0').replace(/[^0-9]/g, ''))
  const collectedAmount = members.filter(m => m.status === 'Paid').reduce((sum, m) => sum + parseAmount(m.amount), 0)
  const pendingAmount = members.filter(m => m.status !== 'Paid').reduce((sum, m) => sum + parseAmount(m.amount), 0)
  const totalAmount = collectedAmount + pendingAmount
  const collectionRate = totalAmount === 0 ? 0 : Math.round((collectedAmount / totalAmount) * 100)
  
  const formattedCollected = `₹${collectedAmount.toLocaleString('en-IN')}`
  const formattedPending = `₹${pendingAmount.toLocaleString('en-IN')}`

  // Mock data for Recharts scaled to realistic Lakh+ academy revenue
  const data = [
    { name: 'Apr', collections: 145000, pending: 35000 },
    { name: 'May', collections: 180000, pending: 42000 },
    { name: 'Jun', collections: 160000, pending: 65000 },
    { name: 'Jul', collections: 210000, pending: 48000 },
    { name: 'Aug', collections: 195000, pending: 52000 },
    { name: 'Sep', collections: collectedAmount, pending: pendingAmount },
  ]

  return (
    <>
      <div className="page-heading">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              background: '#f1f5f9',
              color: '#475569',
              border: '1px solid #e2e8f0'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
              Live Workspace · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', color: '#0f172a' }}>
            {greetingTime}, {userProfile?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="subheading">
            {pendingCount === 0 
              ? 'All member accounts are fully settled for this billing period.' 
              : `${paidCount} paid, ${pendingCount} payment${pendingCount === 1 ? '' : 's'} awaiting settlement.`}
          </p>
        </div>
        <div className="heading-actions">
          <CustomSelect
            value={overviewGroup}
            onChange={setOverviewGroup}
            options={['All Groups', ...groups]}
            icon={<Layers size={14} />}
            width={160}
          />

          {timeFilter === 'Custom selection' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DatePicker
                value={customMonth}
                onChange={setCustomMonth}
                placeholder="Pick date..."
                width={160}
              />
              <button 
                onClick={() => setTimeFilter('Current month')} 
                style={{ 
                  background: '#ffffff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  color: '#64748b' 
                }} 
                aria-label="Cancel custom selection"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <CustomSelect
              value={timeFilter}
              onChange={setTimeFilter}
              options={['Current month', 'Previous month', 'Custom selection']}
              icon={<CalendarDays size={14} />}
              width={160}
            />
          )}
        </div>
      </div>

      <div className="stats-grid">
        <Stat 
          title="Collected this month" 
          value={formattedCollected} 
          trend="+12.8%" 
          trendLabel="vs last month"
          icon={Wallet} 
          accentColor="#059669" 
          bgLight="#ecfdf5" 
        />
        <Stat 
          title="Collection rate" 
          value={`${collectionRate}%`} 
          trend="+4.2%" 
          trendLabel="target: 85%"
          icon={Percent} 
          accentColor="#be123c" 
          bgLight="#fff1f2" 
        />
        <Stat 
          title="Pending amount" 
          value={formattedPending} 
          trend="-8.1%" 
          trendLabel="fewer arrears"
          icon={Hourglass} 
          accentColor="#d97706" 
          bgLight="#fffbeb" 
        />
        <Stat 
          title="Overdue accounts" 
          value={overdueCount.toString()} 
          trend="-3 this week" 
          trendLabel="settled"
          icon={AlertCircle} 
          accentColor="#4f46e5" 
          bgLight="#eef2ff" 
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel collection-panel">
          <PanelHead 
            title="Collection overview" 
            sub={`Current month · ${members.length} members`} 
            action={<button className="settings-link" onClick={() => setActiveTab('Collections')}>View collections <ArrowUpRight /></button>} 
          />
          <div className="collection-summary">
            <div className="donut" style={{ background: `conic-gradient(#be123c 0 ${collectionRate}%, #ffe4e6 ${collectionRate}% 100%)`}}>
              <div><strong>{collectionRate}<span>%</span></strong><small>collected</small></div>
            </div>
            <div className="legend">
              <div>
                <i className="legend-dot paid" />
                <div><strong>{formattedCollected}</strong><small>Paid by {paidCount} members</small></div>
              </div>
              <div>
                <i className="legend-dot pending" />
                <div><strong>{formattedPending}</strong><small>Pending from {pendingCount} members</small></div>
              </div>
            </div>
          </div>
          
          <div className="chart-wrap" style={{ height: '200px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                <Bar dataKey="collections" fill="#be123c" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="pending" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel payments-panel">
          <PanelHead 
            title="Recent payments" 
            sub="Latest transactions from your members" 
            action={<button className="settings-link" onClick={() => setActiveTab('Collections')}>View all <ArrowUpRight /></button>} 
          />
          {members.filter(m => m.status === 'Paid').slice(0, 3).map((member) => (
            <div className="payment-row" key={member.id}>
              <div className={`member-avatar ${member.color}`}>{member.initials}</div>
              <div className="payment-person">
                <strong>{member.name}</strong>
                <small>{member.plan}</small>
              </div>
              <div className="payment-amount">
                <strong>{member.amount}</strong>
                <small>{member.due}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="panel pending-panel">
          <PanelHead 
            title="Needs your attention" 
            sub="Members with pending or overdue fees" 
            action={<button className="settings-link" onClick={() => setActiveTab('Members')}>See all</button>} 
          />
          {members.filter((member) => member.status !== 'Paid').slice(0, 3).map((member) => (
            <div className="pending-row" key={member.id}>
              <div className={`member-avatar ${member.color}`}>{member.initials}</div>
              <div className="payment-person">
                <strong>{member.name}</strong>
                <small>{member.due}</small>
              </div>
              <div className="pending-actions">
                <strong>{member.amount}</strong>
                <small style={{ display: 'block', color: '#999aa5', fontSize: '10px', marginTop: '4px' }}>
                  Action required
                </small>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ── Group Revenue Comparison ─────────────────────────────────────── */}
      {(() => {
        const parseAmt = (s?: string) => Number((s || '0').replace(/[^0-9]/g, ''))

        // Build per-group collected / pending from groupPayments
        const groupData = groups.map((g, idx) => {
          let collected = 0
          let pending   = 0
          let memberCount = 0

          allMembers.forEach(m => {
            const inGroup = (m.memberGroups || (m.plan ? [m.plan] : [])).includes(g)
            if (!inGroup) return
            memberCount++
            const gp = m.groupPayments?.[g]
            const amt = parseAmt(gp?.amount ?? m.amount)
            const st  = gp?.status ?? m.status
            if (st === 'Paid') collected += amt
            else               pending   += amt
          })

          const total      = collected + pending
          const rate       = total > 0 ? Math.round((collected / total) * 100) : 0
          const barColors  = ['#be123c', '#7c3aed', '#059669', '#d97706', '#0284c7', '#db2777']
          const barColor   = barColors[idx % barColors.length]

          return { name: g, collected, pending, total, rate, memberCount, barColor }
        }).filter(d => d.total > 0 || d.memberCount > 0)

        const maxTotal = Math.max(...groupData.map(d => d.total), 1)

        return (
          <section className="panel overview-comparison-panel" style={{ marginTop: '24px', padding: '28px 32px' }}>
            {/* Header */}
            <div className="overview-comparison-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>Group Revenue Comparison</h2>
                <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Collected vs pending amount across all active groups</p>
              </div>
              <div className="overview-comparison-legend" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '3px', background: '#059669' }} />
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Collected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '3px', background: '#e2e8f0' }} />
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>Pending</span>
                </div>
              </div>
            </div>

            {groupData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#cbd5e1', fontSize: '14px' }}>
                No group data yet. Add members to groups to see revenue comparison.
              </div>
            ) : (
              <>
                {/* Recharts horizontal grouped bar */}
                <div className="overview-comparison-chart-wrap" style={{ height: Math.max(groupData.length * 60 + 40, 200) }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={groupData}
                      margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
                      barGap={4}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.25} />
                      <XAxis
                        type="number"
                        tickFormatter={v => v === 0 ? '₹0' : `₹${(v / 1000).toFixed(0)}k`}
                        axisLine={false} tickLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                      />
                      <YAxis
                        type="category" dataKey="name"
                        width={90}
                        axisLine={false} tickLine={false}
                        tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                        formatter={(value: any, name: any) => [
                          `₹${Number(value || 0).toLocaleString('en-IN')}`,
                          name === 'collected' ? 'Collected' : 'Pending',
                        ]}
                        contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                        labelStyle={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}
                      />
                      <Bar dataKey="collected" fill="#059669" radius={[0, 6, 6, 0]} barSize={14} />
                      <Bar dataKey="pending"   fill="#e2e8f0" radius={[0, 6, 6, 0]} barSize={14} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Summary cards per group */}
                <div className="overview-group-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginTop: '28px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                  {groupData.map((g, i) => {
                    const barColors = ['#be123c', '#7c3aed', '#059669', '#d97706', '#0284c7', '#db2777']
                    const c = barColors[i % barColors.length]
                    return (
                      <div key={g.name} className="overview-group-card" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f1f5f9', background: '#fafafa' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ width: 28, height: 28, borderRadius: '8px', background: c + '18', color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '11px', flexShrink: 0 }}>
                            {g.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 }}>{g.name}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{g.memberCount} member{g.memberCount !== 1 ? 's' : ''}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: g.rate >= 70 ? '#059669' : g.rate >= 40 ? '#d97706' : '#dc2626' }}>{g.rate}% collected</span>
                        </div>
                        {/* Progress bar */}
                        <div style={{ height: 5, borderRadius: '4px', background: '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '4px', background: g.rate >= 70 ? '#059669' : g.rate >= 40 ? '#f59e0b' : '#dc2626', width: `${g.rate}%`, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                          <div>
                            <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>Collected</span>
                            <strong style={{ fontSize: '13px', color: '#059669', fontWeight: 700 }}>₹{g.collected.toLocaleString('en-IN')}</strong>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>Pending</span>
                            <strong style={{ fontSize: '13px', color: '#ea580c', fontWeight: 700 }}>₹{g.pending.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </section>
        )
      })()}

      <div className="payment-link-callout">
        <div className="callout-icon"><CreditCard /></div>
        <div>
          <strong>Payment links make collection effortless</strong>
          <span>Every reminder includes a secure link. Payments update member status automatically.</span>
        </div>
        <button className="copy-link" onClick={() => { navigator.clipboard?.writeText('pay.pingdues.com/current-month'); notify('Sample payment link copied') }}>
          <Copy /> Copy link
        </button>
      </div>
    </>
  )
}
