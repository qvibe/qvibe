import { getSession } from '@/app/lib/auth'
import { getWorksheetsCollection } from '@/app/lib/db'
import {
	deleteWorksheetFile,
	getWorksheetKeyFromUrl,
	readWorksheetFile
} from '@/app/lib/worksheetStorage'
import { ObjectId } from 'mongodb'
import { NextRequest, NextResponse } from 'next/server'

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
		return NextResponse.json(
			{ error: 'ID worksheet tidak valid' },
			{ status: 400 }
		)
	}

	const worksheetsCol = await getWorksheetsCollection()
	const objectId = new ObjectId(id)
	const worksheet = await worksheetsCol.findOne({ _id: objectId })

	if (!worksheet) {
		return NextResponse.json(
			{ error: 'Worksheet tidak ditemukan' },
			{ status: 404 }
		)
	}

	await worksheetsCol.deleteOne({ _id: objectId })

	const blobKey =
		typeof worksheet.fileUrl === 'string'
			? getWorksheetKeyFromUrl(worksheet.fileUrl)
			: null

	if (blobKey) {
		try {
			await deleteWorksheetFile(blobKey)
		} catch (error) {
			console.error('Worksheet blob delete error:', error)
		}
	}

	return NextResponse.json({ success: true, id })
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { key: string } }
) {
	try {
		const { key } = params
		if (!key) {
			return new NextResponse('Key tidak ditemukan', { status: 400 })
		}

		const fileBuffer = await readWorksheetFile(key)
		if (!fileBuffer) {
			return new NextResponse('File tidak ditemukan', { status: 404 })
		}

		return new NextResponse(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `inline; filename="${key.split('/').pop()}"`
			}
		})
	} catch (error) {
		console.error('Error serving worksheet file:', error)
		return new NextResponse('Internal server error', { status: 500 })
	}
}
