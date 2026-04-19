import { NextResponse } from 'next/server'
import { getUsersCollection } from '@/app/lib/db'
import { verifyPassword, generateToken } from '@/app/lib/auth'

export async function POST(req: Request) {
	const { username, password } = await req.json()
	const users = await getUsersCollection()
	const user = await users.findOne({ username })
	if (!user || !(await verifyPassword(password, user.password))) {
		return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
	}
	const token = generateToken(user._id.toString(), user.role)
	const response = NextResponse.json({ success: true, role: user.role })
	response.cookies.set('token', token, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 604800
	})
	return response
}
