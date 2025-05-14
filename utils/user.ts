import { isAuthenticated, getUserData } from "@/lib/auth"

// Lista de IDs de Steam de los traders (administradores)
const TRADER_IDS = [
  // Añade aquí los IDs de Steam de los traders
  // Por ejemplo: "76561198012345678"
]

/**
 * Verifica si el usuario actual es un trader (administrador)
 * @returns {boolean} true si el usuario es un trader, false en caso contrario
 */
export function isTrader(): boolean {
  if (!isAuthenticated()) {
    return false
  }

  const userData = getUserData()
  if (!userData || !userData.steamid) {
    return false
  }

  // Si la lista está vacía, consideramos que todos los usuarios autenticados son traders (solo para desarrollo)
  if (TRADER_IDS.length === 0) {
    return true
  }

  return TRADER_IDS.includes(userData.steamid)
}

/**
 * Verifica si el usuario actual está autenticado y tiene un ID de Steam
 * @returns {boolean} true si el usuario está autenticado y tiene un ID de Steam, false en caso contrario
 */
export function hasValidSteamId(): boolean {
  if (!isAuthenticated()) {
    return false
  }

  const userData = getUserData()
  return Boolean(userData && userData.steamid)
}
