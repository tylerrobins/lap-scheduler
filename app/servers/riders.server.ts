import { getValidatedFormData } from 'remix-hook-form';
import {
	RiderListData,
	riderListResolver,
	RiderUpdateTimesData,
	riderUpdateTimesResolver,
} from '@/lib/form/riders';
import { riderDetailSessions } from '@/lib/sessionStorage';
import type { RiderDetailType } from '@/types/session';
import { redirect } from '@remix-run/react';

const SECOND = 1000;
const MINUTE = SECOND * 60;
// const HOUR = MINUTE * 60;

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
			riderUpdateTimesResolver
		);

	if (errors) {
		console.log('receivedValues:', receivedValues);
		console.error('Error in validating rider list data');
		return redirect('/riders');
	}

	const newRiderDetails = await GenerateRaceDetails(
		data.riders,
		data.min_time
	);
	session.set('riders', newRiderDetails);
	session.set('race_length', data.min_time);
	const headers = new Headers();
	headers.append(
		'Set-Cookie',
		await riderDetailSessions.commitSession(session)
	);
	return redirect(successRedirectPath, { headers });
};

const GenerateRaceDetails = async (
	riderDetails: RiderDetailType[],
	race_length: number
) => {
	if (riderDetails.length < 1) return riderDetails;
	let newRiderDetails = [...riderDetails];
	const raceLength = race_length * MINUTE;
	// let fastestTime = { time: newRiderDetails[0].laptime, index: 0 };
	// newRiderDetails.forEach((rider, index) => {
	// 	if (rider.laptime < fastestTime.time) {
	// 		fastestTime = { time: rider.laptime, index };
	// 	}
	// });
	newRiderDetails.forEach((rider) => {
		rider.laps = Math.ceil(raceLength / rider.laptime);
		rider.race_time = rider.laptime * rider.laps;
	});
	newRiderDetails = InsertSort({
		arrayObj: newRiderDetails,
		order: 'desc',
	});
	newRiderDetails.forEach((rider, index) => {
		if (index === 0) {
			rider.gap_leader = 0;
			rider.gap_next_rider = 0;
		} else {
			rider.gap_next_rider =
				newRiderDetails[index - 1].race_time - rider.race_time;
			rider.gap_leader = newRiderDetails[0].race_time - rider.race_time;
		}
	});
	return newRiderDetails;
};

function InsertSort({
	arrayObj,
	order = 'asc',
}: {
	order?: 'asc' | 'desc';

	arrayObj: RiderDetailType[];
}): RiderDetailType[] {
	const sorted = [...arrayObj];
	for (let i = 1; i < sorted.length; i++) {
		const currentValue = sorted[i];
		let j;
		if (order === 'asc') {
			for (
				j = i - 1;
				j >= 0 && sorted[j].race_time > currentValue.race_time;
				j--
			) {
				sorted[j + 1] = sorted[j];
			}
			sorted[j + 1] = currentValue;
		}
		if (order === 'desc') {
			for (
				j = i - 1;
				j >= 0 && sorted[j].race_time < currentValue.race_time;
				j--
			) {
				sorted[j + 1] = sorted[j];
			}
			sorted[j + 1] = currentValue;
		}
	}
	return sorted.map((obj, index) => ({
		...obj,
		starting_position: index + 1,
	}));
}
