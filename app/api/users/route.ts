import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    console.log(" Users API: Request received");
    const body = await request.json();
    console.log(" Users API: Request body:", { ...body, password: "***" });

    const { action, email, password, name, phone } = body;

    console.log(" Users API: Connecting to MongoDB...");
    const client = await clientPromise;
    const db = client.db("spa-salon");
    console.log(" Users API: Connected to database");

    if (action === "register") {
      console.log(" Users API: Checking for existing user...");
      const existingUser = await db.collection("users").findOne({ email });

      if (existingUser) {
        console.log(" Users API: User already exists");
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      console.log(" Users API: Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        email,
        password: hashedPassword,
        name: name || "",
        phone: phone || "",
        role: email === "mia.germ888@gmail.com" ? "admin" : "user",
        preferredMaster: null, // No master assigned until first booking
        createdAt: new Date().toISOString(),
      };

      console.log(" Users API: Inserting user into database...");
      const result = await db.collection("users").insertOne(user);
      console.log(
        " Users API: User created successfully with ID:",
        result.insertedId
      );

      return NextResponse.json({
        success: true,
        user: { email, name, phone, role: user.role },
      });
    }

    if (action === "login") {
      console.log(" Users API: Finding user for login...");
      const user = await db.collection("users").findOne({ email });
      if (!user) {
        console.log(" Users API: User not found");
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      console.log(" Users API: Verifying password...");
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log(" Users API: Invalid password");
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }

      console.log(" Users API: Login successful");
      return NextResponse.json({
        success: true,
        user: {
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role || "user",
        },
      });
    }

    console.log(" Users API: Invalid action:", action);
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(" Users API: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const result = await db
      .collection("users")
      .updateOne({ email }, { $set: { name, phone } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(" Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
