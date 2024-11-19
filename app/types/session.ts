export type riderDetailType = {
	name: string;
	laptime: number;
	starting_position: number | null;
	laps: number;
	gap_leader: string | null;
	gap_next_rider: string | null;
};

export type ridersCookieType = {
	riders: riderDetailType[];
};
