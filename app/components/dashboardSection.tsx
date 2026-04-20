import { ReactNode } from 'react'

export default function DashboardSection({
	eyebrow,
	title,
	description,
	icon,
	children
}: {
	eyebrow: string
	title: string
	description: string
	icon?: ReactNode
	children: ReactNode
}) {
	return (
		<section className="flex flex-col gap-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-2">
					<p className="text-sm font-medium text-emerald-700">{eyebrow}</p>
					<h2 className="text-2xl font-semibold text-emerald-950">{title}</h2>
					<p className="text-sm leading-7 text-slate-600">{description}</p>
				</div>
				{icon ? (
					<div className="rounded-2xl bg-emerald-50 p-3 text-emerald-800">
						{icon}
					</div>
				) : null}
			</div>
			{children}
		</section>
	)
}
