//pages/users/[id]/contacts.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { User, Contact } from "@/types";
import { contactService } from "@/services/contactService";
import { userService } from "@/services/userService";

export default function UserContacts() {
    const router = useRouter();
    const { id } = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newContact, setNewContact] = useState<Contact | null>({name: "", phone: "", email: "", id: 0, userId: Number(id) }); // Initial state for new contact
    // State to hold contacts});
    const [contacts, setContacts] = useState<Contact[] | null>(null);
    const [editingContact, setEditingContact] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (!id) return;
        const fetchUser = async () => {
            try {
                const data = await userService.getUserById(Number(id));
                if (isMounted) {
                    setUser(data);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    setUser(null);
                    setError(err.message || "Failed to fetch user contacts");
                }
                console.error(err.message);
            }
        };

        const fetchContacts = async() => {
            try {
                const data = await contactService.getContactsByUserId(Number(id));
                if(isMounted){
                    setContacts(data);
                }
            } catch(error) {
                if (isMounted) {
                    setContacts(null);
                }
            }
        };

        const fetchAll = async () => {
            await fetchUser();
            await fetchContacts();
            if(isMounted) {
                setLoading(false);
            }
        };

        fetchAll();

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted component
        };
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewContact((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddContact = async () => {
        if (!newContact) return;
        try {
            const userData = await contactService.createContact({
                ...newContact,
                userId: Number(user?.id) 
            });
            alert("Contact added successfully");
            setNewContact(null); // Reset contact input
            setContacts((prev)=>prev ? [...prev, userData] : [userData]);
            setError(null);
        } catch (error: any) {
            if (error.status === 400) {
                if (Array.isArray(error.details)) {
                    setError(error.details.map((d) => d.message).join(" | "));
                } else {
                    setError(error.message || "Invalid request");
                }
            } else {
                setError(error.message || "Failed to add contact");
                console.error("Error adding contact:", error);
            }
        }
    }

    const handleUpdateContact = async () => {
        if (!newContact || !newContact.id) return;
        try {
            const updatedUser = await contactService.updateContact(newContact);
            alert("Contact updated successfully");
            setEditingContact(false);
            setNewContact({ name: "", phone: "", email: "", id: 0, userId: Number(id) }); // Reset to initial state
            setContacts((prev) => prev ? prev.map(contact => contact.id === newContact.id ? updatedUser: contact) : null);

        } catch (error: any) {
            if (error.status === 400) {
                if (Array.isArray(error.details)) {
                    setError(error.details.map((d) => d.message).join(" | "));
                } else {
                    setError(error.message || "Invalid request");
                }
            } else {
                setError("An error occurred while updating contact");
                console.error("Error updating contact:", error);
            }
        }
    };

    const handleDeleteContact = async (contactId: number) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        try {
            await contactService.deleteContact(contactId);
            alert("Contact deleted successfully");
            setContacts((prev) => prev ? prev.filter(contact => contact.id !== contactId) : null);
        } catch (error: any) {
            setError(error.message || "Failed to delete contact");
            console.error("Error deleting contact:", error);
        }
    };

    const handleEditClick = (contact: Contact) => {
        setEditingContact(true);
        setNewContact(contact); // Populate the form with the contact data
    };

    const handleCancelEdit = () => {
        setEditingContact(false);
        setNewContact({ name: "", phone: "", email: "", id: 0, userId: Number(id) }); // Reset to initial state
    };

    if (loading) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-xl mb-4">Loading...</h1>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-xl mb-4">Contacts of <b>{user?.name}</b></h1>
            <div className="mb-6 space-y-2">
                <h2 className="text-lg">{editingContact ? 'Edit ': 'Add new'} contact</h2>
                <div>
                    <label htmlFor="name" className="block mb-2">Name</label>
                    <input
                    name="name"
                    placeholder="Name"
                    value={newContact?.name || ""}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block mb-2">Phone</label>
                    <input
                    name="phone"
                    placeholder="Phone"
                    value={newContact?.phone || ""}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input
                    name="email"
                    placeholder="Email"
                    value={newContact?.email || ""}
                    onChange={handleInputChange}
                    className="border p-2 w-full"
                    />
                </div>
                <div className="flex space-x-2 mt-4">
                    {!editingContact &&
                        <button type="button" onClick={() => router.push("/users")} className="bg-gray-500 text-white px-4 py-2 mt-2">
                            Back  
                        </button>
                    }
                    {editingContact &&
                        <button
                            className="bg-gray-500 text-white px-4 py-2 mt-2"
                            onClick={handleCancelEdit}
                        >
                            Cancel Edit
                        </button>
                    }
                    <button
                        className="bg-blue-500 text-white px-4 py-2 mt-2"
                        onClick={editingContact ? handleUpdateContact : handleAddContact}
                    >
                        {editingContact ? 'Update ': 'Add'} Contact
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <table className="mt-6 w-full">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Phone</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts?.map((contact: Contact) => (
                        <tr key={contact.id}>
                            <td className="border px-4 py-2">{contact.id}</td>
                            <td className="border px-4 py-2">{contact.name}</td>
                            <td className="border px-4 py-2">{contact.email}</td>
                            <td className="border px-4 py-2">{contact.phone}</td>
                            <td className="border px-4 py-2 space-x-2">
                                <button className="bg-blue-500 text-white px-2 py-1"
                                    onClick={() => handleEditClick(contact)}>
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1"
                                    onClick={() => handleDeleteContact(contact.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};