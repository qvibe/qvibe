'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type PasswordInputPropsType = {
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
}

export default function PasswordInput({
	value,
	onChange,
	placeholder
}: PasswordInputPropsType) {
	const [show, setShow] = useState(false)
	return (
		<div className="relative">
			<input
				type={show ? 'text' : 'password'}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className="w-full p-2 border rounded pr-10 text-black"
			/>
			<button
				type="button"
				onClick={() => setShow(!show)}
				className="absolute right-2 top-2 text-gray-500"
			>
				{show ? <EyeOff size={20} /> : <Eye size={20} />}
			</button>
		</div>
	)
}
