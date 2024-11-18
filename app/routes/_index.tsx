import { RouteHandle } from '../types/route-handle';
import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	MetaFunction,
} from '@remix-run/node';
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
import { addRider, getRiders } from '@/servers/riders.server';
import { useActionData, useLoaderData } from '@remix-run/react';
import type { riderDetailType } from '@/types/session';
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
	title: 'Home',
	navbarProps: {
		activeIndex: 0,
	},
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return getRiders(request);
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return await addRider(request);
};

export default function Index() {
	const loaderData: { riders: riderDetailType[] } = useLoaderData();
	const [newRider, setNewRider] = useState<string>('');
	const [expectedLaps, setExpectedLaps] = useState<number>();
	const [tableRiders, setTableRiders] = useState<riderDetailType[]>(
		loaderData.riders
	);

	useEffect(() => {
		console.log('RIDERS:', tableRiders);
	}, [tableRiders]);

	const addRiders = () => {
		console.log('new rider:', newRider);
		if (newRider !== '') {
			const newRiderList = newRider.split(',');
			newRiderList.forEach((rider) => {
				const riderObj: riderDetailType = {
					name: rider,
					laptime: null,
					starting_position: null,
					gap_leader: null,
					gap_next_rider: null,
				};
				tableRiders.push(riderObj);
			});
		}
		setNewRider('');
	};

	const RemoveRider = (key: number) => {
		const newTableRiders: riderDetailType[] = [];
		tableRiders.forEach((rider, index) => {
			if (index !== key) newTableRiders.push(rider);
		});
		setTableRiders(newTableRiders);
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
							<h1 className="text-nowrap pr-2 text-sm">
								Expected Laps: {expectedLaps}
							</h1>
						</div>
						<h1 className="text-nowrap pr-2 text-sm">
							Minimum Race Length, in Minute:
						</h1>
						<Input
							className="px-auto font-semibold text-sm sm:text-lg w-[75px] "
							type="number"
							placeholder="Mins"
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
								<TableHead>Starting Position</TableHead>
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
											<>{TimeDisplay(rider.laptime)}</>
										) : (
											<TimerModal
												className="bg-transparent hover:bg-transparent"
												riderIndex={key}
												tableRiders={tableRiders}
												setTableRiders={setTableRiders}
											>
												<PlayIcon className="size-6 text-black" />
											</TimerModal>
										)}
									</TableCell>
									<TableCell>{rider.starting_position}</TableCell>
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
							onClick={addRiders}
							className="px-8 bg-gray-800"
						>
							Add
						</Button>
					</div>
					<p className="text-xs text-gray-500">
						To add mutliple riders - seperate their names with a comma
						&quot;,&quot;
					</p>
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

function RunRiderOrdering({
	riderTable,
	raceLength,
}: {
	riderTable: riderDetailType[];
	raceLength: number;
}) {
	const MINUTE = 1000 * 60;
	let fastestTime = riderTable[0].laptime;
	riderTable.forEach((rider) => {
		if (rider.laptime && fastestTime && rider.laptime < fastestTime)
			fastestTime = rider.laptime;
	});
	if (fastestTime) {
		const raceLenghtInTime = raceLength * MINUTE;
		const expectedLaps = Math.ceil(raceLenghtInTime / fastestTime);
		const minTime = 
	} else return riderTable;
}

function getTimeValues(time: number) {
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;
	const hours = Math.floor(time / HOUR);
	const minutes = Math.floor((time / MINUTE) % 60);
	const seconds = Math.floor((time / SECOND) % 60);
	const milliseconds = Math.floor((time % SECOND) / 10);
	return { hours, minutes, seconds, milliseconds };
}
