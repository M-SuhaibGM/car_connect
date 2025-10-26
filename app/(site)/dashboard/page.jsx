"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Layout, LayoutDashboard, Loader2, } from "lucide-react";
import { toast } from "sonner";
import AllCars from "../components/AllCars";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Skeleton Components ---

const DriverCardSkeleton = () => (
    <Card className="shadow-md border border-gray-200 relative flex flex-col h-[350px] animate-pulse">
        <CardHeader className="flex flex-row items-center space-x-3 pb-0">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
            </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between space-y-4 pt-4">
            {/* Table placeholder */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
            </div>

            {/* Totals placeholder */}
            <div className="mt-3 text-sm space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Button placeholder */}
            <div className="flex justify-between gap-2 mt-auto pt-3">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-8 w-1/2" />
            </div>
        </CardContent>
    </Card>
);

const DashboardSkeleton = () => (
    <div className="p-6 min-h-screen" style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    }}>
        <h1 className="text-3xl font-bold flex items-center gap-1.5 text-white mb-8">
            <LayoutDashboard className="h-7 w-7" />
            Dashboard
        </h1>
        <AllCars />
        <h1 className="text-3xl font-bold flex items-center gap-1.5 text-white mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            Drivers
        </h1>
        {/* Driver Cards Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DriverCardSkeleton />
            <DriverCardSkeleton />
            <DriverCardSkeleton />
        </div>

        {/* Totals Buttons Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-64" />
        </div>

        <h1 className="text-3xl font-bold flex items-center gap-1.5 text-white my-8">
            <Layout className="h-7 w-7" />
            Graph
        </h1>

        {/* Chart Skeleton */}
        <div className="mt-10 bg-white rounded-xl shadow-md p-4">
            <Skeleton className="h-6 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-64 w-full" />
        </div>
    </div>
);


