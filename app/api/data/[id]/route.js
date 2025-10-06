import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ✅ GET single car by ID
export async function GET(req, context) {
  try {
    const { params } = await context; // ⬅️ await params
    const car = await prisma.car.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}

// ✅ UPDATE car by ID
export async function PUT(req, context) {
  try {
    const { params } = await context; // ⬅️ await params
    const body = await req.json();

    const updatedCar = await prisma.car.update({
      where: { id: parseInt(params.id) },
      data: {
        rego: body.rego,
        carModel: body.carModel,
        driverName: body.driverName,
        rentPerWeek: parseFloat(body.rentPerWeek) || null,
        receipt: body.receipt,
        amountReceiver: parseFloat(body.amountReceiver) || null,
        expense: parseFloat(body.expense) || null,
        description: body.description,
        carNumber: body.carNumber,
        rented: body.rented,
        rentedDate: body.rentedDate,
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}

// ✅ DELETE car by ID
export async function DELETE(req, context) {
  try {
    const { params } = await context; // ⬅️ await params
    await prisma.car.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
