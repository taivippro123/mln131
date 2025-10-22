import { useEffect, useRef, useState } from 'react'
import roadmapData from '/roadmap.json'
import Flag from './components/Flag'
import Checkpoints from './components/Checkpoints'
import IntroModal from './components/IntroModal'
import QuizModal from './components/QuizModal'
import PuzzleModal from './components/PuzzleModal'
import FinalCompletionModal from './components/FinalCompletionModal'

const TILE_SIZE = 64
const MAP_WIDTH = roadmapData.width
const MAP_HEIGHT = roadmapData.height

export default function App() {
  const canvasRef = useRef(null)
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const [isFlagAnimating, setIsFlagAnimating] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showCheckpoints, setShowCheckpoints] = useState(true)
  const [currentFlagPosition, setCurrentFlagPosition] = useState(0)
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [showIntroModal, setShowIntroModal] = useState(true)
  const [showQuizModal, setShowQuizModal] = useState(false)
  const [showPuzzleModal, setShowPuzzleModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [currentStage, setCurrentStage] = useState('')
  const [completedCheckpoints, setCompletedCheckpoints] = useState([])
  const tilesRef = useRef({})

  // Load tiles
  useEffect(() => {
    // Get unique tile IDs from ALL layers
    const allTiles = new Set()
    roadmapData.layers.forEach(layer => {
      layer.data.forEach(tile => {
        if (tile > 0) allTiles.add(tile)
      })
    })
    const tilesToLoad = [...allTiles]
    
    const loadPromises = tilesToLoad.map(tileNum => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          // Just store the original image - PNG alpha will be preserved
          tilesRef.current[tileNum] = img
          resolve()
        }
        img.onerror = () => resolve()
        // IMPORTANT: Set crossOrigin before src to preserve alpha
        img.crossOrigin = 'anonymous'
        img.src = `/tiles/mapTile_${String(tileNum).padStart(3, '0')}.png`
      })
    })

    Promise.all(loadPromises).then(() => {
      setTilesLoaded(true)
    })
  }, [])

  // Draw map
  useEffect(() => {
    if (!tilesLoaded || !canvasRef.current) return

    const canvas = canvasRef.current
    // Enable alpha channel and disable image smoothing for pixel-perfect rendering
    const ctx = canvas.getContext('2d', { 
      alpha: true,
      willReadFrequently: false 
    })
    
    // Disable smoothing for crisp pixel art
    ctx.imageSmoothingEnabled = false
    
    // Set composite operation to properly handle transparency
    ctx.globalCompositeOperation = 'source-over'
    
    // Clear canvas to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw ALL layers from roadmap.json in order (bottom to top)
    roadmapData.layers.forEach((layer, layerIndex) => {
      const mapData = layer.data
      
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          const index = y * MAP_WIDTH + x
          const tileNum = mapData[index]
          
          if (tileNum && tileNum > 0) {
            const img = tilesRef.current[tileNum]
            if (img) {
              // Draw tile - alpha channel will be respected
              ctx.save()
              ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
              ctx.restore()
            }
          }
        }
      }
    })
  }, [tilesLoaded])


  const handleAnimationComplete = () => {
    setIsFlagAnimating(false)
    setCurrentCheckpoint(prev => {
      const newCheckpoint = prev + 1
      console.log('Animation completed! Moving to checkpoint', newCheckpoint)
      return newCheckpoint
    })
    
    if (currentCheckpoint >= 4) {
      setAnimationComplete(true)
    }
  }

  const handleFlagPositionUpdate = (position) => {
    setCurrentFlagPosition(position)
  }

  const getCheckpointPosition = (checkpointIndex) => {
    const checkpointPositions = [
      { x: 416, y: 544 }, // Checkpoint 1
      { x: 864, y: 544 }, // Checkpoint 2  
      { x: 1120, y: 288 }, // Checkpoint 3
      { x: 1120, y: 672 }, // Checkpoint 4
      { x: 1504, y: 672 }  // Checkpoint 5
    ]
    return checkpointPositions[checkpointIndex] || checkpointPositions[0]
  }

  const getStaticFlagImage = (checkpointIndex) => {
    if (checkpointIndex === 1) {
      // At checkpoint 2: Show mtdtgpmnvn.png
      return "/mtdtgpmnvn.png"
    } else if (checkpointIndex >= 2) {
      // At checkpoint 3 and beyond: Show quockyvietnam.jpg
      return "/quockyvietnam.jpg"
    } else {
      // At checkpoint 1: Show quockyvietnam.jpg
      return "/quockyvietnam.jpg"
    }
  }

  const handleNextCheckpoint = () => {
    if (currentCheckpoint >= 4) return // Already at last checkpoint
    
    // Show quiz for current checkpoint (not next one)
    const stageMap = {
      0: 'Stage 1',
      1: 'Stage 2', 
      2: 'Stage 3',
      3: 'Stage 4',
      4: 'Stage 5'
    }
    
    setCurrentStage(stageMap[currentCheckpoint])
    setShowQuizModal(true)
  }

  const handleStartQuiz = (checkpointId, checkpointIndex) => {
    console.log('Starting quiz for checkpoint:', checkpointIndex) // Debug log
    const stageMap = {
      0: 'Stage 1',
      1: 'Stage 2', 
      2: 'Stage 3',
      3: 'Stage 4',
      4: 'Stage 5'
    }
    
    setCurrentStage(stageMap[checkpointIndex])
    setShowQuizModal(true)
  }

  const handleStopAnimation = () => {
    setIsFlagAnimating(false)
  }

  const handleResetJourney = () => {
    setCurrentCheckpoint(0)
    setCurrentFlagPosition(0)
    setIsFlagAnimating(false)
    setAnimationComplete(false)
    setAnimationKey(prev => prev + 1)
  }

  const handleQuizComplete = () => {
    setShowQuizModal(false)
    setShowPuzzleModal(true)
  }

  const handlePuzzleComplete = (success) => {
    setShowPuzzleModal(false)
    
    if (success) {
      console.log('Puzzle completed! Moving from checkpoint', currentCheckpoint, 'to', currentCheckpoint + 1)
      // Mark current checkpoint as completed
      setCompletedCheckpoints(prev => [...prev, currentCheckpoint])
      
      // Check if this is the last checkpoint (Stage 5 completed)
      if (currentCheckpoint === 4) {
        // Show final completion modal
        setShowFinalModal(true)
      } else {
        // Start flag animation to next checkpoint
        setIsFlagAnimating(true)
        setAnimationComplete(false)
        setCurrentFlagPosition(0)
        setAnimationKey(prev => prev + 1)
      }
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative">
      {/* Intro Modal */}
      <IntroModal 
        isOpen={showIntroModal} 
        onClose={() => setShowIntroModal(false)} 
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        currentStage={currentStage}
        onQuizComplete={handleQuizComplete}
      />

      {/* Puzzle Modal */}
      <PuzzleModal
        isOpen={showPuzzleModal}
        onClose={() => setShowPuzzleModal(false)}
        currentStage={currentStage}
        onPuzzleComplete={handlePuzzleComplete}
      />

      {/* Final Completion Modal */}
      <FinalCompletionModal
        isOpen={showFinalModal}
        onClose={() => setShowFinalModal(false)}
      />

      {!tilesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-gray-800 text-2xl">Loading...</p>
        </div>
      )}
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          style={{ background: 'transparent', display: 'block' }}
        />
        
        {/* Checkpoints */}
        <Checkpoints 
          currentPosition={currentFlagPosition}
          completedCheckpoints={completedCheckpoints}
          onStartQuiz={handleStartQuiz}
        />
        
        {/* Flag Animation */}
        <Flag 
          key={animationKey}
          isAnimating={isFlagAnimating}
          onAnimationComplete={handleAnimationComplete}
          onPositionUpdate={handleFlagPositionUpdate}
          currentCheckpoint={currentCheckpoint}
        />

        {/* Vietnam Flag - Moves with current checkpoint */}
        {!isFlagAnimating && (
          <div 
            className="absolute pointer-events-none z-30 transition-all duration-500"
            style={{
              left: `${getCheckpointPosition(currentCheckpoint).x - 24}px`,
              top: `${getCheckpointPosition(currentCheckpoint).y + 30}px`,
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
            }}
          >
            <img
              src={getStaticFlagImage(currentCheckpoint)}
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
      </div>
    </div>
  )
}
