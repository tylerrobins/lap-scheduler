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
	if (riders.length > 0) {
		return riders;
	} else {
		return redirect('/riders');
	}
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
						<TableHead className="">Rider</TableHead>
						<TableHead className="">Starting Position</TableHead>
						<TableHead className="">Laps</TableHead>
						<TableHead className="">Gap</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loaderData.map((rider, key) => (
						<TableRow key={key}>
							<TableCell className="font-medium">{rider.name}</TableCell>
							<TableCell className="font-medium">
								{rider.starting_position}
							</TableCell>
							<TableCell className="font-medium">{rider.laps}</TableCell>
							<TableCell className="font-medium">
								{rider.gap_next_rider}
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
