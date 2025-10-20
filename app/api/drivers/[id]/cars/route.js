import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {
    try {

        const session = await getServerSession(authOptions);


        if (!session) {
            return NextResponse.json(
                { success: false, error: "Access denied: Admins only" },
                { status: 403 }
            );
        }
        const { id } = await params
        const cars = await prisma.car.findMany({
            where: { driverId: id },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(cars);
    } catch (error) {
        console.error("Error fetching driver cars:", error);
        return NextResponse.json({ error: "Failed to fetch driver cars" }, { status: 500 });
    }
}
