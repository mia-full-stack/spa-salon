"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Clock,
  UserIcon,
  Mail,
  Phone,
  CreditCard,
  Gift,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";
import { ProfileEditForm } from "@/components/profile-edit-form";
import { getTranslation, getCurrentLanguage, type Language } from "@/lib/i18n";
import { useToast } from "@/components/ui/use-toast";

interface User {
  email: string;
  name: string;
  phone: string;
}

interface Booking {
  _id: string;
  date: string;
  time: string;
  service: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  duration: number;
  price: string;
  status: string;
  createdAt: string;
}

interface Certificate {
  certificateNumber: string;
  type: "service" | "amount";
  service?: string;
  amount?: number;
  currency?: string;
  total: string;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  createdAt: string;
  status: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<Language>("ru");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const t = getTranslation(lang);

  useEffect(() => {
    setLang(getCurrentLanguage());
  }, []);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "booking") {
      toast({
        title: t.dashboard.bookingConfirmed || "Запись подтверждена!",
        description:
          t.dashboard.bookingConfirmedDesc ||
          "Ваша запись успешно создана. Мы отправили подтверждение на ваш email.",
      });
      // Remove success parameter from URL
      router.replace("/dashboard");
    }
  }, [searchParams, toast, t, router]);

  useEffect(() => {
    const currentUserStr = localStorage.getItem("spa_current_user");
    console.log(
      " Dashboard: localStorage key 'spa_current_user':",
      currentUserStr
    );

    if (!currentUserStr) {
      console.log(
        " Dashboard: No user found in localStorage, redirecting to login"
      );
      router.push("/login");
      return;
    }

    const currentUser = JSON.parse(currentUserStr);
    console.log(" Dashboard: Current user:", currentUser);
    setUser(currentUser);

    // Fetch bookings from MongoDB
    console.log(" Dashboard: Fetching bookings for email:", currentUser.email);
    fetch(`/api/bookings?userEmail=${encodeURIComponent(currentUser.email)}`)
      .then((res) => {
        console.log(" Dashboard: API response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log(" Dashboard: API response data:", data);
        console.log(
          " Dashboard: Number of bookings:",
          data.bookings?.length || 0
        );
        setBookings(data.bookings || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(" Dashboard: Error fetching bookings:", error);
        setIsLoading(false);
      });

    console.log(
      " Dashboard: Fetching certificates for email:",
      currentUser.email
    );
    fetch(
      `/api/certificates?userEmail=${encodeURIComponent(currentUser.email)}`
    )
      .then((res) => {
        console.log(
          " Dashboard: Certificates API response status:",
          res.status
        );
        return res.json();
      })
      .then((data) => {
        console.log(" Dashboard: Certificates API response data:", data);
        console.log(
          " Dashboard: Number of certificates:",
          data.certificates?.length || 0
        );
        setCertificates(data.certificates || []);
      })
      .catch((error) => {
        console.error(" Dashboard: Error fetching certificates:", error);
      });
  }, [router]);

  if (!user || isLoading) {
    return null;
  }

  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate >= new Date() && b.status !== "cancelled";
  });

  const pastBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    return bookingDate < new Date() || b.status === "cancelled";
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; label: string }
    > = {
      pending: { variant: "secondary", label: "Ожидает" },
      confirmed: { variant: "default", label: "Подтверждено" },
      completed: { variant: "secondary", label: "Завершено" },
      cancelled: { variant: "destructive", label: "Отменено" },
    };
    return variants[status] || variants.confirmed;
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-2 font-serif text-3xl font-bold md:text-4xl">
                {t.dashboard.title}
              </h1>
              <p className="text-muted-foreground">
                {t.dashboard.welcome}, {user.name}!
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <Tabs defaultValue="bookings" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="bookings">
                    {t.dashboard.myBookings}
                  </TabsTrigger>
                  <TabsTrigger value="certificates">
                    {t.dashboard.myCertificates}
                  </TabsTrigger>
                  <TabsTrigger value="profile">
                    {t.dashboard.profile}
                  </TabsTrigger>
                </TabsList>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                      <div>
                        <h3 className="mb-1 font-semibold">
                          {t.dashboard.wantToBook}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t.dashboard.chooseTime}
                        </p>
                      </div>
                      <Link href="/booking">
                        <Button>{t.dashboard.newBooking}</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Upcoming Bookings */}
                  <div>
                    <h2 className="mb-4 font-serif text-2xl font-bold">
                      {t.dashboard.upcomingBookings}
                    </h2>
                    {upcomingBookings.length === 0 ? (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {t.dashboard.noUpcomingBookings}
                          </p>
                          <Link href="/booking">
                            <Button className="mt-4">
                              {t.dashboard.bookNow}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <Card key={booking._id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                      <Calendar className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">
                                        {booking.service}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.duration} {t.dashboard.minutes}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {format(
                                          new Date(booking.date),
                                          "d MMMM yyyy",
                                          { locale: ru }
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span>{booking.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      <span>{booking.price}</span>
                                    </div>
                                  </div>
                                </div>

                                <Badge
                                  variant={
                                    getStatusBadge(booking.status).variant
                                  }
                                >
                                  {getStatusBadge(booking.status).label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Past Bookings */}
                  {pastBookings.length > 0 && (
                    <div>
                      <h2 className="mb-4 font-serif text-2xl font-bold">
                        {t.dashboard.bookingHistory}
                      </h2>
                      <div className="space-y-4">
                        {pastBookings.map((booking) => (
                          <Card key={booking._id} className="opacity-75">
                            <CardContent className="p-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                                      <Calendar className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">
                                        {booking.service}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {booking.duration} {t.dashboard.minutes}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {format(
                                          new Date(booking.date),
                                          "d MMMM yyyy",
                                          { locale: ru }
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span>{booking.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      <span>{booking.price}</span>
                                    </div>
                                  </div>
                                </div>

                                <Badge
                                  variant={
                                    getStatusBadge(booking.status).variant
                                  }
                                >
                                  {getStatusBadge(booking.status).label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="certificates" className="space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
                      <div>
                        <h3 className="mb-1 font-semibold">
                          {t.dashboard.wantToBuyCertificate}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t.dashboard.giftForLovedOnes}
                        </p>
                      </div>
                      <Link href="/certificates">
                        <Button>
                          <Gift className="mr-2 h-4 w-4" />
                          {t.dashboard.buyCertificate}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Certificates List */}
                  <div>
                    <h2 className="mb-4 font-serif text-2xl font-bold">
                      {t.dashboard.orderedCertificates}
                    </h2>
                    {certificates.length === 0 ? (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <Gift className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {t.dashboard.noCertificates}
                          </p>
                          <Link href="/certificates">
                            <Button className="mt-4">
                              <Gift className="mr-2 h-4 w-4" />
                              {t.dashboard.orderCertificate}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {certificates.map((certificate) => (
                          <Card key={certificate.certificateNumber}>
                            <CardContent className="p-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                      <Gift className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold">
                                        {certificate.type === "service"
                                          ? certificate.service
                                          : `${certificate.amount} ${certificate.currency}`}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        {t.certificates.certificateNumber}:{" "}
                                        {certificate.certificateNumber}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <UserIcon className="h-4 w-4" />
                                      <span>
                                        {t.dashboard.recipient}:{" "}
                                        {certificate.recipientName}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{certificate.recipientEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {t.dashboard.ordered}:{" "}
                                        {format(
                                          new Date(certificate.createdAt),
                                          "d MMMM yyyy",
                                          { locale: ru }
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      <span className="font-medium text-foreground">
                                        {certificate.total}
                                      </span>
                                    </div>
                                    {certificate.message && (
                                      <div className="mt-2 rounded-md bg-muted/50 p-3">
                                        <p className="text-sm italic">
                                          "{certificate.message}"
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <Badge
                                  variant={
                                    getStatusBadge(certificate.status).variant
                                  }
                                >
                                  {getStatusBadge(certificate.status).label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  {/* Profile Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">
                        {t.dashboard.profileInfo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t.dashboard.name}
                          </p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {t.dashboard.phone}
                          </p>
                          <p className="font-medium">{user.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Edit Profile */}
                  <ProfileEditForm user={user} onUpdate={setUser} />

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-serif">
                        {t.dashboard.statistics}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            {t.dashboard.totalBookings}
                          </p>
                          <p className="text-2xl font-bold">
                            {bookings.length}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            {t.dashboard.upcoming}
                          </p>
                          <p className="text-2xl font-bold">
                            {upcomingBookings.length}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-4">
                          <p className="text-sm text-muted-foreground">
                            {t.dashboard.certificates}
                          </p>
                          <p className="text-2xl font-bold">
                            {certificates.length}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
