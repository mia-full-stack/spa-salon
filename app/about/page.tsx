import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Target, Sparkles, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 font-serif text-4xl font-bold md:text-5xl">
                О нашем салоне
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Мы создаем пространство, где каждый может найти гармонию тела и
                души
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 grid gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <div className="mb-6 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-accent/10" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="mb-4 font-serif text-3xl font-bold">
                    Наша история
                  </h2>
                  <p className="mb-4 text-muted-foreground leading-relaxed">
                    Спа Салон был основан в 2015 году с миссией предоставлять
                    высококачественные массажные услуги, которые помогают людям
                    восстанавливать силы и заботиться о своем здоровье.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    За годы работы мы помогли тысячам клиентов обрести
                    физическое и эмоциональное благополучие. Наша команда
                    постоянно совершенствует свои навыки и следит за новейшими
                    тенденциями в области массажа и велнеса.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
                Наши ценности
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
                Принципы, которыми мы руководствуемся в работе
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">
                    Профессионализм
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Высокие стандарты качества во всем
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">
                    Забота о клиентах
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Индивидуальный подход к каждому
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">
                    Качество
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Только лучшие материалы и техники
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-lg font-semibold">
                    Результат
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ваше здоровье - наша цель
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
                Наша команда
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
                Опытные мастера с сертификатами и многолетней практикой
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5" />
                <CardContent className="p-6 text-center">
                  <h3 className="mb-1 font-serif text-xl font-semibold">
                    Лариса Павлова
                  </h3>
                  <p className="mb-2 text-sm text-primary">Главный массажист</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    15 лет опыта, специализация: классический и лимфодренажный
                    массаж
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-accent/20 to-accent/5" />
                <CardContent className="p-6 text-center">
                  <h3 className="mb-1 font-serif text-xl font-semibold">
                    Марина Пакулова
                  </h3>
                  <p className="mb-2 text-sm text-primary">
                    Массажист-косметолог
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    10 лет опыта, специализация: массаж лица и антивозрастные
                    техники
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-chart-3/20 to-chart-3/5" />
                <CardContent className="p-6 text-center">
                  <h3 className="mb-1 font-serif text-xl font-semibold">
                    Дмитрий Соколов
                  </h3>
                  <p className="mb-2 text-sm text-primary">
                    Спортивный массажист
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    12 лет опыта, специализация: спортивный и реабилитационный
                    массаж
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
                Готовы начать свой путь к здоровью?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                Запишитесь на первый сеанс и почувствуйте разницу
              </p>
              <Link href="/booking">
                <Button size="lg">Записаться на массаж</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
