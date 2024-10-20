import { json } from "@remix-run/node";
import { createInquiry } from "../models/quote-inquiry.server";
import { sendEmail } from "../utils/email.server";

export async function action({ request }) {
  const formData = await request.formData();
  const inquiryData = Object.fromEntries(formData);

  try {
    const inquiry = await createInquiry(inquiryData);

    // Send email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Product Inquiry",
      body: `New inquiry for ${inquiryData.quantity} units of ${inquiryData.productName}`,
    });

    return json({ success: true, inquiry });
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return json({ success: false, error: "Failed to create inquiry" }, { status: 500 });
  }
}