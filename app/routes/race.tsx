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
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 3,
	},
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const riders = await GetRiders(request);
	for (const rider of riders) {
		if (rider.laptime < 1) {
			return redirect('/timer');
		}
	}
	if (riders.length === 0) return redirect('/riders');
	return riders;
};

export default function Race() {
	const navigate = useNavigate();
	const loaderData = useLoaderData<typeof loader>();
	return (
		<>
			<Table>
				<TableCaption>Race Details</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Start Pos.</TableHead>
						<TableHead className="">Rider</TableHead>
						<TableHead className="">Laps</TableHead>
						<TableHead className="">To Leader</TableHead>
						<TableHead className="">To Previous</TableHead>
						<TableHead className="">Lap Time</TableHead>
						<TableHead className="">Race Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loaderData.map((rider, key) => (
						<TableRow key={key}>
							<TableCell className="font-medium">
								{rider.starting_position}
							</TableCell>
							<TableCell className="font-medium">{rider.name}</TableCell>
							<TableCell className="font-medium">{rider.laps}</TableCell>
							<TableCell className="font-medium">
								<TimeDisplay
									time={rider.gap_leader || 0}
									showMili={false}
									alwaysValid={false}
								/>
							</TableCell>
							<TableCell className="font-medium">
								<TimeDisplay
									time={rider.gap_next_rider || 0}
									showMili={false}
									alwaysValid={false}
								/>
							</TableCell>
							<TableCell className="font-medium">
								<TimeDisplay
									time={rider.laptime}
									showMili={false}
								/>
							</TableCell>
							<TableCell className="font-medium">
								<TimeDisplay
									time={rider.race_time}
									showMili={false}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex flex-col sm:flex-row mt-3 mx-auto w-[200px] sm:w-[420px]">
				<Button
					onClick={() => navigate('/timer')}
					className="mx-1 px-8 bg-gray-800 w-full"
				>
					Timer
				</Button>
				<Button
					className="mx-auto px-8 bg-gray-800 w-full"
					// onClick={handleSubmit}
				>
					Next
				</Button>
			</div>
		</>
	);
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Race</h1>
	);
}
