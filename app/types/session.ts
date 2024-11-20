export type RiderDetailType = {
	name: string;
	laptime: number;
	starting_position: number | null;
	laps: number;
	gap_leader: number | null;
	gap_next_rider: number | null;
	race_time: number;
};

export type RiderDetailFullType = {
	name: string;
	laptime: number;
	starting_position: number | null;
	laps: number;
	gap_leader: number | null;
	gap_next_rider: number | null;
	race_time: number;
};
