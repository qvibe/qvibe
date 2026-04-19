import { NextRequest, NextResponse } from 'next/server'
import { getVideosCollection } from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const category = searchParams.get('category')
	const videosCol = await getVideosCollection()
	const filter = category ? { category } : {}
	const videos = await videosCol.find(filter).sort({ createdAt: -1 }).toArray()
	const formatted = videos.map((v) => ({ ...v, _id: v._id.toString() }))
	return NextResponse.json(formatted)
}

export async function POST(req: NextRequest) {
	const session = await getSession()
	if (session?.role !== 'admin')
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	const { title, youtubeLink, category } = await req.json()
	const videosCol = await getVideosCollection()
	const result = await videosCol.insertOne({
		title,
		youtubeLink,
		category,
		createdAt: new Date()
	})
	return NextResponse.json({
		_id: result.insertedId.toString(),
		title,
		youtubeLink,
		category
	})
}
