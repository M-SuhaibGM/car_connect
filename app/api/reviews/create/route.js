import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
    try {
        const body = await req.json();
        const { driverId, description, rating, carImageUrl } = body;

        // ✅ Fetch driver details
        const driver = await prisma.drivers.findUnique({
            where: { id: driverId },
        });

        if (!driver)
            return NextResponse.json({ success: false, error: "Driver not found" });

        // ✅ Create review
        const review = await prisma.driverReview.create({
            data: {
                driverId,
                driverName: driver.name,
                driverImageUrl: driver.imageUrl,
                carImageUrl,
                description,
                rating: parseInt(rating),
            },
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create review" },
            { status: 500 }
        );
    }
}
