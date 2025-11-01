import './styles.scss';

import MiniCalendar from '../MiniCalendar';
import CalendarList from '../CalendarList';
import withScheduleDialogToggle from '../Schedules/ScheduleHOC';
import { DefaultScheduleButton } from '../Schedules/Buttons';
import { useStore } from '../../contexts/StoreContext';
import { useAppConfig } from '../../contexts/AppConfigContext';

const CreateSchedule
	= withScheduleDialogToggle(DefaultScheduleButton);

export default function Sidebar(): JSX.Element {
	const { calendars } = useStore();
	const { visibilities } = useAppConfig();

	const personalCalendars = calendars.filter(c => c.type === 'default');
	const holidayCalendars = calendars.filter(c => c.type === 'holiday');

	const sidebarClasses = visibilities.sidebar ? 'sidebar sidebar--visible' : 'sidebar';

	return (
		<div className={sidebarClasses}>
			<div>
				<CreateSchedule />
			</div>
			<MiniCalendar rootElModifier={'by-content'} />
			<CalendarList
				calendars={personalCalendars} 
				type='default'
			/>
			<CalendarList
				title='Other Calendars'
				calendars={holidayCalendars}
				type='holiday'
				limit={50}
			/>
		</div>
	)
}