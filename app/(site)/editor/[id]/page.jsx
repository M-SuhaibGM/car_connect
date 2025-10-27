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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";

export default function EditorPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const [formData, setFormData] = useState({
    rego: "",
    driverId: "",
    carModel: "",
    driverName: "",
    rentPerWeek: "",
    receipt: "",
    receiptImageUrl: "", // ✅ added new field
    amountReceiver: "",
    expense: "",
    profit: "",
    loss: "",
    description: "",
    carNumber: "",
    rented: false,
    rentedDate: "",
    imageUrl: "",
    week: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await axios.get(`/api/data/${id}`);
        const car = res.data;
        setFormData({
          rego: car.rego || "",
          driverId: car.driverId || "",
          carModel: car.carModel || "",
          driverName: car.driverName || "",
          rentPerWeek: car.rentPerWeek ?? "",
          receipt: car.receipt || "",
          receiptImageUrl: car.receiptImageUrl || "", // ✅ load existing image if any
          amountReceiver: car.amountReceiver ?? "",
          expense: car.expense ?? "",
          profit: car.profit ?? "",
          loss: car.loss ?? "",
          description: car.description || "",
          carNumber: car.carNumber || "",
          rented: car.rented ?? false,
          rentedDate: car.rentedDate || "",
          imageUrl: car.imageUrl || "",
          week: car.week || "",
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
      router.push(`/${page}`);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update car.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[88.8vh]">
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
        objectFit: "cover",
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
            {/* Registration */}
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

            {/* Car Model */}
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

            {/* Driver Name */}
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

            {/* Driver ID */}
            <div>
              <Label htmlFor="driverId">Driver ID</Label>
              <Input
                id="driverId"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            {/* Week */}
            <div>
              <Label htmlFor="week">Week</Label>
              <select
                id="week"
                name="week"
                value={formData.week}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full max-w-sm"
              >
                <option value="">Select Week</option>
                <option value="1">Week 1</option>
                <option value="2">Week 2</option>
                <option value="3">Week 3</option>
                <option value="4">Week 4</option>
              </select>
            </div>

            {/* Rent Per Week */}
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

            {/* Receipt */}
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

            {/* ✅ Receipt Image Upload */}
            <div className="md:col-span-2">
              <Label>Receipt Image</Label>
              <UploadDropzone
                endpoint="receiptImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setFormData((prev) => ({
                      ...prev,
                      receiptImageUrl: res[0].url,
                    }));
                    toast.success("Receipt image uploaded!");
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  container:
                    "border-2 border-dashed border-gray-300 rounded-md p-6",
                  button:
                    "bg-green-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-green-700",
                  allowedContent: "text-gray-500 text-sm mt-1",
                }}
              />
              {formData.receiptImageUrl && (
                <img
                  src={formData.receiptImageUrl}
                  alt="Receipt"
                  className="mt-3 rounded-md w-40 h-28 object-cover border"
                />
              )}
            </div>

            {/* Amount Receiver */}
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

            {/* Expense */}
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

            {/* Profit */}
            <div>
              <Label htmlFor="profit">Profit</Label>
              <Input
                id="profit"
                name="profit"
                type="number"
                value={formData.profit}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            {/* Loss */}
            <div>
              <Label htmlFor="loss">Loss</Label>
              <Input
                id="loss"
                name="loss"
                type="number"
                value={formData.loss}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            {/* Car Number */}
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

            {/* Rented */}
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

            {/* Rented Date */}
            <div>
              <Label htmlFor="rentedDate">Rented Date</Label>
              <Input
                id="rentedDate"
                name="rentedDate"
                type="text"
                value={formData.rentedDate}
                onChange={handleChange}
                className="max-w-sm"
              />
            </div>

            {/* Car Image */}
            <div className="md:col-span-2">
              <Label>Car Image</Label>
              <UploadDropzone
                endpoint="carImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]?.url) {
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: res[0].url,
                    }));
                    toast.success("Car image uploaded!");
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
                appearance={{
                  container:
                    "border-2 border-dashed border-gray-300 rounded-md p-6",
                  button:
                    "bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700",
                  allowedContent: "text-gray-500 text-sm mt-1",
                }}
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Car"
                  className="mt-3 rounded-md w-40 h-28 object-cover border"
                />
              )}
            </div>

            {/* Description */}
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

            {/* Submit */}
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
