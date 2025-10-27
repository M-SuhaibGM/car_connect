import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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
    const { id } = await params; // ✅ safely await context

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {

    const session = await getServerSession(authOptions);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // 👈 admin email from .env

    if (!session || session.user?.email !== adminEmail) {
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }
    const { id } = await params;
    const body = await req.json();

    const updatedCar = await prisma.car.update({
      where: { id },
      data: {
        rego: body.rego,
        carModel: body.carModel,
        driverName: body.driverName,
        rentPerWeek: body.rentPerWeek ? parseFloat(body.rentPerWeek) : null,
        receipt: body.receipt,
        amountReceiver: body.amountReceiver
          ? parseFloat(body.amountReceiver)
          : null,
        expense: body.expense ? parseFloat(body.expense) : null,
        description: body.description,
        carNumber: body.carNumber,
        rented: body.rented,
        rentedDate: body.rentedDate,
        driverId: body.driverId,
        imageUrl: body.imageUrl,
        week: parseInt(body.week),
        profit: body.profit,
        loss: body.loss,
        receiptImageUrl: body.receiptImageUrl
        
      },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {

    const session = await getServerSession(authOptions);

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // 👈 admin email from .env

    if (!session || session.user?.email !== adminEmail) {
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }
    const { id } = await params;

    await prisma.car.delete({ where: { id } });

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
  }
}
