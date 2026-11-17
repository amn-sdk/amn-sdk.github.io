import { useEffect, useState } from 'react'
import { categories, profile, projects, type Project } from '../content'
import {
  ArrowLeft,
  ArrowRight,
  BoltIcon,
  BulbIcon,
  ChartIcon,
  CheckIcon,
  ExternalIcon,
  GithubIcon,
  LayersIcon,
  NetworkIcon,
  TargetIcon,
  UserIcon,
  UsersIcon,
  PlayIcon,
} from './Icons'
import { ProjectArt } from './ProjectArt'
import { SlideDeck } from './SlideDeck'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'results', label: 'Results' },
  { id: 'demo', label: 'Demo' },
]

const STEP_ICONS = [LayersIcon, NetworkIcon, BoltIcon, ChartIcon]

function isMe(name: string) {
  return name.toLowerCase() === profile.name.toLowerCase()
}

export function ProjectPage({ project, onBack, onOpen }: { project: Project; onBack: () => void; onOpen: (slug: string) => void }) {
  const [tab, setTab] = useState('overview')
  const index = projects.findIndex((p) => p.slug === project.slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const primaryCat = categories.find((c) => c.id === project.categories[0])
  const hasDemo = Boolean(project.video || project.gallery?.length || project.slides?.length)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setTab('overview')
    document.title = `${project.title} · ${profile.name}`
    return () => {
      document.title = `${profile.name} · Software Engineer`
    }
  }, [project.slug, project.title])

  const goTab = (id: string) => {
    setTab(id)
    document.getElementById(`panel-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="fade-in" key={project.slug}>
      <section className="pp-hero">
        <div className="container">
          <button className="back-link" onClick={onBack}>
            <ArrowLeft /> Back to Projects
          </button>
          <div className="pp-hero-grid">
            <div>
              <div className="pp-tags">
                {primaryCat && (
                  <span className="pp-tag primary">
                    <BulbIcon size={18} /> {primaryCat.title}
                  </span>
                )}
                {project.tags.map((t) => (
                  <span key={t} className="pp-tag">
                    {t}
                  </span>
                ))}
              </div>
              <h1>{project.title}</h1>
              <p className="pp-tagline">{project.tagline}</p>
              <div className="hero-actions">
                {project.repo ? (
                  <a className="btn btn-primary" href={project.repo} target="_blank" rel="noreferrer">
                    <GithubIcon /> View on GitHub <ExternalIcon size={18} />
                  </a>
                ) : (
                  <span className="repo-note">{project.repoNote}</span>
                )}
              </div>
              <p className="pp-context">
                {project.context} · {project.kind}
              </p>
            </div>
            <div className="pp-visual">
              <div className="laptop">
                <div className={`laptop-screen ${project.video ? 'has-video' : ''}`}>
                  <ProjectArt key={project.slug} project={project} eager video />
                </div>
              </div>
              <div className="laptop-base" />
            </div>
          </div>
          <div className="pp-tabs" role="tablist">
            {TABS.filter((t) => t.id !== 'demo' || hasDemo).map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className={`pp-tab ${tab === t.id ? 'active' : ''}`} onClick={() => goTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <div className="pp-grid">
          <div className="pp-col">
            <div className="panel" id="panel-overview">
              <div className="panel-title">
                <TargetIcon size={26} /> The Problem
              </div>
              <p>{project.problem}</p>
            </div>
            <div className="panel">
              <div className="panel-title">
                <UserIcon size={26} /> My Role
              </div>
              <p>{project.role}</p>
            </div>
            <div className="panel">
              <div className="panel-title">
                <LayersIcon size={26} /> Technical Choices
              </div>
              <ul className="bullets">
                {project.choices.map((c) => (
                  <li key={c.name}>
                    <strong>{c.name}</strong> {c.why}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pp-col pp-col-mid">
            <div className="panel" id="panel-architecture">
              <div className="panel-title">
                <NetworkIcon size={26} /> Architecture
              </div>
              <div className="flow">
                {project.architecture.map((s, i) => {
                  const Icon = STEP_ICONS[i % STEP_ICONS.length]
                  return (
                    <div key={s.label} style={{ display: 'contents' }}>
                      {i > 0 && <ArrowRight className="flow-arrow" size={18} />}
                      <div className={`flow-step ${i === 1 ? 'highlight' : ''}`}>
                        <Icon size={24} />
                        <span className="flow-label">{s.label}</span>
                        <span className="flow-sub">{s.sub}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="panel" id="panel-challenges">
              <div className="panel-title">
                <BoltIcon size={26} /> Challenges & Solutions
              </div>
              <div className="challenges">
                {project.challenges.map((c) => (
                  <div key={c.problem} className="challenge">
                    <div className="challenge-q">{c.problem}</div>
                    <ArrowRight size={18} style={{ color: 'var(--text-2)' }} />
                    <div className="challenge-a">
                      <span className="check">
                        <CheckIcon size={13} />
                      </span>
                      {c.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pp-col">
            <div className="panel">
              <div className="panel-title">
                <LayersIcon size={26} /> Technology Stack
              </div>
              <div className="stack-chips">
                {project.stack.map((s) => (
                  <span key={s} className="stack-chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="panel" id="panel-results">
              <div className="panel-title">
                <ChartIcon size={26} /> Results
              </div>
              <div className="results">
                {project.results.map((r) => (
                  <div key={r.title} className="result">
                    <span className="check" style={{ width: 26, height: 26, marginTop: 2 }}>
                      <CheckIcon size={14} />
                    </span>
                    <div>
                      <div className="result-title">{r.title}</div>
                      <div className="result-detail">{r.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {project.team && (
              <div className="panel">
                <div className="panel-title">
                  <UsersIcon size={26} /> Team
                </div>
                <div className="team-list">
                  {project.team.map((m) => (
                    <span key={m} className={`team-member ${isMe(m) ? 'me' : ''}`}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="panel">
              <div className="panel-title">
                <BulbIcon size={26} /> What I learned
              </div>
              <p>{project.learned}</p>
            </div>
          </div>
        </div>

        {hasDemo && (
          <section className="panel demo-panel" id="panel-demo" aria-label="Demo">
            <div className="panel-title">
              <PlayIcon size={26} /> Demo
            </div>
            <p className="demo-lead">
              {project.video || project.gallery?.length
                ? 'Real screen recording and screenshots of the running project.'
                : project.slidesNote}
            </p>
            {project.slides && project.slides.length > 0 && <SlideDeck slides={project.slides} title={project.title} />}
            {project.video && (
              <video
                className="demo-video"
                src={project.video}
                poster={project.gallery?.[0]}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${project.title} demo recording`}
              />
            )}
            {project.gallery && project.gallery.length > 0 && (
              <div className="demo-shots">
                {project.gallery.map((src, i) => (
                  <a key={src} href={src} target="_blank" rel="noreferrer" aria-label={`Open screenshot ${i + 1} of ${project.title}`}>
                    <img src={src} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" />
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        <nav className="pp-next" aria-label="More projects">
          <button onClick={() => onOpen(prev.slug)}>
            <small>Previous</small>
            <span>← {prev.title}</span>
          </button>
          <button onClick={() => onOpen(next.slug)}>
            <small>Next</small>
            <span>{next.title} →</span>
          </button>
        </nav>
      </div>
    </main>
  )
}
