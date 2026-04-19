import { NextRequest, NextResponse } from 'next/server'
import { getWorksheetsCollection } from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'
import { getStore } from '@netlify/blobs'

export const runtime = 'nodejs'

export async function GET() {
	try {
		const worksheetsCol = await getWorksheetsCollection()
		const worksheets = await worksheetsCol
			.find()
			.sort({ createdAt: -1 })
			.toArray()
		const formatted = worksheets.map((w) => ({ ...w, _id: w._id.toString() }))
		return NextResponse.json(formatted)
	} catch (error) {
		console.error('GET worksheets error:', error)
		return NextResponse.json([], { status: 500 })
	}
}

export async function POST(req: NextRequest) {
	try {
		const session = await getSession()
		if (session?.role !== 'admin') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const formData = await req.formData()
		const file = formData.get('file') as File
		const title = formData.get('title') as string
		const category = formData.get('category') as string

		if (!file || file.type !== 'application/pdf') {
			return NextResponse.json({ error: 'File harus PDF' }, { status: 400 })
		}

		const store = getStore('worksheet-store')
		const fileKey = `worksheets/${Date.now()}-${file.name}`
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		await store.set(fileKey, buffer.buffer)

		const fileUrl = `/api/blobs/${fileKey}`

		const worksheetsCol = await getWorksheetsCollection()
		const result = await worksheetsCol.insertOne({
			title,
			category,
			fileUrl,
			createdAt: new Date()
		})

		return NextResponse.json({
			_id: result.insertedId.toString(),
			title,
			category,
			fileUrl
		})
	} catch (error) {
		console.error('POST worksheet error:', error)
		return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
	}
}
