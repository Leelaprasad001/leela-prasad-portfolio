'use client'

import { useEffect, useState } from 'react'

import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Focus } from './sections/Focus'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Marquee } from './sections/Marquee'
import { Projects } from './sections/Projects'
import { Services } from './sections/Services'
import { Skills } from './sections/Skills'
import { announcementPhrases, marqueeItems, nav, projects, services, skills, timeline } from './sections/data'

export default function App() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(0)
  const [projectStart, setProjectStart] = useState(0)
  const [theme, setTheme] = useState('light')

  const visibleProjects = projects.slice(projectStart, projectStart + 3)
  const shiftProjects = (direction) => {
    setProjectStart((projectStart + direction + projects.length) % projects.length)
  }

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="site-shell">
      <Header
        nav={nav}
        announcementPhrases={announcementPhrases}
        open={open}
        theme={theme}
        onToggle={() => setOpen(!open)}
        onClose={() => setOpen(false)}
        onThemeToggle={() => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))}
      />
      <main id="top">
        <Hero />
        <About />
        <Services services={services} />
        <Experience timeline={timeline} expanded={expanded} setExpanded={setExpanded} />
        <Projects projectStart={projectStart} visibleProjects={visibleProjects} shiftProjects={shiftProjects} />
        <Marquee items={marqueeItems} />
        <Skills skills={skills} />
        <Focus />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
