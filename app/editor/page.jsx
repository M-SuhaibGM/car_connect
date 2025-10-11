"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function EditorPage() {
  const [formData, setFormData] = useState({
    rego: "",
    driverId: "",
    carModel: "",
    driverName: "",
    rentPerWeek: "",
    receipt: "",
    amountReceiver: "",
    expense: "",
    description: "",
    carNumber: "",
    rented: false, // boolean
    rentedDate: "",

  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/data", formData);
      toast.success("Data submitted successfully!");

      // clear form
      setFormData({
        rego: "",
        driverId: "",
        carModel: "",
        driverName: "",
        rentPerWeek: "",
        receipt: "",
        amountReceiver: "",
        expense: "",
        description: "",
        carNumber: "",
        rented: false,
        rentedDate: "",

      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center bg-gray-50 p-1"
      style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        objectFit: "cover",
        minHeight: "90vh",
        width: "100%",
      }}
    >
      <Card className="w-full max-w-3xl shadow-lg h-[85vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Car Rental Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <Label htmlFor="rego">Registration No.</Label>
              <Input
                id="rego"
                name="rego"
                value={formData.rego}
                onChange={handleChange}
                required
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="carModel">Car Model</Label>
              <Input
                id="carModel"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                required
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>
            <div >
              <Label htmlFor="driverId">Driver ID</Label>
              <Input
                id="driverId"
                name="driverId"
                checked={formData.driverId}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="rentPerWeek">Rent Per Week</Label>
              <Input
                id="rentPerWeek"
                name="rentPerWeek"
                type="number"
                value={formData.rentPerWeek}
                onChange={handleChange}
                required
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="receipt">Receipt</Label>
              <Input
                id="receipt"
                name="receipt"
                value={formData.receipt}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="amountReceiver">Amount Received</Label>
              <Input
                id="amountReceiver"
                name="amountReceiver"
                type="number"
                value={formData.amountReceiver}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="expense">Expense</Label>
              <Input
                id="expense"
                name="expense"
                type="number"
                value={formData.expense}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            <div>
              <Label htmlFor="carNumber">Car Number</Label>
              <Input
                id="carNumber"
                name="carNumber"
                value={formData.carNumber}
                onChange={handleChange}
                required
                className="max-w-sm"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="rented"
                name="rented"
                type="checkbox"
                checked={formData.rented}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <Label htmlFor="rented">Rented?</Label>
            </div>
            <div >
              <Label htmlFor="rentedDate">RentedDate</Label>
              <Input
                id="rentedDate"
                name="rentedDate"
                checked={formData.rentedDate}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>


            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="max-w-2xl"
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-48 flex items-center justify-center"
              >
                {loading && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
