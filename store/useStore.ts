import { create } from 'zustand'

export type Status = 'Paid' | 'Pending' | 'Overdue'

export type GroupPayment = {
  amount: string
  status: Status
  due?: string
  collectSchedule?: string
  startDate?: string
}

export type Member = {
  id: number
  name: string
  initials: string
  plan?: string
  amount?: string
  due?: string
  status: Status
  color: string
  phone: string
  email: string
  joined: string
  memberGroups?: string[]
  groupPayments?: Record<string, GroupPayment>  // per-group payment info
  groupStatus?: Record<string, 'Active' | 'On Gap'> // Active or On Gap status per group
  alternatePhone?: string
  admissionNo?: string
  dob?: string
  guardianName?: string
  address?: string
  remarks?: string        // owner notes / remarks about the member
  archived?: boolean      // true if member was archived/removed, keeping revenue history intact
}

export const seedMembers: Member[] = [
  {
    id: 1, name: 'Ananya Sharma', initials: 'AS', plan: 'Bharatanatyam Arangetram', amount: '₹1,20,000',
    due: 'Paid via Online Link, 9:42 AM', status: 'Paid', color: 'peach',
    phone: '+91 98765 43210', email: 'ananya.sharma@nritya.com', joined: '12 Jan 2024',
    memberGroups: ['Bharatanatyam Arangetram', 'Carnatic Music & Nattuvangam'],
    groupPayments: {
      'Bharatanatyam Arangetram': { amount: '₹1,20,000', status: 'Paid', due: 'Paid via Online Link, 9:42 AM' },
      'Carnatic Music & Nattuvangam': { amount: '₹25,000', status: 'Pending', due: 'Due in 3 days' },
    },
  },
  {
    id: 2, name: 'Rohan Varma', initials: 'RV', plan: 'Kathak Senior Diploma', amount: '₹85,000',
    due: 'Due today', status: 'Pending', color: 'lavender',
    phone: '+91 98123 45678', email: 'rohan.varma@nritya.com', joined: '04 Mar 2024',
    memberGroups: ['Kathak Senior Diploma'],
    groupPayments: {
      'Kathak Senior Diploma': { amount: '₹85,000', status: 'Pending', due: 'Due today' },
    },
  },
  {
    id: 3, name: 'Pooja Iyer', initials: 'PI', plan: 'Odissi Intensive Classical', amount: '₹95,000',
    due: 'Due in 2 days', status: 'Pending', color: 'mint',
    phone: '+91 99887 66554', email: 'pooja.iyer@nritya.com', joined: '21 Apr 2024',
    memberGroups: ['Odissi Intensive Classical', 'Kuchipudi Fellowship'],
    groupPayments: {
      'Odissi Intensive Classical': { amount: '₹95,000', status: 'Pending', due: 'Due in 2 days' },
      'Kuchipudi Fellowship': { amount: '₹45,000', status: 'Overdue', due: 'Overdue by 1 day' },
    },
  },
  {
    id: 4, name: 'Devendra Nair', initials: 'DN', plan: 'Contemporary Fusion Batch', amount: '₹60,000',
    due: 'Overdue by 5 days', status: 'Overdue', color: 'sky',
    phone: '+91 97654 32109', email: 'devendra.nair@nritya.com', joined: '17 Jun 2024',
    memberGroups: ['Contemporary Fusion Batch', 'Bharatanatyam Arangetram'],
    groupPayments: {
      'Contemporary Fusion Batch': { amount: '₹60,000', status: 'Overdue', due: 'Overdue by 5 days' },
      'Bharatanatyam Arangetram': { amount: '₹1,20,000', status: 'Paid', due: 'Paid on 01 Sep 2024' },
    },
  },
]

export interface GroupReminder {
  id: string
  stage: 1 | 2 | 3
  title: string
  dayOfMonth: number // 1..28
  time: string // e.g. "09:00 AM"
  channel: 'WhatsApp' | 'SMS' | 'All'
  enabled: boolean
  messageTemplate?: string
  lastSentAt?: string
  quotaConsumed?: boolean
}

