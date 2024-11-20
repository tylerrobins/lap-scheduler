import { cn } from '@/lib/utils';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export function TimeDisplay({
	time,
	showMili = true,
	className,
}: {
	time: number;
	showMili?: boolean;
	className?: string;
}) {
	const { hours, minutes, seconds, milliseconds } = getTimeValues(time);
	return (
		<p className={cn('text-base', className)}>
			{hours > 0 && <>{hours.toString().padStart(2, '0')}:</>}
			{minutes.toString().padStart(2, '0')}:
			{seconds.toString().padStart(2, '0')}
			{showMili && <>:{milliseconds.toString().padStart(2, '0')}</>}
		</p>
	);
}

export function getTimeValues(time: number) {
	const hours = Math.floor(time / HOUR);
	const minutes = Math.floor((time / MINUTE) % 60);
	const seconds = Math.floor((time / SECOND) % 60);
	const milliseconds = Math.floor((time % SECOND) / 10);
	return { hours, minutes, seconds, milliseconds };
}
