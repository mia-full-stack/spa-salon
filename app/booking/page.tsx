import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Phone } from "lucide-react";

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
                Онлайн запись
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Выберите удобное время и запишитесь на массаж прямо сейчас
              </p>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
              {/* Booking Form */}
              <div className="lg:col-span-2">
                <BookingForm />
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-serif text-xl font-semibold">
                      Режим работы
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Пн-Сб: 9:00 - 21:00</p>
                          <p className="text-muted-foreground">Вс: выходной</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-serif text-xl font-semibold">
                      Контакты
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">+49 (171) 213-95-73</p>
                          <p className="text-muted-foreground">
                            Звоните с 9:00 до 20:00
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Hannover</p>
                          <p className="text-muted-foreground">
                            ул. Примерная, д. 123
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="mb-3 font-serif text-xl font-semibold">
                      Важно знать
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Приходите за 10 минут до начала</li>
                      <li>• Отмена записи за 24 часа</li>
                      <li>• Оплата на месте наличными или картой</li>
                      <li>• При опоздании время сеанса сокращается</li>
                    </ul>
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
