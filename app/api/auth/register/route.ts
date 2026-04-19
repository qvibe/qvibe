import { NextResponse } from 'next/server'
import { getUsersCollection } from '@/app/lib/db'
import { hashPassword } from '@/app/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
	const { username, password } = await req.json()
	const users = await getUsersCollection()
	const existing = await users.findOne({ username })
	if (existing)
		return NextResponse.json({ error: 'Username taken' }, { status: 400 })
	const hashed = await hashPassword(password)
	await users.insertOne({
		username,
		password: hashed,
		role: 'user',
		createdAt: new Date(),
		updatedAt: new Date()
	})
	return NextResponse.json({ success: true })
}
