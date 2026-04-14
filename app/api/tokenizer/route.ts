import { snap } from "@/lib/midtrans";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, name, price, quantity, customerDetails } = await request.json();

    // Diagnostic logging (masked)
    const sk = (process.env.MIDTRANS_SERVER_KEY || '').trim();
    console.log(`[Midtrans Diagnostic] Server Key present: ${sk.length > 0}, Length: ${sk.length}, Starts with: ${sk.substring(0, 10)}...`);
    console.log(`[Midtrans Diagnostic] Production Mode: ${process.env.MIDTRANS_IS_PRODUCTION}`);

    const parameter = {
      transaction_details: {
        order_id: `DK-${Date.now()}`,
        gross_amount: price * quantity,
      },
      item_details: [
        {
          id: id,
          price: price,
          quantity: quantity,
          name: name,
        },
      ],
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
      },
    };

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("Error creating Midtrans transaction:", error);
    // Return more detailed error for debugging (remove in production later)
    return NextResponse.json({ 
      error: "Failed to create transaction", 
      details: error.message || "Unknown error",
      midtransError: error.ApiResponse || null
    }, { status: 500 });
  }
}
