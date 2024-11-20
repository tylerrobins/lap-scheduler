import { RouteHandle } from '../types/route-handle';
import { redirect, type MetaFunction } from '@remix-run/node';

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

export const loader = async () => {
	return redirect('/race');
};

export default function Index() {
	return <h1>Home Page</h1>;
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">
			Riders
		</h1>
	);
}
