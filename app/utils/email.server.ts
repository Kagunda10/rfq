import { Shopify } from "@shopify/shopify-api";

export async function sendEmail({ to, subject, body }) {
  const client = new Shopify.Clients.Rest(process.env.SHOP, process.env.SHOPIFY_ACCESS_TOKEN);

  try {
    await client.post({
      path: "emails/send",
      data: {
        to,
        subject,
        body,
        from: process.env.SHOP_EMAIL,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}