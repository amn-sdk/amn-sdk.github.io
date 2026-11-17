import type { Project } from '../content'
import { CategoryIcon } from './Icons'

/** Image of a project, or a generated cover when no screenshot is available yet. */
const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function ProjectArt({ project, eager = false, video = false }: { project: Project; eager?: boolean; video?: boolean }) {
  if (video && project.video && !reducedMotion()) {
    return (
      <video
        src={project.video}
        poster={project.gallery?.[0] ?? project.image}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`${project.title} demo recording`}
      />
    )
  }
  if (project.image) {
    return <img src={project.image} alt={`${project.title} screenshot`} loading={eager ? 'eager' : 'lazy'} />
  }
  const cat = project.categories[0]
  return (
    <div
      role="img"
      aria-label={`${project.title} cover`}
      style={{
        width: '100%',
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        position: 'relative',
        background:
          'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(circle at 25% 75%, rgba(59,108,255,0.3), transparent 55%), #0a1026',
        backgroundSize: 'cover',
      }}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }} aria-hidden="true">
        <defs>
          <pattern id={`grid-${project.slug}`} width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#8b9dff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${project.slug})`} />
      </svg>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ transform: 'scale(1.3)' }}>
          <CategoryIcon id={cat} />
        </div>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 20, fontWeight: 600, color: '#eef1ff' }}>
          {project.title}
        </span>
      </div>
    </div>
  )
}
