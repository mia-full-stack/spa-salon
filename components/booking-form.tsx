"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { generateClientEmail, generateAdminEmail } from "@/lib/email-templates";
import { getServices } from "@/lib/services-data";
import { getCurrentLanguage, type Language } from "@/lib/i18n";
import { useRouter } from "next/navigation";

const masters = [
  { name: "Лариса Павлова", experience: "10 лет опыта" },
  { name: "Марина Пакулова", experience: "8 лет опыта" },
];

const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 20; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    if (hour < 20) {
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
  }
  return slots;
};

export function BookingForm() {
  const [lang, setLang] = useState<Language>("ru");
  const [services, setServices] = useState(getServices("ru"));
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedService, setSelectedService] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMaster, setSelectedMaster] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const currentLang = getCurrentLanguage();
    setLang(currentLang);
    setServices(getServices(currentLang));

    const handleLanguageChange = () => {
      const newLang = getCurrentLanguage();
      setLang(newLang);
      setServices(getServices(newLang));
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const currentService = services.find((s) => s.title === selectedService);
  const currentDuration = currentService?.durations.find(
    (d) => d.duration === selectedDuration
  );
  const timeSlots = generateTimeSlots();

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");

    if (!date || !selectedMaster) {
      setAvailableSlots([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const response = await fetch(`/api/bookings?date=${dateString}`);
      const data = await response.json();

      const bookedTimes = data.bookings
        .filter((b: any) => b.master === selectedMaster)
        .map((b: any) => b.time);
      const available = timeSlots.filter((slot) => !bookedTimes.includes(slot));
      setAvailableSlots(available);
    } catch (error) {
      console.error(" Error fetching available slots:", error);
      setAvailableSlots(timeSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleMasterSelect = (master: string) => {
    setSelectedMaster(master);
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedDate ||
      !selectedService ||
      !selectedDuration ||
      !selectedTime ||
      !selectedMaster ||
      !name ||
      !email ||
      !phone
    ) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        service: selectedService,
        userName: name,
        userEmail: email,
        userPhone: phone,
        duration: currentDuration?.minutes || 60,
        price: currentDuration?.price || "",
        master: selectedMaster,
      };

      console.log(" BookingForm: Submitting booking data:", bookingData);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      console.log(" BookingForm: Response status:", response.status);
      const data = await response.json();
      console.log(" BookingForm: Response data:", data);

      if (!response.ok) {
        console.error(" BookingForm: Booking failed with error:", data.error);
        throw new Error(data.error || "Failed to create booking");
      }

      console.log(
        " BookingForm: Booking created successfully, sending emails..."
      );

      const currentLanguage =
        typeof window !== "undefined"
          ? localStorage.getItem("language") || "ru"
          : "ru";

      const emailData = {
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        service: selectedService,
        master: selectedMaster,
        date: format(selectedDate, "d MMMM yyyy", { locale: ru }),
        time: selectedTime,
        duration: selectedDuration,
        price: currentDuration?.price || "",
        language: currentLanguage,
      };

      const clientEmailHtml = generateClientEmail(emailData);
      const adminEmailHtml = generateAdminEmail(emailData);

      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: [
            {
              to: email,
              subject: "Подтверждение записи в Luxury Spa Salon",
              html: clientEmailHtml,
            },
            {
              to:
                process.env.NEXT_PUBLIC_ADMIN_EMAIL || "mia.germ888@gmail.com",
              subject: "Новая запись в Luxury Spa Salon",
              html: adminEmailHtml,
            },
          ],
        }),
      });

      console.log(" BookingForm: Email response status:", emailResponse.status);

      toast({
        title: "Запись успешно создана!",
        description: `Вы записаны на ${selectedService} ${format(
          selectedDate,
          "d MMMM yyyy",
          { locale: ru }
        )} в ${selectedTime}. Подтверждение отправлено на email.`,
      });

      console.log(
        " BookingForm: Resetting form and redirecting to dashboard..."
      );

      setTimeout(() => {
        router.push("/dashboard?success=booking");
      }, 1500);
    } catch (error) {
      console.error(" BookingForm: Error during booking:", error);
      toast({
        title: "Ошибка",
        description:
          error instanceof Error
            ? error.message
            : "Не удалось создать запись. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Форма записи</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
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
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 (123) 456-78-90"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="master">Выберите мастера *</Label>
              <Select value={selectedMaster} onValueChange={handleMasterSelect}>
                <SelectTrigger id="master">
                  <SelectValue placeholder="Выберите мастера" />
                </SelectTrigger>
                <SelectContent>
                  {masters.map((master) => (
                    <SelectItem key={master.name} value={master.name}>
                      {master.name} - {master.experience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">Выберите услугу *</Label>
              <Select
                value={selectedService}
                onValueChange={setSelectedService}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Выберите тип массажа" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedService && (
              <div>
                <Label htmlFor="duration">Продолжительность *</Label>
                <Select
                  value={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Выберите продолжительность" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentService?.durations.map((duration) => (
                      <SelectItem
                        key={duration.duration}
                        value={duration.duration}
                      >
                        {duration.duration} - {duration.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label>Выберите дату *</Label>
            <div className="mt-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                locale={ru}
                className="rounded-md border"
              />
            </div>
          </div>

          {selectedDate && selectedMaster && (
            <div>
              <Label htmlFor="time">Выберите время *</Label>
              <Select
                value={selectedTime}
                onValueChange={setSelectedTime}
                disabled={isLoadingSlots}
              >
                <SelectTrigger id="time">
                  <SelectValue
                    placeholder={
                      isLoadingSlots ? "Загрузка..." : "Выберите время"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-2 text-xs text-muted-foreground">
                Доступно слотов: {availableSlots.length} из {timeSlots.length}
              </p>
            </div>
          )}

          {selectedService &&
            selectedDuration &&
            selectedDate &&
            selectedTime &&
            selectedMaster && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h3 className="mb-2 font-semibold">Итого:</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <strong>Мастер:</strong> {selectedMaster}
                    </p>
                    <p>
                      <strong>Услуга:</strong> {selectedService}
                    </p>
                    <p>
                      <strong>Продолжительность:</strong> {selectedDuration}
                    </p>
                    <p>
                      <strong>Дата:</strong>{" "}
                      {format(selectedDate, "d MMMM yyyy", { locale: ru })}
                    </p>
                    <p>
                      <strong>Время:</strong> {selectedTime}
                    </p>
                    <p className="pt-2 text-lg font-semibold text-foreground">
                      <strong>Стоимость:</strong> {currentDuration?.price}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Записаться"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
