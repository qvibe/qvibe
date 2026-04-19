'use client'
import { useState } from 'react'

interface AdminVideoFormProps {
	categories: string[]
	onSuccess?: () => void // ✅ optional
}

export default function AdminVideoForm({
	categories,
	onSuccess
}: AdminVideoFormProps) {
	const [title, setTitle] = useState('')
	const [youtubeLink, setYoutubeLink] = useState('')
	const [category, setCategory] = useState(categories[0] || '')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const res = await fetch('/api/videos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title, youtubeLink, category })
		})
		if (res.ok) {
			setTitle('')
			setYoutubeLink('')
			onSuccess?.() // ✅ call if provided
			alert('Video added!')
		} else {
			alert('Failed to add video')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="text"
				placeholder="Judul Video"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full p-2 border rounded"
				required
			/>
			<input
				type="url"
				placeholder="Link YouTube (https://youtube.com/watch?v=...)"
				value={youtubeLink}
				onChange={(e) => setYoutubeLink(e.target.value)}
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
			<button
				type="submit"
				className="bg-blue-600 text-white px-4 py-2 rounded"
			>
				Tambah Video
			</button>
		</form>
	)
}
