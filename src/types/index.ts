
export interface Contact {
    id: number;
    userId: number;
    name: string;
    email: string;
    phone: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string; 
    confirmPassword?: string; 
    contacts?: Contact[];
}