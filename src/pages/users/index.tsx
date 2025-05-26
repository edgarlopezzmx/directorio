//pages/users/index.ts
import { useEffect, useState } from "react";
import Link from "next/link"


interface User {
    id: number;
    name: string;
    email: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users");
                if (!response.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await response.json();
                if (isMounted) {
                    setUsers(data);
                    setError(null);
                }
            } catch (error: any) {
                if (isMounted) {
                    setUsers([]);
                    setError(error.message || "Failed to fetch users");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchUsers();

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted component
        };
    }, []);

    if (loading) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-xl mb-4">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-xl mb-4">Users</h1>
            <div className="container mx-auto">
                <Link href="/users/register" className="bg-blue-500 text-white px-4 py-2 rounded"> Register User</Link>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <table className="mt-6 w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Agenda</th>
                        <th className="border px-4 py-2">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border px-4 py-2">{user.name}</td>
                            <td className="border px-4 py-2">{user.email}</td>
                            <td className="border px-4 py-2">
                                <Link href={`/users/${user.id}/contacts`} className="bg-blue-500 text-white px-2 py-1 rounded inline-block">
                                    Agenda
                                </Link>
                            </td>
                            <td className="border px-4 py-2">
                                <Link href={`/users/${user.id}`}
                                    className="bg-blue-500 text-white px-2 py-1 rounded inline-block"
                                    >Edit</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}