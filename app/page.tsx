"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Sparkles, Heart, Zap, Award } from "lucide-react"
import Image from "next/image"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"

export default function HomePage() {
  const [t, setT] = useState(getTranslation("ru"))

  useEffect(() => {
    const lang = getCurrentLanguage()
    setT(getTranslation(lang))
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-0 bg-[url('/luxury-spa-interior-dark-ambient.jpg')] bg-cover bg-center opacity-20" />

          <div className="container relative mx-auto px-4 py-24 md:py-40">
            <div className="mx-auto max-w-4xl text-center animate-fade-in-up">
              <div className="mb-6 inline-block">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="h-4 w-4" />
                  {t.home.badge}
                </span>
              </div>
              <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-balance md:text-7xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                {t.home.hero}
              </h1>
              <p className="mb-10 text-lg text-muted-foreground leading-relaxed text-pretty md:text-xl">
                {t.home.heroDesc}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/booking">
                  <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                    <span className="relative z-10">{t.home.bookNow}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary/30 hover:bg-primary/10 bg-transparent"
                  >
                    {t.home.ourServices}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </section>

        <section className="py-20 md:py-32 relative">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center animate-fade-in">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{t.home.whyUs}</h2>
              <div className="mx-auto h-1 w-20 bg-gradient-to-r from-primary to-accent mb-6" />
              <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed text-lg">{t.home.whyUsDesc}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold">{t.home.experiencedMasters}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.home.experiencedMastersDesc}</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold">{t.home.premiumQuality}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.home.premiumQualityDesc}</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold">{t.home.individualApproach}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.home.individualApproachDesc}</p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-semibold">{t.home.fastResults}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.home.fastResultsDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

          <div className="container relative mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-serif text-4xl font-bold md:text-5xl">{t.home.servicesTitle}</h2>
              <div className="mx-auto h-1 w-20 bg-gradient-to-r from-primary to-accent mb-6" />
              <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed text-lg">{t.home.servicesDesc}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/classic-massage-therapy-luxury-spa.jpg"
                    alt={t.home.classicMassage}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-serif text-2xl font-semibold">{t.home.classicMassage}</h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t.home.classicMassageDesc}</p>
                  <p className="font-semibold text-primary text-lg">{t.home.from} 1150 ₴</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/lymphatic-drainage-massage-spa.jpg"
                    alt={t.home.lymphaticMassage}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-serif text-2xl font-semibold">{t.home.lymphaticMassage}</h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t.home.lymphaticMassageDesc}</p>
                  <p className="font-semibold text-primary text-lg">{t.home.from} 1150 ₴</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/sports-massage-therapy-athletic.jpg"
                    alt={t.home.sportsMassage}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-serif text-2xl font-semibold">{t.home.sportsMassage}</h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t.home.sportsMassageDesc}</p>
                  <p className="font-semibold text-primary text-lg">{t.home.from} 1500 ₴</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur hover-lift group">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/facial-massage-beauty-spa-treatment.jpg"
                    alt={t.home.facialMassage}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 font-serif text-2xl font-semibold">{t.home.facialMassage}</h3>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t.home.facialMassageDesc}</p>
                  <p className="font-semibold text-primary text-lg">{t.home.from} 550 ₴</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                  {t.home.allServices}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4">
            <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-card via-primary/5 to-accent/5 backdrop-blur relative">
              <div className="absolute inset-0 bg-[url('/luxury-spa-stones-candles.jpg')] bg-cover bg-center opacity-10" />
              <CardContent className="relative p-12 text-center md:p-20">
                <h2 className="mb-6 font-serif text-4xl font-bold md:text-5xl">{t.home.ctaTitle}</h2>
                <p className="mb-10 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  {t.home.ctaDesc}
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Link href="/booking">
                    <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                      <span className="relative z-10">{t.home.bookOnline}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                  <Link href="/gift-certificate">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-primary/30 hover:bg-primary/10 bg-transparent"
                    >
                      {t.home.buyCertificate}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
