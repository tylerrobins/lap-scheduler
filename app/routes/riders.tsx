import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useRiders } from '@/lib/providers/riderProvider';
import { AddRiders, GetRiders } from '@/servers/riders.server';
import type { RouteHandle } from '@/types/route-handle';
import { riderDetailType } from '@/types/session';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useSubmit } from '@remix-run/react';
import { useEffect } from 'react';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 1,
	},
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await GetRiders(request);
};

export const action = async ({ request }: ActionFunctionArgs) => {
	return AddRiders({ request, successRedirectPath: '/timer' });
};

export default function Riders() {
	const loaderData = useLoaderData<riderDetailType[]>();
	const submit = useSubmit();
	const { riders, RemoveRider, setRiders } = useRiders();

	useEffect(() => {
		if (loaderData) {
			const riderList: string[] = [];
			loaderData.forEach((rider) => riderList.push(rider.name));
			setRiders(riderList);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const Next = () => {
		const formData = new FormData();
		riders.forEach((rider, index) => {
			formData.append(`riders[${index}]`, rider);
		});
		submit(formData, {
			method: 'post',
		});
	};

	return (
		<>
			{riders.length === 0 ? (
				<div className="text-center">
					<h1>Add riders to continue</h1>
					<p className="text-xs">
						Please add at least 2 riders to continue...
					</p>
				</div>
			) : (
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
							{riders.map((rider, key) => (
								<TableRow key={key}>
									<TableCell className="font-medium">
										{rider}
									</TableCell>
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
					<div className="flex mt-3">
						<Button
							className="mx-auto px-8 bg-gray-800 w-[200px]"
							onClick={Next}
						>
							Next
						</Button>
					</div>
				</>
			)}
		</>
	);
}

function TitleComponent() {
	const { newRider, setNewRider, AddRiders } = useRiders();
	return (
		<div className="flex flex-col sm:flex-row items-center">
			<h1 className="text-3xl text-center sm:text-left font-bold tracking-tight text-gray-900">
				Riders
			</h1>
			<div className="sm:ml-auto">
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
				<p className="text-xs text-gray-500 pt-2 px-1 sm:pt-0.5">
					To add mutliple riders - seperate their names with a comma
					&quot;,&quot;
				</p>
			</div>
		</div>
	);
}
