import { useRouter } from "next/router";
import { useState } from "react";
import { userService } from "@/services/userService";

export default function RegisterUser() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.password !== formData.confirmPassword) {
                setError("The passwords do not match");
                return;
            }

            const userData = await userService.createUser(formData);
            console.log("User registered successfully:", userData);
            const { name } = userData;
            alert(`User registered successfully: ${name}`);
            setFormData({ email: "", name: "", password: "", confirmPassword:"" }); // Reset form
            router.push("/users"); // Redirect to users page

        } catch (error:any) {
            if (error.status === 400) {
                if (Array.isArray(error.details)) {
                    setError(error.details.map((d) => d.message).join(" | "));
                } else {
                    setError(error.message || "Invalid request");
                }
            } else {
                setError("An error occurred while registering the user");
                console.error("Error registering user:", error);
            }
        }
    }

    return (
        <>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-xl mb-4">Register user</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-2">Name</label>
                        <input
                        name="name"
                        type="text"
                        placeholder="Name"
                        className="w-full border p-2"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2">Email</label>
                        <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                        <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full border p-2"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="flex justify-between">
                        <button type="button" onClick={() => router.push("/users")} className="bg-gray-500 text-white px-4 py-2">
                        Cancel  
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                        Register
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}