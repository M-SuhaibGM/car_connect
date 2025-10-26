"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { UploadDropzone } from "../../../../lib/uploadthing";
import axios from "axios";
import { toast } from "sonner";
import { Star } from "lucide-react";
import Image from "next/image";

export default function DriverReviewPage() {
  const { id } = useParams(); // driver ID
  const router = useRouter();

  const [carImageUrl, setCarImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !carImageUrl || rating === 0) {
      toast.error("Please fill all fields before submitting");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/reviews/create", {
        driverId: id,
        description,
        rating,
        carImageUrl,
      });

      if (res.data.success) {
        toast.success("Review submitted successfully!");
        router.push("/home");
      } else {
        toast.error("Failed to submit review!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88.7vh] flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Write Your Review
        </h2>


        {/* ✅ Upload Car Image */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Upload Car Image</h4>

          <UploadDropzone
            endpoint="driverImage"
            onClientUploadComplete={(res) => {
              setCarImageUrl(res[0].url);
              toast.success("Car image uploaded!");
            }}
            onUploadError={(error) => {
              toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
              container: "border-2 border-dashed border-gray-300 rounded-md p-6",
              button: "bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700",
              allowedContent: "text-gray-500 text-sm mt-1",
            }}
          />

          {carImageUrl && (
            <div className="relative w-full h-30 mt-3">

              <Image
                src={carImageUrl}
                alt="Car"
                fill
                className="object-contain  absolute rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        {/* ✅ Rating Section */}
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Rate your experience</h4>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                size={30}
                className={`cursor-pointer ${num <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                onClick={() => setRating(num)}
              />
            ))}
          </div>
        </div>

        {/* ✅ Description */}
        <textarea
          placeholder="Write your review..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows="4"
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-2 rounded-md font-semibold text-white ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
