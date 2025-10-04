import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for events (in production, use a database)
const events: Array<{
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
}> = [
  {
    id: "1",
    title: "Йога и медитация на рассвете",
    description:
      "Присоединяйтесь к нашей утренней практике йоги и медитации. Начните день с гармонии и энергии в окружении единомышленников.",
    date: "2025-05-15",
    time: "07:00",
    location: "Парк Шевченко, центральная поляна",
    image: "/yoga-meditation-sunrise-park.jpg",
    maxParticipants: 20,
    registeredParticipants: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Пикник с мастер-классом по массажу",
    description:
      "Приятный день на природе с обучением базовым техникам массажа. Узнайте, как помочь близким расслабиться и снять напряжение.",
    date: "2025-05-22",
    time: "12:00",
    location: "Ботанический сад, зона отдыха",
    image: "/picnic-outdoor-massage-workshop-nature.jpg",
    maxParticipants: 30,
    registeredParticipants: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Вечер ароматерапии и релаксации",
    description:
      "Погрузитесь в мир ароматов и узнайте о целебных свойствах эфирных масел. Практические упражнения по релаксации и снятию стресса.",
    date: "2025-06-05",
    time: "18:00",
    location: "Спа Салон, главный зал",
    image: "/aromatherapy-essential-oils-relaxation-spa.jpg",
    maxParticipants: 15,
    registeredParticipants: [],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      const event = events.find((e) => e.id === id)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }
      return NextResponse.json(event)
    }

    // Return all events sorted by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return NextResponse.json(sortedEvents)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, time, location, image, maxParticipants, action, eventId, userId } = body

    // Handle registration
    if (action === "register" && eventId && userId) {
      const event = events.find((e) => e.id === eventId)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      // Check if already registered
      if (event.registeredParticipants.includes(userId)) {
        return NextResponse.json({ error: "Already registered" }, { status: 400 })
      }

      // Check if event is full
      if (event.maxParticipants && event.registeredParticipants.length >= event.maxParticipants) {
        return NextResponse.json({ error: "Event is full" }, { status: 400 })
      }

      event.registeredParticipants.push(userId)
      return NextResponse.json({ success: true, event })
    }

    // Handle unregistration
    if (action === "unregister" && eventId && userId) {
      const event = events.find((e) => e.id === eventId)
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 })
      }

      event.registeredParticipants = event.registeredParticipants.filter((id) => id !== userId)
      return NextResponse.json({ success: true, event })
    }

    // Create new event
    if (!title || !description || !date || !time || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      date,
      time,
      location,
      image: image || undefined,
      maxParticipants: maxParticipants || undefined,
      registeredParticipants: [],
      createdAt: new Date().toISOString(),
    }

    events.push(newEvent)
    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating event:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, date, time, location, image, maxParticipants } = body

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const eventIndex = events.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    events[eventIndex] = {
      ...events[eventIndex],
      title: title || events[eventIndex].title,
      description: description || events[eventIndex].description,
      date: date || events[eventIndex].date,
      time: time || events[eventIndex].time,
      location: location || events[eventIndex].location,
      image: image !== undefined ? image : events[eventIndex].image,
      maxParticipants: maxParticipants !== undefined ? maxParticipants : events[eventIndex].maxParticipants,
    }

    return NextResponse.json(events[eventIndex])
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    const eventIndex = events.findIndex((e) => e.id === id)
    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    events.splice(eventIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}
