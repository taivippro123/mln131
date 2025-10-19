import { useEffect, useState } from 'react'

const TILE_SIZE = 64

// Checkpoint data từ Layer 5 của roadmap.json
const CHECKPOINTS = [
  {"id":131, "layer":"Tile Layer 5", "row":8, "col":6, "pixel_center":[416,544], "label":"Start"},
  {"id":132, "layer":"Tile Layer 5", "row":8, "col":12, "pixel_center":[864,544], "label":"Checkpoint 1"}, 
  {"id":133, "layer":"Tile Layer 5", "row":4, "col":17, "pixel_center":[1120,288], "label":"Checkpoint 2"},
  {"id":134, "layer":"Tile Layer 5", "row":10, "col":17, "pixel_center":[1120,672], "label":"Checkpoint 3"},
  {"id":135, "layer":"Tile Layer 5", "row":10, "col":24, "pixel_center":[1568,672], "label":"Finish"}
]

export default function Checkpoints({ showCheckpoints, currentPosition }) {
  const [visibleCheckpoints, setVisibleCheckpoints] = useState(new Set())

  useEffect(() => {
    if (!showCheckpoints) {
      setVisibleCheckpoints(new Set())
      return
    }

    // Show checkpoints with a delay for visual effect
    CHECKPOINTS.forEach((checkpoint, index) => {
      setTimeout(() => {
        setVisibleCheckpoints(prev => new Set([...prev, checkpoint.id]))
      }, index * 200)
    })
  }, [showCheckpoints])

  if (!showCheckpoints) return null

  return (
    <>
      {CHECKPOINTS.map((checkpoint, index) => {
        if (!visibleCheckpoints.has(checkpoint.id)) return null

        const [x, y] = checkpoint.pixel_center
        const isStart = checkpoint.id === 131
        const isFinish = checkpoint.id === 135
        const isCurrent = currentPosition !== undefined && 
          currentPosition >= CHECKPOINTS.findIndex(cp => cp.id === checkpoint.id)

        return (
          <div
            key={checkpoint.id}
            className="absolute pointer-events-none z-40 transition-all duration-500 ease-out"
            style={{
              left: `${x - 20}px`,
              top: `${y - 20}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Checkpoint marker */}
            <div className={`
              w-10 h-10 rounded-full border-4 flex items-center justify-center text-white font-bold text-sm
              transition-all duration-300 transform hover:scale-110
              ${isStart ? 'bg-green-500 border-green-600 shadow-green-200' : 
                isFinish ? 'bg-purple-500 border-purple-600 shadow-purple-200' :
                'bg-blue-500 border-blue-600 shadow-blue-200'}
              ${isCurrent ? 'animate-pulse shadow-lg' : 'shadow-md'}
            `}>
              {isStart ? '🚩' : isFinish ? '🏁' : index}
            </div>

            {/* Checkpoint label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                {checkpoint.label}
              </div>
            </div>

            {/* Connection line to next checkpoint */}
            {checkpoint.id !== 135 && (
              <div className="absolute top-5 left-5 w-0 h-0">
                <div className="w-1 h-8 bg-gradient-to-b from-current to-transparent opacity-50"></div>
              </div>
            )}

            {/* Pulse effect for current checkpoint */}
            {isCurrent && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`
                  w-12 h-12 rounded-full border-2 animate-ping opacity-30
                  ${isStart ? 'border-green-400' : 
                    isFinish ? 'border-purple-400' :
                    'border-blue-400'}
                `}></div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
