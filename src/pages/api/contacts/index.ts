//pages/api/contacts/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { contactBaseSchema } from "@/validations/contact";

const prisma = new PrismaClient();

/**
 * @openapi
 * /api/contacts:
 *   get:
 *     tags:
 *       - Contacts
 *     summary: Obtiene todos los contactos de un usuario
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario para obtener sus contactos
 *     responses:
 *       200:
 *         description: Lista de contactos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Error de solicitud, falta userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Contacts
 *     summary: Crea un nuevo contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               userId:
 *                 type: integer
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - userId
 *           example:
 *             name: "Juan Perez"
 *             email: "juan@email.com"
 *             phone: "123456789"
 *             userId: 1
 *     responses:
 *       201:
 *         description: Contacto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Error de solicitud, falta algún campo requerido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Error'
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === "GET") {
            const { userId } = req.query;
            
            if (!userId) {
                return res.status(400).json({error: 'Missing or invalid userId'});
            }

            const contacts = await prisma.contact.findMany({
                where:{
                    userId: Number(userId),
                },
            });

            res.status(200).json(contacts);
        } else if (req.method === "POST") {
            const parsed = contactBaseSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: parsed.error.format() });
            }
            
            const { name, email, phone, userId } = parsed.data;

            if (!userId || !name || !email || !phone) {
                return res.status(400).json({ error: "All fields are required" });
            }
            const contact = await prisma.contact.create({
                data: { name, phone, email, userId },
            });
            res.status(201).json(contact);
        } else {
            res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("[API ERROR]", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}