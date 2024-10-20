import { prisma } from "../db.server";

export async function getQuotes() {
  return prisma.quote.findMany();
}

export async function getInquiries() {
  return prisma.inquiry.findMany();
}

export async function createQuote(quoteData) {
  return prisma.quote.create({
    data: quoteData,
  });
}

export async function createInquiry(inquiryData) {
  return prisma.inquiry.create({
    data: inquiryData,
  });
}