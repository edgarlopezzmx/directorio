import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } else if (req.method === "POST") {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({ error: "Name and email are required" });
            }
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                },
            });
            res.status(201).json(user);
        } else {
            res.status(405).json({ error: "Method Not Allowed" });
        }
    } catch (error) {
        console.error("[API ERROR]", error);
        res.status(500).json({ error: "Internal Server Error" });
    }

    
}