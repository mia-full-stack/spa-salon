import { type NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    console.log(" Masters Stats API: Request received");

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // month, year, all

    const client = await clientPromise;
    const db = client.db("spa-salon");

    // Calculate date filter based on period
    let dateFilter = {};
    const now = new Date();

    if (period === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { date: { $gte: startOfMonth.toISOString().split("T")[0] } };
    } else if (period === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateFilter = { date: { $gte: startOfYear.toISOString().split("T")[0] } };
    }

    let certificateDateFilter: any = {};
    if (period === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      certificateDateFilter = {
        createdAt: { $gte: startOfMonth.toISOString() },
      };
    } else if (period === "year") {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      certificateDateFilter = {
        createdAt: { $gte: startOfYear.toISOString() },
      };
    }

    console.log(" Masters Stats API: Fetching users with preferred master...");
    const usersWithMaster = await db
      .collection("users")
      .find({ preferredMaster: { $exists: true, $ne: null } })
      .toArray();
    console.log(
      " Masters Stats API: Found users with preferred master:",
      usersWithMaster.length
    );

    // Get all bookings grouped by master with date filter
    console.log(
      " Masters Stats API: Fetching bookings with filter:",
      dateFilter
    );
    const bookings = await db
      .collection("bookings")
      .find({ status: { $ne: "cancelled" }, ...dateFilter })
      .toArray();
    console.log(" Masters Stats API: Found bookings:", bookings.length);

    console.log(
      " Masters Stats API: Fetching certificates with filter:",
      certificateDateFilter
    );
    const certificates = await db
      .collection("certificates")
      .find(certificateDateFilter)
      .toArray();
    console.log(" Masters Stats API: Found certificates:", certificates.length);

    // Service prices mapping
    const servicePrices: Record<string, number> = {
      "Классический массаж": 800,
      "Лимфодренажный массаж": 1200,
      "Спортивный массаж": 1000,
      "Массаж лица": 600,
    };

    // Calculate statistics
    const stats = {
      "Лариса Павлова": {
        totalClients: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalCertificates: 0,
        certificateRevenue: 0,
        clients: [] as string[],
        services: {} as Record<
          string,
          { count: number; duration: string; revenue: number }
        >,
      },
      "Марина Пакулова": {
        totalClients: 0,
        totalBookings: 0,
        totalRevenue: 0,
        totalCertificates: 0,
        certificateRevenue: 0,
        clients: [] as string[],
        services: {} as Record<
          string,
          { count: number; duration: string; revenue: number }
        >,
      },
    };

    console.log(" Masters Stats API: Counting clients by preferred master...");
    usersWithMaster.forEach((user) => {
      const master = user.preferredMaster;
      if (stats[master]) {
        stats[master].totalClients++;
        stats[master].clients.push(user.email);
        console.log(
          " Masters Stats API: Added client",
          user.email,
          "to master",
          master
        );
      }
    });

    // Count bookings by master and calculate revenue
    bookings.forEach((booking) => {
      const master = booking.master;
      if (stats[master]) {
        stats[master].totalBookings++;

        const service = booking.service;
        const duration = booking.duration;
        const price = servicePrices[service] || 0;

        stats[master].totalRevenue += price;

        if (!stats[master].services[service]) {
          stats[master].services[service] = { count: 0, duration, revenue: 0 };
        }
        stats[master].services[service].count++;
        stats[master].services[service].revenue += price;
      }
    });

    certificates.forEach((cert) => {
      const masterName = cert.masterName;
      if (stats[masterName]) {
        stats[masterName].totalCertificates++;

        // Extract numeric value from total (e.g., "1150 ₴" -> 1150)
        const totalValue =
          Number.parseInt(cert.total.replace(/\D/g, ""), 10) || 0;
        stats[masterName].certificateRevenue += totalValue;
        stats[masterName].totalRevenue += totalValue;
      }
    });

    console.log(" Masters Stats API: Stats calculated:", stats);

    return NextResponse.json({ stats, period });
  } catch (error) {
    console.error(" Masters Stats API: Error occurred:", error);
    return NextResponse.json(
      { error: "Failed to fetch master statistics" },
      { status: 500 }
    );
  }
}
