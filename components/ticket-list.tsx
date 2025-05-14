"use client"

import { Input } from "@/components/ui/input"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

type Ticket = {
  id: number
  title: string
  date: string
  status: "pending" | "in-progress" | "completed"
  type: string
  message?: string
  skin?: string
}

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showChat, setShowChat] = useState<number | null>(null)

  // Load tickets from localStorage on component mount
  useEffect(() => {
    const storedTickets = localStorage.getItem("tickets")
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets))
    } else {
      // Sample ticket data if no tickets in localStorage
      const sampleTickets: Ticket[] = [
        {
          id: 1,
          title: "Compra de AWP Dragon Lore",
          date: "12/05/2025",
          status: "in-progress",
          type: "Compra",
        },
        {
          id: 2,
          title: "Venta de Karambit Doppler",
          date: "10/05/2025",
          status: "pending",
          type: "Venta",
        },
        {
          id: 3,
          title: "Problema con pago",
          date: "05/05/2025",
          status: "completed",
          type: "Soporte",
        },
      ]
      setTickets(sampleTickets)
      localStorage.setItem("tickets", JSON.stringify(sampleTickets))
    }
  }, [])

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

  return (
    <div className="space-y-4">
      {tickets.length === 0 ? (
        <div className="text-center py-8 backdrop-blur-sm bg-black/30 rounded-lg">
          <p className="text-gray-400 mb-4">No tienes tickets activos</p>
          <Link href="/tickets/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Crear Ticket</Button>
          </Link>
        </div>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="backdrop-blur-sm bg-black/40 rounded-lg overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-white">{ticket.title}</h3>
                  <Badge className={`${getStatusColor(ticket.status)}`}>{getStatusText(ticket.status)}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>ID: #{ticket.id}</span>
                  <span>Fecha: {ticket.date}</span>
                  <span>Tipo: {ticket.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowChat(showChat === ticket.id ? null : ticket.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>

            {showChat === ticket.id && (
              <div className="border-t border-gray-700 p-4">
                <LiveChat ticketId={ticket.id} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function LiveChat({ ticketId }: { ticketId: number }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "trader", text: "Hola, ¿en qué puedo ayudarte?", time: "11:30" },
    { id: 2, sender: "user", text: "Hola, estoy interesado en comprar una AWP Dragon Lore", time: "11:32" },
    { id: 3, sender: "trader", text: "Perfecto, tenemos disponibilidad. ¿Qué desgaste estás buscando?", time: "11:33" },
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
        sender: "user",
        text: newMessage,
        time,
      },
    ])

    setNewMessage("")

    // Simulate trader response
    setTimeout(() => {
      const traderResponse = {
        id: messages.length + 2,
        sender: "trader",
        text: "Gracias por tu mensaje. Un trader te responderá en breve.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, traderResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-80">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-900/50 rounded-lg">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{message.sender === "user" ? "Tú" : "Trader"}</span>
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
