import DashboardContent from '@/app/components/dashboardContent'
import { getSession } from '@/app/lib/auth'
import { SessionUserType } from '@/app/types'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
	const session = await getSession()
	if (!session) redirect('/login')
	return <DashboardContent session={session as SessionUserType} />
}
