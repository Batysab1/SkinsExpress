"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { isTrader } from "@/lib/auth"
import { ArrowLeft, Search, MessageCircle, CheckCircle, Clock } from "lucide-react"

type Ticket = {
  id: number
  title: string
  date: string
  status: "pending" | "in-progress" | "completed"
  type: string
  message?: string
  skin?: string
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is a trader/admin
    const traderStatus = isTrader()
    setIsAdmin(traderStatus)

    // If not a trader, redirect to home page
    if (!traderStatus) {
      router.push("/")
      return
    }

    // Load tickets from localStorage
    const storedTickets = localStorage.getItem("tickets")
    if (storedTickets) {
      const parsedTickets = JSON.parse(storedTickets)
      setTickets(parsedTickets)
      setFilteredTickets(parsedTickets)
    }
  }, [router])

  // Filter tickets based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTickets(tickets)
      return
    }

    const filtered = tickets.filter(
      (ticket) =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toString().includes(searchTerm) ||
        ticket.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredTickets(filtered)
  }, [searchTerm, tickets])

  const handleStatusChange = (ticketId: number, newStatus: "pending" | "in-progress" | "completed") => {
    const updatedTickets = tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))

    setTickets(updatedTickets)
    setFilteredTickets(updatedTickets)

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus })
    }

    // Update localStorage
    localStorage.setItem("tickets", JSON.stringify(updatedTickets))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/80 hover:bg-yellow-600/80"
      case "in-progress":
        return "bg-blue-500/80 hover:bg-blue-600/80"
      case "completed":
        return "bg-green-500/80 hover:bg-green-600/80"
      default:
        return "bg-gray-500/80 hover:bg-gray-600/80"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "in-progress":
        return "En Proceso"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  // If not an admin, don't render the dashboard
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-0Is4KdsfvT3ztXg6dmbWOfHrVS64xu.png"
          alt="Mediterranean Courtyard Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <header className="border-b border-gray-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Volver al Inicio</span>
              </Link>
              <h1 className="text-2xl font-bold text-blue-400">Panel de Administración</h1>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-sm bg-black/40 rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Tickets</h2>

                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar tickets..."
                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Ticket Filters */}
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="w-full bg-gray-800/50">
                    <TabsTrigger value="all" className="flex-1">
                      Todos
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="flex-1">
                      Pendientes
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="flex-1">
                      En Proceso
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex-1">
                      Completados
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredTickets.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No hay tickets disponibles</p>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedTicket?.id === ticket.id
                              ? "bg-blue-900/50 border border-blue-500"
                              : "bg-gray-800/50 hover:bg-gray-700/50"
                          }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium truncate">{ticket.title}</h3>
                            <Badge className={`${getStatusColor(ticket.status)}`}>{getStatusText(ticket.status)}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>#{ticket.id}</span>
                            <span>{ticket.date}</span>
                            <span>{ticket.type}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="pending" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredTickets.filter((t) => t.status === "pending").length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No hay tickets pendientes</p>
                    ) : (
                      filteredTickets
                        .filter((t) => t.status === "pending")
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedTicket?.id === ticket.id
                                ? "bg-blue-900/50 border border-blue-500"
                                : "bg-gray-800/50 hover:bg-gray-700/50"
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium truncate">{ticket.title}</h3>
                              <Badge className="bg-yellow-500/80">Pendiente</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>#{ticket.id}</span>
                              <span>{ticket.date}</span>
                              <span>{ticket.type}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>

                  <TabsContent value="in-progress" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredTickets.filter((t) => t.status === "in-progress").length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No hay tickets en proceso</p>
                    ) : (
                      filteredTickets
                        .filter((t) => t.status === "in-progress")
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedTicket?.id === ticket.id
                                ? "bg-blue-900/50 border border-blue-500"
                                : "bg-gray-800/50 hover:bg-gray-700/50"
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium truncate">{ticket.title}</h3>
                              <Badge className="bg-blue-500/80">En Proceso</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>#{ticket.id}</span>
                              <span>{ticket.date}</span>
                              <span>{ticket.type}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {filteredTickets.filter((t) => t.status === "completed").length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No hay tickets completados</p>
                    ) : (
                      filteredTickets
                        .filter((t) => t.status === "completed")
                        .map((ticket) => (
                          <div
                            key={ticket.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedTicket?.id === ticket.id
                                ? "bg-blue-900/50 border border-blue-500"
                                : "bg-gray-800/50 hover:bg-gray-700/50"
                            }`}
                            onClick={() => setSelectedTicket(ticket)}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium truncate">{ticket.title}</h3>
                              <Badge className="bg-green-500/80">Completado</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>#{ticket.id}</span>
                              <span>{ticket.date}</span>
                              <span>{ticket.type}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div className="backdrop-blur-sm bg-black/40 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-blue-400">{selectedTicket.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                        <span>ID: #{selectedTicket.id}</span>
                        <span>Fecha: {selectedTicket.date}</span>
                        <span>Tipo: {selectedTicket.type}</span>
                        <Badge className={`${getStatusColor(selectedTicket.status)}`}>
                          {getStatusText(selectedTicket.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => handleStatusChange(selectedTicket.id, "pending")}
                        disabled={selectedTicket.status === "pending"}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Pendiente
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStatusChange(selectedTicket.id, "in-progress")}
                        disabled={selectedTicket.status === "in-progress"}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        En Proceso
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusChange(selectedTicket.id, "completed")}
                        disabled={selectedTicket.status === "completed"}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completado
                      </Button>
                    </div>
                  </div>

                  {selectedTicket.skin && (
                    <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-300 mb-2">Skin Solicitada:</h3>
                      <p className="text-white">{selectedTicket.skin}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Mensaje del Usuario:</h3>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-white">{selectedTicket.message || "No hay mensaje disponible."}</p>
                    </div>
                  </div>

                  {/* Chat Section */}
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium mb-4">Conversación</h3>
                    <AdminTicketChat ticketId={selectedTicket.id} />
                  </div>
                </div>
              ) : (
                <div className="backdrop-blur-sm bg-black/40 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                  <MessageCircle className="h-16 w-16 text-gray-500 mb-4" />
                  <h2 className="text-xl font-medium text-gray-300 mb-2">Selecciona un ticket</h2>
                  <p className="text-gray-400 text-center">
                    Selecciona un ticket de la lista para ver los detalles y responder al usuario.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminTicketChat({ ticketId }: { ticketId: number }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hola, estoy interesado en comprar una AWP Dragon Lore", time: "11:32" },
    {
      id: 2,
      sender: "trader",
      text: "Hola, gracias por contactarnos. Tenemos disponibilidad. ¿Qué desgaste estás buscando?",
      time: "11:33",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "trader",
        text: newMessage,
        time,
      },
    ])

    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-900/50 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "trader" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === "trader" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{message.sender === "trader" ? "Tú (Trader)" : "Usuario"}</span>
                <span className="text-xs opacity-70 ml-2">{message.time}</span>
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-gray-800/70 border-gray-700 text-white"
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Enviar
        </Button>
      </form>
    </div>
  )
}
