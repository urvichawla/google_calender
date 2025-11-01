import { CalendarType } from '../contexts/StoreContext/types/calendar';
import { ScheduleType } from '../contexts/StoreContext/types/schedule';
import { DateTimeInputs } from '../contexts/CalendarConfigContext/index.model';

import { uniqueID } from '../util/reusable-funcs';
import { getRandomColorOption } from '../util/color-options';

import { ExternalHolidayEvent } from '../components/MainContent/index.model';

interface ConvertExternalEventsToCalendarProps {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	holidayCalendar: any;
	calendarId: number;
	regionCode: string;
}

export async function getHolidayEventsByRegion(region: string) {
	const baseUrl = process.env.REACT_APP_CALENDAR_APP_URL || 'http://localhost:5001/api';
	const holidayApiUrl = `${baseUrl.replace(/\/$/, '')}/holiday/${region}`;
	if (!baseUrl) {
		throw new Error('REACT_APP_CALENDAR_APP_URL env var not set.');
	}

	try {
		const response = await fetch(holidayApiUrl);
		
		if (!response.ok) {
			const errorText = await response.text();
			console.error('Holiday API Error:', errorText);
			throw new Error(`Failed to fetch holiday events: ${response.status}`);
		}

		const contentType = response.headers.get('content-type');
		if (!contentType || !contentType.includes('application/json')) {
			const text = await response.text();
			console.error('Unexpected holiday API response type:', text);
			throw new Error('Server returned non-JSON response');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching holiday events:', error);
		throw error;
	}
}

export function convertExternalEventsToCalendar(props: ConvertExternalEventsToCalendarProps) {
	const { holidayCalendar, regionCode, calendarId } = props;
	const {
		summary,
		timeZone,
		description,
	} = holidayCalendar;

	return {
		id: calendarId,
		name: summary || '',
		colorOption: getRandomColorOption(),
		selected: true,
		removable: true,
		type: 'holiday' as CalendarType,
		timeZone: timeZone || '',
		description: description || '',
		region: regionCode,
	}
}

// Extract values from holiday event properties and
// set it as values for holiday schedule event
export function convertExternalEventToSchedule(
	externalEvent: ExternalHolidayEvent,
) {
	let date, locationName: string = '';

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const event = externalEvent as any;
	if (event.organizer && event.organizer.displayName) {
		const calendarName = event.organizer.displayName;
		const splitResult = calendarName.split(' in ');
		if (splitResult.length > 1) {
			locationName = splitResult[1].trim();
		}
	}

	if (event.start && event.start.date) {
		const [year, month, day] = event.start.date.split('-');
		date = `${year}${month}${day}`;
	}

	return {
		id: uniqueID(),
		title: event.summary || '',
		description: event.description || '',
		calendarId: externalEvent.calendarId,
		calendarType: 'holiday' as CalendarType,
		dateTime: {
			allDay: false,
			once: true,
			date,
			time: { start: -1, end: -1 },
		} as DateTimeInputs,
		type: 'event' as ScheduleType,
		isExternal: true,
		location: locationName,
		colorOption: getRandomColorOption(),
	}
}