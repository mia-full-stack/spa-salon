import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "La'Mia Studio | Релаксация и Здоровье",
  description:
    "Профессиональные массажи: классический, лимфодренажный, спортивный, массаж лица. Запишитесь онлайн. Подарочные сертификаты.",
  keywords: [
    "массаж",
    "спа салон",
    "классический массаж",
    "лимфодренажный массаж",
    "спортивный массаж",
    "массаж лица",
    "релаксация",
    "здоровье",
    "подарочные сертификаты",
    "массаж Hannover",
    "spa salon",
    "massage",
    "wellness",
  ],
  authors: [{ name: "La'Mia Studio" }],
  creator: "La'Mia Studio",
  publisher: "La'Mia Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://spa-salon.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "ru-RU": "/",
      "uk-UA": "/",
      "en-US": "/",
      "de-DE": "/",
    },
  },
  openGraph: {
    title: "La'Mia Studio | Релаксация и Здоровье",
    description:
      "Профессиональные массажи: классический, лимфодренажный, спортивный, массаж лица. Запишитесь онлайн.",
    url: "https://spa-salon.vercel.app",
    siteName: "La'Mia Studio",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La'Mia Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "La'Mia Studio | Релаксация и Здоровье",
    description: "Профессиональные массажи для вашего здоровья и красоты",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "La'Mia Studio",
              description:
                "Профессиональные массажи для вашего здоровья и красоты",
              url: "https://spa-salon.vercel.app",
              telephone: "+380123456789",
              address: {
                "@type": "PostalAddress",
                streetAddress: "ул. Примерная, 123",
                addressLocality: "Hannover",
                addressCountry: "UA",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "09:00",
                  closes: "21:00",
                },
              ],
              priceRange: "₴₴",
              image: "https://spa-salon.vercel.app/og-image.jpg",
              sameAs: [
                "https://facebook.com/spa-salon",
                "https://instagram.com/spa-salon",
                "https://twitter.com/spa-salon",
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Массажные услуги",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Классический массаж",
                      description:
                        "Традиционная техника для общего оздоровления организма",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Лимфодренажный массаж",
                      description:
                        "Выводит лишнюю жидкость и улучшает обмен веществ",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Спортивный массаж",
                      description:
                        "Восстановление мышц после физических нагрузок",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Массаж лица",
                      description: "Омоложение и улучшение тонуса кожи лица",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${cormorant.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
