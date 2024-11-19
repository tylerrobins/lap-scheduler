import { getValidatedFormData } from 'remix-hook-form';
import {
	RiderListData,
	riderListResolver,
	RiderUpdateTimesData,
} from '@/lib/form/riders';
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

export const GetAllDetails = async (
	request: Request
): Promise<{ riders: RiderDetailType[]; race_length: number }> => {
	const session = await riderDetailSessions.getSession(
		request.headers.get('Cookie')
	);
	const riders: RiderDetailType[] = session.get('riders');
	const race_length: number = session.get('race_length');
	return { riders: riders || [], race_length: race_length || 0 };
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
	// const ridersDetails: RiderDetailType[] = [];
	// data.riders.forEach((rider) => {
	// 	ridersDetails.push(rider);
	// });
	// session.set('riders', ridersDetails);
	session.set('riders', data.riders);
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
		await getValidatedFormData<RiderUpdateTimesData>(
			request,
			riderListResolver
		);
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
	session.set('race_length', data.min_time);
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		await riderDetailSessions.commitSession(session)
	);
	return redirect(successRedirectPath, { headers });
};

function GenerateRaceDetails(
	riderDetails: RiderDetailType[],
	race_length: number
): RiderDetailType[] {
	if (riderDetails.length < 1) return riderDetails;
	let fastestTime = { time: riderDetails[0].laptime, index: 0 };
	riderDetails.forEach((rider, index) => {
		if (rider.laptime < fastestTime.time) {
			fastestTime = { time: rider.laptime, index };
		}
	});
}
