import { UserAction } from '../index.model';
import { Calendar, CalendarListActions } from '../types/calendar';
import { Schedule, ScheduleActions } from '../types/schedule';

import { ExecuteActionProps } from './model';
import * as LocalStorageHelper from '../../../util/local-storage';
import { getLocalStorageNamespace } from '..';

import * as CalendarsAPI from '../../../api/calendars.api';
import * as SchedulesAPI from '../../../api/schedules.api';

const {
	appendItemToArray,
	appendArrayItemToArray,
	editItemInArray,
	removeItemFromArrayById,
	removeItemsFromArrayByIds,
	remove,
	get,
} = LocalStorageHelper;


export default function executeAction<
	State extends Schedule | Calendar,
	Action extends CalendarListActions | ScheduleActions
>(props: ExecuteActionProps<State, Action>):
	State[] | [] {
	const {
		state,
		action,
		propKey,
	} = props;
	const namespace = getLocalStorageNamespace();
	const authenticatedUserId: string | undefined = get(`${namespace}_authenticatedUserId`);

	const isCalendar = propKey.includes('calendar');
	const apiCall = isCalendar 
		? { create: CalendarsAPI.createCalendar, createMultiple: CalendarsAPI.createMultipleCalendars }
		: { create: SchedulesAPI.createSchedule, createMultiple: SchedulesAPI.createMultipleSchedules };

	switch (action.type) {
		case UserAction.ADD:
			const { addedItem } = action.payload;
			action.payload.whereTo = action.payload.whereTo ?? 'both';
			const addedObject = [...state, addedItem as State];

			if (action.payload.whereTo === 'cloud' || action.payload.whereTo === 'both') {
				if (authenticatedUserId) {
			
					apiCall.create(authenticatedUserId, addedItem as any)
						
						.then((response: any) => {
							if (response) {
								console.log('Item created successfully in database');
							}
						})
						.catch((error: unknown) => {
							console.error('Error creating item:', error);
						});
				} else {
					appendItemToArray<State>(
						propKey,
						addedItem as State,
					);
				}
			}

			return action.payload.whereTo === 'local' || action.payload.whereTo === 'both'
				? addedObject : state;
		case UserAction.ADD_MULTIPLE:
			const { addedItems } = action.payload;
			action.payload.whereTo = action.payload.whereTo ?? 'both';
			const addedArr = [...state, ...addedItems] as State[];

			if (action.payload.whereTo === 'cloud' || action.payload.whereTo === 'both') {
				if (authenticatedUserId) {
			
					apiCall.createMultiple(authenticatedUserId, addedItems as any[])
						.catch(error => console.error('Error creating multiple items:', error));
				} else {
					appendArrayItemToArray<State>(
						propKey,
						addedItems as Array<State>,
					);
				}
			}
			return action.payload.whereTo === 'local' || action.payload.whereTo === 'both'
				? addedArr : state;
		case UserAction.EDIT:
			const editedArr = [...state.map((object: State) => {
				if (object.id === action.payload.id) {
					return Object.assign(action.payload);
				}
				return object;
			})];
			if (authenticatedUserId && action.payload.id !== undefined) {
				const updateFn = isCalendar 
					? CalendarsAPI.updateCalendar 
					: SchedulesAPI.updateSchedule;
			
				updateFn(authenticatedUserId, action.payload.id, action.payload as any)
					.catch(error => console.error('Error updating item:', error));
			}
			editItemInArray<State>(propKey, action.payload as State);

			return editedArr;
		case UserAction.REMOVE:
			const reducedArr = state.filter((obj: State) => {
				return obj.id !== action.payload.id;
			});
			const itemToBeRemoved = state.find(obj => action.payload.id === obj.id);
			if (!itemToBeRemoved) return reducedArr;
			if (reducedArr.length > 0) {
				if (authenticatedUserId) {
					const deleteFn = isCalendar 
						? CalendarsAPI.deleteCalendar 
						: SchedulesAPI.deleteSchedule;
					deleteFn(authenticatedUserId, action.payload.id)
						.catch(error => console.error('Error deleting item:', error));
				} else {
					removeItemFromArrayById<State>(propKey, itemToBeRemoved);
				}
			} else {
				if (!authenticatedUserId) {
					remove(propKey);
				}
			}

			return reducedArr;
		case UserAction.REMOVE_MULTIPLE:
			const objectIdsToRemove = action.payload.map(ap => ap.id);
			const objectsToKeep = state.filter((obj: State) => {
				return !objectIdsToRemove.includes(obj.id);
			});

			if (authenticatedUserId) {
				const deleteMultipleFn = isCalendar 
					? CalendarsAPI.deleteMultipleCalendars 
					: SchedulesAPI.deleteMultipleSchedules;
				deleteMultipleFn(authenticatedUserId, objectIdsToRemove)
					.catch(error => console.error('Error deleting multiple items:', error));
			} else {
				removeItemsFromArrayByIds<State>(propKey, objectIdsToRemove);
			}

			return objectsToKeep;
		case UserAction.CLEAR:
			return [];
		case UserAction.REPLACE_ALL:
			return action.payload as State[];
		default:
			throw new Error('The user made an unknown action');
	}
}