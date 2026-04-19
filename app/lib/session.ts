import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET!
const secretKey = new TextEncoder().encode(JWT_SECRET)

export async function getSession() {
	const cookieStore = await cookies()
	const token = cookieStore.get('token')?.value
	if (!token) return null
	try {
		const { payload } = await jwtVerify(token, secretKey)
		return {
			id: payload.userId as string,
			role: payload.role as string
		}
	} catch {
		return null
	}
}
