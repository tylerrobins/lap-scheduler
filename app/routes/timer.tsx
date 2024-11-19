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
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useState } from 'react';

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

	return (
		<>
			<h1>Timer</h1>
			{riderDetails.map((rider, key) => (
				<h1 key={key}>{rider.name}</h1>
			))}
			<>
				<Table>
					<TableCaption>List of Riders</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-full">Rider</TableHead>
							<TableHead className="w-[25px] text-center">
								Edit
							</TableHead>
							<TableHead className="w-[25px] text-center">
								Delete
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loaderData.map((rider, key) => (
							<TableRow key={key}>
								<TableCell className="font-medium">
									{rider.name}
								</TableCell>
								<TableCell className="text-center p-0">
									<Button className="bg-transparent hover:bg-transparent">
										<PencilIcon className="size-6 text-black" />
									</Button>
								</TableCell>
								<TableCell className="text-center p-0">
									<Button className="bg-transparent hover:bg-transparent">
										<XMarkIcon className="size-6 text-black" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="flex mt-3">
					<Button className="mx-auto px-8 bg-gray-800 w-[200px]">
						Next
					</Button>
				</div>
			</>
		</>
	);
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Timer</h1>
	);
}
