import { useState } from "react";
import axios from "axios";

export default function RegisterUser() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
    });

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
            // console.log("Form data:", formData);
            // return;
            const response = await axios.post("/api/users", formData);
            if (response.status === 201) {
                alert("User registered successfully!");
                setFormData({ email: "", name: "", password: "" }); // Reset form
            }
            const data = await response.data.json();
            alert(`User registered successfully: ${data.name}`);
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }

    return (
        <>
            <div className="p-6 max-w-md mx-auto">
                <h1 className="text-xl mb-4">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                    name="name"
                    type="text"
                    placeholder="Name"
                    className="w-full border p-2"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    />
                    <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                    Register
                    </button>
                    {/* {message && <p>{message}</p>} */}
                </form>
            </div>
        </>
    );
}