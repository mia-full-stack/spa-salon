import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    console.log(" Bookings API GET: Request received");
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    const date = searchParams.get("date");
    console.log(" Bookings API GET: Query params:", { userEmail, date });

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const query: any = {};
    if (userEmail) {
      query.userEmail = userEmail;
    }
    if (date) {
      query.date = date;
    }

    console.log(" Bookings API GET: Fetching bookings with query:", query);
    const bookings = await db.collection("bookings").find(query).toArray();
    console.log(" Bookings API GET: Found bookings:", bookings.length);

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(" Bookings API GET: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(" Bookings API POST: Request received");
    const body = await request.json();
    console.log(" Bookings API POST: Request body:", body);

    const {
      date,
      time,
      service,
      userName,
      userEmail,
      userPhone,
      duration,
      price,
      master,
    } = body;

    // Validate required fields
    if (
      !date ||
      !time ||
      !service ||
      !userName ||
      !userEmail ||
      !userPhone ||
      !master
    ) {
      console.log(" Bookings API POST: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(" Bookings API POST: Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("spa-salon");
    console.log(" Bookings API POST: Connected to database");

    console.log(" Bookings API POST: Checking time slot availability...");
    const existingBooking = await db.collection("bookings").findOne({
      date,
      time,
      master,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      console.log(
        " Bookings API POST: Time slot already booked for this master"
      );
      return NextResponse.json(
        { error: "Time slot is already booked for this master" },
        { status: 409 }
      );
    }

    console.log(
      " Bookings API POST: Checking if this is first booking for user..."
    );
    const userBookings = await db
      .collection("bookings")
      .find({ userEmail })
      .toArray();
    const isFirstBooking = userBookings.length === 0;

    if (isFirstBooking) {
      console.log(
        " Bookings API POST: First booking detected - assigning preferred master:",
        master
      );
      await db
        .collection("users")
        .updateOne({ email: userEmail }, { $set: { preferredMaster: master } });
      console.log(" Bookings API POST: Preferred master assigned successfully");
    } else {
      console.log(
        " Bookings API POST: Not first booking - preferred master already assigned"
      );
    }

    const booking = {
      date,
      time,
      service,
      userName,
      userEmail,
      userPhone,
      duration: duration || 60,
      price: price || 0,
      master,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    console.log(" Bookings API POST: Creating booking:", booking);
    const result = await db.collection("bookings").insertOne(booking);
    console.log(
      " Bookings API POST: Booking created with ID:",
      result.insertedId
    );

    return NextResponse.json({
      success: true,
      bookingId: result.insertedId,
      booking,
    });
  } catch (error) {
    console.error(" Bookings API POST: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log(" Bookings API DELETE: Request received");
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("id");
    console.log(" Bookings API DELETE: Booking ID:", bookingId);

    if (!bookingId) {
      console.log(" Bookings API DELETE: Booking ID is required");
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    console.log(" Bookings API DELETE: Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("spa-salon");
    console.log(" Bookings API DELETE: Connected to database");

    console.log(" Bookings API DELETE: Cancelling booking...");
    const result = await db
      .collection("bookings")
      .updateOne({ _id: bookingId }, { $set: { status: "cancelled" } });
    console.log(" Bookings API DELETE: Booking cancellation result:", result);

    if (result.matchedCount === 0) {
      console.log(" Bookings API DELETE: Booking not found");
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(" Bookings API DELETE: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}
