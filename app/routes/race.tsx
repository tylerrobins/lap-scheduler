import type { RouteHandle } from '@/types/route-handle';

export const handle: RouteHandle = {
	title: <TitleComponent />,
	navbarProps: {
		activeIndex: 3,
	},
};

export default function Race() {
	return <h1>Race</h1>;
}

function TitleComponent() {
	return (
		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Race</h1>
	);
}
