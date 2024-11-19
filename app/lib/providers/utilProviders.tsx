import { createContext, useContext, useState } from 'react';

const TimerContext = createContext<{
	globalTrigger: boolean;
	handleStartAll: () => void;
	raceLength: number;
	setRaceLength: (raceMins: number) => void;
} | null>(null);

export function UtilProvider({ children }: { children: React.ReactNode }) {
	const [globalTrigger, setGlobalTrigger] = useState(false);
	const [raceLength, setRaceLength] = useState<number>(0);

	const handleStartAll = () => {
		setGlobalTrigger(true);
		setTimeout(() => {
			setGlobalTrigger(false);
		}, 1000);
	};

	return (
		<TimerContext.Provider
			value={{ globalTrigger, handleStartAll, raceLength, setRaceLength }}
		>
			{children}
		</TimerContext.Provider>
	);
}

export function useTimer() {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error('useTimer must be used within a TimerContext');
	}
	return context;
}
