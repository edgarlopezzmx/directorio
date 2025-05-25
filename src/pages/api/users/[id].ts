import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { userUpdateSchema } from "@/validations/user";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const user = await prisma.user.findUnique({
                where: { id: Number(id) },
            });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error("[API ERROR]", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "DELETE") {
        try {
            const user = await prisma.user.delete({
                where: { id: Number(id) },
            });
            res.status(200).json(user);
        } catch (error) {
            console.error("[API ERROR]", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else if (req.method === "PUT") {
        try {
            const parsed = userUpdateSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid data", details: parsed.error.errors });
            }
            const { name, email, password } = parsed.data;

            const userExists = await prisma.user.findUnique({
                where: { id: Number(id) },
            });
            if (!userExists) {
                return res.status(404).json({ error: "User not found" });
            }

            let updateData: any = {};
            if(name && name !== userExists.name) {
                updateData.name = name;
            }

            if(email && email !== userExists.email) {
                // Check if the email already exists
                const emailExists = await prisma.user.findUnique({
                    where: { email : email },
                });

                if (emailExists && emailExists.id !== Number(id)) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                updateData.email = email;
            }

            // If the password is not the same, we need to hash it
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                if (userExists.password !== hashedPassword) {
                    updateData.password = hashedPassword;
                }
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: "No data to update" });
            }
            
            const user = await prisma.user.update({
                where: { id: Number(id)},
                data: updateData,
            });
            res.json(user);
        } catch (error) {
            res.status(500).json({error: 'Error  updating user'});
        }
    }
    else {
        res.setHeader("Allow", ["GET", "DELETE", "PUT"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}