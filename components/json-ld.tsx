import Script from "next/script"

interface JsonLdProps {
  data: Record<string, any>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id={`json-ld-${Math.random().toString(36).substring(7)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

