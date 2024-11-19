import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const riderListSchema = z.object({
	riders: z.array(
		z.string().min(1, { message: 'Rider name cannot be blank' })
	),
});

export type RiderListData = z.infer<typeof riderListSchema>;
export const riderListResolver = zodResolver(riderListSchema);
