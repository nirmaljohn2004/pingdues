'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  CheckCircle2, 
  Users, 
  FileSpreadsheet, 
  MoreVertical, 
  FileCheck 
} from 'lucide-react'
import { useStore, Member, TransactionItem } from '@/store/useStore'
import { CustomSelect } from '@/components/ui/CustomSelect'
import { MonthFilterDropdown } from '@/components/ui/MonthFilterDropdown'

/* ── Sparkline Wave Background for Summary Cards ────────────────── */
function CardSparkWave({ color }: { color: string }) {
  const gradId = `spark-wave-${color.replace('#', '')}`
  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '95px',
        height: '32px',
        pointerEvents: 'none',
        overflow: 'hidden',
        borderBottomRightRadius: '16px',
        zIndex: 0,
      }}
    >
      <svg
        viewBox="0 0 95 32"
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
          d="M 0 25 Q 22 22 42 14 T 75 9 T 95 16 L 95 32 L 0 32 Z"
          fill={`url(#${gradId})`}
        />
        <path
          d="M 0 25 Q 22 22 42 14 T 75 9 T 95 16"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
      </svg>
    </div>
  )
}

/* ── Mini 4-Bar Chart Graphic for Total Collected Card ──────────── */
function MiniBarChartDecoration() {
  return (
    <div
      style={{
        position: 'absolute',
        right: '18px',
        bottom: '16px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        height: '36px',
        opacity: 0.9,
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 0,
      }}
    >
      <div style={{ width: '6px', height: '14px', borderRadius: '3px', background: '#fecdd3' }} />
      <div style={{ width: '6px', height: '22px', borderRadius: '3px', background: '#fda4af' }} />
      <div style={{ width: '6px', height: '30px', borderRadius: '3px', background: '#fb7185' }} />
      <div style={{ width: '6px', height: '36px', borderRadius: '3px', background: '#f43f5e' }} />
    </div>
  )
}

