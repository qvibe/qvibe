'use client'

import { useRef, useState } from 'react'
import { FileUp, LoaderCircle } from 'lucide-react'
import { WORKSHEET_CATEGORIES } from '@/app/lib/content'
import { WorksheetType } from '@/app/types'

interface AdminWorksheetFormProps {
	onSuccess?: (worksheet: WorksheetType) => void
}

export default function AdminWorksheetForm({
	onSuccess
}: AdminWorksheetFormProps) {
	const [title, setTitle] = useState('')
	const [category, setCategory] = useState(WORKSHEET_CATEGORIES[0])
	const [file, setFile] = useState<File | null>(null)
	const [status, setStatus] = useState<{
		type: 'success' | 'error'
		message: string
	} | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setStatus(null)

		if (!file) {
			setStatus({
				type: 'error',
				message: 'Pilih file PDF terlebih dahulu.'
			})
			return
		}

		setSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('title', title)
			formData.append('category', category)
			formData.append('file', file)

			const res = await fetch('/api/worksheets', {
				method: 'POST',
				body: formData
			})

			const data = await res.json().catch(() => null)

			if (!res.ok) {
				throw new Error(data?.error || 'Worksheet gagal diunggah')
			}

			setTitle('')
			setFile(null)

			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}

			setStatus({
				type: 'success',
				message: 'Worksheet baru berhasil diunggah.'
			})
			onSuccess?.(data)
		} catch (error) {
			setStatus({
				type: 'error',
				message:
					error instanceof Error ? error.message : 'Worksheet gagal diunggah.'
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
						Judul worksheet
					</label>
					<input
						type="text"
						placeholder="Contoh: Latihan mewarnai huruf hijaiyah"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
						required
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-slate-700">
						Kategori
					</label>
					<select
						title="Pilih kategori worksheet"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
					>
						{WORKSHEET_CATEGORIES.map((item) => (
							<option key={item} value={item}>
								{item}
							</option>
						))}
					</select>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-slate-700">
						File PDF
					</label>
					<input
						ref={fileInputRef}
						title="Pilih file PDF"
						type="file"
						accept=".pdf,application/pdf"
						onChange={(e) => setFile(e.target.files?.[0] || null)}
						className="w-full rounded-2xl border border-emerald-950/12 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition file:mr-3 file:rounded-full file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-emerald-900 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
						required
					/>
				</div>
			</div>

			<div className="rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-slate-600">
				{file
					? `File dipilih: ${file.name}`
					: 'Pilih file PDF yang siap dibuka atau dicetak oleh user.'}
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
				className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
			>
				{submitting ? (
					<LoaderCircle className="h-4 w-4 animate-spin" />
				) : (
					<FileUp className="h-4 w-4" />
				)}
				{submitting ? 'Mengunggah worksheet...' : 'Upload worksheet'}
			</button>
		</form>
	)
}
