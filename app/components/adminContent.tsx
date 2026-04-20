'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
	ArrowLeft,
	ExternalLink,
	FileText,
	LoaderCircle,
	RefreshCw,
	ShieldCheck,
	Trash2,
	Video
} from 'lucide-react'
import AdminVideoForm from './adminVideoForm'
import AdminWorksheetForm from './adminWorksheetForm'
import { VIDEO_CATEGORIES } from '@/app/lib/content'
import { VideoType, WorksheetType } from '@/app/types'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

type NoticeState = {
	type: 'success' | 'error'
	message: string
} | null

export default function AdminContent() {
	const [videos, setVideos] = useState<VideoType[]>([])
	const [worksheets, setWorksheets] = useState<WorksheetType[]>([])
	const [loading, setLoading] = useState(true)
	const [refreshing, setRefreshing] = useState(false)
	const [pendingDeleteKey, setPendingDeleteKey] = useState<string | null>(null)
	const [notice, setNotice] = useState<NoticeState>(null)

	useEffect(() => {
		void loadContent()
	}, [])

	async function loadContent(showRefreshState = false) {
		if (showRefreshState) {
			setRefreshing(true)
		} else {
			setLoading(true)
		}

		try {
			const [videosRes, worksheetsRes] = await Promise.all([
				fetch('/api/videos'),
				fetch('/api/worksheets')
			])

			if (!videosRes.ok || !worksheetsRes.ok) {
				throw new Error('Gagal memuat materi')
			}

			const [videoData, worksheetData] = await Promise.all([
				videosRes.json(),
				worksheetsRes.json()
			])

			setVideos(videoData)
			setWorksheets(worksheetData)

			if (showRefreshState) {
				setNotice({
					type: 'success',
					message: 'Daftar materi sudah diperbarui.'
				})
			}
		} catch {
			setNotice({
				type: 'error',
				message: 'Materi gagal dimuat. Coba lagi sebentar.'
			})
		} finally {
			setLoading(false)
			setRefreshing(false)
		}
	}

	async function handleDeleteVideo(id: string, title: string) {
		if (!window.confirm(`Hapus video "${title}"?`)) {
			return
		}

		const pendingKey = `video:${id}`
		setPendingDeleteKey(pendingKey)

		try {
			const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
			const data = await res.json().catch(() => null)

			if (!res.ok) {
				throw new Error(data?.error || 'Video gagal dihapus')
			}

			setVideos((current) => current.filter((video) => video._id !== id))
			setNotice({
				type: 'success',
				message: `Video "${title}" berhasil dihapus.`
			})
		} catch (error) {
			setNotice({
				type: 'error',
				message: error instanceof Error ? error.message : 'Video gagal dihapus.'
			})
		} finally {
			setPendingDeleteKey(null)
		}
	}

	async function handleDeleteWorksheet(id: string, title: string) {
		if (!window.confirm(`Hapus worksheet "${title}"?`)) {
			return
		}

		const pendingKey = `worksheet:${id}`
		setPendingDeleteKey(pendingKey)

		try {
			const res = await fetch(`/api/worksheets/${id}`, { method: 'DELETE' })
			const data = await res.json().catch(() => null)

			if (!res.ok) {
				throw new Error(data?.error || 'Worksheet gagal dihapus')
			}

			setWorksheets((current) => current.filter((item) => item._id !== id))
			setNotice({
				type: 'success',
				message: `Worksheet "${title}" berhasil dihapus.`
			})
		} catch (error) {
			setNotice({
				type: 'error',
				message:
					error instanceof Error ? error.message : 'Worksheet gagal dihapus.'
			})
		} finally {
			setPendingDeleteKey(null)
		}
	}

	return (
		<div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
			<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(21,128,61,0.16),transparent_38%),radial-gradient(circle_at_right,rgba(245,158,11,0.14),transparent_28%)]" />

			<div className="mx-auto max-w-7xl space-y-6">
				<section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur xl:p-8">
					<div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-300/25 blur-3xl" />
					<div className="absolute bottom-0 left-20 h-28 w-28 rounded-full bg-amber-200/40 blur-3xl" />

					<div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
						<div className="max-w-3xl">
							<Link
								href="/dashboard"
								className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white/80 px-4 py-2 text-sm font-medium text-emerald-950 transition hover:border-emerald-700/30 hover:bg-emerald-50"
							>
								<ArrowLeft className="h-4 w-4" />
								Kembali ke dashboard
							</Link>

							<div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-50">
								<ShieldCheck className="h-4 w-4" />
								Pusat kontrol admin
							</div>

							<h1 className="max-w-2xl font-serif text-4xl leading-tight text-emerald-950 sm:text-5xl">
								Kelola materi belajar dengan tampilan yang lebih rapi, cepat,
								dan aman.
							</h1>
							<p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
								Tambah video, unggah worksheet PDF, cek materi yang sudah
								tersedia, lalu hapus konten yang tidak dipakai lagi dari satu
								tempat.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-3 xl:min-w-105">
							<div className="rounded-3xl border border-emerald-950/10 bg-white/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
									Video aktif
								</p>
								<p className="mt-3 text-3xl font-semibold text-emerald-950">
									{videos.length}
								</p>
							</div>
							<div className="rounded-3xl border border-emerald-950/10 bg-white/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
									Worksheet
								</p>
								<p className="mt-3 text-3xl font-semibold text-emerald-950">
									{worksheets.length}
								</p>
							</div>
							<div className="rounded-3xl border border-emerald-950/10 bg-white/80 p-4">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
									Kategori video
								</p>
								<p className="mt-3 text-3xl font-semibold text-emerald-950">
									{VIDEO_CATEGORIES.length}
								</p>
							</div>
						</div>
					</div>
				</section>

				{notice && (
					<div
						className={`rounded-3xl border px-5 py-4 text-sm shadow-sm ${
							notice.type === 'success'
								? 'border-emerald-200 bg-emerald-50 text-emerald-900'
								: 'border-red-200 bg-red-50 text-red-900'
						}`}
					>
						{notice.message}
					</div>
				)}

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
					<div className="space-y-6">
						<section className="rounded-4xl border border-white/70 bg-white/86 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
							<div className="mb-6 flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-emerald-700">
										Tambah video baru
									</p>
									<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
										Video pembelajaran
									</h2>
									<p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
										Masukkan judul, tautan YouTube, dan kategori. Video baru
										akan langsung muncul di dashboard kategori terkait.
									</p>
								</div>
								<div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
									<Video className="h-6 w-6" />
								</div>
							</div>

							<AdminVideoForm
								categories={VIDEO_CATEGORIES}
								onSuccess={(video) => {
									setVideos((current) => [video, ...current])
									setNotice({
										type: 'success',
										message: `Video "${video.title}" berhasil ditambahkan.`
									})
								}}
							/>
						</section>

						<section className="rounded-4xl border border-white/70 bg-white/86 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
							<div className="mb-6 flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-amber-700">
										Unggah worksheet
									</p>
									<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
										PDF siap cetak
									</h2>
									<p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
										Simpan worksheet baru beserta metadata judul dan kategori.
										File PDF tetap bisa dibuka langsung dari dashboard.
									</p>
								</div>
								<div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
									<FileText className="h-6 w-6" />
								</div>
							</div>

							<AdminWorksheetForm
								onSuccess={(worksheet) => {
									setWorksheets((current) => [worksheet, ...current])
									setNotice({
										type: 'success',
										message: `Worksheet "${worksheet.title}" berhasil diunggah.`
									})
								}}
							/>
						</section>
					</div>

					<div className="space-y-6">
						<section className="rounded-4xl border border-white/70 bg-white/86 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
							<div className="mb-6 flex items-start justify-between gap-4">
								<div>
									<p className="text-sm font-medium text-slate-500">
										Pengelolaan konten
									</p>
									<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
										Video tersimpan
									</h2>
								</div>

								<button
									type="button"
									onClick={() => void loadContent(true)}
									disabled={refreshing}
									className="inline-flex items-center gap-2 rounded-full border border-emerald-950/10 bg-white px-4 py-2 text-sm font-medium text-emerald-950 transition hover:border-emerald-700/30 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<RefreshCw
										className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
									/>
									Muat ulang
								</button>
							</div>

							{loading ? (
								<div className="flex items-center gap-3 rounded-3xl border border-dashed border-emerald-950/12 bg-emerald-50/60 px-4 py-5 text-sm text-slate-600">
									<LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
									Mengambil daftar video...
								</div>
							) : videos.length ? (
								<div className="space-y-3">
									{videos.map((video) => {
										const isDeleting = pendingDeleteKey === `video:${video._id}`

										return (
											<div
												key={video._id}
												className="rounded-3xl border border-emerald-950/10 bg-white px-4 py-4 shadow-sm"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="min-w-0 space-y-2">
														<div className="flex flex-wrap items-center gap-2">
															<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
																{video.category}
															</span>
															<span className="text-xs text-slate-500">
																{dateFormatter.format(
																	new Date(video.createdAt)
																)}
															</span>
														</div>

														<h3 className="text-base font-semibold text-slate-900">
															{video.title}
														</h3>
														<a
															href={video.youtubeLink}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
														>
															Buka video
															<ExternalLink className="h-4 w-4" />
														</a>
													</div>

													<button
														type="button"
														onClick={() =>
															void handleDeleteVideo(video._id, video.title)
														}
														disabled={isDeleting}
														className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
													>
														{isDeleting ? (
															<LoaderCircle className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
														Hapus
													</button>
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<div className="rounded-3xl border border-dashed border-emerald-950/12 bg-emerald-50/50 px-5 py-8 text-sm leading-7 text-slate-600">
									Belum ada video tersimpan. Tambahkan video pertama dari form
									di sebelah kiri.
								</div>
							)}
						</section>

						<section className="rounded-4xl border border-white/70 bg-white/86 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
							<div className="mb-6">
								<p className="text-sm font-medium text-slate-500">
									Pengelolaan konten
								</p>
								<h2 className="mt-2 text-2xl font-semibold text-emerald-950">
									Worksheet tersimpan
								</h2>
							</div>

							{loading ? (
								<div className="flex items-center gap-3 rounded-3xl border border-dashed border-emerald-950/12 bg-emerald-50/60 px-4 py-5 text-sm text-slate-600">
									<LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
									Mengambil daftar worksheet...
								</div>
							) : worksheets.length ? (
								<div className="space-y-3">
									{worksheets.map((worksheet) => {
										const isDeleting =
											pendingDeleteKey === `worksheet:${worksheet._id}`

										return (
											<div
												key={worksheet._id}
												className="rounded-3xl border border-emerald-950/10 bg-white px-4 py-4 shadow-sm"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="min-w-0 space-y-2">
														<div className="flex flex-wrap items-center gap-2">
															<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
																{worksheet.category}
															</span>
															<span className="text-xs text-slate-500">
																{dateFormatter.format(
																	new Date(worksheet.createdAt)
																)}
															</span>
														</div>

														<h3 className="text-base font-semibold text-slate-900">
															{worksheet.title}
														</h3>
														<a
															href={worksheet.fileUrl}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
														>
															Buka PDF
															<ExternalLink className="h-4 w-4" />
														</a>
													</div>

													<button
														type="button"
														onClick={() =>
															void handleDeleteWorksheet(
																worksheet._id,
																worksheet.title
															)
														}
														disabled={isDeleting}
														className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
													>
														{isDeleting ? (
															<LoaderCircle className="h-4 w-4 animate-spin" />
														) : (
															<Trash2 className="h-4 w-4" />
														)}
														Hapus
													</button>
												</div>
											</div>
										)
									})}
								</div>
							) : (
								<div className="rounded-3xl border border-dashed border-emerald-950/12 bg-emerald-50/50 px-5 py-8 text-sm leading-7 text-slate-600">
									Belum ada worksheet tersimpan. Unggah PDF pertama dari form di
									sebelah kiri.
								</div>
							)}
						</section>
					</div>
				</div>
			</div>
		</div>
	)
}
