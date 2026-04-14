import { snap } from "@/lib/midtrans";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id, name, price, quantity, customerDetails } = await request.json();

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
  } catch (error) {
    console.error("Error creating Midtrans transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}
