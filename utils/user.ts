import { isAuthenticated, getCurrentUser } from "@/lib/auth"

// List of Steam IDs of traders (administrators)
// This should be populated with actual Steam IDs of administrators
const TRADER_IDS = [
  // Add Steam IDs of traders here
  // For example: "76561198012345678"
]

/**
 * Checks if the current user is a trader (administrator)
 * @returns {boolean} true if the user is a trader, false otherwise
 */
export function isTrader(): boolean {
  if (!isAuthenticated()) {
    return false
  }

  const userData = getCurrentUser()
  if (!userData || !userData.steamid) {
    return false
  }

  // If the list is empty, consider all authenticated users as traders (only for development)
  if (TRADER_IDS.length === 0) {
    return true
  }

  return TRADER_IDS.includes(userData.steamid)
}

/**
 * Checks if the current user is authenticated and has a Steam ID
 * @returns {boolean} true if the user is authenticated and has a Steam ID, false otherwise
 */
export function hasValidSteamId(): boolean {
  if (!isAuthenticated()) {
    return false
  }

  const userData = getCurrentUser()
  return Boolean(userData && userData.steamid)
}
