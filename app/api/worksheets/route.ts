import { NextRequest, NextResponse } from 'next/server'
import { getWorksheetsCollection } from '@/app/lib/db'
import { getSession } from '@/app/lib/auth'
import {
	createWorksheetFileKey,
	getWorksheetFileUrl,
	saveWorksheetFile
} from '@/app/lib/worksheetStorage'

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
		const title = String(formData.get('title') ?? '').trim()
		const category = String(formData.get('category') ?? '').trim()

		if (!title || !category) {
			return NextResponse.json(
				{ error: 'Judul dan kategori wajib diisi' },
				{ status: 400 }
			)
		}

		if (!file || file.type !== 'application/pdf') {
			return NextResponse.json({ error: 'File harus PDF' }, { status: 400 })
		}

		const fileKey = createWorksheetFileKey(file.name)
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)
		await saveWorksheetFile(fileKey, buffer)

		const fileUrl = getWorksheetFileUrl(fileKey)
		const createdAt = new Date()

		const worksheetsCol = await getWorksheetsCollection()
		const result = await worksheetsCol.insertOne({
			title,
			category,
			fileUrl,
			createdAt
		})

		return NextResponse.json({
			_id: result.insertedId.toString(),
			title,
			category,
			fileUrl,
			createdAt
		})
	} catch (error) {
		console.error('POST worksheet error:', error)
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Worksheet gagal diunggah'
			},
			{ status: 500 }
		)
	}
}
