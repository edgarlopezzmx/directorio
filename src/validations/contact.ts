import { z } from 'zod';

export const contactBaseSchema = z.object({
    name: z.string().min(1, { message: 'El nombre es requerido' }),
    email: z.string().email({ message: 'Email inválido' }),
    phone: z.string().min(7),
    userId: z.number(),
});
