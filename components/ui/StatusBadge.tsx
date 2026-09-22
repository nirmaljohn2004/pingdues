import { Status } from '@/store/useStore'

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      <i className="status-dot" />
      {status}
    </span>
  )
}
