import axios from 'axios';
import { Item, Match, Claim, DashboardStats, User } from './types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItems = async (itemType?: string, category?: string, search?: string): Promise<Item[]> => {
  const params: any = {};
  if (itemType) params.item_type = itemType;
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  const response = await api.get('/items', { params });
  return response.data;
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const createItem = async (itemData: Omit<Item, 'id' | 'date_event' | 'status'>): Promise<Item> => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const getMatches = async (): Promise<Match[]> => {
  const response = await api.get('/matches');
  return response.data;
};

export const recalculateMatches = async (): Promise<void> => {
  await api.post('/matches/recalculate');
};

export const getClaims = async (): Promise<Claim[]> => {
  const response = await api.get('/claims');
  return response.data;
};

export const createClaim = async (claimData: { item_id: number; proof_description: string; verification_answer?: string }): Promise<Claim> => {
  const response = await api.post('/claims', claimData);
  return response.data;
};

export const verifyClaim = async (claimId: number, approve: boolean): Promise<void> => {
  await api.post(`/claims/${claimId}/verify`, null, { params: { approve } });
};

export const getAdminStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};
