import { redirect } from 'next/navigation'

export default function CommitteesPage() {
  redirect('/about/organization?tab=committee')
}
