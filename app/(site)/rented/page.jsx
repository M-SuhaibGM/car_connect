"use client";

import { useEffect, useState, useMemo } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useSession } from "next-auth/react";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  // ✅ Admin check
  useEffect(() => {
    if (status !== "loading") {
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const isAdminUser = session?.user?.email === adminEmail;
      setIsAdmin(isAdminUser);
      setCheckingAdmin(false);
    }
  }, [status, session]);

  // ✅ Fetch cars
  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await axios.get("/api/data");
        setCars(res.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  // ✅ Memoized values — must always run before any conditional return
  const rentedCars = useMemo(() => cars.filter((c) => c.rented === true), [cars]);

  const groupedByMonth = useMemo(() => {
    const grouped = {};
    rentedCars.forEach((car) => {
      const date = new Date(car.createdAt);
      const monthYear = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!grouped[monthYear]) grouped[monthYear] = [];
      grouped[monthYear].push(car);
    });

    const sortedKeys = Object.keys(grouped).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    return { grouped, sortedKeys };
  }, [rentedCars]);

  const months = groupedByMonth.sortedKeys;
  const currentMonth =
    months.length > 0 ? months[currentMonthIndex] : "No Data";
  const monthCars =
    groupedByMonth.grouped[currentMonth] && months.length > 0
      ? groupedByMonth.grouped[currentMonth]
      : [];

  const filteredCars = monthCars.filter(
    (car) =>
      car.week === currentWeek &&
      car.carNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalExpense = filteredCars.reduce(
    (acc, car) => acc + (Number(car.expense) || 0),
    0
  );
  const totalProfit = filteredCars.reduce(
    (acc, car) => acc + (Number(car.profit) || 0),
    0
  );
  const totalLoss = filteredCars.reduce(
    (acc, car) => acc + (Number(car.loss) || 0),
    0
  );

  // ✅ Navigation handlers
  const handleNextWeek = () => {
    setCurrentWeek((prev) => (prev < 4 ? prev + 1 : prev));
  };
  const handlePrevWeek = () => {
    setCurrentWeek((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleNextMonth = () => {
    if (currentMonthIndex < months.length - 1) {
      setCurrentMonthIndex((prev) => prev + 1);
      setCurrentWeek(1);
    }
  };
  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex((prev) => prev - 1);
      setCurrentWeek(1);
    }
  };

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

  // ✅ Loading Spinner
  if (loading || checkingAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  // ✅ Non-admin view
  if (!isAdmin) {
    const filteredNonAdminCars = cars
      .filter(
        (car) =>
          car.rented === true &&
          car.carNumber?.toLowerCase().includes(search.toLowerCase())
      )
      .reverse();

    return (
      <div
        className="min-h-[88.8vh] bg-gray-100 p-6"
        style={{
          backgroundImage: "url('/car.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Rented Cars 🚘</h1>
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

        {filteredNonAdminCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pb-4">
            {filteredNonAdminCars.map((car) => (
              <Card
                key={car.id}
                className="shadow-md hover:shadow-lg transition-all w-[200px] md:w-[260px] rounded-lg overflow-hidden"
              >
                <CardHeader className="flex justify-between items-center p-2">
                  <CardTitle className="text-sm font-semibold truncate">
                    {car.carModel ?? "Unknown Model"}
                  </CardTitle>
                  <span className="text-xs font-semibold text-green-600">
                    ✅ Rented
                  </span>
                </CardHeader>

                <CardContent className="flex flex-col items-center text-center space-y-1.5 p-2">
                  <div className="flex justify-center h-[100px] w-[200px] relative">
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
          <p className="text-center text-gray-200 mt-10">
            No rented cars found matching "{search}"
          </p>
        )}
      </div>
    );
  }

  // ✅ Admin Table View
  return (
    <div
      className="min-h-[88.8vh] bg-gray-100 p-6 flex flex-col"
      style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Rented Cars 🚗</h1>
          <p className="text-white text-sm">
            Showing <strong>Week {currentWeek}</strong> of{" "}
            <strong>{currentMonth}</strong>
          </p>
        </div>

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

      <div className="flex-1 bg-white shadow-lg rounded-lg max-h-[70vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-gray-100 z-10">
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Rego</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>DriverId</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Rent (Per Week)</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Rented Date</TableHead>
                <TableHead>Car Number</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCars.length > 0 ? (
                filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.carModel ?? "-"}</TableCell>
                    <TableCell>{car.rego ?? "-"}</TableCell>
                    <TableCell>{car.driverName ?? "-"}</TableCell>
                    <TableCell>{car.driverId ?? "-"}</TableCell>
                    <TableCell>{car.week ?? "-"}</TableCell>
                    <TableCell>${car.rentPerWeek ?? 0}</TableCell>
                    <TableCell>{car.receipt ?? "-"}</TableCell>
                    <TableCell>${car.amountReceiver ?? 0}</TableCell>
                    <TableCell>${car.expense ?? 0}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      ${car.profit ?? 0}
                    </TableCell>
                    <TableCell className="text-red-600 font-semibold">
                      ${car.loss ?? 0}
                    </TableCell>
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
                            onClick={() =>
                              router.push(`/editor/${car.id}/?page=rented`)
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={14}
                    className="text-center py-6 text-gray-500"
                  >
                    No cars found for Week {currentWeek} in {currentMonth}
                  </TableCell>
                </TableRow>
              )}

              {filteredCars.length > 0 && (
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell colSpan={8} className="text-right">
                    Totals:
                  </TableCell>
                  <TableCell>${totalExpense}</TableCell>
                  <TableCell className="text-green-600">
                    ${totalProfit}
                  </TableCell>
                  <TableCell className="text-red-600">
                    ${totalLoss}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentMonthIndex === months.length - 1}
            onClick={handleNextMonth}
          >
            ← Previous Month
          </Button>
          <Button
            variant="outline"
            disabled={currentMonthIndex === 0}
            onClick={handlePrevMonth}
          >
            Next Month →
          </Button>
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={currentWeek === 1}
                onClick={handlePrevWeek}
              >
                ← Previous Week
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                variant="outline"
                disabled={currentWeek === 4}
                onClick={handleNextWeek}
              >
                Next Week →
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
