import { useState, useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight, Bell, CalendarDays, Check, CircleDollarSign, Clock3, Copy, CreditCard, Layers, Send, X } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { StatusBadge } from '@/components/ui/StatusBadge'

function Stat({ title, value, trend, icon: Icon, tone }: { title: string; value: string; trend: string; icon: any; tone: string }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon /></div>
      <p>{title}</p>
      <strong>{value}</strong>
      <span className={trend[0] === '+' ? 'trend positive' : 'trend negative'}>
        {trend[0] === '+' ? <ArrowUpRight /> : <ArrowDownRight />}{trend}
      </span>
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
  const { members: allMembers, groups, setActiveTab, setModal, notify } = useStore()
  
  const [overviewGroup, setOverviewGroup] = useState('All Groups')
  const [timeFilter, setTimeFilter] = useState('Current month')
  const [customMonth, setCustomMonth] = useState('')
  
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

  // Mock data for Recharts
  const data = [
    { name: 'Apr', collections: 4000, pending: 2400 },
    { name: 'May', collections: 3000, pending: 1398 },
    { name: 'Jun', collections: 2000, pending: 9800 },
    { name: 'Jul', collections: 2780, pending: 3908 },
    { name: 'Aug', collections: 1890, pending: 4800 },
    { name: 'Sep', collections: collectedAmount, pending: pendingAmount },
  ]

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Good morning, Admin <span className="spark">✦</span></h1>
          <p className="subheading">Here is what is happening with your workspace today.</p>
        </div>
        <div className="heading-actions">
          <div className="month-select">
            <Layers size={14} />
            <select value={overviewGroup} onChange={(e) => setOverviewGroup(e.target.value)}>
              <option value="All Groups">All Groups</option>
              {groups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          {timeFilter === 'Custom selection' ? (
            <div className="month-select" style={{ padding: '6px 12px' }}>
              <input type="month" value={customMonth} onChange={(e) => setCustomMonth(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontWeight: 500, color: '#334155' }} autoFocus />
              <button onClick={() => setTimeFilter('Current month')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }} aria-label="Cancel custom selection"><X size={14} color="#94a3b8" /></button>
            </div>
          ) : (
            <div className="month-select">
              <CalendarDays size={14} />
              <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="Current month">Current month</option>
                <option value="Previous month">Previous month</option>
                <option value="Custom selection">Custom selection...</option>
              </select>
            </div>
          )}
          <button className="primary-button" onClick={() => setModal('bulk-remind')}><Send size={16}/> Send all immediately</button>
        </div>
      </div>

      <div className="stats-grid">
        <Stat title="Collected this month" value={formattedCollected} trend="+12.8%" icon={CircleDollarSign} tone="green" />
        <Stat title="Collection rate" value={`${collectionRate}%`} trend="+4.2%" icon={Check} tone="red" />
        <Stat title="Pending amount" value={formattedPending} trend="-8.1%" icon={Clock3} tone="orange" />
        <Stat title="Overdue accounts" value={overdueCount.toString()} trend="-3 this week" icon={Bell} tone="blue" />
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
