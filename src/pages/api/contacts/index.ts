//pages/api/contacts/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
            const { name, email, phone, userId } = req.body;
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