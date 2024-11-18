export type routeMatch = {
	id: string;
	path: string;
	params: unknown;
	data: unknown;
	handle: RouteHandle;
};

export type RouteHandle = {
	title?: string;
	navbarProps?: { activeIndex: number };
};