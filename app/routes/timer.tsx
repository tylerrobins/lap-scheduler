import { GetRiders } from '@/servers/riders.server';
import type { RouteHandle } from '@/types/route-handle';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';

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
	return <h1>Timer</h1>;
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Timer</h1>
	);
}
