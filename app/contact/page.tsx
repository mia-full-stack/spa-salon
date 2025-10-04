"use client";

import type React from "react";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Сообщение отправлено!",
        description: "Мы свяжемся с вами в ближайшее время",
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
                Контакты
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Свяжитесь с нами любым удобным способом
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-2xl">
                      Напишите нам
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Имя *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ваше имя"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@gmail.com"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+49 (123) 456-78-90"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Сообщение *</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ваше сообщение..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Отправка..." : "Отправить сообщение"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">Адрес</h3>
                        <p className="text-sm text-muted-foreground">
                          г. Хильдесхайм, ул. Примерная, д. 12
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">Телефон</h3>
                        <p className="text-sm text-muted-foreground">
                          +49 (171) 213-95-73
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Звоните с 9:00 до 20:00
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">Email</h3>
                        <p className="text-sm text-muted-foreground">
                          info@spa-salon.com
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ответим в течение 24 часов
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="mb-1 font-semibold">Режим работы</h3>
                        <p className="text-sm text-muted-foreground">
                          Пн-Сб: 9:00 - 20:00
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Вс: выходной
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map Placeholder */}
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video w-full bg-muted">
                      <img
                        src="/map-location-pin.png"
                        alt="Карта расположения"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
