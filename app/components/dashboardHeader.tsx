'use client'

import Link from 'next/link'
import { LoaderCircle, LogOut, ShieldCheck, Sparkles } from 'lucide-react'

export default function DashboardHeader({
	role,
	loggingOut,
	onLogout
}: {
	role: 'admin' | 'user'
	loggingOut: boolean
	onLogout: () => void | Promise<void>
}) {
	return (
		<header className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between">
			<div className="flex flex-col gap-3">
				<div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-50">
					<Sparkles className="h-4 w-4" />
					Belajar lebih terarah
				</div>
				<div className="flex flex-col gap-2">
					<h1 className="font-serif text-4xl leading-tight text-emerald-950 sm:text-5xl">
						Q-VIBE
					</h1>
					<p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
						Quranic, Video Interaktif, Belajar, Efektif. Pilih kategori,
						tonton materi utama, lalu lanjutkan dengan worksheet yang siap
						digunakan.
					</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-3">
				<div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-slate-700">
					Akses: {role === 'admin' ? 'Admin' : 'User'}
				</div>
				{role === 'admin' && (
					<Link
						href="/admin/materi"
						className="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
					>
						<ShieldCheck className="h-4 w-4" />
						Kelola materi
					</Link>
				)}
				<button
					type="button"
					onClick={() => void onLogout()}
					disabled={loggingOut}
					className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loggingOut ? (
						<LoaderCircle className="h-4 w-4 animate-spin" />
					) : (
						<LogOut className="h-4 w-4" />
					)}
					Logout
				</button>
			</div>
		</header>
	)
}
