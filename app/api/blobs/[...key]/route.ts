import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '@netlify/blobs'

export const runtime = 'nodejs'

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ key: string[] }> }
) {
	try {
		const { key } = await params
		const fileKey = key.join('/')
		const store = getStore('worksheet-store')

		const arrayBuffer = await store.get(fileKey)
		if (!arrayBuffer) {
			return new NextResponse('File not found', { status: 404 })
		}

		const buffer = Buffer.from(arrayBuffer)

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'inline'
			}
		})
	} catch (error) {
		console.error('Error retrieving file:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
