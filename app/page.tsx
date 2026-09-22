'use client'

import { useStore } from '@/store/useStore'
import AuthScreen from '@/components/auth/AuthScreen'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import Overview from '@/components/dashboard/Overview'
import Members from '@/components/dashboard/Members'
import GroupsTab from '@/components/dashboard/Groups'
import Collections from '@/components/dashboard/Collections'
import MemberModals from '@/components/modals/MemberModals'
import { GroupModals } from '@/components/modals/GroupModals'
import { InvoiceModal } from '@/components/modals/InvoiceModal'
import { RecordPaymentModal } from '@/components/modals/RecordPaymentModal'
import { Check } from 'lucide-react'

export default function Page() {
  const { isAuthenticated, activeTab, menuOpen, toast } = useStore()

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <main className="app-shell">
      <Sidebar />
      
      <section className="main-content">
        <Topbar />
        <div className="content-wrap">
          {activeTab === 'Overview' && <Overview />}
          {activeTab === 'Members' && <Members />}
          {activeTab === 'Groups' && <GroupsTab />}
          {activeTab === 'Collections' && <Collections />}
          {/* Reminders and Settings temporarily disabled for core module focus */}
          {(activeTab === 'Reminders' || activeTab === 'Settings') && (
            <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>
              <h2>Coming Soon</h2>
              <p>This module is currently being upgraded.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <MemberModals />
      <GroupModals />
      <InvoiceModal />
      <RecordPaymentModal />
      
      {toast && (
        <div className="toast">
          <Check />{toast}
        </div>
      )}
    </main>
  )
}
