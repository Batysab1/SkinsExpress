"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoonIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import CookieConsent from "@/components/cookie-consent"
import SkinSlider from "@/components/skin-slider"
import SteamLoginButton from "@/components/steam-login-button"
import AdminNav from "@/components/admin-nav"
import FaqSection from "@/components/faq-section"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { isAuthenticated } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Check for login status in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const loginStatus = urlParams.get("login")

    if (loginStatus === "success") {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión con Steam correctamente.",
        variant: "default",
      })

      // Remove the query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (loginStatus === "failed" || loginStatus === "error") {
      toast({
        title: "Error de inicio de sesión",
        description: "No se pudo iniciar sesión con Steam. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })

      // Remove the query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (loginStatus === "required") {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión con Steam para poder abrir un ticket.",
        variant: "destructive",
      })

      // Remove the query parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [toast])

  const handleTicketClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (isAuthenticated()) {
      // User is authenticated, navigate to ticket creation page
      router.push("/tickets/new")
    } else {
      // User is not authenticated, show notification
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión con Steam para poder abrir un ticket.",
        variant: "destructive",
      })
    }
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
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <header className="border-b border-gray-800/50 bg-black">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-400">SkinsExpress</h1>
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    if (isAuthenticated()) {
                      router.push("/tickets")
                    } else {
                      toast({
                        title: "Inicio de sesión requerido",
                        description: "Debes iniciar sesión con Steam para acceder a tus tickets.",
                        variant: "destructive",
                      })
                    }
                  }}
                  className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-105 font-medium"
                >
                  Tickets
                </button>
                <a
                  href="#faq"
                  className="text-green-400 hover:text-green-300 transition-all duration-200 hover:scale-105 font-medium uppercase"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
                  }}
                >
                  FAQ
                </a>
                <SteamLoginButton />
                <button className="text-white p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/70 transition-all duration-200 hover:scale-105">
                  <MoonIcon className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Admin Navigation */}
        <AdminNav />

        {/* Announcement Banner */}
        <div className="bg-red-700 text-white py-2 text-center font-medium">
          ¡APROVECHA LA APERTURA DE LA PAGINA BONUS DEL 5% AL VENDER TUS SKINS!
        </div>

        {/* Hero Section */}
        <section className="relative">
          <div className="py-24">
            <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 backdrop-blur-sm bg-black/30 p-8 rounded-lg">
                <h1 className="text-5xl md:text-6xl font-bold">
                  BIENVENIDOS A <br />
                  <span className="text-blue-400">SKINSEXPRESS</span>
                </h1>
                <p className="text-lg text-green-300 max-w-md">
                  Tu mercado de confianza donde podrás vender y comprar skins de CS a algunos de los mejores precios.
                </p>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md uppercase font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl"
                  onClick={handleTicketClick}
                >
                  Abrir Ticket
                </Button>
              </div>
              <div className="flex justify-center">
                <SkinSlider />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Compra Segura",
                  description: "Todas las transacciones son seguras y verificadas por nuestro equipo.",
                },
                {
                  title: "Soporte 24/7",
                  description: "Nuestro equipo de soporte está disponible las 24 horas para ayudarte.",
                },
                {
                  title: "Mejores Precios",
                  description: "Ofrecemos algunos de los mejores precios del mercado para tus skins.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="backdrop-blur-sm bg-black/40 p-8 rounded-lg text-center hover:bg-black/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="flex justify-center mb-4">
                    <Image src="/dollar-icon.png" alt="Icono de dólar" width={48} height={48} className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-blue-400">{item.title}</h3>
                  <p className="text-green-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />

        {/* Contact Section */}
        <section className="py-16 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-blue-400">CONTACTO</h2>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-md uppercase font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-blue-500/20 hover:shadow-xl"
              onClick={handleTicketClick}
            >
              Abrir Ticket
            </Button>
          </div>
        </section>
      </div>

      {/* Cookie Consent */}
      <CookieConsent />
      <Toaster />
    </div>
  )
}
