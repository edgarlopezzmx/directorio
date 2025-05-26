//pages/api/users/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { userRegisterSchema } from "@/validations/user";

const prisma = new PrismaClient();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Users
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *           example:
 *             name: "Juan"
 *             email: "juan@email.com"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error al crear el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } else if (req.method === "POST") {
            const parsed = userRegisterSchema.safeParse(req.body);            
            if (!parsed.success) {
                return res.status(400).json({ error: "Datos inválidos", details: parsed.error.errors });
            }

            const { name, email, password } = parsed.data;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                    },
                });
                res.status(201).json({id: user.id, name: user.name, email: user.email });
            }catch (error) {
                console.error("[API ERROR]", error);
                return res.status(500).json({ error: "Error al crear el usuario" });
            }
        } else {
            res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("[API ERROR]", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

    
}