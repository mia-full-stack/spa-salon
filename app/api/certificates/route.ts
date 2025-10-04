import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

async function generateCertificateNumber(db: any): Promise<string> {
  // Get the last certificate sorted by creation date
  const lastCertificate = await db
    .collection("certificates")
    .find({})
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  let nextNumber = 1;

  if (lastCertificate.length > 0 && lastCertificate[0].certificateNumber) {
    // Extract the number from the last certificate (e.g., "GSN-000002" -> 2)
    const lastNumber = Number.parseInt(
      lastCertificate[0].certificateNumber.split("-")[1],
      10
    );
    nextNumber = lastNumber + 1;
  }

  const paddedNumber = nextNumber.toString().padStart(6, "0");
  return `GSN-${paddedNumber}`;
}

export async function POST(request: NextRequest) {
  try {
    console.log(" Certificates API: Request received");

    const body = await request.json();
    const {
      type,
      service,
      duration,
      amount,
      currency,
      recipient,
      buyer,
      message,
      total,
      masterId,
      masterName,
    } = body;

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const certificateNumber = await generateCertificateNumber(db);

    // Save certificate order to database
    const certificateOrder = {
      certificateNumber,
      type,
      service,
      duration,
      amount,
      currency,
      recipient,
      buyer,
      message,
      total,
      masterId,
      masterName,
      createdAt: new Date().toISOString(),
      status: "pending", // Initial status is pending
    };

    await db.collection("certificates").insertOne(certificateOrder);

    console.log(
      " Certificates API: Certificate order saved:",
      certificateOrder
    );

    return NextResponse.json({
      success: true,
      message: "Certificate order saved successfully",
      certificateNumber,
    });
  } catch (error) {
    console.error(" Certificates API: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to save certificate order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log(" Certificates API: GET request received");

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all";
    const userEmail = searchParams.get("userEmail");

    const client = await clientPromise;
    const db = client.db("spa-salon");

    // Calculate date filter based on period
    let dateFilter: any = {};
    const now = new Date();

    if (period === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { createdAt: { $gte: startOfMonth.toISOString() } };
    } else if (period === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { createdAt: { $gte: startOfYear.toISOString() } };
    }

    if (userEmail) {
      dateFilter["buyer.email"] = userEmail;
    }

    const certificates = await db
      .collection("certificates")
      .find(dateFilter)
      .sort({ createdAt: -1 })
      .toArray();

    if (userEmail) {
      const userCertificates = certificates.map((cert) => ({
        certificateNumber: cert.certificateNumber,
        type: cert.type,
        service: cert.service,
        duration: cert.duration,
        amount: cert.amount,
        currency: cert.currency,
        total: cert.total,
        recipientName: cert.recipient?.name,
        recipientEmail: cert.recipient?.email,
        message: cert.message,
        createdAt: cert.createdAt,
        status: cert.status,
      }));

      return NextResponse.json({ certificates: userCertificates });
    }

    // Calculate statistics for admin
    const stats = {
      totalCertificates: certificates.length,
      totalRevenue: 0,
      byType: {
        service: 0,
        amount: 0,
      },
      byAmount: {} as Record<string, number>,
      byService: {} as Record<string, number>,
      certificates: certificates.map((cert) => ({
        _id: cert._id.toString(),
        certificateNumber: cert.certificateNumber,
        type: cert.type,
        service: cert.service,
        duration: cert.duration,
        amount: cert.amount,
        currency: cert.currency,
        total: cert.total,
        recipient: cert.recipient,
        buyer: cert.buyer,
        message: cert.message,
        createdAt: cert.createdAt,
        masterName: cert.masterName,
        status: cert.status,
      })),
    };

    certificates.forEach((cert) => {
      console.log(" Processing certificate:", {
        number: cert.certificateNumber,
        type: cert.type,
        service: cert.service,
        amount: cert.amount,
        total: cert.total,
      });

      // Count by type with validation
      if (cert.type === "service" || cert.type === "amount") {
        stats.byType[cert.type]++;
      } else {
        console.warn(
          " Certificate has invalid or missing type:",
          cert.certificateNumber,
          "Type:",
          cert.type
        );
      }

      const totalValue = Number.parseInt(
        cert.total?.toString().replace(/[^\d]/g, "") || "0",
        10
      );
      console.log(" Extracted total value:", totalValue, "from:", cert.total);
      stats.totalRevenue += totalValue;

      // Count by amount or service
      if (cert.type === "amount") {
        const amountKey = `${cert.amount} ${cert.currency}`;
        stats.byAmount[amountKey] = (stats.byAmount[amountKey] || 0) + 1;
      } else if (cert.type === "service") {
        const serviceKey = cert.service || "Unknown Service";
        stats.byService[serviceKey] = (stats.byService[serviceKey] || 0) + 1;
      }
    });

    console.log(" Certificates API: Stats calculated:", stats);

    return NextResponse.json({ stats, period });
  } catch (error) {
    console.error(" Certificates API: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate statistics" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    console.log(" Certificates API: PATCH request received");

    const body = await request.json();
    const { certificateId, status } = body;

    if (!certificateId || !status) {
      return NextResponse.json(
        { error: "Certificate ID and status are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("spa-salon");

    const result = await db.collection("certificates").updateOne(
      { _id: new ObjectId(certificateId) },
      {
        $set: {
          status,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Certificate not found" },
        { status: 404 }
      );
    }

    console.log(
      " Certificates API: Certificate status updated:",
      certificateId,
      "->",
      status
    );

    return NextResponse.json({
      success: true,
      message: "Certificate status updated successfully",
    });
  } catch (error) {
    console.error(" Certificates API: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to update certificate status" },
      { status: 500 }
    );
  }
}
