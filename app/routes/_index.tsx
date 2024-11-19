import { RouteHandle } from '../types/route-handle';
import type { MetaFunction } from '@remix-run/node';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { RiderDetailType } from '@/types/session';
import { useEffect, useState } from 'react';
import { PencilIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import TimerModal from '@/components/elements/timer-modal';

export const meta: MetaFunction = () => {
	return [
		{ title: 'Lap Scheduler' },
		{ name: 'description', content: 'Schedule riders by laptime' },
	];
};

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 0,
	},
};

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">
			Riders
		</h1>
	);
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default function Index() {
	const [newRider, setNewRider] = useState<string>('');
	const [minMinutes, setMinMinutes] = useState<number>(0);
	const [expLaps, setExpLaps] = useState<number>(0);
	const [expRaceLength, setExpRaceLength] = useState<number>(0);
	const [tableRiders, setTableRiders] = useState<RiderDetailType[]>([]);
	useEffect(() => {
		const savedRiders = window.localStorage.getItem('riders');
		if (savedRiders) {
			try {
				setTableRiders(JSON.parse(savedRiders).data);
			} catch (error) {
				console.error('Error parsing saved riders:', error);
			}
		}
	}, []);

	useEffect(() => {
		if (tableRiders.length > 0) {
			window.localStorage.setItem(
				'riders',
				JSON.stringify({ data: tableRiders })
			);
		}
	}, [tableRiders]);

	useEffect(() => {
		let fastestLap = Number.MAX_VALUE;
		let isLaptime = false;
		tableRiders.forEach((rider) => {
			if (rider.laptime > 0) {
				isLaptime = true;
				if (rider.laptime < fastestLap) fastestLap = rider.laptime;
			}
		});
		if (isLaptime) {
			const minutesInTime = minMinutes * MINUTE;
			if (minutesInTime > fastestLap) {
				const expRaceLap = Math.ceil(minutesInTime / fastestLap);
				const expRaceLength = expRaceLap * fastestLap;
				setExpLaps(expRaceLap);
				setExpRaceLength(expRaceLength);
			}
		} else {
			setExpLaps(0);
			setExpRaceLength(0);
		}
	}, [minMinutes, tableRiders]);

	const AddRiders = () => {
		if (newRider !== '') {
			const newRiderList = newRider.split(',');
			newRiderList.forEach((rider) => {
				const riderObj: RiderDetailType = {
					name: rider,
					laptime: 0,
					starting_position: null,
					gap_leader: null,
					gap_next_rider: null,
					laps: 0,
					race_time: 0,
				};
				tableRiders.push(riderObj);
			});
			setTableRiders([...tableRiders]);
		}
		setNewRider('');
	};

	const RemoveRider = (key: number) => {
		const newTableRiders: RiderDetailType[] = [];
		tableRiders.forEach((rider, index) => {
			if (index !== key) newTableRiders.push(rider);
		});
		setTableRiders(newTableRiders);
	};

	const OnSaveTime = (time: number, key: number) => {
		tableRiders[key].laptime = time;
		const newRiders = RunRiderOrdering(tableRiders);
		setTableRiders(newRiders);
	};

	return (
		<>
			<header className="bg-white shadow">
				<div className="flex flex-col sm:flex-row px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="w-full text-center sm:text-left text-3xl font-bold tracking-tight text-gray-900">
						Riders
					</h1>
					<div className="flex flex-col sm:flex-row items-center">
						<div className="pr-10">
							{expLaps > 0 && (
								<h1 className="text-nowrap pr-2 text-sm">
									Expected Laps: {expLaps}
								</h1>
							)}
						</div>
						<h1 className="text-nowrap pr-2 text-sm">
							Minimum Race Length, in Minute:
						</h1>
						<Input
							className="px-auto font-semibold text-sm sm:text-lg w-[75px] "
							type="number"
							placeholder="Mins"
							value={minMinutes}
							onChange={(e) => setMinMinutes(Number(e.target.value))}
						/>
					</div>
				</div>
			</header>
			<main>
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<Table>
						<TableCaption>List of riders and their laptimes</TableCaption>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Rider</TableHead>
								<TableHead className="w-[100px]">Lap Time</TableHead>
								<TableHead className="w-[100px]">
									Starting Position
								</TableHead>
								<TableHead className="w-[100px]">
									Gap To Leaders
								</TableHead>
								<TableHead className="w-[100px]">Gap Between</TableHead>
								<TableHead className="w-[25px] text-center">
									Edit
								</TableHead>
								<TableHead className="w-[25px] text-center">
									Delete
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableRiders.map((rider, key) => (
								<TableRow key={key}>
									<TableCell className="font-medium">
										{rider.name}
									</TableCell>
									<TableCell className="text-center p-0">
										{rider.laptime ? (
											<TimerModal
												className="bg-transparent hover:bg-transparent text-black"
												onSaveTime={(time) => OnSaveTime(time, key)}
												initialTime={rider.laptime}
											>
												{TimeDisplay(rider.laptime)}
											</TimerModal>
										) : (
											<TimerModal
												className="bg-transparent hover:bg-transparent"
												onSaveTime={(time) => OnSaveTime(time, key)}
												initialTime={rider.laptime}
											>
												<PlayIcon className="size-6 text-black" />
											</TimerModal>
										)}
									</TableCell>
									<TableCell>{rider.starting_position}</TableCell>
									<TableCell>{rider.gap_leader}</TableCell>
									<TableCell>{rider.gap_next_rider}</TableCell>
									<TableCell className="text-center p-0">
										<Button className="bg-transparent hover:bg-transparent">
											<PencilIcon className="size-6 text-black" />
										</Button>
									</TableCell>
									<TableCell className="text-center p-0">
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
					<Label htmlFor="add_rider">Add rider/s</Label>
					<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
						<Input
							value={newRider}
							onChange={(e) => setNewRider(e.target.value)}
							id="add_rider"
							name="rider"
							type="text"
						/>
						<Button
							onClick={AddRiders}
							className="px-8 bg-gray-800"
						>
							Add
						</Button>
					</div>
					<p className="text-xs text-gray-500">
						To add mutliple riders - seperate their names with a comma
						&quot;,&quot;
					</p>
					{expRaceLength > 0 && TimeDisplay(expRaceLength)}
				</div>
			</main>
		</>
	);
}

function TimeDisplay(time: number) {
	const { hours, minutes, seconds, milliseconds } = getTimeValues(time);
	return (
		<p className="text-lg">
			{hours > 0 && <>{hours.toString().padStart(2, '0')}:</>}
			{minutes.toString().padStart(2, '0')}:
			{seconds.toString().padStart(2, '0')}:
			{milliseconds.toString().padStart(2, '0')}
		</p>
	);
}

function RunRiderOrdering(riderTable: RiderDetailType[]) {
	console.log('RUNNING RIDER ORDER');
	// Return early if no riders
	if (riderTable.length === 0) return riderTable;

	// Find fastest lap time
	const fastestTime = riderTable.reduce((fastest, rider) => {
		if (!rider.laptime) return fastest;
		return fastest === null
			? rider.laptime
			: Math.min(fastest, rider.laptime);
	}, null as number | null);

	// If no valid lap times, return unmodified table
	if (!fastestTime) return riderTable;

	// Reset all starting positions
	riderTable.forEach((rider) => (rider.starting_position = null));
	// For each position (1 to number of riders)
	for (let position = 1; position <= riderTable.length; position++) {
		// Find the slowest unassigned rider
		let slowestTime = 0;
		let slowestRiderIndex = -1;

		riderTable.forEach((rider, index) => {
			if (
				rider.starting_position === null &&
				rider.laptime &&
				rider.laptime > slowestTime
			) {
				slowestTime = rider.laptime;
				slowestRiderIndex = index;
			}
		});

		// Assign the position to the slowest rider
		if (slowestRiderIndex !== -1) {
			riderTable[slowestRiderIndex].starting_position = position;
		}
	}
	return [...riderTable];
}

function TimeGaps(riderTable: RiderDetailType[], raceLength: number) {
	// Calculate race parameters
	const raceLengthInMs = raceLength * MINUTE;
	const expectedLaps = Math.ceil(raceLengthInMs / fastestTime);
}

function getTimeValues(time: number) {
	const hours = Math.floor(time / HOUR);
	const minutes = Math.floor((time / MINUTE) % 60);
	const seconds = Math.floor((time / SECOND) % 60);
	const milliseconds = Math.floor((time % SECOND) / 10);
	return { hours, minutes, seconds, milliseconds };
}
