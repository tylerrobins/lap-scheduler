import { RidersProvider } from './riderProvider';
import { UtilProvider } from './utilProviders';

export default function AppProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<RidersProvider>
			<UtilProvider>{children}</UtilProvider>
		</RidersProvider>
	);
}
