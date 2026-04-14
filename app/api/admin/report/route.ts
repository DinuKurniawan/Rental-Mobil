import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: true,
            car: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Generate CSV Header
    let csv = "Order ID,Date,Customer,Car,Amount,Status,Method\n";

    // Generate CSV Rows
    payments.forEach((p) => {
      const date = format(new Date(p.createdAt), "yyyy-MM-dd HH:mm");
      const customer = p.booking.user.name?.replace(/,/g, "") || "N/A";
      const car = p.booking.car.name.replace(/,/g, "");
      const amount = p.amount;
      const status = p.status;
      const method = p.method || "N/A";
      const orderId = p.orderId;

      csv += `${orderId},${date},${customer},${car},${amount},${status},${method}\n`;
    });

    // Return CSV as a download
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=DriveKita-Report-${format(new Date(), "yyyy-MM-dd")}.csv`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
