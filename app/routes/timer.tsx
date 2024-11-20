import { getTimeValues, TimeDisplay } from '@/components/elements/time-display';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useTimer } from '@/lib/providers/utilProviders';
import { GetAllDetails, UpdateRiderTimes } from '@/servers/riders.server';
import type { RouteHandle } from '@/types/route-handle';
import { RiderDetailType } from '@/types/session';
import { ArrowPathIcon, PauseIcon } from '@heroicons/react/24/outline';
import { DialogClose } from '@radix-ui/react-dialog';
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from '@remix-run/node';
import { useLoaderData, useNavigate, useSubmit } from '@remix-run/react';
import { PlayIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 2,
	},
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { riders, race_length } = await GetAllDetails(request);
	if (riders.length > 0) {
		return { riders, race_length };
	} else {
		return redirect('/riders');
	}
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return UpdateRiderTimes({ request, successRedirectPath: '/race' });
};

export default function Timer() {
	const navigate = useNavigate();
	const submit = useSubmit();
	const { riders, race_length } = useLoaderData<typeof loader>();
	const { globalTrigger, raceLength, setRaceLength } = useTimer();
	const [riderDetails, setRiderDetails] = useState<RiderDetailType[]>(riders);
	const [error, setError] = useState<string>();

	useEffect(() => {
		if (race_length) setRaceLength(Number(race_length));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const updateRiderTime = (key: number, newTime: number) => {
		setRiderDetails((prev) =>
			prev.map((rider, index) =>
				index === key ? { ...rider, laptime: newTime } : rider
			)
		);
	};

	// const RemoveRider = (key: number) => {
	// 	setRiderDetails((prevRiders) =>
	// 		prevRiders.filter((_, index) => index !== key)
	// 	);
	// };

	// const EditRider = () => {};

	const handleSubmit = () => {
		let submittable = true;
		riderDetails.forEach((rider) => {
			if (rider.laptime === 0) submittable = false;
		});
		console.log(raceLength);
		if (submittable && raceLength > 1) {
			submit(
				{
					riders: JSON.stringify(riderDetails),
					min_time: raceLength,
				},
				{ method: 'post' }
			);
		} else {
			if (raceLength < 1) {
				setError('Race length is required to continue');
			} else {
				setError('Please ensure each rider has a time or remove the rider');
			}
		}
	};

	return (
		<>
			<Table>
				<TableCaption>
					All times are required to continue, remove riders if you want to
					continue without a time
				</TableCaption>
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
							{/* <TableCell className="text-center p-0 hidden sm:table-cell">
								<Button
									onClick={() => EditRider()}
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
							</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
			{error && <p className="text-center text-red-400 text-sm">{error}</p>}
			<div className="flex flex-col sm:flex-row mt-3 mx-auto w-[200px] sm:w-[420px]">
				<Button
					onClick={() => navigate('/riders')}
					className="mx-1 px-8 bg-gray-800 w-full"
				>
					Riders
				</Button>
				<Button
					onClick={handleSubmit}
					className="mx-1 px-8 mt-2 sm:mt-0 bg-gray-800 w-full"
				>
					Next
				</Button>
			</div>
		</>
	);
}

function TitleComponent() {
	const { handleStartAll, raceLength, setRaceLength } = useTimer();
	return (
		<div className="flex flex-col sm:flex-row items-center">
			<h1 className="text-3xl font-bold tracking-tight text-gray-900">
				Timer
			</h1>
			<div className="flex flex-col-reverse sm:flex-row sm:ml-auto">
				<div className="flex flex-row items-center mt-2 sm:mt-0">
					<p className="text-nowrap mr-2">Race Length:</p>
					<Input
						className="w-[100px]"
						type="number"
						value={raceLength === 0 ? '' : raceLength}
						onChange={(e) => setRaceLength(Number(e.target.value))}
					/>
				</div>
				<Button
					onClick={handleStartAll}
					className="sm:ml-3 px-8 bg-gray-800"
				>
					Start All Timers
				</Button>
			</div>
		</div>
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
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;
	const startTimeRef = useRef<number>(0);
	const [reset, setReset] = useState<boolean>(false);
	const [time, setTime] = useState<number>(initialTime);
	const [isRunning, setIsRunning] = useState(false);
	const [hrs, setHrs] = useState<number | null>();
	const [mins, setMins] = useState<number | null>();
	const [secs, setSecs] = useState<number | null>();

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

	const setIncrements = () => {
		const { hours, minutes, seconds } = getTimeValues(time);
		setHrs(hours);
		setMins(minutes);
		setSecs(seconds);
	};

	const saveTimeChange = () => {
		let newTime = 0;
		if (hrs) newTime += hrs * HOUR;
		if (mins) newTime += mins * MINUTE;
		if (secs) newTime += secs * SECOND;
		setTime(newTime);
	};

	return (
		<>
			<TableCell className="font-medium w-[120px] p-0">
				<Dialog>
					<DialogTrigger asChild>
						<Button
							onClick={setIncrements}
							className="py-auto px-auto bg-transparent hover:bg-transparent text-black"
						>
							<TimeDisplay time={time} />
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[300px]">
						<DialogHeader>
							<DialogTitle>Edit time</DialogTitle>
							<DialogDescription>
								Make changes to your time here. Click save when
								you&apos;re done.
							</DialogDescription>
						</DialogHeader>
						<div className="flex flex-col space-y-3 items-end pr-2 mt-2">
							<div className="flex flex-row items-center gap-1">
								<Label
									htmlFor="hours"
									className="text-right"
								>
									Hours:
								</Label>
								<Input
									id="hours"
									type="number"
									defaultValue={hrs || 0}
									onChange={(e) => setHrs(Number(e.target.value))}
									className="w-[100px]"
								/>
							</div>
							<div className="flex flex-row items-center gap-1">
								<Label
									htmlFor="minutes"
									className="text-right"
								>
									Minutes:
								</Label>
								<Input
									id="minutes"
									type="number"
									defaultValue={mins || 0}
									onChange={(e) => {
										const val = Number(e.target.value);
										val <= 60 ? setMins(val) : setMins(60);
									}}
									className="w-[100px]"
								/>
							</div>
							<div className="flex flex-row items-center gap-1">
								<Label
									htmlFor="seconds"
									className="text-right"
								>
									Seconds:
								</Label>
								<Input
									id="seconds"
									type="number"
									defaultValue={secs || 0}
									onChange={(e) => setSecs(Number(e.target.value))}
									className="w-[100px]"
								/>
							</div>
						</div>
						<p className="text-xs text-zinc-400 px-0.5">
							If you insert values higher than 60 on both mins/secs it
							will be set to 60
						</p>
						<DialogFooter className="pr-2">
							<DialogClose
								className="py-2 px-5 rounded-md bg-gray-800 text-white"
								onClick={saveTimeChange}
							>
								Save time
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
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
