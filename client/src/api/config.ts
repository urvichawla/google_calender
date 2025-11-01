const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const getAuthHeaders = (userId: string) => ({
  'Content-Type': 'application/json',
  'x-user-id': userId,
});

export default API_URL;

