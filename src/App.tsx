import { useCallback, useEffect, useState } from 'react'
import { profile, projects } from './content'
import { Home } from './components/Home'
import { Nav, SECTIONS } from './components/Nav'
import { ProjectPage } from './components/ProjectPage'
import { ResumePage } from './components/ResumePage'

type Theme = 'dark' | 'light'

/** Minimal hash router: "#/" home, "#/projects/<slug>" case study, "#/resume" bilingual resume. */
function parseHash() {
  if (/^#\/resume\b/.test(window.location.hash)) return 'resume'
  const m = window.location.hash.match(/^#\/projects\/([\w-]+)/)
  return m ? m[1] : null
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function App() {
  const [slug, setSlug] = useState<string | null>(parseHash)
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [active, setActive] = useState('')
  const [pendingSection, setPendingSection] = useState<string | null>(null)

  useEffect(() => {
    const onHash = () => setSlug(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  // Highlight the nav link of the section in view.
  useEffect(() => {
    if (slug) return
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [slug])

  // After returning home from a project page, scroll to the requested section.
  useEffect(() => {
    if (!slug && pendingSection) {
      requestAnimationFrame(() => scrollToSection(pendingSection))
      setPendingSection(null)
    }
  }, [slug, pendingSection])

  const goSection = useCallback(
    (id: string) => {
      if (slug) {
        setPendingSection(id)
        window.location.hash = '#/'
      } else {
        scrollToSection(id)
      }
    },
    [slug],
  )

  const openProject = (s: string) => {
    window.location.hash = `#/projects/${s}`
  }

  const project = slug ? projects.find((p) => p.slug === slug) : null

  return (
    <>
      <Nav
        active={project ? 'projects' : slug === 'resume' ? 'resume' : active}
        onSection={goSection}
        onHome={() => {
          if (slug) window.location.hash = '#/'
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      {project ? (
        <ProjectPage project={project} onBack={() => goSection('projects')} onOpen={openProject} />
      ) : slug === 'resume' ? (
        <ResumePage onBack={() => (window.location.hash = '#/')} />
      ) : (
        <Home theme={theme} onOpenProject={openProject} onSection={goSection} />
      )}
      <footer className="footer">
        <div className="container footer-inner">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>
            Built with React, TypeScript and Three.js · <a href={profile.links.matchday}>3D version</a>
          </span>
        </div>
      </footer>
    </>
  )
}