export interface GroupDetails {
  id: string
  name: string
  groupImage?: string // image URL or base64 data URI
  billingType: 'One-time' | 'Recurring'
  feeAmount: string
  recursEvery?: string // e.g. 'Monthly', 'Quarterly', 'Yearly'
  dueDate?: string // e.g. '5th of every month' or specific date
  startDate?: string
  endDate?: string
  createdOn: string
  description?: string
  acceptInstallments?: boolean
  reminders?: GroupReminder[]
}

export const seedGroups: GroupDetails[] = [
  {
    id: '1', 
    name: 'Bharatanatyam Arangetram', 
    billingType: 'Recurring', 
    feeAmount: '₹1,20,000', 
    recursEvery: 'Yearly', 
    dueDate: '1st of every month', 
    startDate: '01 Jan 2024', 
    createdOn: '01 Jan 2024', 
    description: 'Advanced Margam preparation, live orchestra rehearsal & performance repertoire',
    reminders: [
      { id: 'rem-1', stage: 1, title: '1st Reminder (Initial Notice)', dayOfMonth: 1, time: '09:00 AM', channel: 'WhatsApp', enabled: true, messageTemplate: 'Hi {name}, friendly reminder that your academy fee of {amount} for {group} is due today.' },
      { id: 'rem-2', stage: 2, title: '2nd Reminder (Follow-up Notice)', dayOfMonth: 5, time: '10:00 AM', channel: 'WhatsApp', enabled: true, messageTemplate: 'Hi {name}, your academy fee of {amount} for {group} is currently pending. Please settle at your earliest.' },
      { id: 'rem-3', stage: 3, title: '3rd & Final Reminder (Urgent Warning)', dayOfMonth: 10, time: '06:00 PM', channel: 'WhatsApp', enabled: true, messageTemplate: 'URGENT: Hi {name}, fee of {amount} for {group} is overdue. Please complete payment immediately.' }
    ]
  },
  {
    id: '2', 
    name: 'Kathak Senior Diploma', 
    billingType: 'Recurring', 
    feeAmount: '₹85,000', 
    recursEvery: 'Yearly', 
    dueDate: '1st of every month', 
    startDate: '01 Jan 2024', 
    createdOn: '01 Jan 2024', 
    description: 'Lucknow & Jaipur gharana tatkar, thumri abhinaya, and bandish compositions',
    reminders: [
      { id: 'rem-1', stage: 1, title: '1st Reminder (Initial Notice)', dayOfMonth: 1, time: '09:30 AM', channel: 'WhatsApp', enabled: true, messageTemplate: 'Hi {name}, your annual fee of {amount} for {group} is due today.' },
      { id: 'rem-2', stage: 2, title: '2nd Reminder (Follow-up Notice)', dayOfMonth: 7, time: '11:00 AM', channel: 'WhatsApp', enabled: true, messageTemplate: 'Hi {name}, your annual fee of {amount} for {group} is pending.' },
      { id: 'rem-3', stage: 3, title: '3rd & Final Reminder (Urgent Warning)', dayOfMonth: 12, time: '05:00 PM', channel: 'WhatsApp', enabled: false, messageTemplate: 'URGENT: Hi {name}, fee of {amount} is overdue. Please pay now.' }
    ]
  },
  {
    id: '3', 
    name: 'Odissi Intensive Classical', 
    billingType: 'Recurring', 
    feeAmount: '₹95,000', 
    recursEvery: 'Yearly', 
    dueDate: '5th of every month', 
    startDate: '01 Feb 2024', 
    createdOn: '01 Feb 2024', 
    description: 'Chowka, Tribhanga posture techniques & Ashtapadi abhinaya training',
    reminders: [
      { id: 'rem-1', stage: 1, title: '1st Reminder (Initial Notice)', dayOfMonth: 5, time: '09:00 AM', channel: 'WhatsApp', enabled: true },
      { id: 'rem-2', stage: 2, title: '2nd Reminder (Follow-up Notice)', dayOfMonth: 10, time: '10:00 AM', channel: 'WhatsApp', enabled: true },
      { id: 'rem-3', stage: 3, title: '3rd & Final Reminder (Urgent Warning)', dayOfMonth: 15, time: '06:00 PM', channel: 'WhatsApp', enabled: true }
    ]
  },
  { 
    id: '4', 
    name: 'Kuchipudi Fellowship', 
    billingType: 'Recurring', 
    feeAmount: '₹1,50,000', 
    recursEvery: 'Yearly', 
    dueDate: '01 Jan every year', 
    startDate: '01 Jan 2024', 
    createdOn: '01 Jan 2024', 
    description: 'Full-year Tarangam brass plate dance & classical Yakshagana masterclasses', 
    reminders: [] 
  },
  { 
    id: '5', 
    name: 'Contemporary Fusion Batch', 
    billingType: 'One-time', 
    feeAmount: '₹60,000', 
    dueDate: 'On admission', 
    startDate: '15 Jan 2024', 
    createdOn: '15 Jan 2024', 
    description: 'Modern choreography, stage aesthetics and physical movement arts', 
    reminders: [] 
  },
  { 
    id: '6', 
    name: 'Carnatic Music & Nattuvangam', 
    billingType: 'Recurring', 
    feeAmount: '₹40,000', 
    recursEvery: 'Quarterly', 
    dueDate: '10th of every quarter', 
    startDate: '01 Jan 2024', 
    createdOn: '01 Jan 2024', 
    description: 'Rhythm cymbals, tala patterns & vocal accompaniment for dancers', 
    reminders: [] 
  },
]

