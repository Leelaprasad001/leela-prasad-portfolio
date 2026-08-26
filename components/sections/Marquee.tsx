'use client'

type MarqueeProps = {
	items: readonly string[]
}

export function Marquee({ items }: MarqueeProps) {
  const tickerItems = [...items, ...items]

	return (
		<section className="marquee-band">
			<div>
				{tickerItems.map((item, index) => (
					<span className="marquee-item" key={`${item}-${index}`}>
						{item}
					</span>
				))}
			</div>
		</section>
	)
}