'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Check } from 'lucide-react'

export interface MonthFilterOption {
  id: string
  label: string
  sublabel?: string
  badge?: string
  isCurrent?: boolean
}

interface MonthFilterDropdownProps {
  value: string
  onChange: (value: string, label: string) => void
  customLabel?: string
  width?: string | number
  className?: string
  align?: 'left' | 'right'
}

export function MonthFilterDropdown({
  value,
  onChange,
  customLabel,
  width,
  className = '',
  align = 'left'
}: MonthFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Calendar navigation state (defaults to August/September 2026)
  const [calDate, setCalDate] = useState<Date>(() => new Date(2026, 8, 1)) // Sep 2026
  const [selectedCustomDate, setSelectedCustomDate] = useState<string>('')

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setShowCalendar(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const presetOptions: MonthFilterOption[] = [
    { id: 'this-month', label: 'This Month', sublabel: 'Sep 2026', badge: 'Current', isCurrent: true },
    { id: 'prev-month', label: 'Previous Month', sublabel: 'Aug 2026', badge: 'Last cycle' },
  ]

  // Determine trigger label
  const getTriggerLabel = () => {
    if (value === 'this-month') return 'This Month (Sep 2026)'
    if (value === 'prev-month') return 'Previous Month (Aug 2026)'
    if (customLabel) return customLabel
    if (selectedCustomDate) return `Custom: ${selectedCustomDate}`
    return 'Select Period'
  }

  // Calendar helpers
  const year = calDate.getFullYear()
  const month = calDate.getMonth()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCalDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCalDate(new Date(year, month + 1, 1))
  }

  const handleSelectDay = (day: number) => {
    const formatted = `${day} ${monthNames[month].slice(0, 3)} ${year}`
    const valKey = `custom:${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedCustomDate(formatted)
    onChange(valKey, `Custom: ${formatted}`)
    setIsOpen(false)
    setShowCalendar(false)
  }

  const handleSelectFullMonth = () => {
    const monthName = monthNames[month]
    const formatted = `${monthName} ${year}`
    let valKey = `custom:${year}-${String(month + 1).padStart(2, '0')}`
    if (month === 8 && year === 2026) valKey = 'this-month'
    if (month === 7 && year === 2026) valKey = 'prev-month'

    setSelectedCustomDate(formatted)
    onChange(valKey, formatted)
    setIsOpen(false)
    setShowCalendar(false)
  }

  return (
    <div
      ref={dropdownRef}
      className={`month-filter-dropdown-container ${className}`}
      style={{
        position: 'relative',
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        display: width && width !== '100%' ? 'inline-block' : 'block',
        boxSizing: 'border-box',
        zIndex: isOpen ? 60 : 1
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="month-filter-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#ffffff',
          border: isOpen ? '1px solid #be123c' : '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#0f172a',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(190, 18, 60, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
          width: '100%',
          outline: 'none',
          whiteSpace: 'nowrap',
          userSelect: 'none'
        }}
        aria-label="Filter by month"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, overflow: 'hidden' }}>
          <CalendarIcon size={14} color="#be123c" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {getTriggerLabel()}
          </span>
        </span>
        <ChevronDown
          size={14}
          style={{
            color: '#94a3b8',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align === 'right' ? 'right' : 'left']: 0,
            width: showCalendar ? '290px' : 'max(100%, 240px)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            boxShadow: '0 12px 28px -6px rgba(15, 23, 42, 0.15), 0 4px 10px -2px rgba(15, 23, 42, 0.05)',
            padding: '6px',
            zIndex: 9999,
            boxSizing: 'border-box',
            animation: 'fadeInSlide 0.15s ease-out'
          }}
        >
          {!showCalendar ? (
            /* Presets List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ padding: '6px 8px 4px', fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Billing Cycle Period
              </div>

              {presetOptions.map((opt) => {
                const isSelected = value === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onChange(opt.id, `${opt.label} (${opt.sublabel})`)
                      setIsOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? '#fff1f2' : 'transparent',
                      color: isSelected ? '#be123c' : '#334155',
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>{opt.label}</span>
                      <small style={{ fontSize: '11px', color: isSelected ? '#be123c' : '#94a3b8' }}>{opt.sublabel}</small>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {opt.badge && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                          background: opt.isCurrent ? '#ecfdf5' : '#f1f5f9',
                          color: opt.isCurrent ? '#059669' : '#64748b'
                        }}>
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check size={14} color="#be123c" strokeWidth={2.5} />}
                    </div>
                  </button>
                )
              })}

              <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />

              {/* Custom Selection Button */}
              <button
                type="button"
                onClick={() => setShowCalendar(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: value.startsWith('custom') ? '#fff1f2' : 'transparent',
                  color: value.startsWith('custom') ? '#be123c' : '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.1s'
                }}
                onMouseEnter={(e) => {
                  if (!value.startsWith('custom')) e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  if (!value.startsWith('custom')) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CalendarIcon size={14} color="#be123c" />
                  <span>Custom Selection...</span>
                </div>
                <span style={{ fontSize: '11px', color: '#be123c', fontWeight: 600 }}>Calendar →</span>
              </button>
            </div>
          ) : (
            /* Interactive Calendar View */
            <div style={{ padding: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b'
                  }}
                  title="Previous month"
                >
                  <ChevronLeft size={14} />
                </button>

                <strong style={{ fontSize: '13px', color: '#0f172a' }}>
                  {monthNames[month]} {year}
                </strong>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px 6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b'
                  }}
                  title="Next month"
                >
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Day Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                  <span key={i} style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const isSelected = value.includes(dayDateStr)

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      style={{
                        padding: '6px 0',
                        fontSize: '11.5px',
                        fontWeight: isSelected ? 700 : 500,
                        borderRadius: '6px',
                        border: 'none',
                        background: isSelected ? '#be123c' : 'transparent',
                        color: isSelected ? '#ffffff' : '#1e293b',
                        cursor: 'pointer',
                        transition: 'background 0.1s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#f1f5f9'
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Quick Action Footer */}
              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  ← Presets
                </button>

                <button
                  type="button"
                  onClick={handleSelectFullMonth}
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#be123c',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Select Entire {monthNames[month].slice(0, 3)}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
