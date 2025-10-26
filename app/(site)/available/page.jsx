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
import { useSession } from "next-auth/react";
// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Car Card Skeleton Component ---
const CarCardSkeleton = () => (
  <Card className="shadow-md transition-all w-[200px] md:w-[260px] rounded-lg overflow-hidden animate-pulse">
    <CardHeader className="flex justify-between items-center p-2 flex-row">
      {/* Title Skeleton */}
      <Skeleton className="h-4 w-2/3" />
      {/* Menu Button Skeleton */}
      <Skeleton className="h-6 w-6 rounded-full" />
    </CardHeader>

    <CardContent className="flex flex-col items-center text-center space-y-1.5 p-2">
      {/* Image Skeleton */}
      <div className="flex justify-center h-[100px] w-full relative">
        <Skeleton className="h-[100px] w-full rounded-md" />
      </div>
      {/* Content lines Skeleton */}
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-4/5" />
    </CardContent>
  </Card>
);
// ------------------------------------

export default function AvailableCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const isAdminUser = session?.user?.email === adminEmail;
      setIsAdmin(isAdminUser);
      setCheckingAdmin(false);
    }
  }, [status, session]);

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await axios.get("/api/data");
        // Only NOT rented cars
        setCars(res.data.filter((car) => car.rented === false));
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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

  const filteredCars = cars.filter((car) =>
    car.carNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // 1. Keep the check for 'checkingAdmin'
  if (checkingAdmin) {
    return (
      <div
        className="min-h-[88.8vh] bg-gray-100 p-6"
        style={{
          backgroundImage: "url('/car.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Available Cars 🚘</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh]">

          <CarCardSkeleton />
          <CarCardSkeleton />
          <CarCardSkeleton />
        </div>
      </div>
    );
  }


  const skeletonCards = Array.from({ length: 3 }).map((_, index) => (
    <CarCardSkeleton key={index} />
  ));


  return (
    <div
      className="min-h-[88.8vh] bg-gray-100 p-6"
      style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Available Cars 🚘</h1>
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

      {/* 3. Conditional Rendering now prioritizes 'loading' for the skeletons */}
      {loading ? (
        // Show the 4 skeleton cards while initial data is loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh]">
          {skeletonCards}
        </div>
      ) : filteredCars.length > 0 ? (
        // Show actual cars after loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh]">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className="shadow-md hover:shadow-lg transition-all w-[200px] md:w-[260px] rounded-lg overflow-hidden"
            >
              <CardHeader className="flex justify-between items-center p-2">
                <CardTitle className="text-sm font-semibold truncate">
                  {car.carModel ?? "Unknown Model"}
                </CardTitle>

                {/* ✅ Only show edit/delete if admin */}
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/editor/${car.id}/?page=available`)
                        }
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
                )}
              </CardHeader>

              <CardContent className="flex flex-col items-center text-center space-y-1.5 p-2">
                <div className="flex justify-center h-[100px] w-[200px] relative ">
                  <Image
                    src={car.imageUrl ?? "/car.jpg"}
                    alt="Car"
                    fill
                    className="absolute object-cover rounded-md"
                  />
                </div>
                <p className="text-xs">
                  <strong>Car #:</strong> {car.carNumber ?? "-"}
                </p>
                <p className="text-xs">
                  <strong>Rego:</strong> {car.rego ?? "-"}
                </p>
                <p className="text-xs">
                  <strong>Rent:</strong> ${car.rentPerWeek ?? 0}
                </p>
                <p className="text-xs line-clamp-1">
                  <strong>Desc:</strong> {car.description ?? "-"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Show no results message only after loading is complete and no filter matches
        <p className="text-center text-gray-200 mt-10">
          No cars found matching "{search}"
        </p>
      )}
    </div>
  );
}