import { useState, useEffect } from 'react'

const IntroModal = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md mx-4 transform transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-2xl p-6 text-white relative">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <span className="text-white text-lg font-bold">×</span>
          </button>
          
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-2xl font-bold">Chào mừng đến với</h2>
          </div>
          <h1 className="text-3xl font-bold text-center">Game Thời Kỳ Quá Độ</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 text-gray-700">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-3">
                🎯 Mục tiêu của game
              </p>
              <p className="text-base leading-relaxed">
                Đây là game về thời kỳ quá độ lên <span className="font-bold text-blue-600">Chủ nghĩa Xã hội</span> ở Việt Nam
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <p className="text-base font-semibold text-blue-800 mb-2 flex items-center">
                🧩 Cách chơi
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Trả lời đúng các câu hỏi để nhận ảnh ghép</li>
                <li>• Xếp hình để đi qua các giai đoạn</li>
                <li>• Hoàn thành hành trình từ điểm 1 đến điểm 5</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <p className="text-base font-semibold text-green-800 mb-2 flex items-center">
                🗺️ Hành trình
              </p>
              <p className="text-sm text-green-700">
                Bạn sẽ đi qua 5 checkpoint quan trọng trong quá trình phát triển của Việt Nam
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Bắt đầu ngay
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
      </div>
    </div>
  )
}

export default IntroModal
