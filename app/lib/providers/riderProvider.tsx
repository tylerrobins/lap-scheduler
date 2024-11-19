import { createContext, useContext, useState } from 'react';

const RidersContext = createContext<{
	riders: string[];
	newRider: string;
	setNewRider: (value: string) => void;
	AddRiders: () => void;
	RemoveRider: (key: number) => void;
} | null>(null);

export function RidersProvider({ children }: { children: React.ReactNode }) {
	const [riders, setRiders] = useState<string[]>([]);
	const [newRider, setNewRider] = useState<string>('');
	const AddRiders = () => {
		if (newRider !== '') {
			const newRiderList = newRider.split(',').map((rider) => rider.trim());
			setRiders((prevRiders) => [...prevRiders, ...newRiderList]);
			setNewRider('');
		}
	};

	const RemoveRider = (key: number) => {
		setRiders((prevRiders) => prevRiders.filter((_, index) => index !== key));
	};

	return (
		<RidersContext.Provider
			value={{ riders, newRider, setNewRider, AddRiders, RemoveRider }}
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
