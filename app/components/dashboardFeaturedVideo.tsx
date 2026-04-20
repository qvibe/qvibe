import { ExternalLink, LoaderCircle, PlayCircle } from 'lucide-react'
import { VideoType } from '@/app/types'

export default function DashboardFeaturedVideo({
	isLoading,
	error,
	selectedVideo,
	selectedEmbedUrl
}: {
	isLoading: boolean
	error: string
	selectedVideo: VideoType | null
	selectedEmbedUrl: string | null
}) {
	return (
		<section className="flex flex-col gap-5 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
			<div className="flex items-center gap-3">
				<div className="rounded-2xl bg-emerald-50 p-3 text-emerald-800">
					<PlayCircle className="h-5 w-5" />
				</div>
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium text-emerald-700">
						Fokus video utama
					</p>
					<h2 className="text-xl font-semibold text-emerald-950">
						Tonton materi pilihan
					</h2>
				</div>
			</div>

			{isLoading ? (
				<div className="flex min-h-72 items-center justify-center rounded-3xl border border-dashed border-emerald-100 bg-emerald-50 px-4 py-5 text-sm text-slate-600">
					<div className="flex items-center gap-3">
						<LoaderCircle className="h-5 w-5 animate-spin text-emerald-700" />
						Memuat video pilihan...
					</div>
				</div>
			) : error ? (
				<div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-sm leading-7 text-red-900">
					{error}
				</div>
			) : selectedVideo ? (
				<div className="flex flex-col gap-4">
					<div className="overflow-hidden rounded-3xl border border-emerald-100 bg-slate-950">
						{selectedEmbedUrl ? (
							<div className="aspect-video">
								<iframe
									title={selectedVideo.title}
									src={selectedEmbedUrl}
									className="h-full w-full"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>
						) : (
							<div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-white/80">
								Tautan video tidak valid untuk ditampilkan di dalam aplikasi.
							</div>
						)}
					</div>

					<div className="flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
						<div className="flex flex-wrap items-center gap-2">
							<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-800">
								{selectedVideo.category}
							</span>
							<span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
								Video utama
							</span>
						</div>
						<h3 className="text-2xl font-semibold text-slate-950">
							{selectedVideo.title}
						</h3>
						<p className="text-sm leading-7 text-slate-600">
							Gunakan area ini untuk fokus pada materi utama, lalu pilih video
							lain dari daftar di bawah saat perlu berpindah topik.
						</p>
						<a
							href={selectedVideo.youtubeLink}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
						>
							Buka di YouTube
							<ExternalLink className="h-4 w-4" />
						</a>
					</div>
				</div>
			) : (
				<div className="rounded-2xl border border-dashed border-emerald-100 bg-emerald-50 px-5 py-8 text-sm leading-7 text-slate-600">
					Belum ada video dalam kategori ini.
				</div>
			)}
		</section>
	)
}
