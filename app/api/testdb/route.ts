import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/lib/db'

export const runtime = 'nodejs'

export async function GET() {
	try {
		const { db } = await connectToDatabase()
		await db.command({ ping: 1 })
		return NextResponse.json({
			success: true,
			message: 'MongoDB connected successfully'
		})
	} catch (error) {
		console.error('MongoDB connection error:', error)
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 }
		)
	}
}