export default function DashboardPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPendingDialog, setShowPendingDialog] = useState(false);

    const router = useRouter();

    // ✅ Fetch all cars
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get("/api/data");
                // ✅ Only include cars with rented = true
                const rentedCars = res.data.filter((car) => car.rented === true);
                setCars(rentedCars);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    // 🧮 Group cars by driverId
    const groupedByDriver = cars.reduce((acc, car) => {
        if (!acc[car.driverId]) acc[car.driverId] = [];
        acc[car.driverId].push(car);
        return acc;
    }, {});

    // 🧾 Summarize each driver’s data
    const driverSummaries = Object.entries(groupedByDriver).map(
        ([driverId, driverCars]) => {
            const driverName = driverCars[0]?.driverName || "Unknown Driver";
            const totalRent = driverCars.reduce(
                (sum, car) => sum + (car.rentPerWeek || 0),
                0
            );
            const totalReceived = driverCars.reduce(
                (sum, car) => sum + (car.amountReceiver || 0),
                0
            );
            const totalPending = totalRent - totalReceived;

            return {
                driverId,
                driverName,
                cars: driverCars,
                totalRent,
                totalReceived,
                totalPending,
            };
        }
    );

    // 💰 Overall totals
    const totalReceived = driverSummaries.reduce(
        (sum, d) => sum + d.totalReceived,
        0
    );
    const totalPending = driverSummaries.reduce(
        (sum, d) => sum + d.totalPending,
        0
    );

    // 📊 Monthly rent graph data
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    const monthlyTotals = {};
    months.forEach((m) => (monthlyTotals[m] = 0));
    const currentYear = new Date().getFullYear();

    cars.forEach((car) => {
        if (!car.amountReceiver || car.amountReceiver === 0) return;

        let date =
            (car.rentedDate && new Date(car.rentedDate)) ||
            (car.createdAt && new Date(car.createdAt)) ||
            new Date();

        if (isNaN(date)) date = new Date();
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();

        if (year === currentYear) {
            monthlyTotals[month] += car.amountReceiver || 0;
        }
    });

    const chartData = months.map((m) => ({
        month: m,
        amount: monthlyTotals[m] || 0,
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen "
            style={{
                backgroundImage: "url('/car.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}>
            <h1 className="text-3xl font-bold flex items-center gap-1.5  text-white mb-8">
                <LayoutDashboard className="h-7 w-7" />
                Dashboard

            </h1>
            <AllCars />
            {/* Driver Cards */}
            <h1 className="text-3xl font-bold flex items-center gap-1.5  text-white mb-8">
                <img src="/driver.jpg" alt="Driver Avatar" width={40} height={40} className="rounded-full border" />
                Drivers
            </h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {driverSummaries.map((d) => (
                    <Card
                        key={d.driverId}
                        className="shadow-md border border-gray-200 hover:shadow-lg transition-all relative flex flex-col"
                    >
                        <CardHeader className="flex items-center space-x-3 pb-0">
                            <Image
                                src="/driver.jpg"
                                alt="Driver Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border"
                            />
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    {d.driverName}
                                </CardTitle>
                                <p className="text-xs text-gray-500">ID: {d.driverId}</p>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1 flex flex-col justify-between space-y-3">
                            {/* Table of cars rented by this driver */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm border border-gray-200 rounded-md">
                                    <thead className="bg-gray-100 text-gray-700">
                                        <tr>
                                            <th className="px-2 py-1 text-left">Car #</th>
                                            <th className="px-2 py-1 text-left">Rent/Week</th>
                                            <th className="px-2 py-1 text-left">Received</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {d.cars.map((car, i) => (
                                            <tr key={i} className="border-t text-gray-700">
                                                <td className="px-2 py-1">{car.carNumber}</td>
                                                <td className="px-2 py-1">${car.rentPerWeek || 0}</td>
                                                <td className="px-2 py-1 text-green-600">
                                                    ${car.amountReceiver || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mt-3 text-sm text-gray-700 space-y-1">
                                <p>
                                    <span className="font-medium">Total Rent: </span>
                                    <span className="font-semibold">
                                        ${d.totalRent.toFixed(2)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">Received: </span>
                                    <span className="font-semibold text-blue-600">
                                        ${d.totalReceived.toFixed(2)}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-medium">Pending: </span>
                                    <span className="font-semibold ">
                                        ${d.totalPending.toFixed(2)}
                                    </span>
                                </p>
                            </div>

                            {/* Fixed Buttons at Bottom */}
                            <div className="flex justify-between gap-2 mt-auto pt-3">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="bg-blue-600 hover:bg-blue-700 w-1/2 text-xs"
                                >
                                    💵 ${d.totalReceived.toFixed(2)} Received
                                </Button>
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="w-1/2 text-xs bg-gray-500 hover:bg-gray-600"
                                >
                                    ⚠️ ${d.totalPending.toFixed(2)} Pending
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Totals */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    💰 Total Rent Received: ${totalReceived.toFixed(2)}
                </Button>

                {/* ⚠️ Pending Button Opens Dialog */}
                <Button
                    variant="default"
                    className="bg-gray-500 hover:bg-gray-600"
                    onClick={() => setShowPendingDialog(true)}
                >
                    ⚠️ Total Pending Rent: ${totalPending.toFixed(2)}
                </Button>
            </div>

            {/* 🧾 Pending Rent Dialog */}
            <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-center">
                            ⚠️ Pending Rent Details
                        </DialogTitle>
                    </DialogHeader>

                    {driverSummaries.every((d) => d.totalPending === 0) ? (
                        <p className="text-center text-gray-500 mt-6">
                            🎉 No pending payments — all clear!
                        </p>
                    ) : (
                        <div className="space-y-6 mt-4">
                            {driverSummaries
                                .filter((d) => d.totalPending > 0)
                                .map((d) => (
                                    <div
                                        key={d.driverId}
                                        className="border rounded-lg p-4 shadow-sm bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Image
                                                src="/driver.jpg"
                                                alt="Driver Avatar"
                                                width={40}
                                                height={40}
                                                className="rounded-full border"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-lg">{d.driverName}</h3>
                                                <p className="text-sm text-gray-500">
                                                    Pending Total: ${d.totalPending.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Table of this driver's pending cars */}
                                        <table className="w-full text-sm border border-gray-200 rounded-md mt-2">
                                            <thead className="bg-gray-100 text-gray-700">
                                                <tr>
                                                    <th className="px-2 py-1 text-left">Car #</th>
                                                    <th className="px-2 py-1 text-left">Rent/Week</th>
                                                    <th className="px-2 py-1 text-left">Received</th>
                                                    <th className="px-2 py-1 text-left">Pending</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {d.cars
                                                    .filter((car) => (car.rentPerWeek || 0) - (car.amountReceiver || 0) > 0)
                                                    .map((car, i) => {
                                                        const pending =
                                                            (car.rentPerWeek || 0) - (car.amountReceiver || 0);
                                                        return (
                                                            <tr key={i} className="border-t text-gray-700">
                                                                <td className="px-2 py-1">{car.carNumber}</td>
                                                                <td className="px-2 py-1">${car.rentPerWeek || 0}</td>
                                                                <td className="px-2 py-1 text-green-600">
                                                                    ${car.amountReceiver || 0}
                                                                </td>
                                                                <td className="px-2 py-1 text-red-600">
                                                                    ${pending.toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <h1 className="text-3xl font-bold  flex  items-center gap-1.5   text-white mb-8">
                <Layout className="h-7 w-7" />
                Graph

            </h1>

            {/* Chart */}
            <div className="mt-10 bg-white rounded-xl shadow-md p-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Monthly Rent Received ({currentYear})
                </h2>
                {chartData.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No rent data available yet.
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            {/* ✅ Set Y-axis range from 0 to 5000 */}
                            <YAxis domain={[0, 5000]} />
                            <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                            <Bar dataKey="amount" fill="#3498db" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}