"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import EventModal from "./event-modal"
import type { Event } from "@/lib/types"
import { generateDates, formatDate } from "@/lib/date-utils"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Load events from localStorage on initial render
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    }
  }, [])

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events))
  }, [events])

  const { days, monthYear } = generateDates(currentDate)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleAddEvent = (event: Event) => {
    if (editingEvent) {
      // Update existing event
      setEvents(events.map((e) => (e.id === editingEvent.id ? event : e)))
    } else {
      // Add new event
      setEvents([...events, event])
    }
    setIsModalOpen(false)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedDate(new Date(event.date))
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={handlePrevMonth} className="hover:bg-blue-100 border-blue-200">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">{monthYear}</h2>
        <Button variant="outline" onClick={handleNextMonth} className="hover:bg-blue-100 border-blue-200">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-medium mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dateEvents = getEventsForDate(day.date)
          const isCurrentMonth = day.date.getMonth() === currentDate.getMonth()
          const isToday = formatDate(day.date) === formatDate(new Date())

          return (
            <Card
              key={index}
              className={`min-h-[100px] p-2 cursor-pointer transition-colors ${
                isCurrentMonth ? "bg-card" : "bg-muted/50"
              } ${isToday ? "border-primary" : ""}`}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="text-right mb-1">
                <span className={`text-sm ${isCurrentMonth ? "" : "text-muted-foreground"}`}>{day.date.getDate()}</span>
              </div>
              <div className="space-y-1">
                {dateEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded bg-primary/10 truncate hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditEvent(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dateEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{dateEvents.length - 3} more</div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      <Button
        className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        onClick={() => {
          setSelectedDate(new Date())
          setEditingEvent(null)
          setIsModalOpen(true)
        }}
      >
        <Plus className="h-4 w-4" /> Add Event
      </Button>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
        onDelete={handleDeleteEvent}
        selectedDate={selectedDate}
        event={editingEvent}
      />
    </div>
  )
}
