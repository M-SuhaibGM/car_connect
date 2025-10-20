import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req, { params }) {

  const session = await getServerSession(authOptions);
 // 👈 admin email from .env

  if (!session ) {
    return NextResponse.json(
      { success: false, error: "Access denied: Admins only" },
      { status: 403 }
    );
  }
  const { id } = await params;
  const driver = await prisma.drivers.findUnique({
    where: { id },
  });
  return NextResponse.json(driver);
}

export async function PUT(req, { params }) {


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
  const driver = await prisma.drivers.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(driver);
}

export async function DELETE(req, { params }) {


  const session = await getServerSession(authOptions);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL; // 👈 admin email from .env

  if (!session || session.user?.email !== adminEmail) {
    return NextResponse.json(
      { success: false, error: "Access denied: Admins only" },
      { status: 403 }
    );
  }
  const { id } = await params;
  await prisma.drivers.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Driver deleted" });
}
