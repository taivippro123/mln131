import { useState, useEffect } from 'react'
import quizApi from '../services/quizApi'

export const useQuizData = () => {
  const [quizData, setQuizData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await quizApi.getAllQuestions()
        setQuizData(data)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch quiz data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizData()
  }, [])

  return { quizData, loading, error }
}

export default useQuizData

