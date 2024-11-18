export type riderDetailType = {
	name: string;
	laptime: number | null;
	starting_position: number | null;
	gap_leader: string | null;
	gap_next_rider: string | null;
};

export type ridersCookieType = {
	riders: riderDetailType[];
};
