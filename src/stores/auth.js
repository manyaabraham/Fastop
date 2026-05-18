import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const signUp = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      user.value = data.user
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    user.value = user
  }

  return { user, loading, signUp, signIn, signOut, checkUser }
})