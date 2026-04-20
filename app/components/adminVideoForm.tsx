'use client'

import { useState } from 'react'
import { LoaderCircle, PlusCircle } from 'lucide-react'
import { VideoType } from '@/app/types'

interface AdminVideoFormProps {
	categories: string[]
	onSuccess?: (video: VideoType) => void
}

export default function AdminVideoForm({
	categories,
	onSuccess
}: AdminVideoFormProps) {
	const [title, setTitle] = useState('')
	const [youtubeLink, setYoutubeLink] = useState('')
	const [category, setCategory] = useState(categories[0] || '')
	const [status, setStatus] = useState<{
		type: 'success' | 'error'
		message: string
	} | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)
		setSubmitting(true)

		try {
			const res = await fetch('/api/videos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title, youtubeLink, category })
			})

			const data = await res.json().catch(() => null)

			if (!res.ok) {
				throw new Error(data?.error || 'Video gagal ditambahkan')
			}

			setTitle('')
			setYoutubeLink('')
			setStatus({
				type: 'success',
				message: 'Video baru berhasil ditambahkan.'
			})
			onSuccess?.(data)
		} catch (error) {
			setStatus({
				type: 'error',
				message:
					error instanceof Error ? error.message : 'Video gagal ditambahkan.'
			})
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-4 md:grid-cols-2">
				<div className="md:col-span-2">
					<label className="mb-2 block text-sm font-medium text-slate-700">
						Judul video
					</label>
					<input
						type="text"
						placeholder="Contoh: Belajar Tajwid untuk Pemula"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
						required
					/>
				</div>

				<div className="md:col-span-2">
					<label className="mb-2 block text-sm font-medium text-slate-700">
						Tautan YouTube
					</label>
					<input
						type="url"
						placeholder="https://youtube.com/watch?v=..."
						value={youtubeLink}
						onChange={(e) => setYoutubeLink(e.target.value)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
						required
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-slate-700">
						Kategori
					</label>
					<select
						title="Pilih kategori video"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
					>
						{categories.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				</div>

				<div className="rounded-3xl border border-dashed border-emerald-950/12 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-600">
					Video yang ditambahkan akan langsung tersedia di kategori terkait pada
					dashboard user.
				</div>
			</div>

			{status && (
				<div
					className={`rounded-2xl border px-4 py-3 text-sm ${
						status.type === 'success'
							? 'border-emerald-200 bg-emerald-50 text-emerald-900'
							: 'border-red-200 bg-red-50 text-red-900'
					}`}
				>
					{status.message}
				</div>
			)}

			<button
				type="submit"
				disabled={submitting}
				className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{submitting ? (
					<LoaderCircle className="h-4 w-4 animate-spin" />
				) : (
					<PlusCircle className="h-4 w-4" />
				)}
				{submitting ? 'Menyimpan video...' : 'Tambah video'}
			</button>
		</form>
	)
}
