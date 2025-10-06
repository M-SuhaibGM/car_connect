import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req, context) {
  const { params } = await context;
  const driver = await prisma.drivers.findUnique({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json(driver);
}

export async function PUT(req, context) {
  const { params } = await context;
  const body = await req.json();
  const driver = await prisma.drivers.update({
    where: { id: parseInt(params.id) },
    data: body,
  });
  return NextResponse.json(driver);
}

export async function DELETE(req, context) {
  const { params } = await context;
  await prisma.drivers.delete({
    where: { id: parseInt(params.id) },
  });
  return NextResponse.json({ message: "Driver deleted" });
}
