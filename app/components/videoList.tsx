import { VideoType } from '../types'

export default function VideoList({ videos }: { videos: VideoType[] }) {
	if (!videos.length) return <p>Belum ada video di kategori ini.</p>
	return (
		<div className="grid md:grid-cols-2 gap-4">
			{videos.map((v) => (
				<div key={v._id} className="bg-white p-4 rounded shadow">
					<h4 className="font-bold mb-2">{v.title}</h4>
					<div className="aspect-video">
						<iframe
							title="v.youtubeLink"
							src={`https://www.youtube.com/embed/${new URL(v.youtubeLink).searchParams.get('v')}`}
							className="w-full h-full"
							allowFullScreen
						/>
					</div>
				</div>
			))}
		</div>
	)
}
