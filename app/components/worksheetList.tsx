import { useState } from 'react'
import { WorksheetType } from '../types'

export default function WorksheetList({
	worksheets
}: {
	worksheets: WorksheetType[]
}) {
	const [filter, setFilter] = useState('semua')
	const categories = ['Semua', 'Matematika', 'Mewarnai', 'Lain-lain']
	const filtered =
		filter === 'Semua'
			? worksheets
			: worksheets.filter((w) => w.category === filter)
	return (
		<div>
			<div className="flex gap-2 mb-4">
				{categories.map((c) => (
					<button
						key={c}
						onClick={() => setFilter(c)}
						className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
					>
						{c}
					</button>
				))}
			</div>
			<div className="grid sm:grid-cols-2 gap-4">
				{filtered.map((w) => (
					<div
						key={w._id}
						className="bg-white p-4 rounded shadow flex justify-between items-center"
					>
						<span>
							{w.title} ({w.category})
						</span>
						<a
							href={w.fileUrl}
							target="_blank"
							className="bg-green-600 text-white px-3 py-1 rounded"
						>
							Cetak / Download
						</a>
					</div>
				))}
			</div>
		</div>
	)
}
