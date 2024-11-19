import { getValidatedFormData } from 'remix-hook-form';
import { RiderListData, riderListResolver } from '@/lib/form/riders';
import { riderDetailSessions } from '@/lib/sessionStorage';
import type { RiderDetailType } from '@/types/session';
import { redirect } from '@remix-run/react';

export const GetRiders = async (
	request: Request
): Promise<RiderDetailType[]> => {
	const session = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);
	const riders: RiderDetailType[] = session.get('riders');
	if (!riders) return [];
	return riders;
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
	const { data, errors, receivedValues } =
		await getValidatedFormData<RiderListData>(request, riderListResolver);
	if (errors) {
		console.log('receivedValues:', receivedValues);
		console.error('Error in validating rider list data');
		return redirect('/riders');
	}
	const ridersDetails: RiderDetailType[] = [];
	data.riders.forEach((rider) => {
		ridersDetails.push(rider);
	});
	session.set('riders', ridersDetails);
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		await riderDetailSessions.commitSession(session)
	);
	return redirect(successRedirectPath, { headers });
};

export const UpdateRiderTimes = async ({
	request,
	successRedirectPath,
}: {
	request: Request;
	successRedirectPath: string;
}) => {
	const session = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);
	const { data, errors, receivedValues } =
		await getValidatedFormData<RiderListData>(request, riderListResolver);
	if (errors) {
		console.log('receivedValues:', receivedValues);
		console.error('Error in validating rider list data');
		return redirect('/riders');
	}
	const ridersDetails: RiderDetailType[] = [];
	data.riders.forEach((rider) => {
		ridersDetails.push(rider);
	});
	session.set('riders', ridersDetails);
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		await riderDetailSessions.commitSession(session)
	);
	return redirect(successRedirectPath, { headers });
};
