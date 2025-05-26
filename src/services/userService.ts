import axios from "axios";
import { User } from "@/types";

export const userService = {
    async getUserById(id: number): Promise<User | null> {
        try {
            const response = await axios.get<User>(`/api/users/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            return null;
        }
    },

    async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
        try {
            const response = await axios.post<User>('/api/users', userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Lanza el error para que lo maneje el componente
                throw {
                    status: error.response.status,
                    message: error.response.data.error,
                    details: error.response.data.details,
                };
            } else {
                // Error genérico
                throw {
                    status: 500,
                    message: "Error creating user",
                };
            }
        }
    },
    async updateUser(id: number, userData: Partial<User>): Promise<User | null> {
        try {
            const response = await axios.put<User>(`/api/users/${id}`, userData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                // Lanza el error para que lo maneje el componente
                throw {
                    status: error.response.status,
                    message: error.response.data.error,
                    details: error.response.data.details,
                };
            } else {
                // Error genérico
                throw {
                    status: 500,
                    message: "Unexpected error",
                };
            }
        }
    },
    async deleteUser(id: number): Promise<void> {
        try {
            await axios.delete(`/api/users/${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    },
    async getAllUsers(): Promise<User[]> {
        try {
            const response = await axios.get<User[]>('/api/users');
            return response.data;
        } catch (error) {
            console.error("Error fetching all users:", error);
            return [];
        }
    },
};