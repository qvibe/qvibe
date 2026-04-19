'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SessionUserType, VideoType, WorksheetType } from '../types'
import VideoList from './videoList'
import WorksheetList from './worksheetList'

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

export default function DashboardContent({
	session
}: {
	session: SessionUserType
}) {
	const router = useRouter()
	const [activeVideoCat, setActiveVideoCat] = useState(videoCategories[0])
	const [videos, setVideos] = useState<VideoType[]>([])
	const [worksheets, setWorksheets] = useState<WorksheetType[]>([])

	const fetchVideos = useCallback(async () => {
		const res = await fetch(`/api/videos?category=${activeVideoCat}`)
		const data = await res.json()
		setVideos(data)
	}, [activeVideoCat])

	const fetchWorksheets = useCallback(async () => {
		const res = await fetch('/api/worksheets')
		const data = await res.json()
		setWorksheets(data)
	}, [])

	useEffect(() => {
		const loadData = async () => {
			await fetchVideos()
			await fetchWorksheets()
		}
		loadData()
	}, [fetchVideos, fetchWorksheets])

	const handleLogout = async () => {
		await fetch('/api/auth/logout', { method: 'POST' })
		router.push('/login')
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="p-6 bg-white shadow flex justify-between items-center">
				<div>
					<h1 className="text-4xl font-bold text-green-800">Q-VIBE</h1>
					<p className="text-sm text-gray-500">
						(Quranic, Video Interaktif, Belajar, Efektif)
					</p>
				</div>
				<div className="flex gap-4 items-center">
					{session.role === 'admin' && (
						<Link
							href="/pages/admin/materi"
							className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
						>
							Kelola Materi
						</Link>
					)}
					<button
						onClick={handleLogout}
						className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
					>
						Logout
					</button>
				</div>
			</div>

			<div className="max-w-6xl mx-auto p-6">
				<h2 className="text-2xl font-bold text-center text-green-700">
					EDUKASI ISLAM TERPERCAYA
				</h2>
				<p className="text-center text-gray-600 mb-8">
					Pilih kategori untuk mulai belajar dari video pilihan
				</p>

				<div className="flex flex-wrap gap-2 mb-6">
					{videoCategories.map((cat) => (
						<button
							key={cat}
							onClick={() => setActiveVideoCat(cat)}
							className={`px-4 py-2 rounded-full ${activeVideoCat === cat ? 'bg-green-700 text-white' : 'bg-gray-200'}`}
						>
							{cat}
						</button>
					))}
				</div>

				<VideoList videos={videos} />

				<div className="mt-10">
					<h3 className="text-xl font-bold mb-4">📄 Worksheet Edukatif</h3>
					<WorksheetList worksheets={worksheets} />
				</div>
			</div>
		</div>
	)
}
