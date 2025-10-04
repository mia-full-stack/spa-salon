import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const user = await db.collection("users").findOne({ email });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ isAdmin: false }, { status: 403 });
    }

    return NextResponse.json({ isAdmin: true });
  } catch (error) {
    console.error(" Error checking admin status:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
