'use client'

import { ArrowUpRight, AtSign, Link, Mail, MessageCircle, Phone } from 'lucide-react'

export function Contact() {
	return (
		<section className="contact-section container" id="contact">
			<div className="contact-inner">
				<div className="section-label">07 / CONTACT</div>
				<h2>
					Have an idea?
					<br />
					<em>Let&apos;s make it real.</em>
				</h2>
				<a className="button button-light" href="mailto:leelaprasad1607@gmail.com">
					Get in touch <ArrowUpRight size={17} />
				</a>
				<div className="socials">
					<a href="https://www.linkedin.com/in/leela-prasad-bantu/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
						<Link size={19} />
					</a>
					<a href="https://www.instagram.com/leelaprasad_bantu/" target="_blank" rel="noreferrer" aria-label="Instagram">
						<AtSign size={19} />
					</a>
					<a
						href="https://mail.google.com/mail/u/0/?fs=1&to=leelaprasad1607@gmail.com&tf=cm"
						target="_blank"
						rel="noreferrer"
						aria-label="Gmail compose"
					>
						<Mail size={19} />
					</a>
					<a href="tel:+916305878367" aria-label="Call 6305878367">
						<Phone size={19} />
					</a>
					<a href="https://wa.me/916305878367" target="_blank" rel="noreferrer" aria-label="WhatsApp 6305878367">
						<MessageCircle size={19} />
					</a>
				</div>
			</div>
		</section>
	)
}