import { type NextRequest, NextResponse } from "next/server"
import { saveUserData } from "@/lib/auth"

// Steam API key - en producción, esto debería ser una variable de entorno
const STEAM_API_KEY = process.env.STEAM_API_KEY || ""

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())

    // Validar la respuesta de OpenID
    if (params["openid.mode"] === "id_res" && params["openid.claimed_id"]) {
      // Extraer el Steam ID del claimed_id
      const steamId = params["openid.claimed_id"].split("/").pop()

      if (steamId) {
        console.log("Steam ID:", steamId)
        console.log("Using API Key:", STEAM_API_KEY)

        // Obtener datos de usuario de la API de Steam
        const userDataResponse = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`,
        )

        if (!userDataResponse.ok) {
          console.error("Steam API error:", await userDataResponse.text())
          throw new Error(`Steam API returned ${userDataResponse.status}`)
        }

        const userData = await userDataResponse.json()

        if (!userData.response || !userData.response.players || userData.response.players.length === 0) {
          console.error("No player data returned from Steam API:", userData)
          throw new Error("No player data returned from Steam API")
        }

        const player = userData.response.players[0]
        console.log("Player data:", player)

        // Guardar datos de usuario en Supabase
        const savedUser = await saveUserData(player)

        if (!savedUser) {
          console.error("Error saving user data to Supabase")
        } else {
          console.log("User saved successfully:", savedUser)
        }

        // Determinar la URL base para la redirección
        let baseUrl = process.env.NEXT_PUBLIC_SITE_URL

        if (!baseUrl) {
          // Intentar determinar desde la solicitud
          baseUrl = request.headers.get("origin") || request.headers.get("referer")

          if (!baseUrl) {
            // Último recurso
            baseUrl = "http://localhost:3000"
          } else if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.slice(0, -1)
          }
        }

        console.log("Redirecting to base URL:", baseUrl)

        // Crear una URL de redirección con los datos del usuario
        const redirectUrl = new URL("/", baseUrl)

        // Añadir datos de usuario a la URL como parámetro
        redirectUrl.searchParams.set("login", "success")
        redirectUrl.searchParams.set("userData", JSON.stringify(savedUser || player))

        return NextResponse.redirect(redirectUrl)
      }
    }

    // Si la validación falla o no se encuentra el Steam ID
    console.error("Steam authentication failed:", params)

    // Determinar URL base para redirección de error
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL

    if (!baseUrl) {
      baseUrl = request.headers.get("origin") || request.headers.get("referer")

      if (!baseUrl) {
        baseUrl = "http://localhost:3000"
      } else if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1)
      }
    }

    return NextResponse.redirect(new URL("/?login=failed", baseUrl))
  } catch (error) {
    console.error("Steam authentication error:", error)

    // Determinar URL base para redirección de error
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL

    if (!baseUrl) {
      baseUrl = request.headers.get("origin") || request.headers.get("referer")

      if (!baseUrl) {
        baseUrl = "http://localhost:3000"
      } else if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1)
      }
    }

    return NextResponse.redirect(new URL("/?login=error", baseUrl))
  }
}
