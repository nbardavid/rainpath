import type { Slide } from "../../../types/cases";

interface SlideItemProps {
	slide: Slide;
	index: number;
}

export function SlideItem({ slide, index }: SlideItemProps) {
	return (
		<li className="flex items-center gap-3 rounded-lg bg-[var(--muted)] px-3 py-2 text-sm">
			<span className="flex h-7 items-center justify-center rounded-full bg-[var(--card)] px-2 font-bold text-[var(--muted-foreground)]">
				{`Lame ${index + 1}:`}
			</span>

			<span className="text-[var(--foreground)] text-sm">{slide.staining}</span>
		</li>
	);
}
