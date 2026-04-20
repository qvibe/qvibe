'use client'

import { useEffect, useState } from 'react'
import { BookOpen, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { VIDEO_CATEGORIES, getYouTubeEmbedUrl } from '@/app/lib/content'
import { SessionUserType, VideoType, WorksheetType } from '@/app/types'
import DashboardFeaturedVideo from './dashboardFeaturedVideo'
import DashboardHeader from './dashboardHeader'
import DashboardSection from './dashboardSection'
import VideoList from './videoList'
import WorksheetList from './worksheetList'

export default function DashboardContent({
	session
}: {
	session: SessionUserType
}) {
	const router = useRouter()
	const [activeVideoCat, setActiveVideoCat] = useState(VIDEO_CATEGORIES[0])
	const [videos, setVideos] = useState<VideoType[]>([])
	const [worksheets, setWorksheets] = useState<WorksheetType[]>([])
	const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
	const [loadingVideos, setLoadingVideos] = useState(true)
	const [loadingWorksheets, setLoadingWorksheets] = useState(true)
	const [videoError, setVideoError] = useState('')
	const [worksheetError, setWorksheetError] = useState('')
	const [loggingOut, setLoggingOut] = useState(false)

	useEffect(() => {
		let cancelled = false

		async function loadVideos() {
			setLoadingVideos(true)
			setVideoError('')

			try {
				const res = await fetch(
					`/api/videos?category=${encodeURIComponent(activeVideoCat)}`
				)

				if (!res.ok) {
					throw new Error('Video gagal dimuat')
				}

				const data = await res.json()

				if (!cancelled) {
					setVideos(data)
				}
			} catch {
				if (!cancelled) {
					setVideos([])
					setVideoError('Video belum bisa dimuat. Coba lagi sebentar.')
				}
			} finally {
				if (!cancelled) {
					setLoadingVideos(false)
				}
			}
		}

		void loadVideos()

		return () => {
			cancelled = true
		}
	}, [activeVideoCat])

	useEffect(() => {
		let cancelled = false

		async function loadWorksheets() {
			setLoadingWorksheets(true)
			setWorksheetError('')

			try {
				const res = await fetch('/api/worksheets')

				if (!res.ok) {
					throw new Error('Worksheet gagal dimuat')
				}

				const data = await res.json()

				if (!cancelled) {
					setWorksheets(data)
				}
			} catch {
				if (!cancelled) {
					setWorksheets([])
					setWorksheetError('Worksheet belum bisa dimuat. Coba lagi sebentar.')
				}
			} finally {
				if (!cancelled) {
					setLoadingWorksheets(false)
				}
			}
		}

		void loadWorksheets()

		return () => {
			cancelled = true
		}
	}, [])

	async function handleLogout() {
		setLoggingOut(true)
		await fetch('/api/auth/logout', { method: 'POST' })
		router.replace('/login')
	}

	const selectedVideo =
		videos.find((video) => video._id === selectedVideoId) ?? videos[0] ?? null
	const selectedEmbedUrl = selectedVideo
		? getYouTubeEmbedUrl(selectedVideo.youtubeLink)
		: null
	const activeSelectedVideoId = selectedVideo?._id ?? null

	const statCards = [
		{
			label: 'Video kategori ini',
			value: videos.length,
			tone: 'bg-emerald-50 text-emerald-950'
		},
		{
			label: 'Worksheet tersedia',
			value: worksheets.length,
			tone: 'bg-white text-emerald-950'
		},
		{
			label: 'Status akun',
			value: session.role === 'admin' ? 'Admin' : 'User',
			tone: 'bg-amber-50 text-emerald-950'
		}
	]

	return (
		<div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-amber-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto flex max-w-7xl flex-col gap-6">
				<DashboardHeader
					role={session.role}
					loggingOut={loggingOut}
					onLogout={handleLogout}
				/>

				<section className="grid gap-6 xl:grid-cols-3">
					<div className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm xl:col-span-2">
						<div className="flex flex-col gap-2">
							<span className="text-sm font-medium text-emerald-700">
								Kategori materi
							</span>
							<h2 className="text-2xl font-semibold text-emerald-950">
								Pilih topik belajar
							</h2>
							<p className="text-sm leading-7 text-slate-600">
								Pilih kategori untuk melihat materi utama dan video terkait di
								satu alur yang lebih rapi.
							</p>
						</div>

						<div className="flex flex-wrap gap-2">
							{VIDEO_CATEGORIES.map((category) => {
								const isActive = activeVideoCat === category

								return (
									<button
										key={category}
										type="button"
										onClick={() => {
											setActiveVideoCat(category)
											setSelectedVideoId(null)
										}}
										className={`rounded-full px-4 py-2 text-sm font-medium transition ${
											isActive
												? 'bg-emerald-950 text-white'
												: 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
										}`}
									>
										{category}
									</button>
								)
							})}
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							{statCards.map((card) => (
								<div
									key={card.label}
									className={`flex flex-col gap-3 rounded-2xl border border-emerald-100 p-4 ${card.tone}`}
								>
									<p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
										{card.label}
									</p>
									<p className="text-3xl font-semibold">{card.value}</p>
								</div>
							))}
						</div>
					</div>

					<DashboardFeaturedVideo
						isLoading={loadingVideos}
						error={videoError}
						selectedVideo={selectedVideo}
						selectedEmbedUrl={selectedEmbedUrl}
					/>
				</section>

				<DashboardSection
					eyebrow="Daftar materi video"
					title="Pilih video lain"
					description="Gunakan daftar ini untuk berpindah video tanpa meninggalkan dashboard."
					icon={<BookOpen className="h-5 w-5" />}
				>
					<VideoList
						videos={videos}
						activeVideoId={activeSelectedVideoId}
						onSelect={setSelectedVideoId}
						isLoading={loadingVideos}
					/>
				</DashboardSection>

				<DashboardSection
					eyebrow="Worksheet edukatif"
					title="Latihan setelah menonton"
					description="Buka worksheet sesuai kebutuhan tanpa mencampur tampilan video dan materi cetak."
					icon={<FileText className="h-5 w-5" />}
				>
					{worksheetError ? (
						<div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm leading-7 text-red-900">
							{worksheetError}
						</div>
					) : (
						<WorksheetList
							worksheets={worksheets}
							isLoading={loadingWorksheets}
						/>
					)}
				</DashboardSection>
			</div>
		</div>
	)
}
