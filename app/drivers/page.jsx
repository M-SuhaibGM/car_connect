"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Plus } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function DriversPage() {
    const [drivers, setDrivers] = useState([]);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        idNumber: "",
        adress: "",
    });

    // Fetch drivers
    useEffect(() => {
        async function fetchDrivers() {
            try {
                const res = await axios.get("/api/drivers");
                setDrivers(res.data);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        }
        fetchDrivers();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle submit (create/update)
    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Name is required!");
            return;
        }
        setIsSubmitting(true);

        try {
            if (editingDriver) {
                // Update driver
                const res = await axios.put(`/api/drivers/${editingDriver.id}`, {
                    ...formData,
                    phoneNumber: formData.phoneNumber,
                    idNumber: formData.idNumber,
                });
                setDrivers((prev) =>
                    prev.map((d) => (d.id === editingDriver.id ? res.data : d))
                );
                toast.success("Driver updated successfully!");
            } else {
                // Create new driver
                const res = await axios.post("/api/drivers", {
                    ...formData,
                    phoneNumber: formData.phoneNumber,
                    idNumber: formData.idNumber,
                });
                setDrivers((prev) => [res.data, ...prev]);
                toast.success("Driver added successfully!");
            }

            // Reset form
            setFormData({ name: "", phoneNumber: "", idNumber: "", adress: "" });
            setEditingDriver(null);
            setOpen(false);
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Failed to save driver.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/drivers/${id}`);
            setDrivers((prev) => prev.filter((d) => d.id !== id));
            toast.success("Driver deleted!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete driver.");
        }
    };

    // Handle edit (open drawer with data)
    const handleEdit = (driver) => {
        setEditingDriver(driver);
        setFormData({
            name: driver.name || "",
            phoneNumber: driver.phoneNumber || "",
            idNumber: driver.idNumber || "",
            adress: driver.adress || "",
        });
        setOpen(true);
    };

    return (
        <div className="p-6 min-h-[90vh] bg-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Drivers 🧑‍✈️</h1>
                <Button
                    onClick={() => {
                        setEditingDriver(null);
                        setFormData({ name: "", phoneNumber: "", idNumber: "", adress: "" });
                        setOpen(true);
                    }}
                >
                    <Plus className="h-5 w-5 mr-2" /> Add Driver
                </Button>
            </div>

            {/* Drivers Grid */}


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drivers.map((driver) => (
                    <Card key={driver.id} className="shadow-lg">
                        <CardHeader className="flex justify-between items-center">
                            <div className="flex items-center justify-between gap-3">
                                {/* ✅ Avatar with image */}
                                <Avatar className="h-30 w-30">
                                    <AvatarImage src="/driver.jpg" alt="Driver" />
                                    <AvatarFallback>
                                        {driver.name ? driver.name.charAt(0) : "D"} {/* fallback letter */}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Driver Name */}

                                <CardTitle>{driver.name}</CardTitle>
                            </div>

                            {/* Dropdown menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleEdit(driver)}>
                                        Update
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-500"
                                        onClick={() => handleDelete(driver.id)}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>

                        <CardContent>
                            <p>
                                <strong>Phone:</strong> {driver.phoneNumber ?? "-"}
                            </p>
                            <p>
                                <strong>ID No:</strong> {driver.idNumber ?? "-"}
                            </p>
                            <p>
                                <strong>Address:</strong> {driver.adress ?? "-"}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>


            {/* Drawer for Add/Edit */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle>
                            {editingDriver ? "Update Driver" : "Add Driver"}
                        </SheetTitle>
                    </SheetHeader>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="space-y-4 mt-6"
                    >
                        <Input
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <Input
                            name="phoneNumber"
                            type="number"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <Input
                            name="idNumber"
                            type="number"
                            placeholder="ID Number"
                            value={formData.idNumber}
                            onChange={handleChange}
                        />
                        <Input
                            name="adress"
                            placeholder="Address"
                            value={formData.adress}
                            onChange={handleChange}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
}
