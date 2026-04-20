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

		// Temporary debug
		const { getStore } = await import('@netlify/blobs')
		let storeStatus = 'unknown'
		let blobResult = 'unknown'

		try {
			const store = getStore('worksheet-store')
			storeStatus = 'connected'
			const data = await store.get(fileKey, { type: 'arrayBuffer' })
			blobResult = data ? `found: ${data.byteLength} bytes` : 'null'
		} catch (e) {
			storeStatus = `error: ${e instanceof Error ? e.message : String(e)}`
		}

		return NextResponse.json({ fileKey, storeStatus, blobResult })
	} catch (error) {
		return NextResponse.json({ error: String(error) })
	}
}
