'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordInput from '@/app/components/passwordInput'

export default function LoginPage() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		})
		if (res.ok) router.push('/pages/dashboard')
		else alert('Login gagal')
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-green-50">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-8 rounded shadow-md w-96"
			>
				<h1 className="text-2xl font-bold text-green-800 mb-6">
					Masuk ke Q-VIBE
				</h1>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					className="w-full p-2 border rounded mb-4 text-black"
					required
				/>
				<PasswordInput
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
				/>
				<button
					type="submit"
					className="w-full mt-4 bg-green-700 text-white p-2 rounded"
				>
					Login
				</button>
				<p className="mt-4 text-center">
					Belum punya akun?{' '}
					<a href="/pages/register" className="text-green-700">
						Daftar
					</a>
				</p>
			</form>
		</div>
	)
}
