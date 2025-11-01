import API_URL, { getAuthHeaders } from './config';

export interface UserData {
  email: string;
  name?: string;
  photoURL?: string;
}

export const createOrGetUser = async (userId: string, userData: UserData) => {
  const response = await fetch(`${API_URL}/auth`, {
    method: 'POST',
    headers: getAuthHeaders(userId),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create/get user');
  }

  return response.json();
};

export const getUser = async (userId: string) => {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(userId),
  });

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return response.json();
};

