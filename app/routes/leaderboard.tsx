import { RouteHandle } from '../types/route-handle';

export const handle: RouteHandle = {
	title: 'Leaderboard',
	navbarProps: {
		activeIndex: 2,
	},
};
export default function Index() {
	return <h1>LEADERBOARD PAGE</h1>;
}
