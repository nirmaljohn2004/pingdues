'use client'

import { useState, useEffect } from 'react'
import { Menu, Hexagon, Bell, ChevronDown, User, ShieldCheck, LogOut, Edit3, X } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function Topbar() {
  const { setMenuOpen, members, userProfile, updateUserProfile, setIsAuthenticated, setShowLanding, notify } = useStore()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false)

  // Form states for profile editing
  const [name, setName] = useState(userProfile.name)
  const [email, setEmail] = useState(userProfile.email)
  const [phone, setPhone] = useState(userProfile.phone)
  const [gymName, setGymName] = useState(userProfile.gymName)
  const [address, setAddress] = useState(userProfile.address || '')
  const [gstin, setGstin] = useState(userProfile.gstin || '')
  const [panNo, setPanNo] = useState(userProfile.panNo || '')
  const [aadhaarNo, setAadhaarNo] = useState(userProfile.aadhaarNo || '')
  const [bankAccount, setBankAccount] = useState(userProfile.bankAccount || '')
  const [ifscCode, setIfscCode] = useState(userProfile.ifscCode || '')

  useEffect(() => {
    setName(userProfile.name)
    setEmail(userProfile.email)
    setPhone(userProfile.phone)
    setGymName(userProfile.gymName)
    setAddress(userProfile.address || '')
    setGstin(userProfile.gstin || '')
    setPanNo(userProfile.panNo || '')
    setAadhaarNo(userProfile.aadhaarNo || '')
    setBankAccount(userProfile.bankAccount || '')
    setIfscCode(userProfile.ifscCode || '')
  }, [userProfile, editProfileModalOpen])

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      notify('Name and Email are required')
      return
    }
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      gymName: gymName.trim(),
      address: address.trim(),
      gstin: gstin.trim(),
      panNo: panNo.trim(),
      aadhaarNo: aadhaarNo.trim(),
      bankAccount: bankAccount.trim(),
      ifscCode: ifscCode.trim(),
      kycStatus: panNo && bankAccount ? 'Verified' : 'Pending'
    })
    notify('Profile & KYC details updated successfully!')
    setEditProfileModalOpen(false)
  }

  // Generate initials
  const initials = userProfile.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'RK'

  return (
    <>
      <header className="topbar">
        <button 
          className="icon-button mobile-menu" 
          aria-label="Open menu" 
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </button>
        
        <div className="mobile-brand">
          <img 
            src="/logo.png" 
            alt="pingdues" 
            style={{ 
              height: '32px', 
              width: 'auto', 
              objectFit: 'contain',
              display: 'block' 
            }} 
          />
        </div>
        
        <div className="topbar-actions">
          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="icon-button" 
              aria-label="Notifications" 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen)
                setProfileMenuOpen(false)
              }}
            >
              <Bell />
              <i />
            </button>
            
            {notificationsOpen && (
              <div className="notifications-dropdown" style={{ zIndex: 120 }}>
                <div className="notifications-header">Recent Activity</div>
                {members.filter(m => m.status === 'Paid').slice(0, 5).map(m => (
                  <div key={m.id} className="notification-item">
                    <div className={`member-avatar ${m.color}`} style={{ width: 32, height: 32, fontSize: 12 }}>
                      {m.initials}
                    </div>
                    <div className="notification-content">
                      <strong>{m.name}</strong> paid <span>{m.amount}</span>
                      <small>{m.due}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Round Profile Logo Avatar Button */}
          <div style={{ position: 'relative' }}>
            <div 
              className="top-profile" 
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen)
                setNotificationsOpen(false)
              }}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="profile-avatar">{initials}</div>
              <ChevronDown size={14} style={{ transition: 'transform 0.2s ease', transform: profileMenuOpen ? 'rotate(180deg)' : 'none' }} />
            </div>

            {/* Profile & KYC Popover Dropdown */}
            {profileMenuOpen && (
              <div 
                className="top-profile-dropdown"
                style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '310px',
                  background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: '16px', zIndex: 150
                }}
              >
                {/* Profile Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div className="profile-avatar" style={{ width: 42, height: 42, fontSize: '15px', fontWeight: 700 }}>
                    {initials}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userProfile.name}
                    </strong>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userProfile.gymName}
                    </span>
                  </div>
                </div>

                {/* KYC Badge Banner */}
                <div style={{
                  margin: '12px 0', padding: '10px 12px', borderRadius: '10px',
                  background: userProfile.kycStatus === 'Verified' ? '#f0fdf4' : '#fff7ed',
                  border: `1px solid ${userProfile.kycStatus === 'Verified' ? '#bbf7d0' : '#ffedd5'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={16} color={userProfile.kycStatus === 'Verified' ? '#166534' : '#c2410c'} />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: userProfile.kycStatus === 'Verified' ? '#166534' : '#c2410c' }}>
                      {userProfile.kycStatus === 'Verified' ? 'KYC Verified' : 'KYC Pending'}
                    </span>
                  </div>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '6px', background: '#fff', fontWeight: 700, color: userProfile.kycStatus === 'Verified' ? '#15803d' : '#c2410c' }}>
                    {userProfile.kycStatus === 'Verified' ? 'Active' : 'Action Required'}
                  </span>
                </div>

                {/* KYC Quick Summary */}
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px', padding: '0 4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>PAN Number:</span>
                    <strong style={{ color: '#334155' }}>{userProfile.panNo || 'Not added'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bank Payout:</span>
                    <strong style={{ color: '#334155' }}>{userProfile.bankAccount || 'Not added'}</strong>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditProfileModalOpen(true)
                      setProfileMenuOpen(false)
                    }}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#0f172a', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
                    }}
                  >
                    <Edit3 size={14} color="#be123c" /> Edit Profile Details & KYC
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthenticated(false)
                      setShowLanding(true)
                      setProfileMenuOpen(false)
                    }}
                    style={{
                      width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none',
                      background: '#fff1f2', color: '#be123c', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Edit Profile & Complete KYC Modal */}
      {editProfileModalOpen && (
        <div className="modal-backdrop" onClick={() => setEditProfileModalOpen(false)} style={{ zIndex: 300 }}>
          <section className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()} style={{ width: 'min(520px, 100%)', padding: '24px' }}>
            <div className="modal-head" style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <h2 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 700 }}>
                  Profile & KYC Settings
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Manage account details, business information, and bank payout KYC
                </p>
              </div>
              <button type="button" className="icon-button" onClick={() => setEditProfileModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Basic Profile Details Section */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={15} color="#be123c" /> Personal & Business Info
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Owner Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Gym / Centre Name</label>
                    <input
                      type="text"
                      value={gymName}
                      onChange={e => setGymName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Business Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Plot / Street / City / State"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              </div>

              {/* KYC & Banking Section */}
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#15803d" /> KYC & Bank Payout Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>PAN Card Number</label>
                    <input
                      type="text"
                      value={panNo}
                      onChange={e => setPanNo(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={e => setGstin(e.target.value.toUpperCase())}
                      placeholder="27AAAAA0000A1Z5"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Bank Account Number</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={e => setBankAccount(e.target.value)}
                      placeholder="HDFC Bank • •••• 4912"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>IFSC Code</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={e => setIfscCode(e.target.value.toUpperCase())}
                      placeholder="HDFC0001234"
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="secondary-button" onClick={() => setEditProfileModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Profile & KYC Details
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}
