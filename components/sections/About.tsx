'use client'

import { ArrowUpRight } from 'lucide-react'

export function About() {
	return (
		<section className="section container" id="about">
			<div className="section-label">01 / ABOUT</div>
			<div className="about-grid">
				<h2>
					Technical depth.
					<br />
					<em>Human</em> perspective.
				</h2>
				<div>
					<p className="lead">I care about the space where ambitious ideas become useful, dependable software.</p>
					<p>
						Currently working as a Full Stack Developer, I combine engineering fundamentals with a curiosity for machine
						learning and the web platforms that shape how people build and use products.
					</p>
					<a className="arrow-link" href="#contact">
						More about me <ArrowUpRight size={17} />
					</a>
				</div>
			</div>
		</section>
	)
}