'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  badge?: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: (string | SelectOption)[]
  icon?: React.ReactNode
  placeholder?: string
  width?: string | number
  className?: string
  disabled?: boolean
}

export function CustomSelect({
  value,
  onChange,
  options,
  icon,
  placeholder = 'Select option',
  width,
  className = '',
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Normalize options
  const normalizedOptions: SelectOption[] = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const selectedOption = normalizedOptions.find(o => o.value === value) || {
    value,
    label: value || placeholder
  }

  // Close on outside click
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

  return (
    <div 
      ref={dropdownRef}
      className={`custom-select-container ${className}`}
      style={{ 
        position: 'relative', 
        width: width ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        display: width && width !== '100%' ? 'inline-block' : 'block',
        boxSizing: 'border-box'
      }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="custom-select-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          background: '#ffffff',
          border: isOpen ? '1px solid #be123c' : '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 12px',
          color: '#334155',
          fontSize: '12px',
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '0 0 0 3px rgba(190, 18, 60, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
          width: '100%',
          outline: 'none',
          userSelect: 'none'
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          {icon && <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
          {selectedOption.icon && <span style={{ flexShrink: 0 }}>{selectedOption.icon}</span>}
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            color: value ? '#0f172a' : '#94a3b8' 
          }}>
            {selectedOption.label}
          </span>
          {selectedOption.badge && (
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: '#f1f5f9',
              color: '#475569',
              fontWeight: 600
            }}>
              {selectedOption.badge}
            </span>
          )}
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
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: '100%',
            width: 'max-content',
            maxWidth: '320px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
            padding: '4px',
            zIndex: 9999,
            maxHeight: '260px',
            overflowY: 'auto',
            animation: 'fadeInSlide 0.15s ease-out'
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#be123c' : '#334155',
                  background: isSelected ? '#fff1f2' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  {opt.icon && <span>{opt.icon}</span>}
                  <span style={{ whiteSpace: 'nowrap' }}>{opt.label}</span>
                </span>
                {isSelected && <Check size={14} color="#be123c" style={{ flexShrink: 0 }} />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
