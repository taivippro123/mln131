// Quiz API Service - Kết nối với MockAPI
const MOCKAPI_BASE_URL = 'https://690dc7b5bd0fefc30a024dfa.mockapi.io/quiz'

export const quizApi = {
  // Lấy tất cả câu hỏi theo stage
  async getQuestionsByStage(stageId) {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}?stage=${stageId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching questions:', error)
      throw error
    }
  },

  // Lấy tất cả câu hỏi (toàn bộ quiz data)
  async getAllQuestions() {
    try {
      const response = await fetch(MOCKAPI_BASE_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      
      // Transform data to match the quiz.json format
      const transformedData = {
        'Stage 1': [],
        'Stage 2': [],
        'Stage 3': [],
        'Stage 4': [],
        'Stage 5': []
      }
      
      // Group questions by stage
      data.forEach(item => {
        const stageName = `Stage ${item.stage}`
        if (transformedData[stageName]) {
          transformedData[stageName].push({
            questionNumber: item.questionNumber,
            question: item.question,
            options: item.options,
            answer: item.answer,
            explanation: item.explanation
          })
        }
      })
      
      // Sort questions by questionNumber within each stage
      Object.keys(transformedData).forEach(stage => {
        transformedData[stage].sort((a, b) => a.questionNumber - b.questionNumber)
      })
      
      return transformedData
    } catch (error) {
      console.error('Error fetching all questions:', error)
      throw error
    }
  },

  // Thêm câu hỏi mới (nếu cần)
  async addQuestion(questionData) {
    try {
      const response = await fetch(MOCKAPI_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error adding question:', error)
      throw error
    }
  },

  // Cập nhật câu hỏi (nếu cần)
  async updateQuestion(id, questionData) {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating question:', error)
      throw error
    }
  },

  // Xóa câu hỏi (nếu cần)
  async deleteQuestion(id) {
    try {
      const response = await fetch(`${MOCKAPI_BASE_URL}/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error deleting question:', error)
      throw error
    }
  }
}

export default quizApi

