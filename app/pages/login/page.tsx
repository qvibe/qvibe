'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
	BookOpen,
	LoaderCircle,
	LockKeyhole,
	ShieldCheck,
	Video
} from 'lucide-react'
import PasswordInput from '@/app/components/passwordInput'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setLoading(true)

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			})

			const data = await res.json().catch(() => null)

			if (!res.ok) {
				throw new Error(data?.error || 'Login gagal')
			}

			router.replace('/dashboard')
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Login gagal')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
			<div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(21,128,61,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_28%)]" />

			<div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(380px,0.9fr)] lg:items-stretch">
				<section className="relative hidden overflow-hidden rounded-[36px] border border-white/70 bg-emerald-950 px-8 py-10 text-white shadow-[0_30px_100px_rgba(6,78,59,0.28)] lg:flex lg:flex-col lg:justify-between">
					<div className="absolute left-10 top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-3xl" />
					<div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl" />

					<div className="relative">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-50">
							<ShieldCheck className="h-4 w-4" />
							Akun belajar
						</div>
						<h1 className="mt-6 max-w-xl font-serif text-5xl leading-tight">
							Masuk dan lanjutkan pembelajaran dengan alur yang lebih nyaman.
						</h1>
						<p className="mt-5 max-w-xl text-sm leading-8 text-emerald-50/82">
							Pilih video utama, buka worksheet, dan kembali ke materi tanpa
							tampilan yang terasa padat atau membingungkan.
						</p>
					</div>

					<div className="relative grid gap-4 sm:grid-cols-3">
						<div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
							<Video className="h-6 w-6 text-amber-200" />
							<p className="mt-4 text-sm font-semibold">Video terkurasi</p>
						</div>
						<div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
							<BookOpen className="h-6 w-6 text-emerald-200" />
							<p className="mt-4 text-sm font-semibold">Belajar per kategori</p>
						</div>
						<div className="rounded-3xl border border-white/10 bg-white/8 p-4 backdrop-blur">
							<LockKeyhole className="h-6 w-6 text-white" />
							<p className="mt-4 text-sm font-semibold">Akses aman</p>
						</div>
					</div>
				</section>

				<section className="flex items-center justify-center">
					<form
						onSubmit={handleSubmit}
						className="w-full max-w-xl rounded-[36px] border border-white/70 bg-white/88 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8"
					>
						<div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
							Login Q-VIBE
						</div>
						<h2 className="mt-5 font-serif text-4xl text-emerald-950">
							Selamat datang kembali
						</h2>
						<p className="mt-3 text-sm leading-7 text-slate-600">
							Masuk ke akun Anda untuk melihat video pilihan dan worksheet
							edukatif.
						</p>

						{error && (
							<div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
								{error}
							</div>
						)}

						<div className="mt-6 space-y-4">
							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700">
									Username
								</label>
								<input
									type="text"
									placeholder="Masukkan username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="w-full rounded-2xl border border-emerald-950/12 bg-white/90 px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100"
									required
									autoComplete="username"
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-medium text-slate-700">
									Password
								</label>
								<PasswordInput
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Masukkan password"
									required
									autoComplete="current-password"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loading ? (
								<LoaderCircle className="h-4 w-4 animate-spin" />
							) : (
								<LockKeyhole className="h-4 w-4" />
							)}
							{loading ? 'Memproses login...' : 'Masuk'}
						</button>

						<p className="mt-6 text-center text-sm text-slate-600">
							Belum punya akun?{' '}
							<Link
								href="/register"
								className="font-semibold text-emerald-800 transition hover:text-emerald-950"
							>
								Daftar di sini
							</Link>
						</p>
					</form>
				</section>
			</div>
		</div>
	)
}
