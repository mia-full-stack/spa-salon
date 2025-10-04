"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { saveReview, type Review } from "@/lib/reviews-storage"
import { getCurrentUser } from "@/lib/auth"
import { Star } from "lucide-react"
import { useRouter } from "next/navigation"

const services = ["Классический массаж", "Лимфодренажный массаж", "Спортивный массаж", "Массаж лица"]

export function ReviewForm() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [serviceType, setServiceType] = useState("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const user = getCurrentUser()
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы оставить отзыв",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (rating === 0 || !serviceType || !comment.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const review: Review = {
        id: `review_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        rating,
        comment: comment.trim(),
        serviceType,
        createdAt: new Date().toISOString(),
        approved: true, // Auto-approve for demo purposes
      }

      saveReview(review)

      toast({
        title: "Спасибо за отзыв!",
        description: "Ваш отзыв успешно добавлен",
      })

      // Reset form
      setRating(0)
      setServiceType("")
      setComment("")

      // Refresh page to show new review
      window.location.reload()
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить отзыв. Попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl">Оставить отзыв</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label>Ваша оценка *</Label>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "fill-none text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Type */}
          <div>
            <Label htmlFor="service">Услуга *</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="service">
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Ваш отзыв *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите о вашем опыте..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Отправить отзыв"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
