import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("spa-salon");

    const reviews = await db
      .collection("reviews")
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(" Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userName, userEmail, rating, comment, service } = body;

    if (!userName || !userEmail || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const review = {
      userName,
      userEmail,
      rating: Number(rating),
      comment,
      service: service || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("reviews").insertOne(review);

    return NextResponse.json({
      success: true,
      reviewId: result.insertedId,
    });
  } catch (error) {
    console.error(" Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
