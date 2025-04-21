"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Event } from "@/lib/types"
import { formatDateForInput } from "@/lib/date-utils"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Event) => void
  onDelete: (id: string) => void
  selectedDate: Date | null
  event: Event | null
}

export default function EventModal({ isOpen, onClose, onSave, onDelete, selectedDate, event }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (selectedDate) {
      setDate(formatDateForInput(selectedDate))
    }

    if (event) {
      setTitle(event.title)
      setDate(formatDateForInput(new Date(event.date)))
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setDescription(event.description)
    } else {
      setTitle("")
      setStartTime("09:00")
      setEndTime("10:00")
      setDescription("")
    }
  }, [selectedDate, event, isOpen])

  const handleSave = () => {
    if (!title.trim() || !date) return

    const newEvent: Event = {
      id: event?.id || crypto.randomUUID(),
      title,
      date: new Date(date).toISOString(),
      startTime,
      endTime,
      description,
    }

    onSave(newEvent)
  }

  const handleDelete = () => {
    if (event) {
      onDelete(event.id)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Add Event"}</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {event && (
            <Button variant="destructive" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            {event ? "Update" : "Create"} Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
