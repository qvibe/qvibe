import { getSession } from '@/app/lib/auth'
import { getVideosCollection } from '@/app/lib/db'
import { ObjectId } from 'mongodb'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await getSession()
	if (session?.role !== 'admin') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { id } = await params
	if (!ObjectId.isValid(id)) {
		return NextResponse.json({ error: 'ID video tidak valid' }, { status: 400 })
	}

	const videosCol = await getVideosCollection()
	const objectId = new ObjectId(id)
	const existing = await videosCol.findOne({ _id: objectId })

	if (!existing) {
		return NextResponse.json({ error: 'Video tidak ditemukan' }, { status: 404 })
	}

	await videosCol.deleteOne({ _id: objectId })

	return NextResponse.json({ success: true, id })
}
