"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, CheckCircle2 } from "lucide-react"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  image?: string
  maxParticipants?: number
  registeredParticipants: string[]
  createdAt: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [t, setT] = useState(getTranslation("ru"))
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const lang = getCurrentLanguage()
    setT(getTranslation(lang))
    setUser(getCurrentUser())
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast({
        title: t.events.loginRequired,
        description: t.events.loginRequiredDesc,
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          eventId,
          userId: user.id,
        }),
      })

      if (response.ok) {
        toast({
          title: t.events.registrationSuccess,
          description: t.events.registrationSuccessDesc,
        })
        fetchEvents()
      } else {
        const error = await response.json()
        toast({
          title: t.events.registrationError,
          description: error.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        title: t.events.registrationError,
        description: t.events.registrationErrorDesc,
        variant: "destructive",
      })
    }
  }

  const handleUnregister = async (eventId: string) => {
    if (!user) return

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "unregister",
          eventId,
          userId: user.id,
        }),
      })

      if (response.ok) {
        toast({
          title: t.events.unregistrationSuccess,
          description: t.events.unregistrationSuccessDesc,
        })
        fetchEvents()
      }
    } catch (error) {
      console.error("Error unregistering from event:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(getCurrentLanguage(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const isRegistered = (event: Event) => {
    return user && event.registeredParticipants.includes(user.id)
  }

  const isFull = (event: Event) => {
    return event.maxParticipants ? event.registeredParticipants.length >= event.maxParticipants : false
  }

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/5 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">{t.events.badge}</Badge>
              <h1 className="mb-6 font-serif text-5xl font-bold tracking-tight text-balance md:text-6xl">
                {t.events.title}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">{t.events.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 animate-pulse bg-muted" />
                    <CardHeader>
                      <div className="h-6 animate-pulse rounded bg-muted" />
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="mx-auto max-w-md text-center">
                <p className="text-muted-foreground">{t.events.noEvents}</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => {
                  const registered = isRegistered(event)
                  const full = isFull(event)
                  const past = isPastEvent(event.date)

                  return (
                    <Card key={event.id} className="group overflow-hidden transition-all hover:shadow-lg">
                      {event.image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          />
                          {past && (
                            <Badge className="absolute right-4 top-4 bg-muted text-muted-foreground">
                              {t.events.past}
                            </Badge>
                          )}
                          {!past && full && (
                            <Badge className="absolute right-4 top-4 bg-destructive text-destructive-foreground">
                              {t.events.full}
                            </Badge>
                          )}
                          {!past && registered && (
                            <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {t.events.registered}
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-balance">{event.title}</CardTitle>
                        <CardDescription className="text-pretty">{event.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.registeredParticipants.length} / {event.maxParticipants} {t.events.participants}
                            </span>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter>
                        {!past && (
                          <>
                            {registered ? (
                              <Button
                                variant="outline"
                                className="w-full bg-transparent"
                                onClick={() => handleUnregister(event.id)}
                              >
                                {t.events.unregister}
                              </Button>
                            ) : (
                              <Button className="w-full" onClick={() => handleRegister(event.id)} disabled={full}>
                                {full ? t.events.full : t.events.register}
                              </Button>
                            )}
                          </>
                        )}
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
