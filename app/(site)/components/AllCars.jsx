"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function AllCars() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    // ✅ Fetch all cars
    useEffect(() => {
        async function fetchCars() {
            try {
                const res = await axios.get("/api/data");
                setCars(res.data);
            } catch (error) {
                console.error("Error fetching cars:", error);
                toast.error("Failed to load cars.");
            } finally {
                setLoading(false);
            }
        }
        fetchCars();
    }, []);

    // ✅ Delete car
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/data/${id}`);
            setCars((prev) => prev.filter((car) => car.id !== id));
            toast.success("Car deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete car.");
        }
    };

    // ✅ Filter cars by car number
    const filteredCars = cars.filter((car) =>
        car.carNumber?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[90vh]">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] p-6">
            {/* 🔍 Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-white">All Cars 🚗</h1>
                <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by Car Number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 bg-white"
                    />
                </div>
            </div>

            {/* 🧩 Cards Layout */}
            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {filteredCars.map((car) => (
                        <Card
                            key={car.id}
                            className="shadow-md hover:shadow-xl transition-all relative overflow-hidden w-full max-w-xs mx-auto h-[280px]"
                        >
                            {/* 🔴 Rented Label */}
                            {car.rented && (
                                <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    Rented
                                </span>
                            )}

                            <CardHeader className="flex justify-between items-center py-2 px-4">
                                <CardTitle className="text-base truncate">
                                    {car.carModel ?? "Unknown Model"}
                                </CardTitle>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() => router.push(`/editor/${car.id}?page=dashboard`)}
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-500"
                                            onClick={() => handleDelete(car.id)}
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            {/* 🧱 Two-column content */}
                            <CardContent className="grid grid-cols-2 gap-2 px-4 pb-4 items-center">
                                {/* 🖼️ Left: Image */}
                                <div className="flex justify-center  h-[100px] w-[130px] relative ">
                                    <Image
                                        src={car?.imageUrl || "/car.jpg"}
                                        alt="Car"
                                        fill
                                        className="absolute object-cover  rounded-md"
                                    />
                                </div>

                                {/* 📋 Right: Car Details */}
                                <div className="space-y-1 text-sm">
                                    <p>
                                        <strong>No:</strong> {car.carNumber ?? "-"}
                                    </p>
                                    <p>
                                        <strong>Rego:</strong> {car.rego ?? "-"}
                                    </p>
                                    <p>
                                        <strong>Rent:</strong> ${car.rentPerWeek ?? 0}
                                    </p>
                                    <p className="line-clamp-1">
                                        <strong>Desc:</strong> {car.description ?? "-"}
                                    </p>
                                </div>

                                {/* 🧍 Driver Info if rented */}
                                {car.rented && (
                                    <div className="col-span-2 mt-2 bg-gray-100 p-2 rounded text-xs text-gray-800">
                                        <p>
                                            <strong>Driver:</strong> {car.driverName ?? "Unknown"}
                                        </p>
                                        <p>
                                            <strong>Rented Date:</strong>{" "}
                                            {car.rentedDate
                                            }
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-200 mt-10">
                    No cars found matching "{search}"
                </p>
            )}
        </div>
    );
}
