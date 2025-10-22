import { useState, useEffect } from 'react'
import quizData from '/quiz.json'
import PieceCollectedModal from './PieceCollectedModal'
import NotificationModal from './NotificationModal'

const QuizModal = ({ isOpen, onClose, currentStage, onAnswerCorrect, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])
  const [collectedPieces, setCollectedPieces] = useState(0)
  const [availablePieces, setAvailablePieces] = useState([])
  const [showPieceCollected, setShowPieceCollected] = useState(false)
  const [currentPiece, setCurrentPiece] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState({})

  // Puzzle piece configuration
  const puzzleConfig = {
    'Stage 1': {
      folder: 'stage1',
      pieces: [
        'puzzle_piece_1_1.jpg',
        'puzzle_piece_1_2.jpg',
        'puzzle_piece_1_3.jpg',
        'puzzle_piece_2_1.jpg',
        'puzzle_piece_2_2.jpg',
        'puzzle_piece_2_3.jpg',
        'puzzle_piece_3_1.jpg',
        'puzzle_piece_3_2.jpg',
        'puzzle_piece_3_3.jpg'
      ]
    },
    'Stage 2': {
      folder: 'stage2',
      pieces: [
        'giaidoan2_piece_1.jpg',
        'giaidoan2_piece_2.jpg',
        'giaidoan2_piece_3.jpg',
        'giaidoan2_piece_4.jpg',
        'giaidoan2_piece_5.jpg',
        'giaidoan2_piece_6.jpg',
        'giaidoan2_piece_7.jpg',
        'giaidoan2_piece_8.jpg',
        'giaidoan2_piece_9.jpg'
      ]
    },
    'Stage 3': {
      folder: 'stage3',
      pieces: [
        'giaidoan3_piece_1.png',
        'giaidoan3_piece_2.png',
        'giaidoan3_piece_3.png',
        'giaidoan3_piece_4.png',
        'giaidoan3_piece_5.png',
        'giaidoan3_piece_6.png',
        'giaidoan3_piece_7.png',
        'giaidoan3_piece_8.png',
        'giaidoan3_piece_9.png'
      ]
    },
    'Stage 4': {
      folder: 'stage4',
      pieces: [
        'giaidoan4_part_1_1.png',
        'giaidoan4_part_1_2.png',
        'giaidoan4_part_1_3.png',
        'giaidoan4_part_2_1.png',
        'giaidoan4_part_2_2.png',
        'giaidoan4_part_2_3.png',
        'giaidoan4_part_3_1.png',
        'giaidoan4_part_3_2.png',
        'giaidoan4_part_3_3.png'
      ]
    },
    'Stage 5': {
      folder: 'stage5',
      pieces: [
        'giaidoan5_square_part_1_1.png',
        'giaidoan5_square_part_1_2.png',
        'giaidoan5_square_part_1_3.png',
        'giaidoan5_square_part_2_1.png',
        'giaidoan5_square_part_2_2.png',
        'giaidoan5_square_part_2_3.png',
        'giaidoan5_square_part_3_1.png',
        'giaidoan5_square_part_3_2.png',
        'giaidoan5_square_part_3_3.png'
      ]
    }
  }

  useEffect(() => {
    if (isOpen && currentStage) {
      const stageQuestions = quizData[currentStage] || []
      setQuestions(stageQuestions)
      setCurrentQuestionIndex(0)
      setSelectedAnswer('')
      setShowResult(false)
      setScore(0)
      setCollectedPieces(0)
      setShowNotification(false)
      
      // Initialize random piece order
      const config = puzzleConfig[currentStage]
      if (config) {
        // Create shuffled array of piece indices
        const shuffledIndices = [...Array(9).keys()].sort(() => Math.random() - 0.5)
        setAvailablePieces(shuffledIndices)
      }
    }
  }, [isOpen, currentStage])

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === currentQuestion.answer
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct) {
      setScore(prev => prev + 1)
      
      // Show piece collected modal
      const config = puzzleConfig[currentStage]
      if (config && availablePieces.length > collectedPieces) {
        const pieceIndex = availablePieces[collectedPieces]
        const pieceName = config.pieces[pieceIndex]
        const pieceImage = `/${config.folder}/${pieceName}`
        
        setCurrentPiece({
          image: pieceImage,
          number: collectedPieces + 1
        })
        setShowPieceCollected(true)
      }
      
      setCollectedPieces(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      // Quiz completed - check if all 9 pieces collected
      if (collectedPieces === 9) {
        onQuizComplete()
        onClose()
      } else {
        setNotificationData({
          type: 'warning',
          title: 'Chưa đủ mảnh ghép!',
          message: `Bạn chỉ thu thập được ${collectedPieces}/9 mảnh ghép. Cần đủ 9 mảnh để giải puzzle!`,
          currentStage: currentStage,
          showRetry: true
        })
        setShowNotification(true)
      }
    }
  }

  const handleClose = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setShowNotification(false)
    onClose()
  }

  const handleNotificationConfirm = () => {
    setShowNotification(false)
  }

  const handleRetryQuiz = () => {
    setShowNotification(false)
    // Reset quiz to beginning
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setScore(0)
    setCollectedPieces(0)
    
    // Reshuffle pieces for new attempt
    const config = puzzleConfig[currentStage]
    if (config) {
      const shuffledIndices = [...Array(9).keys()].sort(() => Math.random() - 0.5)
      setAvailablePieces(shuffledIndices)
    }
  }

  if (!isOpen || !currentQuestion) return null

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  return (
    <>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        onConfirm={handleNotificationConfirm}
        onRetry={handleRetryQuiz}
        {...notificationData}
      />

      {/* Piece Collected Modal */}
      {currentPiece && (
        <PieceCollectedModal
          isOpen={showPieceCollected}
          onClose={() => setShowPieceCollected(false)}
          pieceImage={currentPiece.image}
          pieceNumber={currentPiece.number}
          currentStage={currentStage}
        />
      )}

      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">📚 Câu hỏi giai đoạn {currentStage.replace('Stage ', '')}</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <span className="text-white text-lg font-bold">×</span>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Câu {currentQuestionIndex + 1}/{questions.length}</span>
            <span>🧩 Mảnh ghép: {collectedPieces}/9</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Question */}
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Câu {currentQuestion.questionNumber}: {currentQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswerSelect(key)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedAnswer === key
                      ? showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50 text-blue-800'
                      : showResult && key === currentQuestion.answer
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                      selectedAnswer === key
                        ? showResult
                          ? isCorrect
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                        : showResult && key === currentQuestion.answer
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {key}
                    </span>
                    <span className="text-sm">{value}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Result */}
            {showResult && (
              <div className={`p-4 rounded-lg border-l-4 ${
                isCorrect 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}>
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="font-semibold">
                    {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                  </span>
                </div>
                {currentQuestion.explanation && (
                  <p className="text-sm opacity-90">
                    <strong>Giải thích:</strong> {currentQuestion.explanation}
                  </p>
                )}
                <p className="text-sm mt-2">
                  <strong>Đáp án đúng:</strong> {currentQuestion.answer}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {isLastQuestion ? 'Hoàn thành quiz!' : `Còn ${questions.length - currentQuestionIndex - 1} câu`}
          </div>
          
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                Trả lời
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold"
              >
                {isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default QuizModal
