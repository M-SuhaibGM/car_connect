import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = await params;
  const driver = await prisma.drivers.findUnique({
    where: { id },
  });
  return NextResponse.json(driver);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const driver = await prisma.drivers.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(driver);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  await prisma.drivers.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Driver deleted" });
}
