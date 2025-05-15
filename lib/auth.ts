import { supabase } from "./supabase"

// Guardar datos del usuario de Steam en Supabase
export async function saveUserData(steamUser: any): Promise<any> {
  if (!steamUser || !steamUser.steamid) {
    console.error("No se proporcionaron datos de usuario válidos")
    return null
  }

  try {
    // Verificar si el usuario ya existe
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("steam_id", steamUser.steamid)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error al buscar usuario:", fetchError)
      return null
    }

    // Crear objeto con datos del usuario
    const userData = {
      steam_id: steamUser.steamid,
      username: steamUser.personaname,
      avatar_url: steamUser.avatarfull || steamUser.avatar,
      last_login: new Date().toISOString(),
    }

    if (existingUser) {
      // Actualizar usuario existente
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update(userData)
        .eq("steam_id", steamUser.steamid)
        .select()
        .single()

      if (updateError) {
        console.error("Error al actualizar usuario:", updateError)
        return null
      }

      // Iniciar sesión con el usuario existente
      await supabase.auth
        .signInWithPassword({
          email: `${steamUser.steamid}@steam.user`,
          password: steamUser.steamid,
        })
        .catch(async (err) => {
          // Si falla el inicio de sesión, intentar crear el usuario
          if (err.message.includes("Invalid login credentials")) {
            await supabase.auth.signUp({
              email: `${steamUser.steamid}@steam.user`,
              password: steamUser.steamid,
              options: {
                data: {
                  steam_id: steamUser.steamid,
                  username: steamUser.personaname,
                },
              },
            })
          }
        })

      return updatedUser
    } else {
      // Crear nuevo usuario
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          ...userData,
          is_admin: false, // Por defecto, los nuevos usuarios no son administradores
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error al crear usuario:", insertError)
        return null
      }

      // Crear usuario en auth
      await supabase.auth.signUp({
        email: `${steamUser.steamid}@steam.user`,
        password: steamUser.steamid,
        options: {
          data: {
            steam_id: steamUser.steamid,
            username: steamUser.personaname,
          },
        },
      })

      return newUser
    }
  } catch (error) {
    console.error("Error al guardar datos de usuario:", error)
    return null
  }
}

// Verificar si el usuario es administrador
export async function isAdmin(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data } = await supabase.from("users").select("is_admin").eq("id", user.id).single()

    return data?.is_admin || false
  } catch (error) {
    console.error("Error al verificar si el usuario es administrador:", error)
    return false
  }
}

// Alias para isAdmin para mantener compatibilidad
export async function isTrader(): Promise<boolean> {
  return isAdmin()
}

// Obtener el usuario actual
export async function getCurrentUser() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data } = await supabase.from("users").select("*").eq("id", user.id).single()

    return data
  } catch (error) {
    console.error("Error al obtener usuario actual:", error)
    return null
  }
}

// Cerrar sesión
export async function logout() {
  try {
    await supabase.auth.signOut()
    return true
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return false
  }
}

// Verificar si el usuario está autenticado
export async function isAuthenticated(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return !!user
  } catch (error) {
    console.error("Error al verificar autenticación:", error)
    return false
  }
}
