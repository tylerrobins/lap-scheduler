import { riderDetailSessions } from '@/lib/sessionStorage';
import type { riderDetailType, ridersCookieType } from '@/types/session';
import { redirect } from '@remix-run/react';

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
			laptime: 0,
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

export const AddRiders = async ({
	request,
	successRedirectPath,
}: {
	request: Request;
	successRedirectPath: string;
}) => {
	const session = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);
	const ridersDetails: riderDetailType[] = session.get('riders') || [];
	const formData = await request.formData();
	const ridersList = formData.get('riders');
	if (!ridersList) return redirect('/riders');
	const newRiderList = ridersList.split(',').map((rider) => rider.trim());
	const riders: riderDetailType[] = [];
	console.log('RIDERS:', ridersList);
	console.log('RIDERS TYPE:', typeof ridersList);
	// session.set('riders', ridersDetails);
	// const headers = new Headers();
	// headers.append(
	// 	'Set-Cookie',
	// 	await riderDetailSessions.commitSession(riders)
	// );
	return null;
};
