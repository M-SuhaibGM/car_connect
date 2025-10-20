import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        const { idNumber } = await req.json();

        if (!idNumber) {
            return NextResponse.json({ success: false, error: "Missing ID number" }, { status: 400 });
        }

        // ✅ Find driver by ID number
        const driver = await prisma.drivers.findFirst({
            where: { idNumber },
        });

        if (!driver) {
            return NextResponse.json({ success: false, error: "Driver not found" }, { status: 404 });
        }

        // ✅ Return driver data for redirect
        return NextResponse.json({ success: true, driver });
    } catch (error) {
        console.error("Error verifying driver:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
