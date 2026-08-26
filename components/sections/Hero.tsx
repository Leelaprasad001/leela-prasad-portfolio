'use client'

import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export function Hero() {
	return (
		<section className="hero">
			<div className="hero-copy">
				<p className="eyebrow hero-badge">
					<span className="hero-badge-blink" />
					<span className="hero-badge-label">AI FULL STACK DEVELOPER</span>
				</p>
				<h1>
					Building the
					<br />
					<em>intelligent</em> future.
				</h1>
				<p className="hero-text">
					I&apos;m Leela Prasad Bantu — a developer and data scientist creating thoughtful digital products at the intersection of
					full-stack engineering, AI, and modern web development.
				</p>
				<div className="hero-actions">
					<a className="button button-dark" href="#projects">
						Explore my work <ArrowUpRight size={17} />
					</a>
					<a className="button button-white" href="#contact">
						Start a conversation <ArrowDownRight size={17} />
					</a>
				</div>
			</div>
		</section>
	)
}