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
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import type { riderDetailType } from '@/types/session';
import { useEffect, useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';
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
	const actionData = useActionData<typeof action>();
	const loaderData: { riders: riderDetailType[] } = useLoaderData();
	const [tableRiders, setTableRiders] = useState<riderDetailType[]>(
		loaderData.riders
	);

	useEffect(() => {
		console.log('ACTION DATA:', actionData);
		if (actionData?.riders) {
			setTableRiders(actionData.riders);
		}
	}, [actionData]);

	return (
		<>
			<Table>
				<TableCaption>List of riders and their laptimes</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Rider</TableHead>
						<TableHead className="w-[100px]">Lap Time</TableHead>
						<TableHead>Starting Position</TableHead>
						{/* <TableHead className="w-[25px] text-center">Edit</TableHead>
						<TableHead className="w-[25px] text-center">Delete</TableHead> */}
					</TableRow>
				</TableHeader>
				<TableBody>
					{tableRiders.map((rider, key) => (
						<TableRow key={key}>
							<TableCell className="font-medium">{rider.name}</TableCell>
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
							{/* <TableCell className="text-center p-0">
								<Button className="bg-transparent hover:bg-transparent">
									<PencilIcon className="size-6 text-black" />
								</Button>
							</TableCell>
							<TableCell className="text-center p-0">
								<Button className="bg-transparent hover:bg-transparent">
									<XMarkIcon className="size-6 text-black" />
								</Button>
							</TableCell> */}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<Form method="post">
				<Label htmlFor="add_rider">Add rider/s</Label>
				<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
					<Input
						id="add_rider"
						name="rider"
						type="text"
					/>
					<Button
						type="submit"
						className="px-8 bg-gray-800"
					>
						Add
					</Button>
				</div>
				<p className="text-xs text-gray-500">
					To add mutliple riders - seperate their names with a comma
					&quot;,&quot;
				</p>
			</Form>
		</>
	);
}

function TimeDisplay(time: number) {
	const SECOND = 1000;
	const MINUTE = SECOND * 60;
	const HOUR = MINUTE * 60;
	const hours = Math.floor(time / HOUR);
	const minutes = Math.floor((time / MINUTE) % 60);
	const seconds = Math.floor((time / SECOND) % 60);
	const milliseconds = Math.floor((time % SECOND) / 10);
	return (
		<p className="text-lg">
			{hours > 0 && <>{hours.toString().padStart(2, '0')}:</>}
			{minutes.toString().padStart(2, '0')}:
			{seconds.toString().padStart(2, '0')}:
			{milliseconds.toString().padStart(2, '0')}
		</p>
	);
}
