import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const reviews = await prisma.driverReview.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch reviews" });
    }
}
