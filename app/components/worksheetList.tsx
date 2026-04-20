import { useState } from 'react'
import { ExternalLink, FileText, LoaderCircle } from 'lucide-react'
import { WorksheetType } from '@/app/types'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export default function WorksheetList({
	worksheets,
	isLoading
}: {
	worksheets: WorksheetType[]
	isLoading: boolean
}) {
	const [filter, setFilter] = useState('Semua')
	const categories = [
		'Semua',
		...new Set(worksheets.map((item) => item.category))
	]
	const activeFilter = categories.includes(filter) ? filter : 'Semua'
	const filteredWorksheets =
		activeFilter === 'Semua'
			? worksheets
			: worksheets.filter((item) => item.category === activeFilter)

	if (isLoading) {
		return (
			<div className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-100 bg-emerald-50 px-4 py-5 text-sm text-slate-600">
				<LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
				Memuat worksheet...
			</div>
		)
	}

	if (!worksheets.length) {
		return (
			<div className="rounded-2xl border border-dashed border-emerald-100 bg-emerald-50 px-5 py-8 text-sm leading-7 text-slate-600">
				Belum ada worksheet yang tersedia.
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap gap-2">
				{categories.map((category) => {
					const isActive = activeFilter === category

					return (
						<button
							key={category}
							type="button"
							onClick={() => setFilter(category)}
							className={`rounded-full px-4 py-2 text-sm font-medium transition ${
								isActive
									? 'bg-amber-500 text-slate-950'
									: 'bg-amber-50 text-amber-900 hover:bg-amber-100'
							}`}
						>
							{category}
						</button>
					)
				})}
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{filteredWorksheets.map((worksheet) => (
					<article
						key={worksheet._id}
						className="flex h-full flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
					>
						<div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
							<FileText className="h-6 w-6" />
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
								{worksheet.category}
							</span>
							<span className="text-xs text-slate-500">
								{dateFormatter.format(new Date(worksheet.createdAt))}
							</span>
						</div>
						<h3 className="line-clamp-2 text-lg font-semibold text-slate-950">
							{worksheet.title}
						</h3>
						<p className="flex-1 text-sm leading-7 text-slate-600">
							Buka worksheet ini di tab baru untuk melihat, mencetak, atau
							mengunduh file PDF.
						</p>
						<a
							href={worksheet.fileUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
						>
							Buka PDF
							<ExternalLink className="h-4 w-4" />
						</a>
					</article>
				))}
			</div>
		</div>
	)
}
