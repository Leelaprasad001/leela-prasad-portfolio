'use client'

type ExperienceProps = {
	timeline: readonly (readonly [string, string, string, string])[]
	expanded: number
	setExpanded: (value: number) => void
}

export function Experience({ timeline, expanded, setExpanded }: ExperienceProps) {
	return (
		<section className="section container" id="experience">
			<div className="section-label">03 / EXPERIENCE</div>
			<div className="experience-row">
				<h2>
					Making complex
					<br />
					<em>feel simple.</em>
				</h2>
				<div className="timeline">
					{timeline.map(([date, title, desc, tags], index) => (
						<article
							className={`timeline-item ${expanded === index ? 'is-open' : ''}`}
							key={date}
							onMouseEnter={() => setExpanded(index)}
							onFocus={() => setExpanded(index)}
						>
							<button
								className="timeline-trigger"
								onClick={() => setExpanded(expanded === index ? -1 : index)}
								aria-expanded={expanded === index}
							>
								<span className="timeline-dot" />
								<span>
									<small>{date}</small>
									<strong>{title}</strong>
								</span>
								<span className="timeline-plus">{expanded === index ? '−' : '+'}</span>
							</button>
							{expanded === index && (
								<div className="timeline-detail">
									<p>{desc}</p>
									<span>{tags}</span>
								</div>
							)}
						</article>
					))}
				</div>
			</div>
		</section>
	)
}