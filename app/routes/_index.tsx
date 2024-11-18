import { RouteHandle } from '../types/route-handle';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
	return [
		{ title: 'New Remix App' },
		{ name: 'description', content: 'Welcome to Remix!' },
	];
};

export const handle: RouteHandle = {
	title: 'Home',
	navbarProps: {
		activeIndex: 0,
	},
};
export default function Index() {
	return <h1>HOME PAGE</h1>;
}
