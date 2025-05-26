import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id ) {
        return res.status(400).json({ error: "Invalid or missing user ID" });
    }

    try {
        if (req.method === "GET") {
            const contact = await prisma.contact.findUnique({
                where: { id: Number(id) },
            });

            if (!contact) {
                return res.status(404).json({ error: "Contact not found" });
            }

            res.status(200).json(contact);
        } else if (req.method === "PUT") {
            const { name, email, phone } = req.body;

            if (!name || !email || !phone) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const updatedContact = await prisma.contact.update({
                where: { id: Number(id) },
                data: { name, email, phone },
            });

            res.status(200).json(updatedContact);
        } else if (req.method === "DELETE") {
            const contact = await prisma.contact.findUnique({
                where: { id: Number(id) },
            });
            if (!contact) {
                return res.status(404).json({ error: "Contact not found" });
            }
            
            await prisma.contact.delete({
                where: { id: Number(id) },
            });

            res.status(204).end();
        } else {
            res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
            return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    } catch (error) {
        console.error("[API ERROR]", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}