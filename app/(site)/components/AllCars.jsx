"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { MoreHorizontal, Search } from "lucide-react";
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
// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Card Skeleton Component ---
const CardSkeleton = () => (
    <Card className="shadow-md transition-all relative overflow-hidden w-full max-w-xs mx-auto h-[280px] animate-pulse">
        {/* Header Skeleton */}
        <CardHeader className="flex flex-row justify-between items-center py-2 px-4">
            <Skeleton className="h-4 w-3/5" />
            <div className="h-6 w-6 rounded-full bg-gray-200"></div> {/* Menu button placeholder */}
        </CardHeader>

        {/* Content Skeleton */}
        <CardContent className="grid grid-cols-2 gap-2 px-4 pb-4 items-center">
            {/* Image Skeleton */}
            <div className="flex justify-center h-[100px] w-[130px] relative">
                <Skeleton className="h-full w-full rounded-md" />
            </div>

            {/* Details Skeleton */}
            <div className="space-y-2 text-sm">
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Driver Info Skeleton (takes full width) */}
            <div className="col-span-2 mt-2 p-2 rounded bg-gray-100 space-y-2">
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
            </div>
        </CardContent>
    </Card>
);
// ------------------------------

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

    // 🛑 Removing the full-screen Loader2 block here.
    // We will handle loading within the main return structure below.

    return (
        <div className="min-h-[70vh] p-6">
            {/* 🔍 Header */}
            <div className="flex items-center justify-between mb-6">
                {/* NOTE: You used 'text-white' here, which might only work if the parent div has a dark background. Assuming it's meant to be visible. */}
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

            {/* 💡 Conditional Cards Layout: Show Skeleton or Data */}
            {loading ? (
                // Show 3 Card Skeletons while loading
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            ) : filteredCars.length > 0 ? (
                // Show actual data
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCars.map((car) => (
                        <Card
                            key={car.id}
                            className="shadow-md hover:shadow-xl transition-all relative overflow-hidden w-full max-w-sm mx-auto"
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

                            {/* 🧱 Responsive layout inside card */}
                            <CardContent className="flex flex-col sm:flex-row items-center sm:items-start gap-3 px-4 pb-4">
                                {/* 🖼️ Car Image */}
                                <div className="relative w-full sm:w-[45%] h-[140px] sm:h-[120px] md:h-[150px] rounded-md overflow-hidden">
                                    <Image
                                        src={car?.imageUrl || "/car.jpg"}
                                        alt="Car"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* 📋 Car Details */}
                                <div className="flex-1 text-sm space-y-1 w-full sm:w-[55%]">
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
                            </CardContent>

                            {/* 🧍 Driver Info if rented */}
                            {car.rented && (
                                <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-xs text-gray-700">
                                    <p>
                                        <strong>Driver:</strong> {car.driverName ?? "Unknown"}
                                    </p>
                                    <p>
                                        <strong>Rented Date:</strong> {car.rentedDate}
                                    </p>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

            ) : (
                // Show no results message
                <p className="text-center text-gray-500 mt-10">
                    No cars found matching "{search}"
                </p>
            )}
        </div>
    );
}