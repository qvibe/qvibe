import AdminVideoForm from '@/app/components/adminVideoForm'
import AdminWorksheetForm from '@/app/components/adminWorksheetForm'
import Link from 'next/link'

const videoCategories = [
	'Materi Alquran',
	'Ilmu Tajwid',
	'Surat Pendek',
	'Doa-doa Harian',
	'Surat Alquran Pilihan',
	'Hadist Harian',
	'Materi Fiqih',
	'Aidah Akhlak',
	'Materi Tarikh'
]

export default async function AdminMateriPage() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="mb-4">
					<Link
						href="/pages/dashboard"
						className="inline-flex items-center text-blue-600 hover:text-blue-800"
					>
						← Kembali ke Dashboard
					</Link>
				</div>

				<h1 className="text-3xl font-bold text-green-800 mb-6">
					Kelola Materi
				</h1>

				<div className="bg-white p-6 rounded shadow mb-8">
					<h2 className="text-xl font-bold mb-4">Tambah Video Baru</h2>
					<AdminVideoForm categories={videoCategories} />
				</div>

				<div className="bg-white p-6 rounded shadow">
					<h2 className="text-xl font-bold mb-4">Upload Worksheet PDF</h2>
					<AdminWorksheetForm />
				</div>
			</div>
		</div>
	)
}
