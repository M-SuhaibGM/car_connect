"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Pencil, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

// 💡 Import the Skeleton component
import { Skeleton } from "@/components/ui/skeleton";

// --- Skeleton Card Component ---
const ReviewCardSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm w-[350px] md:w-[500px] p-6 animate-pulse">
    {/* Profile + Info Skeleton */}
    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
      <Skeleton className="h-[70px] w-[70px] rounded-full mb-2" />
      <Skeleton className="h-4 w-20 mb-1" />
      <Skeleton className="h-3 w-16" />
      <div className="flex justify-center md:justify-start text-yellow-400 mt-1">
        {/* Five stars for rating placeholder */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" className="opacity-50" />
        ))}
      </div>
    </div>

    {/* Review Content Skeleton */}
    <div className="flex-1 w-full">
      <Skeleton className="h-[180px] w-full rounded-lg mb-3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
      </div>
    </div>
  </div>
);
// -------------------------------

export default function LandingPage() {
  const [driverIdNumber, setDriverIdNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  // 💡 Add a new state for the initial data fetching status
  const [isFetchingReviews, setIsFetchingReviews] = useState(true);
  const router = useRouter();
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper: truncate description
  const truncateText = (text, wordLimit = 20) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };
  // ✅ Fetch all reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews");
        if (res.data.success) {
          setReviews(res.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        // 💡 Set fetching state to false after attempt
        setIsFetchingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  // ✅ Verify driver and redirect
  const handleReviewAccess = async () => {
    // ... (rest of the handleReviewAccess function remains the same)
    if (!driverIdNumber.trim()) {
      toast.error("Please enter your Driver ID Number");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/verify-driver", {
        idNumber: driverIdNumber,
      });

      if (res.data.success && res.data.driver) {
        router.push(`/review/${res.data.driver.id}`);
        toast.success("Driver verified successfully!");
      } else {
        toast.error("Driver not found!");
      }
    } catch (error) {
      console.error("Error verifying driver:", error);
      toast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header
        className="flex-1 flex flex-col justify-center items-center text-center bg-cover bg-center relative min-h-[90vh]"
        style={{
          backgroundImage: "url('/car.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Rent Your Dream Car in AUSTRALIA
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Affordable rides for every journey — Drive BYD, Camry, Swift, Rav4
          </p>
          <Link
            href="/available"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ✅ Write Review Section */}
      <section className="bg-gray-100 py-12 text-center flex flex-col items-center">
        <Pencil className="w-10 h-10 text-blue-600 mb-4" />
        <h3 className="text-2xl font-bold mb-2">Driver Review</h3>
        <p className="text-gray-600 mb-4">
          Only drivers can write reviews. Enter your Driver ID Number below:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Enter your Driver ID Number"
            value={driverIdNumber}
            onChange={(e) => setDriverIdNumber(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleReviewAccess}
            disabled={loading}
            className={`px-5 py-2 rounded-md text-white font-semibold transition ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Checking..." : "Write Review"}
          </button>
        </div>
      </section>

      {/* ✅ Reviews Section */}
      <section className="py-12 bg-gray-200">
        <h3 className="text-center text-3xl font-bold mb-8 text-gray-800">
          What Drivers Say
        </h3>

        <div className="overflow-x-auto no-scrollbar px-6">
          <div className="flex  flex-wrap justify-center gap-6  w-full">
            {/* 💡 Conditional rendering for loading, no reviews, or reviews */}
            {isFetchingReviews ? (
              // Show two skeleton cards while fetching
              <>
                <ReviewCardSkeleton />
                <ReviewCardSkeleton />
              </>
            ) : reviews.length > 0 ? (
              // Show actual reviews when available
              <div className="">
                {reviews.map((review) => {
                  const isExpanded = expanded[review.id];
                  const description = review.description || "No description provided.";
                  const displayText = isExpanded ? description : truncateText(description);

                  return (
                    <div
                      key={review.id}
                      className="flex flex-col md:flex-row  w-screen pb-3 items-center justify-between md:items-start gap-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300   p-6"
                    >
                      {/* Profile + Info */}
                      <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
                        <Image
                          src={review.driverImageUrl || "/driver.jpg"}
                          alt={review.driverName || "Driver"}
                          width={70}
                          height={70}
                          className="rounded-full w-full object-cover mb-2"
                        />
                        <h4 className="font-semibold text-gray-800">
                          {review.driverName || "Anonymous"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex justify-center md:justify-start text-yellow-400 mt-1">
                          {Array.from({ length: review.rating || 0 }).map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                          ))}
                        </div>
                      </div>


                      {/* Review Content */}
                      <div className="flex-1 flex flex-col items-center md:items-start">

                        <div className="justify-end ">
                          {review.carImageUrl && (
                            <div className="relative w-[200px] h-[180px] mb-3">
                              <Image
                                src={review.carImageUrl}
                                alt="Car"
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm italic text-center md:text-left">
                          “{displayText}”
                        </p>

                        {/* Show more / Hide toggle */}
                        {description.split(" ").length > 20 && (
                          <button
                            onClick={() => toggleExpand(review.id)}
                            className="text-blue-500 text-xs mt-1 hover:underline"
                          >
                            {isExpanded ? "Hide" : "Show more"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            ) : (
              // Show 'No reviews yet' message if fetching is complete and no reviews exist
              <p className="text-center text-gray-600 w-full">No reviews yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-500 text-white py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          <p className="text-gray-100 mb-4 md:mb-0">
            © {new Date().getFullYear()} NexaRent | Powered by Rao Waleed Nisar
          </p>

          <div className="flex space-x-6 items-center">
            <a
              href="https://wa.me/923256800084"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:text-green-400"
            >
              <Phone className="w-5 h-5" />
              <span>+61 424 956 011</span>
            </a>
            <a
              href="mailto:waleedcars@gmail.com"
              className="flex items-center space-x-2 hover:text-red-400"
            >
              <Mail className="w-5 h-5" />
              <span>Majidsaleem884@gmail.com</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}