import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from './Icons'

/** Slide viewer: arrows, keyboard, swipe, thumbnails and fullscreen. */
export function SlideDeck({ slides, title }: { slides: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [full, setFull] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)
  const last = slides.length - 1

  const go = useCallback((i: number) => setIndex(Math.max(0, Math.min(last, i))), [last])

  useEffect(() => {
    const onFs = () => setFull(document.fullscreenElement === root.current)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  // Preload the neighbours so the next slide appears instantly.
  useEffect(() => {
    ;[index - 1, index + 1].forEach((i) => {
      if (i >= 0 && i <= last) new Image().src = slides[i]
    })
  }, [index, last, slides])

  const [pseudo, setPseudo] = useState(false)
  const toggleFull = () => {
    if (document.fullscreenElement) return void document.exitFullscreen()
    if (pseudo) return setPseudo(false)
    const el = root.current
    // iPhone Safari has no element fullscreen: fall back to a fixed overlay.
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => setPseudo(true))
    else setPseudo(true)
  }
  const isFull = full || pseudo

  return (
    <div
      ref={root}
      className={`deck ${isFull ? 'is-full' : ''} ${pseudo ? 'pseudo' : ''}`}
      tabIndex={0}
      role="region"
      aria-roledescription="slide deck"
      aria-label={`${title} presentation`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
        if (e.key === 'Home') go(0)
        if (e.key === 'End') go(last)
        if (e.key === 'Escape' && pseudo) setPseudo(false)
      }}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="deck-stage">
        <img src={slides[index]} alt={`${title} presentation, slide ${index + 1} of ${slides.length}`} />
        <button className="deck-arrow prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous slide">
          <ArrowLeft />
        </button>
        <button className="deck-arrow next" onClick={() => go(index + 1)} disabled={index === last} aria-label="Next slide">
          <ArrowRight />
        </button>
      </div>
      <div className="deck-bar">
        <span className="deck-count" aria-live="polite">
          {index + 1} / {slides.length}
        </span>
        <div className="deck-progress" aria-hidden="true">
          <i style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
        <button className="btn btn-sm" onClick={toggleFull} aria-label={isFull ? 'Exit fullscreen' : 'Fullscreen'}>
          {isFull ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
      </div>
      {!isFull && (
        <div className="deck-thumbs">
          {slides.map((src, i) => (
            <button key={src} className={i === index ? 'active' : ''} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
