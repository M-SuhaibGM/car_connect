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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Driver Card Skeleton Component ---
const DriverCardSkeleton = () => (
  <Card className="shadow-lg transition animate-pulse h-55">
    <CardHeader className="flex flex-row justify-between items-start">
      <div className="flex items-center gap-3">
        {/* Avatar Skeleton */}
        <Skeleton className="h-10 w-10 rounded-full" />
        {/* Name Skeleton */}
        <Skeleton className="h-6 w-32" />
      </div>
      {/* Menu Button Skeleton */}
      <Skeleton className="h-8 w-8 rounded-full" />
    </CardHeader>
    <CardContent className="space-y-2">
      {/* Content lines Skeleton */}
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);
// ------------------------------------

export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverCars, setDriverCars] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  // 💡 New state to track if initial data is still fetching
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    idNumber: "",
    adress: "",
  });

  // Fetch all drivers
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await axios.get("/api/drivers");
        setDrivers(res.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        // 💡 Set loading to false once the fetch attempt is complete
        setIsLoading(false);
      }
    }
    fetchDrivers();
  }, []);

  // Handle input changes
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
        const res = await axios.put(`/api/drivers/${editingDriver.id}`, formData);
        setDrivers((prev) =>
          prev.map((d) => (d.id === editingDriver.id ? res.data : d))
        );
        toast.success("Driver updated successfully!");
      } else {
        const res = await axios.post("/api/drivers", formData);
        setDrivers((prev) => [res.data, ...prev]);
        toast.success("Driver added successfully!");
      }
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

  // Handle edit
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

  // Handle click on driver card
  const handleDriverClick = async (driver) => {
    setSelectedDriver(driver);
    try {
      // 💡 Assuming the API response for cars is fast enough or you can add a loading state here too.
      const res = await axios.get(`/api/drivers/${driver.idNumber}/cars`);
      setDriverCars(res.data);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching driver's cars:", error);
      toast.error("Failed to load cars for this driver.");
    }
  };

  return (
    <div className="p-6 min-h-[88.8vh] bg-gray-100" style={{
      backgroundImage: "url('/car.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Drivers 🧑‍✈️</h1>
        <Button
          onClick={() => {
            setEditingDriver(null);
            setFormData({ name: "", phoneNumber: "", idNumber: "", adress: "" });
            setOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white "
        >
          <Plus className="h-5 w-5 mr-2" /> Add Driver
        </Button>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 max-h-[70vh] overflow-y-scroll">
        {isLoading ? (
          // 💡 Show two skeleton cards while loading
          <>
            <DriverCardSkeleton />
            <DriverCardSkeleton />
            <DriverCardSkeleton />
          </>
        ) : drivers.length === 0 ? (
          <p className="text-white text-lg col-span-full text-center p-8 bg-black/30 rounded-lg">No drivers found.</p>
        ) : (
          // Show actual driver cards
          drivers.map((driver) => (
            <Card
              key={driver.id}
              className="shadow-lg cursor-pointer hover:shadow-xl transition"
            >
              <CardHeader className="flex justify-between items-center">
                <div onClick={() => handleDriverClick(driver)} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/driver.jpg" alt="Driver" />
                    <AvatarFallback>
                      {driver.name ? driver.name.charAt(0) : "D"}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{driver.name}</CardTitle>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(driver)}>
                      ✏️ Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(driver.id)}
                    >
                      🗑️ Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>

              <CardContent onClick={() => handleDriverClick(driver)}>
                <p><strong>Phone:</strong> {driver.phoneNumber ?? "-"}</p>
                <p><strong>ID No:</strong> {driver.idNumber ?? "-"}</p>
                <p><strong>Address:</strong> {driver.adress ?? "-"}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Drawer for Add/Edit (Sheet) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[400px] sm:w-[500px]">
          <SheetHeader>
            <SheetTitle>{editingDriver ? "Update Driver" : "Add Driver"}</SheetTitle>
          </SheetHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4 mt-6"
          >
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
            <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
            <Input name="idNumber" placeholder="ID Number" value={formData.idNumber} onChange={handleChange} />
            <Input name="adress" placeholder="Address" value={formData.adress} onChange={handleChange} />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Driver Cars Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-5xl">
          <DialogHeader>
            <DialogTitle>Cars for {selectedDriver?.name}</DialogTitle>
          </DialogHeader>

          <div className="mt-4 overflow-x-auto">
            {driverCars.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Rego</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Expense</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {driverCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>{car.carModel}</TableCell>
                      <TableCell>{car.rego}</TableCell>
                      <TableCell>{car.rentPerWeek ?? "-"}</TableCell>
                      <TableCell>{car.receipt ?? "-"}</TableCell>
                      <TableCell>{car.expense ?? "-"}</TableCell>
                      <TableCell>
                        {new Date(car.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-gray-500 text-center py-6">
                No cars assigned to this driver.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}