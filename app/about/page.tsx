import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Us | TefiPay",
  description:
    "Learn about TefiPay's mission to revolutionize contactless payments in Africa and meet the team behind this innovative fintech solution.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}

