'use client'

import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import LandingHeroMockup from './LandingHeroMockup'
import { 
  ArrowRight, 
  Check, 
  Zap, 
  Users, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Bell, 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  Smartphone, 
  Send, 
  Star,
  CheckCircle,
  Menu,
  X
} from 'lucide-react'

export default function LandingPage() {
  const { setAuthMode, setShowLanding } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [demoModalOpen, setDemoModalOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState('')
  const [demoSubmitted, setDemoSubmitted] = useState(false)

  const handleLogin = () => {
    setAuthMode('login')
    setShowLanding(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleRegister = () => {
    setAuthMode('register')
    setShowLanding(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookDemo = (e: React.FormEvent) => {
    e.preventDefault()
    setDemoSubmitted(true)
    setTimeout(() => {
      setDemoSubmitted(false)
      setDemoModalOpen(false)
      setDemoEmail('')
    }, 2000)
  }

  return (
    <div className="landing-container">
      {/* 1. Header Navigation */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <img 
              src="/logo.png" 
              alt="Pingdues" 
              className="landing-logo-img"
            />
          </div>

          <nav className="landing-nav-links">
            <a href="#features">Product</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">Pricing</a>
            <a href="#mobile-experience">For Clubs</a>
            <a href="#testimonials">Resources</a>
          </nav>

          <div className="landing-nav-actions">
            <button 
              type="button" 
              onClick={handleLogin} 
              className="landing-btn-signin"
            >
              Sign in
            </button>
            <button 
              type="button" 
              onClick={handleRegister} 
              className="landing-btn-getstarted"
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button 
            type="button"
            className="landing-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="landing-mobile-dropdown">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Product</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#mobile-experience" onClick={() => setMobileMenuOpen(false)}>For Clubs</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Resources</a>
            <div className="landing-mobile-auth-actions">
              <button type="button" onClick={handleLogin} className="landing-btn-signin-mobile">Sign in</button>
              <button type="button" onClick={handleRegister} className="landing-btn-getstarted-mobile">Get Started <ArrowRight size={14} /></button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="landing-hero-section">
        <div className="landing-hero-grid">
          {/* Left Text & CTA */}
          <div className="landing-hero-content">
            <div className="landing-hero-eyebrow">FEES MADE SIMPLE</div>
            <h1 className="landing-hero-title">
              Every member.<br />
              <span className="accent-crimson">On time.</span>
            </h1>
            <p className="landing-hero-subtitle">
              Smart fee collection and member management for modern clubs. Automate. Simplify. Grow.
            </p>

            <div className="landing-hero-buttons">
              <button 
                type="button" 
                onClick={handleRegister} 
                className="landing-hero-primary-btn"
              >
                Get Started <ArrowRight size={16} />
              </button>
              <button 
                type="button" 
                onClick={() => setDemoModalOpen(true)}
                className="landing-hero-secondary-btn"
              >
                Book a Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="landing-trust-badges">
              <div className="trust-badge-item">
                <Check size={14} className="trust-check" />
                <span>No credit card required</span>
              </div>
              <div className="trust-badge-item">
                <Check size={14} className="trust-check" />
                <span>Setup in 5 minutes</span>
              </div>
              <div className="trust-badge-item">
                <Check size={14} className="trust-check" />
                <span>Loved by 2,000+ clubs</span>
              </div>
            </div>
          </div>

          {/* Right Live 3D Perspective Showcase */}
          <div className="landing-hero-showcase">
            <LandingHeroMockup />
          </div>
        </div>
      </section>

      {/* 3. Features Section: "Built for clubs. Designed for simplicity." */}
      <section id="features" className="landing-features-section">
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">EVERYTHING YOU NEED</div>
          <h2 className="landing-section-title">Built for clubs. Designed for simplicity.</h2>
          <p className="landing-section-desc">
            Powerful features to manage your members and payments — without the complex tools.
          </p>
        </div>

        <div className="landing-features-grid">
          {/* Feature 1 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Zap size={20} />
            </div>
            <h3>Automated Collections</h3>
            <p>Create recurring fees and automate payment reminders via WhatsApp and email.</p>
          </div>

          {/* Feature 2 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Users size={20} />
            </div>
            <h3>Member Management</h3>
            <p>Easily manage members, batches and groups in one single, organized workspace.</p>
          </div>

          {/* Feature 3 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <CreditCard size={20} />
            </div>
            <h3>Multiple Payment Options</h3>
            <p>Accept UPI, cards and net banking with ultra-secure, automated settlement.</p>
          </div>

          {/* Feature 4 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <BarChart3 size={20} />
            </div>
            <h3>Real-time Tracking</h3>
            <p>See payments, pending dues and collection reports with instant reconciliation.</p>
          </div>

          {/* Feature 5 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Receipt size={20} />
            </div>
            <h3>Automatic Receipts</h3>
            <p>Instant digital receipts branded with your club logo after every settlement.</p>
          </div>

          {/* Feature 6 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Bell size={20} />
            </div>
            <h3>Smart Reminders</h3>
            <p>Reduce manual follow-ups with intelligent, respectful automated payment reminders.</p>
          </div>

          {/* Feature 7 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <Building2 size={20} />
            </div>
            <h3>Multi-branch Support</h3>
            <p>Manage multiple locations and academies under one unified master account.</p>
          </div>

          {/* Feature 8 */}
          <div className="landing-feature-card">
            <div className="feature-icon-box">
              <ShieldCheck size={20} />
            </div>
            <h3>Secure & Reliable</h3>
            <p>Your data and member records are protected with bank-grade 256-bit encryption.</p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section: "Get started in minutes." */}
      <section id="how-it-works" className="landing-how-section">
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">HOW IT WORKS</div>
          <h2 className="landing-section-title">Get started in minutes.</h2>
          <p className="landing-section-desc">
            From setup to collection, everything is simple, guided and fully automated.
          </p>
        </div>

        <div className="landing-steps-row">
          {/* Step 1 */}
          <div className="landing-step-item">
            <div className="step-circle-number">1</div>
            <div className="step-card-box">
              <div className="step-icon-wrap">
                <Building2 size={22} />
              </div>
              <h4>Create your club</h4>
              <p>Set up your club details in minutes.</p>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 2 */}
          <div className="landing-step-item">
            <div className="step-circle-number">2</div>
            <div className="step-card-box">
              <div className="step-icon-wrap">
                <Users size={22} />
              </div>
              <h4>Add members</h4>
              <p>Import or add members individually.</p>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 3 */}
          <div className="landing-step-item">
            <div className="step-circle-number">3</div>
            <div className="step-card-box">
              <div className="step-icon-wrap">
                <CreditCard size={22} />
              </div>
              <h4>Schedule fees</h4>
              <p>Set up monthly or custom fees.</p>
            </div>
          </div>

          <div className="step-arrow-divider">→</div>

          {/* Step 4 */}
          <div className="landing-step-item">
            <div className="step-circle-number">4</div>
            <div className="step-card-box">
              <div className="step-icon-wrap">
                <Send size={22} />
              </div>
              <h4>Let Pingdues do the rest</h4>
              <p>We send reminders, collect payments and keep you updated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mobile & Member Experience: "A better experience for everyone." */}
      <section id="mobile-experience" className="landing-mobile-section">
        <div className="landing-mobile-container">
          {/* Left: Realistic Smartphone Phone Mockup */}
          <div className="phone-mockup-wrapper">
            <div className="phone-device-frame">
              <div className="phone-camera-island"></div>
              
              {/* WhatsApp Chat UI Screen */}
              <div className="phone-screen-content">
                {/* Chat Header */}
                <div className="wa-header">
                  <span className="wa-back">‹</span>
                  <div className="wa-avatar">
                    <img src="/logo.png" alt="Pingdues" />
                  </div>
                  <div className="wa-contact-info">
                    <div className="wa-name">Pingdues <span className="wa-verified">✓</span></div>
                    <div className="wa-status">Business Account</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="wa-chat-body">
                  <div className="wa-bubble received">
                    <p className="wa-msg-text">
                      Hi Arjun,<br /><br />
                      Your monthly fee of <strong>₹1,500</strong> is due for <strong>Football Academy</strong>.<br /><br />
                      Click below to pay securely ⚡
                    </p>
                    <button type="button" className="wa-pay-btn">Pay Now</button>
                    <span className="wa-time">10:28 AM</span>
                  </div>

                  <div className="wa-bubble sent">
                    <p className="wa-msg-text">Payment successful! Thank you! 😊</p>
                    <span className="wa-time-check">10:30 AM <Check size={11} /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlapping Floating Success Card */}
            <div className="phone-receipt-floating-card">
              <div className="receipt-check-circle">
                <Check size={20} color="#fff" />
              </div>
              <div className="receipt-status-text">Payment Successful</div>
              <div className="receipt-amount-text">₹1,500</div>
              <div className="receipt-meta">12 Sep 2024, 10:29 AM<br/>Txn ID: PD928374928</div>
              <div className="receipt-footer-text">
                <strong>Thank you!</strong>
                <span>Your payment has been received.</span>
              </div>
            </div>
          </div>

          {/* Right: Explanatory Content & Bullets */}
          <div className="landing-mobile-copy">
            <h2 className="landing-mobile-title">
              A better experience for everyone.
            </h2>
            <p className="landing-mobile-desc">
              A simple, seamless payment experience for your members. No app downloads. Just click, pay and play.
            </p>

            <div className="experience-bullet-list">
              <div className="experience-bullet-item">
                <div className="bullet-badge-icon">
                  <Send size={16} />
                </div>
                <div>
                  <strong>WhatsApp payment links</strong>
                  <p>Send direct links members can pay with one click.</p>
                </div>
              </div>

              <div className="experience-bullet-item">
                <div className="bullet-badge-icon">
                  <CreditCard size={16} />
                </div>
                <div>
                  <strong>Multiple payment options</strong>
                  <p>Supports UPI, cards, netbanking and wallets.</p>
                </div>
              </div>

              <div className="experience-bullet-item">
                <div className="bullet-badge-icon">
                  <Receipt size={16} />
                </div>
                <div>
                  <strong>Instant receipts</strong>
                  <p>Automated payment confirmations sent right back.</p>
                </div>
              </div>

              <div className="experience-bullet-item">
                <div className="bullet-badge-icon">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong>No login required</strong>
                  <p>Members never need to download apps or remember passwords.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Social Proof / Testimonials: "Loved by club owners across India." */}
      <section id="testimonials" className="landing-testimonials-section">
        <div className="landing-section-header">
          <div className="landing-section-eyebrow">TRUSTED BY CLUBS</div>
          <h2 className="landing-section-title">Loved by club owners across India.</h2>
          <p className="landing-section-desc">
            Join 2,000+ clubs that trust Pingdues for their fee collection and member management.
          </p>
        </div>

        <div className="landing-testimonials-grid">
          {/* Testimonial 1 */}
          <div className="landing-testimonial-card">
            <p className="testimonial-quote">
              &ldquo;Pingdues has completely simplified our fee collection process. No more chasing payments!&rdquo;
            </p>
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#be123c" color="#be123c" />
              ))}
            </div>
            <div className="testimonial-author">
              <div className="author-avatar peach-avatar">A</div>
              <div>
                <strong>Arun Nair</strong>
                <small>Football Academy, Kochi</small>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="landing-testimonial-card">
            <p className="testimonial-quote">
              &ldquo;The automated reminders and reports save us hours every month. Highly recommended!&rdquo;
            </p>
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#be123c" color="#be123c" />
              ))}
            </div>
            <div className="testimonial-author">
              <div className="author-avatar pink-avatar">S</div>
              <div>
                <strong>Sneha Varghese</strong>
                <small>Dance Studio, Thrissur</small>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="landing-testimonial-card">
            <p className="testimonial-quote">
              &ldquo;Simple, clean and powerful. Exactly what our sports academy and club needed.&rdquo;
            </p>
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#be123c" color="#be123c" />
              ))}
            </div>
            <div className="testimonial-author">
              <div className="author-avatar mint-avatar">R</div>
              <div>
                <strong>Rahul Menon</strong>
                <small>Badminton Club, Calicut</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Crimson Call-to-Action Banner */}
      <section className="landing-cta-banner-wrap">
        <div className="landing-cta-banner">
          <div className="cta-banner-content">
            <div className="cta-banner-eyebrow">READY TO SIMPLIFY YOUR CLUB PAYMENTS?</div>
            <h2 className="cta-banner-title">Get started with Pingdues today.</h2>
            <p className="cta-banner-subtitle">No credit card required. Setup in minutes.</p>
            
            <button 
              type="button" 
              onClick={handleRegister} 
              className="cta-banner-btn"
            >
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          {/* Brand Info */}
          <div className="footer-col-brand">
            <img src="/logo.png" alt="Pingdues" className="footer-logo-img" />
            <p className="footer-tagline">Fees made simple for modern clubs.</p>
          </div>

          {/* Links 1 */}
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">Pricing</a></li>
              <li><a href="#mobile-experience">For Clubs</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div className="footer-col">
            <h5>Resources</h5>
            <ul>
              <li><a href="#how-it-works">Help Center</a></li>
              <li><a href="#testimonials">Blog</a></li>
              <li><button type="button" onClick={() => setDemoModalOpen(true)} className="footer-text-btn">Contact</button></li>
            </ul>
          </div>

          {/* Links 3: Socials */}
          <div className="footer-col">
            <h5>Follow us</h5>
            <div className="footer-social-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <span className="social-icon">IG</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <span className="social-icon">IN</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <span className="social-icon">YT</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">
                <span className="social-icon">X</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="landing-footer-bottom">
          <div>© {new Date().getFullYear()} Pingdues. All rights reserved.</div>
          <div className="footer-legal-links">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#support">Support</a>
          </div>
        </div>
      </footer>

      {/* Book a Demo Modal */}
      {demoModalOpen && (
        <div className="modal-backdrop" onClick={() => setDemoModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-head">
              <div>
                <span className="modal-kicker">PERSONALIZED TOUR</span>
                <h2>Book a Pingdues Demo</h2>
                <p>See how Pingdues can automate 100% of your club dues.</p>
              </div>
              <button type="button" className="icon-button" onClick={() => setDemoModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {demoSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle size={48} color="#059669" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Demo Request Received!</h3>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Our team will reach out to schedule your demo session within 2 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleBookDemo}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <label className="form-label">
                    Club or Academy Name
                    <input type="text" required placeholder="e.g. Spartan Fitness Club" />
                  </label>
                  <label className="form-label">
                    Your Name
                    <input type="text" required placeholder="e.g. Arun Nair" />
                  </label>
                  <label className="form-label">
                    Email address
                    <input 
                      type="email" 
                      required 
                      value={demoEmail} 
                      onChange={e => setDemoEmail(e.target.value)} 
                      placeholder="arun@club.com" 
                    />
                  </label>
                  <label className="form-label">
                    Phone / WhatsApp number
                    <input type="tel" required placeholder="+91 98765 43210" />
                  </label>
                </div>
                <div className="modal-footer" style={{ borderTop: 'none', padding: 0 }}>
                  <button type="button" className="secondary-button" onClick={() => setDemoModalOpen(false)}>Cancel</button>
                  <button type="submit" className="primary-button">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
