import type { Metadata } from "next"
import FeaturesPageClient from "./FeaturesPageClient"

export const metadata: Metadata = {
  title: "Features | TefiPay",
  description:
    "Explore TefiPay's innovative features including contactless payments, AI-powered fraud detection, biometric authentication, and multi-currency support.",
  keywords: [
    "contactless payments",
    "biometric authentication",
    "fraud detection",
    "multi-currency payments",
    "fintech features",
  ],
  alternates: {
    canonical: "/features",
  },
}

export default function FeaturesPage() {
  return <FeaturesPageClient />
}

