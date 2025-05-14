"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export default function SteamLoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    setIsLoggedIn(isAuthenticated())

    // Check for login success in URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const loginStatus = urlParams.get("login")
    const userData = urlParams.get("userData")

    if (loginStatus === "success" && userData) {
      try {
        // Store user data in localStorage
        localStorage.setItem("steamUser", userData)
        setIsLoggedIn(true)

        // Remove the query parameters from URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error("Error storing user data:", error)
      }
    }
  }, [])

  // Steam OpenID authentication URL
  const steamAuthUrl = "https://steamcommunity.com/openid/login"
  const realm = typeof window !== "undefined" ? window.location.origin : ""
  const returnTo = `${realm}/api/auth/steam/callback`

  // Construct the Steam login URL with the API key
  const loginUrl = `${steamAuthUrl}?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=${encodeURIComponent(returnTo)}&openid.realm=${encodeURIComponent(realm)}&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`

  const handleLogout = () => {
    localStorage.removeItem("steamUser")
    setIsLoggedIn(false)
    router.refresh()
  }

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 shadow-lg"
      >
        <div className="relative w-6 h-6 flex-shrink-0">
          <Image
            src="/steam-logo.png"
            alt="Steam Logo"
            width={24}
            height={24}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-medium">Cerrar sesión</span>
      </button>
    )
  }

  return (
    <a
      href={loginUrl}
      className="flex items-center gap-2 bg-[#1b2838] hover:bg-[#2a475e] text-white px-4 py-2 rounded-md transition-all duration-200 hover:scale-105 shadow-lg"
    >
      <div className="relative w-6 h-6 flex-shrink-0">
        <Image src="/steam-logo.png" alt="Steam Logo" width={24} height={24} className="w-full h-full object-contain" />
      </div>
      <span className="font-medium">Iniciar sesión con Steam</span>
    </a>
  )
}
