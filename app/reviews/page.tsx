"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { ReviewForm } from "@/components/review-form"
import { getApprovedReviews, initializeSampleReviews, type Review } from "@/lib/reviews-storage"
import { Star } from "lucide-react"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    initializeSampleReviews()
    setReviews(getApprovedReviews().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }, [])

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">Отзывы наших клиентов</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Узнайте, что говорят о нас наши довольные клиенты
              </p>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 ${star <= averageRating ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {averageRating.toFixed(1)} из 5 на основе {reviews.length} отзывов
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {/* Reviews List */}
              <div className="space-y-6 lg:col-span-2">
                <h2 className="font-serif text-2xl font-bold">Все отзывы</h2>

                {reviews.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Пока нет отзывов. Будьте первым!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="mb-3 flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{review.userName}</h3>
                              <p className="text-sm text-muted-foreground">{review.serviceType}</p>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= review.rating ? "fill-primary text-primary" : "fill-none text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className="mb-3 text-muted-foreground leading-relaxed">{review.comment}</p>

                          <p className="text-xs text-muted-foreground">
                            {format(new Date(review.createdAt), "d MMMM yyyy", { locale: ru })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div>
                <ReviewForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
