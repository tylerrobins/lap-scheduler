import { riderDetailSessions } from '@/lib/sessionStorage';
import type { riderDetailType, ridersCookieType } from '@/types/session';

export const getRiders = async (
	request: Request
): Promise<ridersCookieType> => {
	const riders = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);

	return { riders: riders.get('riders') || [] };
};

export const addRider = async (request: Request) => {
	console.log('RUNNING ADD RIDER ....');
	const riders = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);
	const ridersObj: riderDetailType[] = riders.get('riders') || [];
	console.log('RDIERS OJB:', ridersObj);
	const formData = await request.formData();
	const rider = formData.get('rider');
	console.log('RIDER:', rider);
	if (typeof rider === 'string') {
		ridersObj.push({
			name: rider,
			laptime: null,
			starting_position: null,
			gap_leader: null,
			gap_next_rider: null,
		});
		riders.set('riders', ridersObj);
		const headers = new Headers();
		headers.append(
			'Set-Cookie',
			await riderDetailSessions.commitSession(riders)
		);
		return Response.json({ riders: ridersObj }, { headers });
	}
	return { riders: ridersObj };
};
