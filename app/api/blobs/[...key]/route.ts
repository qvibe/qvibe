import { NextRequest, NextResponse } from 'next/server'
import { readWorksheetFile } from '@/app/lib/worksheetStorage'

export const runtime = 'nodejs'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ key: string[] }> }
) {
	try {
		const { key } = await params
		const fileKey = key.join('/')
		const buffer = await readWorksheetFile(fileKey)

		if (!buffer) {
			return new NextResponse('File not found', { status: 404 })
		}

		console.log('Buffer length:', buffer?.length, typeof buffer)
		return new NextResponse(new Uint8Array(buffer), {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline',
				'Content-Length': buffer.length.toString()
			}
		})
	} catch (error) {
		console.error('Error retrieving file:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
