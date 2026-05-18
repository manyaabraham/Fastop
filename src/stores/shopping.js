import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const useShoppingStore = defineStore('shopping', () => {
  const lists = ref([])
  const currentList = ref(null)
  const items = ref([])

  const fetchLists = async () => {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) lists.value = data
  }

  const createList = async (name) => {
    const user = (await supabase.auth.getUser()).data.user
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([{ name, user_id: user.id }])
      .select()
    
    if (!error && data) {
      lists.value.unshift(data[0])
      return data[0]
    }
    return null
  }

  const deleteList = async (id) => {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', id)
    
    if (!error) {
      lists.value = lists.value.filter(l => l.id !== id)
      return true
    }
    return false
  }

  const fetchItems = async (listId) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('list_id', listId)
    
    if (!error) items.value = data
  }

  const addItem = async (item) => {
    const user = (await supabase.auth.getUser()).data.user
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{ ...item, user_id: user.id }])
      .select()
    
    if (!error && data) {
      items.value.push(data[0])
      return data[0]
    }
    return null
  }

  const updateItem = async (id, updates) => {
    const { data, error } = await supabase
      .from('shopping_items')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (!error && data) {
      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) items.value[index] = data[0]
      return data[0]
    }
    return null
  }

  const deleteItem = async (id) => {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', id)
    
    if (!error) {
      items.value = items.value.filter(i => i.id !== id)
      return true
    }
    return false
  }

  return { lists, currentList, items, fetchLists, createList, deleteList, fetchItems, addItem, updateItem, deleteItem }
})