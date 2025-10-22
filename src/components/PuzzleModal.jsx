import { useState, useEffect } from 'react'
import NotificationModal from './NotificationModal'

const PuzzleModal = ({ isOpen, onClose, currentStage, onPuzzleComplete }) => {
  const [pieces, setPieces] = useState([])
  const [board, setBoard] = useState(Array(9).fill(null))
  const [selectedPiece, setSelectedPiece] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState({})

  // Puzzle configuration for each stage
  const puzzleConfig = {
    'Stage 1': {
      folder: 'stage1',
      fullImage: 'giaidoan1.jpg',
      aspectRatio: '904/1024', // 904x1024 - Portrait
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
      fullImage: 'giaidoan2.jpg',
      aspectRatio: '1024/683', // 1024x683 - Landscape
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
      fullImage: 'giaidoan3.png',
      aspectRatio: '1483/844', // 1483x844 - Landscape
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
      fullImage: 'giaidoan4.png',
      aspectRatio: '1432/700', // 1432x700 - Landscape
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
      fullImage: 'giaidoan5.png',
      aspectRatio: '1027/1025', // 1027x1025 - Square
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
      const config = puzzleConfig[currentStage]
      if (config) {
        // Shuffle pieces
        const shuffledPieces = [...config.pieces].sort(() => Math.random() - 0.5)
      setPieces(shuffledPieces)
      setBoard(Array(9).fill(null))
      setSelectedPiece(null)
      setShowNotification(false)
      }
    }
  }, [isOpen, currentStage])

  const handlePieceClick = (piece, index) => {
    if (selectedPiece === null) {
      setSelectedPiece({ piece, index })
    }
  }

  const handleBoardClick = (position) => {
    if (selectedPiece !== null && board[position] === null) {
      const newBoard = [...board]
      newBoard[position] = selectedPiece.piece
      setBoard(newBoard)
      
      // Remove piece from available pieces
      const newPieces = pieces.filter((_, i) => i !== selectedPiece.index)
      setPieces(newPieces)
      setSelectedPiece(null)
      
      // Check if puzzle is complete
      checkPuzzleComplete(newBoard)
    }
  }

  const handleBoardPieceClick = (position) => {
    if (board[position] !== null) {
      // Move piece back to available pieces
      const piece = board[position]
      const newBoard = [...board]
      newBoard[position] = null
      setBoard(newBoard)
      setPieces([...pieces, piece])
    }
  }

  const checkPuzzleComplete = (currentBoard) => {
    const config = puzzleConfig[currentStage]
    if (!config) return

    // Check if all positions are filled
    if (currentBoard.every(cell => cell !== null)) {
      // Check if pieces are in correct order
      const isCorrect = currentBoard.every((piece, index) => piece === config.pieces[index])
      
      if (isCorrect) {
        setTimeout(() => {
        setNotificationData({
          type: 'success',
          title: 'Chúc mừng!',
          message: 'Bạn đã hoàn thành puzzle!',
          fullImage: `/${config.folder}/${config.fullImage}`,
          currentStage: currentStage,
          showNext: true
        })
          setShowNotification(true)
        }, 500)
      } else {
        setTimeout(() => {
          setNotificationData({
            type: 'error',
            title: 'Sai rồi!',
            message: 'Hãy thử lại và ghép đúng thứ tự.'
          })
          setShowNotification(true)
        }, 500)
      }
    }
  }

  const handleReset = () => {
    const config = puzzleConfig[currentStage]
    if (config) {
      setPieces([...config.pieces].sort(() => Math.random() - 0.5))
      setBoard(Array(9).fill(null))
      setSelectedPiece(null)
    }
  }

  const handleNotificationConfirm = () => {
    if (notificationData.type === 'success') {
      onPuzzleComplete(true)
    } else {
      // Reset board for error case
      const config = puzzleConfig[currentStage]
      if (config) {
        setPieces([...config.pieces].sort(() => Math.random() - 0.5))
        setBoard(Array(9).fill(null))
        setSelectedPiece(null)
      }
    }
  }

  const handleNextStage = () => {
    onPuzzleComplete(true)
  }

  if (!isOpen || !currentStage) return null

  const config = puzzleConfig[currentStage]
  if (!config) return null

  return (
    <>
      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        onConfirm={handleNotificationConfirm}
        onNext={handleNextStage}
        {...notificationData}
      />

      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">🧩 Giải Puzzle {currentStage}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <span className="text-white text-lg font-bold">×</span>
            </button>
          </div>
          <p className="mt-2 text-sm">Ghép 9 mảnh hình đúng vị trí để tiếp tục!</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Puzzle Board */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">Bảng ghép hình (3x3)</h3>
              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-4 rounded-lg">
                {board.map((piece, index) => (
                  <div
                    key={index}
                    onClick={() => handleBoardClick(index)}
                    className={`border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      piece === null
                        ? 'border-dashed border-gray-400 bg-white hover:bg-gray-50'
                        : 'border-solid border-green-500 bg-white hover:shadow-lg'
                    }`}
                    style={{ aspectRatio: config.aspectRatio }}
                  >
                    {piece ? (
                      <img
                        src={`/${config.folder}/${piece}`}
                        alt={`Piece ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBoardPieceClick(index)
                        }}
                      />
                    ) : (
                      <span className="text-4xl text-gray-300">{index + 1}</span>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Reset Button */}
              <div className="mt-4">
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
                >
                  🔄 Làm lại
                </button>
              </div>
            </div>

            {/* Available Pieces */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center">
                Mảnh ghép ({pieces.length} còn lại)
              </h3>
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                {pieces.map((piece, index) => (
                  <div
                    key={index}
                    onClick={() => handlePieceClick(piece, index)}
                    className={`border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPiece?.index === index
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-300 hover:border-blue-400 hover:shadow-md'
                    }`}
                    style={{ aspectRatio: config.aspectRatio }}
                  >
                    <img
                      src={`/${config.folder}/${piece}`}
                      alt={`Available piece ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-sm text-gray-600 text-center">
            💡 Mẹo: Click vào mảnh ghép, sau đó click vào ô trống để đặt mảnh vào đó
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

export default PuzzleModal

