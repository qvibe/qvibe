import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/app/lib/auth'

export async function middleware(request: NextRequest) {
	const session = await getSession()
	const { pathname } = request.nextUrl

	const rewrites: Record<string, string> = {
		'/dashboard': '/pages/dashboard',
		'/login': '/pages/login',
		'/register': '/pages/register',
		'/admin': '/pages/admin'
	}

	let internalPath = pathname
	for (const [publicPath, internal] of Object.entries(rewrites)) {
		if (pathname === publicPath || pathname.startsWith(publicPath + '/')) {
			const suffix = pathname.slice(publicPath.length)
			internalPath = internal + suffix
			break
		}
	}

	const url = request.nextUrl.clone()
	if (internalPath !== pathname) {
		url.pathname = internalPath
		return NextResponse.rewrite(url)
	}

	const effectivePath = internalPath

	if (pathname === '/login' || pathname === '/register') {
		if (session) {
			return NextResponse.redirect(new URL('/dashboard', request.url))
		}
		return NextResponse.next()
	}

	if (
		effectivePath.startsWith('/pages/dashboard') ||
		effectivePath.startsWith('/pages/admin') ||
		pathname.startsWith('/api/')
	) {
		if (!session) {
			return NextResponse.redirect(new URL('/login', request.url))
		}
		if (
			effectivePath.startsWith('/pages/admin') ||
			(pathname.startsWith('/api/') && request.method !== 'GET')
		) {
			if (session.role !== 'admin') {
				return new NextResponse('Unauthorized', { status: 401 })
			}
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/login',
		'/register',
		'/admin/:path*',
		'/api/:path*'
	]
}
