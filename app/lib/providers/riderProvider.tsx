import { RiderDetailType } from '@/types/session';
import { createContext, useContext, useState } from 'react';

const RidersContext = createContext<{
	riders: RiderDetailType[];
	setRiders: (value: RiderDetailType[]) => void;
	newRider: string;
	setNewRider: (value: string) => void;
	AddRiders: () => void;
	RemoveRider: (key: number) => void;
} | null>(null);

export function RidersProvider({ children }: { children: React.ReactNode }) {
	const [riders, setRiders] = useState<RiderDetailType[]>([]);
	const [newRider, setNewRider] = useState<string>('');

	const AddRiders = () => {
		if (newRider !== '') {
			const newRiderList = newRider.split(',').map((rider) => rider.trim());
			const newRiderListObj: RiderDetailType[] = [];
			newRiderList.forEach((rider) => {
				newRiderListObj.push({
					name: rider,
					laptime: 0,
					starting_position: null,
					laps: 0,
					gap_leader: null,
					gap_next_rider: null,
				});
			});
			setRiders((prevRiders) => [...prevRiders, ...newRiderListObj]);
			setNewRider('');
		}
	};

	const RemoveRider = (key: number) => {
		setRiders((prevRiders) => prevRiders.filter((_, index) => index !== key));
	};

	return (
		<RidersContext.Provider
			value={{
				riders,
				setRiders,
				newRider,
				setNewRider,
				AddRiders,
				RemoveRider,
			}}
		>
			{children}
		</RidersContext.Provider>
	);
}

export function useRiders() {
	const context = useContext(RidersContext);
	if (!context) {
		throw new Error('useRiders must be used within a RidersProvider');
	}
	return context;
}
