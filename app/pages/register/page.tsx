'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/app/components/passwordInput'

export default function RegisterPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (password !== confirmPassword) {
			setError('Password dan konfirmasi password tidak cocok')
			return
		}

		if (password.length < 6) {
			setError('Password minimal 6 karakter')
			return
		}

		setLoading(true)

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			})

			const data = await res.json()

			if (res.ok) {
				alert('Registrasi berhasil! Silakan login.')
				router.push('/pages/login')
			} else {
				setError(data.error || 'Registrasi gagal')
			}
		} catch (err) {
			setError('Terjadi kesalahan. Silakan coba lagi.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-50">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded shadow-md w-96"
			>
				<h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
					Daftar Q-VIBE
				</h1>

				{error && (
					<div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
						{error}
					</div>
				)}

				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Username</label>
					<input
						type="text"
						placeholder="Masukkan username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
						required
						minLength={3}
					/>
				</div>

				<div className="mb-4">
					<label className="block text-gray-700 mb-2">Password</label>
					<PasswordInput
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Masukkan password"
					/>
				</div>

				<div className="mb-6">
					<label className="block text-gray-700 mb-2">
						Konfirmasi Password
					</label>
					<PasswordInput
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Ulangi password"
					/>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full bg-green-700 text-white p-2 rounded hover:bg-green-800 transition disabled:opacity-50"
				>
					{loading ? 'Memproses...' : 'Daftar'}
				</button>

				<p className="mt-4 text-center text-sm">
					Sudah punya akun?{' '}
					<a href="/pages/login" className="text-green-700 hover:underline">
						Login di sini
					</a>
				</p>
			</form>
		</div>
	)
}
