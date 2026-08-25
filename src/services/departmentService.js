import apiClient from './apiClient';

export async function getDepartments() {
    const response = await apiClient.get('/departments');
    return response.data;
}