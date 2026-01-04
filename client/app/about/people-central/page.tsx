import { redirect } from 'next/navigation'

export default function PeopleCentralPage() {
  redirect('/about/organization?tab=central')
}
