import apiClient from './apiClient';

export async function getDepartments() {
    const response = await apiClient.get('/departments');
    return response.data;
}

/*
export async function updateDepartmentBudget(id, budget) {
    const response = await apiClient.put(`/departments/${id}/budget`, { budget });
    return response.data;
}*/
