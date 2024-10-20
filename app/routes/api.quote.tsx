import { json } from "@remix-run/node";
import { createQuote } from "../models/quote-inquiry.server";
import { sendEmail } from "../utils/email.server";

export async function action({ request }) {
  const formData = await request.formData();
  const quoteData = Object.fromEntries(formData);

  try {
    const quote = await createQuote(quoteData);

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Quote Request",
      body: `New quote request for ${quoteData.productName} from ${quoteData.customerName}`,
    });

    return json({ success: true, quote });
  } catch (error) {
    console.error("Error creating quote:", error);
    return json({ success: false, error: "Failed to create quote" }, { status: 500 });
  }
}