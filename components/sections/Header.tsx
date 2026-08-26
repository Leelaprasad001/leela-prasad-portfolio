'use client'

import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { openEngineeringChat } from '@/lib/chat-events'

type HeaderProps = {
  nav: readonly string[]
  announcementPhrases: readonly string[]
  open: boolean
  theme: 'light' | 'dark'
  onToggle: () => void
  onClose: () => void
  onThemeToggle: () => void
}

export function Header({ nav, announcementPhrases, open, theme, onToggle, onClose, onThemeToggle }: HeaderProps) {
  const tickerItems = [...announcementPhrases, ...announcementPhrases]

  return (
    <header className="nav-wrap">
      <div className="announcement">
        <div className="announcement-track">
          {tickerItems.map((item, index) => (
            <span className="announce-item" key={`${item}-${index}`}>
              <strong>{item}</strong>
            </span>
          ))}
        </div>
      </div>
      <div className="nav-shell">
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-inner">
            <a className="brand" href="#top" onClick={onClose}>
              <span className="brand-mark">LP</span>
              <span className="brand-name">Leela Prasad Bantu</span>
            </a>
            <div className="desktop-links">
              {nav.map((item) => (
                <a href={`#${item.toLowerCase()}`} key={item}>
                  {item}
                </a>
              ))}
              <a href="#contact">Contact</a>
            </div>
            <button className="theme-toggle" aria-label="Toggle dark mode" onClick={onThemeToggle}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              className="nav-cta"
              type="button"
              onClick={() => {
                openEngineeringChat()
                onClose()
              }}
            >
              Let&apos;s talk <ArrowUpRight size={16} />
            </button>
            <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} onClick={onToggle}>
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </div>
      {open && (
        <div className="mobile-menu">
          {[...nav, 'Contact'].map((item) => (
            <a
              href={item === 'Contact' ? '#contact' : `#${item.toLowerCase()}`}
              onClick={onClose}
              key={item}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
