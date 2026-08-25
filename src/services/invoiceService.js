import apiClient from './apiClient';

export async function getInvoices() {
    const response = await apiClient.get('/invoices');
    return response.data;
}

export async function createInvoice(invoiceData) {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
}