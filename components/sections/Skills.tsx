'use client'

import { Code2, Link2, Trophy } from 'lucide-react'

type SkillsProps = {
	skills: readonly (readonly [string, string])[]
}

export function Skills({ skills }: SkillsProps) {
	return (
		<section className="section container" id="skills">
			<div className="section-label">05 / TOOLKIT</div>
			<div className="skills-grid">
				<h2 className="skills-title-col">
					A flexible
					<br />
					<em>toolkit.</em>
				</h2>
				<div className="skills-content-col">
					{skills.map(([name, list]) => (
						<div className="skill-row" key={name}>
							<span>{name}</span>
							<p>{list}</p>
						</div>
					))}
					<div className="toolkit-profiles" aria-label="Coding and professional profiles">
						<p>Profiles</p>
						<div className="toolkit-profile-links">
							<a href="https://leetcode.com/u/LeelaPrasad001/" target="_blank" rel="noreferrer" aria-label="LeetCode profile">
								<Code2 size={16} />
								<span>LeetCode</span>
							</a>
							<a href="https://www.geeksforgeeks.org/profile/leelaprasad1607" target="_blank" rel="noreferrer" aria-label="GeeksforGeeks profile">
								<Code2 size={16} />
								<span>GeeksforGeeks</span>
							</a>
							<a href="https://github.com/Leelaprasad001" target="_blank" rel="noreferrer" aria-label="GitHub profile">
								<Link2 size={16} />
								<span>GitHub</span>
							</a>
							<a href="https://codolio.com/profile/leelaprasad" target="_blank" rel="noreferrer" aria-label="Codolio profile">
								<Link2 size={16} />
								<span>Codolio</span>
							</a>
							<a href="https://www.kaggle.com/leelaprasad001" target="_blank" rel="noreferrer" aria-label="Kaggle profile">
								<Trophy size={16} />
								<span>Kaggle</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}