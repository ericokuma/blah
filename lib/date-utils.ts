export function generateDates(currentDate: Date) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of the month
  const firstDay = new Date(year, month, 1)

  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0)

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay()

  // Calculate days from previous month to show
  const daysFromPrevMonth = firstDayOfWeek

  // Calculate total days to show (max 42 for 6 weeks)
  const totalDays = 42

  const days = []

  // Add days from previous month
  const prevMonth = new Date(year, month - 1, 1)
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
    days.push({
      date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), i),
      isCurrentMonth: false,
    })
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
    })
  }

  // Add days from next month
  const remainingDays = totalDays - days.length
  const nextMonth = new Date(year, month + 1, 1)

  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i),
      isCurrentMonth: false,
    })
  }

  // Format month and year for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const monthYear = `${monthNames[month]} ${year}`

  return { days, monthYear }
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

export function formatDateForInput(date: Date): string {
  return formatDate(date)
}
