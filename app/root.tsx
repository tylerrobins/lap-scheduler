import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';
import Navbar from './components/elements/navbar';
import { RouteHandle } from './types/route-handle';
import AppProvider from './lib/providers/provider';

export const links: LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

function useRouteHandle(): RouteHandle {
	const [, route] = useMatches();
	return (route?.handle || {}) as RouteHandle;
}

export function Layout({ children }: { children: React.ReactNode }) {
	const { title = 'Dashboard', navbarProps = { activeIndex: 0 } } =
		useRouteHandle();

	return (
		<html
			lang="en"
			className="h-full bg-gray-100"
		>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body className="h-full">
				<AppProvider>
					<div className="min-h-full">
						<Navbar {...navbarProps} />
						<header className="bg-white shadow">
							<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
								{title}
							</div>
						</header>
						<main>
							<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
								{children}
							</div>
						</main>
					</div>
				</AppProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
