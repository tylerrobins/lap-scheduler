import type { RouteHandle } from '@/types/route-handle';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 2,
	},
};

export default function Timer() {
	return <h1>Timer</h1>;
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Timer</h1>
	);
}
