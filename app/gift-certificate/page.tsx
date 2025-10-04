"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Gift, Heart, Sparkles } from "lucide-react"

const certificateOptions = [
  { value: "1150", label: "1150 ₴ - Классический массаж 60 мин" },
  { value: "1150", label: "1150 ₴ - Лимфодренажный массаж 60 мин" },
  { value: "1500", label: "1500 ₴ - Спортивный массаж 60 мин" },
  { value: "550", label: "550 ₴ - Массаж лица 45 мин" },
  { value: "1300", label: "1300 ₴ - Любой массаж на выбор" },
  { value: "4000", label: "4000 ₴ - Абонемент на 3 сеанса" },
]

export default function GiftCertificatePage() {
  const [amount, setAmount] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [senderName, setSenderName] = useState("")
  const [senderEmail, setSenderEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !recipientName || !recipientEmail || !senderName || !senderEmail) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Сертификат оформлен!",
        description: "Мы отправили подарочный сертификат на указанный email",
      })

      // Reset form
      setAmount("")
      setRecipientName("")
      setRecipientEmail("")
      setSenderName("")
      setSenderEmail("")
      setMessage("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Gift className="mx-auto mb-6 h-16 w-16 text-primary" />
              <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">Подарочные сертификаты</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Подарите близким моменты релаксации и заботы о здоровье
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-3">
              <Card className="text-center">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Gift className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">Идеальный подарок</h3>
                  <p className="text-sm text-muted-foreground">Подходит для любого повода и получателя</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">Мгновенная доставка</h3>
                  <p className="text-sm text-muted-foreground">Сертификат отправляется на email сразу после оплаты</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">Срок действия 1 год</h3>
                  <p className="text-sm text-muted-foreground">Получатель может выбрать удобное время</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">Оформить сертификат</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Certificate Amount */}
                    <div>
                      <Label htmlFor="amount">Выберите номинал *</Label>
                      <Select value={amount} onValueChange={setAmount}>
                        <SelectTrigger id="amount">
                          <SelectValue placeholder="Выберите сумму сертификата" />
                        </SelectTrigger>
                        <SelectContent>
                          {certificateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Recipient Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Получатель</h3>
                      <div>
                        <Label htmlFor="recipientName">Имя получателя *</Label>
                        <Input
                          id="recipientName"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Имя"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipientEmail">Email получателя *</Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="recipient@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Sender Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">От кого</h3>
                      <div>
                        <Label htmlFor="senderName">Ваше имя *</Label>
                        <Input
                          id="senderName"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Ваше имя"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="senderEmail">Ваш email *</Label>
                        <Input
                          id="senderEmail"
                          type="email"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">Поздравительное сообщение (необязательно)</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Напишите пожелание получателю..."
                        rows={4}
                      />
                    </div>

                    {/* Summary */}
                    {amount && (
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <h3 className="mb-2 font-semibold">К оплате:</h3>
                          <p className="text-2xl font-bold text-primary">{amount} ₴</p>
                        </CardContent>
                      </Card>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Обработка..." : "Оформить и оплатить"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      После оплаты сертификат будет отправлен на email получателя
                    </p>
                  </CardContent>
                </Card>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
