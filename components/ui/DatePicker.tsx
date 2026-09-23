'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DatePickerProps {
  value: string // formatted string or ISO YYYY-MM-DD
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  width?: string | number
  className?: string
  disabled?: boolean
  mode?: 'date' | 'month' | 'day-of-month'
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  width,
  className = '',
  disabled = false,
  mode = 'date'
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse initial date
  const parseDate = (valStr: string) => {
    if (!valStr) return new Date()
    const d = new Date(valStr)
    return isNaN(d.getTime()) ? new Date() : d
  }

  const [viewDate, setViewDate] = useState<Date>(() => parseDate(value))

  useEffect(() => {
    if (value) {
      const parsed = parseDate(value)
      if (!isNaN(parsed.getTime())) {
        setViewDate(parsed)
      }
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Month navigation
  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(year, month - 1, 1))
  }

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    setViewDate(new Date(year, month + 1, 1))
  }

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const handleSelectDay = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(formattedDate)
    setIsOpen(false)
  }

  const handleSelectDayOfMonthOnly = (dayNumber: number) => {
    // Suffix (1st, 2nd, 3rd, etc.)
    const suffix = (d: number) => {
      if (d > 3 && d < 21) return 'th'
      switch (d % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    onChange(`${dayNumber}${suffix(dayNumber)} of every month`)
    setIsOpen(false)
  }

  // Format label for display trigger
  const displayLabel = () => {
    if (!value) return placeholder
    if (mode === 'day-of-month') return value
    if (mode === 'month') {
      const d = parseDate(value)
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }
    const d = parseDate(value)
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    }
    return value
  }

  return (
    <div 
      ref={containerRef}
      className={`date-picker-container ${className}`}
      style={{ 
        position: 'relative', 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        display: 'block',
        boxSizing: 'border-box'
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="date-picker-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#ffffff',
          border: isOpen ? '1px solid #be123c' : '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '9px 12px',
          minHeight: '38px',
          boxSizing: 'border-box',
          color: value ? '#0f172a' : '#94a3b8',
          fontSize: '13px',
          fontWeight: value ? 600 : 400,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: isOpen ? '0 0 0 3px rgba(190, 18, 60, 0.08)' : 'none',
          width: '100%',
          outline: 'none',
          textAlign: 'left'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          <CalendarIcon size={15} color="#be123c" style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {displayLabel()}
          </span>
        </span>
        <span style={{ fontSize: '11px', color: '#94a3b8', flexShrink: 0, fontWeight: 500 }}>Select</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 9999,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '0 12px 30px -4px rgba(0,0,0,0.12), 0 4px 12px -2px rgba(0,0,0,0.06)',
            width: '280px',
            animation: 'fadeInSlide 0.15s ease-out'
          }}
        >
          {mode === 'day-of-month' ? (
            /* Recurring day selector (1st to 31st) */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>Select Collection Day</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Every Month</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                  const isCur = value.includes(`${day}st`) || value.includes(`${day}nd`) || value.includes(`${day}rd`) || value.includes(`${day}th`)
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDayOfMonthOnly(day)}
                      style={{
                        padding: '6px 0',
                        fontSize: '11.5px',
                        fontWeight: isCur ? 700 : 500,
                        borderRadius: '6px',
                        border: 'none',
                        background: isCur ? '#be123c' : 'transparent',
                        color: isCur ? '#fff' : '#334155',
                        cursor: 'pointer',
                        transition: 'background 0.1s'
                      }}
                      onMouseEnter={e => { if (!isCur) e.currentTarget.style.background = '#f1f5f9' }}
                      onMouseLeave={e => { if (!isCur) e.currentTarget.style.background = 'transparent' }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Full Calendar Picker */
            <div>
              {/* Header: Month/Year navigation */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <button
                  type="button"
                  onClick={prevMonth}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b'
                  }}
                  title="Previous month"
                >
                  <ChevronLeft size={16} />
                </button>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {monthNames[month]} {year}
                </div>
                <button
                  type="button"
                  onClick={nextMonth}
                  style={{
                    background: 'transparent',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#64748b'
                  }}
                  title="Next month"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '6px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                  <span key={i} style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>
                    {d}
                  </span>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                {/* Empty cells before 1st of month */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const isSelected = value === dayDateStr
                  const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      style={{
                        padding: '6px 0',
                        fontSize: '12px',
                        fontWeight: isSelected ? 700 : isToday ? 600 : 500,
                        borderRadius: '6px',
                        border: isToday && !isSelected ? '1px solid #be123c' : 'none',
                        background: isSelected ? '#be123c' : 'transparent',
                        color: isSelected ? '#ffffff' : isToday ? '#be123c' : '#1e293b',
                        cursor: 'pointer',
                        transition: 'background 0.1s'
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#f8fafc' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Quick Today button */}
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0]
                    onChange(todayStr)
                    setIsOpen(false)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#be123c',
                    cursor: 'pointer',
                    padding: '2px 4px'
                  }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange('')
                    setIsOpen(false)
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '11px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '2px 4px'
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
