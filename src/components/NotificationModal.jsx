import { useEffect, useState } from 'react'

const NotificationModal = ({ isOpen, onClose, type, title, message, onConfirm, onRetry, onNext, fullImage, currentStage, showRetry = false, showNext = false }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleConfirm = () => {
    setIsVisible(false)
    setTimeout(() => {
      onConfirm && onConfirm()
      onClose()
    }, 300)
  }

  const handleRetry = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRetry && onRetry()
      onClose()
    }, 300)
  }

  const handleNext = () => {
    setIsVisible(false)
    setTimeout(() => {
      onNext && onNext()
      onClose()
    }, 300)
  }

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: '🎉',
          bgColor: 'from-green-50 to-emerald-50',
          textColor: 'from-green-600 to-emerald-600',
          buttonColor: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
        }
      case 'error':
        return {
          icon: '❌',
          bgColor: 'from-red-50 to-pink-50',
          textColor: 'from-red-600 to-pink-600',
          buttonColor: 'from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
        }
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'from-yellow-50 to-orange-50',
          textColor: 'from-yellow-600 to-orange-600',
          buttonColor: 'from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
        }
      default:
        return {
          icon: 'ℹ️',
          bgColor: 'from-blue-50 to-indigo-50',
          textColor: 'from-blue-600 to-indigo-600',
          buttonColor: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
        }
    }
  }

  if (!isOpen) return null

  const { icon, bgColor, textColor, buttonColor } = getIconAndColor()

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className={`relative bg-gradient-to-br ${bgColor} rounded-2xl shadow-2xl p-8 mx-4 max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
      }`}>
        {/* Header - Celebration */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">{icon}</div>
          <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${textColor} mb-2`}>
            {title}
          </h2>
          <p className="text-gray-700 font-medium">
            {message}
          </p>
          {currentStage && (
            <p className="text-sm text-gray-500 mt-2">
              {currentStage}
            </p>
          )}
        </div>

        {/* Full Image Display */}
        {fullImage && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-center mb-4 text-gray-800">
              Hình ảnh hoàn chỉnh
            </h3>
            <div className="relative bg-white p-4 rounded-lg shadow-lg border-4 border-yellow-400">
              <img
                src={fullImage}
                alt="Completed Puzzle"
                className="w-full h-auto max-h-[400px] object-contain rounded-lg"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur-xl opacity-30 -z-10"></div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="flex-1 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Làm lại
            </button>
          )}
          {showNext && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              Tiếp theo
            </button>
          )}
          {!showRetry && !showNext && (
            <button
              onClick={handleConfirm}
              className={`w-full py-3 bg-gradient-to-r ${buttonColor} text-white font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95`}
            >
              Xác nhận
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 text-2xl opacity-20">✨</div>
        <div className="absolute top-4 right-4 text-2xl opacity-20">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl opacity-20">🌟</div>
        <div className="absolute bottom-4 right-4 text-2xl opacity-20">🌟</div>
      </div>
    </div>
  )
}

export default NotificationModal
