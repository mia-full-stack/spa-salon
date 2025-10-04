"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, Plus, Pencil, Trash2 } from "lucide-react"
import { getTranslation, getCurrentLanguage } from "@/lib/i18n"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [t, setT] = useState(getTranslation("ru"))
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    image: "",
    maxParticipants: "",
  })

  useEffect(() => {
    const lang = getCurrentLanguage()
    setT(getTranslation(lang))
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (!currentUser || currentUser.role !== "admin") {
      router.push("/")
      return
    }

    fetchEvents()
  }, [router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = "/api/events"
      const method = editingEvent ? "PUT" : "POST"
      const body = {
        ...(editingEvent && { id: editingEvent.id }),
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        image: formData.image || undefined,
        maxParticipants: formData.maxParticipants ? Number.parseInt(formData.maxParticipants) : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast({
          title: editingEvent ? t.events.updateSuccess : t.events.createSuccess,
          description: editingEvent ? t.events.updateSuccessDesc : t.events.createSuccessDesc,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchEvents()
      } else {
        throw new Error("Failed to save event")
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: t.events.saveError,
        description: t.events.saveErrorDesc,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image || "",
      maxParticipants: event.maxParticipants?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm(t.events.deleteConfirm)) return

    try {
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: t.events.deleteSuccess,
          description: t.events.deleteSuccessDesc,
        })
        fetchEvents()
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: t.events.deleteError,
        description: t.events.deleteErrorDesc,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      image: "",
      maxParticipants: "",
    })
    setEditingEvent(null)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(getCurrentLanguage(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="mb-2 font-serif text-4xl font-bold">{t.events.adminTitle}</h1>
                <p className="text-muted-foreground">{t.events.adminSubtitle}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.events.createEvent}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? t.events.editEvent : t.events.createEvent}</DialogTitle>
                    <DialogDescription>
                      {editingEvent ? t.events.editEventDesc : t.events.createEventDesc}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t.events.eventTitle}</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">{t.events.eventDescription}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">{t.events.eventDate}</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">{t.events.eventTime}</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t.events.eventLocation}</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">{t.events.eventImage}</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="/community-event.png"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxParticipants">{t.events.maxParticipants}</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                        placeholder={t.events.unlimited}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        {t.events.cancel}
                      </Button>
                      <Button type="submit">{editingEvent ? t.events.update : t.events.create}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 animate-pulse bg-muted" />
                    <CardHeader>
                      <div className="h-6 animate-pulse rounded bg-muted" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t.events.noEventsAdmin}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    {event.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-balance">{event.title}</CardTitle>
                      <CardDescription className="text-pretty">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
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
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.registeredParticipants.length} / {event.maxParticipants}
                          </span>
                          {event.registeredParticipants.length >= event.maxParticipants && (
                            <Badge variant="destructive" className="ml-auto">
                              {t.events.full}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {t.events.edit}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        onClick={() => handleDelete(event.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.events.delete}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
