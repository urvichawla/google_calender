import API_URL, { getAuthHeaders } from './config';
import { Schedule } from '../contexts/StoreContext/types/schedule';

export const getSchedules = async (userId: string): Promise<Schedule[]> => {
  try {
    const response = await fetch(`${API_URL}/schedules`, {
      method: 'GET',
      headers: getAuthHeaders(userId),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Failed to fetch schedules: ${response.status}`);
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
    console.error('getSchedules error:', error);
    throw error;
  }
};

export const createSchedule = async (userId: string, schedule: Partial<Schedule>): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: getAuthHeaders(userId),
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create schedule error:', errorText);
    throw new Error('Failed to create schedule');
  }

  const data = await response.json();
  
  if (data.colorOption && typeof data.colorOption === 'string' && data.colorOption !== '') {
    try {
      data.colorOption = JSON.parse(data.colorOption);
    } catch {
    }
  }
  
  return data;
};

export const createMultipleSchedules = async (userId: string, schedules: Schedule[]): Promise<Schedule[]> => {
  const response = await fetch(`${API_URL}/schedules/bulk`, {
    method: 'POST',
    headers: getAuthHeaders(userId),
    body: JSON.stringify({ schedules }),
  });

  if (!response.ok) {
    throw new Error('Failed to create multiple schedules');
  }

  return response.json();
};

export const updateSchedule = async (userId: string, id: number, schedule: Partial<Schedule>): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(userId),
    body: JSON.stringify(schedule),
  });

  if (!response.ok) {
    throw new Error('Failed to update schedule');
  }

  return response.json();
};

export const deleteSchedule = async (userId: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/schedules/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(userId),
  });

  if (!response.ok) {
    throw new Error('Failed to delete schedule');
  }
};

export const deleteMultipleSchedules = async (userId: string, ids: number[]): Promise<void> => {
  const response = await fetch(`${API_URL}/schedules/bulk/multiple`, {
    method: 'DELETE',
    headers: getAuthHeaders(userId),
    body: JSON.stringify({ ids }),
  });

  if (!response.ok) {
    throw new Error('Failed to delete multiple schedules');
  }
};

