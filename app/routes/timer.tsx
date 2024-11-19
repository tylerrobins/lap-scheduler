import { TimeDisplay } from '@/components/elements/time-display';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { GetRiders } from '@/servers/riders.server';
import type { RouteHandle } from '@/types/route-handle';
import { RiderDetailType } from '@/types/session';
import {
	ArrowPathIcon,
	PauseIcon,
	PencilIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 2,
	},
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const riders = await GetRiders(request);
	if (riders.length > 0) {
		return riders;
	} else {
		return redirect('/riders');
	}
};

export default function Timer() {
	const loaderData = useLoaderData<typeof loader>();
	const [riderDetails, setRiderDetails] =
		useState<RiderDetailType[]>(loaderData);
	const [globalTrigger, setGlobalTrigger] = useState(false);

	const handleStartAll = () => {
		setGlobalTrigger(true);
		setTimeout(() => {
			setGlobalTrigger(false);
		}, 1000);
	};

	const updateRiderTime = (key: number, newTime: number) => {
		setRiderDetails((prev) =>
			prev.map((rider, index) =>
				index === key ? { ...rider, laptime: newTime } : rider
			)
		);
	};

	const RemoveRider = (key: number) => {
		setRiderDetails((prevRiders) =>
			prevRiders.filter((_, index) => index !== key)
		);
	};

	const EditRider = (key: number) => {};

	return (
		<>
			<Button onClick={handleStartAll}>RUN ALL</Button>
			<Table>
				<TableCaption>List of Riders</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="">Rider</TableHead>
						<TableHead className="text-left">Lap Time</TableHead>
						<TableHead className="w-[45px] text-center">
							Start Timer
						</TableHead>
						<TableHead className="w-[45px] text-center">
							Reset Timer
						</TableHead>
						<TableHead className="w-[35px] text-center hidden sm:table-cell">
							Edit Time
						</TableHead>
						<TableHead className="w-[35px] text-center hidden sm:table-cell">
							Delete Rider
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{riderDetails.map((rider, key) => (
						<TableRow key={key}>
							<TableCell className="font-medium">{rider.name}</TableCell>
							<TimerTableBlock
								initialTime={rider.laptime}
								onTimeUpdate={(newTime) =>
									updateRiderTime(key, newTime)
								}
								globalTrigger={globalTrigger}
							/>
							<TableCell className="text-center p-0 hidden sm:table-cell">
								<Button
									onClick={() => EditRider(key)}
									className="bg-transparent hover:bg-transparent"
								>
									<PencilIcon className="size-6 text-black" />
								</Button>
							</TableCell>
							<TableCell className="text-center p-0 hidden sm:table-cell">
								<Button
									onClick={() => RemoveRider(key)}
									className="bg-transparent hover:bg-transparent"
								>
									<XMarkIcon className="size-6 text-black" />
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex flex-col sm:flex-row mt-3 mx-auto w-[200px] sm:w-[420px]">
				<Button className="mx-1 px-8 bg-gray-800 w-full">Riders</Button>
				<Button className="mx-1 px-8 mt-2 sm:mt-0 bg-gray-800 w-full">
					Next
				</Button>
			</div>
		</>
	);
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Timer</h1>
	);
}

function TimerTableBlock({
	initialTime,
	onTimeUpdate,
	globalTrigger,
}: {
	initialTime: number;
	onTimeUpdate: (time: number) => void;
	globalTrigger?: boolean;
}) {
	const startTimeRef = useRef<number>(0);
	const [reset, setReset] = useState<boolean>(true);
	const [time, setTime] = useState<number>(initialTime);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (isRunning) {
			intervalId = setInterval(() => {
				const newTime = Date.now() - startTimeRef.current;
				setTime(newTime);
				onTimeUpdate(newTime);
			}, 1);
		}
		return () => clearInterval(intervalId);
	}, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (!isRunning && globalTrigger) {
			startStop();
		}
	}, [globalTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

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
		<>
			<TableCell className="font-medium w-[140px]">
				<TimeDisplay time={time} />
			</TableCell>
			<TableCell className="text-center p-0">
				<Button
					onClick={startStop}
					className="bg-transparent hover:bg-transparent"
				>
					{isRunning ? (
						<PauseIcon className="size-6 text-black" />
					) : (
						<PlayIcon className="size-6 text-black" />
					)}
				</Button>
			</TableCell>
			<TableCell className="text-center p-0">
				<Button
					onClick={resetTime}
					className="bg-transparent hover:bg-transparent"
				>
					<ArrowPathIcon className="size-6 text-black" />
				</Button>
			</TableCell>
		</>
	);
}