export interface UserProfile {
  name: string
  email: string
  phone: string
  gymName: string
  gstin?: string
  address?: string
  kycStatus: 'Verified' | 'Pending' | 'Not Started'
  panNo?: string
  aadhaarNo?: string
  bankAccount?: string
  ifscCode?: string
}

export const initialUserProfile: UserProfile = {
  name: 'Riya Kapoor',
  email: 'riya.kapoor@nrityaveda.in',
  phone: '+91 98765 12345',
  gymName: 'Nritya Veda Academy of Fine Arts',
  gstin: '27AAAAA0000A1Z5',
  address: 'Plot 42, Cultural Enclave, Nritya Bhavan, Bangalore, KA',
  kycStatus: 'Verified',
  panNo: 'ABCDE1234F',
  aadhaarNo: 'XXXX-XXXX-9821',
  bankAccount: 'HDFC Bank • •••• 4912',
  ifscCode: 'HDFC0001234'
}

export type ModalType = 'add' | 'edit-member' | 'details' | 'remove' | 'payment' | 'reminder' | 'bulk-remind' | 'new-payment' | 'edit-payment' | 'remove-payment' | 'add-group' | 'edit-group' | 'add-members-to-group' | 'group-details' | 'invoice' | 'profile-settings' | null

export interface TransactionItem {
  id: string
  txnNumber: string
  memberName: string
  memberPhone: string
  memberEmail: string
  groupName: string
  amount: string
  paymentMethod: string
  status: 'Paid' | 'Pending' | 'Overdue'
  date: string
  time: string
  remarks?: string
}

interface AppState {
  showLanding: boolean
  isAuthenticated: boolean
  authMode: 'login' | 'register'
  setShowLanding: (show: boolean) => void
  setIsAuthenticated: (auth: boolean) => void
  setAuthMode: (mode: 'login' | 'register') => void

  activeTab: string
  menuOpen: boolean
  setActiveTab: (tab: string) => void
  setMenuOpen: (open: boolean) => void

  userProfile: UserProfile
  updateUserProfile: (updated: Partial<UserProfile>) => void

  members: Member[]
  groups: string[]
  groupDetailsList: GroupDetails[]
  setMembers: (updater: Member[] | ((prev: Member[]) => Member[])) => void
  setGroups: (updater: string[] | ((prev: string[]) => string[])) => void
  setGroupDetailsList: (updater: GroupDetails[] | ((prev: GroupDetails[]) => GroupDetails[])) => void
  addGroup: (group: GroupDetails) => void
  updateGroup: (id: string, updated: Partial<GroupDetails>) => void
  deleteGroup: (id: string) => void
  updateMember: (id: number, updated: Partial<Member>) => void
  toggleMemberGroupStatus: (memberId: number, groupName: string) => void

