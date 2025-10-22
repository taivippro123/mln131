import { useEffect, useState } from 'react'

const PieceCollectedModal = ({ isOpen, onClose, pieceImage, pieceNumber, currentStage }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleCollect = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={`relative bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-2xl p-8 mx-4 max-w-md transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        {/* Celebration Effect */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-2">
            Chúc mừng!
          </h2>
          <p className="text-gray-700 font-semibold">
            Bạn đã nhận được mảnh ghép #{pieceNumber}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {currentStage}
          </p>
        </div>

        {/* Piece Image */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur-xl opacity-50 animate-pulse"></div>
            
            {/* Image */}
            <div className="relative bg-white p-3 rounded-lg shadow-xl border-4 border-yellow-400">
              <img
                src={pieceImage}
                alt={`Piece ${pieceNumber}`}
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="bg-white/80 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
            <span className="text-2xl">🧩</span>
            <span className="font-medium">
              Thu thập đủ 9 mảnh để giải puzzle!
            </span>
          </div>
        </div>

        {/* Collect Button */}
        <button
          onClick={handleCollect}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Thu thập
        </button>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-2xl opacity-20">🌟</div>
        <div className="absolute top-4 right-4 text-2xl opacity-20">🌟</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-20">✨</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-20">✨</div>
      </div>
    </div>
  )
}

export default PieceCollectedModal

