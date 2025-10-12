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

export default function AvailableCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

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

      {/* Cards Layout */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  max-h-[70vh]">
          {filteredCars.map((car) => (
            <Card
              key={car.id}
              className="shadow-md hover:shadow-lg transition-all w-[200px] md:w-[260px] rounded-lg overflow-hidden"
            >
              <CardHeader className="flex justify-between items-center p-2">
                <CardTitle className="text-sm font-semibold truncate">
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
                      onClick={() => router.push(`/editor/${car.id}/?page=available`)}
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

              <CardContent className="flex flex-col items-center text-center space-y-1.5 p-2">
                <Image
                  src="/car.png"
                  alt="Car"
                  width={75}
                  height={75}
                  className="object-contain"
                />
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
        <p className="text-center text-gray-200 mt-10">
          No cars found matching "{search}"
        </p>
      )}
    </div>
  );
}
