import { RouteHandle } from '../types/route-handle';

export const handle: RouteHandle = {
	title: 'Timer',
	navbarProps: {
		activeIndex: 1,
	},
};
export default function Index() {
	return <h1>TIMER PAGE</h1>;
}
