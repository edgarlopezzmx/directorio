import { z } from 'zod';

export const userBaseSchema = z.object({
    name: z.string().min(1, { message: 'El nombre es requerido' }),
    email: z.string().email({ message: 'Email inválido' }),
});

export const userRegisterSchema = userBaseSchema.extend({
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const userUpdateSchema = userBaseSchema.extend({
    password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres'}).optional(),
});
