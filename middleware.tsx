import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './app/lib/auth'

export const runtime = 'nodejs'

export async function middleware(request: NextRequest) {
	const session = await getSession()
	const { pathname } = request.nextUrl

	if (pathname === '/pages/login' || pathname === '/pages/register') {
		if (session) {
			return NextResponse.redirect(new URL('/pages/dashboard', request.url))
		}
		return NextResponse.next()
	}

	if (
		pathname.startsWith('/pages') ||
		pathname.startsWith('/api/videos') ||
		pathname.startsWith('/api/worksheets')
	) {
		if (!session) {
			return NextResponse.redirect(new URL('/pages/login', request.url))
		}
		if (pathname.startsWith('/api/videos') && request.method !== 'GET') {
			if (session.role !== 'admin') {
				return new NextResponse('Unauthorized', { status: 401 })
			}
		}
		if (pathname.startsWith('/api/worksheets') && request.method !== 'GET') {
			if (session.role !== 'admin') {
				return new NextResponse('Unauthorized', { status: 401 })
			}
		}
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/pages/:path*', '/api/:path*']
}
