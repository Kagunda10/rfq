import { json } from "@remix-run/node";
import { sendEmail } from "../utils/email.server";

export async function action({ request }) {
  const formData = await request.formData();
  const { productName, customerEmail } = Object.fromEntries(formData);

  try {
    // Store notification request in database (implementation not shown)
    // When product becomes available, you would check this database and send emails

    // For demonstration, we'll send an immediate confirmation email
    await sendEmail({
      to: customerEmail,
      subject: "Product Availability Notification Confirmation",
      body: `We'll notify you when ${productName} becomes available.`,
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error processing notification request:", error);
    return json({ success: false, error: "Failed to process notification request" }, { status: 500 });
  }
}