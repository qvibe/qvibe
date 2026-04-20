export const VIDEO_CATEGORIES = [
	'Materi Alquran',
	'Ilmu Tajwid',
	'Surat Pendek',
	'Doa-doa Harian',
	'Surat Alquran Pilihan',
	'Hadist Harian',
	'Materi Fiqih',
	'Aidah Akhlak',
	'Materi Tarikh'
]

export const WORKSHEET_CATEGORIES = [
	'MATEMATIKA',
	'MEWARNAI',
	'AGAMA ISLAM',
	'LAIN-LAIN'
]

export function getYouTubeVideoId(link: string) {
	if (!link) return null

	try {
		const url = new URL(link)
		const hostname = url.hostname.replace('www.', '')

		if (hostname === 'youtu.be') {
			return url.pathname.replace('/', '') || null
		}

		if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
			if (url.pathname === '/watch') {
				return url.searchParams.get('v')
			}

			const parts = url.pathname.split('/').filter(Boolean)
			const markerIndex = parts.findIndex(
				(part) => part === 'embed' || part === 'shorts' || part === 'live'
			)

			if (markerIndex !== -1 && parts[markerIndex + 1]) {
				return parts[markerIndex + 1]
			}
		}

		return null
	} catch {
		return null
	}
}

export function getYouTubeEmbedUrl(link: string) {
	const videoId = getYouTubeVideoId(link)
	return videoId ? `https://www.youtube.com/embed/${videoId}` : null
}

export function getYouTubeThumbnailUrl(link: string) {
	const videoId = getYouTubeVideoId(link)
	return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null
}
