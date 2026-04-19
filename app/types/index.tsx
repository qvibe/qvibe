export type VideoType = {
	_id: string
	title: string
	youtubeLink: string
	category: string
	createdAt: Date | string
}

export type VideoFormDataType = {
	title: string
	youtubeLink: string
	category: string
}

export type WorksheetType = {
	_id: string
	title: string
	category: string
	fileUrl: string
	createdAt: Date | string
}

export type WorksheetFormDataType = {
	title: string
	category: string
	file: File | null
}

export type SessionUserType = {
	id: string
	username: string
	role: 'admin' | 'user'
}
