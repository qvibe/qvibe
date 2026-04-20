import { getSession } from '@/app/lib/auth'
import { getWorksheetsCollection } from '@/app/lib/db'
import {
	deleteWorksheetFile,
	getWorksheetKeyFromUrl
} from '@/app/lib/worksheetStorage'
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
