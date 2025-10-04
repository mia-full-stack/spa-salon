"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Calendar, TrendingUp, Users, DollarSign, Gift } from "lucide-react";

interface ServiceStats {
  count: number;
  duration: string;
  revenue: number;
}

interface MasterStats {
  totalClients: number;
  totalBookings: number;
  totalRevenue: number;
  totalCertificates: number;
  certificateRevenue: number;
  clients: string[];
  services: Record<string, ServiceStats>;
}

interface Certificate {
  certificateNumber: string;
  type: "service" | "amount";
  service?: string;
  amount?: string;
  currency: string;
  total: string;
  recipientName: string;
  createdAt: string;
}

interface CertificateStats {
  totalCertificates: number;
  totalRevenue: number;
  byType: {
    service: number;
    amount: number;
  };
  byAmount: Record<string, number>;
  byService: Record<string, number>;
  certificates: Certificate[];
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Record<string, MasterStats> | null>(null);
  const [certificateStats, setCertificateStats] =
    useState<CertificateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [period, setPeriod] = useState<"month" | "year" | "all">("all");
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const currentUser = localStorage.getItem("spa_current_user");
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(currentUser);

      try {
        const response = await fetch("/api/auth/check-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        const data = await response.json();

        if (!data.isAdmin) {
          router.push("/");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error(" Error checking admin access:", error);
        router.push("/");
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminAccess();
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [mastersResponse, certificatesResponse] = await Promise.all([
          fetch(`/api/masters/stats?period=${period}`),
          fetch(`/api/certificates?period=${period}`),
        ]);

        const mastersData = await mastersResponse.json();
        const certificatesData = await certificatesResponse.json();

        setStats(mastersData.stats);
        setCertificateStats(certificatesData.stats);
      } catch (error) {
        console.error(" Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin, period]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-12">
          <div className="container mx-auto px-4">
            <Skeleton className="mb-8 h-12 w-64" />
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-serif text-4xl font-bold">
              Статистика мастеров
            </h1>
            <div className="flex gap-2">
              <Button
                variant={period === "month" ? "default" : "outline"}
                onClick={() => setPeriod("month")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Месяц
              </Button>
              <Button
                variant={period === "year" ? "default" : "outline"}
                onClick={() => setPeriod("year")}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Год
              </Button>
              <Button
                variant={period === "all" ? "default" : "outline"}
                onClick={() => setPeriod("all")}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Весь период
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-[300px]" />
              <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-[600px]" />
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {certificateStats && (
                <Card className="border-2 border-accent/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif text-2xl">
                      <Gift className="h-6 w-6 text-accent" />
                      Статистика сертификатов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-muted p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Gift className="h-4 w-4" />
                          Всего заказано
                        </div>
                        <p className="text-3xl font-bold text-accent">
                          {certificateStats.totalCertificates}
                        </p>
                      </div>
                      <div className="rounded-lg bg-accent/10 p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          Общая сумма
                        </div>
                        <p className="text-3xl font-bold text-accent">
                          {certificateStats.totalRevenue} грн
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <div className="mb-2 text-sm text-muted-foreground">
                          По типам
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">
                            На услугу:{" "}
                            <span className="font-semibold text-accent">
                              {certificateStats.byType.service}
                            </span>
                          </p>
                          <p className="text-sm">
                            На сумму:{" "}
                            <span className="font-semibold text-accent">
                              {certificateStats.byType.amount}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {certificateStats.certificates.length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-3 font-semibold">
                          Все заказанные сертификаты:
                        </h3>
                        <div className="space-y-2">
                          {certificateStats.certificates.map((cert) => (
                            <div
                              key={cert.certificateNumber}
                              className="flex items-center justify-between rounded-lg border bg-card p-4"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-sm font-semibold text-accent">
                                    {cert.certificateNumber}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(
                                      cert.createdAt
                                    ).toLocaleDateString("ru-RU")}
                                  </span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-sm">
                                  <span className="font-medium">
                                    {cert.type === "service"
                                      ? cert.service
                                      : `${cert.amount} ${cert.currency}`}
                                  </span>
                                  <span className="text-muted-foreground">
                                    •
                                  </span>
                                  <span className="text-muted-foreground">
                                    Для: {cert.recipientName}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-accent">
                                  {cert.total}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      {Object.keys(certificateStats.byService).length > 0 && (
                        <div>
                          <h3 className="mb-3 font-semibold">
                            Сертификаты на услуги:
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(certificateStats.byService)
                              .sort(([, a], [, b]) => b - a)
                              .map(([service, count]) => (
                                <div
                                  key={service}
                                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                                >
                                  <span className="font-medium">{service}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {count}{" "}
                                    {count === 1
                                      ? "сертификат"
                                      : "сертификатов"}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {Object.keys(certificateStats.byAmount).length > 0 && (
                        <div>
                          <h3 className="mb-3 font-semibold">
                            Сертификаты на сумму:
                          </h3>
                          <div className="space-y-2">
                            {Object.entries(certificateStats.byAmount)
                              .sort(([, a], [, b]) => b - a)
                              .map(([amount, count]) => (
                                <div
                                  key={amount}
                                  className="flex items-center justify-between rounded-lg border bg-card p-3"
                                >
                                  <span className="font-medium">{amount}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {count}{" "}
                                    {count === 1
                                      ? "сертификат"
                                      : "сертификатов"}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 md:grid-cols-2">
                {stats &&
                  Object.entries(stats).map(([masterName, masterStats]) => (
                    <Card key={masterName} className="border-2">
                      <CardHeader>
                        <CardTitle className="font-serif text-2xl">
                          {masterName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-muted p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              Постоянных клиентов
                            </div>
                            <p className="text-3xl font-bold text-accent">
                              {masterStats.totalClients}
                            </p>
                          </div>
                          <div className="rounded-lg bg-muted p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Всего записей
                            </div>
                            <p className="text-3xl font-bold text-accent">
                              {masterStats.totalBookings}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-accent/10 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <Gift className="h-4 w-4" />
                              Продано сертификатов
                            </div>
                            <p className="text-3xl font-bold text-accent">
                              {masterStats.totalCertificates}
                            </p>
                          </div>
                          <div className="rounded-lg bg-accent/10 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              Выручка с сертификатов
                            </div>
                            <p className="text-3xl font-bold text-accent">
                              {masterStats.certificateRevenue} грн
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg bg-accent/10 p-4">
                          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            Общая выручка
                          </div>
                          <p className="text-3xl font-bold text-accent">
                            {masterStats.totalRevenue} грн
                          </p>
                        </div>

                        {Object.keys(masterStats.services).length > 0 && (
                          <div>
                            <h3 className="mb-3 font-semibold">
                              Популярные услуги:
                            </h3>
                            <div className="space-y-3">
                              {Object.entries(masterStats.services)
                                .sort(([, a], [, b]) => b.count - a.count)
                                .map(([service, serviceStats]) => (
                                  <div
                                    key={service}
                                    className="rounded-lg border bg-card p-3"
                                  >
                                    <div className="mb-2 flex items-center justify-between">
                                      <span className="font-medium">
                                        {service}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        {serviceStats.count}{" "}
                                        {serviceStats.count === 1
                                          ? "запись"
                                          : "записей"}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">
                                        Продолжительность:{" "}
                                        {serviceStats.duration}
                                      </span>
                                      <span className="font-semibold text-accent">
                                        {serviceStats.revenue} грн
                                      </span>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        {masterStats.clients.length > 0 && (
                          <div>
                            <h3 className="mb-2 font-semibold">
                              Постоянные клиенты:
                            </h3>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {masterStats.clients.map((client) => (
                                <li key={client} className="truncate">
                                  {client}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
