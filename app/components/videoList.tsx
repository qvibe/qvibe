import { ExternalLink, LoaderCircle, PlayCircle } from 'lucide-react'
import { getYouTubeThumbnailUrl } from '@/app/lib/content'
import { VideoType } from '@/app/types'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export default function VideoList({
	videos,
	activeVideoId,
	onSelect,
	isLoading
}: {
	videos: VideoType[]
	activeVideoId: string | null
	onSelect: (id: string) => void
	isLoading: boolean
}) {
	if (isLoading) {
		return (
			<div className="flex items-center gap-3 rounded-2xl border border-dashed border-emerald-100 bg-emerald-50 px-4 py-5 text-sm text-slate-600">
				<LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
				Memuat daftar video...
			</div>
		)
	}

	if (!videos.length) {
		return (
			<div className="rounded-2xl border border-dashed border-emerald-100 bg-emerald-50 px-5 py-8 text-sm leading-7 text-slate-600">
				Belum ada video di kategori ini.
			</div>
		)
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
			{videos.map((video) => {
				const thumbnailUrl = getYouTubeThumbnailUrl(video.youtubeLink)
				const isActive = video._id === activeVideoId

				return (
					<article
						key={video._id}
						className={`overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
							isActive ? 'border-emerald-600 ring-1 ring-emerald-200' : 'border-emerald-100'
						}`}
					>
						<button
							type="button"
							onClick={() => onSelect(video._id)}
							className="block w-full text-left"
						>
							<div
								className="flex aspect-video items-end justify-between bg-slate-900 bg-cover bg-center p-4"
								style={
									thumbnailUrl
										? {
												backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.82)), url(${thumbnailUrl})`
											}
										: undefined
								}
							>
								<span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
									{isActive ? 'Sedang diputar' : video.category}
								</span>
								<div className="rounded-full bg-white/10 p-2 text-white backdrop-blur">
									<PlayCircle className="h-6 w-6" />
								</div>
							</div>

							<div className="flex flex-col gap-3 px-5 py-5">
								<h3 className="line-clamp-2 text-lg font-semibold text-slate-950">
									{video.title}
								</h3>
								<p className="text-sm text-slate-500">
									Diunggah {dateFormatter.format(new Date(video.createdAt))}
								</p>
							</div>
						</button>

						<div className="flex items-center justify-between gap-3 border-t border-emerald-100 px-5 py-4">
							<button
								type="button"
								onClick={() => onSelect(video._id)}
								className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
							>
								{isActive ? 'Video aktif' : 'Putar video'}
							</button>
							<a
								href={video.youtubeLink}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
							>
								YouTube
								<ExternalLink className="h-4 w-4" />
							</a>
						</div>
					</article>
				)
			})}
		</div>
	)
}
