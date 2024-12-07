import { defineStore } from 'pinia'
import { addDoc, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { format, differenceInDays } from 'date-fns'

export const useHabitStore = defineStore('habitStore', {
    state: () => ({
        habits: [],
    }),
    actions: {
        async fetchHabits() {
            const { $db } = useNuxtApp()
            const snapshot = await getDocs(collection($db, 'habits'))
            this.habits = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        },

        async addHabit(name) {
            const { $db } = useNuxtApp()

            const habit = {
                name,
                completions: [],
                streak: 0
            }

            const docRef = await addDoc(collection($db, 'habits'), habit)
            this.habits.push({ id: docRef.id, ...habit })
        },

        async updateHabit(id, updates) {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'habits', id)
            await updateDoc(docRef, updates)
            const index = this.habits.findIndex((habit) => habit.id === id)
            if (index !== -1) {
                this.habits[index] = { ...this.habits[index], ...updates }
            }
        },

        async deleteHabit(id) {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'habits', id)
            await deleteDoc(docRef)
            this.habits = this.habits.filter((habit) => habit.id !== id)
        },

        toggleCompletion(habit) {
            const today = format(new Date(), 'yyyy-MM-dd')
            if (habit.completions.includes(today)) {
                habit.completions = habit.completions.filter((date) => date !== today)
            } else {
                habit.completions.push(today)
            }

            habit.streak = this.calculateStreak(habit.completions)

            this.updateHabit(habit.id, {
                completions: habit.completions,
                streak: habit.streak
            })
        },

        calculateStreak(completions) {
            const sortedDates = completions.sort((a, b) => new Date(a) - new Date(b))
            let streak = 0
            let currentDate = new Date()
            for (const date of sortedDates) {
                const diff = differenceInDays(currentDate, new Date(date))
                if (diff > 1) {
                    break
                }
                streak += 1
                currentDate = new Date(date)
            }
            return streak
        }
    }
})