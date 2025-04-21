import Calendar from "@/components/calendar"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Calendar App</h1>
      <Calendar />
    </main>
  )
}
