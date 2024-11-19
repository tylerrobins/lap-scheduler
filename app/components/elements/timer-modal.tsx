import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { useEffect, useRef, useState } from 'react';
import { DialogClose } from '@radix-ui/react-dialog';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default function TimerModal({
	onSaveTime,
	initialTime = 0,
	children,
	className,
}: {
	onSaveTime: (time: number) => void;
	initialTime?: number;
	children?: React.ReactNode;
	className?: string;
}) {
	const startTimeRef = useRef<number>(0);
	const [reset, setReset] = useState<boolean>(true);
	const [time, setTime] = useState<number>(initialTime);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (isRunning) {
			intervalId = setInterval(
				() => setTime(Date.now() - startTimeRef.current),
				1
			);
		}
		return () => clearInterval(intervalId);
	}, [isRunning]);

	const hours = Math.floor(time / HOUR);
	const minutes = Math.floor((time / MINUTE) % 60);
	const seconds = Math.floor((time / SECOND) % 60);
	const milliseconds = Math.floor((time % SECOND) / 10);

	const startStop = () => {
		if (isRunning) {
			setIsRunning(false);
		} else {
			if (reset) {
				startTimeRef.current = Date.now();
			} else {
				startTimeRef.current = Date.now() - time;
			}
			setReset(false);
			setIsRunning(true);
		}
	};

	const resetTime = () => {
		stop();
		setReset(true);
		setTime(0);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className={className}>{children}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">Timer</DialogTitle>
					<DialogDescription>
						<div className="text-3xl">
							<p className="">
								{hours > 0 && (
									<span>{hours.toString().padStart(2, '0')}:</span>
								)}
								{minutes.toString().padStart(2, '0')}:
								{seconds.toString().padStart(2, '0')}:
								{milliseconds.toString().padStart(2, '0')}
							</p>
							<div className="">
								<Button
									className=""
									onClick={startStop}
								>
									{isRunning ? 'Stop' : 'Start'}
								</Button>
								<Button
									className=""
									onClick={resetTime}
								>
									Reset
								</Button>
							</div>
						</div>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose onClick={() => onSaveTime(time)}>Save</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
