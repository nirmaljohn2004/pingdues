import { create } from 'zustand'

export type Status = 'Paid' | 'Pending' | 'Overdue'

export type GroupPayment = {
  amount: string
  status: Status
  due?: string
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
    id: 1, name: 'Maya Patel', initials: 'MP', plan: 'Premium monthly', amount: '₹2,400',
    due: 'Paid via Online Link, 9:42 AM', status: 'Paid', color: 'peach',
    phone: '+91 98765 43210', email: 'maya.patel@example.com', joined: '12 Jan 2024',
    memberGroups: ['Premium monthly', 'Coaching centre'],
    groupPayments: {
      'Premium monthly':  { amount: '₹2,400', status: 'Paid',    due: 'Paid via Online Link, 9:42 AM' },
      'Coaching centre':  { amount: '₹1,200', status: 'Pending', due: 'Due in 3 days' },
    },
  },
  {
    id: 2, name: 'Arjun Mehta', initials: 'AM', plan: 'Standard monthly', amount: '₹1,800',
    due: 'Due today', status: 'Pending', color: 'lavender',
    phone: '+91 98123 45678', email: 'arjun.mehta@example.com', joined: '04 Mar 2024',
    memberGroups: ['Standard monthly'],
    groupPayments: {
      'Standard monthly': { amount: '₹1,800', status: 'Pending', due: 'Due today' },
    },
  },
  {
    id: 3, name: 'Sana Khan', initials: 'SK', plan: 'Premium monthly', amount: '₹2,400',
    due: 'Due in 2 days', status: 'Pending', color: 'mint',
    phone: '+91 99887 66554', email: 'sana.khan@example.com', joined: '21 Apr 2024',
    memberGroups: ['Premium monthly', 'Student monthly'],
    groupPayments: {
      'Premium monthly': { amount: '₹2,400', status: 'Pending', due: 'Due in 2 days' },
      'Student monthly': { amount: '₹900',   status: 'Overdue', due: 'Overdue by 1 day' },
    },
  },
  {
    id: 4, name: 'Rohan Desai', initials: 'RD', plan: 'Standard monthly', amount: '₹1,800',
    due: 'Overdue by 5 days', status: 'Overdue', color: 'sky',
    phone: '+91 97654 32109', email: 'rohan.desai@example.com', joined: '17 Jun 2024',
    memberGroups: ['Standard monthly', 'Annual membership'],
    groupPayments: {
      'Standard monthly':   { amount: '₹1,800', status: 'Overdue', due: 'Overdue by 5 days' },
      'Annual membership':  { amount: '₹15,000', status: 'Paid',   due: 'Paid on 01 Sep 2024' },
    },
  },
]

export interface GroupDetails {
  id: string
  name: string
  billingType: 'One-time' | 'Recurring'
  feeAmount: string
  recursEvery?: string // e.g. 'Monthly', 'Quarterly', 'Yearly'
  dueDate?: string // e.g. '5th of every month' or specific date
  startDate?: string
  endDate?: string
  createdOn: string
  description?: string
}

export const seedGroups: GroupDetails[] = [
  { id: '1', name: 'Standard monthly', billingType: 'Recurring', feeAmount: '₹1,800', recursEvery: 'Monthly', dueDate: '1st of every month', startDate: '01 Jan 2024', createdOn: '01 Jan 2024', description: 'Standard gym access plan' },
  { id: '2', name: 'Premium monthly', billingType: 'Recurring', feeAmount: '₹2,400', recursEvery: 'Monthly', dueDate: '1st of every month', startDate: '01 Jan 2024', createdOn: '01 Jan 2024', description: 'Includes personal trainer & spa access' },
  { id: '3', name: 'Student monthly', billingType: 'Recurring', feeAmount: '₹900', recursEvery: 'Monthly', dueDate: '5th of every month', startDate: '01 Feb 2024', createdOn: '01 Feb 2024', description: 'Discounted rate for students with ID' },
  { id: '4', name: 'Annual membership', billingType: 'Recurring', feeAmount: '₹15,000', recursEvery: 'Yearly', dueDate: '01 Jan every year', startDate: '01 Jan 2024', createdOn: '01 Jan 2024', description: 'Full year access with 2 months free' },
  { id: '5', name: 'Coaching centre', billingType: 'One-time', feeAmount: '₹1,200', dueDate: 'On admission', startDate: '15 Jan 2024', createdOn: '15 Jan 2024', description: 'Specialized group coaching sessions' },
]

export type ModalType = 'add' | 'edit-member' | 'details' | 'remove' | 'payment' | 'reminder' | 'bulk-remind' | 'new-payment' | 'edit-payment' | 'remove-payment' | 'add-group' | 'edit-group' | 'add-members-to-group' | 'group-details' | 'invoice' | null

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
  isAuthenticated: boolean
  authMode: 'login' | 'register'
  setIsAuthenticated: (auth: boolean) => void
  setAuthMode: (mode: 'login' | 'register') => void

  activeTab: string
  menuOpen: boolean
  setActiveTab: (tab: string) => void
  setMenuOpen: (open: boolean) => void

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
  isAuthenticated: true,
  authMode: 'login',
  setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
  setAuthMode: (mode) => set({ authMode: mode }),

  activeTab: 'Overview',
  menuOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setMenuOpen: (open) => set({ menuOpen: open }),

  members: seedMembers,
  groups: ['Standard monthly', 'Premium monthly', 'Student monthly', 'Annual membership', 'Coaching centre'],
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

  toast: '',
  setToast: (toast) => set({ toast }),
  notify: (message) => {
    set({ toast: message })
    setTimeout(() => {
      set({ toast: '' })
    }, 2600)
  }
}))
