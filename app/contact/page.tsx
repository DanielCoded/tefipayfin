import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us | TefiPay",
  description:
    "Have questions about TefiPay? Contact our team for support, partnership opportunities, or general inquiries about our contactless payment solutions.",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}

