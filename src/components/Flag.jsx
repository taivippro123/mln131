import { useEffect, useRef, useState, useCallback } from 'react'

const TILE_SIZE = 64

// Checkpoint data từ Layer 5 của roadmap.json
const CHECKPOINTS = [
  {"id":131, "row":8, "col":6, "pixel_center":[416,544]},
  {"id":132, "row":8, "col":12, "pixel_center":[864,544]},
  {"id":133, "row":4, "col":17, "pixel_center":[1120,288]},
  {"id":134, "row":10, "col":17, "pixel_center":[1120,672]},
  {"id":135, "row":10, "col":23, "pixel_center":[1504,672]}
]

// Path segments between checkpoints
const PATH_SEGMENTS = {
  "0-1": [ // 131 → 132
    {"row":8,"col":6,"pixel_center":[416,544]},
    {"row":7,"col":6,"pixel_center":[416,480]},
    {"row":6,"col":6,"pixel_center":[416,416]},
    {"row":5,"col":6,"pixel_center":[416,352]},
    {"row":5,"col":7,"pixel_center":[480,352]},
    {"row":5,"col":8,"pixel_center":[544,352]},
    {"row":5,"col":9,"pixel_center":[608,352]},
    {"row":5,"col":10,"pixel_center":[672,352]},
    {"row":5,"col":11,"pixel_center":[736,352]},
    {"row":8,"col":11,"pixel_center":[736,544]},
    {"row":8,"col":12,"pixel_center":[800,544]},
    {"row":8,"col":13,"pixel_center":[864,544]} // Thêm 1 ô để đến vị trí mới
  ],
  "1-2": [ // 132 → 133
    {"row":8,"col":13,"pixel_center":[864,544]}, // Bắt đầu từ vị trí mới của Checkpoint 1
    {"row":8,"col":14,"pixel_center":[928,544]},
    {"row":8,"col":15,"pixel_center":[992,544]},
    {"row":8,"col":16,"pixel_center":[1056,544]},
    {"row":8,"col":17,"pixel_center":[1120,544]},
    {"row":7,"col":17,"pixel_center":[1120,480]},
    {"row":6,"col":17,"pixel_center":[1120,416]},
    {"row":5,"col":17,"pixel_center":[1120,352]},
    {"row":4,"col":17,"pixel_center":[1120,288]}
  ],
  "2-3": [ // 133 → 134
    {"row":4,"col":17,"pixel_center":[1120,288]},
    {"row":5,"col":17,"pixel_center":[1120,352]},
    {"row":6,"col":17,"pixel_center":[1120,416]},
    {"row":7,"col":17,"pixel_center":[1120,480]},
    {"row":8,"col":17,"pixel_center":[1120,544]},
    {"row":9,"col":17,"pixel_center":[1120,608]},
    {"row":10,"col":17,"pixel_center":[1120,672]}
  ],
  "3-4": [ // 134 → 135
    {"row":10,"col":17,"pixel_center":[1120,672]},
    {"row":10,"col":18,"pixel_center":[1184,672]},
    {"row":10,"col":19,"pixel_center":[1248,672]},
    {"row":10,"col":20,"pixel_center":[1312,672]},
    {"row":10,"col":21,"pixel_center":[1376,672]},
    {"row":10,"col":22,"pixel_center":[1440,672]},
    {"row":10,"col":23,"pixel_center":[1504,672]}
  ]
}

export default function Flag({ isAnimating, onAnimationComplete, onPositionUpdate, currentCheckpoint }) {
  const flagRef = useRef(null)
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const intervalRef = useRef(null)
  const onPositionUpdateRef = useRef(onPositionUpdate)
  const onAnimationCompleteRef = useRef(onAnimationComplete)

  // Update refs when props change
  useEffect(() => {
    onPositionUpdateRef.current = onPositionUpdate
  }, [onPositionUpdate])

  useEffect(() => {
    onAnimationCompleteRef.current = onAnimationComplete
  }, [onAnimationComplete])

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (!isAnimating) {
      setCurrentPosition(0)
      setIsVisible(false)
      return
    }

    // Get path segment for current checkpoint
    const pathKey = `${currentCheckpoint}-${currentCheckpoint + 1}`
    const pathTiles = PATH_SEGMENTS[pathKey]
    
    console.log(`Looking for path segment: ${pathKey}`)
    console.log(`Available path segments:`, Object.keys(PATH_SEGMENTS))
    console.log(`Found path tiles:`, pathTiles)
    
    if (!pathTiles) {
      console.log(`No path found for segment ${pathKey}`)
      return
    }

    setIsVisible(true)
    setCurrentPosition(1) // Start from position 1
    let position = 1
    const totalSteps = pathTiles.length
    const stepDuration = 250 // milliseconds per step

    console.log(`Starting animation to checkpoint ${currentCheckpoint + 1}: ${totalSteps} total steps`)

    intervalRef.current = setInterval(() => {
      position++
      setCurrentPosition(position)
      
      console.log(`Flag position: ${position}/${totalSteps}`) // Debug log
      
      // Notify parent component of position update
      if (onPositionUpdateRef.current) {
        onPositionUpdateRef.current(position)
      }
      
      if (position > totalSteps) { // Stop when we exceed the end
        console.log('Animation to checkpoint completed!') // Debug log
        clearInterval(intervalRef.current)
        intervalRef.current = null
        // Keep flag visible for a moment at the end
        setTimeout(() => {
          setIsVisible(false)
          if (onAnimationCompleteRef.current) {
            onAnimationCompleteRef.current()
          }
        }, 500)
      }
    }, stepDuration)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAnimating, currentCheckpoint]) // Depend on both isAnimating and currentCheckpoint

  // Get current path segment
  const pathKey = `${currentCheckpoint}-${currentCheckpoint + 1}`
  const pathTiles = PATH_SEGMENTS[pathKey]
  
  if (!isVisible || !pathTiles || currentPosition < 1 || currentPosition > pathTiles.length) {
    return null
  }

  const currentTile = pathTiles[currentPosition - 1] // Convert to 0-based index
  if (!currentTile) {
    console.log(`No tile found for position ${currentPosition}`)
    return null
  }
  const [x, y] = currentTile.pixel_center

  // Determine which flag to show based on animation stage
  const getFlagImage = () => {
    if (currentCheckpoint === 0) {
      // Stage 1 → 2: Show mtdtgpmnvn.png
      return "/mtdtgpmnvn.png"
    } else if (currentCheckpoint === 1) {
      // Stage 2 → 3: Still show mtdtgpmnvn.png during animation
      return "/mtdtgpmnvn.png"
    } else {
      // Other stages: Default to quockyvietnam.jpg
      return "/quockyvietnam.jpg"
    }
  }

  return (
    <div
      ref={flagRef}
      className="absolute pointer-events-none z-30 transition-all duration-200 ease-out"
      style={{
        left: `${x - 16}px`, // Offset để center flag
        top: `${y - 24}px`,  // Offset để center flag
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Flag Image with enhanced styling */}
      <img
        src={getFlagImage()}
        alt="Vietnam Flag"
        width="32"
        height="32"
        className="drop-shadow-lg filter drop-shadow-md rounded-sm"
        style={{
          objectFit: 'cover',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Enhanced trail effects */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping opacity-30"></div>
        <div className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
      </div>
      
    </div>
  )
}
