export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  description: string
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
}
