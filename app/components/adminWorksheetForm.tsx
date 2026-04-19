'use client'
import { useState } from 'react'

interface AdminWorksheetFormProps {
	onSuccess?: () => void
}

const categories = ['MATEMATIKA', 'MEWARNAI', 'AGAMA ISLAM', 'LAIN-LAIN']

export default function AdminWorksheetForm({
	onSuccess
}: AdminWorksheetFormProps) {
	const [title, setTitle] = useState('')
	const [category, setCategory] = useState(categories[0])
	const [file, setFile] = useState<File | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!file) return alert('Pilih file PDF terlebih dahulu')

		const formData = new FormData()
		formData.append('title', title)
		formData.append('category', category)
		formData.append('file', file)

		const res = await fetch('/api/worksheets', {
			method: 'POST',
			body: formData
		})
		if (res.ok) {
			setTitle('')
			setFile(null)
			onSuccess?.()
			alert('Worksheet uploaded!')
		} else {
			alert('Upload failed')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				placeholder="Judul Worksheet"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full p-2 border rounded"
				required
			/>
			<select
				title="Pilih Kategori"
				value={category}
				onChange={(e) => setCategory(e.target.value)}
				className="w-full p-2 border rounded"
			>
				{categories.map((cat) => (
					<option key={cat} value={cat}>
						{cat}
					</option>
				))}
			</select>
			<input
				title="Pilih File"
				type="file"
				accept=".pdf"
				onChange={(e) => setFile(e.target.files?.[0] || null)}
				className="w-full p-2 border rounded"
				required
			/>
			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded"
			>
				Upload Worksheet
			</button>
		</form>
	)
}
