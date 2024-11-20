import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const riderDetailsSchema = z.object({
	name: z.string().min(1, { message: 'Name needs to be atleast 1 character' }),
	laptime: z.number(),
	starting_position: z.number().nullable(),
	laps: z.number(),
	gap_leader: z.number().nullable(),
	gap_next_rider: z.number().nullable(),
	race_time: z.number(),
});

const riderListSchema = z.object({
	riders: z.array(riderDetailsSchema),
});

export type RiderListData = z.infer<typeof riderListSchema>;
export const riderListResolver = zodResolver(riderListSchema);

const riderUpdateTimes = z.object({
	riders: z.array(riderDetailsSchema),
	min_time: z.number(),
});

export type RiderUpdateTimesData = z.infer<typeof riderUpdateTimes>;
export const riderUpdateTimesResolver = zodResolver(riderUpdateTimes);
