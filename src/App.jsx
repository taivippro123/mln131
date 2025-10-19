import { useEffect, useRef, useState } from 'react'
import roadmapData from '/roadmap.json'
import Flag from './components/Flag'
import Checkpoints from './components/Checkpoints'

const TILE_SIZE = 64
const MAP_WIDTH = roadmapData.width
const MAP_HEIGHT = roadmapData.height

export default function App() {
  const canvasRef = useRef(null)
  const [tilesLoaded, setTilesLoaded] = useState(false)
  const [isFlagAnimating, setIsFlagAnimating] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [showCheckpoints, setShowCheckpoints] = useState(false)
  const [currentFlagPosition, setCurrentFlagPosition] = useState(0)
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
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

  const handleNextCheckpoint = () => {
    if (currentCheckpoint >= 4) return // Already at last checkpoint
    
    setIsFlagAnimating(true)
    setAnimationComplete(false)
    setCurrentFlagPosition(0)
    setAnimationKey(prev => prev + 1) // Force re-render
  }

  const handleStopAnimation = () => {
    setIsFlagAnimating(false)
  }

  const handleAnimationComplete = () => {
    setIsFlagAnimating(false)
    setCurrentCheckpoint(prev => prev + 1)
    
    if (currentCheckpoint >= 4) {
      setAnimationComplete(true)
    }
  }

  const handleFlagPositionUpdate = (position) => {
    setCurrentFlagPosition(position)
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center relative">
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
          showCheckpoints={showCheckpoints}
          currentPosition={currentFlagPosition}
        />
        
        {/* Flag Animation */}
        <Flag 
          key={animationKey}
          isAnimating={isFlagAnimating}
          onAnimationComplete={handleAnimationComplete}
          onPositionUpdate={handleFlagPositionUpdate}
          currentCheckpoint={currentCheckpoint}
        />
      </div>

      {/* Compact Controls */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
          <h3 className="text-sm font-bold mb-2 text-gray-800 flex items-center">
            🚩 Flag Journey
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={handleNextCheckpoint}
              disabled={!tilesLoaded || isFlagAnimating || currentCheckpoint >= 4}
              className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              {isFlagAnimating ? '🚀 Moving...' : `Next Checkpoint (${currentCheckpoint + 1}/5)`}
            </button>
            
            <button
              onClick={handleStopAnimation}
              disabled={!isFlagAnimating}
              className="w-full px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
            >
              ⏹️ Stop
            </button>

            <button
              onClick={() => setShowCheckpoints(!showCheckpoints)}
              className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium"
            >
              {showCheckpoints ? '🙈 Hide' : '📍 Show'} Checkpoints
            </button>
          </div>

          {animationComplete && (
            <div className="mt-2 p-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded text-xs font-medium border border-green-300">
              🎉 Journey completed!
            </div>
          )}

          <div className="mt-2 text-xs text-gray-600">
            <p>Path: 131 → 132 → 133 → 134 → 135</p>
            <p>Current: {currentCheckpoint + 1}/5</p>
          </div>
        </div>
      </div>
    </div>
  )
}
