import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase/client'

export const useBudgetStore = defineStore('budget', () => {
  const budget = ref(null)

  const fetchBudget = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (!error && data) {
      budget.value = data
    } else {
      const { data: newBudget } = await supabase
        .from('budgets')
        .insert([{ user_id: user.id, budget_amount: 500000, spent_amount: 0 }])
        .select()
        .single()
      budget.value = newBudget
    }
  }

  const updateBudget = async (amount) => {
    const { data, error } = await supabase
      .from('budgets')
      .update({ budget_amount: amount })
      .eq('id', budget.value.id)
      .select()
    
    if (!error && data) {
      budget.value = data[0]
      return true
    }
    return false
  }

  const updateSpent = async (amount) => {
    const newSpent = budget.value.spent_amount + amount
    const { error } = await supabase
      .from('budgets')
      .update({ spent_amount: newSpent })
      .eq('id', budget.value.id)
    
    if (!error) {
      budget.value.spent_amount = newSpent
      return true
    }
    return false
  }

  return { budget, fetchBudget, updateBudget, updateSpent }
})