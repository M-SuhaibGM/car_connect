import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 🛑 Create Car (Only for Authenticated Users)
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const car = await prisma.car.create({
      data: {
        rego: body.rego,
        carModel: body.carModel,
        driverName: body.driverName,
        rentPerWeek: parseFloat(body.rentPerWeek),
        receipt: body.receipt,
        amountReceiver: parseFloat(body.amountReceiver),
        expense: parseFloat(body.expense),
        description: body.description,
        carNumber: body.carNumber,
        rented: Boolean(body.rented),
        rentedDate: body.rentedDate,
        driverId: body.driverId,
      },
    });
    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save data" },
      { status: 500 }
    );
  }
}

// 🛑 Get Cars (Only for Authenticated Users)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}
