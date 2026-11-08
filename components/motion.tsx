'use client'

import { useEffect } from 'react'

/**
 * Site-wide motion layer. Zero dependencies, attaches to existing class names so
 * section markup/content stays untouched.
 *
 * - Scroll reveals: one IntersectionObserver, batch-aware stagger.
 * - Carousel: newly mounted project cards animate in (MutationObserver).
 * - Pointer spotlight on cards + magnetic CTAs: one passive pointermove, rAF-throttled.
 * - Pauses decorative infinite animations while they are off-screen.
 *
 * State lives in data-* attributes (never className) so React re-renders never wipe it.
 */

const REVEAL_SINGLE = [
	'.section-label',
	'.carousel-controls',
	'.about-grid > h2',
	'.about-grid > div > *',
	'.experience-row > h2',
	'.skills-grid > h2',
	'.focus-content > div',
	'.focus-content > p',
	'.contact-inner',
	'.project-more-card',
	'.intelligence-head',
	'.intelligence-subtitle',
	'.intelligence-chat',
	'.footer',
]

// Children of these containers reveal one-by-one.
const REVEAL_GROUPS = ['.services-grid', '.timeline', '.skills-content-col', '.project-grid', '.socials', '.toolkit-profile-links']

const SPOTLIGHT = '.service, .project-card'
const MAGNETIC = '.hero-actions .button, .nav-cta, .project-more-link, .contact-inner .button, .socials a'
const PAUSE_OFFSCREEN = '.hero, .marquee-band'

const STAGGER_MS = 75
const MAX_STAGGER = 6

type Magnet = { x: number; y: number; tx: number; ty: number }

