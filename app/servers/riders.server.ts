import { getValidatedFormData } from 'remix-hook-form';
import { RiderListData, riderListResolver } from '@/lib/form/riders';
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
	const { data, errors } = await getValidatedFormData<RiderListData>(
		request,
		riderListResolver
	);
	if (errors) {
		console.error('Error in validating rider list data');
		return redirect('/riders');
	}
	const ridersDetails: riderDetailType[] = [];
	data.riders.forEach((rider) => {
		ridersDetails.push({
			name: rider,
			laptime: 0,
			starting_position: null,
			laps: 0,
			gap_leader: null,
			gap_next_rider: null,
		});
	});
	session.set('riders', ridersDetails);
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		await riderDetailSessions.commitSession(session)
	);
	return redirect(successRedirectPath, { headers });
};
