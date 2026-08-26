'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

type Project = {
	name: string
	type: string
	description: string
	tags: string[]
	art: string
	href: string
}

type ProjectsProps = {
	projectStart: number
	visibleProjects: Project[]
	shiftProjects: (direction: number) => void
}

export function Projects({ projectStart, visibleProjects, shiftProjects }: ProjectsProps) {
	return (
		<section className="section project-section" id="projects">
			<div className="container">
				<div className="section-head">
					<div className="section-label">04 / SELECTED WORK</div>
					<div className="carousel-controls">
						<button onClick={() => shiftProjects(-1)} aria-label="Previous projects">
							<ArrowLeft size={16} />
						</button>
						<button onClick={() => shiftProjects(1)} aria-label="Next projects">
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
				<div className="project-grid">
					{visibleProjects.map((project, i) => (
						<article className={`project-card project-${i}`} key={project.name}>
							<div className="project-art">
								<span className="art-index">0{projectStart + i + 1}</span>
								<div className="art-shape">{project.art}</div>
								<span className="art-caption">{project.type}</span>
							</div>
							<div className="project-info">
								<div>
									<h3>
										<a href={project.href} target="_blank" rel="noreferrer">
											{project.name}
										</a>
									</h3>
									<p>{project.description}</p>
								</div>
								<a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.name}`}>
									<ArrowUpRight size={20} />
								</a>
							</div>
							<div className="tag-row">
								{project.tags.map((tag) => (
									<span key={tag}>{tag}</span>
								))}
							</div>
						</article>
					))}
				</div>
				<div className="project-more-card">
					<p className="project-more-text">
						Discover all my projects and the wide array of technologies I&apos;ve mastered, showcasing creative solutions
						and innovative ideas crafted through experience and dedication.
					</p>
					<a
						className="project-more-link"
						href="https://github.com/Leelaprasad001?tab=repositories"
						target="_blank"
						rel="noreferrer"
					>
						View More <ArrowUpRight size={16} />
					</a>
				</div>
			</div>
		</section>
	)
}