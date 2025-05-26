//pages/users/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types/index"; // Adjust the import path as necessary

export default function UserDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [userPrev, setUserPrev] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${id}`);
                if (!res.ok) throw new Error("User not found");
                const data = await res.json();
                setUser(data);
                setUserPrev(data);//backup
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const {name, value } = e.target;
        
        setUser((prevData) => {
            if(!prevData) return { [name]: value};
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(user?.password !== userPrev?.password) {
                if(user?.password !== user?.confirmPassword) {
                    setError("The passwords do not match");
                    return;
                }
            } else {
                delete user?.password;
                delete user?.confirmPassword;
            }
            const response = await axios.put(`/api/users/${user?.id}`, user);
            if (response.status === 200) {
                alert("User updated successfully");
                setUserPrev(user); // Update backup
                router.push("/users");
            }
        } catch(error) {
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                const details = error.response.data.details;
                if (Array.isArray(details)) {
                    setError(details.map((d) => d.message).join(" | "));
                } else {
                    setError(error.response.data.error || "Invalid data");
                }
            } else {
                setError("An error occurred while updating the user");
                console.error("Error updating user:", error);
            }
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!user || !user.id) return;
        
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await axios.delete(`/api/users/${user.id}`);
            if (response.status === 200) {
                alert("User deleted successfully");
                router.push("/users");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>No user found</p>;

    return (
        <>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-xl mb-4">User</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="id" className="block mb-2">ID</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            className="w-full border p-2"
                            value={user.id}
                            readOnly
                        />
                    </div>
                    <div >
                        <label htmlFor="name" className="block mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full border p-2"
                            value={user.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div >
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full border p-2"
                            value={user.email}
                            onChange={handleChange}

                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2"
                        value={user.password || ""}
                        onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                        <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border p-2"
                        value={user.confirmPassword || ""}
                        onChange={handleChange}
                        />
                    </div>
                    {error && <p className="text-red-700">{error}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => router.push("/users")} className="bg-gray-500 text-white px-4 py-2">
                        Cancel  
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                        Update User
                        </button>
                        <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2">
                        Delete User
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}