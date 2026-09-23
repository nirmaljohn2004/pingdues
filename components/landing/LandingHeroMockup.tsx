'use client'

import React from 'react'
import { 
  Users, 
  Layers, 
  CircleDollarSign, 
  TrendingUp, 
  ChevronDown, 
  CheckCircle2, 
  Bell, 
  ArrowUpRight,
  TrendingDown,
  Clock,
  AlertCircle
} from 'lucide-react'

export default function LandingHeroMockup() {
  return (
    <div className="landing-mockup-wrapper">
      {/* Red Hexagonal Brand 3D Shield in Background Matching Image 2 */}
      <div className="mockup-hex-backdrop">
        <svg viewBox="0 0 500 500" className="mockup-hex-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hexRadial" cx="60%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="45%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#70092b" />
            </radialGradient>
            <linearGradient id="hexInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#be123c" />
              <stop offset="100%" stopColor="#4c0519" />
            </linearGradient>
            <filter id="shieldShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feDropShadow dx="-10" dy="25" stdDeviation="30" floodColor="#881337" floodOpacity="0.45" />
            </filter>
          </defs>
          {/* Outer 3D Hexagon */}
          <path 
            d="M250 40 L450 155 L450 385 L250 500 L50 385 L50 155 Z" 
            fill="url(#hexRadial)" 
            filter="url(#shieldShadow)"
          />
          {/* Beveled Top Highlight */}
          <path 
            d="M250 40 L450 155 L250 200 L50 155 Z" 
            fill="#ffffff" 
            opacity="0.12" 
          />
          {/* Recessed Inner Hexagon Chamber */}
          <path 
            d="M250 120 L390 200 L390 360 L250 440 L110 360 L110 200 Z" 
            fill="url(#hexInnerGrad)" 
            opacity="0.95"
          />
          {/* Center Brand Cutout Accent */}
          <path 
            d="M250 170 C290 170 320 200 320 240 C320 275 295 305 260 310 L260 370 L240 370 L240 300 C210 295 190 270 190 240 C190 200 215 170 250 170 Z" 
            fill="#be123c"
            opacity="0.7"
          />
        </svg>
        <div className="hex-handwritten-badge">
          <span>Collect</span>
          <span>Manage</span>
          <span>Grow Together</span>
        </div>
      </div>

      {/* 3D Angled Slate Dashboard Card */}
      <div className="landing-dashboard-screen">
        {/* Topbar of the mockup */}
        <div className="mockup-topbar">
          <div className="mockup-logo-area">
            <img src="/logo.png" alt="pingdues" className="mockup-logo" />
          </div>
          <div className="mockup-top-right">
            <span className="mockup-icon-btn"><Bell size={13} /></span>
            <div className="mockup-avatar">RK</div>
            <ChevronDown size={12} color="#94a3b8" />
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="mockup-inner-layout">
          {/* Mini Sidebar */}
          <div className="mockup-mini-sidebar">
            <div className="mockup-nav-item active">
              <span className="nav-hex-icon">⬡</span>
              Overview
            </div>
            <div className="mockup-nav-item">
              <span className="nav-icon-subtle">👥</span> Members
            </div>
            <div className="mockup-nav-item">
              <span className="nav-icon-subtle">👥</span> Groups
            </div>
            <div className="mockup-nav-item">
              <span className="nav-icon-subtle">💳</span> Collections
            </div>
            <div className="mockup-nav-item">
              <span className="nav-icon-subtle">📊</span> Reports
            </div>
            <div className="mockup-nav-item">
              <span className="nav-icon-subtle">⚙️</span> Settings
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="mockup-main">
            {/* Header Greeting */}
            <div className="mockup-greeting-row">
              <div>
                <h4 className="mockup-greeting">Good evening, Riya 👋</h4>
                <p className="mockup-subtext">1 paid, 3 payments awaiting settlement</p>
              </div>
              <div className="mockup-pill-btn">
                <span>Current month</span>
                <ChevronDown size={11} />
              </div>
            </div>

            {/* 4 Key Stat Cards Matching Image 2 */}
            <div className="mockup-stats-grid">
              {/* Card 1: Collected this month */}
              <div className="mockup-stat-card">
                <div className="stat-card-icon-wrap mint-icon-wrap">
                  <CheckCircle2 size={13} color="#059669" />
                </div>
                <span className="stat-label">Collected this month</span>
                <div className="stat-value">₹2,400</div>
                <div className="stat-trend positive">
                  <TrendingUp size={10} /> +12.8%
                </div>
              </div>

              {/* Card 2: Collection rate */}
              <div className="mockup-stat-card">
                <div className="stat-card-icon-wrap pink-icon-wrap">
                  <span style={{ fontSize: '11px', color: '#be123c', fontWeight: 800 }}>%</span>
                </div>
                <span className="stat-label">Collection rate</span>
                <div className="stat-value">29%</div>
                <div className="stat-trend positive">
                  <TrendingUp size={10} /> +4.2%
                </div>
              </div>

              {/* Card 3: Pending amount */}
              <div className="mockup-stat-card">
                <div className="stat-card-icon-wrap orange-icon-wrap">
                  <Clock size={13} color="#ea580c" />
                </div>
                <span className="stat-label">Pending amount</span>
                <div className="stat-value">₹6,000</div>
                <div className="stat-trend negative">
                  <TrendingDown size={10} /> -8.1%
                </div>
              </div>

              {/* Card 4: Overdue accounts */}
              <div className="mockup-stat-card">
                <div className="stat-card-icon-wrap blue-icon-wrap">
                  <AlertCircle size={13} color="#2563eb" />
                </div>
                <span className="stat-label">Overdue accounts</span>
                <div className="stat-value">1</div>
                <div className="stat-trend overdue-tag">
                  -3 this week
                </div>
              </div>
            </div>

            {/* Bottom Row: Donut overview preview */}
            <div className="mockup-lower-panel">
              <div className="mockup-panel-title">
                <div>
                  <strong>Collection overview</strong>
                  <span className="mockup-sub-members">Current month · 4 members</span>
                </div>
                <span className="view-col-link">View collections →</span>
              </div>
              <div className="mockup-donut-split">
                <div className="mockup-mini-donut">
                  <div className="mockup-donut-circle">
                    <span className="pct">29%</span>
                  </div>
                </div>
                <div className="mockup-mini-legend">
                  <div className="leg-item"><span className="leg-dot red"></span> Paid: 1</div>
                  <div className="leg-item"><span className="leg-dot orange"></span> Pending: 2</div>
                  <div className="leg-item"><span className="leg-dot darkred"></span> Overdue: 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pill: Payment received notification with WhatsApp badge */}
      <div className="mockup-floating-pill">
        <div className="floating-wa-badge">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z" />
          </svg>
        </div>
        <div className="floating-pill-text">
          <strong className="pill-title">Payment received!</strong>
          <span className="pill-desc">Arjun has paid <strong>₹1,500</strong></span>
          <span className="pill-time">2 minutes ago</span>
        </div>
      </div>
    </div>
  )
}
