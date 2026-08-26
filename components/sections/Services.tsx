'use client'

import { ArrowUpRight } from 'lucide-react'

type ServicesProps = {
	services: readonly (readonly [string, string, string])[]
}

export function Services({ services }: ServicesProps) {
	return (
		<section className="section services-section">
			<div className="container">
				<div className="section-label">02 / WHAT I DO</div>
				<div className="services-grid">
					{services.map(([num, title, desc]) => (
						<article className="service" key={num}>
							<span className="service-num">{num}</span>
							<h3>{title}</h3>
							<p>{desc}</p>
							<ArrowUpRight className="service-arrow" size={21} />
						</article>
					))}
				</div>
			</div>
		</section>
	)
}