  addOrUpdateGroupReminder: (groupId: string, reminder: GroupReminder) => void
  deleteGroupReminder: (groupId: string, reminderId: string) => void
  toggleGroupReminder: (groupId: string, reminderId: string) => void
  triggerGroupReminderNow: (groupId: string, reminderId: string) => void

  modal: ModalType
  selectedMember: Member | null
  selectedGroup: GroupDetails | null
  selectedTransaction: TransactionItem | null
  setModal: (modal: ModalType) => void
  setSelectedMember: (member: Member | null) => void
  setSelectedGroup: (group: GroupDetails | null) => void
  setSelectedTransaction: (txn: TransactionItem | null) => void
  recordPayment: (memberId: number, groupName: string, amount: string, paymentMethod: string, remarks?: string) => void
  archiveMember: (memberId: number) => void

  toast: string
  setToast: (toast: string) => void
  notify: (message: string) => void
}

export const useStore = create<AppState>((set) => ({
  showLanding: true,
  isAuthenticated: false,
  authMode: 'login',
  setShowLanding: (show) => set({ showLanding: show }),
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth, showLanding: !auth }),
  setAuthMode: (mode) => set({ authMode: mode }),

  activeTab: 'Overview',
  menuOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab, modal: null }),
  setMenuOpen: (open) => set({ menuOpen: open }),

  userProfile: initialUserProfile,
  updateUserProfile: (updated) => set((state) => ({
    userProfile: { ...state.userProfile, ...updated }
  })),

  members: seedMembers,
  groups: [
    'Bharatanatyam Arangetram', 
    'Kathak Senior Diploma', 
    'Odissi Intensive Classical', 
    'Kuchipudi Fellowship', 
    'Contemporary Fusion Batch',
    'Carnatic Music & Nattuvangam'
  ],
  groupDetailsList: seedGroups,
  setMembers: (updater) => set((state) => ({ members: typeof updater === 'function' ? updater(state.members) : updater })),
  setGroups: (updater) => set((state) => ({ groups: typeof updater === 'function' ? updater(state.groups) : updater })),
  setGroupDetailsList: (updater) => set((state) => ({ groupDetailsList: typeof updater === 'function' ? updater(state.groupDetailsList) : updater })),

  addGroup: (group) => set((state) => ({
    groupDetailsList: [...state.groupDetailsList, group],
    groups: [...state.groups, group.name]
  })),

  updateGroup: (id, updated) => set((state) => {
    const oldGroup = state.groupDetailsList.find(g => g.id === id)
    const oldName = oldGroup?.name
    const updatedDetails = state.groupDetailsList.map(g => g.id === id ? { ...g, ...updated } : g)
    
    let newGroups = state.groups
    let newMembers = state.members
    
    if (updated.name && oldName && updated.name !== oldName) {
      newGroups = state.groups.map(g => g === oldName ? updated.name! : g)
      newMembers = state.members.map(m => {
        const hasGroup = m.memberGroups?.includes(oldName)
        if (!hasGroup) return m
        const newMemberGroups = m.memberGroups?.map(g => g === oldName ? updated.name! : g)
        const newGroupPayments = { ...m.groupPayments }
        if (newGroupPayments[oldName]) {
          newGroupPayments[updated.name!] = newGroupPayments[oldName]
          delete newGroupPayments[oldName]
        }
        return {
          ...m,
          memberGroups: newMemberGroups,
          groupPayments: newGroupPayments,
          plan: m.plan === oldName ? updated.name : m.plan
        }
      })
    }

    return {
      groupDetailsList: updatedDetails,
      groups: newGroups,
      members: newMembers
    }
  }),

  deleteGroup: (id) => set((state) => {
    const targetGroup = state.groupDetailsList.find(g => g.id === id)
    if (!targetGroup) return state
    const groupName = targetGroup.name
    
    return {
      groupDetailsList: state.groupDetailsList.filter(g => g.id !== id),
      groups: state.groups.filter(g => g !== groupName),
      members: state.members.map(m => ({
        ...m,
        memberGroups: m.memberGroups?.filter(g => g !== groupName)
      }))
    }
  }),

  addOrUpdateGroupReminder: (groupId, reminder) => set((state) => ({
    groupDetailsList: state.groupDetailsList.map(g => {
      if (g.id !== groupId) return g
      const existingReminders = g.reminders || []
      const exists = existingReminders.some(r => r.id === reminder.id)
      
      if (!exists && existingReminders.length >= 3) {
        return g
      }

      const updatedReminders = exists
        ? existingReminders.map(r => r.id === reminder.id ? reminder : r)
        : [...existingReminders, reminder]

      return { ...g, reminders: updatedReminders }
    })
  })),

  deleteGroupReminder: (groupId, reminderId) => set((state) => ({
    groupDetailsList: state.groupDetailsList.map(g => {
      if (g.id !== groupId) return g
      return { ...g, reminders: (g.reminders || []).filter(r => r.id !== reminderId) }
    })
  })),

  toggleGroupReminder: (groupId, reminderId) => set((state) => ({
    groupDetailsList: state.groupDetailsList.map(g => {
      if (g.id !== groupId) return g
      return {
        ...g,
        reminders: (g.reminders || []).map(r => r.id === reminderId ? { ...r, enabled: !r.enabled } : r)
      }
    })
  })),

  triggerGroupReminderNow: (groupId, reminderId) => set((state) => ({
    groupDetailsList: state.groupDetailsList.map(g => {
      if (g.id !== groupId) return g
      const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return {
        ...g,
        reminders: (g.reminders || []).map(r =>
          r.id === reminderId ? { ...r, quotaConsumed: true, lastSentAt: `Today, ${timeNow}` } : r
        )
      }
    })
  })),

  modal: null,
  selectedMember: null,
  selectedGroup: null,
  selectedTransaction: null,
  setModal: (modal) => set({ modal }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setSelectedTransaction: (txn) => set({ selectedTransaction: txn }),

  recordPayment: (memberId, groupName, amount, paymentMethod, remarks) => set((state) => {
    const updatedMembers = state.members.map(m => {
      if (m.id !== memberId) return m

      const updatedGroupPayments = {
        ...(m.groupPayments || {}),
        [groupName]: {
          amount: amount.startsWith('₹') ? amount : `₹${Number(amount).toLocaleString('en-IN')}`,
          status: 'Paid' as const,
          due: `Paid via ${paymentMethod}, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        }
      }

      // Check if all groups are now paid
      const allGroupsPaid = Object.values(updatedGroupPayments).every(p => p.status === 'Paid')

      return {
        ...m,
        status: allGroupsPaid ? ('Paid' as const) : m.status,
        due: allGroupsPaid ? `Paid via ${paymentMethod}` : m.due,
        groupPayments: updatedGroupPayments,
        remarks: remarks ? (m.remarks ? `${m.remarks}\nNote: ${remarks}` : remarks) : m.remarks
      }
    })

    return { members: updatedMembers }
  }),

  archiveMember: (memberId) => set((state) => ({
    members: state.members.map(m => m.id === memberId ? { ...m, archived: true } : m)
  })),

  updateMember: (id, updated) => set((state) => {
    const updatedMembers = state.members.map(m => {
      if (m.id !== id) return m
      const newName = updated.name || m.name
      const initials = newName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      return {
        ...m,
        ...updated,
        initials
      }
    })
    const updatedSelected = state.selectedMember && state.selectedMember.id === id ? { ...state.selectedMember, ...updated } : state.selectedMember
    return { members: updatedMembers, selectedMember: updatedSelected }
  }),

  toggleMemberGroupStatus: (memberId, groupName) => set((state) => ({
    members: state.members.map(m => {
      if (m.id === memberId) {
        const currentGroupStatus = m.groupStatus || {}
        const current = currentGroupStatus[groupName] || 'Active'
        const next = current === 'Active' ? 'On Gap' : 'Active'
        return {
          ...m,
          groupStatus: {
            ...currentGroupStatus,
            [groupName]: next
          }
        }
      }
      return m
    })
  })),

  toast: '',
  setToast: (toast) => set({ toast }),
  notify: (message) => {
    set({ toast: message })
    setTimeout(() => {
      set({ toast: '' })
    }, 2600)
  }
}))
