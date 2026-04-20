import AdminContent from '@/app/components/adminContent'
import { getSession } from '@/app/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminMateriPage() {
	const session = await getSession()

	if (!session) {
		redirect('/login')
	}

	if (session.role !== 'admin') {
		redirect('/dashboard')
	}

	return <AdminContent />
}
