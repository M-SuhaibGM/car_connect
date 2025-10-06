"use client";

import { useState, useEffect } from "react";
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
import { useParams, useRouter } from "next/navigation";

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    rego: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await axios.get(`/api/data/${id}`);
        const car = res.data;

        // normalize nulls → empty string
        setFormData({
          rego: car.rego || "",
          carModel: car.carModel || "",
          driverName: car.driverName || "",
          rentPerWeek: car.rentPerWeek ?? "",       // number field
          receipt: car.receipt || "",
          amountReceiver: car.amountReceiver ?? "", // number field
          expense: car.expense ?? "",               // number field
          description: car.description || "",
          carNumber: car.carNumber || "",
          rented: car.rented ?? false,
          rentedDate: car.rentedDate || "",
        });
      } catch (error) {
        console.error("Error fetching car:", error);
        toast.error("Failed to load car data");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCar();
  }, [id]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/api/data/${id}`, formData);
      toast.success("Car updated successfully!");
      router.push("/rented"); // redirect back
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update car.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div
      className="flex justify-center bg-gray-50 p-1"
      style={{
        backgroundImage: "url('/car.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "90vh",
        width: "100%",
      }}
    >
      <Card className="w-full max-w-3xl shadow-lg h-[85vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Edit Car Details
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
              />
            </div>

            <div>
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
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
              />
            </div>

            <div>
              <Label htmlFor="receipt">Receipt</Label>
              <Input
                id="receipt"
                name="receipt"
                value={formData.receipt}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="amountReceiver">Amount Receiver</Label>
              <Input
                id="amountReceiver"
                name="amountReceiver"
                type="number"
                value={formData.amountReceiver}
                onChange={handleChange}
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

            <div>
              <Label htmlFor="rentedDate">Rented Date</Label>
              <Input
                id="rentedDate"
                name="rentedDate"
                value={formData.rentedDate || ""}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <Button
                type="submit"
                disabled={saving}
                className="w-48 flex items-center justify-center"
              >
                {saving && <Loader2 className="animate-spin mr-2 h-5 w-5" />}
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
