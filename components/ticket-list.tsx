"use client"

import { Input } from "@/components/ui/input"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getUserTickets } from "@/lib/tickets"
import type { Ticket } from "@/lib/tickets"
import { useToast } from "@/hooks/use-toast"

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showChat, setShowChat] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true)
      try {
        const user = getCurrentUser()
        setCurrentUser(user)

        if (user) {
          const userTickets = await getUserTickets(user.id)
          setTickets(userTickets)
        }
      } catch (error) {
        console.error("Error loading tickets:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los tickets",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTickets()
  }, [toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-500/80 hover:bg-yellow-600/80"
      case "in_progress":
        return "bg-blue-500/80 hover:bg-blue-600/80"
      case "closed":
        return "bg-green-500/80 hover:bg-green-600/80"
      default:
        return "bg-gray-500/80 hover:bg-gray-600/80"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "open":
        return "Pendiente"
      case "in_progress":
        return "En Proceso"
      case "closed":
        return "Completado"
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "purchase":
        return "Compra"
      case "sale":
        return "Venta"
      case "trade":
        return "Intercambio"
      case "support":
        return "Soporte"
      case "other":
        return "Otro"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="backdrop-blur-sm bg-black/40 rounded-lg p-6 text-center">
        <p className="text-gray-400">Cargando tickets...</p>
      </div>
    )
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
                  <span>ID: #{ticket.id.substring(0, 8)}</span>
                  <span>Fecha: {new Date(ticket.created_at).toLocaleDateString()}</span>
                  <span>Tipo: {getTypeText(ticket.type)}</span>
                  {ticket.skin && <span>Skin: {ticket.skin}</span>}
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
                <div className="flex flex-col h-80">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-center text-gray-400 py-4">Funcionalidad de chat en desarrollo...</div>
                  </div>

                  <form className="flex gap-2">
                    <Input
                      placeholder="Escribe un mensaje..."
                      className="flex-1 bg-gray-800/70 border-gray-700 text-white"
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Enviar
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
