'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputPropsType = React.InputHTMLAttributes<HTMLInputElement>

export default function PasswordInput({
	className = '',
	...props
}: PasswordInputPropsType) {
	const [show, setShow] = useState(false)

	return (
		<div className="relative">
			<input
				{...props}
				type={show ? 'text' : 'password'}
				className={`w-full rounded-2xl border border-emerald-950/12 bg-white/90 px-4 py-3 pr-12 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
			/>
			<button
				type="button"
				onClick={() => setShow((current) => !current)}
				className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-800"
				aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
			>
				{show ? <EyeOff size={18} /> : <Eye size={18} />}
			</button>
		</div>
	)
}
