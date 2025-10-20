import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {

    const session = await getServerSession(authOptions);

    if (!session ) {
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }
    const drivers = await prisma.drivers.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(drivers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // 👈 admin email from .env

    if (!session || session.user?.email !== adminEmail) {
      return NextResponse.json(
        { success: false, error: "Access denied: Admins only" },
        { status: 403 }
      );
    }
    const body = await req.json();
    const driver = await prisma.drivers.create({ data: body });
    return NextResponse.json(driver);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
