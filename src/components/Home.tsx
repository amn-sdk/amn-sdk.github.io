import { useEffect, useRef, useState } from 'react'
import { categories, education, experience, profile, projects, skills, type CategoryId } from '../content'
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseIcon,
  CategoryIcon,
  CodeIcon,
  FileIcon,
  GithubIcon,
  GlobeIcon,
  LinkedinIcon,
  MailIcon,
  PinIcon, PhoneIcon } from './Icons'
import { ProjectArt } from './ProjectArt'

interface Props {
  theme: 'dark' | 'light'
  onOpenProject: (slug: string) => void
  onSection: (id: string) => void
}

function Hero({ theme, onSection }: { theme: 'dark' | 'light'; onSection: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanup: (() => void) | undefined
    let cancelled = false
    // Load three.js lazily so the text renders first.
    import('./heroScene').then(({ createHeroScene }) => {
      if (!cancelled && ref.current) {
        try {
          cleanup = createHeroScene(ref.current, theme)
        } catch {
          // WebGL unavailable: the hero still works without the 3D scene.
        }
      }
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [theme])

  return (
    <section className="hero" id="top">
      <div className="hero-canvas" ref={ref} aria-hidden="true" />
      <div className="container hero-content fade-in">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1>Hi, I'm {profile.firstName}.</h1>
        <p className="hero-sub">{profile.headline}</p>
        <p className="hero-meta">
          {profile.school}
          <br />
          {profile.focus.map((f, i) => (
            <span key={f}>
              {i > 0 && <span className="dot">·</span>}
              {f}
            </span>
          ))}
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onSection('projects')}>
            <CodeIcon /> Explore Projects <ArrowRight />
          </button>
          <a className="btn" href={profile.links.resume}>
            <FileIcon /> Resume <ArrowUpRight />
          </a>
        </div>
        <div className="availability">
          <span className="pulse" /> {profile.availability}
        </div>
        <a className="matchday-link" href={profile.links.matchday}>
          ⚽ Prefer to play? Try the interactive 3D version <ArrowRight />
        </a>
      </div>
    </section>
  )
}

function SectionHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="section-head">
      <div className="section-bar" />
      <h2 className="section-title">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  )
}

function Projects({ onOpenProject }: { onOpenProject: (slug: string) => void }) {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const list = projects.filter((p) => filter === 'all' || p.categories.includes(filter))

  const pick = (id: CategoryId) => {
    setFilter((f) => (f === id ? 'all' : id))
    document.getElementById('project-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHead title="Featured Projects" lead="Academic, team and personal projects. Pick a domain or open a project for the full case study." />
        <div className="cat-grid">
          {categories.map((c) => (
            <button key={c.id} className={`cat-card ${filter === c.id ? 'active' : ''}`} onClick={() => pick(c.id)}>
              <CategoryIcon id={c.id} />
              <div>
                <h3>{c.title}</h3>
                <p>{c.subtitle}</p>
              </div>
              <ArrowRight className="cat-arrow" />
            </button>
          ))}
        </div>

        <div id="project-list" style={{ scrollMarginTop: 90, marginTop: 56 }}>
          <div className="filters" role="tablist" aria-label="Filter projects">
            <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All projects ({projects.length})
            </button>
            {categories.map((c) => (
              <button key={c.id} className={`chip ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
                {c.title}
              </button>
            ))}
          </div>
          <div className="project-grid">
            {list.map((p) => (
              <button key={p.slug} className="project-card fade-in" onClick={() => onOpenProject(p.slug)}>
                <div className="project-thumb">
                  <ProjectArt project={p} />
                </div>
                <div className="project-body">
                  <span className="project-kind">
                    {p.kind} · {p.year}
                    {p.featured && <span className="featured-badge">Featured</span>}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.tagline}</p>
                  <div className="tags">
                    {p.stack.slice(0, 4).map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div className="about-text">
          <SectionHead title="About me" />
          {profile.about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="facts">
          <div className="fact">
            <PinIcon />
            <div>
              <div className="fact-label">Based in</div>
              <div className="fact-value">{profile.location}</div>
            </div>
          </div>
          <div className="fact">
            <BriefcaseIcon />
            <div>
              <div className="fact-label">Looking for</div>
              <div className="fact-value">{profile.availability}</div>
            </div>
          </div>
          <div className="fact">
            <GlobeIcon />
            <div>
              <div className="fact-label">Languages</div>
              <div className="fact-value">{profile.languages.map((l) => `${l.name} · ${l.level}`).join('  |  ')}</div>
            </div>
          </div>
          <div className="fact">
            <CodeIcon />
            <div>
              <div className="fact-label">Outside of code</div>
              <div className="fact-value">{profile.interests.join(', ')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHead title="Experience" lead="Engineering work-study, entrepreneurship and field project management." />
        <div className="timeline">
          {experience.map((e) => (
            <article key={e.company} className="tl-item">
              <div>
                <div className="tl-period">{e.period}</div>
                <div className="tl-loc">{e.location}</div>
              </div>
              <div>
                <h3>{e.role}</h3>
                <div className="tl-company">{e.company}</div>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <div className="tags">
                  {e.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="section" id="education">
      <div className="container">
        <SectionHead title="Education" />
        <div className="timeline">
          {education.map((e) => (
            <article key={e.school} className="tl-item">
              <div>
                <div className="tl-period">{e.period || ' '}</div>
                <div className="tl-loc">{e.location}</div>
              </div>
              <div>
                <h3>{e.school}</h3>
                <div className="tl-company">{e.degree}</div>
                <p style={{ margin: '0 0 14px', color: 'var(--text-2)', fontSize: 15 }}>{e.detail}</p>
                {e.courses.length > 0 && (
                  <div className="tags">
                    {e.courses.map((c) => (
                      <span key={c} className="tag">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: 72 }}>
          <SectionHead title="Technical skills" />
          <div className="skills-grid">
            {skills.map((s) => (
              <div key={s.group} className="skill-card">
                <h3>{s.group}</h3>
                <div className="tags">
                  {s.items.map((i) => (
                    <span key={i} className="tag">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <div className="contact-card">
          <p className="eyebrow" style={{ marginBottom: 14 }}>
            Contact
          </p>
          <h2>Let's build something together.</h2>
          <p>
            I'm looking for software engineering opportunities in the United States. The fastest way to reach me is by
            email or LinkedIn.
          </p>
          <div className="contact-actions">
            <a className="btn btn-primary" href={`mailto:${profile.email}`}>
              <MailIcon /> {profile.email}
            </a>
            <a className="btn" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon /> LinkedIn
            </a>
            <a className="btn" href={profile.links.github} target="_blank" rel="noreferrer">
              <GithubIcon /> GitHub
            </a>
            <a className="btn" href={profile.links.resume}>
              <FileIcon /> Resume
            </a>
          </div>
          <div className="contact-actions" style={{ marginTop: 12 }}>
            {profile.phones.map((p) => (
              <a key={p.tel} className="btn btn-sm" href={`tel:${p.tel}`} aria-label={`Call ${p.label}`}>
                <PhoneIcon size={16} /> {p.display}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Home({ theme, onOpenProject, onSection }: Props) {
  return (
    <main>
      <Hero theme={theme} onSection={onSection} />
      <Projects onOpenProject={onOpenProject} />
      <About />
      <Experience />
      <Education />
      <Contact />
    </main>
  )
}
