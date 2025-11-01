/* eslint-disable max-lines-per-function */
import { useEffect, useState } from 'react';

import { UserAction } from '../../../contexts/StoreContext/index.model';
import { Calendar, HolidayCalendarItem } from '../../../contexts/StoreContext/types/calendar';
import { Schedule } from '../../../contexts/StoreContext/types/schedule';
import { HolidayItem, RenderCboxItemsProps, RenderCboxListProps } from './index.model';

import regionListFile from '../../../data/localized-holiday-events.txt';
import { readTextFile, uniqueID } from '../../../util/reusable-funcs';
import { useStore, useStoreUpdater } from '../../../contexts/StoreContext';
import { convertExternalEventToSchedule, convertExternalEventsToCalendar, getHolidayEventsByRegion } from '../../../api/holiday';

import CheckboxItem from './CheckboxItem';

export default function HolidayCheckboxList() {
  const { calendars, savedSchedules } = useStore();
  const { dispatchCalendars, dispatchSchedules } = useStoreUpdater();
  const [regionalHolidays, setRegionalHolidays] = useState<HolidayItem[]>([]);
  const [fullViewCheckList, setFullViewCheckList] = useState(false);

  const savedHolidayCalendars: HolidayCalendarItem[] = calendars
    .filter(calendar => calendar.type === 'holiday')
    .map((calendar: Calendar) => {
      if (calendar.type === 'holiday') {
        return calendar as HolidayCalendarItem;
      }
      return {} as HolidayCalendarItem;
    });
  const savedHolidayRegions: string[]
    = savedHolidayCalendars.map(calendar => calendar.region || '');

  const convertFileOutputToArr = (result: Array<string>) => {
    return result.map(element => {
      const [holidayCalendarName, regionCode] = element.split(',');
      return {
        name: holidayCalendarName,
        region: regionCode,
        selected: savedHolidayRegions.includes(regionCode),
      }
    })
  }

  useEffect(() => {
    readTextFile(regionListFile)
      .then((output) => setRegionalHolidays(convertFileOutputToArr(output)));
  }, [])

  useEffect(() => {
    const selectedRegionalHolidays = regionalHolidays.filter(rh => rh.selected);

    if (savedHolidayCalendars.length < selectedRegionalHolidays.length) {
      const newlyAddedRegion = selectedRegionalHolidays
        .filter(rh => !savedHolidayRegions.includes(rh.region))[0].region;

      getHolidayEventsByRegion(newlyAddedRegion)

        .then((holidayCalendar: any) => {
          const calendarId = uniqueID();
          dispatchCalendars({
            type: UserAction.ADD,
            payload: {
              addedItem: convertExternalEventsToCalendar({
                calendarId,
                regionCode: newlyAddedRegion,
                holidayCalendar,
              }),
              whereTo: 'both',
            },
          })

          if (holidayCalendar && holidayCalendar.items) {
            holidayCalendar.items.forEach(event => {
              const eventWithCalendarId = { ...event, calendarId }
              dispatchSchedules({
                type: UserAction.ADD,
                payload: {
                  addedItem: convertExternalEventToSchedule(eventWithCalendarId),
                  whereTo: 'local',
                },
              })
            })
          }
        })
        .catch(error => {
          throw new Error(error);
        })
      return;
    }

    if (savedHolidayCalendars.length > selectedRegionalHolidays.length) {
      const newlyRemovedRegion = savedHolidayCalendars.find(holidayCalendar => {
        const { region } = holidayCalendar;
        const mappedRegionalHolidaysCode =
          selectedRegionalHolidays.map(rh => rh.region);
        return !mappedRegionalHolidaysCode.includes(region);
      });

      if (!newlyRemovedRegion) return;

      const calendarEventsIds = (savedSchedules as Schedule[])
        .filter((schedule: Schedule) => schedule.calendarId === newlyRemovedRegion.id)
        .map((schedule: Schedule) => ({ id: schedule.id }));

      dispatchCalendars({
        type: UserAction.REMOVE,
        payload: { id: newlyRemovedRegion.id },
      })
      dispatchSchedules({
        type: UserAction.REMOVE_MULTIPLE,
        payload: calendarEventsIds,
      })

    }
  }, [regionalHolidays])

  const toggleIsHolidaySelected = (regionCode: string) => () => {
    setRegionalHolidays(prevRegionalHolidays => {
      return prevRegionalHolidays.map(holiday => {
        if (regionCode === holiday.region) {
          return { ...holiday, selected: !holiday.selected }
        }
        return holiday;
      })
    })
  }

  const renderCboxItems = ({ filterBySelected, displayAll }: RenderCboxItemsProps) => {
    return regionalHolidays
      .filter(holiday => (!filterBySelected ? true : holiday.selected))
      .slice(0, displayAll ? regionalHolidays.length : 10)
      .map((holiday) => (
        <CheckboxItem
          key={holiday.name}
          holidayItem={holiday}
          handleCboxToggle={toggleIsHolidaySelected(holiday.region)}
        />
      ))
  }

  const renderCboxList = ({
    listDesc,
    displayAll = true,
    filterBySelected = false,
  }: RenderCboxListProps) => {
    return <ul className='checkbox-list'>
      <li>{listDesc}</li>
      {renderCboxItems({ filterBySelected, displayAll })}
    </ul>
  }

  return <div>
    {renderCboxList({
      listDesc: <i>Check the following regional holiday events that you want to be added: </i>,
      displayAll: fullViewCheckList,
    })}
    {
      !fullViewCheckList &&
      <button
        className='clear-btn--no-effects view-more-btn'
        onClick={() => setFullViewCheckList(true)}
      >
        view more...
      </button>
    }
  </div>
}