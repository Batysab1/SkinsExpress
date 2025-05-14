import { type NextRequest, NextResponse } from "next/server"

// Steam API key
const STEAM_API_KEY = "DC86BB41E1A081AF3DB72F6A20762E31"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())

    // Validate the OpenID response
    if (params["openid.mode"] === "id_res" && params["openid.claimed_id"]) {
      // Extract the Steam ID from the claimed_id
      const steamId = params["openid.claimed_id"].split("/").pop()

      if (steamId) {
        // Fetch user data from Steam API
        const userDataResponse = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`,
        )

        const userData = await userDataResponse.json()
        const player = userData.response.players[0]

        // Create a redirect URL with the user data
        const redirectUrl = new URL("/?login=success", request.url)

        // Add user data to the URL as a parameter
        redirectUrl.searchParams.set("userData", JSON.stringify(player))

        return NextResponse.redirect(redirectUrl)
      }
    }

    // If validation fails or no Steam ID is found
    return NextResponse.redirect(new URL("/?login=failed", request.url))
  } catch (error) {
    console.error("Steam authentication error:", error)
    return NextResponse.redirect(new URL("/?login=error", request.url))
  }
}
