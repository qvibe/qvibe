import type { Metadata } from 'next'
import {
	Cormorant_Garamond,
	IBM_Plex_Mono,
	Plus_Jakarta_Sans
} from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta',
	subsets: ['latin']
})

const cormorant = Cormorant_Garamond({
	variable: '--font-cormorant',
	subsets: ['latin'],
	weight: ['500', '600', '700']
})

const plexMono = IBM_Plex_Mono({
	variable: '--font-plex-mono',
	subsets: ['latin'],
	weight: ['400', '500']
})

export const metadata: Metadata = {
	title: {
		default: 'Q-VIBE',
		template: '%s | Q-VIBE'
	},
	description:
		'Platform pembelajaran Islam berbasis video dan worksheet dengan dashboard user dan panel admin.'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="id"
			className={`${plusJakarta.variable} ${cormorant.variable} ${plexMono.variable} h-full antialiased`}
		>
			<body className="min-h-full bg-background text-foreground font-sans">
				{children}
			</body>
		</html>
	)
}
