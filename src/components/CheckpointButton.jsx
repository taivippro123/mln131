import { useState } from 'react'

const CheckpointButton = ({ 
  checkpoint, 
  index, 
  isUnlocked, 
  isCompleted, 
  onStartQuiz 
}) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Checkpoint clicked:', index, 'isUnlocked:', isUnlocked, 'isCompleted:', isCompleted) // Debug log
   
    if (isUnlocked && !isCompleted) {
      onStartQuiz(checkpoint.id, index)
    }
  }

  const getCheckpointStyle = () => {
    if (isCompleted) {
      return 'bg-green-500/20 border-green-600/30 shadow-green-200 cursor-default'
    } else if (isUnlocked) {
      return 'bg-blue-500/20 border-blue-600/30 shadow-blue-200 cursor-pointer hover:bg-blue-500/30 hover:scale-110'
    } else {
      return 'bg-gray-400/20 border-gray-500/30 shadow-gray-200 cursor-not-allowed'
    }
  }

  const getIcon = () => {
    if (isCompleted) {
      return '✅'
    } else if (isUnlocked) {
      return '📚'
    } else {
      return '🔒'
    }
  }

  return (
    <div className="absolute pointer-events-auto z-50">
      {/* Clickable Checkpoint marker - Completely invisible */}
      <div 
        onClick={handleClick}
        style={{ 
          width: '48px',
          height: '48px',
          cursor: isUnlocked && !isCompleted ? 'pointer' : 'default',
          backgroundColor: 'transparent',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 50
        }}
        title={
          isCompleted ? 'Đã hoàn thành' : 
          isUnlocked ? 'Nhấn để bắt đầu quiz' : 
          'Chưa mở khóa'
        }
      />

      {/* Vietnam Flag below Checkpoint 1 - Always visible */}
      {index === 0 && (
        <div 
          className="absolute top-16 left-1/2 transform -translate-x-1/2 pointer-events-none z-50"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
          }}
        >
          <img
            src="/quockyvietnam.jpg"
            alt="Vietnam Flag"
            width="48"
            height="48"
            className="rounded-lg border-2 border-white/50"
            style={{
              objectFit: 'cover',
              imageRendering: 'pixelated'
            }}
          />
        </div>
      )}

      {/* Checkpoint label - Hidden */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none" style={{ display: 'none' }}>
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
          {checkpoint.label}
        </div>
      </div>

      {/* Pulse effect for unlocked checkpoints - Hidden */}
      {isUnlocked && !isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: 'none' }}>
          <div className="w-14 h-14 rounded-full border-2 animate-ping opacity-30 border-blue-400"></div>
        </div>
      )}
    </div>
  )
}

export default CheckpointButton
