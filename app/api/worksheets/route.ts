import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { getWorksheetsCollection } from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'

export async function GET() {
	const worksheetsCol = await getWorksheetsCollection()
	const worksheets = await worksheetsCol
		.find()
		.sort({ createdAt: -1 })
		.toArray()
	const formatted = worksheets.map((w) => ({ ...w, _id: w._id.toString() }))
	return NextResponse.json(formatted)
}

export async function POST(req: NextRequest) {
	const session = await getSession()
	if (session?.role !== 'admin')
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

	const formData = await req.formData()
	const file = formData.get('file') as File
	const title = formData.get('title') as string
	const category = formData.get('category') as string

	if (!file || file.type !== 'application/pdf') {
		return NextResponse.json({ error: 'File harus PDF' }, { status: 400 })
	}

	const blob = await put(`worksheets/${Date.now()}-${file.name}`, file, {
		access: 'public',
		token: process.env.BLOB_READ_WRITE_TOKEN
	})

	const worksheetsCol = await getWorksheetsCollection()
	const result = await worksheetsCol.insertOne({
		title,
		category,
		fileUrl: blob.url,
		createdAt: new Date()
	})

	return NextResponse.json({
		_id: result.insertedId.toString(),
		title,
		category,
		fileUrl: blob.url
	})
}
