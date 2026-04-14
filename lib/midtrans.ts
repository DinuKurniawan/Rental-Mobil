import midtransClient from 'midtrans-client';

// Defensive key loading to prevent whitespace/newline issues from environment variables
const serverKey = (process.env.MIDTRANS_SERVER_KEY || '').trim();
const clientKey = (process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '').trim();
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';

if (!serverKey) {
  console.warn("MIDTRANS_SERVER_KEY is not defined in environment variables.");
}

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});
