import apiClient from './apiClient';

export async function getManagerDashboard() {
    const response = await apiClient.get('/dashboard/manager');
    return response.data;
}