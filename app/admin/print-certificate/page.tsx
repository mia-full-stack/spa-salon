"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CertificateDesign } from "@/components/certificate-design"
import { Printer, RefreshCw } from "lucide-react"
import { getTranslation, getCurrentLanguage, type Language } from "@/lib/i18n"
import { getServices } from "@/lib/services-data"
import { useToast } from "@/hooks/use-toast"

interface Certificate {
  _id: string
  certificateNumber: string
  type: "service" | "amount"
  service?: string
  amount?: string
  currency: string
  recipient: {
    name: string
    email: string
  }
  buyer: {
    name: string
    email: string
  }
  message?: string
  status: string
  createdAt: string
  duration?: string
}

export default function PrintCertificatePage() {
  const [language, setLanguage] = useState<Language>("ru")
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<string>("")
  const [manualMode, setManualMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Manual input fields
  const [certificateNumber, setCertificateNumber] = useState("")
  const [type, setType] = useState<"service" | "amount">("service")
  const [service, setService] = useState("")
  const [duration, setDuration] = useState("") // Added duration state
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("₴")
  const [recipientName, setRecipientName] = useState("")
  const [buyerName, setBuyerName] = useState("") // Added buyer name state
  const [message, setMessage] = useState("")

  const t = getTranslation(language)
  const services = getServices(language)

  useEffect(() => {
    const lang = getCurrentLanguage()
    setLanguage(lang)
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/certificates")
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.stats?.certificates || [])
      }
    } catch (error) {
      console.error("Error loading certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCertificateSelect = (certId: string) => {
    setSelectedCertificate(certId)
    const cert = certificates.find((c) => c._id === certId)
    if (cert) {
      setCertificateNumber(cert.certificateNumber)
      setType(cert.type)
      setService(cert.service || "")
      setDuration(cert.duration || "") // Set duration from certificate
      setAmount(cert.amount || "")
      setCurrency(cert.currency)
      setRecipientName(cert.recipient?.name || "")
      setBuyerName(cert.buyer?.name || "") // Set buyer name from certificate
      setMessage(cert.message || "")
    }
  }

  const handlePrint = async () => {
    if (selectedCertificate) {
      try {
        // Update certificate status to "issued"
        const response = await fetch("/api/certificates", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            certificateId: selectedCertificate,
            status: "issued",
          }),
        })

        if (response.ok) {
          toast({
            title: "Статус обновлен",
            description: "Сертификат отмечен как выданный",
          })
          // Reload certificates to update the list
          await loadCertificates()
        }
      } catch (error) {
        console.error("Error updating certificate status:", error)
      }
    }

    // Trigger print
    window.print()
  }

  const currentCertificate = selectedCertificate ? certificates.find((c) => c._id === selectedCertificate) : null

  const selectedServiceData = services.find((s) => s.title === service)
  const availableDurations = selectedServiceData?.durations || []

  return (
    <>
      <div className="no-print">
        <Header />
      </div>

      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 no-print">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold">Печать сертификатов</h1>
            <p className="text-muted-foreground">Выберите заказанный сертификат или введите данные вручную</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Выбор сертификата</CardTitle>
                  <CardDescription>Загрузите заказанный сертификат или введите данные вручную</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={!manualMode ? "default" : "outline"}
                      onClick={() => setManualMode(false)}
                      className="flex-1"
                    >
                      Из заказов
                    </Button>
                    <Button
                      variant={manualMode ? "default" : "outline"}
                      onClick={() => setManualMode(true)}
                      className="flex-1"
                    >
                      Вручную
                    </Button>
                  </div>

                  {!manualMode ? (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={selectedCertificate} onValueChange={handleCertificateSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите сертификат" />
                          </SelectTrigger>
                          <SelectContent>
                            {certificates.map((cert) => (
                              <SelectItem key={cert._id} value={cert._id}>
                                {cert.certificateNumber} - {cert.recipient?.name} (
                                {new Date(cert.createdAt).toLocaleDateString()}) - {cert.status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={loadCertificates} disabled={loading}>
                          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                      </div>

                      {currentCertificate && (
                        <div className="space-y-2 rounded-lg border p-4">
                          <div>
                            <span className="font-semibold">Номер:</span> {currentCertificate.certificateNumber}
                          </div>
                          <div>
                            <span className="font-semibold">Тип:</span>{" "}
                            {currentCertificate.type === "service" ? "На услугу" : "На сумму"}
                          </div>
                          <div>
                            <span className="font-semibold">Получатель:</span> {currentCertificate.recipient?.name}
                          </div>
                          <div>
                            <span className="font-semibold">Покупатель:</span> {currentCertificate.buyer?.name}
                          </div>
                          <div>
                            <span className="font-semibold">Статус:</span> {currentCertificate.status}
                          </div>
                          {currentCertificate.message && (
                            <div>
                              <span className="font-semibold">Сообщение:</span> {currentCertificate.message}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="certNumber">Номер сертификата</Label>
                        <Input
                          id="certNumber"
                          value={certificateNumber}
                          onChange={(e) => setCertificateNumber(e.target.value)}
                          placeholder="GSN-000001"
                        />
                      </div>

                      <div>
                        <Label>Тип сертификата</Label>
                        <Select value={type} onValueChange={(v) => setType(v as "service" | "amount")}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="service">На услугу</SelectItem>
                            <SelectItem value="amount">На сумму</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {type === "service" ? (
                        <>
                          <div>
                            <Label>Услуга</Label>
                            <Select
                              value={service}
                              onValueChange={(v) => {
                                setService(v)
                                setDuration("") // Reset duration when service changes
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите услугу" />
                              </SelectTrigger>
                              <SelectContent>
                                {services.map((s) => (
                                  <SelectItem key={s.id} value={s.title}>
                                    {s.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {service && availableDurations.length > 0 && (
                            <div>
                              <Label>Продолжительность</Label>
                              <Select value={duration} onValueChange={setDuration}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите продолжительность" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableDurations.map((d, index) => (
                                    <SelectItem key={index} value={d.duration}>
                                      {d.duration} - {d.price}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="amount">Сумма</Label>
                            <Input
                              id="amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              placeholder="1000"
                            />
                          </div>
                          <div>
                            <Label htmlFor="currency">Валюта</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="₴">₴ (Гривна)</SelectItem>
                                <SelectItem value="€">€ (Евро)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="recipient">Имя получателя</Label>
                        <Input
                          id="recipient"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Иван Иванов"
                        />
                      </div>

                      <div>
                        <Label htmlFor="buyer">Имя покупателя (от кого)</Label>
                        <Input
                          id="buyer"
                          value={buyerName}
                          onChange={(e) => setBuyerName(e.target.value)}
                          placeholder="Петр Петров"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Сообщение (опционально)</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Поздравление или пожелание..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <Button onClick={handlePrint} className="w-full" disabled={!recipientName}>
                    <Printer className="mr-2 h-4 w-4" />
                    Печать сертификата
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Предпросмотр</CardTitle>
                  <CardDescription>Так будет выглядеть сертификат при печати</CardDescription>
                </CardHeader>
                <CardContent>
                  {recipientName ? (
                    <CertificateDesign
                      type={type}
                      service={service}
                      duration={duration}
                      amount={amount}
                      currency={currency}
                      recipientName={recipientName}
                      buyerName={buyerName}
                      message={message}
                      certificateNumber={certificateNumber}
                      language={language}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
                      <p className="text-muted-foreground">Заполните данные для предпросмотра</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="print-only">
          {recipientName && (
            <CertificateDesign
              type={type}
              service={service}
              duration={duration}
              amount={amount}
              currency={currency}
              recipientName={recipientName}
              buyerName={buyerName}
              message={message}
              certificateNumber={certificateNumber}
              language={language}
            />
          )}
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          .print-only {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: white;
            z-index: 9999;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          @page {
            margin: 0;
            size: A4 portrait;
          }
        }
        
        .print-only {
          display: none;
        }
      `}</style>
    </>
  )
}
