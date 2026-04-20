import { NextRequest, NextResponse } from 'next/server'
import { getVideosCollection } from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'

export const runtime = 'nodejs'

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

	const body = await req.json()
	const title = String(body.title ?? '').trim()
	const youtubeLink = String(body.youtubeLink ?? '').trim()
	const category = String(body.category ?? '').trim()

	if (!title || !youtubeLink || !category) {
		return NextResponse.json({ error: 'Data video tidak lengkap' }, { status: 400 })
	}

	const videosCol = await getVideosCollection()
	const createdAt = new Date()
	const result = await videosCol.insertOne({
		title,
		youtubeLink,
		category,
		createdAt
	})
	return NextResponse.json({
		_id: result.insertedId.toString(),
		title,
		youtubeLink,
		category,
		createdAt
	})
}
