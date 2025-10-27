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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Table Skeleton Component for Admin View ---
const TableSkeleton = () => (
  <TableBody>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse">
        {/* 16 TableCells to match the columns */}
        {Array.from({ length: 16 }).map((_, cellIndex) => (
          <TableCell key={cellIndex} className="py-4">
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);
// -----------------------------------------------

// --- Card Skeleton Component for Non-Admin View (Re-used from previous chat) ---
const CardSkeleton = () => (
  <Card className="shadow-md transition-all w-[200px] md:w-[260px] rounded-lg overflow-hidden animate-pulse">
    <CardHeader className="flex justify-between items-center p-2 flex-row">
      {/* Title Skeleton */}
      <Skeleton className="h-4 w-2/3" />
      {/* Badge Skeleton */}
      <Skeleton className="h-4 w-1/4" />
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
// ------------------------------------------------------------------------------


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
  const [selectedImage, setSelectedImage] = useState(null);

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

  // ... (rest of the useMemo and handlers remain the same) ...

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


  // 🛑 REMOVING THE FULL-SCREEN LOADER BLOCK 🛑
  // if (loading || checkingAdmin) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[90vh]">
  //       <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
  //     </div>
  //   );
  // }

  // Use a loader only for the initial admin check, otherwise, show the skeleton for data fetching
  if (checkingAdmin) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
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

        {/* 💡 Show Card Skeletons while loading the non-admin view data */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : filteredNonAdminCars.length > 0 ? (
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

  // ... (imports and component logic remain the same) ...

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
      {/* Header */}
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

      {/* ✨ Navigation and Totals Area (New/Updated) */}
      <div className="flex justify-between items-center mb-4">
        {/* Month Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevMonth}
            disabled={currentMonthIndex === months.length - 1} // Disable if at the newest month
            className="bg-white/80 backdrop-blur-sm"
          >
            Prev Month
          </Button>
          <Button
            variant="outline"
            onClick={handleNextMonth}
            disabled={currentMonthIndex === 0} // Disable if at the oldest month
            className="bg-white/80 backdrop-blur-sm"
          >
            Next Month
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePrevWeek}
            disabled={currentWeek === 1}
            className="bg-white/80 backdrop-blur-sm"
          >
            Prev Week
          </Button>
          <Button
            variant="outline"
            onClick={handleNextWeek}
            disabled={currentWeek === 4}
            className="bg-white/80 backdrop-blur-sm"
          >
            Next Week
          </Button>
        </div>
      </div>
      {/* --- */}

      {/* Table */}
      <div className="flex-1 bg-white shadow-lg rounded-lg max-h-[70vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <Table className="w-full">
            {/* ... (TableHeader and TableBody remain the same) ... */}
            <TableHeader className="sticky top-0 bg-gray-100 z-10">
              {/* FIX: Removed whitespace/line breaks inside TableRow */}
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Rego</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>DriverId</TableHead>
                <TableHead>Week</TableHead>
                <TableHead>Rent (Per Week)</TableHead>
                <TableHead>Receipt</TableHead>
                <TableHead>Receipt Image</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Expense</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Loss</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Rented Date</TableHead>
                <TableHead>Car Number</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            {/* 💡 Conditional TableBody Rendering: Show Skeleton or Data */}
            {loading ? (
              <TableSkeleton />
            ) : filteredCars.length > 0 ? (
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>{car.carModel ?? "-"}</TableCell>
                    <TableCell>{car.rego ?? "-"}</TableCell>
                    <TableCell>{car.driverName ?? "-"}</TableCell>
                    <TableCell>{car.driverId ?? "-"}</TableCell>
                    <TableCell>{car.week ?? "-"}</TableCell>
                    <TableCell>${car.rentPerWeek ?? 0}</TableCell>
                    <TableCell>{car.receipt ?? "-"}</TableCell>

                    {/* ✅ Receipt Image cell */}
                    <TableCell>
                      {car.receiptImageUrl ? (
                        <button
                          onClick={() => setSelectedImage(car?.receiptImageUrl)}
                          className="hover:opacity-80 transition"
                        >
                          <Image
                            src={car.receiptImageUrl}
                            alt="Receipt"
                            width={50}
                            height={50}
                            className="rounded-md object-cover border w-[50px] h-[50px] mx-auto"
                          />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </TableCell>

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
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={16}
                    className="text-center py-6 text-gray-500"
                  >
                    No cars found for Week {currentWeek} in {currentMonth}
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </div>
      </div>

      {/* ✨ Totals Card (New) */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expense
            </CardTitle>
            <span className="text-red-500">🔻</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-red-600">
              ${totalExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Profit
            </CardTitle>
            <span className="text-green-500">🟢</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600">
              ${totalProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Loss
            </CardTitle>
            <span className="text-red-500">🔴</span>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-red-600">
              ${totalLoss.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* --- */}


      {/* ✅ Dialog to show big image (remains the same) */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl w-[90vw]">
          <DialogHeader>
            <DialogTitle>Receipt Image</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="flex justify-center items-center">
              <Image
                src={selectedImage}
                alt="Full Receipt"
                width={700}
                height={700}
                className="rounded-lg object-contain max-h-[70vh] max-w-full mx-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}