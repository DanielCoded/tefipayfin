import { Lexend } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React
import Script from "next/script"
import type { Metadata } from "next"

const lexend = Lexend({ subsets: ["latin"] })

// Update the title in the metadata object
export const metadata: Metadata = {
  metadataBase: new URL("https://tefipay.com"),
  title: {
    default: "TefiPay | Revolutionizing Contactless Payments in Africa",
    template: "%s | TefiPay",
  },
  description:
    "TefiPay is a revolutionary fintech platform enabling seamless contactless payments across Africa. Experience secure, instant transactions with our cutting-edge payment solution.",
  keywords: [
    "contactless payments",
    "fintech",
    "Africa",
    "digital payments",
    "mobile payments",
    "secure transactions",
    "payment solution",
  ],
  authors: [
    { name: "Isaac Chindah", url: "https://tefipay.com/about" },
    { name: "Daniel Ochowechi", url: "https://tefipay.com/about" },
  ],
  creator: "TefiPay Team",
  publisher: "TefiPay",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tefipay.com",
    siteName: "TefiPay",
    title: "TefiPay | Revolutionizing Contactless Payments in Africa",
    description:
      "Revolutionary contactless payment solution for Africa. Secure, fast, and seamless digital transactions.",
    images: [
      {
        url: "https://tefipay.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TefiPay - The Future of Contactless Payments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TefiPay | Revolutionizing Contactless Payments in Africa",
    description:
      "Revolutionary contactless payment solution for Africa. Secure, fast, and seamless digital transactions.",
    creator: "@TefiPayOfficial",
    images: ["https://tefipay.com/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "google-site-verification-code", // Replace with actual verification code when available
  },
  category: "technology",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="canonical" href="https://tefipay.com" />
        <Script
          id="schema-org-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FinancialService",
              name: "TefiPay",
              alternateName: "TefiPay Contactless Payments",
              url: "https://www.tefipay.com",
              logo: "https://www.tefipay.com/logo.png",
              description:
                "TefiPay is a revolutionary fintech platform enabling seamless contactless payments across Africa. Users can link their bank cards for instant peer-to-peer and POS transactions without storing funds.",
              sameAs: [
                "https://twitter.com/TefiPayOfficial",
                "https://www.linkedin.com/company/tefipay/",
                "https://www.instagram.com/tefipay/",
                "https://www.facebook.com/profile.php?id=61571972757336",
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "Nigeria",
              },
              employee: [
                {
                  "@type": "Person",
                  name: "Isaac Chindah",
                  jobTitle: "CEO - Chief Executive Officer",
                },
                {
                  "@type": "Person",
                  name: "Daniel Ochowechi",
                  jobTitle: "CTO - Chief Technology Officer",
                },
                {
                  "@type": "Person",
                  name: "Abdulmalik Aruna",
                  jobTitle: "CMO - Chief Marketing Officer",
                },
                {
                  "@type": "Person",
                  name: "Eniola Rosilu Grace",
                  jobTitle: "COO - Chief Of Operations",
                },
              ],
              offers: {
                "@type": "Offer",
                description: "Contactless payment solutions for individuals and businesses in Africa",
                availability: "PreOrder",
              },
              areaServed: {
                "@type": "Country",
                name: "Nigeria",
              },
            }),
          }}
        />
      </head>
      <body className={lexend.className}>{children}</body>
    </html>
  )
}



import './globals.css'