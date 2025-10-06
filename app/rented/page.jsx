"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await axios.get("/api/data");
        // Only rented cars
        setCars(res.data.filter((car) => car.rented === true));
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
    <div className="min-h-[90vh] bg-gray-100 p-6  " style={{
      backgroundImage: "url('/car.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "90vh",
      width: "100%",
    }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Rented Cars 🚗</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by Car Number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8  bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Model</TableHead>
              <TableHead className="font-bold">Rego</TableHead>
              <TableHead className="font-bold">Driver</TableHead>
              <TableHead className="font-bold">Rent (Per Week)</TableHead>
              <TableHead className="font-bold">Receipt</TableHead>
              <TableHead className="font-bold">Received</TableHead>
              <TableHead className="font-bold">Expense</TableHead>
              <TableHead className="font-bold">Description</TableHead>
              <TableHead className="font-bold">Rented Date</TableHead>
              <TableHead className="font-bold">Car Number</TableHead>
              <TableHead className="font-bold" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.carModel ?? "-"}</TableCell>
                  <TableCell>{car.rego ?? "-"}</TableCell>
                  <TableCell>{car.driverName ?? "-"}</TableCell>
                  <TableCell>${car.rentPerWeek ?? 0}</TableCell>
                  <TableCell>{car.receipt ?? "-"}</TableCell>
                  <TableCell>${car.amountReceiver ?? 0}</TableCell>
                  <TableCell>{car.expense ?? "-"}</TableCell>
                  <TableCell>{car.description ?? "-"}</TableCell>
                  <TableCell>{car.rentedDate ?? "-"}</TableCell>
                  <TableCell>{car.carNumber ?? "-"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => router.push(`/editor/${car.id}/rented`)}
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                  No cars found matching "{search}"
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
