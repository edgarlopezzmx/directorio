import axios from 'axios';
import { Contact } from '@/types';

export const contactService = {
    async getContactsByUserId(id: number): Promise<Contact[] | null> {
        try {
            const response = await axios.get<Contact[]>(`/api/contacts?userId=${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching contact by ID:", error);
            return null;
        }
    },

    async createContact(contactData: Omit<Contact, 'id'>): Promise<Contact | null> {
        try {
            const response = await axios.post<Contact>('/api/contacts', contactData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.error,
                    details: error.response.data.details,
                };
            } else {
                throw {
                    status: 500,
                    message: "Error creating contact",
                };
            }
        }
    },

    async updateContact(contactData: Partial<Contact>): Promise<Contact | null> {
        try {
            const response = await axios.put<Contact>(`/api/contacts/${contactData.id}`, contactData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.error,
                    details: error.response.data.details,
                };
            } else {
                throw {
                    status: 500,
                    message: "Unexpected error",
                };
            }
        }
    },

    async deleteContact(id: number): Promise<void> {
        try {
            await axios.delete(`/api/contacts/${id}`);
        } catch (error) {
            console.error("Error deleting contact:", error);
        }
    },
};