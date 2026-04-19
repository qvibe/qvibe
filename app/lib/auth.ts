import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET!

export async function hashPassword(password: string) {
	return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
	return bcrypt.compare(password, hash)
}

export function generateToken(userId: string, role: string) {
	return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' })
}

export async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get('token')?.value
	if (!token) return null
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			userId: string
			role: string
		}
		return {
			id: decoded.userId,
			role: decoded.role
		}
	} catch {
		return null
	}
}
