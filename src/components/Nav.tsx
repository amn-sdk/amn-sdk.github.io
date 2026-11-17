import { useState } from 'react'
import { profile } from '../content'
import { CloseIcon, GithubIcon, LinkedinIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'

export const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

interface Props {
  active: string
  onSection: (id: string) => void
  onHome: () => void
  theme: 'dark' | 'light'
  onToggleTheme: () => void
}

export function Nav({ active, onSection, onHome, theme, onToggleTheme }: Props) {
  const [open, setOpen] = useState(false)

  const go = (id: string) => {
    setOpen(false)
    onSection(id)
  }

  const links = (
    <>
      {SECTIONS.map((s) => (
        <button key={s.id} className={`nav-link ${active === s.id ? 'active' : ''}`} onClick={() => go(s.id)}>
          {s.label}
        </button>
      ))}
      <a className={`nav-link ${active === 'resume' ? 'active' : ''}`} href={profile.links.resume} onClick={() => setOpen(false)}>
        Resume
      </a>
    </>
  )

  return (
    <header className="nav">
      <div className="container nav-inner">
        <button className="logo" onClick={onHome} style={{ background: 'none', border: 0, padding: 0 }} aria-label="Home">
          <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true">
            <defs>
              <linearGradient id="logo-g" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#3b6cff" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <path d="M0 26 L11 0 H19 L8 26 Z" fill="url(#logo-g)" />
          </svg>
          <span>{profile.initials}</span>
          <span className="logo-slash">/</span>
          <span className="logo-name">{profile.firstName}</span>
        </button>

        <nav className="nav-links" aria-label="Main">
          {links}
        </nav>

        <div className="nav-icons">
          <a className="icon-btn" href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon />
          </a>
          <a className="icon-btn" href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      <nav className={`mobile-menu ${open ? 'open' : ''}`} aria-label="Mobile">
        {links}
      </nav>
    </header>
  )
}
