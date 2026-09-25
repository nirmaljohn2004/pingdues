'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Users, CheckCircle2, Clock3, AlertTriangle } from 'lucide-react'

export type DueFilterType = 'all' | 'paid' | 'current' | 'arrears'

interface StatusFilterDropdownProps {
  value: DueFilterType
  onChange: (value: DueFilterType) => void
  counts: {
    all: number
    paid: number
    current: number
    arrears: number
  }
  width?: string | number
  className?: string
}

export function StatusFilterDropdown({
  value,
  onChange,
  counts,
  width = '100%',
  className = ''
}: StatusFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
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

  const options = [
    {
      id: 'all' as const,
      label: 'All Members',
      shortLabel: 'All',
      count: counts.all,
      icon: Users,
      color: '#0f172a',
      badgeBg: '#f1f5f9',
      badgeColor: '#475569'
    },
    {
      id: 'paid' as const,
      label: 'Paid This Month',
      shortLabel: 'Paid',
      count: counts.paid,
      icon: CheckCircle2,
      color: '#059669',
      badgeBg: '#ecfdf5',
      badgeColor: '#059669'
    },
    {
      id: 'current' as const,
      label: 'Current Month Due',
      shortLabel: 'Current Due',
      count: counts.current,
      icon: Clock3,
      color: '#d97706',
      badgeBg: '#fffbeb',
      badgeColor: '#d97706'
    },
    {
      id: 'arrears' as const,
      label: 'Prior Months Overdue',
      shortLabel: 'Prior Overdue',
      count: counts.arrears,
      icon: AlertTriangle,
      color: '#be123c',
      badgeBg: '#fff1f2',
      badgeColor: '#be123c'
    }
  ]

  const currentOption = options.find(o => o.id === value) || options[0]
  const CurrentIcon = currentOption.icon

  return (
    <div 
      ref={dropdownRef} 
      className={`status-filter-dropdown-container ${className}`} 
      style={{ position: 'relative', width }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#ffffff',
          border: isOpen ? '1px solid #be123c' : '1px solid rgba(0,0,0,0.1)',
          padding: '9px 12px',
          borderRadius: '8px',
          color: '#334155',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen 
            ? '0 0 0 3px rgba(190, 18, 60, 0.1)' 
            : '0 1px 2px rgba(0,0,0,0.02)',
          boxSizing: 'border-box',
          height: '38px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <CurrentIcon size={15} color={currentOption.color} style={{ flexShrink: 0 }} />
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            color: '#0f172a'
          }}>
            {currentOption.label} ({currentOption.count})
          </span>
        </div>
        <ChevronDown 
          size={14} 
          style={{ 
            color: '#64748b', 
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            flexShrink: 0,
            marginLeft: '4px'
          }} 
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 1000,
            minWidth: '220px',
            width: '100%',
            maxWidth: 'calc(100vw - 32px)',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            padding: '6px',
            animation: 'fadeInSlide 0.15s ease',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ 
            padding: '6px 8px 4px', 
            fontSize: '11px', 
            fontWeight: 700, 
            color: '#94a3b8', 
            textTransform: 'uppercase', 
            letterSpacing: '0.04em' 
          }}>
            Filter By Status
          </div>

          {options.map((opt) => {
            const isSelected = value === opt.id
            const Icon = opt.icon

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onChange(opt.id)
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 0,
                  background: isSelected ? '#f8fafc' : 'transparent',
                  color: isSelected ? '#0f172a' : '#475569',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <Icon size={15} color={opt.color} style={{ flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap' }}>{opt.label}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: opt.badgeBg,
                      color: opt.badgeColor
                    }}
                  >
                    {opt.count}
                  </span>
                  {isSelected && <Check size={14} color="#be123c" strokeWidth={2.5} />}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StatusFilterDropdown
