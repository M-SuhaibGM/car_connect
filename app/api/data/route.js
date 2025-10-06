import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
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
        rentedDate: body.rentedDate
      },
    });

    return NextResponse.json({ success: true, car });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ success: false, error: "Failed to save data" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}