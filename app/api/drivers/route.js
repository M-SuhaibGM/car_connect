import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
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
    const body = await req.json();
    console.log(body)
    const driver = await prisma.drivers.create({ data: body });
    return NextResponse.json(driver);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
