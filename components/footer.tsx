"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Music2, MapPin, Phone, Mail } from "lucide-react";
import { getTranslation, getCurrentLanguage } from "@/lib/i18n";

export function Footer() {
  const [t, setT] = useState(getTranslation("ru"));

  useEffect(() => {
    const lang = getCurrentLanguage();
    setT(getTranslation(lang));
  }, []);

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">
              La'Mia Studio
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t.home.heroDesc}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">
              {t.nav.home}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href="/booking"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.home.bookOnline}
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {t.nav.reviews}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">
              {t.footer.contacts}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href="tel:+49001234567"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  +49 (171) 213-95-73
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href="mailto:info@spa-salon.com"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  info@spa-salon.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-muted-foreground">
                  {t.footer.addressValue}
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Map */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">
              {t.footer.followUs}
            </h3>
            <div className="mb-4 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Music2 className="h-5 w-5" />
                <span className="sr-only">TikTok</span>
              </a>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
            >
              <MapPin className="h-4 w-4" />
              {t.footer.howToFind}
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Mia's Studio. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
