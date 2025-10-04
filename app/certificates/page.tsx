"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTranslation, getCurrentLanguage } from "@/lib/i18n";
import { getServices } from "@/lib/services-data";
import { Gift, Check, Mail, Phone, User } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function CertificatesPage() {
  const [t, setT] = useState(getTranslation("ru"));
  const [services, setServices] = useState(getServices("ru"));
  const [certificateType, setCertificateType] = useState<"service" | "amount">(
    "service"
  );
  const [selectedService, setSelectedService] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMaster, setSelectedMaster] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(""); // Added duration state

  const masters = [
    { id: "larisa-pavlova", name: "Лариса Павлова" },
    { id: "marina-pakulova", name: "Марина Пакулова" },
  ];

  useEffect(() => {
    const lang = getCurrentLanguage();
    setT(getTranslation(lang));
    setServices(getServices(lang));
    console.log(" Services loaded:", getServices(lang));
  }, []);

  const predefinedAmounts =
    getCurrentLanguage() === "ru" || getCurrentLanguage() === "uk"
      ? ["1000", "1500", "2000", "3000"]
      : ["50", "75", "100", "150"];

  const currency =
    getCurrentLanguage() === "ru" || getCurrentLanguage() === "uk" ? "₴" : "€";

  const calculateTotal = () => {
    if (certificateType === "service" && selectedService && selectedDuration) {
      const service = services.find((s) => s.id === selectedService);
      if (service) {
        const durationData = service.durations.find(
          (d) => d.duration === selectedDuration
        );
        return durationData
          ? `${durationData.price} ${currency}`
          : `0 ${currency}`;
      }
    } else if (certificateType === "amount") {
      const amount =
        selectedAmount === "custom" ? customAmount : selectedAmount;
      return amount ? `${amount} ${currency}` : `0 ${currency}`;
    }
    return `0 ${currency}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const certificateNumber = `CERT-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)
      .toUpperCase()}`;

    const certificateData = {
      certificateNumber,
      type: certificateType,
      service:
        certificateType === "service"
          ? services.find((s) => s.id === selectedService)?.title
          : null,
      duration: certificateType === "service" ? selectedDuration : null, // Include duration
      amount:
        certificateType === "amount"
          ? selectedAmount === "custom"
            ? customAmount
            : selectedAmount
          : null,
      currency,
      masterId: selectedMaster,
      masterName: masters.find((m) => m.id === selectedMaster)?.name || null,
      recipient: {
        name: recipientName,
        email: recipientEmail,
        phone: recipientPhone,
      },
      buyer: {
        name: buyerName,
        email: buyerEmail,
        phone: buyerPhone,
      },
      message,
      total: calculateTotal(),
    };

    console.log(" Certificate order:", certificateData);

    try {
      const saveResponse = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(certificateData),
      });
      const saveResult = await saveResponse.json();
      console.log(" Certificate saved:", saveResult);
    } catch (error) {
      console.error(" Error saving certificate order:", error);
    }

    try {
      const emailData = {
        emails: [
          {
            to: "mia.germ888@gmail.com",
            subject: `Новый заказ сертификата от ${buyerName}`,
            html: `
              <h2>Новый заказ подарочного сертификата</h2>
              <p><strong>Номер сертификата:</strong> ${certificateNumber}</p>
              <p><strong>Тип:</strong> ${
                certificateType === "service" ? "На услугу" : "На сумму"
              }</p>
              ${
                certificateType === "service"
                  ? `<p><strong>Услуга:</strong> ${certificateData.service}</p>`
                  : ""
              }
              ${
                certificateType === "service" && selectedDuration
                  ? `<p><strong>Продолжительность:</strong> ${selectedDuration}</p>`
                  : ""
              }
              ${
                certificateType === "amount"
                  ? `<p><strong>Сумма:</strong> ${certificateData.amount} ${currency}</p>`
                  : ""
              }
              ${
                certificateData.masterName
                  ? `<p><strong>Мастер:</strong> ${certificateData.masterName}</p>`
                  : ""
              }
              <p><strong>Итого:</strong> ${certificateData.total}</p>
              <h3>Получатель:</h3>
              <p><strong>Имя:</strong> ${recipientName}</p>
              <p><strong>Email:</strong> ${recipientEmail}</p>
              <p><strong>Телефон:</strong> ${recipientPhone || "Не указан"}</p>
              <h3>Покупатель:</h3>
              <p><strong>Имя:</strong> ${buyerName}</p>
              <p><strong>Email:</strong> ${buyerEmail}</p>
              <p><strong>Телефон:</strong> ${buyerPhone}</p>
              ${message ? `<p><strong>Сообщение:</strong> ${message}</p>` : ""}
            `,
          },
        ],
      };

      console.log(" Sending email to admin...");
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });
      const emailResult = await emailResponse.json();
      console.log(" Email result:", emailResult);

      if (emailResult.success) {
        setIsSubmitted(true);
      } else {
        console.error(" Email sending failed:", emailResult);
        alert(
          "Произошла ошибка при отправке заказа. Пожалуйста, свяжитесь с нами по телефону."
        );
      }
    } catch (error) {
      console.error(" Error sending certificate order email:", error);
      alert(
        "Произошла ошибка при отправке заказа. Пожалуйста, свяжитесь с нами по телефону."
      );
    }
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  useEffect(() => {
    if (selectedService) {
      console.log(" Selected service:", selectedService);
      console.log(" Selected service data:", selectedServiceData);
    }
  }, [selectedService, selectedServiceData]);

  if (isSubmitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-20">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h1 className="mb-4 text-3xl font-bold">
                {t.certificates.successTitle}
              </h1>
              <p className="mb-8 text-muted-foreground">
                {t.certificates.successMessage}
              </p>
              <Button onClick={() => (window.location.href = "/")} size="lg">
                {t.certificates.backToHome}
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h1 className="mb-4 text-4xl font-bold">
                {t.certificates.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t.certificates.subtitle}
              </p>
            </div>

            {/* How it works */}
            <Card className="mb-12 p-8">
              <h2 className="mb-6 text-2xl font-bold">
                {t.certificates.howItWorks}
              </h2>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    1
                  </div>
                  <h3 className="mb-2 font-semibold">{t.certificates.step1}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.certificates.step1Desc}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    2
                  </div>
                  <h3 className="mb-2 font-semibold">{t.certificates.step2}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.certificates.step2Desc}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    3
                  </div>
                  <h3 className="mb-2 font-semibold">{t.certificates.step3}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.certificates.step3Desc}
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                    4
                  </div>
                  <h3 className="mb-2 font-semibold">{t.certificates.step4}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t.certificates.step4Desc}
                  </p>
                </div>
              </div>
            </Card>

            <form onSubmit={handleSubmit}>
              <Card className="mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold">
                  {t.certificates.chooseType}
                </h2>
                <RadioGroup
                  value={certificateType}
                  onValueChange={(value: "service" | "amount") =>
                    setCertificateType(value)
                  }
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="service" id="service" />
                    <Label htmlFor="service" className="flex-1 cursor-pointer">
                      {t.certificates.forService}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4">
                    <RadioGroupItem value="amount" id="amount" />
                    <Label htmlFor="amount" className="flex-1 cursor-pointer">
                      {t.certificates.forAmount}
                    </Label>
                  </div>
                </RadioGroup>

                {certificateType === "service" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label>{t.certificates.selectService}</Label>
                      <RadioGroup
                        value={selectedService}
                        onValueChange={(v) => {
                          setSelectedService(v);
                          setSelectedDuration(""); // Reset duration when service changes
                          console.log(" Service selected:", v);
                        }}
                        className="mt-3"
                      >
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={service.id}
                                id={service.id}
                              />
                              <Label
                                htmlFor={service.id}
                                className="cursor-pointer"
                              >
                                {service.title}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {selectedService &&
                      selectedServiceData &&
                      selectedServiceData.durations &&
                      selectedServiceData.durations.length > 0 && (
                        <div>
                          <Label>{t.certificates.selectDuration}</Label>
                          <RadioGroup
                            value={selectedDuration}
                            onValueChange={(v) => {
                              setSelectedDuration(v);
                              console.log(" Duration selected:", v);
                            }}
                            className="mt-3"
                          >
                            {selectedServiceData.durations.map(
                              (duration, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between rounded-lg border p-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                      value={duration.duration}
                                      id={`duration-${index}`}
                                    />
                                    <Label
                                      htmlFor={`duration-${index}`}
                                      className="cursor-pointer"
                                    >
                                      {duration.duration}
                                    </Label>
                                  </div>
                                  <span className="font-semibold">
                                    {duration.price} {currency}
                                  </span>
                                </div>
                              )
                            )}
                          </RadioGroup>
                        </div>
                      )}
                  </div>
                )}

                {certificateType === "amount" && (
                  <div className="mt-6">
                    <Label>{t.certificates.selectAmount}</Label>
                    <RadioGroup
                      value={selectedAmount}
                      onValueChange={setSelectedAmount}
                      className="mt-3"
                    >
                      {predefinedAmounts.map((amount) => (
                        <div
                          key={amount}
                          className="flex items-center space-x-2 rounded-lg border p-4"
                        >
                          <RadioGroupItem value={amount} id={amount} />
                          <Label
                            htmlFor={amount}
                            className="flex-1 cursor-pointer"
                          >
                            {amount} {currency}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 rounded-lg border p-4">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label
                          htmlFor="custom"
                          className="flex-1 cursor-pointer"
                        >
                          {t.certificates.customAmount}
                        </Label>
                      </div>
                    </RadioGroup>
                    {selectedAmount === "custom" && (
                      <Input
                        type="number"
                        placeholder="0"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-3"
                        required
                      />
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <Label>{t.certificates.selectMaster}</Label>
                  <RadioGroup
                    value={selectedMaster}
                    onValueChange={setSelectedMaster}
                    className="mt-3"
                  >
                    {masters.map((master) => (
                      <div
                        key={master.id}
                        className="flex items-center space-x-2 rounded-lg border p-4"
                      >
                        <RadioGroupItem value={master.id} id={master.id} />
                        <Label
                          htmlFor={master.id}
                          className="flex-1 cursor-pointer"
                        >
                          {master.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </Card>

              <Card className="mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold">
                  {t.certificates.recipientInfo}
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientName">
                      <User className="mr-2 inline h-4 w-4" />
                      {t.certificates.recipientName}
                    </Label>
                    <Input
                      id="recipientName"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientEmail">
                      <Mail className="mr-2 inline h-4 w-4" />
                      {t.certificates.recipientEmail}
                    </Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="recipientPhone">
                      <Phone className="mr-2 inline h-4 w-4" />
                      {t.certificates.recipientPhone}
                    </Label>
                    <Input
                      id="recipientPhone"
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="mb-8 p-8">
                <h2 className="mb-6 text-2xl font-bold">
                  {t.certificates.yourInfo}
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buyerName">
                      <User className="mr-2 inline h-4 w-4" />
                      {t.certificates.yourName}
                    </Label>
                    <Input
                      id="buyerName"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerEmail">
                      <Mail className="mr-2 inline h-4 w-4" />
                      {t.certificates.yourEmail}
                    </Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="buyerPhone">
                      <Phone className="mr-2 inline h-4 w-4" />
                      {t.certificates.yourPhone}
                    </Label>
                    <Input
                      id="buyerPhone"
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">{t.certificates.message}</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.certificates.messagePlaceholder}
                      rows={4}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-8">
                <div className="mb-6 flex items-center justify-between text-2xl font-bold">
                  <span>{t.certificates.total}:</span>
                  <span className="text-primary">{calculateTotal()}</span>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={
                    (certificateType === "service" &&
                      (!selectedService || !selectedDuration)) ||
                    (certificateType === "amount" && !selectedAmount) ||
                    !selectedMaster ||
                    !recipientName ||
                    !recipientEmail ||
                    !buyerName ||
                    !buyerEmail ||
                    !buyerPhone
                  }
                >
                  {t.certificates.orderCertificate}
                </Button>
              </Card>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
