import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  LegacyCard,
  DataTable,
  Button,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getQuotes, getInquiries } from "../models/quote-inquiry.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const quotes = await getQuotes();
  const inquiries = await getInquiries();
  return json({ quotes, inquiries });
};

export default function Index() {
  const { quotes, inquiries } = useLoaderData();
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const handleQuoteView = useCallback(
    (quote) => () => setSelectedQuote(quote),
    []
  );

  const handleInquiryView = useCallback(
    (inquiry) => () => setSelectedInquiry(inquiry),
    []
  );

  const handleCloseModal = useCallback(() => {
    setSelectedQuote(null);
    setSelectedInquiry(null);
  }, []);

  const quoteRows = quotes.map((quote) => [
    quote.id,
    quote.productName,
    quote.customerName,
    quote.customerEmail,
    quote.customerPhone,
    <Button onClick={handleQuoteView(quote)}>View</Button>,
  ]);

  const inquiryRows = inquiries.map((inquiry) => [
    inquiry.id,
    inquiry.productName,
    inquiry.quantity,
    inquiry.shippingZip,
    inquiry.customerEmail,
    <Button onClick={handleInquiryView(inquiry)}>View</Button>,
  ]);

  return (
    <Page title="Quote and Inquiry Dashboard">
      <Layout>
        <Layout.Section>
          <LegacyCard title="Quotes" sectioned>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "text",
                "text",
                "text",
                "text",
              ]}
              headings={[
                "ID",
                "Product",
                "Customer Name",
                "Email",
                "Phone",
                "Action",
              ]}
              rows={quoteRows}
            />
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard title="Inquiries" sectioned>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "numeric",
                "text",
                "text",
                "text",
              ]}
              headings={[
                "ID",
                "Product",
                "Quantity",
                "Shipping ZIP",
                "Email",
                "Action",
              ]}
              rows={inquiryRows}
            />
          </LegacyCard>
        </Layout.Section>
      </Layout>

      {selectedQuote && (
        <Modal
          open={true}
          onClose={handleCloseModal}
          title="Quote Details"
          primaryAction={{
            content: "Close",
            onAction: handleCloseModal,
          }}
        >
          <Modal.Section>
            <TextContainer>
              <p>Product: {selectedQuote.productName}</p>
              <p>Customer Name: {selectedQuote.customerName}</p>
              <p>Email: {selectedQuote.customerEmail}</p>
              <p>Phone: {selectedQuote.customerPhone}</p>
              <p>Message: {selectedQuote.message}</p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}

      {selectedInquiry && (
        <Modal
          open={true}
          onClose={handleCloseModal}
          title="Inquiry Details"
          primaryAction={{
            content: "Close",
            onAction: handleCloseModal,
          }}
        >
          <Modal.Section>
            <TextContainer>
              <p>Product: {selectedInquiry.productName}</p>
              <p>Quantity: {selectedInquiry.quantity}</p>
              <p>Shipping ZIP: {selectedInquiry.shippingZip}</p>
              <p>Email: {selectedInquiry.customerEmail}</p>
              <p>Needed by: {selectedInquiry.neededBy}</p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}