export function Motion() {
	useEffect(() => {
		const root = document.documentElement
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduceMotion || !('IntersectionObserver' in window)) return

		const cleanups: Array<() => void> = []

		/* ---------- Scroll reveals ---------- */
		const revealObserver = new IntersectionObserver(
			(entries) => {
				let batch = 0
				for (const entry of entries) {
					const el = entry.target as HTMLElement
					if (!entry.isIntersecting) {
						// Skipped over (anchor jump / fast scroll): show it without animating.
						if (entry.boundingClientRect.bottom < 0) {
							delete el.dataset.reveal
							revealObserver.unobserve(el)
						}
						continue
					}
					el.style.setProperty('--reveal-i', String(Math.min(batch++, MAX_STAGGER)))
					el.dataset.reveal = 'in'
					revealObserver.unobserve(el)
				}
			},
			{ rootMargin: '0px 0px -8% 0px', threshold: 0 },
		)
		cleanups.push(() => revealObserver.disconnect())

		const viewportH = window.innerHeight
		const pending = new Set<HTMLElement>()
		const register = (el: Element) => {
			const node = el as HTMLElement
			// Already revealed: nothing to do. A hidden ('') node from a previous effect run
			// (React Strict Mode mounts effects twice in dev) must be observed again.
			if (node.dataset.reveal === 'in' || node.dataset.reveal === 'swap') return
			if (node.dataset.reveal === undefined) {
				// Already on screen at load (e.g. reload mid-page): leave it visible, no flicker.
				const rect = node.getBoundingClientRect()
				if (rect.top < viewportH && rect.bottom > 0) return
				node.dataset.reveal = ''
			}
			pending.add(node)
			revealObserver.observe(node)
		}

		// Never leave content stranded invisible: on teardown, un-hide anything not yet revealed.
		cleanups.push(() => {
			pending.forEach((node) => {
				if (node.dataset.reveal === '') delete node.dataset.reveal
			})
		})

		document.querySelectorAll(REVEAL_SINGLE.join(',')).forEach(register)
		REVEAL_GROUPS.forEach((selector) => {
			document.querySelectorAll(selector).forEach((group) => Array.from(group.children).forEach(register))
		})

		root.classList.add('motion-ready')
		cleanups.push(() => root.classList.remove('motion-ready'))

		/* ---------- Carousel: animate cards React mounts later ---------- */
		document.querySelectorAll('.project-grid').forEach((grid) => {
			const mo = new MutationObserver((mutations) => {
				let i = 0
				for (const m of mutations) {
					m.addedNodes.forEach((node) => {
						if (!(node instanceof HTMLElement)) return
						node.style.setProperty('--reveal-i', String(i++))
						node.dataset.reveal = 'swap'
					})
				}
			})
			mo.observe(grid, { childList: true })
			cleanups.push(() => mo.disconnect())
		})

		/* ---------- Pause decorative loops while off-screen ---------- */
		const offscreenObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				const el = entry.target as HTMLElement
				if (entry.isIntersecting) delete el.dataset.offscreen
				else el.dataset.offscreen = ''
			}
		})
		document.querySelectorAll(PAUSE_OFFSCREEN).forEach((el) => offscreenObserver.observe(el))
		cleanups.push(() => offscreenObserver.disconnect())

		/* ---------- Pointer: spotlight + magnetic buttons ---------- */
		const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
		if (finePointer) {
			const magnets = new Map<HTMLElement, Magnet>()
			let activeMagnet: HTMLElement | null = null
			let lastEvent: PointerEvent | null = null
			let pointerFrame = 0
			let magnetFrame = 0

			const tickMagnets = () => {
				let moving = false
				magnets.forEach((m, el) => {
					m.x += (m.tx - m.x) * 0.2
					m.y += (m.ty - m.y) * 0.2
					const settled = Math.abs(m.tx - m.x) < 0.05 && Math.abs(m.ty - m.y) < 0.05
					if (settled && m.tx === 0 && m.ty === 0) {
						el.style.removeProperty('translate')
						magnets.delete(el)
						return
					}
					el.style.translate = `${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`
					if (!settled) moving = true
				})
				magnetFrame = moving ? requestAnimationFrame(tickMagnets) : 0
			}
			const kickMagnets = () => {
				if (!magnetFrame) magnetFrame = requestAnimationFrame(tickMagnets)
			}

			const processPointer = () => {
				pointerFrame = 0
				const e = lastEvent
				if (!e) return
				const target = e.target instanceof Element ? e.target : null

				const card = target?.closest<HTMLElement>(SPOTLIGHT)
				if (card) {
					const r = card.getBoundingClientRect()
					card.style.setProperty('--mx', `${e.clientX - r.left}px`)
					card.style.setProperty('--my', `${e.clientY - r.top}px`)
				}

				const magnet = target?.closest<HTMLElement>(MAGNETIC) ?? null
				if (activeMagnet && activeMagnet !== magnet) {
					const prev = magnets.get(activeMagnet)
					if (prev) prev.tx = prev.ty = 0
				}
				activeMagnet = magnet
				if (magnet) {
					const m = magnets.get(magnet) ?? { x: 0, y: 0, tx: 0, ty: 0 }
					const r = magnet.getBoundingClientRect()
					const cx = r.left - m.x + r.width / 2
					const cy = r.top - m.y + r.height / 2
					const strength = 0.22
					m.tx = Math.max(-10, Math.min(10, (e.clientX - cx) * strength))
					m.ty = Math.max(-8, Math.min(8, (e.clientY - cy) * strength))
					magnets.set(magnet, m)
				}
				kickMagnets()
			}

			const onPointerMove = (e: PointerEvent) => {
				lastEvent = e
				if (!pointerFrame) pointerFrame = requestAnimationFrame(processPointer)
			}
			const onPointerLeaveWindow = () => {
				if (activeMagnet) {
					const m = magnets.get(activeMagnet)
					if (m) m.tx = m.ty = 0
					activeMagnet = null
					kickMagnets()
				}
			}

			window.addEventListener('pointermove', onPointerMove, { passive: true })
			document.documentElement.addEventListener('pointerleave', onPointerLeaveWindow)
			cleanups.push(() => {
				window.removeEventListener('pointermove', onPointerMove)
				document.documentElement.removeEventListener('pointerleave', onPointerLeaveWindow)
				cancelAnimationFrame(pointerFrame)
				cancelAnimationFrame(magnetFrame)
				magnets.forEach((_, el) => el.style.removeProperty('translate'))
			})
		}

		return () => cleanups.forEach((fn) => fn())
	}, [])

	return null
}
