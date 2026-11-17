import { useEffect } from 'react'
import { profile, resumes } from '../content'
import { ArrowLeft, DownloadIcon, ExternalIcon, LinkedinIcon, MailIcon, PhoneIcon, PinIcon } from './Icons'

/** Bilingual resume page: English column on the left, French column on the right. */
export function ResumePage({ onBack }: { onBack: () => void }) {
  useEffect(() => {
    window.scrollTo({ top: 0 })
    document.title = `Resume · ${profile.name}`
    return () => {
      document.title = `${profile.name} · Software Engineer`
    }
  }, [])

  return (
    <main className="fade-in">
      <section className="pp-hero rs-hero">
        <div className="container">
          <button className="back-link" onClick={onBack}>
            <ArrowLeft /> Back home
          </button>
          <p className="eyebrow">Resume · CV</p>
          <h1 className="rs-title">
            {profile.name}
            <span className="rs-title-sub">Two languages, one profile.</span>
          </h1>
          <div className="rs-contact">
            <a href={`mailto:${profile.email}`}>
              <MailIcon size={18} /> {profile.email}
            </a>
            {profile.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} title={p.label}>
                <PhoneIcon size={18} /> {p.display}
              </a>
            ))}
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedinIcon size={18} /> LinkedIn
            </a>
            <span>
              <PinIcon size={18} /> {profile.location}
            </span>
          </div>
        </div>
      </section>

      <section className="section rs-section">
        <div className="container rs-grid">
          {resumes.map((r, i) => (
            <article key={r.lang} className={`rs-col ${i === 0 ? 'rs-left' : 'rs-right'}`} lang={r.lang}>
              <header className="rs-col-head">
                <span className="rs-flag">{r.flag}</span>
                <div>
                  <h2>{r.heading}</h2>
                  <p>
                    {r.language} · {r.role}
                  </p>
                </div>
              </header>

              <a className="rs-paper" href={r.pdf} target="_blank" rel="noreferrer" aria-label={`${r.open} (${r.language})`}>
                <img src={r.preview} alt={`${r.heading} ${profile.name} (${r.language})`} loading="lazy" />
                <span className="rs-paper-hover">
                  <ExternalIcon size={18} /> {r.open}
                </span>
              </a>

              <div className="rs-actions">
                <a className="btn btn-primary" href={r.pdf} target="_blank" rel="noreferrer">
                  <ExternalIcon size={18} /> {r.open}
                </a>
                <a className="btn" href={r.pdf} download>
                  <DownloadIcon size={18} /> {r.download}
                </a>
              </div>

              <div className="rs-about">
                <h3>{r.aboutTitle}</h3>
                {r.about.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </article>
          ))}
          <div className="rs-divider" aria-hidden="true">
            <span>EN</span>
            <i />
            <span>FR</span>
          </div>
        </div>
      </section>
    </main>
  )
}