/* ── 3D Receipt & Ribbon Hero Illustration matching mockup ──────── */
function CollectionsReceipt3DIllustration() {
  return (
    <div
      className="collections-illustration"
      style={{
        position: 'relative',
        width: '260px',
        height: '110px',
        pointerEvents: 'none',
        userSelect: 'none',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        viewBox="0 0 260 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="receiptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fff5f5" />
          </linearGradient>
          <linearGradient id="curlUnderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id="waveGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fda4af" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="waveGradB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0.85" />
          </linearGradient>
          <filter id="receiptDrop" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#be123c" floodOpacity="0.14" />
          </filter>
          <filter id="orbDrop" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#be123c" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Ambient background wave ribbons */}
        <path
          d="M 30 95 C 80 65, 130 115, 185 85 C 220 68, 245 92, 260 75 L 260 110 L 30 110 Z"
          fill="url(#waveGradA)"
        />
        <path
          d="M 0 105 C 50 68, 110 110, 165 80 C 205 58, 235 85, 260 65 L 260 110 L 0 110 Z"
          fill="url(#waveGradB)"
        />

        {/* Center Curled Receipt Paper */}
        <g filter="url(#receiptDrop)" transform="translate(90, 6) rotate(-3)">
          {/* Main receipt paper */}
          <path
            d="M 0 8 C 0 3.5, 3.5 0, 8 0 L 64 0 C 68.5 0, 72 3.5, 72 8 L 72 72 C 60 76, 40 70, 18 78 C 6 82, 0 78, 0 72 Z"
            fill="url(#receiptGrad)"
            stroke="#fecdd3"
            strokeWidth="1"
          />
          {/* Mock invoice text lines */}
          <rect x="12" y="10" width="24" height="2.5" rx="1.2" fill="#fda4af" />
          <rect x="40" y="10" width="18" height="2.5" rx="1.2" fill="#ffe4e6" />
          <rect x="12" y="16" width="48" height="1.5" rx="0.75" fill="#f1f5f9" />
          
          {/* Center Red Rupee Symbol ₹ */}
          <text
            x="36"
            y="46"
            textAnchor="middle"
            fill="#be123c"
            fontSize="24"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            ₹
          </text>

          {/* Bottom text lines */}
          <rect x="12" y="54" width="48" height="1.5" rx="0.75" fill="#f1f5f9" />
          <rect x="16" y="60" width="40" height="2" rx="1" fill="#fecdd3" />

          {/* Curled paper bottom lip */}
          <path
            d="M 0 72 C 12 64, 30 74, 52 66 C 64 61, 72 68, 72 70 C 66 80, 42 74, 16 84 C 5 88, 0 80, 0 72 Z"
            fill="url(#curlUnderGrad)"
            stroke="#fecdd3"
            strokeWidth="0.8"
          />
        </g>

        {/* Left Floating Glass Orb: Bar Chart */}
        <g filter="url(#orbDrop)" transform="translate(60, 32)">
          <circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#fecdd3" strokeWidth="1" />
          <rect x="9" y="17" width="2.5" height="6" rx="1" fill="#fda4af" />
          <rect x="13.5" y="12" width="2.5" height="11" rx="1" fill="#fb7185" />
          <rect x="18" y="9" width="2.5" height="14" rx="1" fill="#be123c" />
        </g>

        {/* Right Floating Glass Orb: Credit Card */}
        <g filter="url(#orbDrop)" transform="translate(180, 16)">
          <circle cx="15" cy="15" r="15" fill="#ffffff" stroke="#fecdd3" strokeWidth="1" />
          <rect x="7" y="9" width="16" height="11" rx="2" fill="#fff" stroke="#be123c" strokeWidth="1.2" />
          <line x1="7" y1="12" x2="23" y2="12" stroke="#be123c" strokeWidth="1.2" />
          <rect x="9" y="15" width="3" height="2" rx="0.5" fill="#fda4af" />
        </g>
      </svg>
    </div>
  )
}

/* ── Avatar Color Mapping matching mockup ───────────────────────── */
function getMemberAvatarStyle(name: string) {
  if (name.includes('Ananya')) return { bg: '#fef3c7', color: '#b45309' }
  if (name.includes('Rohan')) return { bg: '#ffe4e6', color: '#be123c' }
  if (name.includes('Pooja')) return { bg: '#dcfce7', color: '#15803d' }
  if (name.includes('Devendra')) return { bg: '#dbeafe', color: '#1d4ed8' }
  if (name.includes('Kavita')) return { bg: '#ede9fe', color: '#6d28d9' }
  return { bg: '#f1f5f9', color: '#475569' }
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function Collections() {
  const { 
    members, 
    groups, 
    setModal, 
    setSelectedTransaction, 
    selectedMonthFilter, 
    customDateLabel, 
    setSelectedMonthFilter, 
    notify 
  } = useStore()
  
  // Filter state
  const [groupFilter, setGroupFilter] = useState<string>('All Groups')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMenuTxnId, setActiveMenuTxnId] = useState<string | null>(null)

  // Close 3-dots action menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuTxnId(null)
    if (activeMenuTxnId) {
      window.addEventListener('click', handleOutsideClick)
      return () => window.removeEventListener('click', handleOutsideClick)
    }
  }, [activeMenuTxnId])

  // Build transaction dataset for completed (Paid) payments across billing cycles
  const paidTransactions: TransactionItem[] = useMemo(() => {
    const list: TransactionItem[] = [
      // September 2026 receipts
      {
        id: 'sep-1',
        txnNumber: 'TXN-2026-9041',
        memberName: 'Ananya Sharma',
        memberPhone: '+91 98765 43210',
        memberEmail: 'ananya.sharma@nritya.com',
        groupName: 'Bharatanatyam Arangetram',
        amount: '₹1,20,000',
        paymentMethod: 'Online UPI Link',
        status: 'Paid',
        date: '12 Sep 2026',
        time: '9:42 AM',
        remarks: 'September annual Margam installment'
      },
      // August 2026 receipts
      {
        id: 'aug-1',
        txnNumber: 'TXN-2026-8021',
        memberName: 'Ananya Sharma',
        memberPhone: '+91 98765 43210',
        memberEmail: 'ananya.sharma@nritya.com',
        groupName: 'Bharatanatyam Arangetram',
        amount: '₹1,20,000',
        paymentMethod: 'Bank Transfer',
        status: 'Paid',
        date: '10 Aug 2026',
        time: '11:15 AM',
        remarks: 'August advance fee'
      },
      {
        id: 'aug-2',
        txnNumber: 'TXN-2026-8032',
        memberName: 'Rohan Varma',
        memberPhone: '+91 98123 45678',
        memberEmail: 'rohan.varma@nritya.com',
        groupName: 'Kathak Senior Diploma',
        amount: '₹85,000',
        paymentMethod: 'UPI / GPay',
        status: 'Paid',
        date: '05 Aug 2026',
        time: '4:20 PM'
      },
      {
        id: 'aug-3',
        txnNumber: 'TXN-2026-8045',
        memberName: 'Pooja Iyer',
        memberPhone: '+91 98234 56789',
        memberEmail: 'pooja.iyer@nritya.com',
        groupName: 'Odissi Intensive Classical',
        amount: '₹95,000',
        paymentMethod: 'Cash Receipt',
        status: 'Paid',
        date: '08 Aug 2026',
        time: '2:30 PM'
      },
      // July 2026 receipts
      {
        id: 'jul-1',
        txnNumber: 'TXN-2026-7011',
        memberName: 'Devendra Nair',
        memberPhone: '+91 97654 32109',
        memberEmail: 'devendra.nair@nritya.com',
        groupName: 'Bharatanatyam Arangetram',
        amount: '₹60,000',
        paymentMethod: 'Direct Bank Transfer',
        status: 'Paid',
        date: '03 Jul 2026',
        time: '10:00 AM'
      },
      {
        id: 'jul-2',
        txnNumber: 'TXN-2026-7024',
        memberName: 'Rohan Varma',
        memberPhone: '+91 98123 45678',
        memberEmail: 'rohan.varma@nritya.com',
        groupName: 'Kathak Senior Diploma',
        amount: '₹85,000',
        paymentMethod: 'UPI / GPay',
        status: 'Paid',
        date: '06 Jul 2026',
        time: '5:45 PM'
      }
    ]

    return list
  }, [])

  // Filtered dataset by Month, Group, and Search
  const filteredTransactions = useMemo(() => {
    return paidTransactions.filter(t => {
      // Month filter
      let matchesMonth = true
      if (selectedMonthFilter === 'this-month') {
        matchesMonth = t.date.includes('Sep 2026')
      } else if (selectedMonthFilter === 'prev-month') {
        matchesMonth = t.date.includes('Aug 2026')
      } else if (selectedMonthFilter === 'jul-2026') {
        matchesMonth = t.date.includes('Jul 2026')
      }

      const matchesGroup = groupFilter === 'All Groups' || t.groupName === groupFilter
      const matchesSearch = t.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.txnNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.groupName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesMonth && matchesGroup && matchesSearch
    })
  }, [paidTransactions, selectedMonthFilter, groupFilter, searchQuery])

  // Summary Metrics
  const totalCollectedAmt = paidTransactions.reduce((sum, t) => sum + Number(t.amount.replace(/[^0-9]/g, '')), 0)
  const pendingMembersCount = members.filter(m => m.status !== 'Paid').length

  const openInvoice = (txn: TransactionItem) => {
    setSelectedTransaction(txn)
    setModal('invoice')
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Member Name', 'Phone', 'Email', 'Group / Program', 'Amount', 'Payment Mode', 'Date', 'Time', 'Status']
    const rows = filteredTransactions.map((t) => [
      `"${t.txnNumber}"`,
      `"${t.memberName}"`,
      `"${t.memberPhone || ''}"`,
      `"${t.memberEmail || ''}"`,
      `"${t.groupName}"`,
      `"${t.amount}"`,
      `"${t.paymentMethod}"`,
      `"${t.date}"`,
      `"${t.time || ''}"`,
      `"${t.status}"`,
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `pingdues_collections_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    notify('Collections CSV report exported successfully!')
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
      
      {/* ── Page Hero Card matching mockup ───────────────────────── */}
      <div 
        className="collections-hero-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #fff9fa 50%, #fff1f2 100%)',
          borderRadius: '22px',
          border: '1px solid #ffe4e6',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '22px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px -2px rgba(190, 18, 60, 0.04)',
        }}
      >
        {/* Left Heading & Subtitle */}
        <div style={{ maxWidth: '580px', zIndex: 1 }}>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#be123c',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Payments and reconciliation
          </p>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '32px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
            }}
          >
            Collections &amp; <span style={{ color: '#be123c' }}>Invoices</span>
          </h1>
          <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.45 }}>
            Track all system payment records, filter transactions, and generate official invoices.
          </p>
        </div>

        {/* Right 3D Receipt Illustration & Record Payment Button */}
        <div 
          className="collections-hero-right"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            position: 'relative', 
            zIndex: 1,
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}
        >
          <CollectionsReceipt3DIllustration />
          
          <button
            onClick={() => setModal('new-payment')}
            style={{
              background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 22px',
              fontSize: '13.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(190, 18, 60, 0.28)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(190, 18, 60, 0.38)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(190, 18, 60, 0.28)'
            }}
          >
            <Plus size={16} strokeWidth={2.4} /> Record payment
          </button>
        </div>
      </div>

      {/* ── 3 Summary KPI Cards matching mockup ─────────────────── */}
      <div 
        className="collections-metrics-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '22px'
        }}
      >
        {/* Card 1: Total Collected */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
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
          {/* Circular Pink/Crimson Rupee Icon */}
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(190, 18, 60, 0.25)',
              zIndex: 1
            }}
          >
            ₹
          </div>

          <div style={{ minWidth: 0, flex: 1, zIndex: 1 }}>
            <small 
              style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#64748b', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '4px'
              }}
            >
              Total Collected
            </small>
            <strong 
              style={{ 
                display: 'block', 
                fontSize: '24px', 
                fontWeight: 800, 
                color: '#0f172a',
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              ₹{totalCollectedAmt.toLocaleString('en-IN')}
            </strong>
            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>
              {paidTransactions.length} completed receipts
            </small>
          </div>

          {/* 4 Rising Vertical Bars Decoration */}
          <MiniBarChartDecoration />
        </div>

        {/* Card 2: Completed Transactions */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
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
          {/* Blue Squircle FileCheck Icon */}
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid #bae6fd',
              zIndex: 1
            }}
          >
            <FileCheck size={22} strokeWidth={2.2} />
          </div>

          <div style={{ minWidth: 0, flex: 1, zIndex: 1 }}>
            <small 
              style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#64748b', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '4px'
              }}
            >
              Completed Transactions
            </small>
            <strong 
              style={{ 
                display: 'block', 
                fontSize: '24px', 
                fontWeight: 800, 
                color: '#0f172a',
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              {paidTransactions.length}
            </strong>
            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>
              All verified paid entries
            </small>
          </div>

          {/* Smooth Blue Wave Sparkline */}
          <CardSparkWave color="#0284c7" />
        </div>

        {/* Card 3: Members Unpaid */}
        <div 
          style={{
            background: '#ffffff',
            border: '1px solid #f1f5f9',
            borderRadius: '16px',
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
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
          {/* Warm Amber Squircle Users Icon */}
          <div 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid #fde68a',
              zIndex: 1
            }}
          >
            <Users size={22} strokeWidth={2.2} />
          </div>

          <div style={{ minWidth: 0, flex: 1, zIndex: 1 }}>
            <small 
              style={{ 
                display: 'block', 
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#64748b', 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '4px'
              }}
            >
              Members Unpaid
            </small>
            <strong 
              style={{ 
                display: 'block', 
                fontSize: '24px', 
                fontWeight: 800, 
                color: '#0f172a',
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              {pendingMembersCount}
            </strong>
            <small style={{ color: '#64748b', fontSize: '11.5px', marginTop: '2px', display: 'block' }}>
              Pending payment settlement
            </small>
          </div>

          {/* Smooth Amber Wave Sparkline */}
          <CardSparkWave color="#f59e0b" />
        </div>
      </div>
      
      {/* ── Completed Payments & Invoices Section matching mockup ── */}
      <section 
        className="panel collection-panel" 
        style={{ 
          padding: '22px 24px', 
          borderRadius: '20px', 
          background: '#ffffff', 
          border: '1px solid #f1f5f9',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.03)',
          overflow: 'hidden' 
        }}
      >
        {/* Toolbar & Filter Controls */}
        <div 
          className="collection-toolbar" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '14px', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          {/* Section Title & Dynamic Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
              Completed Payments &amp; Invoices
            </h3>
            <span 
              style={{ 
                fontSize: '11.5px', 
                fontWeight: 700, 
                padding: '3px 10px', 
                borderRadius: '12px', 
                background: '#dcfce7', 
                color: '#15803d' 
              }}
            >
              {filteredTransactions.length} Paid
            </span>
          </div>

          {/* Month, Group, Search & Export Controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Month Filter Selector */}
            <MonthFilterDropdown
              value={selectedMonthFilter}
              onChange={(val, label) => setSelectedMonthFilter(val, label)}
              customLabel={customDateLabel}
              width={180}
            />

            {/* Group Selector */}
            <CustomSelect
              value={groupFilter}
              onChange={setGroupFilter}
              options={['All Groups', ...groups]}
              icon={<Filter size={13} />}
              width={150}
            />

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
                  width: '180px',
                  background: '#fff',
                  transition: 'border-color 0.15s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#cbd5e1'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Export CSV Button */}
            <button 
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid #fecdd3',
                background: '#ffffff',
                color: '#be123c',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fff1f2'
                e.currentTarget.style.borderColor = '#fda4af'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff'
                e.currentTarget.style.borderColor = '#fecdd3'
              }}
            >
              <FileSpreadsheet size={14} /> Export CSV
            </button>
          </div>
        </div>
        
        {/* Transaction Table List with Horizontal Scrolling Container */}
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No payment transactions match your selected filter.
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <div style={{ minWidth: '880px' }}>
              
              {/* Table Column Headers matching mockup */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '2.4fr 1.4fr 1.2fr 1.2fr 1.4fr 1fr 1.4fr', 
                  padding: '10px 18px', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  color: '#64748b', 
                  letterSpacing: '0.04em', 
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}
              >
                <div>Member</div>
                <div>Transaction ID</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Payment Mode</div>
                <div>Status</div>
                <div style={{ textAlign: 'right', paddingRight: '8px' }}>Actions</div>
              </div>

              {/* Transaction Row Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTransactions.map((txn) => {
                  const avatarStyle = getMemberAvatarStyle(txn.memberName)
                  const initials = getInitials(txn.memberName)

                  return (
                    <div
                      key={txn.id}
                      className="collection-txn-card"
                      onClick={() => openInvoice(txn)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2.4fr 1.4fr 1.2fr 1.2fr 1.4fr 1fr 1.4fr',
                        alignItems: 'center',
                        padding: '14px 18px',
                        background: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.02)',
                        transition: 'all 0.15s ease',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.borderColor = '#cbd5e1'
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none'
                        e.currentTarget.style.borderColor = '#f1f5f9'
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.02)'
                      }}
                    >
                      {/* Column 1: Member Avatar + Name + Group */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, paddingRight: '8px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: avatarStyle.bg,
                            color: avatarStyle.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {initials}
                        </div>
                        <div style={{ minWidth: 0, overflow: 'hidden' }}>
                          <strong
                            style={{
                              display: 'block',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {txn.memberName}
                          </strong>
                          <small
                            style={{
                              display: 'block',
                              color: '#64748b',
                              fontSize: '11px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginTop: '1px',
                            }}
                          >
                            {txn.groupName}
                          </small>
                        </div>
                      </div>

                      {/* Column 2: Transaction ID */}
                      <div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0f172a' }}>
                          {txn.txnNumber}
                        </span>
                      </div>

                      {/* Column 3: Date & Time */}
                      <div>
                        <span style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {txn.date}
                        </span>
                        {txn.time && (
                          <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '1px' }}>
                            {txn.time}
                          </small>
                        )}
                      </div>

                      {/* Column 4: Amount */}
                      <div>
                        <strong style={{ fontSize: '14.5px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          {txn.amount}
                        </strong>
                      </div>

                      {/* Column 5: Payment Mode */}
                      <div>
                        <span style={{ fontSize: '12px', color: '#475569' }}>
                          {txn.paymentMethod}
                        </span>
                      </div>

                      {/* Column 6: Status Capsule matching mockup */}
                      <div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '3px 10px',
                            borderRadius: '16px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                          PAID
                        </span>
                      </div>

                      {/* Column 7: Actions: View Invoice Button + 3-dots Menu */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', position: 'relative' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openInvoice(txn)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fecdd3',
                            background: '#ffffff',
                            color: '#be123c',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fff1f2'
                            e.currentTarget.style.borderColor = '#fda4af'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff'
                            e.currentTarget.style.borderColor = '#fecdd3'
                          }}
                        >
                          <FileText size={13} color="#be123c" /> View Invoice
                        </button>

                        {/* 3-dots More Actions Button */}
                        <button
                          onClick={() => setActiveMenuTxnId(activeMenuTxnId === txn.id ? null : txn.id)}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: 'none',
                            background: activeMenuTxnId === txn.id ? '#f1f5f9' : 'transparent',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* 3-dots Dropdown Menu */}
                        {activeMenuTxnId === txn.id && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '34px',
                              width: '180px',
                              background: '#ffffff',
                              borderRadius: '10px',
                              border: '1px solid #e2e8f0',
                              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.1)',
                              padding: '4px',
                              zIndex: 20,
                            }}
                          >
                            <button
                              onClick={() => {
                                setActiveMenuTxnId(null)
                                openInvoice(txn)
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '11.5px',
                                color: '#334155',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <FileText size={13} color="#be123c" /> View Receipt
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuTxnId(null)
                                notify(`Receipt for ${txn.txnNumber} downloaded as PDF`)
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '11.5px',
                                color: '#334155',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <Download size={13} color="#0284c7" /> Download PDF
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuTxnId(null)
                                notify(`Receipt link sent via WhatsApp to ${txn.memberPhone || txn.memberName}`)
                              }}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '7px 10px',
                                fontSize: '11.5px',
                                color: '#334155',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                              <CheckCircle2 size={13} color="#16a34a" /> WhatsApp Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
