import { useState } from 'react'
import { Hexagon } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function AuthScreen() {
  const { authMode, setAuthMode, setIsAuthenticated, setShowLanding } = useStore()
  const [loginOtpSent, setLoginOtpSent] = useState(false)
  const [registerOtpSent, setRegisterOtpSent] = useState(false)

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticated(true)
  }

  return (
    <div className="auth-split">
      <div className="auth-brand">
        <div className="auth-brand-content">
          <div className="brand" style={{ color: '#fff', padding: '0 0 20px', display: 'flex', alignItems: 'center' }}>
            <div 
              onClick={() => setShowLanding(true)}
              style={{ background: '#fff', borderRadius: '12px', padding: '8px 16px', display: 'inline-flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }}
              title="Back to Pingdues Home"
            >
              <img 
                src="/logo.png" 
                alt="pingdues" 
                style={{ 
                  height: '32px', 
                  width: 'auto', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
          </div>
          <h1>Manage your workspace seamlessly.</h1>
          <p>Automate fee collection, track payments, and send WhatsApp reminders effortlessly.</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div style={{ marginBottom: '14px' }}>
            <button 
              type="button" 
              onClick={() => setShowLanding(true)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer', padding: 0 }}
            >
              ← Back to Pingdues home
            </button>
          </div>
          <div className="auth-header">
            <h2>{authMode === 'login' ? 'Welcome back' : 'Create an account'}</h2>
            <p>{authMode === 'login' ? 'Enter your details to access your workspace.' : 'Set up your workspace to get started.'}</p>
          </div>
          
          {authMode === 'login' ? (
            <form onSubmit={onLogin}>
              <div className="auth-fields">
                <label className="form-label">Phone number
                  <input type="tel" required placeholder="+91 98765 43210" disabled={loginOtpSent} />
                </label>
                
                {loginOtpSent && (
                  <label className="form-label">One-Time Password
                    <input type="text" required placeholder="123456" autoFocus />
                  </label>
                )}

                {!loginOtpSent ? (
                  <button type="button" className="secondary-button" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }} onClick={() => setLoginOtpSent(true)}>Send OTP</button>
                ) : (
                  <button type="submit" className="primary-button" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>Sign in</button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={onRegister}>
              <div className="auth-fields">
                <div className="form-section-label" style={{ marginBottom: '12px' }}>Workspace details</div>
                <label className="form-label">Workspace name
                  <input type="text" required placeholder="e.g. FitZone Gym" disabled={registerOtpSent} />
                </label>
                <div className="auth-form-row">
                  <label className="form-label" style={{ margin: 0 }}>Owner name
                    <input type="text" required placeholder="e.g. Rahul Kumar" disabled={registerOtpSent} />
                  </label>
                  <label className="form-label" style={{ margin: 0 }}>Phone number
                    <input type="tel" required placeholder="+91 98765 43210" disabled={registerOtpSent} />
                  </label>
                </div>
                
                {registerOtpSent && (
                  <label className="form-label" style={{ marginTop: '12px' }}>One-Time Password
                    <input type="text" required placeholder="123456" autoFocus />
                  </label>
                )}

                {!registerOtpSent ? (
                  <button type="button" className="secondary-button" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }} onClick={() => setRegisterOtpSent(true)}>Send OTP</button>
                ) : (
                  <button type="submit" className="primary-button" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }}>Create account</button>
                )}
              </div>
            </form>
          )}

          <div className="auth-footer">
            {authMode === 'login' ? (
              <p>Don&apos;t have an account? <button type="button" onClick={() => { setAuthMode('register'); setLoginOtpSent(false); }}>Sign up</button></p>
            ) : (
              <p>Already have an account? <button type="button" onClick={() => { setAuthMode('login'); setRegisterOtpSent(false); }}>Sign in</button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
