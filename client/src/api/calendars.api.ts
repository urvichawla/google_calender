import API_URL, { getAuthHeaders } from './config';
import { Calendar } from '../contexts/StoreContext/types/calendar';

export const getCalendars = async (userId: string): Promise<Calendar[]> => {
  try {
    const response = await fetch(`${API_URL}/calendars`, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch calendars: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Unexpected response type:', text);
      throw new Error('Server returned non-JSON response');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('getCalendars error:', error);
    throw error;
  }
};

export const createCalendar = async (userId: string, calendar: Partial<Calendar>): Promise<Calendar> => {
  const response = await fetch(`${API_URL}/calendars`, {
    method: 'POST',
    headers: getAuthHeaders(userId),
    body: JSON.stringify(calendar),
  });

  if (!response.ok) {
    throw new Error('Failed to create calendar');
  }

  return response.json();
};

export const createMultipleCalendars = async (userId: string, calendars: Calendar[]): Promise<Calendar[]> => {
  const response = await fetch(`${API_URL}/calendars/bulk`, {
    method: 'POST',
    headers: getAuthHeaders(userId),
    body: JSON.stringify({ calendars }),
  });

  if (!response.ok) {
    throw new Error('Failed to create multiple calendars');
  }

  return response.json();
};

export const updateCalendar = async (userId: string, id: number, calendar: Partial<Calendar>): Promise<Calendar> => {
  const response = await fetch(`${API_URL}/calendars/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(userId),
    body: JSON.stringify(calendar),
  });

  if (!response.ok) {
    throw new Error('Failed to update calendar');
  }

  return response.json();
};

export const deleteCalendar = async (userId: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/calendars/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(userId),
  });

  if (!response.ok) {
    throw new Error('Failed to delete calendar');
  }
};

export const deleteMultipleCalendars = async (userId: string, ids: number[]): Promise<void> => {
  const response = await fetch(`${API_URL}/calendars/bulk/multiple`, {
    method: 'DELETE',
    headers: getAuthHeaders(userId),
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete multiple calendars');
  }
};

